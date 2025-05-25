import cloudinary from "cloudinary";
import _conf from "../config/app.config.js";
import fs from "node:fs";

cloudinary.config({
  cloud_name: _conf.cloud_name,
  api_key: _conf.api_key,
  api_secret: _conf.api_secret,
});

export const uploadImageToCloudinary = async (file) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: "job-tracker/avatars",
      resource_type: "image",
      use_filename: true,
    });

    // if (uploadResult) {
    //   // console.log("uploadResult", uploadResult);
    //   fs.unlinkSync(file); // remove from local
    // }
    return uploadResult.secure_url;
  } catch (error) {
    console.log("uploadImageToCloudinary error", error);
    return null;
  } finally {
    fs.unlinkSync(file);
  }
};

export const deleteImageFromCloudinary = async (original_url) => {
  const url = original_url.split("/");
  const publicId = url[url.length - 1].split(".")[0];
  try {
    if (original_url.includes("job-tracker")) {
      await cloudinary.uploader.destroy("job-tracker/avatars/" + publicId);
      return;
    }
    await cloudinary.uploader.destroy(publicId);
    // console.log(res);
  } catch (error) {
    console.log("deleteImageFromCloudinary error", error);
  }
};
