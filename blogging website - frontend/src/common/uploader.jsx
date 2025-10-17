import axios from "axios";

// * A reusable function to upload an image file to ImageKit.

const uploadImage = async (file) => {
  try {
    // 1. Get authentication parameters from your server.
    const { data: authParams } = await axios.get(
      import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url"
    );

    // 2. Create a FormData object to send the file and authentication parameters.
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", `image-${Date.now()}`); // A generic, unique filename.
    formData.append("folder", "/blogging-website");
    // Add all authentication parameters to the FormData.
    Object.keys(authParams).forEach((key) => {
      formData.append(key, authParams[key]);
    });

    // 3. POST the data directly to the ImageKit upload API.
    const response = await axios.post(
      "https://upload.imagekit.io/api/v1/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 4. Return the full response data on success.
    return response.data;
  } catch (error) {
    // Log the error and re-throw it for the calling function to handle.
    console.error("Image upload utility failed:", error);
    throw error;
  }
};

export default uploadImage;
