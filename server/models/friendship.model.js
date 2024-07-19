import { DataTypes, ValidationError, ValidationErrorItem } from "sequelize";
import { sequelize } from "../config/sequelize.config.js";
import { getByUsers } from '../services/friendship.services.js';
import { getByUsername } from '../services/user.services.js';

const Friendship = sequelize.define("Friendship", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED"),
        defaultValue: "PENDING"
    }
}, { timestamps: true });

const InvalidFriendshipError = reason => new ValidationError("", [
    new ValidationErrorItem(
        reason, 
        "validation error", 
        "username"
    )
]);

Friendship.validateRequest = async function(username, userId) {
    const { data: friend, error } = await getByUsername(username);
    if (!friend || error)
        throw InvalidFriendshipError("No matching user found");
    else if (friend.id == userId)
        throw InvalidFriendshipError("You can't friend yourself, sorry!");
    const { data: existingFriendship } = await getByUsers(userId, friend.id);
    if (existingFriendship?.status == "ACCEPTED")
        throw InvalidFriendshipError("You are already friends with this user");
    else if (existingFriendship)
        throw InvalidFriendshipError("There is already a pending request with this user");
    return true;
}

export default Friendship;