import React, { useState } from 'react';
import { HiOutlineUserGroup, HiOutlineInbox, HiOutlineXMark } from 'react-icons/hi2';

const AdminLeaderboard = ({ performanceData }) => {
  const [leaderboardFilter, setLeaderboardFilter] = useState('sales');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Sort data first so can easily group podiums vs lists
  const sortedEmployees = [...performanceData].sort(
    (a, b) => (b[leaderboardFilter] || 0) - (a[leaderboardFilter] || 0)
  );

  const topThree = sortedEmployees.slice(0, 3);
  const remainingEmployees = sortedEmployees.slice(3);

  // Custom styling attributes for the top podium standouts
  const podiumStyles = [
    {
      card: "bg-gradient-to-b from-[#ffb300]/10 via-[#161616] to-[#161616] border-[#ffb300]/30 shadow-[0_0_30px_rgba(255,179,0,0.05)] md:scale-105 z-10",
      rankText: "text-[#ffb300]",
      avatar: "bg-[#ffb300]/10 text-[#ffb300] border-[#ffb300]/20",
    },
    {
      card: "bg-gradient-to-b from-slate-400/10 via-[#161616] to-[#161616] border-slate-400/20",
      rankText: "text-slate-300",
      avatar: "bg-slate-400/10 text-slate-300 border-slate-400/20",
    },
    {
      card: "bg-gradient-to-b from-amber-700/15 via-[#161616] to-[#161616] border-amber-700/20",
      rankText: "text-amber-600",
      avatar: "bg-amber-700/10 text-amber-500 border-amber-700/20",
    }
  ];

  return (
    <div className="space-y-8">
      {/* Upper Tactical Controller Navigation header banner line */}
      <div className="flex justify-between items-center border-b border-neutral-800/60 pb-4">
        <div>
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <HiOutlineUserGroup className="text-[#ffb300] text-base" /> Active Performance Metrics
          </h3>
          <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-wider mt-0.5">Terminal Log Tracking Engine</p>
        </div>
        
        <div className="flex bg-[#121212] p-1 rounded-xl border border-neutral-800/80">
          {['sales', 'orders'].map((type) => (
            <button 
              key={type}
              onClick={() => setLeaderboardFilter(type)} 
              className={`text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-150 ${
                leaderboardFilter === type 
                  ? "bg-[#ffb300] text-neutral-950 font-black shadow-[0_0_15px_rgba(255,179,0,0.2)]" 
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              By {type === 'sales' ? 'Revenue' : 'Orders'}
            </button>
          ))}
        </div>
      </div>

      {sortedEmployees.length > 0 ? (
        <div className="space-y-6">
          
          {/* THE PODIUM TRIO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
            {topThree.map((employee, idx) => {
              const style = podiumStyles[idx] || podiumStyles[2];
              // Adjust arrangement for true visual podium order on screen: #2 on Left, #1 in Center, #3 on Right
              const gridOrder = idx === 0 ? "md:order-2" : idx === 1 ? "md:order-1" : "md:order-3";

              return (
                <div
                  key={employee._id}
                  onClick={() => setSelectedEmployee({ ...employee, globalRank: idx + 1 })}
                  className={`group relative bg-[#161616] border p-6 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${style.card} ${gridOrder}`}
                >
                  <div className="absolute top-4 right-4 font-mono font-black text-xl italic opacity-30 group-hover:opacity-60 transition-opacity">
                    <span className={style.rankText}>0{idx + 1}</span>
                  </div>

                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl font-black text-xs flex items-center justify-center font-mono border ${style.avatar}`}>
                      {employee.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base tracking-wide group-hover:text-[#ffb300] transition-colors">{employee.name}</h4>
                      <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest mt-0.5 block">{employee.role || 'Operator'}</span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800/80 mt-6 pt-4 flex justify-between items-baseline">
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">Shift Sales</span>
                      <span className="text-md font-mono font-black text-white">{employee.sales?.toLocaleString()} <span className="text-[9px] text-neutral-500 font-sans font-normal">MMK</span></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">Volume</span>
                      <span className="text-xs font-mono font-bold text-neutral-300">{employee.orders || 0} Tickets</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* LOWER RUNNERS GRID: Modular linear data feeds */}
          {remainingEmployees.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {remainingEmployees.map((employee, idx) => {
                const currentRank = idx + 4;
                return (
                  <div
                    key={employee._id}
                    onClick={() => setSelectedEmployee({ ...employee, globalRank: currentRank })}
                    className="group bg-[#141414]/60 border border-neutral-800/50 hover:border-neutral-700/80 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-black text-neutral-600 group-hover:text-neutral-400 transition-colors w-5">#{currentRank}</span>
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold font-mono text-[10px] flex items-center justify-center">
                        {employee.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-bold text-neutral-200 text-xs tracking-wide group-hover:text-white transition-colors">{employee.name}</h5>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">{employee.role || 'Staff Cashier'}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono flex items-center gap-6">
                      <div>
                        <span className="text-neutral-400 font-bold text-xs">{employee.sales?.toLocaleString()}</span>
                        <span className="text-[9px] text-neutral-600 font-sans ml-1">MMK</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 bg-neutral-900/50 border border-neutral-800/40 px-2 py-0.5 rounded text-center min-w-[75px] block">
                        {employee.orders || 0} Tkt
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        <div className="h-56 flex flex-col items-center justify-center text-neutral-600 bg-[#121212]/20 border border-dashed border-neutral-800/40 rounded-3xl">
          <HiOutlineInbox className="text-4xl mb-2 text-neutral-700" />
          <p className="text-xs font-mono uppercase tracking-wider">Zero Shift Matrix Nodes Broadcasted</p>
        </div>
      )}

      {/* TACTICAL COMMAND MODAL OVERLAY */}
      {selectedEmployee && (() => {
        const avgValue = selectedEmployee.orders > 0 ? Math.round(selectedEmployee.sales / selectedEmployee.orders) : 0;
        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
            <div className="bg-[#141414] border border-neutral-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
              
              {/* Abstract decorative accent layout bar at top */}
              <div className="h-1 w-full bg-gradient-to-r from-neutral-800 via-[#ffb300] to-neutral-800" />

              {/* Header Box Container */}
              <div className="p-5 flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono font-black text-[#ffb300] uppercase tracking-widest bg-[#ffb300]/10 border border-[#ffb300]/20 px-2 py-0.5 rounded">
                    Matrix Node #{selectedEmployee.globalRank}
                  </span>
                  <h3 className="text-lg font-black text-white tracking-wide mt-2">{selectedEmployee.name}</h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">{selectedEmployee.role || 'Terminal Cashier'}</p>
                </div>
                <button 
                  onClick={() => setSelectedEmployee(null)}
                  className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-700 transition-all"
                >
                  <HiOutlineXMark className="text-base" />
                </button>
              </div>

              {/* Central Core Data Panels */}
              <div className="px-5 pb-6 space-y-3">
                
                {/* Revenue Row Data Feed Block */}
                <div className="bg-[#181818] border border-neutral-800/60 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Gross Revenue</span>
                  <p className="font-mono font-black text-md text-[#ffb300]">
                    {selectedEmployee.sales?.toLocaleString()} <span className="text-[9px] font-sans font-normal text-neutral-500 ml-0.5">MMK</span>
                  </p>
                </div>

                {/* Orders Row Data Feed Block */}
                <div className="bg-[#181818] border border-neutral-800/60 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Tickets Closed</span>
                  <p className="font-mono font-black text-md text-white">
                    {selectedEmployee.orders || 0} <span className="text-[9px] font-sans font-normal text-neutral-500 ml-0.5">Units</span>
                  </p>
                </div>

                {/* Average itemized analytical pricing tracking index box */}
                <div className="bg-[#181818] border border-neutral-800/60 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Avg Order Weight</span>
                  <p className="font-mono font-black text-sm text-neutral-300">
                    {avgValue.toLocaleString()} <span className="text-[9px] font-sans font-normal text-neutral-500 ml-0.5">MMK</span>
                  </p>
                </div>

              </div>

              {/* Bottom footer overlay close bar trigger */}
              <div className="bg-[#111] p-4 border-t border-neutral-900 flex justify-end">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="w-full py-2.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                  Terminate Inspection View
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminLeaderboard;