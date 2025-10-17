import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import BlogPostCard from "../components/blog-post.component";
import LoadMoreDataBtn from "../components/load-more.component";
import PageNotFound from "./404.page";

// Defines the initial structure for a user's profile data.
export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: "",
};

// This component displays a user's profile page.
const ProfilePage = () => {
  // Get the user's ID from the URL parameters.
  let { id: profileId } = useParams();

  // State to hold the user's profile data.
  const [profile, setProfile] = useState(profileDataStructure);
  // State to manage the loading indicator.
  const [loading, setLoading] = useState(true);
  // State to hold the list of blogs by the user.
  const [blogs, setBlogs] = useState(null);
  // State to track which profile is currently loaded to avoid unnecessary refetches.
  const [profileLoaded, setProfileLoaded] = useState("");

  // Destructure profile data for easier access.
  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  // Access the logged-in user's data from the context.
  let {
    userAuth: { username },
  } = useContext(UserContext);

  // This function fetches the user's profile data from the server.
  const fetchUserProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        if (user != null) {
          setProfile(user);
          setProfileLoaded(profileId);
          // After fetching the profile, fetch the user's blogs.
          getBlogs({ user_id: user._id });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setProfile(profileDataStructure);
        setLoading(false);
      });
  };

  // This function fetches the blogs written by the user.
  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        // Format the paginated blog data.
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });
        formatedData.user_id = user_id;
        setBlogs(formatedData);
      });
  };

  // This function resets the component's state.
  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("");
  };

  // This effect hook fetches the profile data when the profileId changes.
  useEffect(() => {
    // If navigating to a new profile, reset the blogs state.
    if (profileId != profileLoaded) {
      setBlogs(null);
    }
    // Only fetch data if the blogs state is null (i.e., new profile or initial load).
    if (blogs == null) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile_username.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          {/* The sidebar containing the user's profile information. */}
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:border-l border-grey md:sticky md:top-[100px] md:pl-8 md:py-10">
            <img
              src={profile_img}
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />
            <h1 className="text-2xl font-medium">@{profile_username}</h1>
            <p className="text-xl capitalize h-6">{fullname}</p>
            <p>
              {total_posts.toLocaleString()} Blogs -{" "}
              {total_reads.toLocaleString()} Reads
            </p>
            <div className="flex gap-4 mt-2">
              {/* Show the "Edit Profile" button if the viewer is the owner of the profile. */}
              {profileId == username ? (
                <Link
                  to="/settings/edit-profile"
                  className="btn-light rounded-md"
                >
                  Edit Profile
                </Link>
              ) : (
                ""
              )}
            </div>
            <AboutUser
              className="max-md:hidden"
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>

          {/* The main content area with tabs for blogs and about section. */}
          <div className="max-md:mt-12 w-full">
            <InPageNavigation
              routes={["Blogs Published", "About"]}
              defaultHidden={["About"]}
            >
              {/* The "Blogs Published" tab content. */}
              <>
                {blogs == null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  ))
                ) : (
                  <NoDataMessage message={"No blogs published"} />
                )}
                <LoadMoreDataBtn state={blogs} fetchDataFunc={getBlogs} />
              </>
              {/* The "About" tab content. */}
              <AboutUser
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        // If the profile is not found, display the 404 page.
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
