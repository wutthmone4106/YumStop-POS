import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTables, deleteTable } from '../../https';
import { FaSearch, FaTrash, FaPencilAlt, FaCheckCircle, FaExclamationCircle, FaUserFriends } from 'react-icons/fa';
import CreateTable from './CreateTable';

const ReadTable = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');

    // Modal HUD Interfaces Controls
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTableToEdit, setSelectedTableToEdit] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTableToDelete, setSelectedTableToDelete] = useState(null);

    // Fetch live tables array payload from data pipelines
    const { data: tablesResponse, isLoading } = useQuery({
        queryKey: ['tables'],
        queryFn: getTables,
    });

    // Delete Mutation 
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteTable(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['tables']);
            setIsDeleteOpen(false);
            setSelectedTableToDelete(null);
        }
    });

    const databaseTables = tablesResponse?.data?.data || tablesResponse?.data || [];

    // Filters tables dynamically based on matching text designations
    const filteredTables = databaseTables.filter((table) => 
        table.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteConfirm = () => {
        if (selectedTableToDelete) {
            deleteMutation.mutate(selectedTableToDelete._id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-neutral-500 font-medium">Syncing Table Layout...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            
            {/* INPUT FILTER TRACKER UTILITIES */}
            <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 text-xs" />
                <input
                    type="text"
                    placeholder="Search by table label..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800/80 focus:border-yellow-400/60 text-neutral-200 pl-10 pr-4 py-3 rounded-xl outline-none text-xs placeholder:text-neutral-600 transition-colors"
                />
            </div>

            <div className="max-h-[290px] overflow-y-auto pr-2 pb-2
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-neutral-950/20
                [&::-webkit-scrollbar-track]:rounded-xl
                [&::-webkit-scrollbar-thumb]:bg-neutral-800
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700"
            >
                {filteredTables.length === 0 ? (
                    <div className="flex flex-col items-center justify-center border border-dashed border-neutral-800/80 rounded-xl p-12 text-center bg-neutral-950/20">
                        <p className="text-xs font-semibold text-neutral-500">No registered table units match your search query</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredTables.map((table) => {
                            const isOccupied = table.status === 'Occupied';

                            return (
                                <div 
                                    key={table._id}
                                    className="bg-neutral-950/40 border border-neutral-800/80 p-4 rounded-xl flex flex-col items-center justify-center text-center relative group min-h-[130px] hover:border-neutral-700/60 transition-all duration-200"
                                >
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-600">Table</span>
                                    <h3 className="text-2xl font-black text-white mt-0.5 font-mono truncate max-w-full px-1">
                                        {table.tableNumber}
                                    </h3>
                                    
                                    {/* CAPACITY INFO INTERFACE BADGE */}
                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-400 font-medium font-mono">
                                        <FaUserFriends className="text-neutral-600 text-[10px]" />
                                        <span>Max {table.capacity || 0} Pax</span>
                                    </div>
                                    
                                    {/* SCHEMA STATUS CONDITIONAL RENDERING BADGE */}
                                    <div className={`flex items-center gap-1 mt-2 text-[9px] px-2 py-0.5 rounded-full border font-medium ${
                                        isOccupied 
                                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
                                            : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                                    }`}>
                                        {isOccupied ? (
                                            <>
                                                <FaExclamationCircle className="text-[8px]" /> Occupied
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle className="text-[8px]" /> Available
                                            </>
                                        )}
                                    </div>

                                    {/* HUD ACTION FLAPS */}
                                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950 rounded-md p-0.5 border border-neutral-800 shadow-xl z-10">
                                        <button
                                            onClick={() => { setSelectedTableToEdit(table); setIsEditOpen(true); }}
                                            className="p-1.5 hover:bg-yellow-400/20 text-neutral-500 hover:text-yellow-400 rounded transition-colors text-[10px]"
                                            title="Edit assignment configuration"
                                        >
                                            <FaPencilAlt />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedTableToDelete(table); setIsDeleteOpen(true); }}
                                            className="p-1.5 hover:bg-red-500/20 text-neutral-500 hover:text-red-500 rounded transition-colors text-[10px]"
                                            title="Deregister unit"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* UPDATE SYSTEM OVERLAY DIALOGUE MODAL */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
                            <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Modify Table Configuration</h3>
                            <button onClick={() => { setIsEditOpen(false); setSelectedTableToEdit(null); }} className="text-neutral-500 hover:text-white text-sm">✕</button>
                        </div>
                        <CreateTable editData={selectedTableToEdit} onClose={() => { setIsEditOpen(false); setSelectedTableToEdit(null); }} />
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
                            <h3 className="text-sm font-bold text-neutral-200">Delete Service Table?</h3>
                            <p className="text-xs text-neutral-500 mt-1">
                                Confirm complete deletion of <span className="text-neutral-300 font-mono font-bold">Table {selectedTableToDelete?.tableNumber}</span> from your terminal workspace dashboard database grid mapping.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                                onClick={() => { setIsDeleteOpen(false); setSelectedTableToDelete(null); }}
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

export default ReadTable;