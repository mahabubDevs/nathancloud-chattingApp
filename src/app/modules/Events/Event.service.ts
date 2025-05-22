import prisma from "../../../shared/prisma";
import { CreateEventDto } from "./Event.interface";

export const EventService = { 
  async createEvent(data: CreateEventDto, imageUrl: string, userId: string) {
    return await prisma.event.create({
      data: {
        ...data,
        image: imageUrl,
        userId,
      },
    });
  },

  async getEvents(userId: string) {
    return await prisma.event.findMany({
      where: { userId },
    });
  },

  async deleteEvent(eventId: string, userId: string) {
    return await prisma.event.deleteMany({
      where: {
        id: eventId,
        userId,
      },
    });
  },

  async updateEvent(eventId: string, data: Partial<CreateEventDto>, imageUrl?: string) {
    return await prisma.event.update({
      where: { id: eventId },
      data: {
        ...data,
        ...(imageUrl && { image: imageUrl }),
      },
    });
  },
};
