import { create, update, getOne, getBatch } from "../services/message.services.js";
import io from "../config/socketio.config.js";

export const handleGetMessages = async (req, res) => {
    const { friendshipId, offset, limit } = req.query;
    const { data:batch, error } = await getBatch(friendshipId, offset, limit);
    if (error) return res.status(400).json(error);
    return res.json(batch);
}

export const handleCreateMessage = async (req, res) => {
    const { content, senderId, friendshipId } = req.body;
    const { data } = await create({ content, senderId, friendshipId, status: "ORIGINAL" });
    const { data:message } = await getOne(data.id); 
    if (data) io.to(`friendship-${friendshipId}`).emit('messageCreated', message);
    return res.json(message);
}

export const handleUpdateMessage = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const { data } = await update({ content, status: "EDITED" }, id);
    const { data:message } = await getOne(id);
    if (data) io.in(`friendship-${message.friendshipId}`).emit("messageUpdated", message);
    return res.json(message);
}

export const handleDeleteMessage = async (req, res) => {
    const { id } = req.params;
    const { data } = await update({ status: "DELETED"}, id);
    const { data:message } = await getOne(id); 
    if (data) io.in(`friendship-${message.friendshipId}`).emit("messageUpdated", message);
    return res.json(message);
}