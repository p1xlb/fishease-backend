const bcrypt = require('bcrypt');
const pool = require('../config/database');
const { SALT_ROUNDS } = require('../config/constants');

const userHandler = {
    createUser: async (request, h) => {
        const { email, password, name, phone } = request.payload;

        try {
            // Check if user already exists
            const [existingUsers] = await pool.execute(
                'SELECT * FROM user WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                return h.response({ 
                    status: 'error',
                    message: 'Email already registered' 
                }).code(400);
            }

            // Hash password
            const password_hashed = await bcrypt.hash(password, SALT_ROUNDS);

            // Insert new user with current timestamp
            const [result] = await pool.execute(
                `INSERT INTO user (email, password_hashed, name, phone, created_at) 
                 VALUES (?, ?, ?, ?, NOW())`,
                [email, password_hashed, name, phone]
            );

            return {
                status: 'success',
                message: 'User created successfully',
                data: {
                    id: result.insertId,
                    email,
                    name,
                    phone,
                    created_at: new Date()
                }
            };
        } catch (error) {
            console.error('Error creating user:', error);
            return h.response({ 
                status: 'error',
                message: 'Internal server error' 
            }).code(500);
        }
    }
};

module.exports = userHandler;
