import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/ui';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const getDashboardPath = (roleId) => {
    const role = roleId?.toLowerCase();
    return ['admin', 'manager', 'staff', 'viewer'].includes(role)
        ? `/${role}/dashboard`
        : '/viewer/dashboard';
};

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const result = await login(data);
            toast.success('Logged in successfully');
            navigate(getDashboardPath(result.user?.role_id), { replace: true });
        } catch (error) {
            toast.error(error.message || 'Login failed');
        }
    };

    return (
        <div className="w-full max-w-md bg-neutral-0 dark:bg-neutral-900 rounded-2xl shadow-card p-8 border border-neutral-200 dark:border-neutral-800">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">Welcome back</h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            error={errors.email?.message}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                        />
                    )}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-neutral-300 rounded bg-neutral-0 dark:bg-neutral-800 dark:border-neutral-700"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-900 dark:text-neutral-300">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link to="/forgot-password" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        fullWidth
                        isLoading={loading}
                        size="lg"
                    >
                        Sign in
                    </Button>
                </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Don't have an account? </span>
                <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
                    Register here
                </Link>
            </div>
        </div>
    );
};

export default Login;
