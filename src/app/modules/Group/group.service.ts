import prisma from "../../../shared/prisma";
import { ICreateGroup } from "./group.interface";

export const GroupService = {
  createGroup: async (data: ICreateGroup, userId: string) => {
    const group = await prisma.group.create({
      data: {
        name: data.name,
        visibility: data.visibility,
        createdBy: userId,
        members: {
          create: data.memberIds.map((id) => ({
            userId: id,
            addedBy: userId,
          })),
        },
      },
      include: {
        members: true,
      },
    });
    return group;
  },

  getUserGroups: async (userId: string) => {
    return prisma.group.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: true,
      },
    });
  },
};
