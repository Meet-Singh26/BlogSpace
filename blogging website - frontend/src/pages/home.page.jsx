import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation, {
  activeTabRef,
} from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

// This is the main component for the home page.
const HomePage = () => {
  // State to store the list of blogs.
  const [blogs, setBlogs] = useState(null);
  // State to store the list of trending blogs.
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  // State to manage the current page category (e.g., "home" or a specific tag).
  const [pageState, setPageState] = useState("home");

  // A list of categories for filtering blogs.
  let categories = [
    "programming",
    "hollywood",
    "film making",
    "social media",
    "travel",
    "cooking",
    "ai",
    "temp",
  ];

  // This function fetches the latest blogs from the server.
  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        // Format the paginated data using the utility function.
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page: page,
          countRoute: "/all-latest-blogs-count",
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log("Error fetching latest blogs:", err);
        setBlogs({ results: [], page: 1, totalDocs: 0 });
      });
  };

  // This function fetches the trending blogs from the server.
  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log("Error fetching trending blogs:", err);
        setTrendingBlogs([]);
      });
  };

  // This function handles the filtering of blogs by category.
  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    // If the same category is clicked again, reset to the home page.
    if (pageState === category) {
      setPageState("home");
      return;
    }
    setBlogs(null); // Clear the current blogs before fetching new ones.
    setPageState(category);
  };

  // This function fetches blogs based on the selected category.
  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page: page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState },
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // The main effect hook that fetches data when the pageState changes.
  useEffect(() => {
    activeTabRef.current.click(); // Set the active tab underline.
    if (pageState == "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* The main content area for the latest blogs. */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            {/* Display the list of blogs. */}
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
                <NoDataMessage message={"No blog published"} />
              )}
              <LoadMoreDataBtn
                state={blogs}
                fetchDataFunc={
                  pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory
                }
              />
            </>
            {/* Display the list of trending blogs. */}
            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => (
                <AnimationWrapper
                  transition={{ duration: 1, delay: i * 0.1 }}
                  key={i}
                >
                  <MinimalBlogPost blog={blog} index={i} />
                </AnimationWrapper>
              ))
            ) : (
              <NoDataMessage message={"No trending blogs"} />
            )}
          </InPageNavigation>
        </div>
        {/* The sidebar for categories and trending blogs. */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>
              <div className="flex flex-wrap gap-3">
                {categories.map((category, i) => (
                  <button
                    onClick={loadBlogByCategory}
                    className={`tag ${
                      pageState === category ? "bg-black text-white" : ""
                    }`}
                    key={i}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                ))
              ) : (
                <NoDataMessage message={"No trending blogs"} />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
