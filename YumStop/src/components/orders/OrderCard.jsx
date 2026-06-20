import React, { useState, useEffect } from 'react';
import { FaCheckDouble, FaCircle, FaExclamationTriangle } from 'react-icons/fa';
import { HiOutlineReceiptPercent, HiOutlineXMark } from 'react-icons/hi2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '../../https'; 

const OrderCard = ({ order }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const queryClient = useQueryClient();

  const { 
    _id,
    customerDetails, 
    bills, 
    items, 
    orderStatus, 
    createdAt, 
    paymentType, 
    paymentGateway, 
    table, 
    orderType 
  } = order;

  // Enforce conditional authority based purely on the explicit order type selection
  const isTakeAway = orderType === 'Take Away';

  // React Query Mutation to handle the pipeline updates dynamically
  const mutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-orders'] });
      setShowReceipt(false);
    },
    onError: (error) => {
      console.error("Sync Error:", error);
      setToast({ show: true, message: "Failed to change order status. Check terminal logs." });
    }
  });

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const getAvatarInitials = (name) => {
    return (name || "WI").trim().split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatOrderDate = (isoString) => {
    if (!isoString) return "Just Now";
    return new Date(isoString).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', dot: 'text-emerald-500', text: 'Completed' };
      case 'ready':
        return { bg: 'bg-green-500/10 border-green-500/20 text-green-400', dot: 'text-green-500', text: 'Ready to serve' };
      default:
        return { bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400', dot: 'text-amber-500', text: 'Cooking in Progress' };
    }
  };

  const statusStyle = getStatusStyles(orderStatus);

  const getPaymentModeLabel = () => {
    if (paymentType === 'QR' || paymentType === 'ONLINE') {
      return paymentGateway ? `QR PAY (${paymentGateway.toUpperCase()})` : "QR PAY";
    }
    return paymentType || "CASH";
  };

  const handleStatusTransition = (nextStatus) => {
    mutation.mutate({ orderId: _id, status: nextStatus });
  };

  return (
    <>
      {/* CARD LIST INTERFACE */}
      <div 
        onClick={() => setShowReceipt(true)}
        className="w-[500px] bg-[#262626] hover:bg-[#2a2a2a] border border-neutral-800/40 hover:border-neutral-700/50 rounded-xl p-5 cursor-pointer transition-all duration-150 shadow-md flex flex-col justify-between"
      >
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-b from-[#ffcc00] via-[#f6b100] to-[#e63946] h-12 w-12 text-sm font-bold text-white rounded-xl flex items-center justify-center shadow-md">
            {getAvatarInitials(customerDetails?.name)}
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start gap-0.5">
              <h1 className="text-[#f5f5f5] text-md font-bold tracking-wide">{customerDetails?.name || "Walk-In Customer"}</h1>
              <p className={`text-xs font-semibold ${isTakeAway ? "text-emerald-400" : "text-[#ababab]"}`}>
                Service: {isTakeAway ? "Take Away" : "Dine In"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <p className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1 ${statusStyle.bg}`}>
                <FaCheckDouble className="text-[9px]" /> {orderStatus || "Progress"}
              </p>
              <p className="text-[#ababab] text-[11px] flex items-center gap-1">
                <FaCircle className={`text-[8px] ${statusStyle.dot}`} /> {statusStyle.text}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-neutral-800/80 text-[#ababab] text-xs">
          <p>{formatOrderDate(createdAt)}</p>
          <div className="flex items-center gap-2">
            {isTakeAway && (
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/20">
                TAKE AWAY
              </span>
            )}
            <p className="text-white font-bold text-sm">{Number(bills?.totalWithTax || 0).toLocaleString()} MMK</p>
          </div>
        </div>
      </div>

      {/* POPUP SLIDEOVER INVOICE SLIP */}
      {showReceipt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowReceipt(false)}
        >
          <div 
            className="bg-[#1a1a1a] border border-neutral-800 w-full max-w-md p-6 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 no-print">
              <div className="flex items-center gap-2 text-white font-bold text-md">
                <HiOutlineReceiptPercent className="text-xl text-amber-500" />
                <h2>Guest Invoice Bill</h2>
              </div>
              <button 
                onClick={() => setShowReceipt(false)}
                className="p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-all"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 pr-1 scrollbar-hide">
              <div id="thermal-receipt-capture" className="space-y-4 text-neutral-300 font-mono text-[13px]">
                
                <div className="text-center space-y-0.5">
                  <h3 className="text-white font-bold text-base tracking-wider uppercase font-sans">YUMSTOP</h3>
                  <p className="text-neutral-400 text-[11px] uppercase tracking-tight font-sans">FAST FOOD & DRINKS</p>
                  <p className="text-neutral-500 text-[11px] font-sans">Tarmwe Township, Yangon</p>
                  <p className="text-neutral-500 text-[11px] font-sans">Tel: 09-123456789</p>
                </div>

                <div className="space-y-1 pt-2 border-t border-dashed border-neutral-800 print-divider">
                  <div className="grid grid-cols-[85px_1fr]">
                    <span className="text-neutral-500 font-sans">Date:</span>
                    <span className="text-right text-neutral-300 font-sans">{formatOrderDate(createdAt)}</span>
                  </div>
                  
                  <div className="grid grid-cols-[85px_1fr]">
                    <span className="text-neutral-500 font-sans">Service:</span>
                    <span className={`text-right font-bold font-sans ${isTakeAway ? "text-emerald-400" : "text-white"}`}>
                      {isTakeAway ? "Take Away" : "Dine In"}
                    </span>
                  </div>

                  {/* CONDITIONAL STATEMENT: Shows Option & Table details if Dine In, otherwise renders Take Away option label directly */}
                  {isTakeAway ? (
                    <div className="grid grid-cols-[85px_1fr]">
                      <span className="text-neutral-500 font-sans">Option:</span>
                      <span className="text-right font-bold font-sans text-emerald-400">Take Away</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[85px_1fr]">
                      <span className="text-neutral-500 font-sans">Option:</span>
                      <span className="text-right font-bold font-sans text-white">
                        {table && typeof table === 'object' ? `${table.tableNumber || table.number || "Dine In"}` : "Dine In Order"}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-[85px_1fr]">
                    <span className="text-neutral-500 font-sans">Cashier:</span>
                    <span className="text-right text-neutral-300 font-sans">
                      {order.cashierName || "Staff Cashier"}
                    </span>
                  </div>
                  <div className="grid grid-cols-[85px_1fr]">
                    <span className="text-neutral-500 font-sans">Customer:</span>
                    <span className="text-right text-neutral-300 font-sans capitalize">{customerDetails?.name || "Walk-In"}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-dashed border-neutral-800 print-divider">
                  <div className="flex justify-between font-bold text-neutral-400 pb-0.5 font-sans">
                    <span className="w-1/2 text-left">Item</span>
                    <span className="w-1/4 text-center">Qty</span>
                    <span className="w-1/4 text-right">Price</span>
                  </div>
                  {items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start font-sans text-neutral-200">
                      <span className="w-1/2 text-left leading-tight font-semibold">{item.name}</span>
                      <span className="w-1/4 text-center text-neutral-400">x{item.quantity}</span>
                      <span className="w-1/4 text-right font-semibold">{Number(item.price * item.quantity).toLocaleString()} MMK</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-dashed border-neutral-800 print-divider font-sans">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal:</span>
                    <span className="font-mono">{Number(bills?.total || 0).toLocaleString()} MMK</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Commercial Tax (5%):</span>
                    <span className="font-mono">{Number(bills?.tax || 0).toLocaleString()} MMK</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-neutral-800 print-divider">
                    <span>GRAND TOTAL:</span>
                    <span className="text-amber-500 font-mono">{Number(bills?.totalWithTax || 0).toLocaleString()} MMK</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 text-[11px] pt-1">
                    <span>Payment Mode:</span>
                    <span className="uppercase font-semibold text-neutral-300">
                      {getPaymentModeLabel()}
                    </span>
                  </div>
                </div>

                <div className="text-center pt-3 border-t border-dashed border-neutral-800 print-divider font-sans space-y-0.5">
                  <p className="text-[12px] font-bold text-neutral-200 tracking-wide">♡ Thank You for Choosing YumStop! ♡</p>
                  <p className="text-[10px] text-neutral-500">Powered by YumStop</p>
                </div>

              </div>
            </div>

            {/* ACTION BUTTON AREA */}
            <div className="mt-2 pt-4 border-t border-neutral-800 flex flex-col gap-2 no-print">
              {(orderStatus?.toLowerCase() === 'progress' || orderStatus?.toLowerCase() === 'in progress') && (
                <button
                  disabled={mutation.isPending}
                  onClick={() => handleStatusTransition('Ready')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-sans font-bold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {mutation.isPending ? "Updating order..." : "✔ Mark Order as Ready"}
                </button>
              )}

              {orderStatus?.toLowerCase() === 'ready' && (
                <button
                  disabled={mutation.isPending}
                  onClick={() => handleStatusTransition('Completed')}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-sans font-bold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {mutation.isPending ? "Archiving record..." : "🗄 Complete & Archive Order"}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SNACKBAR NOTIFICATION CONTAINER */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#e63946] border border-red-500/30 text-white px-5 py-3.5 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
          <FaExclamationTriangle className="text-md text-white animate-pulse" />
          <p className="text-xs font-bold tracking-wide">{toast.message}</p>
          <button 
            onClick={() => setToast({ show: false, message: "" })} 
            className="ml-2 text-white/70 hover:text-white transition-all text-sm"
          >
            <HiOutlineXMark />
          </button>
        </div>
      )}
    </>
  );
};

export default OrderCard;
