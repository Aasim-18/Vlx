import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import type { UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { ApiError } from '../utils/ApiError.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const uploadImage = async (
  buffer: Buffer,
  options: UploadApiOptions = {},
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new ApiError(402, 'No Buffer found'));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'vlx/uploads',
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new ApiError(402, 'Cloudinary returned no result'));
        resolve(result);
      },
    );

    stream.end(buffer);
  });
};

export { uploadImage };
