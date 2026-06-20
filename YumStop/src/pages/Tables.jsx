import React, { useState } from 'react';
import { useSelector } from 'react-redux'; 
import BottomNav from '../components/shared/BottomNav';
import BackButton from '../components/shared/BackButton';
import TableCard from '../components/tables/TableCard';
import { useQuery } from '@tanstack/react-query';
import { getTables } from '../https';
import { HiOutlineInbox } from 'react-icons/hi';

const Tables = () => {
    const [status, setStatus] = useState("all");

    //  The live search query string from Redux store
    const searchKeyword = useSelector((state) => state.search?.query || '').toLowerCase();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['service-tables'],
        queryFn: getTables,
        refetchInterval: 5000,
        refetchOnMount: 'always',     
        staleTime: 0
    });

    if (isLoading) return <p className="text-white p-10 text-sm">Loading floor layout...</p>;
    if (isError) return <p className="text-red-400 p-10 text-sm">Error connecting to table database.</p>;

    const liveTables = data?.data?.data || [];

    // Filter dynamically by BOTH Selected Pill Status AND Header Search Keyword
    const filteredTables = liveTables.filter((table) => {
        // Match filter buttons (All vs Booked)
        const matchesStatus = status === "all" || table.status?.toLowerCase() === status.toLowerCase();
        
        // Match the text field from the Header search input against the table number string
        const matchesSearch = table.tableNumber?.toLowerCase().includes(searchKeyword);
        
        return matchesStatus && matchesSearch;
    });

    return (
        <section className="bg-[#1f1f1f] min-h-screen overflow-hidden flex flex-col justify-between">
            {/* Header Area Container */}
            <div className="flex items-center justify-between px-10 py-4 mt-2 shrink-0">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wide">Tables</h1>
                </div>

                {/* Smooth Slider Filter Switch Control */}
                <div className="relative flex items-center bg-[#161616] border border-neutral-800/60 p-1 rounded-xl w-[200px] h-[46px] select-none">
                    <div 
                        className={`absolute top-1 bottom-1 left-1 w-[92px] bg-[#333333] border border-neutral-700/20 rounded-lg transition-all duration-300 ease-out shadow-md z-0 ${
                            status === "booked" ? "transform translate-x-[94px]" : "transform translate-x-0"
                        }`}
                    />
                    
                    <button 
                        onClick={() => setStatus("all")} 
                        className={`relative z-10 w-1/2 text-center text-sm font-bold tracking-wide py-2 rounded-lg transition-colors duration-200 ${
                            status === "all" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                        }`}
                    >
                        All
                    </button>
                    
                    <button 
                        onClick={() => setStatus("booked")} 
                        className={`relative z-10 w-1/2 text-center text-sm font-bold tracking-wide py-2 rounded-lg transition-colors duration-200 ${
                            status === "booked" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                        }`}
                    >
                        Booked
                    </button>
                </div>
            </div>
            
            {/* Display Results Grid Layout */}
            <div className="flex-1 overflow-y-auto p-10 pb-28 scrollbar-hide">
                {filteredTables.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-items-center content-start max-w-[1600px] mx-auto">
                        {filteredTables.map((table) => (
                            <TableCard 
                                key={table._id || table.id}
                                id={table._id || table.id}
                                name={table.tableNumber}
                                status={table.status}
                                initials={table.initials || table.initial || ""}
                                seats={table.capacity}
                                activeOrderId={table.activeOrderId}
                            />
                        ))}
                    </div>
                ) : (
                    /* Fallback message displays if status or search filters yield 0 elements */
                    <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
                        <div className="w-16 h-16 bg-[#262626] rounded-full border border-neutral-800/80 flex items-center justify-center text-neutral-500 mb-4 shadow-inner">
                            <HiOutlineInbox className="text-3xl" />
                        </div>
                        <h2 className="text-[#f5f5f5] text-lg font-bold tracking-wide">No Tables Found</h2>
                        <p className="text-neutral-500 text-sm max-w-xs mt-1">
                            We couldn't find any tables matching your active filters or search parameters.
                        </p>
                    </div>
                )}
            </div>

            <BottomNav />
        </section>
    );
};

export default Tables;
