const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { JWT_SECRET, SALT_ROUNDS } = require('../config/constants');

const authHandler = {
    register: async (request, h) => {
        const { email, password } = request.payload;

        try {
            const [existingUsers] = await pool.execute(
                'SELECT * FROM user WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                return h.response({ message: 'Email already registered' }).code(400);
            }

            const password_hashed = await bcrypt.hash(password, SALT_ROUNDS);

            await pool.execute(
                'INSERT INTO user (email, password_hashed) VALUES (?, ?)',
                [email, password_hashed]
            );

            return { message: 'User registered successfully' };
        } catch (error) {
            console.error(error);
            return h.response({ message: 'Internal server error' }).code(500);
        }
    },

    login: async (request, h) => {
        const { email, password } = request.payload;

        try {
            const [rows] = await pool.execute(
                'SELECT * FROM user WHERE email = ?',
                [email]
            );

            const user = rows[0];

            if (!user) {
                return h.response({ message: 'Invalid email or password' }).code(401);
            }

            const isValid = await bcrypt.compare(password, user.password_hashed);

            if (!isValid) {
                return h.response({ message: 'Invalid email or password' }).code(401);
            }

            const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            return { token };
        } catch (error) {
            console.error(error);
            return h.response({ message: 'Internal server error' }).code(500);
        }
    },

    protected: async (request, h) => {
        return { message: 'This is a protected route', user: request.auth.credentials };
    }
};

module.exports = authHandler;
