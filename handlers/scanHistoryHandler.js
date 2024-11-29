const pool = require('../config/database');

const scanHistoryHandler = {
    getUserScanHistory: async (request, h) => {
        const { email } = request.auth.credentials;
        
        try {
            // Get user ID from user table with the correct column name
            const [users] = await pool.execute(
                'SELECT user_id FROM user WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return h.response({
                    status: 'error',
                    message: 'User not found'
                }).code(404);
            }

            const userId = users[0].user_id;

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
                'SELECT user_id FROM user WHERE email = ?', 
                [email]
            );

            if (users.length === 0) {
                return h.response({
                    status: 'error',
                    message: 'User not found'
                }).code(404);
            }

            const userId = users[0].user_id;

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
    },

    deleteScanEntry: async (request, h) => {
        const { id_entry } = request.params;
        const { email } = request.auth.credentials;

        let connection;
        try {
            // Start a transaction to ensure data integrity
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // First, verify the user and get their user_id
            const [users] = await connection.execute(
                'SELECT user_id FROM user WHERE email = ?', 
                [email]
            );

            if (users.length === 0) {
                await connection.rollback();
                return h.response({
                    status: 'error',
                    message: 'User not found'
                }).code(404);
            }

            const userId = users[0].user_id;

            // Check if the scan entry belongs to the user
            const [scanCheck] = await connection.execute(
                'SELECT id_entry FROM entry_history WHERE id_entry = ? AND user_id = ?',
                [id_entry, userId]
            );

            if (scanCheck.length === 0) {
                await connection.rollback();
                return h.response({
                    status: 'error',
                    message: 'Scan entry not found or not authorized'
                }).code(404);
            }

            // Delete the scan entry
            const [result] = await connection.execute(
                'DELETE FROM entry_history WHERE id_entry = ? AND user_id = ?',
                [id_entry, userId]
            );

            // Commit the transaction
            await connection.commit();

            // Check if any rows were actually deleted
            if (result.affectedRows === 0) {
                return h.response({
                    status: 'error',
                    message: 'No scan entry was deleted'
                }).code(404);
            }

            return h.response({
                status: 'success',
                message: 'Scan entry deleted successfully',
                deleted_entry_id: id_entry
            }).code(200);

        } catch (error) {
            // Rollback the transaction in case of error
            if (connection) {
                await connection.rollback();
            }

            console.error('Error deleting scan entry:', error);
            return h.response({
                status: 'error',
                message: 'Failed to delete scan entry'
            }).code(500);
        } finally {
            // Release the connection back to the pool
            if (connection) {
                connection.release();
            }
        }
    },

    getDiseaseDetails: async (request, h) => {
        const { disease_name } = request.payload;  // Access the body of the request
    
        if (!disease_name) {
            return h.response({
                status: 'error',
                message: 'Disease name is required'
            }).code(400);
        }
    
        try {
            // Get disease details
            const [diseases] = await pool.execute(
                'SELECT * FROM diseases WHERE disease_name = ?',
                [disease_name]
            );
    
            if (diseases.length === 0) {
                return h.response({
                    status: 'error',
                    message: 'Disease not found'
                }).code(404);
            }
    
            return {
                status: 'success',
                data: diseases[0]
            };
        } catch (error) {
            console.error('Error fetching disease details:', error);
            return h.response({
                status: 'error',
                message: 'Failed to retrieve disease details'
            }).code(500);
        }
    }
    

};

module.exports = scanHistoryHandler;