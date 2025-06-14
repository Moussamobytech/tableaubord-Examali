import { Sequelize } from "sequelize";
import UserModel from "./models/User";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const User = UserModel(sequelize);
sequelize.models.User = User;

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Base de données connectée et synchronisée");
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    throw error;
  }
}

export default sequelize;