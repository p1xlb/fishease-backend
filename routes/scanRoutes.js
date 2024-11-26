const Joi = require('joi');
const scanHistoryHandler = require('../handlers/scanHistoryHandler');
const scanHandler = require('../handlers/scanHandler');

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
    },
    {
        method: 'DELETE',
        path: '/scan-history/{id_entry}',
        options: {
            auth: 'jwt',
            handler: scanHistoryHandler.deleteScanEntry
        }
    },
    {
        method: 'POST',
        path: '/uploadEntry',
        options: {
            auth : 'jwt',
            handler: scanHandler.uploadEntry,
            validate: {
                payload: Joi.object({
                    image_url: Joi.string().uri(),
                    scheme: ['http', 'https']

                }).required()
            }
        }
    }
];

module.exports = scanRoutes;