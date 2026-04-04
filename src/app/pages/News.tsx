import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { Calendar, Tag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export function News() {
  const { language, t } = useLanguage();
  const { news: allNews } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Only show published items
  const newsItems = allNews.filter((n) => n.published);

  const categories = [
    { en: 'All', am: 'ሁሉም' },
    { en: 'Training', am: 'ስልጠና' },
    { en: 'Announcement', am: 'ማስታወቂያ' },
    { en: 'Event', am: 'ክስተት' },
    { en: 'Campaign', am: 'ዘመቻ' },
  ];

  const imageEmoji: Record<string, string> = {
    training: '📚', announcement: '📢', event: '🤝',
    campaign: '🎯', dialogue: '💬', report: '📊',
  };

  const filtered = activeCategory === 'All'
    ? newsItems
    : newsItems.filter((n) => n.category.en === activeCategory);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('news.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">{t('news.latest')}</p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const isActive = activeCategory === category.en;
              return (
                <button
                  key={category.en}
                  onClick={() => handleCategoryChange(category.en)}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    isActive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'en' ? category.en : category.am}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {paginated.length === 0 ? (
            <p className="text-center text-gray-500 py-16">
              {language === 'en' ? 'No news in this category.' : 'በዚህ ምድብ ውስጥ ዜና የለም።'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {paginated.map((news) => {
                const lang = language === 'en' ? 'en' : 'am';
                return (
                  <article
                    key={news.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-48 relative overflow-hidden">
                      {news.imageUrl ? (
                        <img
                          src={news.imageUrl}
                          alt={news.title[lang]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-500 via-blue-500 to-yellow-500 flex items-center justify-center">
                          <div className="text-white text-6xl opacity-30">
                            {imageEmoji[news.image] ?? '📰'}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {news.category[lang]}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {news.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-3 leading-tight group-hover:text-green-600 transition-colors">
                        {news.title[lang]}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {news.excerpt[lang]}
                      </p>
                      <button className="text-green-600 hover:text-green-700 font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('home.news.readmore')}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-md font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
