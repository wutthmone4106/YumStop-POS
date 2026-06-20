import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { createCategory, updateCategory } from '../../https'; // Make sure updateCategory is imported

const CreateCategory = ({ onClose, editData }) => {
    const queryClient = useQueryClient();
    const isEditMode = !!editData; // Tracks if we are editing an existing item
    const [name, setName] = useState('');

    // Pre-populate input field with old data if in Edit Mode
    useEffect(() => {
        if (isEditMode && editData) {
            setName(editData.name || '');
        }
    }, [editData, isEditMode]);

    // Handle both Create and Update Operations
    const categoryMutation = useMutation({
        mutationFn: (payload) => {
            if (isEditMode) {
                return updateCategory(editData._id, payload);
            } else {
                return createCategory(payload);
            }
        },
        onSuccess: () => {
            enqueueSnackbar(
                isEditMode ? 'Category modified successfully' : 'Category created successfully', 
                { variant: 'success' }
            );
            queryClient.invalidateQueries(['categories']);
            onClose();
        },
        onError: (error) => {
            enqueueSnackbar(
                error.response?.data?.message || 'Error processing transaction', 
                { variant: 'error' }
            );
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            enqueueSnackbar('Category name cannot be empty', { variant: 'warning' });
            return;
        }
        
        // Mutate with a clean payload format
        categoryMutation.mutate({ name: name.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full p-2 space-y-4">
            <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1.5 ml-1">
                    Category Title
                </label>
                <input
                    type='text'
                    placeholder='e.g., Desserts, Beverages'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full bg-neutral-950 border border-neutral-800/80 focus:border-yellow-400 text-neutral-100 p-4 rounded-xl outline-none text-sm placeholder:text-neutral-600 transition-colors duration-200'
                />
            </div>

            <button
                type='submit'
                disabled={categoryMutation.isPending}
                className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-neutral-950 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-yellow-400/5'
            >
                {categoryMutation.isPending 
                    ? 'Processing...' 
                    : isEditMode ? 'Save Altered Changes' : 'Add Category'
                }
            </button>
        </form>
    );
};

export default CreateCategory;
