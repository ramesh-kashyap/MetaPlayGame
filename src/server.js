import express from 'express';
import configViewEngine from './config/configEngine';
import routes from './routes/web';
import cronJobContronler from './controllers/cronJobContronler';
import socketIoController from './controllers/socketIoController';
const xssMiddleware = require('./controllers/xssMiddleware');

require('dotenv').config();
const xss = require('xss');
let cookieParser = require('cookie-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;
app.use(xssMiddleware);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup viewEngine
configViewEngine(app);
// init Web Routes
routes.initWebRouter(app);

// Cron job game 1 minute
cronJobContronler.cronJobGame1p(io);

// Check who connects to the server
socketIoController.sendMessageAdmin(io);

// Listen for connections
server.listen(port, () => {
    console.log("Connected success port: " + port);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        // You can choose to use a different port or handle the error as needed
    } else {
        console.error(err);
    }
});
