const Joi = require('joi');
const scanHistoryHandler = require('../handlers/scanHistoryHandler');
const { description, tag } = require('@hapi/joi/lib/base');

const scanHistoryRoutes = [
    {
        method: 'GET',
        path: '/scan-history',
        options: {
            description: 'Get user scan history',
            tags: ['api', 'scan-history'],
            handler: scanHistoryHandler.getUserScanHistory
        }
    },
    {
        method: 'GET',
        path: '/scan-history/{id_entry}',
        options: {
            description: 'Get scan details',
            tags: ['api', 'scan-history'],
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
            description: 'Delete scan entry',
            tags: ['api', 'scan-history'],
            auth: 'jwt',
            handler: scanHistoryHandler.deleteScanEntry
        }
    },
    {
        method: 'POST',
        path: '/disease-info',
        options: {
            description: 'Get disease details for viewDetails',
            tags: ['api', 'disease-info'],
            auth: 'jwt',
            handler: scanHistoryHandler.getDiseaseDetails
        }
    },
];

module.exports = scanHistoryRoutes;