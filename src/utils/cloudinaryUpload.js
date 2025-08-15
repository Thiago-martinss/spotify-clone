const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error('Failed to upload to Cloudinary');
  }
};

module.exports = uploadToCloudinary;
