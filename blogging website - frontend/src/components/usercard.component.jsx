import { Link } from "react-router-dom";

// This component displays a user's information in a card format.
const UserCard = ({ user }) => {
  // Destructure the user's personal information from the user object.
  let {
    personal_info: { fullname, username, profile_img },
  } = user;

  return (
    // The entire card is a link to the user's profile page.
    <Link to={`/user/${username}`} className="flex gap-5 items-center mb-5">
      {/* The user's profile image. */}
      <img src={profile_img} className="w-14 h-14 rounded-full" />

      <div>
        {/* The user's full name. */}
        <h1 className="font-medium text-xl line-clamp-2">{fullname}</h1>
        {/* The user's username. */}
        <p className="text-dark-grey">@{username}</p>
      </div>
    </Link>
  );
};

export default UserCard;
