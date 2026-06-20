import React from 'react';
import { 
  HiOutlineChartBar, 
  HiOutlineCurrencyDollar, 
  HiOutlineClock, 
  HiOutlineShoppingBag 
} from 'react-icons/hi2';

const CashierWorkspace = ({ user, performanceData = {} }) => {
  // Safe string-to-number extractor utility to maintain compatibility with server transformations
  const parseMetric = (val) => {
    if (typeof val === 'string') return parseFloat(val.replace(/,/g, '')) || 0;
    return val || 0;
  };

  // Helper function to show numbers with commas safely on screen
  const formatDisplay = (val) => {
    return parseMetric(val).toLocaleString();
  };

  // Safe fallback to read today's orders list array passed down from the backend
  const todayOrdersList = performanceData.todayOrdersList || [];

  return (
    <div className="space-y-6">
      {/* Welcome Message Card */}
      <div className="bg-[#1a1a1a] border border-neutral-800/60 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Welcome back, {user.name}!</h2>
          <p className="text-xs text-neutral-500 mt-1">Your workspace is fully synchronized. Keep tracking your shift stats.</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest block">Daily Progress</span>
          <span className="text-sm font-black font-mono text-emerald-500">{parseMetric(performanceData.targetProgress)}% achieved</span>
        </div>
      </div>

      {/* Grid of 4 Daily Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-xl flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between w-full text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Today's Sales</span>
            <HiOutlineCurrencyDollar className="text-sm" />
          </div>
          <h3 className="text-2xl font-black font-mono text-amber-500 mt-2">
            {formatDisplay(performanceData.sales)} <span className="text-xs font-sans text-neutral-400">MMK</span>
          </h3>
        </div>

        <div className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-xl flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between w-full text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Orders Served Today</span>
            <HiOutlineShoppingBag className="text-sm" />
          </div>
          <h3 className="text-2xl font-black font-mono text-white mt-2">
            {parseMetric(performanceData.ordersCount)} <span className="text-xs font-sans text-neutral-500">Orders</span>
          </h3>
        </div>

        <div className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-xl flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between w-full text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Today's Avg Order</span>
            <HiOutlineChartBar className="text-sm" />
          </div>
          <h3 className="text-2xl font-black font-mono text-white mt-2">
            {formatDisplay(performanceData.avgOrderValue)} <span className="text-xs font-sans text-neutral-400">MMK</span>
          </h3>
        </div>

        <div className="bg-neutral-950/40 border border-neutral-800/80 p-5 rounded-xl flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between w-full text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Shift State</span>
            <HiOutlineClock className="text-sm" />
          </div>
          <h3 className="text-2xl font-black font-mono text-neutral-400 mt-2">Active</h3>
        </div>
      </div>

      {/* Target Progress Baseline */}
      <div className="bg-[#1a1a1a] border border-neutral-800/60 p-5 rounded-2xl space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-neutral-400">Daily Sales Target Milestone</span>
          <span className="font-mono text-neutral-500">Goal: 600,000 MMK</span>
        </div>
        <div className="w-full bg-neutral-950 h-3 rounded-full overflow-hidden p-0.5 border border-neutral-900">
          <div 
            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${parseMetric(performanceData.targetProgress)}%` }}
          ></div>
        </div>
      </div>

      {/* Today's Order Records Log Table with Sticky Header and Custom Webkit Scrollbar */}
      <div className="bg-[#1a1a1a] border border-neutral-800/60 p-5 rounded-2xl">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
          Today's Order Records Log
        </h4>
        
        {todayOrdersList.length > 0 ? (
          <div className="w-full overflow-hidden rounded-xl border border-neutral-800/50 bg-neutral-950/20">
            {/* Table Header */}
            <table className="w-full text-left border-collapse layout-fixed">
              <thead>
                <tr className="bg-neutral-950/60 border-b border-neutral-800 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-1/4">Time</th>
                  <th className="py-3 px-4 w-1/4">Type</th>
                  <th className="py-3 px-4 w-1/4">Payment</th>
                  <th className="py-3 px-4 w-1/4 text-right pr-6">Total Amount</th>
                </tr>
              </thead>
            </table>

            {/* Table Viewport Frame */}
            <div className="max-h-[220px] overflow-y-auto w-full pr-0.5
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-neutral-950/20
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-neutral-800/80
              [&::-webkit-scrollbar-thumb]:hover:bg-neutral-700
              [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              <table className="w-full text-left border-collapse layout-fixed">
                <tbody className="divide-y divide-neutral-800/40 font-mono text-xs">
                  {todayOrdersList.map((order, index) => {
                    const orderTime = order.createdAt 
                      ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : '--:--';
                    const orderBillAmount = order.bills?.totalWithTax || order.bills?.totalPriceWithTax || order.bills?.total || 0;
                    
                    return (
                      <tr key={order._id || index} className="hover:bg-neutral-900/40 transition-colors text-neutral-300">
                        <td className="py-3 px-4 w-1/4 text-neutral-500">{orderTime}</td>
                        <td className="py-3 px-4 w-1/4 font-sans font-medium text-neutral-200">
                          {order.orderType || 'Dine-In'}
                        </td>
                        <td className="py-3 px-4 w-1/4 text-[11px]">
                          <span className="px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-400">
                            {order.paymentType || 'Cash'}
                          </span>
                        </td>
                        <td className="py-3 px-4 w-1/4 text-right pr-5 font-bold text-amber-500">
                          {orderBillAmount.toLocaleString()} MMK
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/10">
            <p className="text-xs text-neutral-500">No completed orders recorded yet for today's shift.</p>
          </div>
        )}
      </div>

      {/* Analytics Charts Sub-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Weekly History Chart */}
        <div className="bg-[#1a1a1a] border border-neutral-800/60 p-5 rounded-2xl flex flex-col justify-between">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6">Weekly Sales History</h4>
          <div className="flex items-end justify-between h-36 px-2 pt-4 border-b border-neutral-800">
            {(performanceData.weeklyChartData || []).map((week, idx) => {
              const maxSales = Math.max(...(performanceData.weeklyChartData || []).map(w => parseMetric(w.sales)), 1);
              const barHeight = `${Math.min(Math.round((parseMetric(week.sales) / maxSales) * 100), 100)}%`;

              return (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <span className="text-[9px] font-mono text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {parseMetric(week.sales) > 0 ? `${Math.round(parseMetric(week.sales) / 1000)}k` : '0'}
                  </span>
                  <div className="w-8 bg-neutral-900 rounded-t-md overflow-hidden h-24 flex items-end">
                    <div 
                      style={{ height: barHeight }} 
                      className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md transition-all duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono mt-2">{week.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Sales History Card */}
        <div className="bg-[#1a1a1a] border border-neutral-800/60 p-6 rounded-2xl">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6">
            Monthly Sales History
          </h4>
          
          <div className="w-full overflow-x-auto pb-3
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:bg-neutral-950/40
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-neutral-800
            [&::-webkit-scrollbar-thumb]:hover:bg-neutral-700
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <div className="flex items-end justify-between h-36 pt-4 border-b border-neutral-800 min-w-[600px] w-full">
              {(performanceData.monthlyChartData || []).map((month, idx) => {
                const maxSales = Math.max(...(performanceData.monthlyChartData || []).map(m => parseMetric(m.sales)), 1);
                const barHeight = `${Math.min(Math.round((parseMetric(month.sales) / maxSales) * 100), 100)}%`;
                
                const isCurrentMonth = month.name === "June"; 

                return (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center w-1/4 min-w-[150px] flex-shrink-0 group relative px-1"
                  >
                    <span className="text-[9px] font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 absolute -top-2">
                      {parseMetric(month.sales) > 0 ? `${(parseMetric(month.sales) / 1000).toFixed(0)}k` : '0'}
                    </span>

                    <div className={`w-8 bg-neutral-900/60 rounded-t-sm overflow-hidden h-24 flex items-end border-x border-t transition-colors ${
                      isCurrentMonth ? 'border-amber-500/30 bg-neutral-900' : 'border-transparent'
                    }`}>
                      <div 
                        style={{ height: barHeight }} 
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          isCurrentMonth 
                            ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                            : 'bg-gradient-to-t from-neutral-700 to-neutral-400'
                        }`}
                      />
                    </div>

                    <span className={`text-[10px] font-mono mt-2 transition-all ${
                      isCurrentMonth ? 'text-amber-500 font-bold tracking-tight' : 'text-neutral-500'
                    }`}>
                      {month.name} {isCurrentMonth && "•"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CashierWorkspace;
