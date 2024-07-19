import Message from "../models/message.model.js";
import { handleError } from "../utils/handleError.js";
import { Op } from 'sequelize';

export const getBatch = async (friendshipId, offset, limit) => handleError(
    Message.findAll({ 
        where: { friendshipId }, 
        limit, 
        offset, 
        order: [["id", "DESC"]],
        include: "sender"
    })
);

export const countUnread = async (friendshipId, userId) => handleError(
    Message.count({
        where : { 
            friendshipId, 
            wasSeen: false,
            [Op.not]: { senderId: userId }
        }
    })
);

export const getOne = async id => handleError(Message.findByPk(id, { include: "sender" }));
export const create = async data => handleError(Message.create(data, { include: "sender" }));
export const update = async (data, id) => handleError(Message.update(data, { where: { id }, include: "sender" }));
