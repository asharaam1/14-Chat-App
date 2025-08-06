// // import React from 'react'
// import React, { useState } from "react";
// import axios from "axios";
// import { getDatabase, ref, set } from "firebase/database";
// import { db } from "../firbaseconfig";


// const uploadImage = () => {
//     const [image, setImage] = useState(null);
//     const [imageUrl, setImageUrl] = useState("");
  
//     const handleImageChange = (event) => {
//       setImage(event.target.files[0]);
//     };
  
//     const handleUpload = async () => {
//         const cloudName = 'djzwowoaa';  //your_cloud_name
//         const uploadPreset = 'blogging-app'   //Your_preset
//       const formData = new FormData();
//       formData.append("file", image);
//       formData.append("upload_preset", "your_upload_preset"); // Replace with your preset
  
//       try {
//         const response = await axios.post(
//           `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//           formData
//         );
//         const uploadedImageUrl = response.data.secure_url;
//         setImageUrl(uploadedImageUrl);
  
//         // Store the image URL in Firebase
//         const imageRef = ref(db, "images/" + Date.now());
//         set(imageRef, { url: uploadedImageUrl });
  
//       } catch (error) {
//         console.error("Error uploading image:", error);
//       }
//     };
  
//     return (
//       <div>
//         <input type="file" onChange={handleImageChange} />
//         <button onClick={handleUpload}>Upload Image</button>
//         {imageUrl && <img src={imageUrl} alt="Uploaded" />}
//       </div>
//     );
//   };
  
//   export default uploadImage;
  



import React, { useEffect, useState } from "react";
import { Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';

const CloudinaryUpload = ({ setImageUrl }) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  useEffect(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary script not loaded!");
      return;
    }

    let myWidget = null;

    const initializeWidget = () => {
      myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: "djzwowoaa",
          uploadPreset: "blogging-app",
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            const imageUrl = result.info.secure_url;
            console.log("Uploaded Image URL:", imageUrl);
            setUploadedImageUrl(imageUrl);
            setImageUrl(imageUrl);
            
            // Show success message
            Swal.fire({
              title: "Image Uploaded Successfully!",
              icon: "success",
              timer: 2000,
              showConfirmButton: false
            });
          }
        }
      );
    };

    const handleClick = () => {
      if (myWidget) {
        myWidget.open();
      }
    };

    // Initialize widget
    initializeWidget();

    // Add click event listener
    const uploadButton = document.getElementById("upload_widget");
    if (uploadButton) {
      uploadButton.addEventListener("click", handleClick);
    }

    // Cleanup function
    return () => {
      if (uploadButton) {
        uploadButton.removeEventListener("click", handleClick);
      }
      if (myWidget) {
        myWidget.destroy();
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      <Button
        id="upload_widget"
        variant="outlined"
        fullWidth
        sx={{ mt: 2, mb: 2 }}
      >
        Upload Profile Picture
      </Button>
      {uploadedImageUrl && (
        <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
          ✓ Image uploaded successfully
        </Typography>
      )}
    </>
  );
};

export default CloudinaryUpload;