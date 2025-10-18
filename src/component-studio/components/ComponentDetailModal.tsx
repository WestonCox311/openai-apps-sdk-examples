import { X, Edit, Package, Layers, Code2 } from 'lucide-react';
import type { Component } from '../lib/supabase';

interface ComponentDetailModalProps {
  component: Component;
  onClose: () => void;
  onEdit: () => void;
}

export default function ComponentDetailModal({ component, onClose, onEdit }: ComponentDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{component.name}</h2>
            <p className="text-sm text-gray-600 mt-1">Version {component.version}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{component.description}</p>
            </div>

            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Component Preview</p>
                <p className="text-xs text-gray-500 mt-1">Live preview coming soon</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Dependencies</h3>
                </div>
                {component.dependencies.length > 0 ? (
                  <ul className="space-y-1">
                    {component.dependencies.map((dep, i) => (
                      <li key={i} className="text-xs text-gray-700 font-mono">
                        {dep}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">No external dependencies</p>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Props Schema</h3>
                </div>
                {Object.keys(component.props_schema || {}).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(component.props_schema).map(([key, value]: [string, any]) => (
                      <div key={key} className="text-xs">
                        <span className="font-mono text-blue-600">{key}</span>
                        {value.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No props defined</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">File Path</h3>
              <code className="text-xs text-gray-700 font-mono">{component.file_path}</code>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Complexity:</span>{' '}
                <span className="text-gray-900">{component.complexity_score}/10</span>
              </div>
              <div>
                <span className="font-medium">Usage:</span>{' '}
                <span className="text-gray-900">{component.usage_count} times</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>{' '}
                <span className="text-gray-900">
                  {new Date(component.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
