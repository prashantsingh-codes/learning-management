import { Request, Response } from "express";
import { clerkClient } from "../index";

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const userData = req.body;

  if (typeof userId !== "string") {
    res.status(400).json({ message: "Invalid User ID" });
    return;
  }

  try {
    const publicMetadata: Record<string, any> = {};
    if (userData.publicMetadata?.userType !== undefined) {
      publicMetadata.userType = userData.publicMetadata.userType;
    }
    if (userData.publicMetadata?.settings !== undefined) {
      publicMetadata.settings = userData.publicMetadata.settings;
    }

    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata,
    });

    res.json({ message: "User updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};
