import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./notification-comment-field.component";
import { UserContext } from "../App";
import axios from "axios";

// This component displays a single notification card.
const NotificationCard = ({ data, index, notificationState }) => {
  // Destructure all necessary data from the notification object.
  let {
    seen,
    type,
    replied_on_comment,
    comment,
    createdAt,
    reply,
    user: {
      personal_info: { profile_img, fullname, username },
    },
    blog: { _id, blog_id, title },
    _id: notification_id,
  } = data;

  // State to manage the visibility of the reply field.
  const [isReplying, setReplying] = useState(false);

  // Access the logged-in user's data from the context.
  let {
    userAuth: {
      username: author_username,
      profile_img: author_profile_img,
      access_token,
    },
  } = useContext(UserContext);

  // Destructure the notification state for easier access.
  let {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;

  // Toggles the visibility of the reply input field.
  const handleReplyClick = () => {
    setReplying((prev) => !prev);
  };

  // This function handles the deletion of a comment or reply directly from the notification.
  const handleDelete = (comment_id, type, target) => {
    target.setAttribute("disabled", true);
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment",
        { _id: comment_id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(() => {
        if (type === "comment") {
          results.splice(index, 1); // Remove the entire notification.
        } else {
          delete results[index].reply; // Just remove the reply part of the notification.
        }
        target.removeAttribute("disabled");
        setNotifications({
          ...notifications,
          results,
          totalDocs: totalDocs - 1,
          deletedDocCount: (notifications.deletedDocCount || 0) + 1,
        });
      })
      .catch((err) => {
        console.log(err);
        target.removeAttribute("disabled");
      });
  };

  return (
    // Add a visual indicator for unseen notifications.
    <div
      className={
        "p-6 border-b border-grey " + (!seen ? "border-l-2 border-l-black" : "")
      }
    >
      <div className="flex gap-5 mb-3">
        <img src={profile_img} className="w-14 h-14 flex-none rounded-full" />
        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey">
            <span className="lg:inline-block hidden capitalize">
              {fullname}
            </span>
            <Link
              to={`/user/${username}`}
              className="mx-1 text-black underline"
            >
              @{username}
            </Link>
            <span className="font-normal">
              {/* Dynamically render the notification message based on its type. */}
              {type == "like"
                ? "liked your blog"
                : type == "comment"
                ? "commented on"
                : "replied on"}
            </span>
          </h1>
          {type == "reply" ? (
            <div className="p-4 mt-4 rounded-md bg-grey">
              <p>{replied_on_comment.comment}</p>
            </div>
          ) : (
            <Link
              to={`/blog/${blog_id}`}
              className="font-medium text-dark-grey hover:underline line-clamp-1"
            >{`"${title}"`}</Link>
          )}
        </div>
      </div>

      {/* Display the comment text if the notification is for a comment or reply. */}
      {type !== "like" && (
        <p className="ml-14 pl-5 font-gelasio text-xl my-5">
          {comment.comment}
        </p>
      )}

      <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
        <p>{getDay(createdAt)}</p>
        {type !== "like" && (
          <>
            {!reply && (
              <button
                className="underline hover:text-black"
                onClick={handleReplyClick}
              >
                Reply
              </button>
            )}
            <button
              className="underline hover:text-black"
              onClick={(e) => handleDelete(comment._id, "comment", e.target)}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Conditionally render the reply field. */}
      {isReplying && (
        <div className="mt-8">
          <NotificationCommentField
            _id={_id}
            blog_author={user}
            index={index}
            replyingTo={comment._id}
            setReplying={setReplying}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      )}

      {/* If a reply has been made, display it. */}
      {reply && (
        <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
          <div className="flex gap-3 mb-3">
            <img src={author_profile_img} className="w-8 h-8 rounded-full" />
            <div>
              <h1 className="font-medium text-xl text-dark-grey">
                <Link
                  to={`/user/${author_username}`}
                  className="mx-1 text-black underline"
                >
                  @{author_username}
                </Link>
                <span className="font-normal">replied to</span>
                <Link
                  to={`/user/${username}`}
                  className="mx-1 text-black underline"
                >
                  @{username}
                </Link>
              </h1>
            </div>
          </div>
          <p className="ml-14 font-gelasio text-xl my-2">{reply.comment}</p>
          <button
            className="underline hover:text-black ml-14 mt-2"
            onClick={(e) => handleDelete(reply._id, "reply", e.target)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
