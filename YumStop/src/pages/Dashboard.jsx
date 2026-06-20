import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getPerformanceMetrics, logout } from '../https'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { removeUser } from '../redux/slices/userSlice'; // Corrected action import
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { FaSignOutAlt } from 'react-icons/fa'; 

import CreateMenu from '../components/dashboard/CreateMenu'; 
import CreateCategory from '../components/dashboard/CreateCategory'; 
import CreateTable from '../components/dashboard/CreateTable'; 

import ReadMenu from '../components/dashboard/ReadMenu'; 
import ReadCategory from '../components/dashboard/ReadCategory'; 
import ReadTables from '../components/dashboard/ReadTables'; 
import ReadEmployees from '../components/dashboard/ReadEmployees'; 
import {
    FaDollarSign,
    FaUsers,
    FaChair,
    FaPlus,
    FaFolder,
    FaUtensils,
    FaThLarge,
    FaArrowLeft
} from 'react-icons/fa'; 

import Modal from '../components/shared/Modal'; 

const Dashboard = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const [time, setTime] = useState(new Date()); 

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []); 

    const [activeTab, setActiveTab] = useState('menu'); 
    const [openModal, setOpenModal] = useState(false); 

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Server logout request error:", error);
        } finally {
            // Remove current user
            dispatch(removeUser()); 

            //  Alert 
            enqueueSnackbar("Logged out successfully", { variant: "success" });

            // Send them back to the login screen
            navigate("/auth");
        }
    };

    // Query for static metadata counters
    const { data: dashboardResponse, isLoading: statsLoading, isError, error } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: getDashboardStats,
        refetchInterval: 5000,
        staleTime: 3000,
        retry: 2
    }); 

    // Query for dynamic sales tracking from all employees
    const { data: performanceResponse } = useQuery({
        queryKey: ['staff-performance-data'],
        queryFn: getPerformanceMetrics, 
        refetchInterval: 5000,
        staleTime: 3000
    }); 

    // Calculate dynamic totals from staff performance data array
    const performanceList = performanceResponse?.data?.data || []; 
    
    // Reduce metrics out of the employee array safely
    const calculatedTodaySales = performanceList.reduce((sum, item) => sum + (item.todaySales || 0), 0); 
    const calculatedTotalRevenue = performanceList.reduce((sum, item) => sum + (item.sales || 0), 0); 
    
    // Merge structural layout items seamlessly
    const baseStats = dashboardResponse?.data?.data || dashboardResponse?.data || {}; 
    
    const stats = {
        totalMenus: baseStats.totalMenus || 0, 
        totalCategories: baseStats.totalCategories || 0, 
        activeStaff: baseStats.activeStaff || 0, 
        // If the server-side dashboard layout has calculations, trust it or fall back to the live list
        todaySales: calculatedTotalRevenue > 0 ? calculatedTotalRevenue : (baseStats.totalRevenue || 0),
        totalRevenue: baseStats.totalRevenue > 0 ? baseStats.totalRevenue : (calculatedTotalRevenue || 0)
    };

    if (statsLoading) {
        return (
            <div className='min-h-screen bg-[#09090b] text-white flex flex-col gap-4 items-center justify-center'>
                <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium tracking-wide text-neutral-400">Loading Dashboard Essentials...</p>
            </div>
        );
    } 

    if (isError) {
        return (
            <div className='min-h-screen bg-[#09090b] flex items-center justify-center text-red-400 text-lg font-semibold'>
                {error?.response?.data?.message || 'Failed to load dashboard'}
            </div>
        );
    } 

    return (
        <div className='min-h-screen bg-[#09090b] text-neutral-100 antialiased font-sans p-8 selection:bg-yellow-400 selection:text-black'>
            {/* TOP HEADER SECTION */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800/60 pb-8 mb-10 gap-4'>
                <div>
                    <div className='flex items-center gap-2 mt-3'>
                        <div className='px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2'>
                            {user?.role || 'N/A'}
                        </div>
                    </div>

                    <h1 className='text-3xl font-bold tracking-tight text-white flex items-center gap-3'>
                        {time.getHours() < 12 ? 'Good Morning' : time.getHours() < 18 ? 'Good Afternoon' : 'Good Evening'} 
                        <span className="text-yellow-400">{user?.name || 'Admin'}</span> 👋
                    </h1>
                    <p className='text-neutral-400 text-sm mt-1.5 font-medium'>
                        Welcome back. Here's a real-time summary of YumStop's operations tonight.
                    </p>
                </div>

                <div className='bg-neutral-900/50 border border-neutral-800/80 rounded-2xl px-5 py-3 text-left md:text-right shadow-sm backdrop-blur-md'>
                    <h1 className='text-3xl font-bold tracking-wider text-white tabular-nums'>
                        {time.toLocaleTimeString()}
                    </h1>
                    <p className='text-neutral-500 text-xs font-bold uppercase tracking-widest mt-0.5'>
                        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* PERFORMANCE METRICS GRID */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10'>
                <MetricCard title="Today's Sales" value={`${stats.todaySales.toLocaleString()} MMK`} icon={<FaDollarSign />} color="text-emerald-400 bg-emerald-500/10" />
                <MetricCard title="Total Revenue" value={`${stats.totalRevenue.toLocaleString()} MMK`} icon={<FaDollarSign />} color="text-amber-400 bg-amber-500/10" />
                <MetricCard title="Menu Items" value={stats.totalMenus} icon={<FaUtensils />} color="text-pink-400 bg-pink-500/10" />
                <MetricCard title="Categories" value={stats.totalCategories} icon={<FaThLarge />} color="text-cyan-400 bg-cyan-500/10" />
                <MetricCard title="Active Staff" value={stats.activeStaff} icon={<FaUsers />} color="text-indigo-400 bg-indigo-500/10" />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative'>
                {/* LEFT COLUMN COMPOSITE CONTAINER */}
                <div className='lg:col-span-1 flex flex-col gap-6 sticky top-6'>
                    <div className='bg-neutral-900/66 border border-neutral-800/70 rounded-2xl p-5 backdrop-blur-md'>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 px-2">
                            Control Center
                        </h2>
                        
                        <div className='flex flex-col gap-1.5'>
                            {[
                                { id: 'menu', label: 'Menu Management', icon: <FaUtensils className="text-sm" /> },
                                { id: 'category', label: 'Categories Layout', icon: <FaThLarge className="text-sm" /> },
                                { id: 'table', label: 'Service Tables', icon: <FaChair className="text-sm" /> },
                                { id: 'staff', label: 'Staff Management', icon: <FaUsers className="text-sm" /> }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full px-4 py-3.5 rounded-xl font-medium text-sm flex items-center gap-3 transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-yellow-400 text-neutral-950 font-semibold shadow-lg shadow-yellow-400/10'
                                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activeTab !== 'staff' && (
                            <div className="mt-6 pt-5 border-t border-neutral-800/80">
                                <button
                                    onClick={() => setOpenModal(true)}
                                    className='w-full bg-neutral-800 hover:bg-neutral-700 text-white hover:text-yellow-400 border border-neutral-700/60 transition-all duration-200 px-4 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm'
                                >
                                    <FaPlus className="text-xs" />
                                    Create New {activeTab}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="px-4 mt-auto mb-4 w-full">
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl w-full text-neutral-400 hover:text-red-400 bg-transparent border border-neutral-800 hover:border-red-500/30 transition-all duration-300 font-medium text-sm cursor-pointer group hover:shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                        >
                            <FaSignOutAlt className="text-lg text-neutral-500 group-hover:text-red-400 transition-colors duration-300" /> 
                            <span className="tracking-wide">Logout</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT SYSTEM VIEWPORT */}
                <div className='lg:col-span-3 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6 min-h-[500px] shadow-inner'>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-800/80 pb-5 mb-6 gap-3">
                        <div>
                            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest bg-yellow-400/5 px-2.5 py-1 rounded-md border border-yellow-400/10">
                                Current View
                            </span>
                            <h3 className="text-xl font-bold text-white mt-2 capitalize">
                                Active {activeTab === 'staff' ? 'Staff' : activeTab} Database
                            </h3>
                        </div>
                    </div>

                    <div className="transition-opacity duration-300">
                        {activeTab === 'menu' && <ReadMenu />}
                        {activeTab === 'category' && <ReadCategory />}
                        {activeTab === 'table' && <ReadTables />}
                        {activeTab === 'staff' && <ReadEmployees />} 
                    </div>
                </div>
            </div>

            {/* CENTRAL SYSTEM MODAL */}
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <div className="p-1 text-neutral-100 max-w-xl w-full mx-auto">
                    <div className="border-b border-neutral-800/80 pb-4 mb-5 px-3">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <FaFolder className="text-yellow-400 text-base" />
                            Create New Entry: <span className="capitalize text-yellow-400 font-mono text-base">{activeTab}</span>
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1">
                            Fill out the required resource.
                        </p>
                    </div>
                    <div className="px-1 pb-2 text-neutral-300">
                        {activeTab === 'menu' && <CreateMenu onClose={() => setOpenModal(false)} />}
                        {activeTab === 'category' && <CreateCategory onClose={() => setOpenModal(false)} />}
                        {activeTab === 'table' && <CreateTable onClose={() => setOpenModal(false)} />}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const MetricCard = ({ title, value, icon, color }) => {
    return (
        <div className='bg-neutral-900/40 border border-neutral-800/70 rounded-2xl p-5 hover:border-neutral-700/80 transition-all duration-300 group shadow-sm flex flex-col justify-between min-h-[135px]'>
            <div className='flex justify-between items-start gap-4'>
                <h1 className='text-neutral-400 uppercase text-xs font-bold tracking-wider pt-0.5'>{title}</h1>
                <div className={`p-2 rounded-xl text-sm ${color || 'text-yellow-400 bg-neutral-800'} transition-transform group-hover:scale-110 duration-300`}>{icon}</div>
            </div>
            <h1 className='text-3xl font-bold tracking-tight text-white font-sans mt-3 tabular-nums'>{value}</h1>
        </div>
    );
};

export default Dashboard;
