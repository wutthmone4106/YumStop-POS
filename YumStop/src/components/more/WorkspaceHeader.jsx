import React from 'react';

const WorkspaceHeader = ({ isAdmin, user }) => {
  return (
    <div className="flex items-center justify-between px-16 pt-8 pb-4 border-b border-neutral-900/40">
      <div>
        <h1 className="text-xl font-black text-white uppercase tracking-tight">
          {isAdmin ? "Team Performance" : "My Workspace"}
        </h1>
        <p className="text-[11px] text-neutral-500 font-medium font-mono mt-0.5">
          {isAdmin ? "Global Terminal Matrix Logs" : "Personal Shift Progress Tracking"}
        </p>
      </div>

      <div className="flex items-center gap-3 bg-[#1a1a1a] px-4 py-2 rounded-xl border border-neutral-800/30">
        <div className="w-7 h-7 rounded-full text-[10px] font-bold text-white bg-neutral-800 flex items-center justify-center font-mono">
          {user.name?.substring(0, 2).toUpperCase()}
        </div>
        <div className="text-left">
          <h4 className="text-xs font-bold text-neutral-200">{user.name}</h4>
          <span className="text-[9px] uppercase tracking-wider text-amber-500 font-bold font-mono">{user.role}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHeader;