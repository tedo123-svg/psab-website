import { useEffect, useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import heroBg from './hero.jpg';

const INTERVAL = 5000; // 5 seconds

export function HeroSlideshow({ children }: { children: React.ReactNode }) {
  const { heroSlides } = useAdmin();
  const { language } = useLanguage();
  const [current, setCurrent] = useState(0);

  const slides = heroSlides.filter((s) => s.active);
  const lang = language === 'en' ? 'en' : 'am';

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Reset index if slides change
  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  const bgImage = slides.length > 0 ? slides[current].imageUrl : heroBg;
  const caption = slides.length > 0 ? slides[current].caption[lang] : '';

  return (
    <section
      className="relative text-white py-20 md:py-32 overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 transition-opacity duration-700" />

      {/* Content */}
      <div className="relative z-10">
        {children}
        {caption && (
          <p className="text-center text-white/70 text-sm mt-4">{caption}</p>
        )}
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
