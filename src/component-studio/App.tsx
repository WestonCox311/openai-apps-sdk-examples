import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Code, Map } from 'lucide-react';
import Browser from './pages/Browser';
import Editor from './pages/Editor';
import Roadmap from './pages/Roadmap';

export default function App() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Browse', icon: LayoutGrid },
    { path: '/editor', label: 'Editor', icon: Code },
    { path: '/roadmap', label: 'Roadmap', icon: Map },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Component Studio</h1>
            </div>

            <nav className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Browser />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:componentId" element={<Editor />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Routes>
      </main>
    </div>
  );
}
