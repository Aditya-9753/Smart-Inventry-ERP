import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No data</div>;

    return (
        <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" scale="band" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey="stock" stroke="#ff7300" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;
