import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../App";
import axios from "axios";

// This component provides a dedicated comment field for replying within a notification.
const NotificationCommentField = ({
  _id,
  blog_author,
  index,
  replyingTo,
  setReplying,
  notification_id,
  notificationData,
}) => {
  // State to hold the comment text.
  let [comment, setComment] = useState("");
  let { _id: user_id } = blog_author;
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  let {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;

  // This function handles the submission of the reply.
  const handleComment = () => {
    if (!comment.length) {
      return toast.error("Write something to leave a comment...");
    }

    // Send the reply data to the server.
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
        {
          _id,
          blog_author: user_id,
          comment,
          replying_to: replyingTo,
          notification_id,
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(({ data }) => {
        setReplying(false); // Hide the comment field after submission.
        // Update the notification state to show the new reply immediately.
        results[index].reply = { comment, _id: data._id };
        setNotifications({ ...notifications, results });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a reply..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        Reply
      </button>
    </>
  );
};

export default NotificationCommentField;
