import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, updateEmployee, deleteEmployee } from '../../https';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const ReadEmployees = () => {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', role: '' });

    // React Query fetch
    const { data, isLoading, isError } = useQuery({
        queryKey: ['employees'],
        queryFn: getEmployees
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateEmployee(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            setEditingId(null);
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteEmployee(id),
        onSuccess: () => queryClient.invalidateQueries(['employees'])
    });

    const startEditing = (emp) => {
        setEditingId(emp._id);
        setEditForm({ name: emp.name, email: emp.email, phone: emp.phone, role: emp.role });
    };

    const handleSave = (id) => {
        updateMutation.mutate({ id, payload: editForm });
    };

    if (isLoading) return <p className="text-neutral-400 text-sm">Loading staff records...</p>;
    if (isError) return <p className="text-red-400 text-sm">Error reading employees.</p>;

    const staffList = data?.data?.data || [];

    return (
        <div className="overflow-x-auto w-full max-h-[380px] overflow-y-auto pr-2 
            scrollbar-thin 
            scrollbar-thumb-neutral-800 
            scrollbar-track-transparent 
            hover:scrollbar-thumb-neutral-700">
            
            <table className="w-full text-left border-collapse text-sm">
                <thead className="sticky top-0 bg-[#09090b] z-10">
                    <tr className="border-b border-neutral-800 text-neutral-400 font-semibold">
                        <th className="pb-3 pl-2">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">System Role</th>
                        <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                    {staffList.map((emp) => (
                        <tr key={emp._id} className="hover:bg-neutral-900/20 text-neutral-200 transition-colors h-[53px]">
                            {editingId === emp._id ? (
                                <>
                                    <td className="py-2 pl-2">
                                        <input 
                                            type="text" 
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white text-xs focus:border-yellow-400 outline-none w-28"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <input 
                                            type="email" 
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white text-xs focus:border-yellow-400 outline-none w-36"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <input 
                                            type="text" 
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white text-xs focus:border-yellow-400 outline-none w-28"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <select 
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white text-xs focus:border-yellow-400 outline-none"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Cashier">Cashier</option>
                                        </select>
                                    </td>
                                    <td className="py-2 pr-2 text-right space-x-2">
                                        <button onClick={() => handleSave(emp._id)} className="text-emerald-400 hover:text-emerald-300 p-1">
                                            <FaCheck className="text-xs" />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="text-neutral-400 hover:text-white p-1">
                                            <FaTimes className="text-xs" />
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="py-3 pl-2 font-medium text-white">{emp.name}</td>
                                    <td className="py-3 text-neutral-400">{emp.email}</td>
                                    <td className="py-3 text-neutral-400">{emp.phone}</td>
                                    <td className="py-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                            emp.role === 'Admin' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-neutral-800 text-neutral-400'
                                        }`}>
                                            {emp.role}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-2 text-right space-x-2">
                                        <button onClick={() => startEditing(emp)} className="text-neutral-500 hover:text-yellow-400 transition-colors p-1">
                                            <FaEdit className="text-xs" />
                                        </button>
                                        <button onClick={() => deleteMutation.mutate(emp._id)} className="text-neutral-500 hover:text-red-400 transition-colors p-1">
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReadEmployees;
