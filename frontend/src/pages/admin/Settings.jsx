import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { API_URLS } from '../../api/endpoints';
import toast from 'react-hot-toast';

const Settings = () => {
    const [settings, setSettings] = useState([]);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    const fetchSettings = async () => {
        try {
            const response = await api.get(API_URLS.SETTINGS);
            setSettings(response.data);
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (key, value) => {
        try {
            await api.put(API_URLS.SETTINGS, { key, value });
            toast.success(`Updated setting: ${key}`);
            fetchSettings();
        } catch (error) {
            toast.error('Failed to update setting');
        }
    };

    const handleAddNew = (e) => {
        e.preventDefault();
        if (newKey && newValue) {
            handleUpdate(newKey, newValue);
            setNewKey('');
            setNewValue('');
        }
    };

    return (
        <div className="p-6 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Settings</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Setting</h3>
                <form onSubmit={handleAddNew} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Key Name</label>
                        <input type="text" value={newKey} onChange={e => setNewKey(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Value</label>
                        <input type="text" value={newValue} onChange={e => setNewValue(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 h-10">Add</button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Existing Settings</h3>
                {settings.length === 0 ? (
                    <p className="text-gray-500">No settings found.</p>
                ) : (
                    <ul className="space-y-4">
                        {settings.map(setting => (
                            <li key={setting.id} className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                                <div className="flex-1">
                                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">{setting.key}</span>
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        defaultValue={setting.value} 
                                        onBlur={(e) => {
                                            if (e.target.value !== setting.value) {
                                                handleUpdate(setting.key, e.target.value);
                                            }
                                        }}
                                        className="w-full px-3 py-1.5 border rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white text-sm"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Settings;
