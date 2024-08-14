import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../db/index.js"; // Adjust the import path as needed

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      (req.header("Authorization")?.startsWith("Bearer ")
        ? req.header("Authorization").replace("Bearer ", "")
        : null);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user by primary key (ID)
    const user = await UserModel.findByPk(decodedToken?._id, {
      attributes: { exclude: ["password", "refreshToken"] }, // Exclude sensitive fields
    });

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error?.message || "Invalid access token"));
  }
});
