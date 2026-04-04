import { createContext, useContext, useState, ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: number;
  title: { en: string; am: string };
  excerpt: { en: string; am: string };
  date: string;
  category: { en: string; am: string };
  image: string;
  imageUrl?: string;   // base64 or URL of uploaded image
  published: boolean;
}

export interface Project {
  id: number;
  title: { en: string; am: string };
  description: { en: string; am: string };
  status: 'ongoing' | 'completed';
  progress: number;
  color: 'green' | 'blue' | 'yellow';
}

export interface Resource {
  id: number;
  title: { en: string; am: string };
  type: { en: string; am: string };
  category: string;
  size: string;
  published: boolean;
}

export interface Message {
  id: number;
  source: 'contact' | 'community';
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

// ── Seed data ──────────────────────────────────────────────────────────────────

const seedNews: NewsItem[] = [
  { id: 1, title: { en: 'Community Peace Building Workshop Successfully Completed', am: 'የማህበረሰብ ሰላም ግንባታ አውደ ጥናት በተሳካ ሁኔታ ተጠናቀቀ' }, excerpt: { en: 'Over 200 community leaders participated in a comprehensive peace-building workshop.', am: 'ከ200 በላይ የማህበረሰብ መሪዎች ተሳትፈዋል።' }, date: 'March 28, 2026', category: { en: 'Training', am: 'ስልጠና' }, image: 'training', published: true },
  { id: 2, title: { en: 'New Religious Institution Registration Guidelines Released', am: 'አዳዲስ የሃይማኖት ተቋም ምዝገባ መመሪያዎች ተለቀቁ' }, excerpt: { en: 'Updated guidelines streamline the registration process for religious institutions.', am: 'የተሻሻሉ መመሪያዎች የምዝገባ ሂደቱን ያመቻቻሉ።' }, date: 'March 25, 2026', category: { en: 'Announcement', am: 'ማስታወቂያ' }, image: 'announcement', published: true },
  { id: 3, title: { en: 'Peace Council Meeting Addresses Community Concerns', am: 'የሰላም ምክር ቤት ስብሰባ የማህበረሰብ ጉዳዮችን ተመለከተ' }, excerpt: { en: 'Quarterly peace council meeting brought together stakeholders.', am: 'ሩብ ዓመታዊ ስብሰባ ባለድርሻዎችን አሰባስቧል።' }, date: 'March 20, 2026', category: { en: 'Event', am: 'ክስተት' }, image: 'event', published: true },
  { id: 4, title: { en: 'Peace Army Recruitment Drive Begins', am: 'የሰላም ሰራዊት ምልመላ ዘመቻ ጀመረ' }, excerpt: { en: 'New recruitment campaign for peace army volunteers.', am: 'ለሰላም ሰራዊት አዲስ ዘመቻ ተጀመረ።' }, date: 'March 15, 2026', category: { en: 'Campaign', am: 'ዘመቻ' }, image: 'campaign', published: true },
  { id: 5, title: { en: 'Inter-Faith Dialogue Promotes Unity', am: 'የሃይማኖቶች ውይይት አንድነትን ያበረታታል' }, excerpt: { en: 'Leaders from various religious communities came together for dialogue.', am: 'ከተለያዩ ሃይማኖቶች መሪዎች ተሰብስበዋል።' }, date: 'March 10, 2026', category: { en: 'Event', am: 'ክስተት' }, image: 'dialogue', published: true },
  { id: 6, title: { en: 'Community Security Assessment Report Published', am: 'የደህንነት ግምገማ ሪፖርት ታትሟል' }, excerpt: { en: 'Annual security assessment highlights achievements.', am: 'ዓመታዊ ግምገማ ስኬቶችን አጉልቷል።' }, date: 'March 5, 2026', category: { en: 'Announcement', am: 'ማስታወቂያ' }, image: 'report', published: true },
  { id: 7, title: { en: 'Youth Peace Leadership Graduation Ceremony', am: 'የወጣቶች ሰላም አመራር ምረቃ' }, excerpt: { en: '150 young peace leaders graduated from the inaugural program.', am: '150 ወጣቶች ተመርቀዋል።' }, date: 'February 28, 2026', category: { en: 'Training', am: 'ስልጠና' }, image: 'training', published: true },
  { id: 8, title: { en: 'New Sub-City Peace Offices Inaugurated', am: 'አዳዲስ ቢሮዎች ተከፈቱ' }, excerpt: { en: 'Three new sub-city peace offices were inaugurated.', am: 'ሶስት አዳዲስ ቢሮዎች ተከፈቱ።' }, date: 'February 20, 2026', category: { en: 'Announcement', am: 'ማስታወቂያ' }, image: 'announcement', published: false },
];

const seedProjects: Project[] = [
  { id: 1, title: { en: 'Community Peace Ambassador Program', am: 'የማህበረሰብ ሰላም አምባሳደር ፕሮግራም' }, description: { en: 'Training and deploying peace ambassadors across all sub-cities.', am: 'በሁሉም ክፍለ ከተሞች አምባሳደሮችን ማሰልጠን።' }, status: 'ongoing', progress: 75, color: 'green' },
  { id: 2, title: { en: 'Religious Harmony Initiative', am: 'የሃይማኖት ስምምነት ተነሳሽነት' }, description: { en: 'Fostering interfaith dialogue and cooperation.', am: 'የሃይማኖቶች ትብብር ማበረታታት።' }, status: 'ongoing', progress: 60, color: 'blue' },
  { id: 3, title: { en: 'Early Warning System Enhancement', am: 'ቀድመው ማስጠንቀቂያ ስርዓት' }, description: { en: 'Developing advanced early warning systems.', am: 'ቀድሞ ማስጠንቀቂያ ስርዓቶችን ማዘጋጀት።' }, status: 'ongoing', progress: 45, color: 'yellow' },
  { id: 4, title: { en: 'Peace Value Education Campaign', am: 'የሰላም እሴት ትምህርት ዘመቻ' }, description: { en: 'Comprehensive education campaign promoting peace values.', am: 'የሰላም እሴቶችን የሚያስፋፋ ዘመቻ።' }, status: 'ongoing', progress: 85, color: 'green' },
  { id: 5, title: { en: 'Community Security Network', am: 'የማህበረሰብ ደህንነት አውታረ' }, description: { en: 'Establishing neighborhood watch programs.', am: 'የጎረቤት ክትትል ፕሮግራሞች ማቋቋም።' }, status: 'ongoing', progress: 55, color: 'blue' },
  { id: 6, title: { en: 'Youth Peace Leadership Program', am: 'የወጣቶች ሰላም አመራር ፕሮግራም' }, description: { en: 'Empowering youth as peace leaders.', am: 'ወጣቶችን እንደ ሰላም መሪዎች ማብቃት።' }, status: 'completed', progress: 100, color: 'yellow' },
];

const seedResources: Resource[] = [
  { id: 1, title: { en: 'Proclamation No. 64/2011 - Establishment of PSAB', am: 'አዋጅ ቁጥር 64/2011' }, type: { en: 'Legal Document', am: 'ህጋዊ ሰነድ' }, category: 'policy', size: '2.4 MB', published: true },
  { id: 2, title: { en: 'Proclamation No. 84/2016 - Amendment', am: 'አዋጅ ቁጥር 84/2016' }, type: { en: 'Legal Document', am: 'ህጋዊ ሰነድ' }, category: 'policy', size: '1.8 MB', published: true },
  { id: 3, title: { en: 'Religious Institution Registration Guidelines', am: 'የምዝገባ መመሪያዎች' }, type: { en: 'Guidelines', am: 'መመሪያዎች' }, category: 'guidelines', size: '3.2 MB', published: true },
  { id: 4, title: { en: 'Peace Council Implementation Manual', am: 'የሰላም ምክር ቤት መመሪያ' }, type: { en: 'Manual', am: 'መመሪያ' }, category: 'guidelines', size: '4.1 MB', published: true },
  { id: 5, title: { en: 'Community Peace Building Best Practices', am: 'ምርጥ ተሞክሮዎች' }, type: { en: 'Research', am: 'ምርምር' }, category: 'research', size: '5.6 MB', published: true },
  { id: 6, title: { en: 'Annual Security Assessment Report 2025', am: 'ዓመታዊ ሪፖርት 2025' }, type: { en: 'Report', am: 'ሪፖርት' }, category: 'reports', size: '6.8 MB', published: true },
  { id: 7, title: { en: 'Peace Value Training Curriculum', am: 'ስርዓተ ትምህርት' }, type: { en: 'Curriculum', am: 'ስርዓተ ትምህርት' }, category: 'training', size: '3.5 MB', published: false },
  { id: 8, title: { en: 'Early Warning System Guidelines', am: 'ቀድሞ ማስጠንቀቂያ መመሪያ' }, type: { en: 'Guidelines', am: 'መመሪያዎች' }, category: 'guidelines', size: '2.9 MB', published: true },
  { id: 9, title: { en: 'Conflict Resolution Framework', am: 'የግጭት አፈታት ማዕቀፍ' }, type: { en: 'Framework', am: 'ማዕቀፍ' }, category: 'policy', size: '2.1 MB', published: true },
];

// ── Context ────────────────────────────────────────────────────────────────────

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  // Data
  news: NewsItem[];
  setNews: (items: NewsItem[]) => void;
  projects: Project[];
  setProjects: (items: Project[]) => void;
  resources: Resource[];
  setResources: (items: Resource[]) => void;
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'date' | 'read'>) => void;
  markMessageRead: (id: number) => void;
  deleteMessage: (id: number) => void;
  unreadCount: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const CREDENTIALS = { username: 'admin', password: 'admin123' };

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [news, setNews] = useState<NewsItem[]>(seedNews);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [resources, setResources] = useState<Resource[]>(seedResources);
  const [messages, setMessages] = useState<Message[]>([]);

  const login = (username: string, password: string) => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  const addMessage = (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: Date.now(), date: new Date().toLocaleDateString(), read: false },
    ]);
  };

  const markMessageRead = (id: number) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));

  const deleteMessage = (id: number) =>
    setMessages((prev) => prev.filter((m) => m.id !== id));

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout,
      news, setNews,
      projects, setProjects,
      resources, setResources,
      messages, addMessage, markMessageRead, deleteMessage, unreadCount,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
