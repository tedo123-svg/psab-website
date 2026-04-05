import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin, Service } from '../contexts/AdminContext';
import { X, ImageOff } from 'lucide-react';
import { toast } from 'sonner';

const colorGradient: Record<string, string> = {
  green: 'from-green-500 to-green-700',
  blue: 'from-blue-500 to-blue-700',
  yellow: 'from-yellow-500 to-yellow-700',
};
const colorBtn: Record<string, string> = {
  green: 'bg-green-600 hover:bg-green-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  yellow: 'bg-yellow-600 hover:bg-yellow-700',
};
const colorOutline: Record<string, string> = {
  green: 'border-green-600 text-green-600 hover:bg-green-50',
  blue: 'border-blue-600 text-blue-600 hover:bg-blue-50',
  yellow: 'border-yellow-600 text-yellow-600 hover:bg-yellow-50',
};

export function Services() {
  const { language, t } = useLanguage();
  const { services: allServices } = useAdmin();
  const [selected, setSelected] = useState<Service | null>(null);

  const lang = language === 'en' ? 'en' : 'am';
  const services = allServices.filter((s) => s.published);

  const handleApply = (title: string) => {
    toast.success(language === 'en' ? `Application started for: ${title}` : `ማመልከቻ ተጀምሯል: ${title}`);
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('services.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">{t('services.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {services.length === 0 ? (
            <p className="text-center text-gray-400 py-16">
              {language === 'en' ? 'No services available yet.' : 'እስካሁን አገልግሎቶች የሉም።'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
                  <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${colorGradient[service.color]}`}>
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-10 h-10 text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-lg text-white leading-tight drop-shadow">{service.title[lang]}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">{service.description[lang]}</p>
                    <div className="flex gap-3">
                      <button onClick={() => handleApply(service.title.en)} className={`flex-1 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${colorBtn[service.color]}`}>{t('services.apply')}</button>
                      <button onClick={() => setSelected(service)} className={`flex-1 border px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${colorOutline[service.color]}`}>{t('services.learnmore')}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`relative h-52 bg-gradient-to-br ${colorGradient[selected.color]}`}>
              {selected.imageUrl ? (
                <img src={selected.imageUrl} alt={selected.title[lang]} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageOff className="w-12 h-12 text-white/30" /></div>
              )}
              <div className="absolute inset-0 bg-black/25" />
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white"><X className="w-5 h-5" /></button>
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl font-bold text-white drop-shadow">{selected.title[lang]}</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-6">{selected.description[lang]}</p>
              <button onClick={() => { handleApply(selected.title.en); setSelected(null); }} className={`w-full text-white py-3 rounded-xl font-semibold transition-colors ${colorBtn[selected.color]}`}>{t('services.apply')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
