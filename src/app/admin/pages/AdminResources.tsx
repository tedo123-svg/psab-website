import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { useAdmin, Resource } from '../../contexts/AdminContext';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Upload, FileText, ExternalLink } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

const CATEGORIES = ['policy', 'guidelines', 'research', 'reports', 'training'];

const EMPTY: Omit<Resource, 'id'> = {
  title: { en: '', am: '' },
  type: { en: 'Document', am: 'ሰነድ' },
  category: 'policy',
  size: '',
  fileUrl: undefined,
  published: true,
};

export function AdminResources() {
  const { resources, addResource, updateResource, deleteResource } = useAdmin();
  const [editing, setEditing] = useState<Resource | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<Resource, 'id'>>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => { setForm(EMPTY); setIsNew(true); setEditing(null); };
  const openEdit = (r: Resource) => { setForm({ ...r }); setEditing(r); setIsNew(false); };
  const closeModal = () => { setEditing(null); setIsNew(false); };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { toast.error('File must be under 20 MB'); return; }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `resources/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(data.path);
    const sizeKB = file.size / 1024;
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;

    setForm((prev) => ({ ...prev, fileUrl: urlData.publicUrl, size: sizeStr }));
    toast.success('File uploaded');
    setUploading(false);
  };

  const removeFile = () => {
    setForm((prev) => ({ ...prev, fileUrl: undefined, size: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.en.trim()) { toast.error('English title is required'); return; }
    if (isNew) {
      await addResource(form);
      toast.success('Resource created');
    } else if (editing) {
      await updateResource({ ...form, id: editing.id });
      toast.success('Resource updated');
    }
    closeModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this resource?')) return;
    await deleteResource(id);
    toast.success('Resource deleted');
  };

  const togglePublish = async (r: Resource) => {
    await updateResource({ ...r, published: !r.published });
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Size</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">File</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800 truncate max-w-xs">{r.title.en}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{r.title.am}</p>
                  </td>
                  <td className="px-4 py-4 capitalize text-gray-600">{r.category}</td>
                  <td className="px-4 py-4 text-gray-500">{r.size || '—'}</td>
                  <td className="px-4 py-4">
                    {r.fileUrl ? (
                      <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-semibold">
                        <FileText className="w-3 h-3" /> View file
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No file</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {r.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => togglePublish(r)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
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

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Document File</label>
                {form.fileUrl ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-green-800">File uploaded</p>
                      <a href={form.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Preview file
                      </a>
                    </div>
                    <button type="button" onClick={removeFile} className="p-1.5 rounded hover:bg-red-50 text-red-500 flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-colors group disabled:opacity-60"
                  >
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                    )}
                    <span className="text-sm font-medium text-gray-500 group-hover:text-green-600">
                      {uploading ? 'Uploading...' : 'Click to upload document'}
                    </span>
                    <span className="text-xs text-gray-400">PDF, DOC, DOCX, XLSX · max 20 MB</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx" className="hidden" onChange={handleFileChange} />
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

              {/* Type + Category */}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
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
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
