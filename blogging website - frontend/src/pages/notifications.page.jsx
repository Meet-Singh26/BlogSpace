import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import NotificationCard from "../components/notification-card.component";
import LoadMoreDataBtn from "../components/load-more.component";

// This component displays the user's notifications page.
const Notifications = () => {
  // Access the user's authentication data and notification status from the context.
  let {
    userAuth,
    userAuth: { access_token, new_notification_available },
    setUserAuth,
  } = useContext(UserContext);

  // State to manage the current filter (e.g., "all", "like").
  const [filter, setFilter] = useState("all");
  // State to hold the list of notifications.
  const [notifications, setNotifications] = useState(null);

  // An array of available filter options.
  let filters = ["all", "like", "comment", "reply"];

  // This function fetches notifications from the server based on the current filter.
  const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/notifications",
        { page, filter, deletedDocCount },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(async ({ data: { notifications: data } }) => {
        // When notifications are fetched, mark them as seen by updating the context.
        if (new_notification_available) {
          setUserAuth({ ...userAuth, new_notification_available: false });
        }

        // Format the paginated data.
        let formatedData = await filterPaginationData({
          state: notifications,
          data,
          page,
          countRoute: "/all-notifications-count",
          data_to_send: { filter },
          user: access_token,
        });

        setNotifications(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // This effect hook fetches notifications when the component mounts or the filter changes.
  useEffect(() => {
    if (access_token) {
      fetchNotifications({ page: 1 });
    }
  }, [access_token, filter]);

  // This function handles the filter button clicks.
  const handleFilter = (e) => {
    let btn = e.target;
    setFilter(btn.innerHTML);
    // Reset notifications to show the loader and trigger a refetch.
    setNotifications(null);
  };

  return (
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>
      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={
                "py-2 " + (filter == filterName ? "btn-dark" : "btn-light")
              }
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>

      {notifications == null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map((notification, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                  <NotificationCard
                    data={notification}
                    index={i}
                    notificationState={{ notifications, setNotifications }}
                  />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoDataMessage message="Nothing available" />
          )}

          <LoadMoreDataBtn
            state={notifications}
            fetchDataFunc={fetchNotifications}
            additionalParam={{ deletedDocCount: notifications.deletedDocCount }}
          />
        </>
      )}
    </div>
  );
};

export default Notifications;
