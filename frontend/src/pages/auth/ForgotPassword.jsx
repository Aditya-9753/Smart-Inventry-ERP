import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const schema = z.object({
    email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await authService.forgotPassword(data.email);
            toast.success('If this email is registered, a reset link has been sent.');
        } catch (error) {
            // Even on error, we don't want to leak user existence, but handling network errors
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Forgot Password</h2>
                <p className="mt-2 text-sm text-gray-600">Enter your email to receive a reset link</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1">
                        <input
                            {...register('email')}
                            type="email"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Back to login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
