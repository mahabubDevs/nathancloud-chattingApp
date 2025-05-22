import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { EventService } from "./Event.service";
import { fileUploader } from "../../../helpars/fileUploader";

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const userId = req.user.id;
  const body = req.body;

  if (!file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "File is required",
    });
  }

  const uploadResult = await fileUploader.uploadToCloudinary(file);
  const result = await EventService.createEvent(body, uploadResult.Location, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Event created successfully!",
    data: result,
  });
});

const getEvents = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await EventService.getEvents(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events fetched successfully!",
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  await EventService.deleteEvent(eventId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event deleted successfully!",
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  const body = req.body;

  let imageUrl;
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    imageUrl = uploadResult.Location;
  }

  const result = await EventService.updateEvent(eventId, body, imageUrl);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully!",
    data: result,
  });
});

export const EventController = {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent,
};
