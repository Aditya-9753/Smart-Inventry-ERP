import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { reportService } from '../../services/reportService';
import { downloadBlob } from '../../utils/exportHelpers';
import toast from 'react-hot-toast';

const ExportPDF = ({ type }) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const blob = await reportService.downloadReport('pdf', type);
            downloadBlob(blob, `${type}_report_${new Date().getTime()}.pdf`);
            toast.success('PDF generated successfully');
        } catch (error) {
            toast.error('Failed to generate PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleExport} disabled={loading} className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition disabled:opacity-50">
            <FileText size={18} className="mr-2" />
            {loading ? 'Generating...' : 'Export PDF'}
        </button>
    );
};

export default ExportPDF;
