# Component Studio - MVP Guide

## Overview

Component Studio is a visual component library browser and builder built on top of your Apps SDK. It provides a quick and dirty way to browse existing components, create new ones, and track feature development through a kanban board.

## What's Included in the MVP

### 1. Component Browser
- **Grid view** of all SDK components with search functionality
- **Category filtering** to browse by component type
- **Component cards** showing name, description, complexity, and usage stats
- **Detail modal** with comprehensive component information including:
  - Props schema
  - Dependencies
  - File path
  - Complexity score
  - Usage count

### 2. Visual Component Editor
- **Split-pane interface** with code editor on left, preview on right
- **Component metadata form** for name and description
- **Code editor** with syntax highlighting (basic textarea for MVP)
- **Live preview placeholder** (to be implemented in future iterations)
- **Save functionality** to persist components to Supabase database

### 3. Roadmap Kanban Board
- **5-column kanban** (Backlog → To Do → In Progress → Review → Done)
- **Feature cards** with title, description, priority, category, and estimates
- **Drag-free status updates** via dropdown (drag-and-drop in future)
- **Real-time updates** using Supabase subscriptions
- **Add/Edit/Delete** features with modal form
- **Pre-seeded features** showing the full roadmap from our planning session

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Seed the Database

Run the scanner script to populate your database with existing SDK components:

```bash
pnpm run seed
```

This will:
- Scan all components in `src/`
- Extract metadata (props, dependencies, complexity)
- Create categories automatically
- Insert everything into Supabase

### 3. Build the Application

```bash
pnpm run build
```

This builds all SDK components including the new Component Studio.

### 4. Start Development Server

```bash
pnpm run dev
```

Navigate to `http://localhost:4444/component-studio.html` to access the Component Studio.

## Project Structure

```
src/component-studio/
├── index.tsx                 # Entry point
├── App.tsx                   # Main app with routing and navigation
├── lib/
│   └── supabase.ts          # Supabase client and TypeScript types
├── pages/
│   ├── Browser.tsx          # Component browser with grid view
│   ├── Editor.tsx           # Component editor with code + preview
│   └── Roadmap.tsx          # Kanban board for feature tracking
└── components/
    ├── ComponentCard.tsx           # Component grid card
    ├── ComponentDetailModal.tsx    # Component detail popup
    ├── KanbanColumn.tsx            # Kanban column with feature cards
    └── FeatureModal.tsx            # Add/Edit feature form
```

## Database Schema

The MVP uses the following Supabase tables (already created via migrations):

- **components** - Component metadata from SDK
- **component_variants** - Saved component variations with different props
- **categories** - Component categories for filtering
- **tags** - Tags for advanced filtering (not yet used in UI)
- **roadmap_features** - Feature tracking for kanban board

## Features NOT in MVP (Coming Later)

The following features are intentionally excluded from the MVP for speed:

- ❌ Drag-and-drop component builder
- ❌ Live component preview with iframe rendering
- ❌ Authentication/authorization
- ❌ Code generation from visual compositions
- ❌ Advanced code editor (Monaco)
- ❌ Component versioning UI
- ❌ Real-time collaboration
- ❌ Analytics dashboard
- ❌ Design token browser
- ❌ Template library
- ❌ Export/integration tools

All of these features are tracked in the Roadmap page backlog!

## Usage Guide

### Browsing Components

1. Open the Component Studio
2. Use the search bar to filter by name or description
3. Click category buttons to filter by type
4. Click any component card to see detailed information
5. Click "Edit" in the detail modal to modify the component

### Creating New Components

1. Navigate to the "Editor" tab
2. Fill in component name and description
3. Write your React component code in the editor
4. Click "Save Component" to persist to database
5. Component is now available in the browser

### Managing the Roadmap

1. Navigate to the "Roadmap" tab
2. View features organized by status column
3. Click "New Feature" to add a feature
4. Edit features by clicking the edit icon on cards
5. Change status using the dropdown on each card
6. Delete features using the trash icon

## Next Steps for Iteration

To evolve beyond the MVP, consider adding features in this order:

1. **Live Preview** - Implement iframe-based component rendering
2. **Monaco Editor** - Replace textarea with proper code editor
3. **Authentication** - Add user accounts and permissions
4. **Drag-and-Drop Status Changes** - Make kanban board more intuitive
5. **Component Screenshots** - Auto-generate thumbnails for cards
6. **Props Editor** - Visual form for editing component props
7. **Export Tools** - Package components for distribution

## Technical Notes

- Built with React 19, TypeScript, and Tailwind CSS 4
- Uses Supabase for data persistence and real-time updates
- Integrates with existing Vite build pipeline
- All components are responsive and mobile-friendly
- No external state management library (using React hooks)

## Troubleshooting

### "Missing Supabase credentials" error
Make sure your `.env` file contains:
```
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### No components showing in browser
Run `pnpm run seed` to populate the database with existing SDK components.

### Build errors
The project uses pnpm and has some `link:` dependencies for CSS. Make sure you're using pnpm, not npm.

## Contributing

This is an MVP built for speed. The code is intentionally simple and lacks many production features. Feel free to iterate and improve!
