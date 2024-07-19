import { create, updateStatus, validate } from '../services/friendship.services.js';
import io from '../config/socketio.config.js';

export const requestFriendship = async (req, res) => {
    const { username } = req.body;
    const userId = req.session.userId;
    const { error } = await validate(username, userId);
    if (error) return res.status(400).json(error);
    const { data: friendship } = await create({ userId, friendId: friend.id });
    
    io.to([`user-${userId}`, `user-${friend.id}`]).socketsJoin(`friendship-${friendship.id}`);
    io.to(`friendship-${friendship.id}`).emit("friendshipRequested");

    return res.json(friendship)
}

export const updateFriendship = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await updateStatus(id, status);

    io.to(`friendship-${id}`).emit("friendshipStatusChange");
    return res.json({ message : "success" });
}