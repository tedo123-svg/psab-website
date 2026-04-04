import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { FileText, Download, Eye, BookOpen, Scale, FileCheck, Folder } from 'lucide-react';
import { toast } from 'sonner';

export function Resources() {
  const { language, t } = useLanguage();
  const { resources: allResources } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('all');

  // Only show published resources
  const resources = allResources.filter((r) => r.published);

  const categories = [
    { id: 'all', name: { en: 'All Resources', am: 'ሁሉም ግብዓቶች' }, icon: Folder },
    { id: 'policy', name: { en: 'Policies & Proclamations', am: 'ፖሊሲዎችና አዋጆች' }, icon: Scale },
    { id: 'guidelines', name: { en: 'Guidelines', am: 'መመሪያዎች' }, icon: FileCheck },
    { id: 'research', name: { en: 'Research & Studies', am: 'ምርምሮችና ጥናቶች' }, icon: FileText },
    { id: 'reports', name: { en: 'Reports', am: 'ሪፖርቶች' }, icon: FileText },
    { id: 'training', name: { en: 'Training Materials', am: 'የስልጠና ቁሳቁሶች' }, icon: BookOpen },
  ];

  const filtered = activeCategory === 'all' ? resources : resources.filter((r) => r.category === activeCategory);
  const lang = language === 'en' ? 'en' : 'am';

  const categoryIcon: Record<string, typeof Scale> = {
    policy: Scale, guidelines: FileCheck, research: FileText,
    reports: FileText, training: BookOpen,
  };

  const handleDownload = (title: string) => {
    toast.info(language === 'en' ? `Preparing download: ${title}` : `ማውረድ በዝግጅት ላይ: ${title}`);
  };

  const handleView = (title: string) => {
    toast.info(language === 'en' ? `Opening: ${title}` : `በመክፈት ላይ: ${title}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('resources.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">{t('resources.subtitle')}</p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b sticky top-[72px] z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name[lang]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-16">
              {language === 'en' ? 'No resources in this category.' : 'በዚህ ምድብ ውስጥ ግብዓቶች የሉም።'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filtered.map((resource) => {
                const Icon = categoryIcon[resource.category] ?? FileText;
                return (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group"
                  >
                    <div className="bg-gradient-to-br from-green-500 to-blue-600 p-6 group-hover:from-green-600 group-hover:to-blue-700 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {resource.size}
                        </span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full inline-block">
                        {resource.type[lang]}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-800 mb-4 leading-tight min-h-[3.5rem]">
                        {resource.title[lang]}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(resource.title.en)}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          {t('resources.download')}
                        </button>
                        <button
                          onClick={() => handleView(resource.title.en)}
                          className="flex-1 border border-green-600 text-green-600 px-4 py-2 rounded-md font-semibold hover:bg-green-50 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {t('resources.view')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Need Assistance with Resources?' : 'በግብዓቶች ረገድ እገዛ ያስፈልግዎታል?'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {language === 'en'
                ? 'If you need assistance accessing any of our resources or require additional documentation, please contact our support team.'
                : 'ማናቸውንም የእኛን ግብዓቶች ለመድረስ ወይም ተጨማሪ ሰነዶችን ከፈለጉ፣ እባክዎን የድጋፍ ቡድናችንን ያግኙ።'}
            </p>
            <button
              onClick={() => toast.info(language === 'en' ? 'Redirecting to contact page...' : 'ወደ አድራሻ ገጽ እየተዛወረ ነው...')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {language === 'en' ? 'Contact Support' : 'ድጋፍን ያግኙ'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
