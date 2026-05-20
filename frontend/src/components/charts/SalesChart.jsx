import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesChart = ({ data }) => {
    // Expected data format: [{ date: '2023-01-01', sales: 1000 }, ...]
    if (!data || data.length === 0) {
        return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;
    }

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        cursor={{fill: 'rgba(107, 114, 128, 0.1)'}}
                    />
                    <Legend />
                    <Bar dataKey="sales" name="Sales Volume" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
