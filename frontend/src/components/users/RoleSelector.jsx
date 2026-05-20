import React from 'react';

const RoleSelector = ({ register, error }) => {
    // Ideally fetched from DB, mocking standard roles for now based on backend constraints
    const roles = [
        { id: 'ADMIN', name: 'Admin' },
        { id: 'MANAGER', name: 'Manager' },
        { id: 'STAFF', name: 'Staff' },
        { id: 'VIEWER', name: 'Viewer' }
    ];

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select 
                {...register('role_id')} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
            >
                <option value="">Select a role</option>
                {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
};

export default RoleSelector;
