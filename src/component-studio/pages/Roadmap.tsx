import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase, type RoadmapFeature } from '../lib/supabase';
import KanbanColumn from '../components/KanbanColumn';
import FeatureModal from '../components/FeatureModal';

type Status = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

const columns: { status: Status; title: string; color: string }[] = [
  { status: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
  { status: 'todo', title: 'To Do', color: 'bg-blue-100' },
  { status: 'in_progress', title: 'In Progress', color: 'bg-yellow-100' },
  { status: 'review', title: 'Review', color: 'bg-purple-100' },
  { status: 'done', title: 'Done', color: 'bg-green-100' },
];

export default function Roadmap() {
  const [features, setFeatures] = useState<RoadmapFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<RoadmapFeature | null>(null);

  useEffect(() => {
    loadFeatures();

    const subscription = supabase
      .channel('roadmap_features_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'roadmap_features' },
        () => {
          loadFeatures();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadFeatures() {
    try {
      const { data, error } = await supabase
        .from('roadmap_features')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      if (data) setFeatures(data);
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(featureId: string, newStatus: Status) {
    try {
      const { error } = await supabase
        .from('roadmap_features')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', featureId);

      if (error) throw error;
      loadFeatures();
    } catch (error) {
      console.error('Error updating feature:', error);
    }
  }

  async function handleDelete(featureId: string) {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      const { error } = await supabase
        .from('roadmap_features')
        .delete()
        .eq('id', featureId);

      if (error) throw error;
      loadFeatures();
    } catch (error) {
      console.error('Error deleting feature:', error);
    }
  }

  function handleEdit(feature: RoadmapFeature) {
    setEditingFeature(feature);
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
    setEditingFeature(null);
    loadFeatures();
  }

  const featuresByStatus = columns.reduce((acc, col) => {
    acc[col.status] = features.filter((f) => f.status === col.status);
    return acc;
  }, {} as Record<Status, RoadmapFeature[]>);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Product Roadmap</h2>
            <p className="mt-2 text-gray-600">
              Track feature development and priorities
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Feature
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto bg-gray-50 px-6 py-6">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              color={column.color}
              features={featuresByStatus[column.status] || []}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      {showModal && (
        <FeatureModal
          feature={editingFeature}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
