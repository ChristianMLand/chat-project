import { create } from "../services/user.services.js";

export const handleCreateUser = async (req, res) => {
    const { data, error } = await create(req.body);
    if (error) return res.status(400).json(error);
    req.session.userId = data.id;
    return res.json(data);
}