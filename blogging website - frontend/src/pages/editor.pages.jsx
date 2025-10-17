import { createContext, useContext, useState, useEffect } from "react";
import { ThemeContext, UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import lightBanner from "../imgs/blog banner light.png";
import darkBanner from "../imgs/blog banner dark.png";
import Loader from "../components/loader.component";
import axios from "axios";

// This defines the initial structure for a new blog post.
const getBlogStructure = (theme) => ({
  title: "",
  banner: theme == "dark" ? darkBanner : lightBanner,
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
});

// Create a context to share the blog's state between the editor and the publish form.
export const EditorContext = createContext({});

// This is the main component for the editor page.
const Editor = () => {
  // Get the blog_id from the URL if we are editing an existing blog.
  let { blog_id } = useParams();

  let { theme } = useContext(ThemeContext);

  // State to hold the blog data.
  const [blog, setBlog] = useState(getBlogStructure(theme));
  // State to manage whether the editor or the publish form is active.
  const [editorState, setEditorState] = useState("editor");
  // State for the Editor.js instance.
  const [textEditor, setTextEditor] = useState({ isReady: false });
  // State to manage the loading indicator.
  const [loading, setLoading] = useState(true);

  // Access the user's authentication token from the UserContext.
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  // This effect fetches the blog data if a blog_id is present in the URL.
  useEffect(() => {
    if (!blog_id) {
      return setLoading(false); // If there's no blog_id, we are creating a new blog.
    }

    // Fetch the blog data from the server.
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
        blog_id,
        draft: true, // Fetch the draft version of the blog.
        mode: "edit", // Specify that we are in edit mode.
      })
      .then(({ data: { blog } }) => {
        setLoading(false);
        setBlog(blog);
      })
      .catch((err) => {
        setBlog(null);
        setLoading(false);
        console.log(err);
      });
  }, []);

  return (
    // Provide the editor context to all child components.
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {/* If the user is not logged in, redirect them to the sign-in page. */}
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : loading ? (
        <Loader />
      ) : // Conditionally render either the editor or the publish form based on the editorState.
      editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
