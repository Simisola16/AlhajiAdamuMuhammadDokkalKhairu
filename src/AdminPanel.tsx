import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  LogOut, 
  Upload, 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Video, 
  Image as ImageIcon,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import logoUrl from '../assets/alhajilogo.png';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

// --- Validation helper ---
const validateFile = (file: File, isVideoAllowed = false) => {
  const allowedImageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov', 'video/avi'];
  
  const maxImageSize = 10 * 1024 * 1024; // 10MB
  const maxVideoSize = 100 * 1024 * 1024; // 100MB

  const isImage = allowedImageMimes.includes(file.type);
  const isVideo = allowedVideoMimes.includes(file.type) || file.name.endsWith('.mov') || file.name.endsWith('.avi');

  if (!isImage && (!isVideoAllowed || !isVideo)) {
    if (isVideoAllowed) {
      return 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF images, and MP4, WebM, MOV videos.';
    }
    return 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF images.';
  }

  if (isImage && file.size > maxImageSize) {
    return 'Image size exceeds the 10 MB limit.';
  }

  if (isVideo && file.size > maxVideoSize) {
    return 'Video size exceeds the 100 MB limit.';
  }

  return null;
};

// --- Toast notification helper ---
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'about' | 'impact' | 'media'>('about');
  const [activeImpactSlug, setActiveImpactSlug] = useState<'corporate' | 'sports' | 'humanitarian'>('corporate');

  // Data states
  const [aboutData, setAboutData] = useState<any>(null);
  const [impactData, setImpactData] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Form states - About
  const [aboutHeading, setAboutHeading] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [aboutStat1Label, setAboutStat1Label] = useState('');
  const [aboutStat1Value, setAboutStat1Value] = useState('');
  const [aboutStat2Label, setAboutStat2Label] = useState('');
  const [aboutStat2Value, setAboutStat2Value] = useState('');
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState<string>('');

  // Form states - Impact (per-slug)
  const [impactTitle, setImpactTitle] = useState('');
  const [impactSubtitle, setImpactSubtitle] = useState('');
  const [impactContent, setImpactContent] = useState('');
  const [impactImageFile, setImpactImageFile] = useState<File | null>(null);
  const [impactImagePreview, setImpactImagePreview] = useState<string>('');

  // Form states - Media (Modal)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMediaItem, setEditingMediaItem] = useState<any>(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState('Sports');
  const [mediaDate, setMediaDate] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaFilePreview, setMediaFilePreview] = useState<string>('');
  const [mediaIsVideo, setMediaIsVideo] = useState(false);

  // Delete modal states
  const [deletingMediaItem, setDeletingMediaItem] = useState<any>(null);

  // UI state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Auth Check ---
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/check`, {
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      setIsAuthenticated(!!data.authenticated);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // --- Load Data ---
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // About
      const resAbout = await fetch(`${API_BASE}/api/about`);
      if (resAbout.ok) {
        const data = await resAbout.json();
        setAboutData(data);
        populateAboutForm(data);
      }

      // Impact
      const resImpact = await fetch(`${API_BASE}/api/impact`);
      if (resImpact.ok) {
        const data = await resImpact.json();
        setImpactData(data);
        populateImpactForm(data, activeImpactSlug);
      }

      // Media
      const resMedia = await fetch(`${API_BASE}/api/media`);
      if (resMedia.ok) {
        const data = await resMedia.json();
        setMediaItems(data);
      }
    } catch (err) {
      addToast('error', 'Failed to load panel data. Please check connection.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const populateAboutForm = (data: any) => {
    if (!data) return;
    setAboutHeading(data.heading || '');
    setAboutText(data.text || '');
    setAboutStat1Label(data.stat1Label || '');
    setAboutStat1Value(data.stat1Value || '');
    setAboutStat2Label(data.stat2Label || '');
    setAboutStat2Value(data.stat2Value || '');
    setAboutImagePreview(data.image?.url || '');
    setAboutImageFile(null);
  };

  const populateImpactForm = (dataList: any[], slug: string) => {
    const item = dataList.find((x) => x.slug === slug);
    if (item) {
      setImpactTitle(item.title || '');
      setImpactSubtitle(item.subtitle || '');
      setImpactContent(item.content || '');
      setImpactImagePreview(item.image?.url || '');
      setImpactImageFile(null);
    }
  };

  // Trigger when impact sub-tab changes
  useEffect(() => {
    if (impactData.length > 0) {
      populateImpactForm(impactData, activeImpactSlug);
    }
  }, [activeImpactSlug, impactData]);

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        addToast('success', 'Logged in successfully!');
      } else {
        const data = await res.json();
        setAuthError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setAuthError('Connection error. Is backend running?');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
      setIsAuthenticated(false);
      addToast('info', 'Logged out.');
    } catch (err) {
      addToast('error', 'Logout request failed.');
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('heading', aboutHeading);
      formData.append('text', aboutText);
      formData.append('stat1Label', aboutStat1Label);
      formData.append('stat1Value', aboutStat1Value);
      formData.append('stat2Label', aboutStat2Label);
      formData.append('stat2Value', aboutStat2Value);
      if (aboutImageFile) {
        formData.append('image', aboutImageFile);
      }

      const res = await fetch(`${API_BASE}/api/about`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setAboutData(updated);
        populateAboutForm(updated);
        addToast('success', 'About section updated successfully!');
      } else {
        const err = await res.json();
        addToast('error', err.message || 'Failed to update About section.');
      }
    } catch (err) {
      addToast('error', 'Network error while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImpactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', impactTitle);
      formData.append('subtitle', impactSubtitle);
      formData.append('content', impactContent);
      if (impactImageFile) {
        formData.append('image', impactImageFile);
      }

      const res = await fetch(`${API_BASE}/api/impact/${activeImpactSlug}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        // Update local list
        setImpactData((prev) =>
          prev.map((x) => (x.slug === activeImpactSlug ? updated : x))
        );
        addToast('success', `${activeImpactSlug.toUpperCase()} pillar updated!`);
      } else {
        const err = await res.json();
        addToast('error', err.message || 'Failed to update pillar.');
      }
    } catch (err) {
      addToast('error', 'Network error while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Media Modal Actions ---
  const openAddMediaModal = () => {
    setEditingMediaItem(null);
    setMediaTitle('');
    setMediaCategory('Sports');
    setMediaDate('');
    setMediaDescription('');
    setMediaFile(null);
    setMediaFilePreview('');
    setMediaIsVideo(false);
    setIsMediaModalOpen(true);
  };

  const openEditMediaModal = (item: any) => {
    setEditingMediaItem(item);
    setMediaTitle(item.title || '');
    setMediaCategory(item.category || 'Sports');
    setMediaDate(item.date || '');
    setMediaDescription(item.description || '');
    setMediaFile(null);
    setMediaFilePreview(item.media?.url || '');
    setMediaIsVideo(item.isVideo || false);
    setIsMediaModalOpen(true);
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMediaItem && !mediaFile) {
      addToast('error', 'Please upload an image or video file.');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', mediaTitle);
      formData.append('category', mediaCategory);
      formData.append('date', mediaDate);
      formData.append('description', mediaDescription);
      if (mediaFile) {
        formData.append('media', mediaFile);
      }

      const isEdit = !!editingMediaItem;
      const url = isEdit 
        ? `${API_BASE}/api/media/${editingMediaItem._id}`
        : `${API_BASE}/api/media`;
      
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const savedItem = await res.json();
        if (isEdit) {
          setMediaItems((prev) => prev.map((x) => (x._id === savedItem._id ? savedItem : x)));
          addToast('success', 'Media item updated!');
        } else {
          setMediaItems((prev) => [savedItem, ...prev]);
          addToast('success', 'New media item added!');
        }
        setIsMediaModalOpen(false);
      } else {
        const err = await res.json();
        addToast('error', err.message || 'Failed to save media item.');
      }
    } catch (err) {
      addToast('error', 'Network error saving media.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaDelete = async () => {
    if (!deletingMediaItem) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/media/${deletingMediaItem._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMediaItems((prev) => prev.filter((x) => x._id !== deletingMediaItem._id));
        addToast('success', 'Media item deleted.');
        setDeletingMediaItem(null);
      } else {
        const err = await res.json();
        addToast('error', err.message || 'Failed to delete media item.');
      }
    } catch (err) {
      addToast('error', 'Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Dropzone Handlers ---
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'about' | 'impact' | 'media'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    const isVideoAllowed = type === 'media';
    const validationError = validateFile(file, isVideoAllowed);
    if (validationError) {
      addToast('error', validationError);
      e.target.value = ''; // Reset input
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === 'about') {
      setAboutImageFile(file);
      setAboutImagePreview(previewUrl);
    } else if (type === 'impact') {
      setImpactImageFile(file);
      setImpactImagePreview(previewUrl);
    } else if (type === 'media') {
      setMediaFile(file);
      setMediaFilePreview(previewUrl);
      setMediaIsVideo(file.type.startsWith('video/'));
    }
  };

  // --- Loader Screen ---
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-gold-500" />
          <p className="text-gray-400 text-sm tracking-widest uppercase">Authenticating...</p>
        </div>
      </div>
    );
  }

  // --- Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 relative overflow-hidden font-sans text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#1A1A1A]/85 backdrop-blur-md border border-gray-800 rounded-lg p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <img src={logoUrl} alt="Dokkal Khairu Logo" className="h-24 w-auto object-contain mb-4" />
            <h2 className="text-2xl font-serif font-semibold tracking-wide text-white">Content Manager</h2>
            <p className="text-gold-500 text-xs tracking-widest uppercase mt-1">Admin Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-sm flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@dokkalkhairu.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none rounded text-white text-sm transition-all placeholder:text-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none rounded text-white text-sm transition-all placeholder:text-gray-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gold-500 text-[#121212] font-semibold tracking-widest uppercase text-sm py-3 px-4 hover:bg-gold-400 transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Main Dashboard Screen ---
  return (
    <div className="min-h-screen bg-[#121212] font-sans text-gray-200 flex flex-col relative pb-12">
      {/* Toast Overlay */}
      <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`p-4 rounded shadow-xl border cursor-pointer flex items-start space-x-3 text-sm animate-slide-in ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-800/80 text-emerald-400'
                : toast.type === 'error'
                ? 'bg-red-950/90 border-red-800/80 text-red-400'
                : 'bg-zinc-900/90 border-zinc-800/80 text-zinc-300'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <span className="flex-1">{toast.message}</span>
            <button className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-gray-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={logoUrl} alt="Logo" className="h-14 w-auto object-contain" />
            <div>
              <h1 className="text-lg font-serif font-bold text-white leading-tight">Alhaji Adamu Muhammad</h1>
              <p className="text-gold-500 text-xs tracking-widest uppercase">Content Manager</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gray-400 hover:text-gold-500 flex items-center space-x-1 transition-colors px-3 py-1.5 border border-gray-800 rounded bg-[#121212]"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors flex items-center space-x-1 text-sm bg-gray-900/60 hover:bg-red-950/20 px-3 py-1.5 border border-gray-800 hover:border-red-900/50 rounded cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`w-full text-left px-4 py-3.5 rounded transition-all flex items-center justify-between border ${
              activeTab === 'about'
                ? 'bg-gold-500/10 border-gold-500/30 text-gold-400 font-medium'
                : 'bg-[#1A1A1A]/50 border-gray-900 hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            <span>About Profile</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'about' ? 'rotate-90' : ''}`} />
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`w-full text-left px-4 py-3.5 rounded transition-all flex items-center justify-between border ${
              activeTab === 'impact'
                ? 'bg-gold-500/10 border-gold-500/30 text-gold-400 font-medium'
                : 'bg-[#1A1A1A]/50 border-gray-900 hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            <span>Impact Pillars</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'impact' ? 'rotate-90' : ''}`} />
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full text-left px-4 py-3.5 rounded transition-all flex items-center justify-between border ${
              activeTab === 'media'
                ? 'bg-gold-500/10 border-gold-500/30 text-gold-400 font-medium'
                : 'bg-[#1A1A1A]/50 border-gray-900 hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            <span>Media Gallery</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'media' ? 'rotate-90' : ''}`} />
          </button>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 bg-[#1A1A1A]/40 border border-gray-800 rounded-lg p-6 lg:p-8 backdrop-blur-sm relative min-h-[500px]">
          {isLoadingData ? (
            <div className="absolute inset-0 bg-[#121212]/50 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
            </div>
          ) : null}

          {/* TAB: ABOUT */}
          {activeTab === 'about' && (
            <form onSubmit={handleAboutSubmit} className="space-y-8">
              <div className="border-b border-gray-800 pb-4">
                <h2 className="text-xl font-serif text-white font-medium">About Section</h2>
                <p className="text-xs text-gray-500 mt-1">Configure profile photo, heading statement, bio texts, and highlights stats.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Image upload column */}
                <div className="md:col-span-4 flex flex-col space-y-4">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium">Profile Image</label>
                  <div className="relative aspect-[3/4] w-full rounded border border-gray-800 overflow-hidden bg-gray-950 flex items-center justify-center group">
                    {aboutImagePreview ? (
                      <img src={aboutImagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-700" />
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="w-8 h-8 text-gold-500 mb-2" />
                      <span className="text-xs text-gray-300">Replace Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'about')}
                      />
                    </label>
                  </div>
                  {aboutImageFile && (
                    <div className="text-xs text-gold-500 bg-gold-950/20 border border-gold-900/50 p-2 rounded flex items-center justify-between">
                      <span className="truncate max-w-[180px]">{aboutImageFile.name}</span>
                      <button type="button" onClick={() => { setAboutImageFile(null); setAboutImagePreview(aboutData?.image?.url || ''); }} className="hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-600">Supports JPEG, PNG, WebP, GIF. Max 10MB.</p>
                </div>

                {/* Form fields column */}
                <div className="md:col-span-8 space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Heading Quote / Tagline</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-900/40 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                      value={aboutHeading}
                      onChange={(e) => setAboutHeading(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Biography Content (Use newlines for paragraphs)</label>
                    <textarea
                      rows={8}
                      className="w-full px-4 py-3 bg-gray-900/40 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm leading-relaxed"
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                    />
                  </div>

                  {/* Highlights Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                    <div className="space-y-4">
                      <h4 className="text-xs text-gold-500 uppercase tracking-widest font-semibold">Stat Box 1</h4>
                      <div>
                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Value (e.g. 2026)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-900/40 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                          value={aboutStat1Value}
                          onChange={(e) => setAboutStat1Value(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Label (e.g. Cup Champions)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-900/40 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                          value={aboutStat1Label}
                          onChange={(e) => setAboutStat1Label(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs text-gold-500 uppercase tracking-widest font-semibold">Stat Box 2</h4>
                      <div>
                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Value (e.g. 10k+)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-900/40 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                          value={aboutStat2Value}
                          onChange={(e) => setAboutStat2Value(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Label (e.g. Lives Impacted)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-900/40 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                          value={aboutStat2Label}
                          onChange={(e) => setAboutStat2Label(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-[#121212] font-semibold uppercase tracking-wider text-xs flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save About Section</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB: IMPACT */}
          {activeTab === 'impact' && (
            <div className="space-y-8">
              <div className="border-b border-gray-800 pb-4">
                <h2 className="text-xl font-serif text-white font-medium">Impact Pillars</h2>
                <p className="text-xs text-gray-500 mt-1">Manage the three strategic pillars of Alhaji Adamu Muhammad's operations.</p>
              </div>

              {/* Sub-tabs */}
              <div className="flex border-b border-gray-800">
                {(['corporate', 'sports', 'humanitarian'] as const).map((slug) => (
                  <button
                    key={slug}
                    onClick={() => setActiveImpactSlug(slug)}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                      activeImpactSlug === slug
                        ? 'border-gold-500 text-gold-400 font-bold bg-[#222222]/20'
                        : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-800'
                    }`}
                  >
                    {slug}
                  </button>
                ))}
              </div>

              <form onSubmit={handleImpactSubmit} className="space-y-8 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Image Column */}
                  <div className="md:col-span-4 flex flex-col space-y-4">
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium">Pillar Banner Image</label>
                    <div className="relative aspect-video w-full rounded border border-gray-800 overflow-hidden bg-gray-950 flex items-center justify-center group">
                      {impactImagePreview ? (
                        <img src={impactImagePreview} alt="Impact pillar" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-700" />
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="w-8 h-8 text-gold-500 mb-2" />
                        <span className="text-xs text-gray-300">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'impact')}
                        />
                      </label>
                    </div>
                    {impactImageFile && (
                      <div className="text-xs text-gold-500 bg-gold-950/20 border border-gold-900/50 p-2 rounded flex items-center justify-between">
                        <span className="truncate max-w-[180px]">{impactImageFile.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setImpactImageFile(null);
                            const orig = impactData.find((x) => x.slug === activeImpactSlug);
                            setImpactImagePreview(orig?.image?.url || '');
                          }}
                          className="hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-600">Supports JPEG, PNG, WebP, GIF. Max 10MB.</p>
                  </div>

                  {/* Fields Column */}
                  <div className="md:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Pillar Title</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 bg-gray-900/40 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                          value={impactTitle}
                          onChange={(e) => setImpactTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Subtitle / Organisation</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 bg-gray-900/40 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                          value={impactSubtitle}
                          onChange={(e) => setImpactSubtitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Pillar Body Content</label>
                      <textarea
                        rows={6}
                        required
                        className="w-full px-4 py-3 bg-gray-900/40 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm leading-relaxed"
                        value={impactContent}
                        onChange={(e) => setImpactContent(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-[#121212] font-semibold uppercase tracking-wider text-xs flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Save {activeImpactSlug.toUpperCase()} Pillar</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-serif text-white font-medium">Media Gallery</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage carousel/slide highlights of accomplishments, trophies, and events.</p>
                </div>
                <button
                  onClick={openAddMediaModal}
                  className="bg-gold-500 hover:bg-gold-400 text-[#121212] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded flex items-center space-x-1.5 transition-colors cursor-pointer shadow-lg shadow-gold-550/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Grid representation */}
              {mediaItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-lg py-16 text-gray-500">
                  <FileText className="w-12 h-12 mb-3 text-gray-700" />
                  <p className="text-sm font-medium">No media items in gallery.</p>
                  <p className="text-xs text-gray-600 mt-1">Click the "Add New" button to add an image or video.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {mediaItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-gray-900/30 border border-gray-800/80 rounded-md overflow-hidden flex flex-col group hover:border-gray-700/80 transition-all hover:-translate-y-0.5"
                    >
                      {/* Media container */}
                      <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                        {item.isVideo ? (
                          <>
                            <video
                              src={item.media?.url}
                              className="w-full h-full object-cover opacity-70"
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/60 w-10 h-10 rounded-full flex items-center justify-center text-gold-500 group-hover:scale-110 transition-transform">
                                <Video className="w-5 h-5 pl-0.5" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img
                            src={item.media?.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm text-gold-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>

                      {/* Content panel */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-serif text-white font-medium text-sm line-clamp-1">{item.title}</h4>
                          <span className="text-[11px] text-gray-500">{item.date}</span>
                          {item.description && (
                            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{item.description}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-800/40">
                          <button
                            onClick={() => openEditMediaModal(item)}
                            className="p-1.5 text-gray-400 hover:text-gold-500 hover:bg-gray-800/50 rounded transition-colors cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingMediaItem(item)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* --- ADD/EDIT MEDIA MODAL --- */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center bg-[#1F1F1F]">
              <h3 className="font-serif text-white text-base font-semibold">
                {editingMediaItem ? 'Edit Media Highlight' : 'Add Media Highlight'}
              </h3>
              <button onClick={() => setIsMediaModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMediaSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Highlight Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Federation Cup Victory"
                  className="w-full px-4 py-2.5 bg-gray-900/60 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Category</label>
                  <select
                    className="w-full px-4 py-2.5 bg-gray-900/60 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                    value={mediaCategory}
                    onChange={(e) => setMediaCategory(e.target.value)}
                  >
                    <option value="Sports">Sports</option>
                    <option value="Sports Excellence">Sports Excellence</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Philanthropy">Philanthropy</option>
                    <option value="Community">Community</option>
                    <option value="Travel">Travel</option>
                    <option value="Club Gallery">Club Gallery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Season / Date Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Season 2025/2026 or June 2026"
                    className="w-full px-4 py-2.5 bg-gray-900/60 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                    value={mediaDate}
                    onChange={(e) => setMediaDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Provide a brief context or description..."
                  className="w-full px-4 py-2.5 bg-gray-900/60 border border-gray-800 focus:border-gold-500 outline-none rounded text-white text-sm"
                  value={mediaDescription}
                  onChange={(e) => setMediaDescription(e.target.value)}
                />
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">Media File (Image or Video)</label>
                <div className="relative border border-dashed border-gray-800 rounded bg-gray-900/30 p-6 flex flex-col items-center justify-center hover:border-gold-500/50 transition-colors">
                  {mediaFilePreview ? (
                    <div className="relative w-full aspect-video rounded overflow-hidden bg-black flex items-center justify-center">
                      {mediaIsVideo ? (
                        <video src={mediaFilePreview} className="w-full h-full object-contain" controls />
                      ) : (
                        <img src={mediaFilePreview} alt="Preview" className="w-full h-full object-contain" />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMediaFile(null);
                          setMediaFilePreview(editingMediaItem?.media?.url || '');
                          setMediaIsVideo(editingMediaItem?.isVideo || false);
                        }}
                        className="absolute top-2 right-2 bg-black/75 p-1 rounded-full text-gray-300 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-600 mb-2" />
                      <span className="text-xs text-gray-400">Drag & drop files here, or <label className="text-gold-500 hover:underline cursor-pointer">browse<input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleFileChange(e, 'media')} /></label></span>
                    </>
                  )}
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                  <span>Images: JPEG, PNG, WebP, GIF (Max 10MB)</span>
                  <span>Videos: MP4, WebM, MOV, AVI (Max 100MB)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end space-x-3 bg-opacity-0">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-4 py-2 border border-gray-800 hover:bg-gray-800 hover:text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-[#121212] font-semibold rounded text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save highlight</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {deletingMediaItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-2xl max-w-sm w-full overflow-hidden p-6 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-900/50 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-white text-base font-semibold">Delete Media Highlight?</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">"{deletingMediaItem.title}"</strong>?<br />
                This action will delete it from Cloudinary and cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => setDeletingMediaItem(null)}
                className="px-4 py-2 border border-gray-800 hover:bg-gray-800 hover:text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMediaDelete}
                disabled={isSaving}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center space-x-1 disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
