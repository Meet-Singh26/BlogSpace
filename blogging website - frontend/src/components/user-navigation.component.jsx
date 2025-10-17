import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

// This component displays the user navigation panel with links to various user-specific pages.
const UserNavigationPanel = () => {
  // Access user data and the function to update it from the UserContext.
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  // This function signs out the user by clearing their session data.
  const signOutUser = () => {
    // Remove the user's data from the session storage.
    removeFromSession("user");
    // Update the user authentication state to null, effectively logging them out.
    setUserAuth({ access_token: null });
  };

  return (
    // Animate the appearance of the navigation panel.
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
        {/* This "Write" link is shown only on smaller screens. */}
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        {/* This link navigates to the user's profile page. */}
        <Link to={`/user/${username}`} className="link pl-8 py-4">
          Profile
        </Link>

        {/* This link navigates to the user's dashboard. */}
        <Link to="/dashboard/blogs" className="link pl-8 py-4">
          Dashboard
        </Link>

        {/* This link navigates to the settings page. */}
        <Link to="/settings/edit-profile" className="link pl-8 py-4">
          Settings
        </Link>

        {/* A separator line to distinguish the sign-out option. */}
        <span className="absolute border-t border-grey w-[100%]"></span>

        {/* The sign-out button. */}
        <button
          onClick={signOutUser}
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
        >
          <h1 className="font-bold text-xl mg-1">Sign Out</h1>
          <p className="text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
