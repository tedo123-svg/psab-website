import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: number;
  title: { en: string; am: string };
  excerpt: { en: string; am: string };
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

// ── Row mappers ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapNews = (r: any): NewsItem => ({
  id: r.id,
  title: { en: r.title_en, am: r.title_am },
  excerpt: { en: r.excerpt_en, am: r.excerpt_am },
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
  published: r.published,
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
  const [messages, setMessages] = useState<Message[]>([]);

  // ── Load all data on mount ──
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [n, p, r, m] = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: true }),
        supabase.from('resources').select('*').order('created_at', { ascending: true }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
      ]);
      if (n.data) setNews(n.data.map(mapNews));
      if (p.data) setProjects(p.data.map(mapProject));
      if (r.data) setResources(r.data.map(mapResource));
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
      date: item.date, category_en: item.category.en, category_am: item.category.am,
      image: item.image, image_url: item.imageUrl ?? null, published: item.published,
    }).select().single();
    if (!error && data) setNews((prev) => [mapNews(data), ...prev]);
  };

  const updateNews = async (item: NewsItem) => {
    const { error } = await supabase.from('news').update({
      title_en: item.title.en, title_am: item.title.am,
      excerpt_en: item.excerpt.en, excerpt_am: item.excerpt.am,
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
      category: item.category, size: item.size, published: item.published,
    }).select().single();
    if (!error && data) setResources((prev) => [...prev, mapResource(data)]);
  };

  const updateResource = async (item: Resource) => {
    const { error } = await supabase.from('resources').update({
      title_en: item.title.en, title_am: item.title.am,
      type_en: item.type.en, type_am: item.type.am,
      category: item.category, size: item.size, published: item.published,
    }).eq('id', item.id);
    if (!error) setResources((prev) => prev.map((r) => (r.id === item.id ? item : r)));
  };

  const deleteResource = async (id: number) => {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (!error) setResources((prev) => prev.filter((r) => r.id !== id));
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
