import Friendship from '../models/friendship.model.js';
import { handleError } from '../utils/handleError.js';
import { Op } from 'sequelize';

export const create = async data => handleError(Friendship.create(data));
export const getByUsers = async (userId, friendId) => handleError(
    Friendship.findOne({ 
        where: { 
            [Op.or]: [{ userId, friendId },{ userId:friendId, friendId:userId }] 
        }
    })
);

export const validate = async (username, userId) => handleError(Friendship.validateRequest(username, userId));

export const getOne = async id => handleError(Friendship.findByPk(id));
export const updateStatus = async (id, status) => handleError(Friendship.update({ status }, { where: { id } }));

