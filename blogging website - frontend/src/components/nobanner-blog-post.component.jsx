import { Link } from "react-router-dom";
import { getDay } from "../common/date";

// This component displays a minimal version of a blog post, typically used in trending sections.
const MinimalBlogPost = ({ blog, index }) => {
  // Destructure the necessary data from the blog object.
  let {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;

  return (
    // The entire component is a link to the full blog post.
    <Link to={`/blog/${id}`} className="flex gap-5 mb-8">
      {/* Display the index of the blog post in the list. */}
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

      <div>
        <div className="flex gap-2 items-center mb-7">
          {/* The author's profile image. */}
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          {/* The author's full name and username. */}
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          {/* The publication date of the blog post. */}
          <p className="min-w-fit ">{getDay(publishedAt)}</p>
        </div>

        {/* The title of the blog post. */}
        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
