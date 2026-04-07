import { useState, ElementType } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { Target, Users, Shield, BookOpen, Handshake, TrendingUp, CheckCircle2, Clock, X } from 'lucide-react';
import { Project } from '../contexts/AdminContext';

export function Projects() {
  const { language, t } = useLanguage();
  const { projects } = useAdmin();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Map project color to an icon
  const iconMap: Record<string, ElementType> = {
    green: Users,
    blue: Handshake,
    yellow: Shield,
  };
  const iconByIndex: ElementType[] = [Users, Handshake, Shield, BookOpen, Target, TrendingUp];

  const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-600', progress: 'bg-green-600', border: 'border-green-500' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', progress: 'bg-blue-600', border: 'border-blue-500' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', progress: 'bg-yellow-600', border: 'border-yellow-500' },
  };

  const lang = language === 'en' ? 'en' : 'am';

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('projects.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">{t('projects.subtitle')}</p>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { value: projects.length, label: { en: 'Total Projects', am: 'ጠቅላላ ፕሮጀክቶች' }, color: 'text-green-600' },
              { value: projects.filter((p) => p.status === 'ongoing').length, label: { en: 'Ongoing', am: 'በመካሄድ ላይ' }, color: 'text-blue-600' },
              { value: projects.filter((p) => p.status === 'completed').length, label: { en: 'Completed', am: 'የተጠናቀቁ' }, color: 'text-yellow-600' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {projects.map((project, idx) => {
              const Icon = iconByIndex[idx % iconByIndex.length];
              const colors = colorClasses[project.color];
              return (
                <div
                  key={project.id}
                  className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                    project.status === 'completed' ? 'border-green-300' : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 ${colors.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        {project.status === 'ongoing' ? (
                          <>
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                              {t('projects.status.ongoing')}
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                              {t('projects.status.completed')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 mb-3 leading-tight">{project.title[lang]}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{project.description[lang]}</p>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-600">{language === 'en' ? 'Progress' : 'እድገት'}</span>
                        <span className={`text-xs font-bold ${colors.text}`}>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${colors.progress} h-2 rounded-full transition-all duration-500`} style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className={`w-full border-2 ${colors.border} ${colors.text} px-4 py-2 rounded-md font-semibold hover:${colors.bg} transition-colors`}
                    >
                      {t('projects.viewdetails')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {language === 'en' ? 'Our Impact' : 'የእኛ ተፅእኖ'}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {language === 'en'
                ? 'Through our comprehensive programs and initiatives, we have positively impacted thousands of lives, strengthened community bonds, and created a more peaceful and secure environment for all residents of Addis Ababa.'
                : 'በአጠቃላይ ፕሮግራሞቻችንና ተነሳሽነቶቻችን በሺዎች የሚቆጠሩ ህይወቶችን አዎንታዊ ተጽዕኖ አሳድረናል።'}
            </p>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-green-700 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 ${colorClasses[selectedProject.color].bg} rounded-lg flex items-center justify-center`}>
                  <Users className={`w-7 h-7 ${colorClasses[selectedProject.color].text}`} />
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="font-bold text-2xl mt-4">{selectedProject.title[lang]}</h2>
              <div className="flex items-center gap-2 mt-2">
                {selectedProject.status === 'ongoing'
                  ? <><Clock className="w-4 h-4" /><span className="text-sm">{t('projects.status.ongoing')}</span></>
                  : <><CheckCircle2 className="w-4 h-4" /><span className="text-sm">{t('projects.status.completed')}</span></>
                }
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-6">{selectedProject.description[lang]}</p>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">{language === 'en' ? 'Progress' : 'እድገት'}</span>
                  <span className={`text-sm font-bold ${colorClasses[selectedProject.color].text}`}>{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${colorClasses[selectedProject.color].progress} h-3 rounded-full`}
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {language === 'en' ? 'Close' : 'ዝጋ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
