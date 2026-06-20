import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMenus, getCategories, deleteMenu } from '../../https'; 
import { FaUtensils, FaFolderOpen, FaSearch, FaRegFolder, FaPencilAlt, FaTrash } from 'react-icons/fa';
import CreateMenu from './CreateMenu'; 

const ReadMenu = () => {
    const queryClient = useQueryClient();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal Control States
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedMenuToEdit, setSelectedMenuToEdit] = useState(null);
    
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMenuToDelete, setSelectedMenuToDelete] = useState(null);

    const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Queries
    const { data: categoriesResponse, isLoading: isCatsLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const { data: menusResponse, isLoading: isMenusLoading } = useQuery({
        queryKey: ['menus'],
        queryFn: getMenus,
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteMenu(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['menus']);
            setIsDeleteOpen(false);
            setSelectedMenuToDelete(null);
        }
    });

    // Added categories from backend
    const databaseCategories = categoriesResponse?.data?.data || categoriesResponse?.data || [];
    const databaseMenus = menusResponse?.data?.data || menusResponse?.data || [];

    const processedCategories = databaseCategories.map(cat => 
        typeof cat === 'object' ? cat.name : cat
    );

    // Filter Menu
    const filteredMenus = databaseMenus.filter((menu) => {
        const matchesCategory = selectedCategory === 'All' || 
            (typeof menu.category === 'object' ? menu.category.name : menu.category) === selectedCategory;
        const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDeleteConfirm = () => {
        if (selectedMenuToDelete) {
            deleteMutation.mutate(selectedMenuToDelete._id);
        }
    };

    if (isCatsLoading || isMenusLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-neutral-500 font-medium">Loading Catalog Layout...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            
            {/* SEARCH AND FILTER SUB-HEADER SECTION */}
            <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 text-xs" />
                <input
                    type="text"
                    placeholder="Search menus..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800/80 focus:border-yellow-400/60 text-neutral-200 pl-10 pr-4 py-3 rounded-xl outline-none text-xs placeholder:text-neutral-600 transition-colors"
                />
            </div>

            {/* TWO-COLUMN CONTENT GRID HOUSING */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                
                {/* LEFT CATEGORIES FILTER PANEL */}
                <div className="md:col-span-1 bg-neutral-950/40 border border-neutral-800/60 rounded-xl p-4 flex flex-col max-h-[294px]">
                    <div className="flex items-center gap-2 px-1 pb-2 border-b border-neutral-800/60 flex-shrink-0">
                        <FaFolderOpen className="text-yellow-400 text-xs" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Filter Categories</h4>
                    </div>
                    
                    {/* SCROLLABLE INNER CATEGORY BARS */}
                    <div className="flex-1 overflow-y-auto mt-2 pr-1 space-y-1 
                        [&::-webkit-scrollbar]:w-1.5
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-neutral-800/80
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700/80">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all w-full flex items-center justify-between ${
                                selectedCategory === 'All'
                                    ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-semibold'
                                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                            }`}
                        >
                            <span>All Items</span>
                            <span className="text-[10px] bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 text-neutral-400">
                                {databaseMenus.length}
                            </span>
                        </button>

                        {processedCategories.map((catName) => {
                            const count = databaseMenus.filter(m => 
                                (typeof m.category === 'object' ? m.category.name : m.category) === catName
                            ).length;

                            return (
                                <button
                                    key={catName}
                                    onClick={() => setSelectedCategory(catName)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all w-full flex items-center justify-between ${
                                        selectedCategory === catName
                                            ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-semibold'
                                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                                    }`}
                                >
                                    <span className="truncate mr-2">{catName}</span>
                                    <span className="text-[10px] bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 text-neutral-400">
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT MENUS MANAGEMENT PANEL */}
                <div className="md:col-span-3 overflow-y-auto max-h-[294px] pr-1
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-neutral-950/20
                    [&::-webkit-scrollbar-track]:rounded-xl
                    [&::-webkit-scrollbar-thumb]:bg-neutral-800
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700">
                    
                    {filteredMenus.length === 0 ? (
                        <div className="flex flex-col items-center justify-center border border-dashed border-neutral-800/80 rounded-xl p-12 text-center bg-neutral-950/20 h-[294px]">
                            <FaUtensils className="text-neutral-700 text-xl mb-3" />
                            <h4 className="text-xs font-semibold text-neutral-400">No matching menu assets found</h4>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                            {filteredMenus.map((menu) => {
                                const imagePath = menu.image ? menu.image.replace(/\\/g, '/') : '';
                                const fullImageUrl = imagePath.startsWith('http') ? imagePath : `${SERVER_URL}/${imagePath}`;

                                return (
                                    <div 
                                        key={menu._id} 
                                        className="bg-neutral-950/40 border border-neutral-800/70 p-3 rounded-xl flex gap-3 hover:border-neutral-700/60 transition-all duration-200 group relative h-[94px]"
                                    >
                                        {menu.image && (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 border border-neutral-800">
                                                <img 
                                                    src={fullImageUrl} 
                                                    alt={menu.name} 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = "https://placehold.co/150x150/0a0a0a/a3a3a3?text=No+Image"; }}
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0 pr-16">
                                            <div>
                                                <h4 className="text-xs font-bold text-white truncate">{menu.name}</h4>
                                                <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500 font-medium mt-0.5 capitalize">
                                                    <FaRegFolder className="text-[9px]" />
                                                    {typeof menu.category === 'object' ? menu.category.name : menu.category}
                                                </span>
                                            </div>
                                            <p className="text-xs font-mono font-bold text-yellow-400 mt-1">
                                                {Number(menu.price).toLocaleString()} MMK
                                            </p>
                                        </div>

                                        {/* ACTIONS HOVER TOGGLE HUD CONTROLS */}
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-950 pl-2 py-1 rounded-lg shadow-xl">
                                            <button
                                                onClick={() => { setSelectedMenuToEdit(menu); setIsEditOpen(true); }}
                                                className="p-2 bg-neutral-900 hover:bg-yellow-400/20 text-neutral-400 hover:text-yellow-400 rounded-lg transition-colors"
                                                title="Edit Item"
                                            >
                                                <FaPencilAlt className="text-[10px]" />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedMenuToDelete(menu); setIsDeleteOpen(true); }}
                                                className="p-2 bg-neutral-900 hover:bg-red-500/20 text-neutral-400 hover:text-red-500 rounded-lg transition-colors"
                                                title="Delete Item"
                                            >
                                                <FaTrash className="text-[10px]" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* MODALS RENDERING HOOKS */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
                        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
                            <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Update Menu Entry</h3>
                            <button 
                                onClick={() => { setIsEditOpen(false); setSelectedMenuToEdit(null); }} 
                                className="text-neutral-500 hover:text-white text-sm"
                            >✕</button>
                        </div>
                        <CreateMenu 
                            key={selectedMenuToEdit?._id || 'edit-menu-fresh'}
                            editData={selectedMenuToEdit} 
                            onClose={() => { setIsEditOpen(false); setSelectedMenuToEdit(null); }} 
                        />
                    </div>
                </div>
            )}

            {isDeleteOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl text-center space-y-4">
                        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-lg">
                            <FaTrash />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-200">Remove Menu Item?</h3>
                            <p className="text-xs text-neutral-500 mt-1">
                                Are you sure you want to delete <span className="text-neutral-300 font-semibold">"{selectedMenuToDelete?.name}"</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                                onClick={() => { setIsDeleteOpen(false); setSelectedMenuToDelete(null); }}
                                className="bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 text-neutral-400 py-2.5 rounded-xl font-medium text-xs transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteConfirm}
                                disabled={deleteMutation.isPending}
                                className="bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white py-2.5 rounded-xl font-bold text-xs transition-colors"
                            >
                                {deleteMutation.isPending ? 'Removing...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ReadMenu;
