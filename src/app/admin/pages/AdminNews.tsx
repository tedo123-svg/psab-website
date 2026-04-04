import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { useAdmin, NewsItem } from '../../contexts/AdminContext';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Upload, ImageOff } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY: Omit<NewsItem, 'id'> = {
  title: { en: '', am: '' },
  excerpt: { en: '', am: '' },
  body: { en: '', am: '' },
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  category: { en: 'Announcement', am: 'ማስታወቂያ' },
  image: 'announcement',
  imageUrl: undefined,
  published: true,
};

export function AdminNews() {
  const { news, addNews, updateNews, deleteNews } = useAdmin();
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<NewsItem, 'id'>>(EMPTY);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => { setForm(EMPTY); setIsNew(true); setEditing(null); };
  const openEdit = (item: NewsItem) => { setForm({ ...item }); setEditing(item); setIsNew(false); };
  const closeModal = () => { setEditing(null); setIsNew(false); };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.en.trim()) { toast.error('English title is required'); return; }
    if (isNew) {
      await addNews(form);
      toast.success('News article created');
    } else if (editing) {
      await updateNews({ ...form, id: editing.id });
      toast.success('News article updated');
    }
    closeModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this article?')) return;
    await deleteNews(id);
    toast.success('Article deleted');
  };

  const togglePublish = async (item: NewsItem) => {
    await updateNews({ ...item, published: !item.published });
  };

  const showModal = isNew || editing !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">News Management</h1>
          <p className="text-sm text-gray-500 mt-1">{news.length} articles · {news.filter((n) => n.published).length} published</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Image</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="w-14 h-10 object-cover rounded-lg border border-gray-100" />
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                        <ImageOff className="w-4 h-4 text-white/60" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800 truncate max-w-xs">{item.title.en}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{item.title.am}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{item.category.en}</td>
                  <td className="px-4 py-4 text-gray-500">{item.date}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => togglePublish(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={item.published ? 'Unpublish' : 'Publish'}>
                        {item.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{isNew ? 'Add News Article' : 'Edit Article'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                {form.imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={form.imageUrl} alt="Cover preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow"><Upload className="w-3 h-3" /> Replace</button>
                      <button type="button" onClick={removeImage} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow"><X className="w-3 h-3" /> Remove</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-colors group">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                    <span className="text-sm font-medium text-gray-500 group-hover:text-green-600">Click to upload cover image</span>
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

              {/* Excerpts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt (English)</label>
                  <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.excerpt.en} onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, en: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt (Amharic)</label>
                  <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.excerpt.am} onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, am: e.target.value } })} />
                </div>
              </div>

              {/* Full Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Article (English)</label>
                  <textarea rows={6} placeholder="Write the full article content here..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.body.en} onChange={(e) => setForm({ ...form, body: { ...form.body, en: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Article (Amharic)</label>
                  <textarea rows={6} placeholder="ሙሉ ጽሑፉን እዚህ ይጻፉ..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.body.am} onChange={(e) => setForm({ ...form, body: { ...form.body, am: e.target.value } })} />
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.category.en} onChange={(e) => setForm({ ...form, category: { ...form.category, en: e.target.value } })}>
                    {['Training', 'Announcement', 'Event', 'Campaign', 'Report', 'Dialogue'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
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
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">Save Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
