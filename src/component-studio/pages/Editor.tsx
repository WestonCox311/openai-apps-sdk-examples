import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Code2 } from 'lucide-react';
import { supabase, type Component } from '../lib/supabase';

export default function Editor() {
  const { componentId } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState<Component | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (componentId) {
      loadComponent();
    } else {
      setCode(`import React from 'react';

export default function MyComponent() {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">My Component</h2>
      <p className="text-gray-600">Start building your component here...</p>
    </div>
  );
}
`);
    }
  }, [componentId]);

  async function loadComponent() {
    if (!componentId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .eq('id', componentId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setComponent(data);
        setName(data.name);
        setDescription(data.description);
        setCategory(data.category_id);
      }
    } catch (error) {
      console.error('Error loading component:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      alert('Please enter a component name');
      return;
    }

    setSaving(true);
    try {
      if (componentId) {
        const { error } = await supabase
          .from('components')
          .update({
            name: name.trim(),
            description: description.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', componentId);

        if (error) throw error;
        alert('Component updated successfully!');
      } else {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const { data, error } = await supabase
          .from('components')
          .insert({
            name: name.trim(),
            slug,
            description: description.trim(),
            file_path: `src/custom/${slug}/index.tsx`,
            is_published: false,
            version: '1.0.0',
          })
          .select()
          .single();

        if (error) throw error;
        alert('Component created successfully!');
        navigate(`/editor/${data.id}`);
      }
    } catch (error) {
      console.error('Error saving component:', error);
      alert('Error saving component. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {componentId ? 'Edit Component' : 'New Component'}
              </h2>
              <p className="text-sm text-gray-600">
                {componentId ? 'Modify existing component' : 'Create a new component'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Component'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="max-w-2xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Component"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this component does..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Code Editor</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-6 font-mono text-sm resize-none outline-none border-0 focus:ring-0"
              placeholder="// Write your component code here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Live Preview</span>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <div className="bg-white rounded-lg p-8 border border-gray-200 min-h-full">
              <div className="text-center text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium mb-1">Live Preview</p>
                <p className="text-xs text-gray-400">Preview functionality coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
