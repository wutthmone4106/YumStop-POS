import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { createTable, updateTable } from '../../https';

const CreateTable = ({ onClose, editData }) => {
    const queryClient = useQueryClient();
    const isEditMode = !!editData;
    
    const [formData, setFormData] = useState({
        tableNumber: '',
        capacity: ''
    });

    // Pre-populate input rows if editData parameter is active
    useEffect(() => {
        if (isEditMode && editData) {
            setFormData({
                tableNumber: editData.tableNumber || '',
                capacity: editData.capacity || ''
            });
        }
    }, [editData, isEditMode]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const tableMutation = useMutation({
    mutationFn: (data) => {
        if (isEditMode) {
            return updateTable(editData._id, data);
        } else {
            return createTable(data);
        }
    },
    onSuccess: () => {
        enqueueSnackbar(
            isEditMode ? 'Table assignment modified successfully' : 'Table registered successfully', 
            { variant: 'success' }
        );
        queryClient.invalidateQueries(['tables']);
        onClose();
    },
    onError: (error) => {
        const serverMessage = error.response?.data?.message || '';
        
        if (serverMessage.includes('E11000') || error.response?.data?.error?.code === 11000) {
            enqueueSnackbar('This Table Designation Label already exists!', { variant: 'error' });
        } else {
            enqueueSnackbar(serverMessage || 'Error executing transaction', { variant: 'error' });
        }
    }
    });


    const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tableNumber || !formData.capacity) {
        enqueueSnackbar('All table configuration fields are required', { variant: 'warning' });
        return;
    }
    
    // Clean whitespace around the input text string
    let cleanedLabel = formData.tableNumber.trim();
    
    // Check if input is only a single numerical digit and pad it (e.g., "2" -> "02")
    if (/^\d+$/.test(cleanedLabel) && cleanedLabel.length === 1) {
        cleanedLabel = cleanedLabel.padStart(2, '0');
    }
    
    // Mutate using your schema-compliant properties
    tableMutation.mutate({
        tableNumber: cleanedLabel,          // Automatically padded to "01", "02", "11", etc.
        capacity: Number(formData.capacity)       
    });
};

    return (
        <form onSubmit={handleSubmit} className="w-full p-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* TABLE NUMBER LABEL */}
                <div>
                    <label className="text-xs font-semibold text-neutral-400 block mb-1.5 ml-1">
                        Table Designation Label
                    </label>
                    <input
                        type='text' // Stored as String type in database (allows inputs like 'T-1' or '12')
                        name='tableNumber'
                        placeholder='e.g., 12 or T-1'
                        value={formData.tableNumber}
                        onChange={handleChange}
                        className='w-full bg-neutral-950 border border-neutral-800/80 focus:border-yellow-400 text-neutral-100 p-4 rounded-xl outline-none text-sm placeholder:text-neutral-600 transition-colors duration-200'
                    />
                </div>

                {/* CAPACITY CAPACITY THRESHOLD */}
                <div>
                    <label className="text-xs font-semibold text-neutral-400 block mb-1.5 ml-1">
                        Seating Capacity
                    </label>
                    <input
                        type='number'
                        name='capacity'
                        placeholder='e.g., 4'
                        value={formData.capacity}
                        onChange={handleChange}
                        className='w-full bg-neutral-950 border border-neutral-800/80 focus:border-yellow-400 text-neutral-100 p-4 rounded-xl outline-none text-sm placeholder:text-neutral-600 transition-colors duration-200'
                    />
                </div>
            </div>

            <button
                type='submit'
                disabled={tableMutation.isPending}
                className='w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-neutral-950 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-yellow-400/5'
            >
                {tableMutation.isPending 
                    ? 'Processing transaction...' 
                    : isEditMode ? 'Save Changes' : 'Add Service Table'
                }
            </button>
        </form>
    );
};

export default CreateTable;
