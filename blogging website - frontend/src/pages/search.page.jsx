import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import UserCard from "../components/usercard.component";

// This component displays the search results for blogs and users.
const SearchPage = () => {
  // Get the search query from the URL parameters.
  let { query } = useParams();

  // State to hold the search results for blogs.
  const [blogs, setBlogs] = useState(null);
  // State to hold the search results for users.
  const [users, setUsers] = useState(null);

  // This function fetches blogs that match the search query.
  const searchBlogs = ({ page = 1, create_new_state = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        // Format the paginated data.
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page: page,
          countRoute: "/search-blogs-count",
          data_to_send: { query },
          create_new_state,
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log("Error fetching searched blogs:", err);
        setBlogs({ results: [], page: 1, totalDocs: 0 }); // Set an empty state on error.
      });
  };

  // This function fetches users that match the search query.
  const fetchUsers = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
      .then(({ data: { users } }) => {
        setUsers(users);
      })
      .catch((err) => {
        console.log("Error fetching users:", err);
        setUsers([]); // Set an empty array on error.
      });
  };

  // This function resets the state when a new search is performed.
  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  // This effect hook triggers a new search when the query parameter changes.
  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_state: true });
    fetchUsers();
  }, [query]);

  // This is a wrapper component for rendering the user cards.
  const UserCardWrapper = () => (
    <>
      {users == null ? (
        <Loader />
      ) : users.length ? (
        users.map((user, i) => (
          <AnimationWrapper
            key={i}
            transition={{ duration: 1, delay: i * 0.08 }}
          >
            <UserCard user={user} />
          </AnimationWrapper>
        ))
      ) : (
        <NoDataMessage message="No User Found" />
      )}
    </>
  );

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        {/* In-page navigation to switch between blog and user search results. */}
        <InPageNavigation
          routes={[`Search Results from "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          {/* The content for the blog search results tab. */}
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
              <NoDataMessage message={"No blogs found"} />
            )}
            <LoadMoreDataBtn state={blogs} fetchDataFunc={searchBlogs} />
          </>

          {/* The content for the user search results tab. */}
          <UserCardWrapper />
        </InPageNavigation>
      </div>

      {/* The sidebar that displays users related to the search. */}
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          Users related to search <i className="fi fi-rr-user mt-1"></i>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
