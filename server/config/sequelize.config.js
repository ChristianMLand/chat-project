import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_URI,
    logging: false,
    pool: {
        max: 20, // maximum number of db connections at a time
        min: 0,
        acquire: 3000,
        idle: 10000
    }
});

export const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection established successfully");
        // await sequelize.sync({ alter: true, force: true });// add { force: true } if need to drop schemas and re-create
        // console.log("All models were synchronized successfully");
    } catch(error) {
        console.error("Unable to connect:", error);
    }
}

export default { connect, sequelize };