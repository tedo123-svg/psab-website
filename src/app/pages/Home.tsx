import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { ArrowRight, BookOpen, Award, ImageOff, Shield, Scale, Users, Heart } from 'lucide-react';
import heroBg from '../components/hero.jpg';

export function Home() {
  const { language, t } = useLanguage();
  const { news: allNews, services: allServices } = useAdmin();

  // Show the 3 most recent published news items
  const newsItems = allNews.filter((n) => n.published).slice(0, 3);
  // Show first 6 published services
  const keyServices = allServices.filter((s) => s.published).slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative text-white py-20 md:py-32 overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-black/55" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-95">
              {t('home.hero.subtitle')}
            </p>
            <p className="text-lg mb-8 opacity-90">
              {t('home.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {t('home.hero.cta1')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                {t('home.hero.cta2')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {t('home.welcome.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('home.welcome.description')}
            </p>
          </div>

          {/* Core Values Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center p-6 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">
                {language === 'en' ? 'Peace' : 'ሰላም'}
              </h3>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">
                {language === 'en' ? 'Security' : 'ደህንነት'}
              </h3>
            </div>
            <div className="text-center p-6 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">
                {language === 'en' ? 'Unity' : 'አንድነት'}
              </h3>
            </div>
            <div className="text-center p-6 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">
                {language === 'en' ? 'Participation' : 'ተሳትፎ'}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('home.services.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {keyServices.map((service) => {
              const lang = language === 'en' ? 'en' : 'am';
              const colorMap: Record<string, string> = { green: 'bg-green-500', blue: 'bg-blue-500', yellow: 'bg-yellow-500' };
              return (
                <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.title[lang]} className="w-full h-36 object-cover" />
                  ) : (
                    <div className={`w-full h-36 ${colorMap[service.color]} flex items-center justify-center`}>
                      <ImageOff className="w-8 h-8 text-white/40" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{service.title[lang]}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{service.description[lang]}</p>
                  </div>
                </div>
              );
            })}
            {keyServices.length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-400 text-sm">
                {language === 'en' ? 'Services coming soon.' : 'አገልግሎቶች በቅርቡ ይመጣሉ።'}
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {t('home.services.viewall')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('home.news.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newsItems.map((news) => {
              const lang = language === 'en' ? 'en' : 'am';
              return (
                <div
                  key={news.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 relative overflow-hidden">
                    {news.imageUrl ? (
                      <img src={news.imageUrl} alt={news.title[lang]} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {news.category[lang]}
                      </span>
                      <span className="text-xs text-gray-500">{news.date}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-3 leading-snug">
                      {news.title[lang]}
                    </h3>
                    <Link
                      to="/news"
                      className="text-green-600 hover:text-green-700 font-semibold text-sm inline-flex items-center gap-1"
                    >
                      {t('home.news.readmore')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
            {newsItems.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-400">
                {language === 'en' ? 'No news published yet.' : 'እስካሁን ዜና አልታተመም።'}
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('home.news.viewall')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'en' 
              ? 'Join Us in Building Peace'
              : 'ሰላም ለመገንባት ይቀላቀሉን'
            }
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Together, we can create a more peaceful and secure community for everyone.'
              : 'በአንድነት ለሁሉም የበለጠ ሰላማዊና ደህንነቱ የተጠበቀ ማህበረሰብ መፍጠር እንችላለን።'
            }
          </p>
          <Link
            to="/community"
            className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            {language === 'en' ? 'Get Involved' : 'ይሳተፉ'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
