import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WarehouseChart = ({ data }) => {
    // Expected format: [{ name: 'WH-1', capacity: 1000, utilized: 600 }]
    if (!data || data.length === 0) return <div className="p-4 text-center">No chart data</div>;

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', color: '#fff' }} />
                    <Bar dataKey="utilized" stackId="a" fill="#10B981" name="Utilized" />
                    <Bar dataKey="capacity" stackId="a" fill="#E5E7EB" name="Available Capacity" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WarehouseChart;
