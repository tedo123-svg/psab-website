import { useState, FormEvent } from 'react';
import { useAdmin, Resource } from '../../contexts/AdminContext';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['policy', 'guidelines', 'research', 'reports', 'training'];

const EMPTY: Omit<Resource, 'id'> = {
  title: { en: '', am: '' },
  type: { en: 'Document', am: 'ሰነድ' },
  category: 'policy',
  size: '1.0 MB',
  published: true,
};

export function AdminResources() {
  const { resources, setResources } = useAdmin();
  const [editing, setEditing] = useState<Resource | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<Resource, 'id'>>(EMPTY);

  const openNew = () => { setForm(EMPTY); setIsNew(true); setEditing(null); };
  const openEdit = (r: Resource) => { setForm({ ...r }); setEditing(r); setIsNew(false); };
  const closeModal = () => { setEditing(null); setIsNew(false); };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.en.trim()) { toast.error('English title is required'); return; }
    if (isNew) {
      setResources([...resources, { ...form, id: Date.now() }]);
      toast.success('Resource created');
    } else if (editing) {
      setResources(resources.map((r) => (r.id === editing.id ? { ...form, id: editing.id } : r)));
      toast.success('Resource updated');
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this resource?')) return;
    setResources(resources.filter((r) => r.id !== id));
    toast.success('Resource deleted');
  };

  const togglePublish = (id: number) => {
    setResources(resources.map((r) => (r.id === id ? { ...r, published: !r.published } : r)));
  };

  const showModal = isNew || editing !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resources Management</h1>
          <p className="text-sm text-gray-500 mt-1">{resources.length} resources · {resources.filter((r) => r.published).length} published</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Type</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Size</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800 truncate max-w-xs">{r.title.en}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{r.title.am}</p>
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-600">{r.category}</td>
                  <td className="px-6 py-4 text-gray-600">{r.type.en}</td>
                  <td className="px-6 py-4 text-gray-500">{r.size}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {r.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => togglePublish(r.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={r.published ? 'Unpublish' : 'Publish'}>
                        {r.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{isNew ? 'Add Resource' : 'Edit Resource'}</h2>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type (English)</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.type.en} onChange={(e) => setForm({ ...form, type: { ...form.type, en: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type (Amharic)</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.type.am} onChange={(e) => setForm({ ...form, type: { ...form.type, am: e.target.value } })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">File Size</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g. 2.4 MB" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Published</span>
                  </label>
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
