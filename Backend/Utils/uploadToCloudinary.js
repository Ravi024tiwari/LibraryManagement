import cloudinary from "../Config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder = "library-books") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(fileBuffer);
  });
};

export default uploadToCloudinary;
