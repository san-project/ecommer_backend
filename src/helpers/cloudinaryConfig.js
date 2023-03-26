import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: "dutw6wn8x",
  api_key: "923577376879225",
  api_secret: "gzU-qFE7CWqMrdAFDqlsdpNiTfs",
});

// Upload

export const uploadFiles = async (files) => {
  const listOfImages = [];
  for (const file of files) {
    const url = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "products",
    });
    console.log(`$urls ====> ${url}`);
    listOfImages.push(url.url);
  }
  // await files.map(async (e) => {
  //   const url = await cloudinary.uploader.upload(e.tempFilePath, {
  //     folder: "products",
  //   });
  //   console.log(`$urls ====> ${url}`);
  //   listOfImages.push(url);
  // });
  console.log(`$urlsLIST ====> ${listOfImages}`);
  return listOfImages;
};

// const res = cloudinary.uploader.upload(
//   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }
// );

// res
//   .then((data) => {
//     console.log(data);
//     console.log(data.secure_url);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // Generate
// const url = cloudinary.url("olympic_flag", {
//   width: 100,
//   height: 150,
//   Crop: "fill",
// });

// // The output url
// console.log(url);
// // https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
