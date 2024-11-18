const Hapi = require('@hapi/hapi');
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const jwtAuthScheme = require('./middleware/auth');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Register authentication scheme and strategy
    server.auth.scheme('jwt-auth', jwtAuthScheme);
    server.auth.strategy('jwt', 'jwt-auth');
    server.auth.default('jwt');

    // Register routes
    server.route([...authRoutes, ...scanRoutes]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();