import { useState, ChangeEvent, FormEvent } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function Contact() {
  const { language, t } = useLanguage();
  const { addMessage } = useAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });

  const contactInfo = [
    { icon: MapPin, title: t('contact.location'), content: { en: 'Lemi Kura Peace and Security Office\nLemi Kura Sub-City, Addis Ababa\nEthiopia', am: 'የለሚ ኩራ ሰላምና ደህንነት ጽ/ቤት\nለሚ ኩራ ክፍለ ከተማ፣ አዲስ አበባ\nኢትዮጵያ' }, color: 'green' },
    { icon: Phone, title: t('contact.phone'), content: { en: 'Main Office: +251-11-557-5000\nEmergency: +251-11-557-5001\nFax: +251-11-557-5002', am: 'ዋና ቢሮ፡ +251-11-557-5000\nድንገተኛ፡ +251-11-557-5001\nፋክስ፡ +251-11-557-5002' }, color: 'blue' },
    { icon: Mail, title: t('contact.email'), content: { en: 'General: info@psab.gov.et\nSupport: support@psab.gov.et\nMedia: media@psab.gov.et', am: 'አጠቃላይ፡ info@psab.gov.et\nድጋፍ፡ support@psab.gov.et\nሚዲያ፡ media@psab.gov.et' }, color: 'yellow' },
    { icon: Clock, title: t('contact.hours'), content: { en: t('contact.hours.weekday') + '\n' + t('contact.hours.weekend'), am: t('contact.hours.weekday') + '\n' + t('contact.hours.weekend') }, color: 'green' },
  ];

  const colorClasses = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev: typeof form) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(language === 'en' ? 'Please fill in all required fields.' : 'እባክዎን ሁሉንም አስፈላጊ መስኮች ይሙሉ።');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    addMessage({
      source: 'contact',
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    setIsSubmitting(false);
    setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    toast.success(language === 'en' ? 'Message sent successfully. We will get back to you soon!' : 'መልዕክት በተሳካ ሁኔታ ተልኳል። በቅርቡ እናገኝዎታለን!');
  };

  const lang = language === 'en' ? 'en' : 'am';

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">{t('contact.subtitle')}</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                  <div className={`bg-gradient-to-br ${colorClasses[info.color as keyof typeof colorClasses]} p-6 text-white`}>
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg">{info.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{info.content[lang]}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.form.title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">{language === 'en' ? 'First Name' : 'የመጀመሪያ ስም'} *</Label>
                    <Input id="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder={language === 'en' ? 'Abebe' : 'አበበ'} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{language === 'en' ? 'Last Name' : 'የአባት ስም'}</Label>
                    <Input id="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder={language === 'en' ? 'Kebede' : 'ከበደ'} className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">{t('community.feedback.email')} *</Label>
                  <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="your.email@example.com" className="mt-2" required />
                </div>
                <div>
                  <Label htmlFor="phone">{language === 'en' ? 'Phone Number' : 'ስልክ ቁጥር'}</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+251-9XX-XXX-XXX" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="subject">{language === 'en' ? 'Subject' : 'ርዕስ'}</Label>
                  <Input id="subject" type="text" value={form.subject} onChange={handleChange} placeholder={language === 'en' ? 'How can we help you?' : 'እንዴት ልንረዳዎ እንችላለን?'} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="message">{t('community.feedback.message')} *</Label>
                  <Textarea id="message" rows={5} value={form.message} onChange={handleChange} placeholder={language === 'en' ? 'Please enter your message...' : 'እባክዎን መልእክትዎን ያስገቡ...'} className="mt-2" required />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting
                    ? (language === 'en' ? 'Sending...' : 'በመላክ ላይ...')
                    : t('contact.form.submit')
                  }
                </button>
              </form>
            </div>

            {/* Map + Emergency */}
            <div className="space-y-6">
              {/* Google Maps embed — Meskel Square, Addis Ababa */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <iframe
                  title={language === 'en' ? 'Office Location Map' : 'የቢሮ አካባቢ ካርታ'}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d38.7614!3d9.0105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sMeskel%20Square%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1700000000000"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {language === 'en' ? 'Visit Our Office' : 'ቢሮአችንን ይጎብኙ'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === 'en'
                      ? 'Located near Meskel Square in the heart of Addis Ababa, easily accessible by public transportation.'
                      : 'በአዲስ አበባ መሃል ከመስቀል አደባባይ አቅራቢያ የሚገኘው ቢሮአችን በህዝብ ማመላለሻ በቀላሉ ይደረሳል።'}
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-lg shadow-lg p-8">
                <h3 className="font-bold text-xl mb-4">
                  {language === 'en' ? 'Emergency Contact' : 'የድንገተኛ አደጋ አድራሻ'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span className="text-lg font-semibold">+251-11-557-5001</span>
                  </div>
                  <p className="text-sm opacity-90">
                    {language === 'en' ? 'Available 24/7 for emergency assistance' : 'ለድንገተኛ አደጋ እገዛ 24/7 ይገኛል'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-City Offices */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {language === 'en' ? 'Our Sub-City Offices' : 'የክፍለ ከተማ ቢሮዎቻችን'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Addis Ketema', phone: '+251-11-557-5010' },
                { name: 'Akaki Kality', phone: '+251-11-557-5011' },
                { name: 'Arada', phone: '+251-11-557-5012' },
                { name: 'Bole', phone: '+251-11-557-5013' },
                { name: 'Gullele', phone: '+251-11-557-5014' },
                { name: 'Kirkos', phone: '+251-11-557-5015' },
                { name: 'Kolfe Keranio', phone: '+251-11-557-5016' },
                { name: 'Lideta', phone: '+251-11-557-5017' },
                { name: 'Nifas Silk-Lafto', phone: '+251-11-557-5018' },
                { name: 'Yeka', phone: '+251-11-557-5019' },
              ].map((office, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-white transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{office.name}</h3>
                      <p className="text-xs text-gray-500">{office.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
