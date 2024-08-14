import { UserModel } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Sequelize, where } from "sequelize";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await UserModel.findByPk(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validate: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Validate input fields
  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the user with the given email or username already exists

  // Check if the user with the given email or username already exists
  const existedUser = await UserModel.findOne({
    where: {
      [Sequelize.Op.or]: [
        { username: username.toLowerCase() }, // Ensure consistent casing
        { email: email },
      ],
    },
  });

  if (existedUser) {
    throw new ApiError(400, "User is already registered");
  }

  // Create a new user
  const user = await UserModel.create({
    email,
    username: username.toLowerCase(),
    password,
  });

  // Retrieve the created user without the password and refreshToken fields
  const createdUser = await UserModel.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Registered Successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  //Find the user by email or user name

  const whereClause = {};
  if (email) {
    whereClause.email = email;
  }
  if (username) {
    whereClause.username = username.toLowerCase();
  }

  // Find the user by email or username
  const user = await UserModel.findOne({
    where: whereClause,
  });

  if (!user) {
    throw new ApiError(404, "User does not exits");
  }

  //Check if the password is coorect
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credientials");
  }

  //generate access and refresh tokens

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id
  );

  user.refreshToken = refreshToken;

  const loggedInUser = await UserModel.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged in Successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  //invalidate the refresh token by setting it to null in the data base

  await UserModel.update({ refreshToken: null }, { where: { id: userId } });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await UserModel.findByPk(decodedToken?._id); // Find user by primary key (userId)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user.id);

    // Update refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save({ validate: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

export { registerUser, login, logOutUser, refreshAccessToken };
