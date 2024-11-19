const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { JWT_SECRET, SALT_ROUNDS } = require('../config/constants');

dotenv.config();

const authHandler = {
    register: async (request, h) => {
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
    },

    updatemail: async (request, h) => {
        const { newEmail, password } = request.payload;
        const currentEmail = request.auth.credentials.email;  // From JWT token

        try {
            // Don't allow changing to same email
            if (currentEmail === newEmail) {
                return h.response({
                    status: 'error',
                    message: 'New email must be different from current email'
                }).code(400);
            }

            // Check if new email already exists
            const [existingUsers] = await pool.execute(
                'SELECT user_id FROM user WHERE email = ?',
                [newEmail]
            );

            if (existingUsers.length > 0) {
                return h.response({
                    status: 'error',
                    message: 'Email already in use'
                }).code(409);
            }

            // Verify user's password before allowing change
            const [user] = await pool.execute(
                'SELECT password_hashed FROM user WHERE email = ?',
                [currentEmail]
            );

            if (!user[0]) {
                return h.response({
                    status: 'error',
                    message: 'User not found'
                }).code(404);
            }

            const isValid = await bcrypt.compare(password, user[0].password_hashed);

            if (!isValid) {
                return h.response({
                    status: 'error',
                    message: 'Invalid password'
                }).code(401);
            }

            // Update email
            await pool.execute(
                `UPDATE user 
                 SET email = ?, 
                     updated_at = NOW() 
                 WHERE email = ?`,
                [newEmail, currentEmail]
            );

            // Generate new token with updated email
            const token = jwt.sign(
                { email: newEmail },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return {
                status: 'success',
                message: 'Email updated successfully',
                data: {
                    email: newEmail,
                    token: token
                }
            };

        } catch (error) {
            console.error('Error changing email:', error);
            return h.response({
                status: 'error',
                message: 'Internal server error'
            }).code(500);
        }
        },

        requestReset: async (request, h) => {
            const { email } = request.payload;
    
            try {
                // Find user by email
                const [users] = await pool.execute(
                    'SELECT user_id FROM user WHERE email = ?', 
                    [email]
                );
    
                if (users.length === 0) {
                    return h.response({ 
                        status: 'error', 
                        message: 'Email not found' 
                    }).code(404);
                }
    
                const userId = users[0].user_id;
    
                // Generate reset token
                const resetToken = crypto.randomBytes(32).toString('hex');
                const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
    
                // Store reset token in separate password_reset_tokens table
                await pool.execute(
                    `INSERT INTO password_reset_tokens 
                     (user_id, token, expires_at) 
                     VALUES (?, ?, ?)`,
                    [userId, resetToken, expiresAt]
                );
    
                // Send reset email
                const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
                await sendResetEmail(email, resetLink);
    
                return { 
                    status: 'success', 
                    message: 'Password reset link sent' 
                };
            } catch (error) {
                console.error('Password reset request error:', error);
                return h.response({ 
                    status: 'error', 
                    message: 'Internal server error' 
                }).code(500);
            }
        },
    
        resetPassword: async (request, h) => {
            const { token, newPassword } = request.payload;
    
            try {
                // Find valid reset token
                const [tokens] = await pool.execute(
                    `SELECT user_id FROM password_reset_tokens 
                     WHERE token = ? AND expires_at > NOW()`, 
                    [token]
                );
    
                if (tokens.length === 0) {
                    return h.response({ 
                        status: 'error', 
                        message: 'Invalid or expired reset token' 
                    }).code(400);
                }
    
                const userId = tokens[0].user_id;
    
                // Hash new password
                const password_hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
                // Update password
                await pool.execute(
                    `UPDATE user 
                     SET password_hashed = ?, 
                         updated_at = NOW() 
                     WHERE user_id = ?`,
                    [password_hashed, userId]
                );
    
                // Delete used token
                await pool.execute(
                    'DELETE FROM password_reset_tokens WHERE token = ?',
                    [token]
                );
    
                return { 
                    status: 'success', 
                    message: 'Password reset successfully' 
                };
            } catch (error) {
                console.error('Password reset error:', error);
                return h.response({ 
                    status: 'error', 
                    message: 'Internal server error' 
                }).code(500);
            }
        } 
};

async function sendResetEmail(email, resetLink) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.GOOGLE_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>You requested a password reset.</p>
            <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
            <p>This link will expire in 1 hour.</p>
        `
    });
}

module.exports = authHandler;
