import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { JwtPayload } from "jsonwebtoken";
import { IUserFilterRequest } from "../User/user.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";

const toggleSuperLike = async (id: string, user: any) => {
  const prismaTransaction = await prisma.$transaction(async (prisma) => {
    // Check if the user exists
    const isUserExist = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if the super-like already exists for the user
    const existingSuperLike = await prisma.superLike.findFirst({
      where: {
        senderId: user.id,
        receiverId: id,
      },
    });
    const existingLike = await prisma.like.findFirst({
      where: {
        senderId: user.id,
        receiverId: id,
      },
    })
    const existingDisLike = await prisma.disLike.findFirst({
      where: {
        senderId: user.id,
        receiverId: id,
      },
    });
    if (existingLike) {
      console.log("delete like")
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    }
    if (existingDisLike) {
      console.log("delete dislike")
      await prisma.disLike.delete({
        where: { id: existingDisLike.id },
      });
    }

    let result;
    if (existingSuperLike) {
      // If the super-like exists, remove it
      const deleteSuperLike = await prisma.superLike.delete({
        where: {
          id: existingSuperLike.id,
        },
      });
      result = {
        message: "Super like removed successfully",
        superLike: deleteSuperLike,
      };
    } else {
      // If the super-like doesn't exist, add it
      const addSuperLike = await prisma.superLike.create({
        data: {
          senderId: user.id,
          receiverId: id,
        },
      });
      result = {
        message: "Super like added successfully",
        addSuperLike,
      };
    }

    return result;
  });

  return prismaTransaction;
};

const getAllMySuperLikeIds = async (user: JwtPayload) => {
  const findUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.superLike.findMany({
    where: {
      senderId: user.id,
    },
    select: {
      receiverId: true,
    },
  });

  return result.map((item) => item.receiverId);
};
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};


const getAllMySuperLikeUsers = async (user: JwtPayload) => {
  // Get the user's location from the database (assuming user location is stored)
  const authUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { lat: true, long: true },
  });

  if (!authUser || authUser.lat == null || authUser.long == null) {
    throw new Error("User's location is not available");
  }

  // Fetch liked users with additional receiver details
  const likedUsers = await prisma.superLike.findMany({
    where: { senderId: user.id },
    include: {
      receiver: {
        select: {
          id: true,
          name: true,
          photos: true,
          email: true,
          lat: true,
          favoritesFood:true,
          interest:true,
          long: true, 
        },
      },
    },
  });

  // Calculate distance for each liked user
  const usersWithDistance = likedUsers.map((like) => {
    if (
      like.receiver.lat != null &&
      like.receiver.long!= null
    ) {
      const distance = calculateDistance(
        Number(authUser.lat),
        Number(authUser.long),
        Number(like.receiver.lat),
        Number(like.receiver.long),
        
        
      );

      return {
        id: like.receiver.id,
        name: like.receiver.name,
        photos: like.receiver.photos,
        favoritesFood: like.receiver.favoritesFood,
        interest: like.receiver.interest,
        email: like.receiver.email,
        distance: distance.toFixed(2), // Distance in kilometers (formatted to 2 decimal places)
      };
    } else {
      return {
        id: like.receiver.id,
        name: like.receiver.name,
        photos: like.receiver.photos,
        favoritesFood: like.receiver.favoritesFood,
        interest: like.receiver.interest,
        email: like.receiver.email,
        distance: null, // Receiver's location is not available
      };
    }
  });

  return usersWithDistance;
};





const getAllMySuperLikedUsers = async (
  user: JwtPayload,
  params: IUserFilterRequest,
  // options: IPaginationOptions
) => {
  // Calculate pagination
  // const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, minAge, maxAge, distanceRange = 40075, ...filterData } = params;

 
  const authUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { lat: true, long: true },
  });

  if (!authUser || authUser.lat == null || authUser.long == null) {
    throw new Error("User's location is not available");
  }

  const maxDistance = Number(distanceRange);

 
  const currentDate = new Date();
  const minDob = maxAge
    ? new Date(currentDate.getFullYear() - maxAge, currentDate.getMonth(), currentDate.getDate())
    : undefined;
  const maxDob = minAge
    ? new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate())
    : undefined;

  
  const andConditions: Prisma.SuperLikeWhereInput[] = [];


  if (searchTerm) {
    andConditions.push({
      receiver: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    });
  }

  // Apply additional filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      receiver: {
        AND: Object.keys(filterData).map((key) => ({
          [key]: {
            equals: (filterData as any)[key],
            mode: "insensitive",
          },
        })),
      },
    });
  }

  // Apply age range filter
  if (minDob || maxDob) {
    andConditions.push({
      receiver: {
        dob: {
          gte: minDob, 
          lte: maxDob, 
        },
      },
    });
  }

  // Final conditions
  const whereConditions: Prisma.SuperLikeWhereInput = {
    senderId: user.id,
    AND: andConditions,
  };

  // Fetch SuperLiked users without pagination
  const superLikedUsers = await prisma.superLike.findMany({
    where: whereConditions,
    include: {
      receiver: {
        select: {
          id: true,
          name: true,
          photos: true,
          gender: true,
          ethnicity: true,
          email: true,
          dob: true,
          lat: true,
          long: true,
          favoritesFood: true,
          interest: true,
        },
      },
    },
  });

  
  const usersWithinDistance = superLikedUsers
    .map((superLike) => {
      if (superLike.receiver.lat != null && superLike.receiver.long != null) {
        const distance = calculateDistance(
          Number(authUser.lat),
          Number(authUser.long),
          Number(superLike.receiver.lat),
          Number(superLike.receiver.long)
        );

        // Include users only within the specified distanceRange
        if (distance <= maxDistance) {
          return {
            id: superLike.receiver.id,
            name: superLike.receiver.name,
            photos: superLike.receiver.photos,
            gender: superLike.receiver.gender,
            dob: superLike.receiver.dob,
            ethnicity: superLike.receiver.ethnicity,
            favoritesFood: superLike.receiver.favoritesFood,
            interest: superLike.receiver.interest,
            email: superLike.receiver.email,
            distance: distance.toFixed(2), 
          };
        }
      }
      return null; 
    })
    .filter((user) => user !== null); 

  
  const paginatedUsers = usersWithinDistance.slice();

  return {
    meta: {
      // page,
      // limit,
      total: usersWithinDistance.length,
    },
    data: paginatedUsers,
  };
};



export const SuperLikeService = {
  toggleSuperLike,
  getAllMySuperLikeIds,
  getAllMySuperLikedUsers
};
