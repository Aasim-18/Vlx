import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const uploadImage = async (LocalFilePath: string) => {
  try {
    if (!LocalFilePath) {
      throw new ApiError(400, 'No file provided');
    }

    const result = await cloudinary.uploader.upload(LocalFilePath, {
      resource_type: 'auto',
    });

    //debug
    console.log('Cloudinary upload result:', result.url);

    return result;
  } catch (error) {
    if (fs.existsSync(LocalFilePath)) {
      fs.unlink(LocalFilePath, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });
    }

    console.error('Error uploading image to Cloudinary:', error);
    throw new ApiError(500, 'Error uploading image to Cloudinary');
  }
};

export { uploadImage };
