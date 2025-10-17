import ImageKit from "imagekit";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory name of the current module.
// This is a common pattern in ES modules to get the equivalent of __dirname.
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure dotenv to load environment variables from the .env file.
dotenv.config({ path: join(__dirname, "../.env") });

// Add debug logging to check if environment variables are loaded correctly.
// This is helpful for debugging issues with environment variables.
console.log("ImageKit Environment Check:", {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? "Present" : "Missing",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? "Present" : "Missing",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ? "Present" : "Missing",
  publicKeyLength: process.env.IMAGEKIT_PUBLIC_KEY?.length || 0,
  privateKeyLength: process.env.IMAGEKIT_PRIVATE_KEY?.length || 0,
});

// Validate that all required environment variables are present.
// If any of them are missing, throw an error to prevent the app from running with invalid configuration.
if (
  !process.env.IMAGEKIT_PUBLIC_KEY ||
  !process.env.IMAGEKIT_PRIVATE_KEY ||
  !process.env.IMAGEKIT_URL_ENDPOINT
) {
  throw new Error("Missing required ImageKit environment variables");
}

// Initialize the ImageKit SDK with the credentials from the environment variables.
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Test the ImageKit connection on startup to ensure that the credentials are correct
// and the service is accessible. This helps to catch configuration errors early.
imagekit
  .listFiles({
    limit: 1,
  })
  .then(() => {
    console.log("✅ ImageKit connection successful");
  })
  .catch((error) => {
    console.error("❌ ImageKit connection failed:", error.message);
  });

export default imagekit;
