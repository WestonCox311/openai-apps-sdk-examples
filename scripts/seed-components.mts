import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ComponentMetadata {
  name: string;
  slug: string;
  description: string;
  category: string;
  filePath: string;
  propsSchema: Record<string, any>;
  dependencies: string[];
  complexityScore: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractDependencies(code: string): string[] {
  const importRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"]+)['"]/g;
  const deps = new Set<string>();
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    const importPath = match[1];
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      deps.add(importPath);
    }
  }

  return Array.from(deps);
}

function calculateComplexity(code: string): number {
  const lines = code.split('\n').length;
  const useState = (code.match(/useState/g) || []).length;
  const useEffect = (code.match(/useEffect/g) || []).length;
  const components = (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length;

  return Math.min(10, Math.round((lines / 100) + useState + useEffect + (components * 0.5)));
}

function extractPropsSchema(code: string): Record<string, any> {
  const propsSchema: Record<string, any> = {};

  const interfaceMatch = code.match(/interface\s+\w+Props\s*{([^}]+)}/);
  if (interfaceMatch) {
    const propsContent = interfaceMatch[1];
    const propLines = propsContent.split('\n').filter(line => line.trim());

    propLines.forEach(line => {
      const propMatch = line.match(/(\w+)(\?)?:\s*([^;]+)/);
      if (propMatch) {
        const [, name, optional, type] = propMatch;
        propsSchema[name] = {
          type: type.trim(),
          required: !optional,
          description: ''
        };
      }
    });
  }

  return propsSchema;
}

function getCategoryForPath(filePath: string): string {
  const dirName = path.basename(path.dirname(filePath));

  if (dirName.includes('todo')) return 'Lists & Tasks';
  if (dirName.includes('pizzaz') && dirName.includes('album')) return 'Media & Gallery';
  if (dirName.includes('pizzaz') && dirName.includes('carousel')) return 'Carousels';
  if (dirName.includes('pizzaz') && dirName.includes('list')) return 'Lists & Tasks';
  if (dirName.includes('pizzaz') && !dirName.includes('-')) return 'Maps & Location';
  if (dirName.includes('solar')) return '3D & Visualizations';

  return 'Other';
}

function getDescription(name: string, category: string): string {
  const descriptions: Record<string, string> = {
    'todo': 'Interactive todo list with drag-and-drop reordering, date picker integration, and smooth animations',
    'pizzaz': 'Interactive map component with markers, sidebar navigation, and fullscreen inspector panel',
    'pizzaz-albums': 'Photo album gallery with filmstrip navigation and fullscreen viewer',
    'pizzaz-carousel': 'Horizontal scrolling carousel for displaying place cards with images and ratings',
    'pizzaz-list': 'Vertical list view for displaying pizzaz locations',
    'solar-system': '3D solar system visualization with interactive planet exploration',
  };

  return descriptions[name] || `${name} component from the SDK`;
}

async function scanComponents(): Promise<ComponentMetadata[]> {
  const components: ComponentMetadata[] = [];
  const entries = fg.sync('src/**/index.{tsx,jsx}');

  for (const entry of entries) {
    const dirName = path.basename(path.dirname(entry));
    const fullPath = path.resolve(entry);

    try {
      const code = fs.readFileSync(fullPath, 'utf-8');

      const metadata: ComponentMetadata = {
        name: dirName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        slug: slugify(dirName),
        description: getDescription(dirName, getCategoryForPath(entry)),
        category: getCategoryForPath(entry),
        filePath: entry,
        propsSchema: extractPropsSchema(code),
        dependencies: extractDependencies(code),
        complexityScore: calculateComplexity(code),
      };

      components.push(metadata);
      console.log(`✓ Scanned: ${metadata.name}`);
    } catch (error) {
      console.error(`✗ Error scanning ${entry}:`, error);
    }
  }

  return components;
}

async function ensureCategories(components: ComponentMetadata[]) {
  const uniqueCategories = [...new Set(components.map(c => c.category))];

  for (const categoryName of uniqueCategories) {
    const slug = slugify(categoryName);

    const { error } = await supabase
      .from('categories')
      .upsert({
        name: categoryName,
        slug,
        description: `${categoryName} components`,
        icon: '📦',
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error upserting category ${categoryName}:`, error);
    } else {
      console.log(`✓ Category: ${categoryName}`);
    }
  }
}

async function seedComponents(components: ComponentMetadata[]) {
  for (const component of components) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slugify(component.category))
      .maybeSingle();

    if (!category) {
      console.error(`Category not found for ${component.name}`);
      continue;
    }

    const { error } = await supabase
      .from('components')
      .upsert({
        name: component.name,
        slug: component.slug,
        description: component.description,
        category_id: category.id,
        file_path: component.filePath,
        props_schema: component.propsSchema,
        dependencies: component.dependencies,
        complexity_score: component.complexityScore,
        is_published: true,
        version: '1.0.0',
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error upserting component ${component.name}:`, error);
    } else {
      console.log(`✓ Seeded: ${component.name}`);
    }
  }
}

async function main() {
  console.log('🔍 Scanning components...\n');
  const components = await scanComponents();

  console.log(`\n📊 Found ${components.length} components\n`);
  console.log('📁 Ensuring categories...\n');
  await ensureCategories(components);

  console.log('\n💾 Seeding database...\n');
  await seedComponents(components);

  console.log('\n✅ Done!');
}

main().catch(console.error);
