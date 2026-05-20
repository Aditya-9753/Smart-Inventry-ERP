import React, { useState } from 'react';
import { File } from 'lucide-react';
import { reportService } from '../../services/reportService';
import { downloadBlob } from '../../utils/exportHelpers';
import toast from 'react-hot-toast';

const ExportCSV = ({ type }) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const blob = await reportService.downloadReport('csv', type);
            downloadBlob(blob, `${type}_report_${new Date().getTime()}.csv`);
            toast.success('CSV generated successfully');
        } catch (error) {
            toast.error('Failed to generate CSV');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleExport} disabled={loading} className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-100 transition disabled:opacity-50">
            <File size={18} className="mr-2" />
            {loading ? 'Generating...' : 'Export CSV'}
        </button>
    );
};

export default ExportCSV;
