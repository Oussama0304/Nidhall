const app = require('./app');
const http = require('http');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
    console.info('SIGTERM signal reçu. Arrêt gracieux du serveur...');
    server.close(() => {
        console.log('Serveur arrêté');
        process.exit(0);
    });
});

server.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
