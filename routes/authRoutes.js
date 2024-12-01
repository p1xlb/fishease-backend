const Joi = require('joi');
const authHandler = require('../handlers/authHandler');

const authRoutes = [
    {
        method: 'POST',
        path: '/register',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required(),
                    name: Joi.string().required().min(2).max(100),
                    phone: Joi.string().pattern(/^\+?[\d\s-]+$/).required()
                })
            },
            handler: authHandler.register
        }
    },
    {
        method: 'POST',
        path: '/login',
        options: {
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                })
            },
            handler: authHandler.login
        }
    },

    {
        method: 'GET',
        path: '/userInfo',
        options: {
            auth: 'jwt',
            handler: authHandler.userInfo
        }
    },

    {
        method: 'POST',
        path: '/update-mail',
        options: {
            auth: 'jwt',
            handler: authHandler.update_mail
        }
    },
    {
        method: 'POST',
        path: '/requestReset',
        options: {
            auth: false,
            handler: authHandler.requestReset,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/resetPassword',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    token: Joi.string().required(),
                    newPassword: Joi.string().min(6).required()
                })
            },
            // plugins: {
            //     rateLimiter: {
            //         max: 5,  // 5 attempts
            //         duration: 15 * 60 * 1000  // per 15 minutes
            //     }
            // },    
            handler: authHandler.resetPassword
        }
    },
    {
        method: 'GET',
        path: '/protected',
        options: {
            handler: authHandler.protected
        }
    }
];

module.exports = authRoutes;
