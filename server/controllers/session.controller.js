import { tryLogin, getOne, updateStatus } from '../services/user.services.js';
import io from "../config/socketio.config.js";

export const handleGetLoggedUser = async (req, res) => {
    const { data, error } = await getOne(req.session.userId);
    if (error) return res.status(404).json(error);
    return res.json(data);
};

export const handleLogin = async (req, res) => {
    const { data, error } = await tryLogin(req.body);
    if (error) return res.status(400).json(error);
    req.session.userId = data.id;
    return res.json({ message: "success" });
}

export const handleLogout = (req, res) => {
    const userId = req.session.userId;
    req.session.destroy(() => {
        io.in(`user-${userId}`).disconnectSockets();
    });
    return res.json({ message: "success" });
}

export const handleConnect = async socket => {
    const userId = socket.request.session.userId;
    const { data:user } = await getOne(userId);
    socket.join(`user-${userId}`);
    user.allFriends.forEach(friend => socket.join(`friendship-${friend.Friendship.id}`));
    await updateStatus("ACTIVE", userId);
    io.to([...socket.rooms]).emit("friendActivityStatusChange");
}

export const handleDisconnect = socket => {
    socket.on('disconnecting', async () => {
        const { rooms, request } = socket;
        await updateStatus("OFFLINE", request.session.userId);
        io.to([...rooms]).emit('friendActivityStatusChange');
    });
}