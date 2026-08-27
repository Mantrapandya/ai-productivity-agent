import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Edit3 } from 'lucide-react';
import { FollowUpEmail } from '../types';

interface FollowUpEmailCardProps {
  email: FollowUpEmail;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}

export const FollowUpEmailCard: React.FC<FollowUpEmailCardProps> = ({
  email,
  onCopy,
  copiedLabel,
}) => {
  const initialSubject = email?.subject || 'Operations Follow-Up: Action Items & Priorities';
  const initialBody = email?.body || 'Please review the extracted action items and next steps.';

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedSubject, setEditedSubject] = useState<string>(initialSubject);
  const [editedBody, setEditedBody] = useState<string>(initialBody);

  // Sync state whenever the underlying email analysis changes
  React.useEffect(() => {
    setEditedSubject(email?.subject || 'Operations Follow-Up: Action Items & Priorities');
    setEditedBody(email?.body || 'Please review the extracted action items and next steps.');
    setIsEditing(false);
  }, [email?.subject, email?.body]);

  const isCopied = copiedLabel === 'Follow-Up Email';

  const handleCopy = () => {
    const fullText = `Subject: ${editedSubject}\n\n${editedBody}`;
    onCopy(fullText, 'Follow-Up Email');
  };

  const handleMailTo = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      editedSubject
    )}&body=${encodeURIComponent(editedBody)}`;
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <div className="bg-[#111624] border border-[#1E2638] rounded-2xl p-5 sm:p-6 shadow-xl transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
            06
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              <span>Executive Follow-Up Email</span>
            </h3>
            <p className="text-xs text-slate-400">
              Grounded recap with greeting, deadlines, action items, and professional closing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#13192B] hover:bg-[#1C2438] rounded-lg border border-[#1E2638] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Preview' : 'Edit Draft'}</span>
          </button>
          <button
            onClick={handleMailTo}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/30 transition-all"
            title="Open in default email app"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mail Client</span>
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#13192B] hover:bg-[#1C2438] rounded-lg border border-[#1E2638] transition-colors whitespace-nowrap"
            title="Copy entire email"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Email Container */}
      <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] overflow-hidden font-mono text-xs">
        {/* Subject Bar */}
        <div className="p-3 bg-[#13192B] border-b border-[#1E2638] flex items-center gap-2">
          <span className="font-semibold text-slate-400 shrink-0 text-xs font-mono">Subject:</span>
          {isEditing ? (
            <input
              type="text"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              className="flex-1 text-xs font-semibold text-slate-100 bg-[#0B0F17] border border-[#1E2638] rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-purple-500"
            />
          ) : (
            <span className="font-semibold text-slate-200 text-xs truncate">
              {editedSubject}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5">
          {isEditing ? (
            <textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows={10}
              className="w-full text-xs text-slate-200 bg-[#0B0F17] border border-[#1E2638] rounded-lg p-3 font-mono leading-relaxed focus:outline-hidden focus:border-purple-500"
            />
          ) : (
            <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono select-text">
              {editedBody}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

