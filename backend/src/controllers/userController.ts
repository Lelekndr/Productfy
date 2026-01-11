import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export async function syncUser(req: Request, res: Response) {
  try {
    const { userId, sessionClaims } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const email = sessionClaims?.email as string;
    const name = sessionClaims?.name as string;
    const imageUrl = sessionClaims?.imageUrl as string;

    if (!email || !name || !imageUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await queries.upsertUser({
      id: userId,
      email,
      name,
      imageUrl,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
