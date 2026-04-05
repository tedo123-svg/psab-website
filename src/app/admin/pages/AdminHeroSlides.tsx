import { useState, useRef, ChangeEvent } from 'react';
import { useAdmin, HeroSlide } from '../../contexts/AdminContext';
import { Plus, Trash2, Eye, EyeOff, Upload, GripVertical } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

export function AdminHeroSlides() {
  const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState({ en: '', am: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10 MB'); return; }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `hero/${Date.now()}.${ext}`;

    // Try Supabase Storage first, fall back to base64
    const { data, error } = await supabase.storage.from('images').upload(path, file, { upsert: true });
    let imageUrl = '';

    if (error) {
      // base64 fallback
      imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    } else {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.path);
      imageUrl = urlData.publicUrl;
    }

    await addHeroSlide({
      imageUrl,
      caption: { en: caption.en, am: caption.am },
      order: heroSlides.length + 1,
      active: true,
    });

    setCaption({ en: '', am: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
    toast.success('Slide added');
  };

  const toggleActive = async (slide: HeroSlide) => {
    await updateHeroSlide({ ...slide, active: !slide.active });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this slide?')) return;
    await deleteHeroSlide(id);
    toast.success('Slide deleted');
  };

  const updateCaption = async (slide: HeroSlide, en: string, am: string) => {
    await updateHeroSlide({ ...slide, caption: { en, am } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hero Slideshow</h1>
        <p className="text-sm text-gray-500 mt-1">
          {heroSlides.length} slides · {heroSlides.filter((s) => s.active).length} active — auto-advances every 5 seconds
        </p>
      </div>

      {/* Upload new slide */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-700 mb-4">Add New Slide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Caption (English)</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Optional caption..."
              value={caption.en}
              onChange={(e) => setCaption((p) => ({ ...p, en: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Caption (Amharic)</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="አማርኛ መግለጫ..."
              value={caption.am}
              onChange={(e) => setCaption((p) => ({ ...p, am: e.target.value }))}
            />
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm disabled:opacity-60"
        >
          {uploading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Upload className="w-4 h-4" />
          }
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP · max 10 MB</p>
      </div>

      {/* Slides list */}
      {heroSlides.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-gray-400">
          No slides yet. Upload your first photo above.
        </div>
      ) : (
        <div className="space-y-3">
          {heroSlides.map((slide, idx) => (
            <div key={slide.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden flex gap-0 ${slide.active ? 'border-green-200' : 'border-gray-100 opacity-60'}`}>
              {/* Thumbnail */}
              <div className="w-40 h-28 flex-shrink-0 relative overflow-hidden bg-gray-100">
                <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                  #{idx + 1}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 p-4 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Caption (English)"
                    defaultValue={slide.caption.en}
                    onBlur={(e) => updateCaption(slide, e.target.value, slide.caption.am)}
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Caption (Amharic)"
                    defaultValue={slide.caption.am}
                    onBlur={(e) => updateCaption(slide, slide.caption.en, e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${slide.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {slide.active ? 'Active' : 'Hidden'}
                  </span>
                  <GripVertical className="w-4 h-4 text-gray-300" />
                  <span className="text-xs text-gray-400">Order: {slide.order}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center justify-center gap-2 px-4 border-l border-gray-100">
                <button onClick={() => toggleActive(slide)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title={slide.active ? 'Hide' : 'Show'}>
                  {slide.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(slide.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
