import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.config.js";

const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM("ORIGINAL", "EDITED", "DELETED"),
        defaultValue: "ORIGINAL"
    },
    // wasSeen: {
    //     type: DataTypes.BOOLEAN,
    //     defaultValue: false
    // }
}, { timestamps: true });

export default Message;