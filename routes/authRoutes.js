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
        method: 'POST',
        path: '/updatemail',
        options: {
            auth: 'jwt',
            handler: authHandler.updatemail
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
