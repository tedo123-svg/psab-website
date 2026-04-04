import { useState, ElementType } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  GraduationCap, Users, Heart, Building2, Eye, HandHeart,
  MessageSquare, Shield, Lightbulb, TrendingUp, Sword, Scale,
  FileCheck, Building, X
} from 'lucide-react';
import { toast } from 'sonner';

interface ServiceDetail {
  id: number;
  title: string;
  description: string;
  icon: ElementType;
  gradient: string;
}

export function Services() {
  const { language, t } = useLanguage();
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  const services = [
    { id: 1, icon: GraduationCap, gradient: 'from-green-500 to-green-600' },
    { id: 2, icon: Users, gradient: 'from-blue-500 to-blue-600' },
    { id: 3, icon: Heart, gradient: 'from-yellow-500 to-yellow-600' },
    { id: 4, icon: Building2, gradient: 'from-green-600 to-green-700' },
    { id: 5, icon: Eye, gradient: 'from-blue-600 to-blue-700' },
    { id: 6, icon: HandHeart, gradient: 'from-yellow-600 to-yellow-700' },
    { id: 7, icon: MessageSquare, gradient: 'from-green-700 to-green-800' },
    { id: 8, icon: Shield, gradient: 'from-blue-700 to-blue-800' },
    { id: 9, icon: Lightbulb, gradient: 'from-yellow-700 to-yellow-800' },
    { id: 10, icon: TrendingUp, gradient: 'from-green-800 to-green-900' },
    { id: 11, icon: Sword, gradient: 'from-blue-800 to-blue-900' },
    { id: 12, icon: Scale, gradient: 'from-yellow-800 to-yellow-900' },
  ];

  const additionalServices = [
    { title: { en: 'Civic Association Registration', am: 'የሲቪል ማህበራት ምዝገባ' }, description: { en: 'Registration and monitoring of civic associations and NGOs', am: 'የሲቪል ማህበራትና መንግስታዊ ያልሆኑ ድርጅቶች ምዝገባና ክትትል' }, icon: FileCheck },
    { title: { en: 'Peace Support Organizations', am: 'የሰላም ድጋፍ ድርጅቶች' }, description: { en: 'Coordination of peace and security support organizations', am: 'የሰላምና ደህንነት ድጋፍ ድርጅቶች ማስተባበር' }, icon: Building },
  ];

  const handleApply = (serviceTitle: string) => {
    toast.success(
      language === 'en'
        ? `Application started for: ${serviceTitle}`
        : `ማመልከቻ ተጀምሯል: ${serviceTitle}`
    );
  };

  const handleLearnMore = (service: { id: number; icon: ElementType; gradient: string }) => {
    setSelectedService({
      id: service.id,
      title: t(`services.${service.id}.title`),
      description: t(`services.${service.id}.description`),
      icon: service.icon,
      gradient: service.gradient,
    });
  };

  const lang = language === 'en' ? 'en' : 'am';

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('services.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">{t('services.subtitle')}</p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  <div className={`bg-gradient-to-br ${service.gradient} p-6 group-hover:scale-105 transition-transform`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{service.id}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-white mb-2 leading-tight">
                      {t(`services.${service.id}.title`)}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {t(`services.${service.id}.description`)}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApply(t(`services.${service.id}.title`))}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors text-sm"
                      >
                        {t('services.apply')}
                      </button>
                      <button
                        onClick={() => handleLearnMore(service)}
                        className="flex-1 border border-green-600 text-green-600 px-4 py-2 rounded-md font-semibold hover:bg-green-50 transition-colors text-sm"
                      >
                        {t('services.learnmore')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {language === 'en' ? 'Additional Specialized Services' : 'ተጨማሪ ልዩ አገልግሎቶች'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{service.title[lang]}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description[lang]}</p>
                        <button
                          onClick={() => handleApply(service.title.en)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors text-sm"
                        >
                          {t('services.apply')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Overview */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {language === 'en' ? 'Service Categories' : 'የአገልግሎት ምድቦች'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: GraduationCap, color: 'green', title: { en: 'Training & Education', am: 'ስልጠናና ትምህርት' }, desc: { en: 'Peace value training and awareness programs', am: 'የሰላም እሴት ስልጠናና የግንዛቤ መፍጠር ፕሮግራሞች' } },
                { icon: Building2, color: 'blue', title: { en: 'Registration & Legal', am: 'ምዝገባና ህጋዊነት' }, desc: { en: 'Religious institutions and civic associations', am: 'የሃይማኖት ተቋማትና የሲቪል ማህበራት' } },
                { icon: Shield, color: 'yellow', title: { en: 'Community Security', am: 'የማህበረሰብ ደህንነት' }, desc: { en: 'Peace army and community-based security', am: 'የሰላም ሰራዊትና ማህበረሰብ ላይ የተመሰረተ ደህንነት' } },
              ].map((cat, i) => {
                const Icon = cat.icon;
                const bgMap: Record<string, string> = { green: 'bg-green-100', blue: 'bg-blue-100', yellow: 'bg-yellow-100' };
                const textMap: Record<string, string> = { green: 'text-green-600', blue: 'text-blue-600', yellow: 'text-yellow-600' };
                return (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className={`w-16 h-16 ${bgMap[cat.color]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${textMap[cat.color]}`} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{cat.title[lang]}</h3>
                    <p className="text-sm text-gray-600">{cat.desc[lang]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`bg-gradient-to-br ${selectedService.gradient} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <selectedService.icon className="w-7 h-7 text-white" />
                </div>
                <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="font-bold text-2xl mt-4">{selectedService.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-6">{selectedService.description}</p>
              <button
                onClick={() => { handleApply(selectedService.title); setSelectedService(null); }}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {t('services.apply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
