import { DataTypes, ValidationError, ValidationErrorItem } from "sequelize";
import { compare, hash } from "bcrypt";
import { sequelize } from "../config/sequelize.config.js";
import Friendship from "./friendship.model.js";
import Message from "./message.model.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        validate: {
            len: {
                msg: "Username must be at least 3 characters.",
                args: [3, 45]
            }
        }
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "Email format is invalid."
            },
            len: {
                msg: "Email must be at least 5 characters.",
                args: [5, 45]
            }
        }
    },
    passwordHash: DataTypes.CHAR(60),
    password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
            len: {
                msg: "Password must be at least 8 characters.",
                args: [8, 255]
            }
        }
    },
    confirmPassword: {
        type: DataTypes.VIRTUAL,
        validate: {
            matchesPassword(value) {
                if (value !== this.password) 
                    throw new Error("Confirm password must match Password.");
            }
        }
    },
    status: {
        type: DataTypes.ENUM("ACTIVE", "IDLE", "BUSY", "OFFLINE"),
        defaultValue: "OFFLINE"
    },
    allFriends: {
        type: DataTypes.VIRTUAL,
        get() {
            return (this.friends ?? []).concat(this.friendedBy ?? []);
        }
    }
}, { timestamps: true });

const InvalidCredentialsError = new ValidationError("", [
    new ValidationErrorItem(
        "Invalid Credentials.", 
        "validation error", 
        "password"
    )
]);

User.validateLogin = async function({ email, password }) {
    if (!email || !password) {
        throw InvalidCredentialsError;
    }
    const user = await User.findOne({ where: { email } , include: ["friends", "friendedBy"]});
    if (!(user && await compare(password, user.get("passwordHash")))) {
        throw InvalidCredentialsError;
    }
    return user
}

User.beforeCreate(async user => {
    user.set('passwordHash', await hash(user.get('password'), 10))
});

User.belongsToMany(User, {
    as: 'friends',
    foreignKey: "userId",
    through: Friendship,
});

User.belongsToMany(User, {
    as: "friendedBy",
    foreignKey: "friendId",
    through: Friendship
});

Message.belongsTo(User, {
    as: "sender",
    through: Friendship,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

Message.belongsTo(Friendship, {
    as: "friendship",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

// Friendship.hasOne(User, { as: "friendA", foreignKey: "userId" });
// Friendship.hasOne(User, { as: "friendB", foreignKey: "friendId"})

// Friendship.hasMany(Message, { as: "messages" });

export default User;