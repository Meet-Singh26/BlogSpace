import axios from "axios";
import { useState, useEffect, createContext } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, {
  fetchComments,
} from "../components/comments.component";

// Defines the initial structure for a blog post to prevent errors before data is loaded.
export const blogStructure = {
  title: "",
  des: "",
  content: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

// Create a context to share blog-related state between components.
export const BlogContext = createContext({});

// This page component displays a single, full blog post.
const BlogPage = () => {
  // Get the blog_id from the URL parameters.
  let { blog_id } = useParams();

  // State to hold the blog data.
  const [blog, setBlog] = useState(blogStructure);
  // State for similar blogs fetched based on tags.
  const [similarBlogs, setSimilarBlogs] = useState(null);
  // State to manage the loading indicator.
  const [loading, setLoading] = useState(true);
  // State to track if the current user has liked the blog.
  const [isLikedByUser, setLikedByUser] = useState(false);
  // State to manage the visibility of the comments section.
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  // State to keep track of the number of parent comments loaded.
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  // Destructure blog data for easier access in the JSX.
  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  // This function fetches the main blog post data from the server.
  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
      .then(async ({ data: { blog } }) => {
        // Fetch the comments associated with the blog.
        blog.comments = await fetchComments({
          blog_id: blog._id,
          setParentCommentCountFun: setTotalParentCommentsLoaded,
        });
        setBlog(blog);

        // After fetching the main blog, fetch similar blogs based on the first tag.
        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            tag: blog.tags[0],
            limit: 6,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlogs(data.blogs);
          });
        setLoading(false); // Set loading to false once all data is fetched.
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // This function resets all state variables, useful when navigating between different blog pages.
  const resetStates = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  };

  // The main effect hook that triggers fetching the blog data when the blog_id changes.
  useEffect(() => {
    if (!blog_id) {
      return; // Do nothing if blog_id is not yet available
    }
    resetStates(); // Reset states before fetching new data.
    fetchBlog();
  }, [blog_id]);

  return (
    <AnimationWrapper>
      {/* Keep showing the loader if loading is true 
    OR if blog.content is still the empty initial array.
  */}
      {loading || !blog.content.length ? (
        <Loader />
      ) : (
        // Provide the blog context to all child components.
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            isLikedByUser,
            setLikedByUser,
            commentsWrapper,
            setCommentsWrapper,
            totalParentCommentsLoaded,
            setTotalParentCommentsLoaded,
          }}
        >
          {/* The comments section, which is a sliding panel. */}
          <CommentsContainer />

          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img src={banner} className="aspect-video" />

            <div className="mt-12">
              <h2>{title}</h2>
              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} className="w-12 h-12 rounded-full" />
                  <p className="capitalize">
                    {fullname}
                    <br />@
                    <Link to={`/user/${author_username}`} className="underline">
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}
                </p>
              </div>
            </div>

            {/* Component for like, comment, and share buttons. */}
            <BlogInteraction />

            {/* Render the actual blog content using the BlogContent component. */}
            <div className="my-12 font-gelasio blog-page-content">
              {content[0].blocks.map((block, i) => (
                <div key={i} className="my-4 md:my-8">
                  <BlogContent block={block} />
                </div>
              ))}
            </div>

            <BlogInteraction />

            {/* Display similar blogs if they have been fetched. */}
            {similarBlogs != null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Blogs
                </h1>
                {similarBlogs.map((blog, i) => {
                  let {
                    author: { personal_info },
                  } = blog;
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogPostCard content={blog} author={personal_info} />
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
