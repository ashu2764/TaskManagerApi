import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const userSchema = async (sequelize) => {
  const User = sequelize.define("User", {
    username:{
      type:DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowerCase: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Hook to hash password before saving
  User.addHook("beforeSave", async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  // Method to check if password is correct
  User.prototype.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  // Method to generate access token
  User.prototype.generateAccessToken = function () {
    return jwt.sign(
      {
        _id: this.id, // Use `id` for Sequelize's primary key
        email: this.email,
        username: this.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };

  // Method to generate refresh token
  User.prototype.generateRefreshToken = function () {
    return jwt.sign(
      {
        _id: this.id, // Use `id` for Sequelize's primary key
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };

  return User;
};
