import { Link } from 'react-router';
import { useAdmin } from '../../contexts/AdminContext';
import { Newspaper, FolderKanban, BookOpen, MessageSquare, TrendingUp, Eye } from 'lucide-react';

export function AdminDashboard() {
  const { news, projects, resources, messages, unreadCount } = useAdmin();

  const stats = [
    { label: 'News Articles', value: news.length, published: news.filter((n) => n.published).length, icon: Newspaper, color: 'green', link: '/admin/news' },
    { label: 'Projects', value: projects.length, published: projects.filter((p) => p.status === 'ongoing').length, icon: FolderKanban, color: 'blue', link: '/admin/projects', sublabel: 'ongoing' },
    { label: 'Resources', value: resources.length, published: resources.filter((r) => r.published).length, icon: BookOpen, color: 'yellow', link: '/admin/resources' },
    { label: 'Messages', value: messages.length, published: unreadCount, icon: MessageSquare, color: 'red', link: '/admin/messages', sublabel: 'unread' },
  ];

  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  };

  const recentNews = [...news].slice(0, 5);
  const recentMessages = [...messages].slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-300" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-1">
                {stat.published} {stat.sublabel ?? 'published'}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Recent News</h2>
            <Link to="/admin/news" className="text-sm text-green-600 hover:text-green-700 font-medium">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentNews.map((item) => (
              <div key={item.id} className="px-6 py-3 flex items-center gap-4">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-12 h-9 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                ) : (
                  <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.title.en}</p>
                  <p className="text-xs text-gray-400">{item.date} · {item.category.en}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {item.published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
            {recentNews.length === 0 && <p className="px-6 py-4 text-sm text-gray-400">No news yet.</p>}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Recent Messages</h2>
            <Link to="/admin/messages" className="text-sm text-green-600 hover:text-green-700 font-medium">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="px-6 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${msg.read ? 'text-gray-600' : 'text-gray-900'}`}>{msg.name}</p>
                  <p className="text-xs text-gray-400 truncate">{msg.subject || msg.message.slice(0, 40)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!msg.read && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  <span className="text-xs text-gray-400">{msg.date}</span>
                </div>
              </div>
            ))}
            {recentMessages.length === 0 && (
              <div className="px-6 py-8 text-center">
                <Eye className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No messages yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Projects Overview</h2>
          <Link to="/admin/projects" className="text-sm text-green-600 hover:text-green-700 font-medium">Manage</Link>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800 truncate pr-2">{p.title.en}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {p.status}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${p.progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{p.progress}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
