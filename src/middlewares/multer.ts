import multer from 'multer';
import type { FileFilterCallback } from 'multer';
import type { Request } from 'express';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const FileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only .jpeg, .jpg and .png files are allowed!'));
  }
};

export const upload = multer({
  fileFilter: FileFilter,
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 5,
  },
});
