const pool = require('../config/database');

const scanHistoryHandler = {
    getUserScanHistory: async (request, h) => {
        const { email } = request.auth.credentials;
        
        try {
            // Get user ID from user table with the correct column name
            const [users] = await pool.execute(
                'SELECT user_id FROM user WHERE email = ?',  // Changed 'id' to 'user_id'
                [email]
            );

            if (users.length === 0) {
                return h.response({
                    status: 'error',
                    message: 'User not found'
                }).code(404);
            }

            const userId = users[0].user_id;  // Changed from id to user_id

            // Get scan history using user_id
            const [scans] = await pool.execute(
                `SELECT 
                    id_entry,
                    img_url,
                    disease_name,
                    confidence_score,
                    created_at,
                    request_completed
                FROM entry_history
                WHERE user_id = ?
                ORDER BY created_at DESC`,
                [userId]
            );

            // Format the response data
            const formattedScans = scans.map(scan => ({
                ...scan,
                created_at: scan.created_at ? new Date(scan.created_at).toISOString() : null,
                request_completed: scan.request_completed ? new Date(scan.request_completed).toISOString() : null,
                confidence_score: scan.confidence_score ? parseFloat(scan.confidence_score) : null
            }));

            return {
                status: 'success',
                total_scans: scans.length,
                data: formattedScans
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
            // Get user ID from user table with the correct column name
            const [users] = await pool.execute(
                'SELECT user_id FROM user WHERE email = ?',  // Changed 'id' to 'user_id'
                [email]
            );

            if (users.length === 0) {
                return h.response({
                    status: 'error',
                    message: 'User not found'
                }).code(404);
            }

            const userId = users[0].user_id;  // Changed from id to user_id

            // Get scan details
            const [scans] = await pool.execute(
                `SELECT 
                    id_entry,
                    img_url,
                    disease_name,
                    confidence_score,
                    created_at,
                    request_completed
                FROM entry_history
                WHERE id_entry = ? AND user_id = ?`,
                [id_entry, userId]
            );

            if (scans.length === 0) {
                return h.response({
                    status: 'error',
                    message: 'Scan not found'
                }).code(404);
            }

            // Format the single scan data
            const formattedScan = {
                ...scans[0],
                created_at: scans[0].created_at ? new Date(scans[0].created_at).toISOString() : null,
                request_completed: scans[0].request_completed ? new Date(scans[0].request_completed).toISOString() : null,
                confidence_score: scans[0].confidence_score ? parseFloat(scans[0].confidence_score) : null
            };

            return {
                status: 'success',
                data: formattedScan
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