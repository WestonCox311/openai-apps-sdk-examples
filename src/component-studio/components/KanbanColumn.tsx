import { Clock, Tag, Edit, Trash2, ChevronDown } from 'lucide-react';
import type { RoadmapFeature } from '../lib/supabase';

interface KanbanColumnProps {
  title: string;
  color: string;
  features: RoadmapFeature[];
  onStatusChange: (id: string, status: RoadmapFeature['status']) => void;
  onDelete: (id: string) => void;
  onEdit: (feature: RoadmapFeature) => void;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export default function KanbanColumn({
  title,
  color,
  features,
  onStatusChange,
  onDelete,
  onEdit,
}: KanbanColumnProps) {
  return (
    <div className="w-80 flex-shrink-0 flex flex-col">
      <div className={`${color} px-4 py-3 rounded-t-lg border-b-2 border-gray-300`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
            {features.length}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-b-lg border border-gray-200 border-t-0 p-3 space-y-3 overflow-y-auto">
        {features.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No features
          </div>
        ) : (
          features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm flex-1 line-clamp-2">
                  {feature.title}
                </h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(feature)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDelete(feature.id)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              </div>

              {feature.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {feature.description}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    priorityColors[feature.priority]
                  }`}
                >
                  {feature.priority}
                </span>
                {feature.category && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {feature.category}
                  </span>
                )}
              </div>

              {feature.estimated_hours > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <Clock className="w-3 h-3" />
                  {feature.estimated_hours}h estimated
                </div>
              )}

              <div className="relative">
                <select
                  value={feature.status}
                  onChange={(e) => onStatusChange(feature.id, e.target.value as any)}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 pr-6 appearance-none cursor-pointer hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
