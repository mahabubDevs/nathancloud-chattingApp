import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { JwtPayload } from "jsonwebtoken";
import { SuperLikeService } from "./SuperLike.service";
import pick from "../../../shared/pick";
import { likeFilterableFields } from "../Like/Like.constant";


const toggleSuperLike = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const result = await SuperLikeService.toggleSuperLike(id, user);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Super like toggled successfully",
    data: result,
  });
});

const getAllMySuperLikeIds = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await SuperLikeService.getAllMySuperLikeIds(user as JwtPayload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Fetched all super liked user IDs successfully",
    data: result,
  });
});

const getAllMySuperLikedUsers = catchAsync(async (req, res) => {
  const user=req.user;
  const filters = pick(req.query, likeFilterableFields
  );
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
  const result = await SuperLikeService.getAllMySuperLikedUsers(user as JwtPayload,filters,options);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "get all my super liked Users successfully",
    data: result,
  });
});

export const superLikeController = {
  toggleSuperLike,
  getAllMySuperLikeIds,
  getAllMySuperLikedUsers
};
