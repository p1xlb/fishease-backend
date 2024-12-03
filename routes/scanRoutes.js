const { parse } = require("dotenv"); //?
const scanHandler = require("../handlers/scanHandler");
const { options } = require("joi");
const { description } = require("@hapi/joi/lib/base");

const scanRoutes = [
    {
        method: 'GET',
        path: '/service/classes',
        handler: scanHandler.getClasses,
        options: {
            description: 'Get disease classes from model API',
            tags: ['api', 'classes']
        }
      },
      {
        method: 'POST',
        path: '/service/predict',
        options: {
          description: 'Predict disease from uploaded image',
          tags: ['api', 'predict'],
          auth: 'jwt',
            payload: {
              output: 'file',
              allow: 'multipart/form-data',
              parse: true
            }
        },
        handler: scanHandler.predictDisease
      }
]

module.exports = scanRoutes;