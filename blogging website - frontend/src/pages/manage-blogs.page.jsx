import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import {
  ManageDraftBlogPost,
  ManagePublishedBlogCard,
} from "../components/manage-blogcard.component";
import LoadMoreDataBtn from "../components/load-more.component";
import { useSearchParams } from "react-router-dom";

// This component is the dashboard page for users to manage their published and draft blogs.
const ManageBlogs = () => {
  // State for published blogs.
  const [blogs, setBlogs] = useState(null);
  // State for draft blogs.
  const [drafts, setDrafts] = useState(null);
  // State for the search query input.
  const [query, setQuery] = useState("");

  // Get the active tab ("published" or "draft") from the URL query parameters.
  let activeTab = useSearchParams()[0].get("tab");

  // Access the user's authentication token from the context.
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  // This function fetches either published blogs or drafts from the server.
  const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs",
        { page, draft, query, deletedDocCount },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(async ({ data }) => {
        // Format the paginated data using the utility function.
        let formatedData = await filterPaginationData({
          state: draft ? drafts : blogs,
          data: data.blogs,
          page,
          user: access_token,
          countRoute: "/user-written-blogs-count",
          data_to_send: { draft, query },
        });

        // Update the appropriate state based on whether we fetched drafts or published blogs.
        if (draft) {
          setDrafts(formatedData);
        } else {
          setBlogs(formatedData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // This effect hook fetches the initial data for both tabs when the component mounts.
  useEffect(() => {
    if (access_token) {
      // Only fetch if the data hasn't been loaded yet.
      if (blogs == null) {
        getBlogs({ page: 1, draft: false });
      }
      if (drafts == null) {
        getBlogs({ page: 1, draft: true });
      }
    }
  }, [access_token, blogs, drafts, query]);

  // This function handles the search input when the user presses Enter.
  const handleSearch = (e) => {
    let searchQuery = e.target.value;
    setQuery(searchQuery);

    if (e.keyCode == 13 && searchQuery.length) {
      // Reset the blogs and drafts to trigger a new search fetch.
      setBlogs(null);
      setDrafts(null);
    }
  };

  // This function handles clearing the search and resetting the blog lists.
  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  };

  return (
    <>
      <h1 className="max-md:hidden">Manage Blogs</h1>
      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search Blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <i className="fi fi-rr-search absolute right-[10%] md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey md:pointer-events-none"></i>
      </div>

      <InPageNavigation
        routes={["Published Blogs", "Drafts"]}
        defaultActiveIndex={activeTab !== "draft" ? 0 : 1}
      >
        {/* Ternary operator to display published blogs or a loader/message. */}
        {blogs == null ? (
          <Loader />
        ) : blogs.results.length ? (
          <>
            {blogs.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManagePublishedBlogCard
                    blog={{ ...blog, index: i, setStateFunc: setBlogs }}
                  />
                </AnimationWrapper>
              );
            })}
            <LoadMoreDataBtn
              state={blogs}
              fetchDataFunc={getBlogs}
              additionalParam={{
                draft: false,
                deletedDocCount: blogs.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoDataMessage message="No published blogs" />
        )}

        {/* Ternary operator to display draft blogs or a loader/message. */}
        {drafts == null ? (
          <Loader />
        ) : drafts.results.length ? (
          <>
            {drafts.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManageDraftBlogPost
                    blog={{ ...blog, index: i, setStateFunc: setDrafts }}
                  />
                </AnimationWrapper>
              );
            })}
            <LoadMoreDataBtn
              state={drafts}
              fetchDataFunc={getBlogs}
              additionalParam={{
                draft: true,
                deletedDocCount: drafts.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoDataMessage message="No draft blogs" />
        )}
      </InPageNavigation>
    </>
  );
};

export default ManageBlogs;
