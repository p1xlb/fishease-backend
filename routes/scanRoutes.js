const Joi = require('joi');
const scanHistoryHandler = require('../handlers/scanHistoryHandler');

const scanRoutes = [
    {
        method: 'GET',
        path: '/scan-history',
        options: {
            handler: scanHistoryHandler.getUserScanHistory
        }
    },
    {
        method: 'GET',
        path: '/scan-history/{id_entry}',
        options: {
            validate: {
                params: Joi.object({
                    id_entry: Joi.string().required()
                })
            },
            handler: scanHistoryHandler.getScanDetails
        }
    }
];

module.exports = scanRoutes;