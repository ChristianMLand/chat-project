import User from '../models/user.model.js';
import { handleError } from '../utils/handleError.js';

export const tryLogin = async data => handleError(User.validateLogin(data));
export const create = async data => handleError(User.create(data));
export const getOne = async id => handleError(User.findByPk(id, { include: ["friends", "friendedBy"] }));
export const getByUsername = async username => handleError(User.findOne({ where: { username } }));
export const setOffline = async () => handleError(User.update({ status: "OFFLINE" }));
export const updateStatus = async (status, id) => handleError(User.update({ status }, { where: { id }}));
