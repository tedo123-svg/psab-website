import { useLanguage } from '../contexts/LanguageContext';
import { Target, Eye, Award, Shield, Users, Heart, CheckCircle, Building2 } from 'lucide-react';

export function About() {
  const { language, t } = useLanguage();

  const coreValues = [
    { icon: Shield, key: 'transparency' },
    { icon: Users, key: 'participation' },
    { icon: Heart, key: 'unity' },
    { icon: CheckCircle, key: 'integrity' },
    { icon: Award, key: 'excellence' },
  ];

  const directorates = [
    {
      name: {
        en: 'Community Peace & Participation Directorate',
        am: 'የማህበረሰብ ሰላምና ተሳትፎ ዳይሬክቶሬት',
      },
      description: {
        en: 'Coordinates community participation in peace-building initiatives',
        am: 'በሰላም ግንባታ ተነሳሽነቶች ውስጥ የማህበረሰብ ተሳትፎን ያስተባብራል',
      },
    },
    {
      name: {
        en: 'Peace Army & Security Organizations Directorate',
        am: 'የሰላም ሰራዊትና የጸጥታ ድርጅቶች ዳይሬክቶሬት',
      },
      description: {
        en: 'Manages peace army deployment and security coordination',
        am: 'የሰላም ሰራዊት ማሰማራትና የጸጥታ ማስተባበር ያስተዳድራል',
      },
    },
    {
      name: {
        en: 'Religious Institutions & Civil Society Directorate',
        am: 'የሃይማኖት ተቋማትና የሲቪል ማህበረሰብ ዳይሬክቶሬት',
      },
      description: {
        en: 'Oversees religious institutions and civil society organizations',
        am: 'የሃይማኖት ተቋማትንና የሲቪል ማህበረሰብ ድርጅቶችን ይቆጣጠራል',
      },
    },
    {
      name: {
        en: 'Peace Council & Conflict Prevention Directorate',
        am: 'የሰላም ምክር ቤትና የግጭት መከላከል ዳይሬክቶሬት',
      },
      description: {
        en: 'Implements peace council structures and early warning systems',
        am: 'የሰላም ምክር ቤት መዋቅሮችንና ቀድመው የማስጠንቀቂያ ስርዓቶችን ያስፈጽማል',
      },
    },
  ];

  const objectives = [
    {
      en: 'Promote peace, security, and rule of law',
      am: 'ሰላም፣ ጸጥታና የህግ የበላይነትን ማስፋፋት',
    },
    {
      en: 'Strengthen community participation and ownership of peace',
      am: 'የማህበረሰብ ተሳትፎና የሰላም ባለቤትነትን ማጠናከር',
    },
    {
      en: 'Coordinate religious institutions and social organizations',
      am: 'የሃይማኖት ተቋማትንና ማህበራዊ ድርጅቶችን ማስተባበር',
    },
    {
      en: 'Prevent conflict and enhance early warning systems',
      am: 'ግጭትን መከላከልና ቀድመው የማስጠንቀቂያ ስርዓቶችን ማሳደግ',
    },
    {
      en: 'Build institutional capacity and structured governance',
      am: 'የተቋም አቅምና የተዋቀረ አስተዳደር መገንባት',
    },
    {
      en: 'Support collaboration among stakeholders and security bodies',
      am: 'በባለድርሻዎችና የጸጥታ አካላት መካከል ትብብርን መደገፍ',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Dedicated to Building Sustainable Peace and Security for Addis Ababa'
              : 'ለአዲስ አበባ ዘላቂ ሰላምና ጸጥታ ለመገንባት ቁርጠኞች'
            }
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-green-600" />
              {t('about.overview.title')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t('about.overview.content')}
            </p>
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
              <h3 className="font-bold text-gray-800 mb-2">{t('about.legal.title')}</h3>
              <p className="text-gray-700">{t('about.legal.content')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mission */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('about.mission.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('about.mission.content')}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('about.vision.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('about.vision.content')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              {t('about.values.title')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800">
                      {t(`about.values.${value.key}`)}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {language === 'en' ? 'Core Objectives' : 'ዋና ዓላማዎች'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {objectives.map((objective, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md flex items-start gap-3 hover:shadow-lg transition-shadow"
                >
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'en' ? objective.en : objective.am}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              {t('about.structure.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {directorates.map((directorate, index) => {
                const lang = language === 'en' ? 'en' : 'am';
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {directorate.name[lang]}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {directorate.description[lang]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
