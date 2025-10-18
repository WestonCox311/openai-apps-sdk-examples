import { Component as ComponentIcon, Layers, TrendingUp } from 'lucide-react';
import type { Component } from '../lib/supabase';

interface ComponentCardProps {
  component: Component;
  onClick: () => void;
}

export default function ComponentCard({ component, onClick }: ComponentCardProps) {
  const complexityColors = {
    1: 'bg-green-100 text-green-700',
    2: 'bg-green-100 text-green-700',
    3: 'bg-green-100 text-green-700',
    4: 'bg-yellow-100 text-yellow-700',
    5: 'bg-yellow-100 text-yellow-700',
    6: 'bg-yellow-100 text-yellow-700',
    7: 'bg-orange-100 text-orange-700',
    8: 'bg-orange-100 text-orange-700',
    9: 'bg-red-100 text-red-700',
    10: 'bg-red-100 text-red-700',
  };

  const complexityColor = complexityColors[component.complexity_score as keyof typeof complexityColors] || 'bg-gray-100 text-gray-700';

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all text-left group"
    >
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center border border-gray-100 group-hover:border-blue-200 transition-colors">
        <ComponentIcon className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
        {component.name}
      </h3>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {component.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${complexityColor}`}>
          Complexity: {component.complexity_score}/10
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
          v{component.version}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Layers className="w-3 h-3" />
          {component.dependencies.length} deps
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {component.usage_count} uses
        </div>
      </div>
    </button>
  );
}
