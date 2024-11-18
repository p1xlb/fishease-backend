const pool = require('../config/database');

const scanHistoryHandler = {
    getUserScanHistory: async (request, h) => {
        const { email } = request.auth.credentials;

        try {
            const [scans] = await pool.execute(
                `SELECT 
                    id_entry, 
                    img_url, 
                    disease_name, 
                    confidence_score, 
                    created_at, 
                    request_completed 
                FROM entry_history 
                WHERE email = ? 
                ORDER BY created_at DESC`,
                [email]
            );

            return {
                status: 'success',
                total_scans: scans.length,
                data: scans
            };
        } catch (error) {
            console.error('Error fetching scan history:', error);
            return h.response({ 
                status: 'error',
                message: 'Failed to retrieve scan history' 
            }).code(500);
        }
    },

    getScanDetails: async (request, h) => {
        const { id_entry } = request.params;
        const { email } = request.auth.credentials;

        try {
            const [scans] = await pool.execute(
                `SELECT 
                    id_entry, 
                    img_url, 
                    disease_name, 
                    confidence_score, 
                    created_at, 
                    request_completed 
                FROM entry_history 
                WHERE id_entry = ? AND email = ?`,
                [id_entry, email]
            );

            if (scans.length === 0) {
                return h.response({ 
                    status: 'error',
                    message: 'Scan not found' 
                }).code(404);
            }

            return {
                status: 'success',
                data: scans[0]
            };
        } catch (error) {
            console.error('Error fetching scan details:', error);
            return h.response({ 
                status: 'error',
                message: 'Failed to retrieve scan details' 
            }).code(500);
        }
    }
};

module.exports = scanHistoryHandler;
