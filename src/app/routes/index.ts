import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { chatRoutes } from "../modules/Chat/chat.routes";
import { DislikeRouter } from "../modules/DisLike/DisLike.routes";
import { notificationsRoute } from "../modules/Notification/Notification.routes";
import { paymentRoutes } from "../modules/Payment/Payment.routes";
import { SuperLikeRouter } from "../modules/SuperLike/SuperLike.routes";
import { userRoutes } from "../modules/User/user.route";
import { likeRouter } from "../modules/Like/Like.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/like",
    route: likeRouter,
  },
  {
    path: "/dislike",
    route: DislikeRouter,
  },
  {
    path: "/superLike",
    route: SuperLikeRouter,
  },
  {
    path: "/chats",
    route: chatRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/notifications",
    route: notificationsRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
