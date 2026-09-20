import React, { useState, useRef, useEffect } from 'react';
import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useApp } from '../context/AppContext';
import { auth, db, safeSetDoc, cleanFirestoreData } from '../lib/firebase';
import {
  X,
  User as UserIcon,
  Mail,
  Building,
  GraduationCap,
  Phone,
  FileText,
  Camera,
  Check,
  ShieldCheck,
  Coins,
  Ticket,
  Sparkles,
  Loader2,
  Calendar,
  Award,
  Upload,
  RefreshCw,
} from 'lucide-react';

const AVATAR_PRESETS = [
  { id: 'scholar-1', label: 'Scholar Male', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'scholar-2', label: 'Scholar Female', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { id: 'researcher', label: 'Researcher', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'professor', label: 'Professor', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'fellow', label: 'Fellow', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
];

export const ProfileEditModal: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    isProfileModalOpen,
    setIsProfileModalOpen,
    setActiveTab,
    setNotification,
  } = useApp();

  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [photoURL, setPhotoURL] = useState<string | null>(currentUser.photoURL || null);
  const [academicTitle, setAcademicTitle] = useState(currentUser.academicTitle || '');
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [bio, setBio] = useState(currentUser.bio || '');

  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setModalTab] = useState<'details' | 'quota'>('details');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal is opened or currentUser updates
  useEffect(() => {
    if (isProfileModalOpen) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhotoURL(currentUser.photoURL || null);
      setAcademicTitle(currentUser.academicTitle || '');
      setInstitution(currentUser.institution || '');
      setDepartment(currentUser.department || '');
      setPhone(currentUser.phone || '');
      setBio(currentUser.bio || '');
    }
  }, [isProfileModalOpen, currentUser]);

  if (!isProfileModalOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setNotification({ message: 'Name cannot be empty', type: 'error' });
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setNotification({ message: 'Please enter a valid email address', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      // 1. Use updateProfile from Firebase Auth to sync the user's display name and photoURL
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: cleanName,
            photoURL: photoURL || null,
          });
        } catch (authProfileErr) {
          console.warn('Firebase Auth updateProfile warning:', authProfileErr);
        }

        // Sync email with Firebase Auth if it was changed
        if (cleanEmail.toLowerCase() !== (auth.currentUser.email || '').toLowerCase()) {
          try {
            await updateEmail(auth.currentUser, cleanEmail);
          } catch (authEmailErr: any) {
            console.warn('Firebase Auth updateEmail notice (re-authentication may be required):', authEmailErr);
          }
        }
      }

      // 2. Prepare updated user payload
      const targetUserId = auth.currentUser?.uid || currentUser.id;
      const profileUpdates = {
        name: cleanName,
        email: cleanEmail,
        photoURL: photoURL || null,
        academicTitle: academicTitle.trim() || undefined,
        institution: institution.trim() || undefined,
        department: department.trim() || undefined,
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };

      // 3. Update the Firestore user document directly to ensure 'Save Changes' persists accurately
      const userDocRef = doc(db, 'users', targetUserId);
      const sanitizedDocData = cleanFirestoreData({
        ...profileUpdates,
        id: targetUserId,
      });

      try {
        await setDoc(userDocRef, sanitizedDocData, { merge: true });
      } catch (firestoreErr) {
        console.warn('Primary setDoc failed, attempting safeSetDoc fallback:', firestoreErr);
        await safeSetDoc(userDocRef, sanitizedDocData, { merge: true });
      }

      // 4. Update the AppContext, local state, and localStorage
      await updateCurrentUser(profileUpdates);

      setNotification({ message: 'Academic profile updated and synchronized successfully!', type: 'success' });
      setIsProfileModalOpen(false);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setNotification({ message: err?.message || 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setNotification({ message: 'Avatar image must be under 2MB', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoURL(reader.result);
        setShowUrlInput(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const applyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setPhotoURL(customUrlInput.trim());
      setCustomUrlInput('');
      setShowUrlInput(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      id="profile-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsProfileModalOpen(false);
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        id="profile-edit-dialog"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Academic Profile & Account
              </h2>
              <p className="text-xs text-slate-500">
                Update researcher credentials, institutional identity, and preferences
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            id="btn-close-profile-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-xs font-bold">
          <button
            onClick={() => setModalTab('details')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile Details</span>
          </button>
          <button
            onClick={() => setModalTab('quota')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'quota'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Plan & Scan Quota ({currentUser.credits} Credits)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' ? (
            <form onSubmit={handleSave} className="space-y-6" id="profile-edit-form">
              {/* Avatar Picker Section */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Profile Photo & Academic Avatar
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Current Avatar */}
                  <div className="relative shrink-0">
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    {currentUser.emailVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 ring-2 ring-white" title="Verified Researcher">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Actions & Presets */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-500">Presets:</span>
                      {AVATAR_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setPhotoURL(preset.url);
                            setShowUrlInput(false);
                          }}
                          className={`w-7 h-7 rounded-xl overflow-hidden ring-1 transition cursor-pointer hover:scale-105 ${
                            photoURL === preset.url ? 'ring-2 ring-indigo-600 ring-offset-1' : 'ring-slate-200'
                          }`}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setPhotoURL(null)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                          photoURL === null
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                        title="Use Initial Avatar"
                      >
                        Initials
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Upload Photo</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>Image URL</span>
                      </button>
                    </div>

                    {showUrlInput && (
                      <div className="flex items-center gap-2 pt-1 animate-in fade-in">
                        <input
                          type="url"
                          placeholder="https://example.com/avatar.jpg"
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={applyCustomUrl}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prof. Kunal Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                    id="input-profile-name"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Email Address *</span>
                    </span>
                    {currentUser.emailVerified && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5" title="Authenticated Researcher">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@university.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                    id="input-profile-email"
                  />
                </div>

                {/* Academic Title / Position */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Academic Role / Title</span>
                  </label>
                  <input
                    type="text"
                    value={academicTitle}
                    onChange={(e) => setAcademicTitle(e.target.value)}
                    placeholder="e.g. Senior Lecturer / Lead Researcher"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    id="input-profile-title"
                  />
                </div>

                {/* Phone / Contact */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Contact Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    id="input-profile-phone"
                  />
                </div>

                {/* Institution / University */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Institution / University</span>
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    id="input-profile-institution"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Department / Faculty</span>
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Department of Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    id="input-profile-department"
                  />
                </div>
              </div>

              {/* Bio / Research Interests */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Academic Bio & Research Scope</span>
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize your academic focus, research topics, or publication integrity guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                  id="input-profile-bio"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                  id="btn-save-profile"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Quota & Subscription Tab */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-1">
                    <Coins className="w-4 h-4" />
                    <span>Available Credits</span>
                  </div>
                  <p className="text-3xl font-black text-indigo-900">{currentUser.credits}</p>
                  <p className="text-[11px] text-indigo-700/80 mt-1">1 scan = 1 credit</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-1">
                    <Award className="w-4 h-4" />
                    <span>Active Tier</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-950 truncate">{currentUser.planName}</p>
                  <p className="text-[11px] text-emerald-700/80 mt-1">Valid thru {currentUser.planExpiry}</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600 text-xs font-bold mb-1">
                    <FileText className="w-4 h-4" />
                    <span>Scans Conducted</span>
                  </div>
                  <p className="text-3xl font-black text-purple-900">{currentUser.totalScans}</p>
                  <p className="text-[11px] text-purple-700/80 mt-1">Lifetime total</p>
                </div>
              </div>

              {/* Account Security Information */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Security & Authentication Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-slate-500">Sign-in Method:</span>
                    <span className="font-bold text-slate-800 uppercase text-[11px]">
                      {currentUser.authProvider || 'Email/Password'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-slate-500">Account ID:</span>
                    <span className="font-mono text-[10px] text-slate-600 truncate max-w-[150px]">
                      {currentUser.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-slate-500">Member Since:</span>
                    <span className="font-semibold text-slate-800">
                      {currentUser.createdAt}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-slate-500">Role Authority:</span>
                    <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                      currentUser.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Redeem Promo Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-white">Need Additional Credits?</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Have an institutional promo code or grant voucher? Redeem it instantly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    setActiveTab('redeem');
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition shrink-0 cursor-pointer shadow-sm"
                >
                  Redeem Code →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
