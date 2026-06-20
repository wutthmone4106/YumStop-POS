import React, { useState } from 'react';
import { getRandomBG } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { updateTable } from '../../redux/slices/customerSlice';
import { releaseTable } from '../../https'; 
import { enqueueSnackbar } from 'notistack';
import { HiOutlineArrowPath, HiOutlineExclamationTriangle } from 'react-icons/hi2';

const TableCard = ({
  id,
  name,
  status,
  initials,
  seats,
  activeOrderId
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isReleasing, setIsReleasing] = useState(false);
  
  // State to toggle our custom confirmation modal box
  const [showConfirm, setShowConfirm] = useState(false);

  const isBooked = status?.toLowerCase() === "occupied" || status?.toLowerCase() === "booked";

  const handleTableAction = () => {
    if (isBooked) {
      navigate(`/orders?id=${activeOrderId || id}`);
    } else {
      dispatch(updateTable({ 
        tableNo: name,   
        tableId: id || null
      }));
      navigate(`/menu`);
    }
  };

  // Triggers when the user confirms inside the custom modal
  const handleReleaseConfirm = async () => {
    setShowConfirm(false); // Hide modal immediately
    setIsReleasing(true);
    try {
      await releaseTable(id);
      enqueueSnackbar(`${name} is now available!`, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to release table state.', { variant: 'error' });
    } finally {
      setIsReleasing(false);
    }
  };

  const randomColor = getRandomBG();

  return (
    <>
      {/* MAIN TABLE CARD */}
      <div
        onClick={handleTableAction}
        className="w-[280px] bg-[#262626] hover:bg-[#2c2c2c] border border-neutral-800/40 hover:border-neutral-700/60 rounded-xl p-5 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 shadow-md group flex flex-col justify-between h-[250px]"
      >
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-wide">{name}</h1>
          
          <div className="flex items-center gap-2">
            {isBooked && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stop routing redirection
                  setShowConfirm(true); // Open the custom modal
                }}
                disabled={isReleasing}
                title="Clear Table status"
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 active:scale-90 transition-all border border-neutral-700/50"
              >
                <HiOutlineArrowPath className={`text-sm ${isReleasing ? 'animate-spin' : ''}`} />
              </button>
            )}
            <span
              className={`px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md border ${
                isBooked
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "text-green-400 bg-green-500/10 border-green-500/20"
              }`}
            >
              {isBooked ? "Booked" : "Available"}
            </span>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="flex items-center justify-center py-7">
          <div
            style={{
              borderColor: randomColor,
              color: randomColor,
              backgroundColor: isBooked ? randomColor : "transparent"
            }}
            className={`h-16 w-16 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 group-hover:scale-105 ${
              isBooked ? "text-white border-transparent" : "border-dashed"
            }`}
          >
            {isBooked ? initials : "+"}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-neutral-800 pt-3 flex items-center justify-between">
          <span className="text-sm text-gray-400">Capacity</span>
          <span className="text-white text-sm font-semibold">{seats} Seats</span>
        </div>
      </div>

      {/* CUSTOM MODAL BOX OVERLAY */}
      {showConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => e.stopPropagation()} // Stop click-through closing problems
        >
          <div className="bg-[#1a1a1a] border border-neutral-800 w-full max-w-md p-6 rounded-2xl shadow-2xl scale-up-animation">
            {/* Modal Header Icon */}
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                <HiOutlineExclamationTriangle className="text-xl" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">Back to Available?</h2>
            </div>

            {/* Modal Content Message */}
            <div className="py-4 text-neutral-400 text-sm leading-relaxed">
              Are you sure you want to change <span className="text-white font-semibold">{name}</span> back to <span className="text-green-400 font-semibold">Available</span>? This action clear out a current available table.
            </div>

            {/* Action Option Buttons */}
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700/80 font-semibold text-xs tracking-wide transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReleaseConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-red-900/20"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableCard;
