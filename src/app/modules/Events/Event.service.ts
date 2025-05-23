import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
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

  async getAllEvents() {
    return await prisma.event.findMany({
      where: { visibility: "PUBLIC" },
      // orderBy: { createdAt: "desc" },
    });
  },

  async getPublicEventById(eventId: string) {
    
    return await prisma.event.findMany({
      where: { 
        id: eventId,
        visibility: "PUBLIC" 
      },
      // orderBy: { createdAt: "desc" },
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
