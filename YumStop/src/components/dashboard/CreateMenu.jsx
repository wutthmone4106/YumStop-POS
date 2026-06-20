import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { createMenu, updateMenu, getCategories } from '../../https'; 
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const CreateMenu = ({ onClose, editData }) => {
    const queryClient = useQueryClient();
    const isEditMode = !!editData;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Pre-populate database states if editData parameter exists
    useEffect(() => {
        if (isEditMode && editData) {
            setFormData({
                name: editData.name || '',
                price: editData.price || '',
                category: typeof editData.category === 'object' ? editData.category._id : editData.category || '',
            });
            if (editData.image) {
                const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                const cleanImg = editData.image.replace(/\\/g, '/');
                setImagePreview(cleanImg.startsWith('http') ? cleanImg : `${SERVER_URL}/${cleanImg}`);
            }
        }
    }, [editData, isEditMode]);

    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const activeCategories = categoriesResponse?.data?.data || categoriesResponse?.data || [];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview('');
    };

    // Unified Submission Mutation Handler (Create OR Update)
    const menuMutation = useMutation({
        mutationFn: (data) => {
            if (isEditMode) {
                return updateMenu(editData._id, data);
            } else {
                return createMenu(data);
            }
        },
        onSuccess: () => {
            enqueueSnackbar(isEditMode ? 'Menu updated successfully' : 'Menu created successfully', { variant: 'success' });
            // Invalidate and immediately refetch to replace stale cache
            queryClient.invalidateQueries({ queryKey: ['menus'] });
            onClose();
        },
        onError: (error) => {
            enqueueSnackbar(error.response?.data?.message || 'Transaction submission error', { variant: 'error' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.category) {
            enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('category', formData.category);
        
        // Append image if a new local file was selected
        if (imageFile) {
            data.append('image', imageFile);
        }

        menuMutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4 w-full mx-auto p-2'>
            <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1.5 ml-1">Menu Asset Name</label>
                <input
                    type='text'
                    name='name'
                    placeholder='e.g., Classic Cheese Burger'
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full bg-neutral-950 border border-neutral-800/80 focus:border-yellow-400 text-neutral-100 p-4 rounded-xl outline-none text-sm placeholder:text-neutral-600 transition-colors duration-200'
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-semibold text-neutral-400 block mb-1.5 ml-1">Base Price (MMK)</label>
                    <input
                        type='number'
                        name='price'
                        placeholder='0.00 MMK'
                        value={formData.price}
                        onChange={handleChange}
                        className='w-full bg-neutral-950 border border-neutral-800/80 focus:border-yellow-400 text-neutral-100 p-4 rounded-xl outline-none text-sm placeholder:text-neutral-600 transition-colors duration-200'
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-neutral-400 block mb-1.5 ml-1">Category</label>
                    <div className="relative">
                        <select
                            name='category'
                            value={formData.category}
                            onChange={handleChange}
                            disabled={isCategoriesLoading}
                            className='w-full bg-neutral-950 border border-neutral-800/80 focus:border-yellow-400 text-neutral-100 p-4 pr-10 rounded-xl outline-none text-sm transition-colors duration-200 cursor-pointer appearance-none disabled:opacity-50'
                        >
                            <option value="" disabled className="text-neutral-600">
                                {isCategoriesLoading ? 'Loading added categories...' : '-- Choose Custom Category --'}
                            </option>
                            {activeCategories.map((cat) => {
                                const categoryName = typeof cat === 'object' ? cat.name : cat;
                                const categoryValue = typeof cat === 'object' ? cat._id : cat;
                                return (
                                    <option key={categoryValue} value={categoryValue} className="bg-neutral-950 text-neutral-100">
                                        {categoryName}
                                    </option>
                                );
                            })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1.5 ml-1">Menu Media Display Image</label>
                {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 bg-neutral-950 border border-dashed border-neutral-800 rounded-xl cursor-pointer hover:border-yellow-400/60 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaCloudUploadAlt className="text-xl text-neutral-500 group-hover:text-yellow-400 transition-colors mb-2" />
                            <p className="text-xs font-medium text-neutral-400">Click to upload from local device</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                ) : (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-neutral-800">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-lg backdrop-blur-sm transition-colors duration-200"
                        >
                            <FaTimes className="text-xs" />
                        </button>
                    </div>
                )}
            </div>

            <button
                type='submit'
                disabled={menuMutation.isPending}
                className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-neutral-950 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 mt-2'
            >
                {menuMutation.isPending ? 'Processing transaction...' : isEditMode ? 'Save Changes' : 'Add Menu Item'}
            </button>
        </form>
    );
};

export default CreateMenu;
