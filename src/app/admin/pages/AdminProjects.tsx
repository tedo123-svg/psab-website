import { useState, FormEvent } from 'react';
import { useAdmin, Project } from '../../contexts/AdminContext';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY: Omit<Project, 'id'> = {
  title: { en: '', am: '' },
  description: { en: '', am: '' },
  status: 'ongoing',
  progress: 0,
  color: 'green',
};

export function AdminProjects() {
  const { projects, setProjects } = useAdmin();
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<Project, 'id'>>(EMPTY);

  const openNew = () => { setForm(EMPTY); setIsNew(true); setEditing(null); };
  const openEdit = (p: Project) => { setForm({ ...p }); setEditing(p); setIsNew(false); };
  const closeModal = () => { setEditing(null); setIsNew(false); };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.en.trim()) { toast.error('English title is required'); return; }
    if (isNew) {
      setProjects([...projects, { ...form, id: Date.now() }]);
      toast.success('Project created');
    } else if (editing) {
      setProjects(projects.map((p) => (p.id === editing.id ? { ...form, id: editing.id } : p)));
      toast.success('Project updated');
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this project?')) return;
    setProjects(projects.filter((p) => p.id !== id));
    toast.success('Project deleted');
  };

  const colorBadge: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
  };

  const showModal = isNew || editing !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects Management</h1>
          <p className="text-sm text-gray-500 mt-1">{projects.length} projects · {projects.filter((p) => p.status === 'ongoing').length} ongoing</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-bold text-gray-800 truncate">{p.title.en}</h3>
                <p className="text-xs text-gray-400 truncate">{p.title.am}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{p.description.en}</p>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.status}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colorBadge[p.color]}`}>{p.color}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span><span>{p.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${p.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{isNew ? 'Add Project' : 'Edit Project'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title (English) *</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.title.en} onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title (Amharic)</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.title.am} onChange={(e) => setForm({ ...form, title: { ...form.title, am: e.target.value } })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description (English)</label>
                  <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.description.en} onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Amharic)</label>
                  <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.description.am} onChange={(e) => setForm({ ...form, description: { ...form.description, am: e.target.value } })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })}>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Progress (%)</label>
                  <input type="number" min={0} max={100} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value as Project['color'] })}>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
