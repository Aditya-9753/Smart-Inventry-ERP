import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const UserTable = ({ users, onEdit, onDelete }) => {
    if (!users || users.length === 0) return <div className="p-4 text-center">No users found.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium">
                                    {user.role_id}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm">
                                <button onClick={() => onEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-3 dark:text-indigo-400">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-900 dark:text-red-400">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
