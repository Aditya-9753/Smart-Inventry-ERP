import React, { useState } from 'react';
import ReportFilters from '../../components/reports/ReportFilters';
import ExportPDF from '../../components/reports/ExportPDF';
import ExportExcel from '../../components/reports/ExportExcel';
import ExportCSV from '../../components/reports/ExportCSV';

const Reports = () => {
    const [reportType, setReportType] = useState('sales');

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Report Generation</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Generate and export system reports in multiple formats.</p>

            <ReportFilters reportType={reportType} setReportType={setReportType} />

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 text-center">
                    Export "{reportType.charAt(0).toUpperCase() + reportType.slice(1)}" Report
                </h3>
                
                <div className="flex flex-wrap justify-center gap-4">
                    <ExportPDF type={reportType} />
                    <ExportExcel type={reportType} />
                    <ExportCSV type={reportType} />
                </div>
            </div>
        </div>
    );
};

export default Reports;
