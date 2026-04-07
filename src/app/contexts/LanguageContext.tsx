import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.news': 'News & Updates',
    'nav.projects': 'Projects & Programs',
    'nav.resources': 'Resources',
    'nav.community': 'Community Engagement',
    'nav.contact': 'Contact Us',
    
    // Home Page
    'home.hero.title': 'Building Sustainable Peace and Security',
    'home.hero.subtitle': 'Through Community Participation and National Unity',
    'home.hero.description': 'Promoting peace, security, and rule of law for Addis Ababa City Administration',
    'home.hero.cta1': 'Our Services',
    'home.hero.cta2': 'Contact Us',
    'home.welcome.title': 'Welcome to Lemi Kura Subcity Peace and Security Administration Office',
    'home.welcome.description': 'We are dedicated to maintaining peace, strengthening social cohesion, and coordinating security-related community structures in Addis Ababa. Our mission is to promote sustainable peace through community participation and national unity.',
    'home.services.title': 'Our Key Services',
    'home.services.viewall': 'View All Services',
    'home.news.title': 'Latest News & Updates',
    'home.news.readmore': 'Read More',
    'home.news.viewall': 'View All News',
    
    // About Page
    'about.title': 'About Us',
    'about.overview.title': 'Overview',
    'about.overview.content': 'The Lemi Kura Subcity Peace and Security Administration Office is a governmental institution under the Lemi Kura Sub-City Administration of Addis Ababa, established to promote peace, security, and the rule of law throughout the sub-city.',
    'about.mission.title': 'Our Mission',
    'about.mission.content': 'To maintain sustainable peace and security through community participation, strengthen social cohesion, coordinate religious institutions and social organizations, and build institutional capacity for structured governance.',
    'about.vision.title': 'Our Vision',
    'about.vision.content': 'A peaceful, secure, and united Addis Ababa where all citizens actively participate in maintaining peace and security, and where diversity is celebrated as a source of strength.',
    'about.values.title': 'Core Values',
    'about.values.transparency': 'Transparency',
    'about.values.participation': 'Community Participation',
    'about.values.unity': 'National Unity',
    'about.values.integrity': 'Integrity',
    'about.values.excellence': 'Excellence',
    'about.legal.title': 'Legal Establishment',
    'about.legal.content': 'Established under Proclamation No. 64/2011 and amended by Proclamation No. 84/2016 of the Addis Ababa City Administration.',
    'about.structure.title': 'Organizational Structure',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive peace and security services for the community',
    'services.1.title': 'Peace Value Training',
    'services.1.description': 'Comprehensive training programs on peace values, conflict resolution, and community building',
    'services.2.title': 'National Volunteer Service Coordination',
    'services.2.description': 'Coordination and management of national volunteer services for peace and development',
    'services.3.title': 'Peace & Diversity Promotion',
    'services.3.description': 'Promoting peace values and celebrating diversity within our communities',
    'services.4.title': 'Religious Institution Registration',
    'services.4.description': 'Legal registration and verification of religious institutions and organizations',
    'services.5.title': 'Religious Institution Monitoring',
    'services.5.description': 'Monitoring and oversight of religious institutions\' operations and compliance',
    'services.6.title': 'Religious Institution Support',
    'services.6.description': 'Support and follow-up services for registered religious institutions',
    'services.7.title': 'Community Dialogue Facilitation',
    'services.7.description': 'Organizing and facilitating community dialogues for conflict prevention',
    'services.8.title': 'Community Security Implementation',
    'services.8.description': 'Community-based security programs and neighborhood watch initiatives',
    'services.9.title': 'Awareness Training',
    'services.9.description': 'Public awareness creation on peace, security, and civic responsibilities',
    'services.10.title': 'Public Participation Enhancement',
    'services.10.description': 'Programs to enhance citizen participation in peace and security matters',
    'services.11.title': 'Peace Army Organization',
    'services.11.description': 'Organization and deployment of peace army for community security',
    'services.12.title': 'Peace Council Structure',
    'services.12.description': 'Implementation and coordination of peace council structures',
    'services.apply': 'Apply Now',
    'services.learnmore': 'Learn More',
    
    // News
    'news.title': 'News & Updates',
    'news.latest': 'Latest Announcements',
    
    // Projects
    'projects.title': 'Projects & Programs',
    'projects.subtitle': 'Our ongoing initiatives for peace and security',
    'projects.status.ongoing': 'Ongoing',
    'projects.status.completed': 'Completed',
    'projects.viewdetails': 'View Details',
    
    // Resources
    'resources.title': 'Resources',
    'resources.subtitle': 'Policies, guidelines, and publications',
    'resources.download': 'Download',
    'resources.view': 'View',
    
    // Community
    'community.title': 'Community Engagement',
    'community.subtitle': 'Your voice matters in building peace and security',
    'community.feedback.title': 'Submit Feedback',
    'community.feedback.name': 'Full Name',
    'community.feedback.email': 'Email Address',
    'community.feedback.message': 'Your Message',
    'community.feedback.submit': 'Submit Feedback',
    'community.volunteer.title': 'Volunteer Registration',
    'community.volunteer.description': 'Join our peace-building initiatives as a volunteer',
    'community.volunteer.register': 'Register as Volunteer',
    'community.complaint.title': 'Complaint & Grievance',
    'community.complaint.description': 'Report concerns or file complaints',
    'community.complaint.submit': 'Submit Complaint',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with us',
    'contact.location': 'Location',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.hours': 'Working Hours',
    'contact.hours.weekday': 'Monday - Friday: 8:30 AM - 5:30 PM',
    'contact.hours.weekend': 'Saturday - Sunday: Closed',
    'contact.form.title': 'Send us a message',
    'contact.form.submit': 'Send Message',
    
    // Footer
    'footer.description': 'Lemi Kura Subcity Peace and Security Administration Office, Lemi Kura Sub-City Administration, Addis Ababa',
    'footer.quicklinks': 'Quick Links',
    'footer.contact': 'Contact Information',
    'footer.followus': 'Follow Us',
    'footer.copyright': '© 2026 Lemi Kura Subcity Peace and Security Administration Office. All rights reserved.',
  },
  am: {
    // Header (Amharic)
    'nav.home': 'መነሻ',
    'nav.about': 'ስለ እኛ',
    'nav.services': 'አገልግሎቶች',
    'nav.news': 'ዜናዎች እና ማሻሻያዎች',
    'nav.projects': 'ፕሮጀክቶች እና ፕሮግራሞች',
    'nav.resources': 'ግብዓቶች',
    'nav.community': 'የማህበረሰብ ተሳትፎ',
    'nav.contact': 'አድራሻ',
    
    // Home Page (Amharic)
    'home.hero.title': 'ዘላቂ ሰላምና ጸጥታ መገንባት',
    'home.hero.subtitle': 'በማህበረሰብ ተሳትፎና በብሄራዊ አንድነት',
    'home.hero.description': 'ለአዲስ አበባ ከተማ አስተዳደር ሰላም፣ ጸጥታና የህግ የበላይነትን ማስፈን',
    'home.hero.cta1': 'አገልግሎቶቻችን',
    'home.hero.cta2': 'አግኙን',
    'home.welcome.title': 'ወደ ለሚ ኩራ ክፍለ ከተማ ሰላምና ጸጥታ አስተዳደር ጽ/ቤት እንኳን በደህና መጡ',
    'home.welcome.description': 'በአዲስ አበባ ሰላምን ለመጠበቅ፣ ማህበረሰባዊ ትስስርን ለማጠናከር እና ከጸጥታ ጋር የተያያዙ የማህበረሰብ መዋቅሮችን ለማስተባበር ቁርጠኞች ነን። ተልእኮአችን በማህበረሰብ ተሳትፎና በብሄራዊ አንድነት ዘላቂ ሰላም ማስፋፋት ነው።',
    'home.services.title': 'ዋና አገልግሎቶቻችን',
    'home.services.viewall': 'ሁሉንም አገልግሎቶች ይመልከቱ',
    'home.news.title': 'የቅርብ ጊዜ ዜናዎች እና ማሻሻያዎች',
    'home.news.readmore': 'ተጨማሪ ያንብቡ',
    'home.news.viewall': 'ሁሉንም ዜናዎች ይመልከቱ',
    
    // About (Amharic)
    'about.title': 'ስለ እኛ',
    'about.overview.title': 'አጠቃላይ እይታ',
    'about.overview.content': 'የለሚ ኩራ ክፍለ ከተማ ሰላምና ጸጥታ አስተዳደር ጽ/ቤት በለሚ ኩራ ክፍለ ከተማ አስተዳደር የሚመራ የመንግስት ተቋም ሲሆን በክፍለ ከተማው ውስጥ ሰላምን፣ ጸጥታንና የህግ የበላይነትን ለማስፈን የተቋቋመ ነው።',
    'about.mission.title': 'ተልዕኮ',
    'about.mission.content': 'የጸጥታ ጉዲዮች አስተዳደር የግጭት ቅድመ ማስጠንቀቂያና ፈጣን ምላሽ ስርዓትን የወንጀል መከላከልና እርምጃ አወሳሰድን ተግባራዊ በማድረግ፤ የሰላም እሴቶችን በመገንባት፣ የሃይማኖትና እምነት ጉዳዮችንና ብዝሃነትን በማስተዳደር፤ የነዋሪውን ተሳትፎና የሰላም ባለቤትነት በማጎልበት፤ የፀጥታ አጋዥ አደረጃጀቶችና የብዘሃን ማህበራትን በማጠናከር፣ የድጋፍ የክትትልና የቁጥጥር ስርዓት በመዘርጋት፤ የተቋማት አጋርነትና ቅንጅታዊ አሰራር ተግባራዊ በማድረግ እና የመልካም አስተዳደርና አገልግሎት አሰጣጥን በማዘመን ሰላምና ደህንነቷ የተጠበቀ እና የህግ የበሊይነት የተከበረባት ከተማ ማዴረግ ነው፡፡ ።',
    'about.vision.title': 'ራእያችን',
    'about.vision.content': 'ሁሉም ዜጎች ሰላምና ጸጥታን በንቃት የሚሳተፉበት፣ ብዝሃነት እንደ ጥንካሬ መገለጫ የሚከበርበት ሰላማዊ፣ ደህንነቱ የተጠበቀና የተዋሀደ አዲስ አበባ።',
    'about.values.title': 'ዋና እሴቶች',
    'about.values.transparency': 'ግልጽነት',
    'about.values.participation': 'የማህበረሰብ ተሳትፎ',
    'about.values.unity': 'ብሄራዊ አንድነት',
    'about.values.integrity': 'ታማኝነት',
    'about.values.excellence': 'ብልጽግና',
    'about.legal.title': 'ህጋዊ መቋቋም',
    'about.legal.content': 'በአዲስ አበባ ከተማ አስተዳደር አዋጅ ቁጥር 64/2011 እና በአዋጅ ቁጥር 84/2016 የተሻሻለ።',
    'about.structure.title': 'የድርጅት አወቃቀር',
    
    // Services (Amharic)
    'services.title': 'አገልግሎቶቻችን',
    'services.subtitle': 'ለማህበረሰቡ አጠቃላይ የሰላምና ጸጥታ አገልግሎቶች',
    'services.1.title': 'የሰላም እሴት ግንባታ ስልጠና',
    'services.1.description': 'በሰላም እሴቶች፣ ግጭት አፈታትና ማህበረሰብ ግንባታ ላይ አጠቃላይ የስልጠና ፕሮግራሞች',
    'services.2.title': 'የብሄራዊ በጎ-ፍቃድ አገልግሎት ማስተባበር',
    'services.2.description': 'ለሰላምና ልማት የብሄራዊ በጎ ፈቃደኛ አገልግሎቶችን ማስተባበርና ማስተዳደር',
    'services.3.title': 'የሰላም እሴቶችና ብዝሀነት ማስረጽ',
    'services.3.description': 'በማህበረሰባችን ውስጥ የሰላም እሴቶችን ማስፋፋትና ብዝሃነትን ማክበር',
    'services.4.title': 'የሃይማኖት ተቋማት መመዝገብና ህጋዊነት',
    'services.4.description': 'የሃይማኖት ተቋማትና ድርጅቶች ህጋዊ መመዝገብና ማረጋገጥ',
    'services.5.title': 'የሃይማኖት ተቋማት ቁጥጥር',
    'services.5.description': 'የሃይማኖት ተቋማት ተግባራትንና ተገዢነት መከታተልና ክትትል',
    'services.6.title': 'የሃይማኖት ተቋማት ድጋፍ',
    'services.6.description': 'ለተመዘገቡ የሃይማኖት ተቋማት ድጋፍና ክትትል አገልግሎቶች',
    'services.7.title': 'የማህበረሰብ ምክክር ማስተባበር',
    'services.7.description': 'ለግጭት መከላከል የማህበረሰብ ውይይቶችን ማደራጀትና ማመቻቸት',
    'services.8.title': 'የማህበረሰብ ጸጥታ አጠባበቅ',
    'services.8.description': 'በማህበረሰብ ላይ የተመሰረቱ የጸጥታ ፕሮግራሞችና የጎረቤት ክትትል ተነሳሽነቶች',
    'services.9.title': 'የግንዛቤ ስልጠና',
    'services.9.description': 'በሰላም፣ ጸጥታና የዜግነት ኃላፊነቶች ላይ የሕዝብ ግንዛቤ መፍጠር',
    'services.10.title': 'የህብረተሰብ ተሳትፎ ማጎልበት',
    'services.10.description': 'በሰላምና ጸጥታ ጉዳዮች ላይ የዜጎች ተሳትፎ የማጎልበት ፕሮግራሞች',
    'services.11.title': 'የሰላም ሰራዊት አደረጃጀት',
    'services.11.description': 'ለማህበረሰብ ጸጥታ የሰላም ሰራዊት አደረጃጀትና ማሰማራት',
    'services.12.title': 'የሰላም ምክር ቤት መዋቅር',
    'services.12.description': 'የሰላም ምክር ቤት መዋቅሮችን መተግበርና ማስተባበር',
    'services.apply': 'አሁን ያመልክቱ',
    'services.learnmore': 'ተጨማሪ ያንብቡ',
    
    // News (Amharic)
    'news.title': 'ዜናዎች እና ማሻሻያዎች',
    'news.latest': 'የቅርብ ጊዜ ማስታወቂያዎች',
    
    // Projects (Amharic)
    'projects.title': 'ፕሮጀክቶች እና ፕሮግራሞች',
    'projects.subtitle': 'ለሰላምና ጸጥታ በመካሄድ ላይ ያሉ ተነሳሽነቶቻችን',
    'projects.status.ongoing': 'በመካሄድ ላይ',
    'projects.status.completed': 'የተጠናቀቀ',
    'projects.viewdetails': 'ዝርዝሮችን ይመልከቱ',
    
    // Resources (Amharic)
    'resources.title': 'ግብዓቶች',
    'resources.subtitle': 'ፖሊሲዎች፣ መመሪያዎችና ህትመቶች',
    'resources.download': 'አውርድ',
    'resources.view': 'ይመልከቱ',
    
    // Community (Amharic)
    'community.title': 'የማህበረሰብ ተሳትፎ',
    'community.subtitle': 'ሰላምና ጸጥታ ለመገንባት እርስዎ ድምጽ አለዎት',
    'community.feedback.title': 'አስተያየት ያቅርቡ',
    'community.feedback.name': 'ሙሉ ስም',
    'community.feedback.email': 'የኢሜይል አድራሻ',
    'community.feedback.message': 'መልእክትዎ',
    'community.feedback.submit': 'አስተያየት ያስገቡ',
    'community.volunteer.title': 'የበጎ ፈቃደኛ ምዝገባ',
    'community.volunteer.description': 'የሰላም ግንባታ ተነሳሽነቶቻችንን እንደ በጎ ፈቃደኛ ይቀላቀሉ',
    'community.volunteer.register': 'እንደ በጎ ፈቃደኛ ይመዝገቡ',
    'community.complaint.title': 'ቅሬታና አቤቱታ',
    'community.complaint.description': 'ጉዳዮችን ያሳውቁ ወይም ቅሬታ ያስገቡ',
    'community.complaint.submit': 'ቅሬታ ያስገቡ',
    
    // Contact (Amharic)
    'contact.title': 'አግኙን',
    'contact.subtitle': 'ከእኛ ጋር ይገናኙ',
    'contact.location': 'አድራሻ',
    'contact.phone': 'ስልክ',
    'contact.email': 'ኢሜይል',
    'contact.hours': 'የስራ ሰዓቶች',
    'contact.hours.weekday': 'ሰኞ - አርብ፡ 8:30 ጠዋት - 5:30 ከሰዓት',
    'contact.hours.weekend': 'ቅዳሜ - እሁድ፡ ዝግ',
    'contact.form.title': 'መልዕክት ይላኩልን',
    'contact.form.submit': 'መልዕክት ላክ',
    
    // Footer (Amharic)
    'footer.description': 'ለሚ ኩራ ክፍለ ከተማ ሰላምና ጸጥታ አስተዳደር ጽ/ቤት፣ ለሚ ኩራ ክፍለ ከተማ አስተዳደር፣ አዲስ አበባ',
    'footer.quicklinks': 'ፈጣን አገናኞች',
    'footer.contact': 'የእውቂያ መረጃ',
    'footer.followus': 'ይከተሉን',
    'footer.copyright': '© 2026 ለሚ ኩራ ክፍለ ከተማ ሰላምና ጸጥታ አስተዳደር ጽ/ቤት። ሁሉም መብቶች የተጠበቁ ናቸው።',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('am');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
