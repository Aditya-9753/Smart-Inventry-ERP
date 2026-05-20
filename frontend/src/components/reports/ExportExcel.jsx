import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { reportService } from '../../services/reportService';
import { downloadBlob } from '../../utils/exportHelpers';
import toast from 'react-hot-toast';

const ExportExcel = ({ type }) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const blob = await reportService.downloadReport('excel', type);
            downloadBlob(blob, `${type}_report_${new Date().getTime()}.xlsx`);
            toast.success('Excel generated successfully');
        } catch (error) {
            toast.error('Failed to generate Excel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleExport} disabled={loading} className="flex items-center px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition disabled:opacity-50">
            <FileText size={18} className="mr-2" />
            {loading ? 'Generating...' : 'Export Excel'}
        </button>
    );
};

export default ExportExcel;
