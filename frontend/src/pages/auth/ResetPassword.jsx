import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const schema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, data.password);
            toast.success('Password has been reset successfully.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
                <p className="mt-2 text-sm text-gray-600">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <div className="mt-1 relative">
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="mt-1">
                        <input
                            {...register('confirmPassword')}
                            type={showPassword ? 'text' : 'password'}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
