import api from '../api/axios';
import { API_URLS } from '../api/endpoints';

export const reportService = {
    downloadReport: async (format, type) => {
        let endpoint = '';
        if (format === 'pdf') endpoint = API_URLS.REPORTS.PDF;
        else if (format === 'excel') endpoint = API_URLS.REPORTS.EXCEL;
        else if (format === 'csv') endpoint = API_URLS.REPORTS.CSV;

        const response = await api.get(endpoint, {
            params: { type },
            responseType: 'blob' // Essential for file downloads
        });
        
        return response.data;
    }
};
