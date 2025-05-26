import express from "express";
import { GroupController } from "./group.controller";
import auth  from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), GroupController.createGroup);
router.get("/my", GroupController.getMyGroups);

export const GroupRoutes = router;
