import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    // Defaulting to a fixed role for simplicity or we can add a dropdown if required
});

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await registerUser({ ...data, role_id: "default_role_id" }); // Mock role_id, ideally fetched from DB
            toast.success('Registration successful. Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                <p className="mt-2 text-sm text-gray-600">Join the Smart Inventory ERP</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1">
                        <input
                            {...register('name')}
                            type="text"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1">
                        <input
                            {...register('email')}
                            type="email"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
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
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                </Link>
            </div>
        </div>
    );
};

export default Register;
