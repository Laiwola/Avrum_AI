import { Router } from "express";
import multer from "multer";
import {
  analyzeCropImage,
  saveDiagnosis,
} from "../services/diagnosis.js";
import { uploadCropImage } from "../services/s3.service.js";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../middleware/auth.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
});


/**
 * Upload crop image to S3
 */
router.post("/diagnosis/upload", requireAuth, upload.single("image"), async (req: AuthenticatedRequest, res, next) => {
  try {
      if (!req.user) {
  return res.status(401).json({ message: "Unauthorized access" });
}
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // const userId = req.user?.id;
    const userId= req.user._id.toString();
    const result = await uploadCropImage(
      req.file,
      userId
    );

    return res.status(201).json({
      success: true,
      data: {
        key: result.key,
        image_url: result.url,
      },
    });
  } catch (error) {
    next(error);
  }
});


/**
 * Analyze crop image
 */
router.post("/diagnosis",requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { crop, image_url, image_key } = req.body;
    //  const userId= "xxxstrtal" 
    if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
    const userId = req.user._id.toString();
    if (!crop || !image_url) {
      return res.status(400).json({
        success: false,
        message: "crop and image_url are required",
      });
    }
    
    // 1. Ask Python AI service to analyze the image
    const diagnosis = await analyzeCropImage(
      crop,
      image_url
    );

    // 2. Save the result in MongoDB
    const savedDiagnosis = await saveDiagnosis(
      diagnosis,
      image_url,
      image_key,
      // req.userId
      userId
    );

    // 3. Return result to frontend
    return res.status(200).json({
      success: true,
      data: savedDiagnosis,
    });
  } catch (error) {
    next(error);
  }
});

export default router;