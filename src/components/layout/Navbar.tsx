import React from 'react';
import {
  GraduationCap,
  Users,
  CalendarCheck,
  Award,
  Calendar,
  CreditCard,
  Bell,
  Database,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { Role, User } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  onSwitchRole: (role: Role) => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onSwitchRole,
  onResetDemo
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'grades', label: 'Grades & Report', icon: Award },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'fees', label: 'Fee Ledger', icon: CreditCard },
    { id: 'announcements', label: 'Notices', icon: Bell },
    { id: 'schema', label: 'Database & API', icon: Database }
  ];

  const roles: { role: Role; label: string; desc: string }[] = [
    { role: 'admin', label: 'Admin', desc: 'Full System Access' },
    { role: 'teacher', label: 'Teacher', desc: 'Faculty Portal' },
    { role: 'student', label: 'Student', desc: 'Student Portal' },
    { role: 'parent', label: 'Parent', desc: 'Guardian Portal' }
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                EP
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                  EduPulse SMS
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  Oakridge Academy
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Role Switcher & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Demo Role Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <span className="text-[11px] font-medium text-slate-500 px-1.5 hidden sm:inline">Role:</span>
              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => onSwitchRole(r.role)}
                  title={r.desc}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                    currentUser.role === r.role
                      ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Reset Seed Button */}
            <button
              onClick={onResetDemo}
              title="Reset Demo Data"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Avatar badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-1 ring-slate-300 shrink-0">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 text-xs">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
