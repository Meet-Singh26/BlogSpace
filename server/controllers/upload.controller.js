import imagekit from "../config/imagekit.js";

// Generates authentication parameters for ImageKit uploads
export const getUploadUrl = (req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    // The public key is required for client-side uploads, so we add it here
    authenticationParameters.publicKey = imagekit.options.publicKey;
    res.status(200).json(authenticationParameters);
  } catch (error) {
    console.error("Error generating authentication parameters:", error);
    res
      .status(500)
      .json({ error: "Failed to generate authentication parameters" });
  }
};
