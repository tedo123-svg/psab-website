import { useState } from 'react';
import { useAdmin, Message } from '../../contexts/AdminContext';
import { Trash2, Mail, MailOpen, X } from 'lucide-react';
import { toast } from 'sonner';

export function AdminMessages() {
  const { messages, markMessageRead, deleteMessage } = useAdmin();
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'contact' | 'community'>('all');

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.read;
    if (filter === 'contact') return m.source === 'contact';
    if (filter === 'community') return m.source === 'community';
    return true;
  }).slice().reverse();

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) await markMessageRead(msg.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    await deleteMessage(id);
    if (selected?.id === id) setSelected(null);
    toast.success('Message deleted');
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">{messages.length} total · {unread} unread</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'unread', 'contact', 'community'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${filter === f ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {f}{f === 'unread' && unread > 0 ? ` (${unread})` : ''}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <Mail className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No messages found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!msg.read ? 'bg-green-50/40' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${msg.source === 'contact' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {msg.read
                    ? <MailOpen className={`w-4 h-4 ${msg.source === 'contact' ? 'text-blue-600' : 'text-green-600'}`} />
                    : <Mail className={`w-4 h-4 ${msg.source === 'contact' ? 'text-blue-600' : 'text-green-600'}`} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${!msg.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{msg.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${msg.source === 'contact' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{msg.source}</span>
                    {!msg.read && <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.subject || msg.message.slice(0, 60)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{msg.date}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                    className="p-1.5 rounded hover:bg-red-50 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800">{selected.name}</h2>
                <p className="text-xs text-gray-400">{selected.email} · {selected.date} · <span className="capitalize">{selected.source}</span></p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              {selected.subject && (
                <p className="text-sm font-semibold text-gray-700 mb-3">Subject: {selected.subject}</p>
              )}
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
