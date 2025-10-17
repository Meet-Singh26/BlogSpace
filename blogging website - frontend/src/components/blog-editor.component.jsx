import { Link, useNavigate, useParams } from "react-router-dom";
import lightLogo from "../imgs/logo-light.png";
import darkLogo from "../imgs/logo-dark.png";
import lightBanner from "../imgs/blog banner light.png";
import darkBanner from "../imgs/blog banner dark.png";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import uploadImage from "../common/uploader";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { ThemeContext, UserContext } from "../App";

// This component provides a rich text editor for creating and editing blog posts.
const BlogEditor = () => {
  // Access blog data and editor state from the context.
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    setEditorState,
    textEditor,
    setTextEditor,
  } = useContext(EditorContext);

  // Access the user's authentication token from the context.
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let { theme } = useContext(ThemeContext);

  let { blog_id } = useParams(); // Get the blog ID from the URL if editing an existing post.
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  // Initialize the Editor.js instance when the component mounts.
  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holderId: "textEditor",
          data: Array.isArray(content) ? content[0] : content, // Load existing content if available.
          tools: tools,
          placeholder: "Let's write an awesome story",
        })
      );
    }
  }, []);

  const handleError = (e) => {
    let img = e.target;
    // If an error occurs, fall back to the correct default banner based on the current theme.
    img.src = theme === "light" ? lightBanner : darkBanner;
  };

  // Handles the upload of the blog banner image.
  const handleBannerUpload = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    // Validate file type and size before uploading.
    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload a valid image file");
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image size should be less than 5MB");
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      setBlog({ ...blog, banner: result.url }); // Update the banner URL in the state.
      toast.success("Banner uploaded successfully!");
    } catch (error) {
      console.log("Upload failed: ", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Prevents the default behavior of the Enter key in the title textarea.
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  // Updates the blog title and adjusts the textarea height dynamically.
  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  // Validates the blog data and transitions to the publish form.
  const handlePublishEvent = () => {
    if (!banner || banner === lightBanner || banner === darkBanner) {
      return toast.error("Upload a blog banner to publish it");
    }
    if (!title.length) {
      return toast.error("Write blog title to publish it");
    }

    // Save the content from the editor and update the state.
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("Write something in your blog to publish it");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Saves the current blog post as a draft.
  const handleSaveDraft = (e) => {
    if (e.target.classList.contains("disable")) return;

    if (!title.length) {
      return toast.error("Title is missing");
    }

    let loadingToast = toast.loading("Saving Draft....");
    e.target.classList.add("disable");

    // Save the editor content and send the data to the server.
    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          des,
          banner,
          content,
          tags,
          draft: true,
        };

        axios
          .post(
            import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
            { ...blogObj, id: blog_id },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then(() => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            toast.success("Draft Saved Successfully");
            setTimeout(() => {
              navigate("/dashboard/blogs?tab=draft");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            return toast.error(response.data.error);
          });
      });
    }
  };

  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={theme == "light" ? darkLogo : lightLogo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
              <label htmlFor="uploadBanner" className="cursor-pointer">
                <img
                  src={
                    banner
                      ? banner
                      : theme === "light"
                      ? lightBanner
                      : darkBanner
                  }
                  className="z-20 w-full h-full object-cover"
                  onError={handleError}
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white">Uploading...</div>
                  </div>
                )}
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  id="uploadBanner"
                  disabled={isUploading}
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <div className="mt-2 text-sm text-gray-400 opacity-50 text-right">
              <p>Recommended: 1200x600 px • Max 5MB • PNG, JPG, JPEG</p>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
