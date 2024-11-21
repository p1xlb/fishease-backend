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
    },
    {
        method: 'DELETE',
        path: '/scan-history/{id_entry}',
        options: {
            auth: 'jwt',
            handler: scanHistoryHandler.deleteScanEntry
        }
    }
];

module.exports = scanRoutes;