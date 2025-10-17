import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import CommentField from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

// This component displays a single comment and its replies.
const CommentCard = ({ index, leftVal, commentData }) => {
  // Destructure comment data for easier access.
  let {
    commented_by: {
      personal_info: { profile_img, fullname, username:commented_by_username },
    },
    commentedAt,
    comment,
    _id,
    children,
  } = commentData;

  // Access blog and user data from the context.
  let {
    blog,
    blog: {
      comments: { results: commentsArr },
      activity,
      activity: { total_parent_comments },
      author: {
        personal_info: { username: blog_author },
      },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  let {
    userAuth: { access_token, username },
  } = useContext(UserContext);

  const [isReplying, setReplying] = useState(false);

  // Toggles the visibility of the reply input field.
  const handleReplyClick = () => {
    if (!access_token) {
      return toast.error("Login first to leave a reply");
    }
    setReplying((prev) => !prev);
  };

  // Finds the index of the parent comment in the comments array.
  const getParentIndex = () => {
    let startingPoint = index - 1;
    try {
      while (
        commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel
      ) {
        startingPoint--;
      }
    } catch (error) {
      startingPoint = undefined;
    }
    return startingPoint;
  };

  // Removes nested comment cards from the UI when hiding replies or deleting comments.
  const removeCommentsCards = (startingPoint, isDelete = false) => {
    if (commentsArr[startingPoint]) {
      while (
        commentsArr[startingPoint].childrenLevel > commentData.childrenLevel
      ) {
        commentsArr.splice(startingPoint, 1);
        if (!commentsArr[startingPoint]) {
          break;
        }
      }
    }

    if (isDelete) {
      let parentIndex = getParentIndex();
      if (parentIndex !== undefined) {
        commentsArr[parentIndex].children = commentsArr[
          parentIndex
        ].children.filter((child) => child !== _id);
        if (!commentsArr[parentIndex].children.length) {
          commentsArr[parentIndex].isReplyLoaded = false;
        }
      }
      commentsArr.splice(index, 1);
    }

    if (commentData.childrenLevel === 0 && isDelete) {
      setTotalParentCommentsLoaded((prev) => prev - 1);
    }

    setBlog({
      ...blog,
      comments: { results: commentsArr },
      activity: {
        ...activity,
        total_parent_comments:
          total_parent_comments -
          (commentData.childrenLevel === 0 && isDelete ? 1 : 0),
      },
    });
  };

  // Hides the replies for the current comment.
  const hideReplies = () => {
    commentData.isReplyLoaded = false;
    removeCommentsCards(index + 1);
  };

  // Loads the replies for the current comment from the server.
  const loadReplies = ({ skip = 0, currentIndex = index }) => {
    if (commentsArr[currentIndex].children.length) {
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", {
          _id: commentsArr[currentIndex]._id,
          skip,
        })
        .then(({ data: { replies } }) => {
          commentsArr[currentIndex].isReplyLoaded = true;

          // Find the position to insert new replies (after the last existing reply)
          let insertPosition = currentIndex + 1;

          // Find where the current replies end
          for (let i = currentIndex + 1; i < commentsArr.length; i++) {
            if (
              commentsArr[i].childrenLevel <=
              commentsArr[currentIndex].childrenLevel
            ) {
              break;
            }
            insertPosition = i + 1;
          }

          // Insert new replies at the correct position
          for (let i = 0; i < replies.length; i++) {
            replies[i].childrenLevel =
              commentsArr[currentIndex].childrenLevel + 1;
            commentsArr.splice(insertPosition + i, 0, replies[i]);
          }

          setBlog({
            ...blog,
            comments: { ...blog.comments, results: commentsArr },
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  // Deletes the current comment.
  const deleteComment = (e) => {
    e.target.setAttribute("disable", "true");
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment",
        { _id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(() => {
        e.target.removeAttribute("disable");
        removeCommentsCards(index + 1, true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // This component will render the "Load More Replies" button.
  const LoadMoreRepliesButton = () => {
    let parentIndex = getParentIndex();

    if (parentIndex !== undefined && commentsArr[parentIndex]) {
      // Count how many children are currently loaded
      let loadedReplies = 0;
      let lastReplyIndex = parentIndex;

      for (let i = parentIndex + 1; i < commentsArr.length; i++) {
        if (
          commentsArr[i].childrenLevel <= commentsArr[parentIndex].childrenLevel
        ) {
          break;
        }
        loadedReplies++;
        lastReplyIndex = i;
      }

      // Get total children count from parent
      let totalReplies = commentsArr[parentIndex].children.length;

      // Show button only on the last loaded reply and if there are more replies to load
      if (index === lastReplyIndex && loadedReplies < totalReplies) {
        return (
          <button
            onClick={() =>
              loadReplies({
                skip: loadedReplies,
                currentIndex: parentIndex,
              })
            }
            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
          >
            Load More Replies
          </button>
        );
      }
    }

    return null;
  };

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 6}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{commented_by_username}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>

        <p className="font-gelasio text-xl ml-3">{comment}</p>

        <div className="flex gap-3 items-center mt-5 flex-wrap">
          {commentData.isReplyLoaded ? (
            <button
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
              onClick={hideReplies}
            >
              <i className="fi fi-rs-comment-dots"></i>
              Hide Reply
            </button>
          ) : (
            <button
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
              onClick={loadReplies}
            >
              <i className="fi fi-rs-comment-dots"></i>
              {children.length} {children.length > 1 ? "Replies" : "Reply"}
            </button>
          )}
          <button className="underline" onClick={handleReplyClick}>
            Reply
          </button>

          {username === commented_by_username || username === blog_author ? (
            <button
              className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center"
              onClick={deleteComment}
            >
              <i className="fi fi-rr-trash pointer-events-none"></i>
            </button>
          ) : (
            ""
          )}
        </div>

        {isReplying ? (
          <div className="mt-8">
            <CommentField
              action="reply"
              index={index}
              replyingTo={_id}
              setReplying={setReplying}
            />
          </div>
        ) : (
          ""
        )}
      </div>

      <LoadMoreRepliesButton />
      {/* We will render the "Load More Replies" button here.
      {commentData.isReplyLoaded && <LoadMoreRepliesButton />} */}
    </div>
  );
};

export default CommentCard;
