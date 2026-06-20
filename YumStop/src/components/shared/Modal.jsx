import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-[#2d2d2d] overflow-hidden shadow-2xl transition-all scale-100">
        
        {/* Header bar area */}
        <div className="flex justify-between items-center p-5 border-b border-[#242424]">
          <h3 className="text-md font-bold tracking-wide text-[#f5f5f5]">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-[#ababab] hover:text-[#e63946] p-1 rounded-lg hover:bg-[#242424] transition-all"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Form Content Body */}
        <div className="p-6">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;