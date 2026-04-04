import { useState, ChangeEvent, FormEvent } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { MessageSquare, Users, AlertTriangle, Send } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function Community() {
  const { language, t } = useLanguage();
  const { addMessage } = useAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', category: '', message: '' });

  const engagementOptions = [
    { icon: MessageSquare, title: t('community.feedback.title'), description: { en: 'Share your thoughts, suggestions, and feedback to help us serve you better', am: 'በተሻለ ሁኔታ እንድናገልግልዎ ለመርዳት ሀሳቦችዎን፣ አስተያየቶችዎንና ግብረመልስዎን ያካፍሉ' }, color: 'green', action: 'feedback' },
    { icon: Users, title: t('community.volunteer.title'), description: { en: t('community.volunteer.description'), am: t('community.volunteer.description') }, color: 'blue', action: 'volunteer' },
    { icon: AlertTriangle, title: t('community.complaint.title'), description: { en: t('community.complaint.description'), am: t('community.complaint.description') }, color: 'yellow', action: 'complaint' },
  ];

  const colorClasses = {
    green: { gradient: 'from-green-500 to-green-600', btn: 'bg-green-600 hover:bg-green-700' },
    blue: { gradient: 'from-blue-500 to-blue-600', btn: 'bg-blue-600 hover:bg-blue-700' },
    yellow: { gradient: 'from-yellow-500 to-yellow-600', btn: 'bg-yellow-600 hover:bg-yellow-700' },
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev: typeof form) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(language === 'en' ? 'Please fill in all required fields.' : 'እባክዎን ሁሉንም አስፈላጊ መስኮች ይሙሉ።');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    addMessage({
      source: 'community',
      name: form.name,
      email: form.email,
      subject: form.category,
      message: form.message,
    });
    setIsSubmitting(false);
    setForm({ name: '', email: '', phone: '', category: '', message: '' });
    toast.success(language === 'en' ? 'Feedback submitted successfully. Thank you!' : 'አስተያየት በተሳካ ሁኔታ ቀርቧል። አመሰግናለሁ!');
  };

  const handleEngagementAction = (action: string) => {
    const messages: Record<string, { en: string; am: string }> = {
      feedback: { en: 'Scroll down to fill out the feedback form.', am: 'የአስተያየት ቅጹን ለመሙላት ወደ ታች ይሸብልሉ።' },
      volunteer: { en: 'Volunteer registration is coming soon!', am: 'የበጎ ፈቃደኛ ምዝገባ በቅርቡ ይመጣል!' },
      complaint: { en: 'Please use the form below to submit your complaint.', am: 'ቅሬታዎን ለማስገባት ከዚህ በታች ያለውን ቅጽ ይጠቀሙ።' },
    };
    const msg = messages[action];
    toast.info(language === 'en' ? msg.en : msg.am);
  };

  const lang = language === 'en' ? 'en' : 'am';

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('community.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">{t('community.subtitle')}</p>
        </div>
      </section>

      {/* Engagement Options */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {engagementOptions.map((option, index) => {
              const Icon = option.icon;
              const colors = colorClasses[option.color as keyof typeof colorClasses];
              return (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className={`bg-gradient-to-br ${colors.gradient} p-6 text-white`}>
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{option.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{option.description[lang]}</p>
                    <button
                      onClick={() => handleEngagementAction(option.action)}
                      className={`w-full py-2 px-4 rounded-md font-semibold transition-colors text-white ${colors.btn}`}
                    >
                      {option.action === 'feedback' && t('community.feedback.submit')}
                      {option.action === 'volunteer' && t('community.volunteer.register')}
                      {option.action === 'complaint' && t('community.complaint.submit')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback Form */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-green-600" />
                {t('community.feedback.title')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <Label htmlFor="name">{t('community.feedback.name')} *</Label>
                  <Input id="name" type="text" value={form.name} onChange={handleChange} placeholder={language === 'en' ? 'Enter your full name' : 'ሙሉ ስምዎን ያስገቡ'} className="mt-2" required />
                </div>

                <div>
                  <Label htmlFor="email">{t('community.feedback.email')} *</Label>
                  <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="your.email@example.com" className="mt-2" required />
                </div>

                <div>
                  <Label htmlFor="phone">{language === 'en' ? 'Phone Number (Optional)' : 'ስልክ ቁጥር (አማራጭ)'}</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+251-9XX-XXX-XXX" className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="category">{language === 'en' ? 'Category' : 'ምድብ'}</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">{language === 'en' ? 'Select a category' : 'ምድብ ይምረጡ'}</option>
                    <option value="feedback">{language === 'en' ? 'General Feedback' : 'አጠቃላይ አስተያየት'}</option>
                    <option value="suggestion">{language === 'en' ? 'Suggestion' : 'ሀሳብ'}</option>
                    <option value="complaint">{language === 'en' ? 'Complaint' : 'ቅሬታ'}</option>
                    <option value="inquiry">{language === 'en' ? 'Inquiry' : 'ጥያቄ'}</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">{t('community.feedback.message')} *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Please share your thoughts, suggestions, or concerns...' : 'እባክዎን ሀሳቦችዎን፣ አስተያየቶችዎንን ወይም ጉዳዮችዎን ያካፍሉ...'}
                    className="mt-2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting
                    ? (language === 'en' ? 'Submitting...' : 'በማስገባት ላይ...')
                    : t('community.feedback.submit')
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">
              {language === 'en' ? 'Community Participation Impact' : 'የማህበረሰብ ተሳትፎ ተፅዕኖ'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { value: '2,500+', label: { en: 'Active Volunteers', am: 'ንቁ በጎ ፈቃደኞች' }, bg: 'from-green-50 to-green-100', text: 'text-green-600' },
                { value: '1,200+', label: { en: 'Feedback Received', am: 'የተቀበሉ አስተያየቶች' }, bg: 'from-blue-50 to-blue-100', text: 'text-blue-600' },
                { value: '95%', label: { en: 'Response Rate', am: 'የምላሽ መጠን' }, bg: 'from-yellow-50 to-yellow-100', text: 'text-yellow-600' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.bg} p-8 rounded-lg`}>
                  <div className={`text-5xl font-bold ${stat.text} mb-3`}>{stat.value}</div>
                  <div className="text-gray-700 font-semibold">{stat.label[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'en' ? 'Your Voice Matters' : 'የእርስዎ ድምጽ አስፈላጊ ነው'}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Join thousands of citizens actively participating in building a peaceful and secure community.'
              : 'ሰላማዊና ደህንነቱ የተጠበቀ ማህበረሰብ ለመገንባት በንቃት የሚሳተፉ በሺዎች የሚቆጠሩ ዜጎችን ይቀላቀሉ።'}
          </p>
        </div>
      </section>
    </div>
  );
}
