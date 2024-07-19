import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

const io = new Server({ cors: {
    origin: process.env.CLIENT_URI,
    credentials: true
} });

export default io;