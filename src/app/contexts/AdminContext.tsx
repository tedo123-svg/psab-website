import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: number;
  title: { en: string; am: string };
  excerpt: { en: string; am: string };
  body: { en: string; am: string };   // full article content
  date: string;
  category: { en: string; am: string };
  image: string;
  imageUrl?: string;
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
  fileUrl?: string;   // URL of uploaded file in Supabase Storage
  published: boolean;
}

export interface Service {
  id: number;
  title: { en: string; am: string };
  description: { en: string; am: string };
  imageUrl?: string;
  color: 'green' | 'blue' | 'yellow';
  published: boolean;
  order: number;
}

export interface HeroSlide {
  id: number;
  imageUrl: string;
  caption: { en: string; am: string };
  order: number;
  active: boolean;
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

// ── Row mappers ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapNews = (r: any): NewsItem => ({
  id: r.id,
  title: { en: r.title_en, am: r.title_am },
  excerpt: { en: r.excerpt_en, am: r.excerpt_am },
  body: { en: r.body_en ?? '', am: r.body_am ?? '' },
  date: r.date,
  category: { en: r.category_en, am: r.category_am },
  image: r.image,
  imageUrl: r.image_url ?? undefined,
  published: r.published,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapProject = (r: any): Project => ({
  id: r.id,
  title: { en: r.title_en, am: r.title_am },
  description: { en: r.description_en, am: r.description_am },
  status: r.status,
  progress: r.progress,
  color: r.color,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapResource = (r: any): Resource => ({
  id: r.id,
  title: { en: r.title_en, am: r.title_am },
  type: { en: r.type_en, am: r.type_am },
  category: r.category,
  size: r.size,
  fileUrl: r.file_url ?? undefined,
  published: r.published,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapService = (r: any): Service => ({
  id: r.id,
  title: { en: r.title_en, am: r.title_am },
  description: { en: r.description_en, am: r.description_am },
  imageUrl: r.image_url ?? undefined,
  color: r.color ?? 'green',
  published: r.published,
  order: r.order ?? 0,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapHeroSlide = (r: any): HeroSlide => ({
  id: r.id,
  imageUrl: r.image_url,
  caption: { en: r.caption_en ?? '', am: r.caption_am ?? '' },
  order: r.order ?? 0,
  active: r.active ?? true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapMessage = (r: any): Message => ({
  id: r.id,
  source: r.source,
  name: r.name,
  email: r.email,
  subject: r.subject,
  message: r.message,
  date: new Date(r.created_at).toLocaleDateString(),
  read: r.read,
});

// ── Context ────────────────────────────────────────────────────────────────────

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
  // News
  news: NewsItem[];
  addNews: (item: Omit<NewsItem, 'id'>) => Promise<void>;
  updateNews: (item: NewsItem) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
  // Projects
  projects: Project[];
  addProject: (item: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (item: Project) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  // Resources
  resources: Resource[];
  addResource: (item: Omit<Resource, 'id'>) => Promise<void>;
  updateResource: (item: Resource) => Promise<void>;
  deleteResource: (id: number) => Promise<void>;
  // Services
  services: Service[];
  addService: (item: Omit<Service, 'id'>) => Promise<void>;
  updateService: (item: Service) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  // Hero Slides
  heroSlides: HeroSlide[];
  addHeroSlide: (item: Omit<HeroSlide, 'id'>) => Promise<void>;
  updateHeroSlide: (item: HeroSlide) => Promise<void>;
  deleteHeroSlide: (id: number) => Promise<void>;
  // Messages
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'date' | 'read'>) => Promise<void>;
  markMessageRead: (id: number) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  unreadCount: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const CREDENTIALS = { username: 'admin', password: 'admin123' };

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

  // ── Load all data on mount ──
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [n, p, r, s, hs, m] = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: true }),
        supabase.from('resources').select('*').order('created_at', { ascending: true }),
        supabase.from('services').select('*').order('"order"', { ascending: true }),
        supabase.from('hero_slides').select('*').order('"order"', { ascending: true }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
      ]);
      if (n.error) console.error('news:', n.error.message);
      if (p.error) console.error('projects:', p.error.message);
      if (r.error) console.error('resources:', r.error.message);
      if (s.error) console.error('services:', s.error.message);
      if (hs.error) console.error('hero_slides:', hs.error.message);
      if (m.error) console.error('messages:', m.error.message);
      if (n.data) setNews(n.data.map(mapNews));
      if (p.data) setProjects(p.data.map(mapProject));
      if (r.data) setResources(r.data.map(mapResource));
      if (s.data) setServices(s.data.map(mapService));
      if (hs.data) setHeroSlides(hs.data.map(mapHeroSlide));
      if (m.data) setMessages(m.data.map(mapMessage));
      setLoading(false);
    }
    load();
  }, []);

  const login = (username: string, password: string) => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  const logout = () => setIsAuthenticated(false);

  // ── News CRUD ──
  const addNews = async (item: Omit<NewsItem, 'id'>) => {
    const { data, error } = await supabase.from('news').insert({
      title_en: item.title.en, title_am: item.title.am,
      excerpt_en: item.excerpt.en, excerpt_am: item.excerpt.am,
      body_en: item.body.en, body_am: item.body.am,
      date: item.date, category_en: item.category.en, category_am: item.category.am,
      image: item.image, image_url: item.imageUrl ?? null, published: item.published,
    }).select().single();
    if (!error && data) setNews((prev) => [mapNews(data), ...prev]);
  };

  const updateNews = async (item: NewsItem) => {
    const { error } = await supabase.from('news').update({
      title_en: item.title.en, title_am: item.title.am,
      excerpt_en: item.excerpt.en, excerpt_am: item.excerpt.am,
      body_en: item.body.en, body_am: item.body.am,
      date: item.date, category_en: item.category.en, category_am: item.category.am,
      image: item.image, image_url: item.imageUrl ?? null, published: item.published,
    }).eq('id', item.id);
    if (!error) setNews((prev) => prev.map((n) => (n.id === item.id ? item : n)));
  };

  const deleteNews = async (id: number) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) setNews((prev) => prev.filter((n) => n.id !== id));
  };

  // ── Projects CRUD ──
  const addProject = async (item: Omit<Project, 'id'>) => {
    const { data, error } = await supabase.from('projects').insert({
      title_en: item.title.en, title_am: item.title.am,
      description_en: item.description.en, description_am: item.description.am,
      status: item.status, progress: item.progress, color: item.color,
    }).select().single();
    if (!error && data) setProjects((prev) => [...prev, mapProject(data)]);
  };

  const updateProject = async (item: Project) => {
    const { error } = await supabase.from('projects').update({
      title_en: item.title.en, title_am: item.title.am,
      description_en: item.description.en, description_am: item.description.am,
      status: item.status, progress: item.progress, color: item.color,
    }).eq('id', item.id);
    if (!error) setProjects((prev) => prev.map((p) => (p.id === item.id ? item : p)));
  };

  const deleteProject = async (id: number) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Resources CRUD ──
  const addResource = async (item: Omit<Resource, 'id'>) => {
    const { data, error } = await supabase.from('resources').insert({
      title_en: item.title.en, title_am: item.title.am,
      type_en: item.type.en, type_am: item.type.am,
      category: item.category, size: item.size,
      file_url: item.fileUrl ?? null, published: item.published,
    }).select().single();
    if (!error && data) setResources((prev) => [...prev, mapResource(data)]);
  };

  const updateResource = async (item: Resource) => {
    const { error } = await supabase.from('resources').update({
      title_en: item.title.en, title_am: item.title.am,
      type_en: item.type.en, type_am: item.type.am,
      category: item.category, size: item.size,
      file_url: item.fileUrl ?? null, published: item.published,
    }).eq('id', item.id);
    if (!error) setResources((prev) => prev.map((r) => (r.id === item.id ? item : r)));
  };

  const deleteResource = async (id: number) => {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (!error) setResources((prev) => prev.filter((r) => r.id !== id));
  };

  // ── Services CRUD ──
  const addService = async (item: Omit<Service, 'id'>) => {
    const { data, error } = await supabase.from('services').insert({
      title_en: item.title.en, title_am: item.title.am,
      description_en: item.description.en, description_am: item.description.am,
      image_url: item.imageUrl ?? null, color: item.color,
      published: item.published, order: item.order,
    }).select().single();
    if (!error && data) setServices((prev) => [...prev, mapService(data)].sort((a, b) => a.order - b.order));
  };

  const updateService = async (item: Service) => {
    const { error } = await supabase.from('services').update({
      title_en: item.title.en, title_am: item.title.am,
      description_en: item.description.en, description_am: item.description.am,
      image_url: item.imageUrl ?? null, color: item.color,
      published: item.published, order: item.order,
    }).eq('id', item.id);
    if (!error) setServices((prev) => prev.map((s) => (s.id === item.id ? item : s)));
  };

  const deleteService = async (id: number) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Hero Slides CRUD ──
  const addHeroSlide = async (item: Omit<HeroSlide, 'id'>) => {
    const { data, error } = await supabase.from('hero_slides').insert({
      image_url: item.imageUrl, caption_en: item.caption.en, caption_am: item.caption.am,
      order: item.order, active: item.active,
    }).select().single();
    if (!error && data) setHeroSlides((prev) => [...prev, mapHeroSlide(data)].sort((a, b) => a.order - b.order));
  };

  const updateHeroSlide = async (item: HeroSlide) => {
    const { error } = await supabase.from('hero_slides').update({
      image_url: item.imageUrl, caption_en: item.caption.en, caption_am: item.caption.am,
      order: item.order, active: item.active,
    }).eq('id', item.id);
    if (!error) setHeroSlides((prev) => prev.map((s) => (s.id === item.id ? item : s)));
  };

  const deleteHeroSlide = async (id: number) => {
    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    if (!error) setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Messages ──
  const addMessage = async (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
    const { data, error } = await supabase.from('messages').insert({
      source: msg.source, name: msg.name, email: msg.email,
      subject: msg.subject, message: msg.message,
    }).select().single();
    if (!error && data) setMessages((prev) => [mapMessage(data), ...prev]);
  };

  const markMessageRead = async (id: number) => {
    const { error } = await supabase.from('messages').update({ read: true }).eq('id', id);
    if (!error) setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteMessage = async (id: number) => {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (!error) setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout, loading,
      news, addNews, updateNews, deleteNews,
      projects, addProject, updateProject, deleteProject,
      resources, addResource, updateResource, deleteResource,
      services, addService, updateService, deleteService,
      heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide,
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
