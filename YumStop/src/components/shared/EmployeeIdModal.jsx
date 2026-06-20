import React from 'react';
import { FaIdCard, FaUserCircle, FaCheckCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';

const EmployeeIdModal = ({ isOpen, onClose, userData }) => {
  if (!isOpen) return null;

  // Format the creation date if it exists in user object payload
  const formatJoinDate = () => {
    // Check if the backend timestamp exists
    if (userData?.createdAt) {
      const date = new Date(userData.createdAt);
      
      // Safety check to ensure it parsed into a valid Date object
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        });
      }
    }
    
    // If it's not present yet, dynamically fallback to the current month/year 
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm transition-opacity">
      
      {/* Card Body Container */}
      <div className="bg-[#151515] w-full max-w-sm rounded-3xl overflow-hidden border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative text-white flex flex-col items-center p-6 animate-fadeIn">
        
        {/* Top Accent Stripe / Decorative Branding */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#ffcc00] via-[#f6b100] to-[#e63946]" />
        
        {/* Close trigger anchor */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-neutral-500 hover:text-white font-bold text-lg p-1 transition-colors"
        >
          ✕
        </button>

        {/* Header Badge Title */}
        <div className="flex items-center gap-1.5 mt-2 text-[#f6b100] uppercase tracking-widest text-[11px] font-black opacity-80">
          <FaIdCard /> 
          <span>Staff Identification</span>
        </div>

        {/* Profile Avatar Frame Container */}
        <div className="relative mt-6 group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-[#f6b100] to-transparent opacity-40 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
          <div className="bg-[#222] border-2 border-[#f6b100]/60 p-1.5 rounded-full relative">
            <FaUserCircle className="text-neutral-300 text-7xl" />
          </div>
          <div className="absolute bottom-0 right-1 bg-emerald-500 text-neutral-950 text-[10px] p-1 rounded-full border-2 border-[#151515]">
            <FaCheckCircle size={10} className="text-white" />
          </div>
        </div>

        {/* Dynamic Employee Basic Typography Names */}
        <h2 className="text-xl font-bold mt-4 tracking-wide text-neutral-100">
          {userData?.name || "Staff Personnel"}
        </h2>
        <p className="bg-[#f6b100]/10 text-[#f6b100] border border-[#f6b100]/20 font-bold px-3 py-0.5 rounded-full text-xs tracking-wider mt-1 uppercase">
          {userData?.role || "Cashier"}
        </p>

        <hr className="w-full border-neutral-800/80 my-5" />

        {/* Meta Data Credentials Layout Rows */}
        <div className="w-full space-y-3 px-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Internal ID:</span>
            <span className="font-mono text-neutral-300 font-bold tracking-wider">
              YS-{String(userData?._id || userData?.id || '083D').slice(-4).toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">System Access:</span>
            <span className="text-emerald-400 font-medium text-xs bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Authorized
            </span>
          </div>

          {/* Joined Since Row */}
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Joined Since:</span>
            <span className="text-neutral-300 text-xs flex items-center gap-1 font-semibold">
              <FaCalendarAlt className="text-neutral-600" /> {formatJoinDate()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Active Shift:</span>
            <span className="text-neutral-400 text-xs flex items-center gap-1 font-mono">
              <FaClock className="text-neutral-600" /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stylized Simulated Security Barcode Element */}
        <div className="mt-6 flex flex-col items-center bg-white p-2 rounded-lg w-full select-none opacity-85 hover:opacity-100 transition-opacity">
          <div className="w-full h-8 flex items-stretch gap-[2px]">
            {[2,1,3,1,4,2,1,3,2,1,1,4,2,1,3,1,2,4,1,2,3,1,2].map((weight, idx) => (
              <div 
                key={idx} 
                className="bg-black flex-grow" 
                style={{ opacity: idx % 2 === 0 ? 1 : 0 }} 
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-neutral-800 tracking-[4px] mt-1 font-bold">
            *{String(userData?._id || '6A2CCDAB').slice(0, 8).toUpperCase()}*
          </span>
        </div>

        {/* Footer Brand Logo Label */}
        <div className="mt-5 text-center">
          <p className="text-[10px] text-neutral-600 font-medium tracking-wide">
            YumStop Terminal Authorization Engine
          </p>
        </div>

      </div>
    </div>
  );
};

export default EmployeeIdModal;
