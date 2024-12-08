const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const authRoutes = require('./routes/authRoutes');
const scanHistoryRoutes = require('./routes/scanHistoryRoutes');
const scanRoutes = require('./routes/scanRoutes')
const jwtAuthScheme = require('./middleware/auth');

dotenv.config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true,
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match']
            },
            payload: {
                maxBytes: 10 * 1024 * 1024,
                multipart: {
                    output: 'file'
                }
            }
        }
    });

      // Swagger configuration
    const swaggerOptions = {
      info: {
        title: 'Fish Disease Prediction API Documentation',
        version: '1.0.0'
      },
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          scheme: 'Bearer',
          bearerFormat: 'JWT',
        }
      },
      security:{
        Bearer: []
      }
    };

    // Register plugins including Swagger
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      }
    ]);

    // Register authentication scheme and strategy
    server.auth.scheme('jwt-auth', jwtAuthScheme);
    server.auth.strategy('jwt', 'jwt-auth');
    server.auth.default('jwt');

    // Register routes
    server.route([...authRoutes,...scanHistoryRoutes , ...scanRoutes]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();