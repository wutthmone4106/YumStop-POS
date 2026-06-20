import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTotalPrice, clearCart } from '../../redux/slices/cartSlice';
import { addOrder } from '../../https';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const BillInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartData = useSelector((state) => state.cart);
  const customerData = useSelector((state) => state.customer);
  const total = useSelector(getTotalPrice);
  
  // Pull active cashier session profile data dynamically from user slice
  const user = useSelector((state) => state.user || { name: "Staff Cashier" });

  const taxRate = 5;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  // UI States
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cash Calculator States
  const [cashReceived, setCashReceived] = useState('');
  const changeDue = cashReceived ? parseFloat(cashReceived) - totalPriceWithTax : 0; 

  // QR Selection States
  const [selectedWallet, setSelectedWallet] = useState('KBZPay');

  // Numpad input handler
  const handleNumpadClick = (val) => {
    if (val === 'C') {
      setCashReceived('');
    } else if (val === '.') {
      if (!cashReceived.includes('.')) setCashReceived((prev) => prev + '.');
    } else {
      setCashReceived((prev) => prev + val);
    }
  };

  const handleQuickCash = (amount) => {
    setCashReceived(amount.toString());
  };

  // Dedicated Isolated Print Function
  const handlePrintReceipt = () => {
    if (cartData.length === 0) {
      enqueueSnackbar('Nothing inside active register list to print.', { variant: 'error' });
      return;
    }

    // Compile all dynamic items into HTML rows
    const itemRows = cartData
      .map(
        (item) => `
        <tr>
          <td style="padding: 5px 0; max-width: 40mm; word-wrap: break-word;">${item.name}</td>
          <td style="padding: 5px 0; text-align: center;">x${item.quantity}</td>
          <td style="padding: 5px 0; text-align: right;">${item.price.toLocaleString()} MMK</td>
        </tr>
      `
      )
      .join('');

    // Receipt layout template
        const receiptHTML = `
      <html>
        <head>
          <title>YumStop Receipt</title>
          <style>
            @page { margin: 0; }
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 76mm;
              margin: 0 auto;
              padding: 10mm 2mm;
              color: #000;
              background: #fff;
              font-size: 12px;
              line-height: 1.4;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .uppercase { text-transform: uppercase; }
            .bold { font-weight: bold; }
            .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
            .dotted-divider { border-bottom: 1px dotted #000; margin: 6px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12px; }
            .totals-row { display: flex; justify-content: space-between; margin: 4px 0; }
            .grand-total { font-size: 14px; font-weight: bold; margin-top: 6px; padding-top: 4px; border-top: 1px dashed #000; }
            
            /* Clean design styling for our daily token display tag banner */
            .order-number-banner {
              margin: 8px auto;
              padding: 4px 0;
              border: 1px solid #000;
              font-size: 15px;
              font-weight: bold;
              width: 85%;
              letter-spacing: 0.5px;
            }
          </style>
        </head>
        <body>
          <div class="text-center">
            <h2 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 900; tracking-tight: -0.5px;">YUMSTOP</h2>
            <p style="margin: 0; font-size: 11px;">FAST FOOD & DRINKS</p>
            <p style="margin: 0; font-size: 10px;">Tarmwe Township, Yangon</p>
            <p style="margin: 0; font-size: 10px;">Tel: 09-123456789</p>
          </div>

          <div class="divider"></div>

                    <div>
            <div class="totals-row"><span>Date:</span> <span>${new Date().toLocaleString()}</span></div>
            ${customerData.orderType === "Take Away" || !customerData.tableId || customerData.tableNo === "N/A" || customerData.tableNo === "" 
              ? "" : `<div class="totals-row"><span>Table:</span> <span class="bold"> ${customerData.tableNo || customerData.tableId}</span></div>`
            }
            <div class="totals-row"><span>Cashier:</span> <span class="bold">${user.name || 'Admin'}</span></div>
            <div class="totals-row"><span>Customer:</span> <span class="bold">ORDER #${localStorage.getItem('yumstop_daily_sequence') || '1'}</span></div>
          </div>


          <div class="divider"></div>

          <table>
            <thead>
              <tr style="border-b: 1px dashed #000;">
                <th style="text-align: left; padding-bottom: 4px;">Item</th>
                <th style="text-align: center; padding-bottom: 4px;">Qty</th>
                <th style="text-align: right; padding-bottom: 4px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <div class="divider"></div>

          <div>
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>${total.toLocaleString()} MMK</span>
            </div>
            <div class="totals-row">
              <span>Commercial Tax (5%):</span>
              <span>${tax.toLocaleString()} MMK</span>
            </div>
            <div class="totals-row grand-total">
              <span>GRAND TOTAL:</span>
              <span>${totalPriceWithTax.toLocaleString()} MMK</span>
            </div>
            <div class="totals-row" style="margin-top: 4px; font-size: 11px;">
              <span>Payment Mode:</span>
              <span class="uppercase">${paymentMethod}</span>
            </div>
          </div>

          <div class="divider" style="margin-top: 15px;"></div>
          
          <div class="text-center" style="margin-top: 10px; font-size: 10px;">
            <p class="bold" style="margin: 0;">Thank You for Choosing YumStop!♡</p>
            <p style="margin: 2px 0 0 0; color: #666;">Powered by YumStop</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    // Open another window tab when printed
    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
    } else {
      enqueueSnackbar('Pop-up blocker prevented printing. Please allow popups.', { variant: 'error' });
    }
  };

  // Submit Handler
    const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);

      const isTakeAway = 
        customerData.orderType === "Take Away" || 
        !customerData.tableId || 
        customerData.tableNo === "N/A" || 
        customerData.tableNo === "";

      // Get local daily clean reset sequence number
      const todayStr = new Date().toLocaleDateString();
      const savedDate = localStorage.getItem('yumstop_order_date');
      let currentSequence = localStorage.getItem('yumstop_daily_sequence') || '1';

      if (savedDate !== todayStr) {
        localStorage.setItem('yumstop_order_date', todayStr);
        localStorage.setItem('yumstop_daily_sequence', '1');
        currentSequence = '1';
      }

      // If it's Take Away, save it in the database 
      const databaseSavedName = isTakeAway 
        ? `Order #${currentSequence}`
        : (customerData.customerName || "Walk-In Customer");

      const orderData = {
        customerDetails: {
          name: databaseSavedName,
          phone: customerData.phone || "09-000000000",
          guests: Number(customerData.guests) || 1,
        },
        orderStatus: "Progress",
        bills: {
          total: total,
          tax: tax,
          totalWithTax: totalPriceWithTax,
        },
        items: cartData.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),

        table: isTakeAway ? null : customerData.tableId,
        orderType: isTakeAway ? "Take Away" : "Dine In",
        paymentType: paymentMethod === "QR" || paymentMethod === "Online" ? "QR" : "CASH",
        paymentGateway: paymentMethod === "QR" || paymentMethod === "Online" ? selectedWallet : "",
        
        cashierName: user.name || "Staff Cashier"
      };

      const response = await addOrder(orderData);

      if (response.status === 200 || response.status === 211 || response.data) {
        
        const backendSavedOrder = response.data?.data;
        if (backendSavedOrder && backendSavedOrder.dailyOrderNumber) {
          // Force localStorage to match the database exactly
          localStorage.setItem('yumstop_daily_sequence', backendSavedOrder.dailyOrderNumber.toString());
        } else {
          // Fallback to old increment logic if backend property wasn't found
          const currentSeq = parseInt(localStorage.getItem('yumstop_daily_sequence') || '1', 10);
          localStorage.setItem('yumstop_daily_sequence', (currentSeq + 1).toString());
        }

        enqueueSnackbar('Order Registered Successfully!', { variant: 'success' });
        dispatch(clearCart());
        setShowPaymentModal(false);
        navigate('/orders'); 
      }
    } catch (error) {
      console.error("Error creating order payload mapping:", error);
      enqueueSnackbar(error.response?.data?.message || 'Database sync failure.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div>
      {/* Items Calculation Header Summary Layout */}
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">Items ({cartData.length})</p>
        <h1 className="text-[#f5f5f5] text-md font-bold">{total.toLocaleString()} MMK</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">Tax (5%)</p>
        <h1 className="text-[#f5f5f5] text-md font-bold">{tax.toLocaleString()} MMK</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">Total with Tax</p>
        <h1 className="text-[#f6b100] text-md font-bold">{totalPriceWithTax.toLocaleString()} MMK</h1>
      </div>

      {/* Payment Toggles */}
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={() => setPaymentMethod('Cash')}
          className={`px-4 py-3 w-full rounded-lg font-semibold transition-all duration-150 ${
            paymentMethod === 'Cash'
              ? 'bg-[#f6b100] text-[#111111] shadow-[0_0_15px_rgba(246,177,0,0.3)]'
              : 'bg-[#1f1f1f] text-[#ababab] hover:bg-[#2c2c2c]'
          }`}
        >
          Cash
        </button>
        <button
          onClick={() => setPaymentMethod('QR')}
          className={`px-4 py-3 w-full rounded-lg font-semibold transition-all duration-150 ${
            paymentMethod === 'QR'
              ? 'bg-[#f6b100] text-[#111111] shadow-[0_0_15px_rgba(246,177,0,0.3)]'
              : 'bg-[#1f1f1f] text-[#ababab] hover:bg-[#2c2c2c]'
          }`}
        >
          QR
        </button>
      </div>

      {/* Primary Trigger Controls */}
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={handlePrintReceipt}
          className="bg-[#0018f4] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
        >
          Print Receipt
        </button>
        <button
          onClick={() => {
            if (cartData.length === 0) {
              enqueueSnackbar('Add items to cart first.', { variant: 'error' });
              return;
            }
            setShowPaymentModal(true);
          }}
          className="bg-[#0ce00c86] hover:bg-[#0ce00cc0] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold active:scale-95 transition-all duration-150"
        >
          Pay & Place
        </button>
      </div>

      {/* DYNAMIC PAYMENT PROCESSOR MODAL BACKDROP CONTAINER */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="bg-[#1a1a1a] border border-[#2c2c2c] w-full max-w-lg rounded-2xl p-6 relative mx-4 text-white">
            
            <div className="flex justify-between items-center border-b border-[#2c2c2c] pb-3 mb-4">
              <h2 className="text-xl font-bold text-[#f6b100]">Processing {paymentMethod} Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-neutral-400 hover:text-white text-xl font-bold">✕</button>
            </div>

            <div className="mb-4 text-center bg-[#111] p-3 rounded-xl border border-[#222]">
              <span className="text-xs text-neutral-400 block tracking-wide uppercase">Amount Collectable</span>
              <span className="text-2xl font-black text-[#f6b100]">{totalPriceWithTax.toLocaleString()} MMK</span>
            </div>

            {paymentMethod === 'Cash' && (
              <div>
                <div className="flex gap-2 mb-3">
                  <div className="w-1/2 bg-[#111] p-3 rounded-xl border border-[#222]">
                    <label className="text-[10px] text-neutral-400 block uppercase">Cash Tendered</label>
                    <span className="text-lg font-bold text-emerald-400">
                      {cashReceived ? parseFloat(cashReceived).toLocaleString() : '0'} MMK
                    </span>
                  </div>
                  <div className="w-1/2 bg-[#111] p-3 rounded-xl border border-[#222]">
                    <label className="text-[10px] text-neutral-400 block uppercase">Change Output</label>
                    <span className={`text-lg font-bold ${changeDue >= 0 ? 'text-white' : 'text-rose-500'}`}>
                      {changeDue >= 0 ? `${changeDue.toLocaleString()} MMK` : 'Incomplete Amount'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[totalPriceWithTax, 5000, 10000, 20000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleQuickCash(Math.ceil(amt))}
                      className="bg-[#262626] text-xs font-semibold py-2 rounded-lg hover:bg-[#333] transition-colors"
                    >
                      {amt === totalPriceWithTax ? 'Exact' : `${amt.toLocaleString()}`}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '.'].map((key) => (
                    <button
                      key={key}
                      onClick={() => handleNumpadClick(key)}
                      className={`py-3 text-lg font-bold rounded-xl transition-all duration-75 active:scale-95 ${
                        key === 'C' ? 'bg-rose-900/40 text-rose-400 hover:bg-rose-900/60' : 'bg-[#222] text-white hover:bg-[#2e2e2e]'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'QR' && (
              <div className="flex flex-col items-center">
                <span className="text-xs text-neutral-400 self-start mb-2 uppercase">Select Payment Platform</span>
                <div className="flex gap-2 w-full mb-4">
                  {['KBZPay', 'WavePay', 'AYAPay'].map((wallet) => (
                    <button
                      key={wallet}
                      onClick={() => setSelectedWallet(wallet)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedWallet === wallet ? 'bg-[#1e3a8a] text-blue-200 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'bg-[#111] text-neutral-400 border-neutral-800 hover:bg-[#1c1c1c]'
                      }`}
                    >
                      {wallet}
                    </button>
                  ))}
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=YumStop_${selectedWallet}_Amount_${totalPriceWithTax}`}
                    alt="Mock Transaction QR Code"
                    className="w-40 h-40 object-contain"
                  />
                  <div className="mt-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                    <span className="text-[11px] text-slate-700 font-bold tracking-wide uppercase">Scan to pay via {selectedWallet}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || (paymentMethod === 'Cash' && changeDue < 0)}
              className={`w-full py-3 mt-2 rounded-xl font-bold text-white text-md tracking-wider shadow-md transition-all duration-150 active:scale-95 ${
                isSubmitting || (paymentMethod === 'Cash' && changeDue < 0) ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isSubmitting ? 'Syncing Register...' : 'Approve Payment & Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillInfo;
