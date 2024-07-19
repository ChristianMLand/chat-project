import dotenv from 'dotenv';
dotenv.config();

import session from 'express-session';
import express from 'express';
import cors from 'cors';

import sessionRoutes from './routes/session.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import friendshipRoutes from './routes/friendship.routes.js';

import { handleConnect, handleDisconnect } from './controllers/session.controller.js';

import { setOffline } from './services/user.services.js';
import io from './config/socketio.config.js';
import db from './config/sequelize.config.js';

const PORT = process.env.PORT;
const app = express();

db.connect();

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    name: "SessionCookie",
    secret: process.env.SECRET_KEY,
    cookie: { secure: process.env.MODE === "production" },
});

app.use(
    cors({ credentials: true, origin: process.env.CLIENT_URI }),
    express.urlencoded({ extended: true }),
    express.json(),
    sessionMiddleware
);

app.use('/api/session', sessionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use("/api/friendships", friendshipRoutes);

await setOffline();

const server = app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

io.attach(server);
io.engine.use(sessionMiddleware);

io.on("connection", socket => {
    handleConnect(socket);
    handleDisconnect(socket);
});