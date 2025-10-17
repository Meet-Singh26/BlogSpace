import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import axios from "axios";
import NoDataMessage from "./nodata.component";
import AnimationWrapper from "../common/page-animation";
import CommentCard from "./comment-card.component";

// This function fetches comments for a specific blog post from the server.
export const fetchComments = async ({
  skip = 0, // Used for pagination to skip a certain number of comments.
  blog_id,
  setParentCommentCountFun,
  comment_array = null, // Existing array of comments to append to.
}) => {
  let res;
  await axios
    // Make a POST request to the server to get the comments.
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      // Add a 'childrenLevel' property to each comment for nesting UI.
      data.map((comment) => {
        comment.childrenLevel = 0;
      });

      // Update the count of parent comments that have been loaded.
      setParentCommentCountFun((prev) => prev + data.length);

      // If there's no existing comment array, create a new one.
      if (comment_array == null) {
        res = { results: data };
      } else {
        // Otherwise, append the new comments to the existing array.
        res = { results: [...comment_array, ...data] };
      }
    });

  return res;
};

// This component is a container that displays the comments section.
const CommentsContainer = () => {
  // Access the blog data and state management functions from the BlogContext.
  let {
    blog,
    blog: {
      _id,
      title,
      comments: { results: commentsArr },
      activity: { total_parent_comments },
    },
    commentsWrapper, // State to control the visibility of the comments container.
    setCommentsWrapper,
    totalParentCommentsLoaded,
    setTotalParentCommentsLoaded,
    setBlog,
  } = useContext(BlogContext);

  // This function loads more comments when the "Load More" button is clicked.
  const loadMoreComments = async () => {
    // Fetch the next batch of comments.
    let newCommentsArr = await fetchComments({
      skip: totalParentCommentsLoaded,
      blog_id: _id,
      setParentCommentCountFun: setTotalParentCommentsLoaded,
      comment_array: commentsArr,
    });

    // Update the blog state with the new comments.
    setBlog({ ...blog, comments: newCommentsArr });
  };

  return (
    // The main container for the comments section, its visibility is toggled by 'commentsWrapper'.
    <div
      className={
        "max-sm:w-full fixed " +
        (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[35%] min-w-[382px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
          {title}
        </p>

        {/* This button closes the comments container. */}
        <button
          onClick={() => setCommentsWrapper((prev) => !prev)}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
        >
          <i className="fi fi-br-cross text-2xl mt-1"></i>
        </button>
      </div>

      <hr className="border-grey my-8 w-[120%] -ml-10" />

      {/* This component provides the input field for adding new comments. */}
      <CommentField action="comment" />

      {/* Map through the comments array and render a CommentCard for each one. */}
      {commentsArr && commentsArr.length ? (
        commentsArr.map((comment, i) => {
          return (
            <AnimationWrapper key={i}>
              <CommentCard
                index={i}
                leftVal={comment.childrenLevel * 4}
                commentData={comment}
              />
            </AnimationWrapper>
          );
        })
      ) : (
        // Display a message if there are no comments.
        <NoDataMessage message="No Comments" />
      )}

      {/* Show the "Load More" button if there are more comments to fetch. */}
      {total_parent_comments > totalParentCommentsLoaded ? (
        <button
          onClick={loadMoreComments}
          className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
        >
          Load More
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default CommentsContainer;
