import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const InventoryChart = ({ data }) => {
    // Expected data format: [{ date: '2023-01-01', in: 100, out: 50 }, ...]
    if (!data || data.length === 0) {
        return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;
    }

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        itemStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="in" name="Stock In" stroke="#10B981" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="out" name="Stock Out" stroke="#EF4444" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default InventoryChart;
