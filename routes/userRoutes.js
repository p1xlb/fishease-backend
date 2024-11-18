const Joi = require('joi');
const userHandler = require('../handlers/userHandler');

const userRoutes = [
    {
        method: 'POST',
        path: '/users',
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
            handler: userHandler.createUser
        }
    }
];

module.exports = userRoutes;
