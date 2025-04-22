import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { superLikeController } from "./SuperLike.controller";


const router = Router();

router.post(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  superLikeController.toggleSuperLike
);

router.get(
  "/my-super-likes",
  auth(UserRole.ADMIN, UserRole.USER),
  superLikeController.getAllMySuperLikeIds
);
router.get(
  "/my-super-likes-users",
  auth(UserRole.ADMIN, UserRole.USER),
  superLikeController.getAllMySuperLikedUsers,
);

export const SuperLikeRouter = router;
