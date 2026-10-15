import React, { useState } from 'react';
import { Bell, Plus, Trash2, AlertTriangle, CheckCircle, Tag, X, Send } from 'lucide-react';
import { Announcement } from '../../types';

interface AnnouncementManagerProps {
  announcements: Announcement[];
  onCreateAnnouncement: (data: Omit<Announcement, 'id' | 'postedDate'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  userRole: string;
  userName: string;
}

export const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({
  announcements,
  onCreateAnnouncement,
  onDeleteAnnouncement,
  userRole,
  userName
}) => {
  const [filterRole, setFilterRole] = useState<'all' | 'teachers' | 'students' | 'parents'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState<'all' | 'teachers' | 'students' | 'parents'>('all');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  const filtered = announcements.filter(a => {
    if (filterRole === 'all') return true;
    return a.targetRole === filterRole || a.targetRole === 'all';
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onCreateAnnouncement({
      title: title.trim(),
      content: content.trim(),
      targetRole,
      priority,
      authorName: userName,
      authorRole: userRole.toUpperCase()
    });

    setTitle('');
    setContent('');
    setIsCreateOpen(false);
  };

  const isAdminOrTeacher = userRole === 'admin' || userRole === 'teacher';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Announcements & School Bulletins
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official communications dispatched to faculty, students, and guardians
          </p>
        </div>

        {isAdminOrTeacher && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* Audience Filter Bar */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs w-fit">
        <span className="text-slate-500 px-2 font-medium">Target Audience:</span>
        {(['all', 'teachers', 'students', 'parents'] as const).map(role => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
              filterRole === role
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {role === 'all' ? 'All Bulletins' : role}
          </button>
        ))}
      </div>

      {/* Bulletins List */}
      <div className="space-y-3">
        {filtered.map(ann => {
          const isUrgent = ann.priority === 'urgent';
          const isHigh = ann.priority === 'high';

          return (
            <div
              key={ann.id}
              className={`p-4 rounded-lg border bg-white text-xs space-y-2 transition-all ${
                isUrgent ? 'border-rose-300 shadow-xs' : isHigh ? 'border-amber-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  {isUrgent && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    {ann.postedDate}
                  </span>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed text-xs">{ann.content}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Posted by: <strong>{ann.authorName}</strong> ({ann.authorRole})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="capitalize">Target: {ann.targetRole}</span>
                  <span>·</span>
                  <span
                    className={`font-semibold capitalize ${
                      isUrgent ? 'text-rose-600' : isHigh ? 'text-amber-600' : 'text-slate-600'
                    }`}
                  >
                    Priority: {ann.priority}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Announcement Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-lg w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Draft New School Bulletin</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End of Term Examination Schedule"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Target Audience</label>
                  <select
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                  >
                    <option value="all">All Stakeholders</option>
                    <option value="teachers">Teaching Faculty Only</option>
                    <option value="students">Students Only</option>
                    <option value="parents">Parents / Guardians Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                  >
                    <option value="normal">Normal Information</option>
                    <option value="high">High Importance</option>
                    <option value="urgent">Urgent / Critical Notice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Notice Body Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details, instructions, room locations, or deadlines..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
