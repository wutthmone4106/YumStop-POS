import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTrash, FaFolder, FaThLarge, FaPencilAlt } from 'react-icons/fa';

// BACKEND CONNECTION: Connecting with backend API routes
import { getCategories, deleteCategory } from '../../https';
import CreateCategory from './CreateCategory';

const ReadCategory = () => {
    const queryClient = useQueryClient();

    // Modal HUD Controls for Editing
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCategoryToEdit, setSelectedCategoryToEdit] = useState(null);

    // Modal HUD Controls for Deleting
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);

    // TanStack Query to track categories state from backend
    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    // Delete handling mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            setIsDeleteOpen(false);
            setSelectedCategoryToDelete(null);
        }
    });

    const categories = data?.data?.data || [];

    const handleDeleteConfirm = () => {
        if (selectedCategoryToDelete) {
            deleteMutation.mutate(selectedCategoryToDelete._id);
        }
    };

    // LOADING SKELETON PLACEHOLDER
    if (isLoading) {
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-neutral-900/20 border border-neutral-800/60 rounded-2xl h-[110px] animate-pulse p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4 w-2/3">
                            <div className="w-12 h-12 bg-neutral-800/50 rounded-xl"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-neutral-800/50 rounded w-full"></div>
                                <div className="h-3 bg-neutral-800/30 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="w-8 h-8 bg-neutral-800/40 rounded-lg"></div>
                    </div>
                ))}
            </div>
        );
    }

    // SERVER ERROR STATE
    if (isError) {
        return (
            <div className="text-center py-16 border border-dashed border-red-500/20 rounded-2xl bg-red-500/5 backdrop-blur-sm">
                <p className="text-red-400 text-sm font-semibold tracking-wide">Category Data Fetch Failed</p>
                <p className="text-neutral-500 text-xs mt-1">Please verify your server instance or configuration endpoint.</p>
            </div>
        );
    }

    // MATCHED EMPTY STATE DESIGN
    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-neutral-800/60 rounded-3xl bg-neutral-900/10 min-h-[340px]">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-center mb-4 text-neutral-400 shadow-md">
                    <FaThLarge className="text-base text-neutral-500" />
                </div>
                <p className="text-neutral-200 text-sm font-semibold tracking-tight">Category Catalog is Empty</p>
                <p className="text-neutral-500 text-xs mt-1.5 max-w-xs mx-auto text-center leading-relaxed px-6">
                    Use the "Create New Category" button on your sidebar to instantly organize your layouts.
                </p>
            </div>
        );
    }

    return (
        <div className='w-full'>
            {/* VIEWPORT SCROLL CONTAINER WITH INLINE WEBKIT SCROLLBAR AND PRECISE ROW CUT AT 8 CARDS */}
            <div className="max-h-[320px] overflow-y-auto pr-2 pb-2
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-neutral-950/20
                [&::-webkit-scrollbar-track]:rounded-xl
                [&::-webkit-scrollbar-thumb]:bg-neutral-800
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700"
            >
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className='group bg-neutral-900/30 border border-neutral-800/60 hover:border-neutral-700/80 rounded-2xl p-5 transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-black/20'
                        >
                            {/* INFO META SEGMENT */}
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center text-amber-400 text-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                                    <FaFolder />
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className='font-bold text-base text-white tracking-tight group-hover:text-yellow-400 transition-colors duration-200 truncate'>
                                        {category.name}
                                    </h4>
                                    <p className="text-neutral-500 text-[11px] font-mono mt-0.5 select-all">
                                        ID: {category._id?.substring(category._id.length - 8)}
                                    </p>
                                </div>
                            </div>

                            {/* OPERATION CONTROLS */}
                            <div className='flex items-center gap-1.5'>
                                {/* EDIT BUTTON */}
                                <button
                                    onClick={() => {
                                        setSelectedCategoryToEdit(category);
                                        setIsEditOpen(true);
                                    }}
                                    className='text-neutral-500 hover:text-yellow-400 p-2.5 rounded-xl hover:bg-yellow-400/10 border border-transparent hover:border-yellow-400/10 transition-all duration-200 flex items-center justify-center flex-shrink-0'
                                    title="Edit Category"
                                >
                                    <FaPencilAlt className="text-xs" />
                                </button>

                                {/* DELETE BUTTON */}
                                <button 
                                    onClick={() => {
                                        setSelectedCategoryToDelete(category);
                                        setIsDeleteOpen(true);
                                    }}
                                    className='text-neutral-500 hover:text-red-400 p-2.5 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all duration-200 flex items-center justify-center flex-shrink-0'
                                    title="Remove Category"
                                >
                                    <FaTrash className="text-xs" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* UPDATE SYSTEM OVERLAY DIALOGUE MODAL */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
                            <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Modify Category Resource</h3>
                            <button onClick={() => { setIsEditOpen(false); setSelectedCategoryToEdit(null); }} className="text-neutral-500 hover:text-white text-sm">✕</button>
                        </div>
                        <CreateCategory editData={selectedCategoryToEdit} onClose={() => { setIsEditOpen(false); setSelectedCategoryToEdit(null); }} />
                    </div>
                </div>
            )}

            {/* CONFIRM SYSTEM PURGE MODAL OVERLAY */}
            {isDeleteOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl text-center space-y-4">
                        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-sm">
                            <FaTrash />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-200">Remove Category?</h3>
                            <p className="text-xs text-neutral-500 mt-1">
                                Confirm complete deletion of <span className="text-neutral-300 font-bold">"{selectedCategoryToDelete?.name}"</span> from your catalog indexing. This action cannot be undone.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                                onClick={() => { setIsDeleteOpen(false); setSelectedCategoryToDelete(null); }}
                                className="bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 text-neutral-400 py-2.5 rounded-xl font-medium text-xs transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteConfirm}
                                disabled={deleteMutation.isPending}
                                className="bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white py-2.5 rounded-xl font-bold text-xs transition-colors"
                            >
                                {deleteMutation.isPending ? 'Removing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReadCategory;
