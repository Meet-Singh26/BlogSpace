import { Link } from "react-router-dom";
import { getDay } from "../common/date";

/**
 * A card component to display a preview of a blog post.
 */
const BlogPostCard = ({ content, author }) => {
  // Destructure the necessary data from the props.
  let {
    publishedAt,
    tags,
    title,
    des,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { fullname, username, profile_img } = author;

  return (
    // Link to the full blog page when the card is clicked.
    <Link
      className="flex gap-8 items-center border-b pb-4 mb-4 border-grey"
      to={`/blog/${id}`}
    >
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit ">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>

        {/* The description is hidden on smaller screens for a cleaner look. */}
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>

        <div className="flex gap-4 mt-7">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl"></i>
            {total_likes}
          </span>
        </div>
      </div>

      <div className="h-28 aspect-square bg-grey">
        <img
          src={banner}
          className="w-full h-full aspect-square object-cover"
        />
      </div>
    </Link>
  );
};

export default BlogPostCard;
