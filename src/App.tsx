import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu, X, ChevronRight, Trophy, Briefcase, Heart, PlayCircle, MapPin, Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ── Kept assets: logo (Navbar + Footer) and hero image (Hero section) ────────
import logoUrl from '../assets/alhajilogo.png';
import heroImgUrl from '../assets/heroimg.jpeg';

// Lazy-load the admin panel so it doesn't bloat the public bundle
import AdminPanel from './AdminPanel';

// ─── API base — empty in dev (Vite proxies /api/*), set VITE_API_URL in prod ──
const API_BASE = import.meta.env.VITE_API_URL ?? '';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AboutData {
  image: { url: string; publicId: string };
  heading: string;
  text: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
}

interface ImpactPillar {
  _id: string;
  slug: 'corporate' | 'sports' | 'humanitarian';
  image: { url: string; publicId: string };
  title: string;
  subtitle: string;
  content: string;
}

interface MediaItem {
  _id: string;
  category: string;
  title: string;
  date: string;
  description: string;
  isVideo: boolean;
  media: { url: string; publicId: string; resourceType: string };
  order: number;
}

// ─── Shared animation variants (unchanged from original) ──────────────────────

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ─── Skeleton shimmer helper ──────────────────────────────────────────────────

const Shimmer = ({ className }: { className: string; key?: React.Key }) => (
  <div className={`animate-pulse bg-gray-800 rounded-sm ${className}`} />
);

// ═════════════════════════════════════════════════════════════════════════════
// Navbar — unchanged; uses logo only
// ═════════════════════════════════════════════════════════════════════════════

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Impact', href: '#impact' },
    { name: 'Media', href: '#media' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#121212]/95 backdrop-blur-md py-4 shadow-lg shadow-black/50' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <img src={logoUrl} alt="Dokkal Khairu Logo" className="h-20 w-auto object-contain" />
          <div className="hidden md:flex flex-col ml-3">
            <h1 className="text-xl font-serif font-bold text-white leading-tight">Alhaji Adamu Muhammad</h1>
            <p className="text-gold-500 text-sm tracking-widest uppercase mt-0.5">Dokkal Khairu</p>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm tracking-wide text-gray-300 hover:text-gold-500 transition-colors">
              {link.name}
            </a>
          ))}
          <a href="#contact" className="px-6 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-[#121212] transition-all duration-300 text-sm tracking-widest uppercase">
            Inquiries
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white hover:text-gold-500 transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1A1A1A] border-t border-gray-800"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg tracking-wide text-gray-300 hover:text-gold-500 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="inline-block text-center px-6 py-3 bg-gold-500 text-[#121212] font-medium tracking-widest uppercase mt-4"
              >
                Inquiries
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// Hero — unchanged; uses heroImgUrl only
// ═════════════════════════════════════════════════════════════════════════════

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#121212]">
      {/* Right Side Image & Overlay */}
      <div className="absolute top-0 right-0 w-full lg:w-[70%] h-full z-0 opacity-90 lg:opacity-100">
        <img
          src={heroImgUrl}
          alt="Alhaji Adamu Muhammad"
          className="w-full h-full object-cover object-[center_15%]"
        />
        <div className="absolute inset-0 bg-[#121212]/20 lg:bg-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#121212] lg:via-transparent lg:to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="lg:col-span-7"
        >
          <motion.div variants={fadeIn} className="flex items-center space-x-4 mb-6">
            <div className="h-[1px] w-12 bg-gold-500"></div>
            <span className="text-gold-500 tracking-[0.2em] text-sm uppercase font-medium">A Visionary Philanthropist</span>
          </motion.div>

          <motion.h1 variants={fadeIn} className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-[1.2] mb-8 text-white">
            Building Visions.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Driving Industry.</span><br />
            Transforming Communities.
          </motion.h1>

          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-400 mb-12 max-w-xl font-light leading-relaxed">
            CEO of Dokkal Khairu Nigeria Ltd & Chairman of Dokkal Khairu FC.
            Championing economic innovation, sports development, and structural philanthropy across Osun State and beyond.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#about" className="px-8 py-4 bg-gold-500 text-[#121212] hover:bg-gold-400 font-medium tracking-widest uppercase transition-colors flex items-center justify-center group">
              Profile
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="px-8 py-4 border border-gray-600 text-white hover:border-gold-500 hover:text-gold-500 font-medium tracking-widest uppercase transition-colors text-center">
              Contact
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// About — API-driven; fetches from /api/about on mount
// Layout, animations, decorative elements, and quote card are all preserved.
// ═════════════════════════════════════════════════════════════════════════════

const About = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/about`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: AboutData) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 bg-[#1A1A1A] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden">
              {loading ? (
                <Shimmer className="w-full h-full" />
              ) : error || !data?.image?.url ? (
                <div className="w-full h-full bg-[#121212] flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Image not yet uploaded</span>
                </div>
              ) : (
                <img
                  src={data.image.url}
                  alt="Alhaji Adamu Muhammad Dokkal Khairu"
                  className="w-full h-full object-cover transition-all duration-700"
                />
              )}
            </div>
            {/* Decorative elements — preserved exactly */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-gold-500/30 z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-gold-500/10 z-0 translate-x-3 translate-y-3"></div>

            <div className="absolute bottom-10 -left-6 md:-left-12 bg-[#121212] p-6 border-l-4 border-gold-500 shadow-2xl z-10 max-w-xs">
              <p className="text-xl font-serif text-white italic">"True wealth is measured by the communities we elevate."</p>
            </div>
          </motion.div>

          {/* ── Right: Text ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-[1px] w-12 bg-gold-500"></div>
              <span className="text-gold-500 tracking-[0.2em] text-sm uppercase font-medium">A Visionary Philanthropist</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Shimmer className="h-12 w-3/4" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-5/6" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-4/5" />
              </div>
            ) : error ? (
              <p className="text-gray-500 italic">Content temporarily unavailable.</p>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">
                  {data?.heading || 'Architect of'}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Opportunity.</span>
                </h2>

                <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
                  {/* Split text on double-newlines to render separate paragraphs */}
                  {(data?.text || '')
                    .split('\n\n')
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl font-serif text-gold-500 mb-2">{data?.stat1Value || '—'}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest">{data?.stat1Label || ''}</div>
                  </div>
                  <div>
                    <div className="text-4xl font-serif text-gold-500 mb-2">{data?.stat2Value || '—'}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest">{data?.stat2Label || ''}</div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// Pillars (Impact) — API-driven; fetches from /api/impact on mount.
// Tab UI, AnimatePresence, icons, and layout are completely unchanged.
// Icons are keyed by slug (fixed mapping — they are UI, not content).
// ═════════════════════════════════════════════════════════════════════════════

const PILLAR_ICONS: Record<string, React.ReactNode> = {
  corporate: <Briefcase size={24} />,
  sports: <Trophy size={24} />,
  humanitarian: <Heart size={24} />,
};

const Pillars = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [pillars, setPillars] = useState<ImpactPillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/impact`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: ImpactPillar[]) => setPillars(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="impact" className="py-24 md:py-32 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="h-[1px] w-12 bg-gold-500"></div>
            <span className="text-gold-500 tracking-[0.2em] text-sm uppercase font-medium">Philanthropist Activities</span>
            <div className="h-[1px] w-12 bg-gold-500"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">The Pillars of <span className="text-gold-500">Impact</span></h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 flex flex-col space-y-4">
              {[0, 1, 2].map((i) => <Shimmer key={i} className="h-24 w-full" />)}
            </div>
            <div className="lg:col-span-8">
              <Shimmer className="aspect-video w-full" />
              <Shimmer className="h-32 w-full mt-4" />
            </div>
          </div>
        ) : error || pillars.length === 0 ? (
          <p className="text-center text-gray-500 italic">Impact content temporarily unavailable.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Tabs Navigation */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              {pillars.map((pillar, index) => (
                <button
                  key={pillar.slug}
                  onClick={() => setActiveTab(index)}
                  className={`text-left p-6 transition-all duration-300 border-l-4 flex items-start space-x-4
                    ${activeTab === index
                      ? 'bg-[#1A1A1A] border-gold-500 shadow-lg'
                      : 'border-transparent hover:bg-[#1A1A1A]/50 text-gray-500 hover:text-gray-300'
                    }`}
                >
                  <div className={`${activeTab === index ? 'text-gold-500' : 'text-gray-600'}`}>
                    {PILLAR_ICONS[pillar.slug] ?? <Briefcase size={24} />}
                  </div>
                  <div>
                    <h3 className={`text-xl font-serif font-bold mb-1 ${activeTab === index ? 'text-white' : ''}`}>
                      {pillar.title}
                    </h3>
                    <p className="text-sm tracking-widest uppercase text-gold-500/80">{pillar.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#1A1A1A] rounded-sm overflow-hidden border border-gray-800"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {pillars[activeTab]?.image?.url ? (
                      <img
                        src={pillars[activeTab].image.url}
                        alt={pillars[activeTab].title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#121212] flex items-center justify-center">
                        <span className="text-gray-600 text-sm">Image not yet uploaded</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent"></div>
                  </div>
                  <div className="p-8 md:p-12">
                    <h3 className="text-3xl font-serif font-bold text-white mb-6">
                      {pillars[activeTab]?.title}
                    </h3>
                    <p className="text-gray-400 text-lg font-light leading-relaxed mb-8">
                      {pillars[activeTab]?.content}
                    </p>
                    <a href="#contact" className="inline-flex items-center text-gold-500 hover:text-gold-400 tracking-widest uppercase text-sm font-medium group">
                      Learn More
                      <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// Media — API-driven; fetches from /api/media on mount.
// Slider UI, autoplay, dot indicators, AnimatePresence, and progress bar
// are completely unchanged. Section hides gracefully if the array is empty.
// ═════════════════════════════════════════════════════════════════════════════

const Media = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/media`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: MediaItem[]) => {
        setMediaItems(d);
        setCurrent(0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const total = mediaItems.length;

  useEffect(() => {
    if (!isAutoPlaying || total === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, total]);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
    setIsAutoPlaying(false);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % total);
    setIsAutoPlaying(false);
  };

  // Don't render section at all if there's nothing to show after loading
  if (!loading && (error || total === 0)) return null;

  return (
    <section id="media" className="py-24 md:py-32 bg-[#1A1A1A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-[1px] w-12 bg-gold-500"></div>
              <span className="text-gold-500 tracking-[0.2em] text-sm uppercase font-medium">Milestones</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Media & <span className="text-gold-500">Achievements</span></h2>
          </div>
          {/* Slide counter */}
          {!loading && total > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-serif text-gold-500 font-bold leading-none">{String(current + 1).padStart(2, '0')}</span>
              <div className="h-[1px] w-8 bg-gray-600"></div>
              <span className="text-gray-600 font-serif text-lg">{String(total).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Skeleton while loading */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
            <Shimmer className="lg:col-span-8 aspect-video" />
            <div className="lg:col-span-4 bg-[#121212] p-10 space-y-4">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-8 w-3/4" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-5/6" />
            </div>
          </div>
        ) : (
          /* Slider */
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden"
              >
                {/* Image / Video Panel */}
                <div className="lg:col-span-8 relative aspect-video lg:aspect-auto overflow-hidden bg-[#121212]" style={{ minHeight: '420px' }}>
                  {mediaItems[current]?.isVideo ? (
                    <video
                      key={mediaItems[current].media?.url}
                      src={mediaItems[current].media?.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={mediaItems[current]?.media?.url}
                      alt={mediaItems[current]?.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1A1A]/80 hidden lg:block"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 to-transparent lg:hidden"></div>

                  {mediaItems[current]?.isVideo && !mediaItems[current]?.media?.url && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 hover:text-gold-500 transition-colors cursor-pointer">
                      <PlayCircle size={72} strokeWidth={1} />
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-6 left-6 bg-gold-500/90 px-4 py-1.5 backdrop-blur-sm">
                    <span className="text-[#121212] text-xs tracking-widest uppercase font-semibold">
                      {mediaItems[current]?.category}
                    </span>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-4 bg-[#121212] flex flex-col justify-between p-10 md:p-12">
                  <div>
                    <p className="text-gold-500 tracking-widest text-xs uppercase font-medium mb-6">
                      {mediaItems[current]?.date}
                    </p>
                    <h3 className="text-3xl lg:text-4xl font-serif font-bold text-white leading-tight mb-6">
                      {mediaItems[current]?.title}
                    </h3>
                    <p className="text-gray-400 font-light leading-relaxed text-base">
                      {mediaItems[current]?.description}
                    </p>
                  </div>

                  {/* Nav Arrows */}
                  <div className="mt-12 flex items-center space-x-4">
                    <button
                      onClick={prev}
                      className="w-12 h-12 border border-gray-700 hover:border-gold-500 hover:bg-gold-500 hover:text-[#121212] text-white transition-all duration-300 flex items-center justify-center group"
                      aria-label="Previous slide"
                    >
                      <ArrowRight size={18} className="rotate-180" />
                    </button>
                    <button
                      onClick={next}
                      className="w-12 h-12 border border-gray-700 hover:border-gold-500 hover:bg-gold-500 hover:text-[#121212] text-white transition-all duration-300 flex items-center justify-center group"
                      aria-label="Next slide"
                    >
                      <ArrowRight size={18} />
                    </button>

                    {/* Dot indicators */}
                    <div className="flex items-center space-x-2 ml-4">
                      {mediaItems.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i)}
                          className={`transition-all duration-300 rounded-full ${
                            i === current
                              ? 'w-6 h-2 bg-gold-500'
                              : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="mt-1 h-[2px] bg-gray-800 overflow-hidden">
              <motion.div
                key={`progress-${current}`}
                className="h-full bg-gold-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// Contact — unchanged (no images, no API dependency)
// ═════════════════════════════════════════════════════════════════════════════

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Thank you. Your inquiry has been received by our executive office.');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#121212] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold-500/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-[1px] w-12 bg-gold-500"></div>
              <span className="text-gold-500 tracking-[0.2em] text-sm uppercase font-medium">Executive Office</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">
              Initiate a <span className="text-gold-500">Partnership</span>.
            </h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed mb-12 max-w-md">
              For corporate inquiries, sports administration discussions, or philanthropic partnerships, please reach out to the executive office.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#1A1A1A] text-gold-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1 uppercase tracking-widest text-sm">Headquarters</h4>
                  <p className="text-gray-400 font-light">Osun State, Nigeria</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#1A1A1A] text-gold-500">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1 uppercase tracking-widest text-sm">Direct Inquiries</h4>
                  <p className="text-gray-400 font-light">contact@dokkalkhairu.com.ng</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#1A1A1A] p-8 md:p-12 border border-gray-800"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs tracking-widest uppercase text-gray-500">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#121212] border border-gray-800 focus:border-gold-500 text-white px-4 py-3 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs tracking-widest uppercase text-gray-500">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#121212] border border-gray-800 focus:border-gold-500 text-white px-4 py-3 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs tracking-widest uppercase text-gray-500">Inquiry Type</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#121212] border border-gray-800 focus:border-gold-500 text-white px-4 py-3 outline-none transition-colors appearance-none"
                >
                  <option value="" disabled>Select subject...</option>
                  <option value="corporate">Corporate & Mining</option>
                  <option value="sports">Sports & FC Partnerships</option>
                  <option value="philanthropy">Philanthropy & Grants</option>
                  <option value="media">Media & Press</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs tracking-widest uppercase text-gray-500">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-gold-500 text-white px-4 py-3 outline-none transition-colors resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-500 text-[#121212] hover:bg-gold-400 font-medium tracking-widest uppercase py-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Transmitting...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// Footer — unchanged; uses logo only
// ═════════════════════════════════════════════════════════════════════════════

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] py-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">

        <div className="text-center md:text-left">
          <a href="#" className="inline-block mb-4">
            <img src={logoUrl} alt="Dokkal Khairu Logo" className="h-28 w-auto object-contain" />
          </a>
          <p className="text-gray-500 text-sm font-light">
            &copy; {new Date().getFullYear()} Dokkal Khairu Nigeria Ltd. All Rights Reserved.
          </p>
        </div>

        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-gold-500 transition-colors">
            <span className="sr-only">LinkedIn</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gold-500 transition-colors">
            <span className="sr-only">Twitter</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gold-500 transition-colors">
            <span className="sr-only">Instagram</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// Main site layout (renders at "/")
// ═════════════════════════════════════════════════════════════════════════════

const MainSite = () => (
  <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-gold-500 selection:text-[#121212] overflow-x-hidden scroll-smooth">
    <Navbar />
    <Hero />
    <About />
    <Pillars />
    <Media />
    <Contact />
    <Footer />
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// App root — BrowserRouter wraps both the main site and the /admin panel
// ═════════════════════════════════════════════════════════════════════════════

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected admin panel — lazy-loaded, separate from the public bundle */}
        <Route path="/admin" element={<AdminPanel />} />
        {/* Public-facing site */}
        <Route path="/" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}
