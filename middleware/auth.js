const jwt = require('jsonwebtoken');
const Hapi = require('@hapi/hapi');
const pool = require('../config/database');
const { JWT_SECRET } = require('../config/constants');

const validate = async (request, token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const [rows] = await pool.execute(
            'SELECT * FROM user WHERE email = ?',
            [decoded.email]
        );

        if (!rows[0]) {
            return { isValid: false };
        }

        return {
            isValid: true,
            credentials: { email: decoded.email }
        };
    } catch (error) {
        return { isValid: false };
    }
};

const jwtAuthScheme = (server, options) => ({
    authenticate: async (request, h) => {
        const token = request.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            throw Hapi.error.unauthorized('Missing authentication token');
        }

        const { isValid, credentials } = await validate(request, token);
        
        if (!isValid) {
            throw Hapi.error.unauthorized('Invalid token');
        }

        return h.authenticated({ credentials });
    }
});

module.exports = jwtAuthScheme;
