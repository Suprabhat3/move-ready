import express from "express";
import ImageKit from "imagekit";
import { requireAuth } from "../lib/session";
const router = express.Router();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

router.get("/auth", requireAuth, (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    res.status(500).json({ message: "Internal Server Error during ImageKit Auth" });
  }
});

export default router;
