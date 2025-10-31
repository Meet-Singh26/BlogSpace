**BlogSpace \- A Full-Stack Blogging Platform**

BlogSpace is a modern, full-stack blogging application inspired by platforms like Medium. It provides a clean interface for reading, a rich text editor for writing, and all the essential features for a community-driven blog.

This project is built with a MERN-stack variation (MongoDB, Express, React, Node.js) and includes user authentication via Firebase, image handling with ImageKit, and a modular architecture.

**Features**

\* **Full-Stack Application:** Monorepo structure with a React frontend and a Node.js/Express backend.  
\* **User Authentication:** Secure sign-up, sign-in, and Google authentication using Firebase and JWT.  
\* **Rich Text Editor:** A modern, block-style editor for creating engaging blog posts using Editor.js.  
\* **Blog Management:** Full CRUD (Create, Read, Update, Delete) functionality for blog posts.  
\* **User Dashboard:** A dedicated space for users to manage their blogs and view notifications.  
\* **Image Uploads:** Seamless image uploads for blog banners and content, powered by ImageKit.  
\* **Interactive Features:** Commenting on blogs, liking posts, and user-to-user notifications.  
\* **Dynamic Content:**  
    \* Homepage with latest blogs and filtering by tags.  
    \* Search functionality for blogs and user profiles.  
    \* User profile pages displaying user's blogs and social links.  
\* **User Settings:** Users can edit their profile and change their password.  
\* **Theme Toggle:** Supports both light and dark modes based on user preference.

**Tech Stack**

\#\#\# Frontend  
\* **Framework:** React 18  
\* **Bundler:** Vite  
\* **Routing:** React Router v6  
\* **Styling:** Tailwind CSS  
\* **State Management:** React Context API  
\* **Rich Text Editor:** Editor.js  
\* **Authentication:** Firebase Authentication (Client SDK)  
\* **HTTP Client:** Axios  
\* **Animations:** Framer Motion

\#\#\# Backend  
\* **Framework:** Node.js, Express.js  
\* **Database:** MongoDB (with Mongoose)  
\* **Authentication:** Firebase Admin SDK, JSON Web Token (JWT)  
\* **Image Hosting:** ImageKit SDK  
\* **Middleware:** CORS, Dotenv  
\* **Dev Tools:** Nodemon

**How to Run**

You need to set up both the frontend and backend.

**1\. Backend:**

* Go to the server directory.  
* Run npm install to get all the packages.  
* Create a .env file for your MongoDB, Firebase Admin, and ImageKit API keys.  
* Run npm start to start the server.

**2\. Frontend:**

* Go to the blogging website \- frontend directory.  
* Run npm install to get all the packages.  
* Create a .env file for your Firebase client-side API keys.  
* Run npm run dev to start the website.

