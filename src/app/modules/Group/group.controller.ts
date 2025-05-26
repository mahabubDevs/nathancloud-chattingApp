import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { GroupService } from "./group.service";

export const GroupController = {
  createGroup: catchAsync(async (req: Request, res: Response) => {
    console.log(req.body, "req.body");
    const userId = req.user.id;
    console.log(req.user, "userId");
    const group = await GroupService.createGroup(req.body, userId);
    res.status(201).json({ success: true, data: group });
  }),

  getMyGroups: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const groups = await GroupService.getUserGroups(userId);
    res.status(200).json({ success: true, data: groups });
  }),
};
