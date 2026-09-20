import React from 'react';
import { useApp } from '../context/AppContext';
import { TurnitScopeLogo } from './TurnitScopeLogo';
import {
  LayoutDashboard,
  FileText,
  Ticket,
  Coins,
  ShieldCheck,
  LogOut,
  Edit3,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export const ClientSidebar: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setActivePanel,
    setIsProfileModalOpen,
    signOutAuth,
    isSidebarOpen,
    toggleSidebar,
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'redeem', label: 'Redeem Code', icon: Ticket },
  ] as const;

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-screen select-none sticky top-0 transition-all duration-200 z-20 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
      id="client-sidebar"
    >
      {/* Top Section: Logo & Nav */}
      <div>
        {/* Logo & Toggle Header */}
        <div
          className={`border-b border-slate-100 flex items-center transition-all duration-200 ${
            isSidebarOpen ? 'p-4 justify-between gap-2' : 'p-3 flex-col gap-3 justify-center'
          }`}
        >
          {isSidebarOpen ? (
            <>
              <TurnitScopeLogo size="md" showSubtitle={true} subtitle="Academic Integrity" />
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition shrink-0"
                title="Close sidebar"
                id="btn-sidebar-toggle-close"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <TurnitScopeLogo size="sm" iconOnly={true} />
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                title="Open sidebar"
                id="btn-sidebar-toggle-open"
                aria-label="Open sidebar"
              >
                <PanelLeftOpen className="w-5 h-5 text-indigo-600" />
              </button>
            </>
          )}
        </div>

        {/* Navigation items */}
        <nav className={`space-y-1.5 transition-all duration-200 ${isSidebarOpen ? 'p-4' : 'p-2'}`} id="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                title={!isSidebarOpen ? item.label : undefined}
                className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isSidebarOpen ? 'gap-3.5 px-4 py-3' : 'justify-center p-3'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Credits Bar & User Profile */}
      <div className={`space-y-3 border-t border-slate-100 transition-all duration-200 ${isSidebarOpen ? 'p-4' : 'p-2'}`}>
        {/* Credits Status Pill */}
        <div
          onClick={() => setActiveTab('redeem')}
          className={`bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100/80 rounded-xl cursor-pointer transition flex items-center group ${
            isSidebarOpen ? 'p-3 justify-between' : 'p-2 flex-col justify-center text-center'
          }`}
          id="sidebar-credits-box"
          title={isSidebarOpen ? 'Click to redeem activation code' : `${currentUser.credits} Credits Available`}
        >
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-base">💰</span>
                <span className="text-xs font-semibold text-slate-700">Credits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-indigo-700">
                  {currentUser.credits}
                </span>
                <span className="text-[10px] text-indigo-500 font-medium group-hover:underline">
                  +Add
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm">💰</span>
              <span className="text-[11px] font-extrabold text-indigo-700">
                {currentUser.credits}
              </span>
            </div>
          )}
        </div>

        {/* User Profile Card */}
        {isSidebarOpen ? (
          <div
            className="p-3 bg-slate-50/90 hover:bg-indigo-50/40 rounded-2xl border border-slate-200/80 hover:border-indigo-200 space-y-2.5 transition group"
            id="sidebar-user-card"
          >
            <div
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              title="Click to view & edit your profile"
            >
              <div className="relative shrink-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border border-indigo-200 group-hover:ring-2 ring-indigo-400 transition"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                {currentUser.emailVerified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5 ring-1 ring-white" title="Verified User">
                    <ShieldCheck className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition">
                    {currentUser.name}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-indigo-600 p-1 rounded transition"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser.academicTitle || currentUser.institution || currentUser.email}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-[11px]">
              <span className="font-semibold text-slate-600 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-slate-900">{currentUser.credits}</span> Credits
              </span>
              <button
                onClick={() => signOutAuth()}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
                title="Sign Out"
                id="sidebar-signout-btn"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="relative p-0.5 rounded-full hover:ring-2 ring-indigo-400 transition"
              title={`${currentUser.name} - View Profile`}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </button>
            <button
              onClick={() => signOutAuth()}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
