// This file configures the tools for the Editor.js instance.
// Each tool adds a specific functionality, like adding headers, lists, images, etc.

// importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import uploadImage from "../common/uploader";

// This function handles image uploads by providing a URL.
const uploadImageByURL = async (e) => {
  // Create a new promise to resolve with the provided URL.
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  // Return the URL in the format required by Editor.js.
  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

// This function handles image uploads by uploading a file.
const uploadImageByFile = async (file) => {
  try {
    // Use the custom uploadImage utility to upload the file to ImageKit.
    const imageData = await uploadImage(file);

    // Return the image URL in the format required by Editor.js.
    return {
      success: 1,
      file: {
        url: imageData.url,
      },
    };
  } catch (error) {
    // Return an error message if the upload fails.
    return {
      success: 0,
    };
  }
};

// The main configuration object for all the editor tools.
export const tools = {
  // Embed tool for embedding content from services like YouTube, Vimeo, etc.
  embed: Embed,
  // List tool for creating ordered and unordered lists.
  list: {
    class: List,
    inlineToolbar: true, // Allows for inline text formatting within list items.
  },
  // Image tool for uploading and displaying images.
  image: {
    class: Image,
    config: {
      // Configure the uploader with our custom upload functions.
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  // Header tool for creating headings.
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading....",
      levels: [2, 3], // Only allows H2 and H3 headings.
      defaultLevel: 2, // Sets H2 as the default heading level.
    },
  },
  // Quote tool for creating blockquotes.
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  // Marker tool for highlighting text.
  marker: Marker,
  // InlineCode tool for formatting text as inline code.
  inlineCode: InlineCode,
};
