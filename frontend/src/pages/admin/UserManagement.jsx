import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import UserTable from '../../components/users/UserTable';
import UserForm from '../../components/users/UserForm';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers();
            setUsers(data.items || data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(id);
                toast.success("User deleted");
                fetchUsers();
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (editingUser) {
                // If password is not changed, remove it from payload
                const payload = { ...data };
                if (!payload.password) delete payload.password;
                
                await userService.updateUser(editingUser.id, payload);
                toast.success("User updated successfully");
            } else {
                await userService.createUser(data);
                toast.success("User created successfully");
            }
            setIsModalOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.detail || "Operation failed");
        }
    };

    return (
        <div className="p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage access and roles across the organization.</p>
                </div>
                <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                    <Plus size={20} className="mr-2" />
                    Add User
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? <div className="p-8 text-center text-gray-500">Loading users...</div> : <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                        <UserForm 
                            initialData={editingUser} 
                            onSubmit={handleSubmit} 
                            onCancel={() => setIsModalOpen(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
