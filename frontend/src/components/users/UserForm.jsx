import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import RoleSelector from './RoleSelector';

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email format'),
    role_id: z.string().min(1, 'Role is required'),
    password: z.string().optional()
});

const UserForm = ({ initialData, onSubmit, onCancel }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: '', email: '', role_id: '', password: '' }
    });

    useEffect(() => {
        if (initialData) {
            reset({ ...initialData, password: '' });
        } else {
            reset();
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input {...register('name')} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input {...register('email')} type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <RoleSelector register={register} error={errors.role_id} />

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password {initialData ? '(Leave blank to keep unchanged)' : ''}
                </label>
                <input {...register('password')} type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
