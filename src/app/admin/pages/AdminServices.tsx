import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { useAdmin, Service } from '../../contexts/AdminContext';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Upload, ImageOff } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

const EMPTY: Omit<Service, 'id'> = {
  title: { en: '', am: '' },
  description: { en: '', am: '' },
  imageUrl: undefined,
  color: 'green',
  published: true,
  order: 0,
};

export function AdminServices() {
  const { services, addService, updateService, deleteService } = useAdmin();
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<Service, 'id'>>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setForm({ ...EMPTY, order: services.length + 1 });
    setIsNew(true); setEditing(null);
  };
  const openEdit = (s: Service) => { setForm({ ...s }); setEditing(s); setIsNew(false); };
  const closeModal = () => { setEditing(null); setIsNew(false); };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `services/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('images').upload(path, file, { upsert: true });

    if (error) {
      // fallback: use base64 if storage bucket not set up
      const reader = new FileReader();
      reader.onload = () => setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.path);
    setForm((prev) => ({ ...prev, imageUrl: urlData.publicUrl }));
    toast.success('Image uploaded');
    setUploading(false);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.en.trim()) { toast.error('English title is required'); return; }
    if (isNew) {
      await addService(form);
      toast.success('Service created');
    } else if (editing) {
      await updateService({ ...form, id: editing.id });
      toast.success('Service updated');
    }
    closeModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    await deleteService(id);
    toast.success('Service deleted');
  };

  const togglePublish = async (s: Service) => {
    await updateService({ ...s, published: !s.published });
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
          <h1 className="text-2xl font-bold text-gray-800">Services Management</h1>
          <p className="text-sm text-gray-500 mt-1">{services.length} services · {services.filter((s) => s.published).length} published</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Image */}
            <div className="h-36 relative overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
              {s.imageUrl ? (
                <img src={s.imageUrl} alt={s.title.en} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-8 h-8 text-white/40" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {s.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-bold text-gray-800 truncate text-sm">{s.title.en}</h3>
                  <p className="text-xs text-gray-400 truncate">{s.title.am}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${colorBadge[s.color]}`}>{s.color}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{s.description.en}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Order: {s.order}</span>
                <div className="flex gap-1">
                  <button onClick={() => togglePublish(s)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                    {s.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-gray-400">
          No services yet. Click "Add Service" to create one.
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{isNew ? 'Add Service' : 'Edit Service'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Photo</label>
                {form.imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={form.imageUrl} alt="Preview" className="w-full h-44 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow">
                        <Upload className="w-3 h-3" /> Replace
                      </button>
                      <button type="button" onClick={removeImage} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow">
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-colors group disabled:opacity-60"
                  >
                    {uploading
                      ? <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      : <Upload className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                    }
                    <span className="text-sm font-medium text-gray-500 group-hover:text-green-600">
                      {uploading ? 'Uploading...' : 'Click to upload photo'}
                    </span>
                    <span className="text-xs text-gray-400">PNG, JPG, WEBP · max 5 MB</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Titles */}
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

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description (English)</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.description.en} onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Amharic)</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.description.am} onChange={(e) => setForm({ ...form, description: { ...form.description, am: e.target.value } })} />
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value as Service['color'] })}>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                  <input type="number" min={1} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Published</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
