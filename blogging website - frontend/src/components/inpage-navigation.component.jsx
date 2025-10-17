import { useEffect, useRef, useState } from "react";

// Refs to hold references to the active tab and its underline.
export let activeTabLineRef;
export let activeTabRef;

// This component creates a tab-based navigation within a page.
const InPageNavigation = ({
  routes, // An array of strings representing the navigation routes/tabs.
  defaultHidden = [], // An array of routes to be hidden on certain screen sizes.
  defaultActiveIndex = 0, // The index of the tab that should be active by default.
  children, // The content corresponding to each tab.
}) => {
  // Create refs to manage the active tab's underline and the active tab element itself.
  activeTabLineRef = useRef();
  activeTabRef = useRef();

  // State to keep track of the currently active tab index.
  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  // Used to update the UI based on the current width of page
  let [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
  let [width, setWidth] = useState(window.innerWidth);

  // This function updates the UI to reflect the new active tab.
  const changePageState = (btn, i) => {
    let { offsetWidth, offsetLeft } = btn; // Get the width and position of the clicked button.

    // Move the underline to the position of the active tab.
    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";

    // Update the state to the new active index.
    setInPageNavIndex(i);
  };

  // Set the initial state of the active tab when the component first mounts.
  useEffect(() => {
    if (width > 766 && inPageNavIndex != defaultActiveIndex) {
      changePageState(activeTabRef.current, defaultActiveIndex);
    }

    if (!isResizeEventAdded) {
      window.addEventListener("resize", () => {
        if (!isResizeEventAdded) {
          setIsResizeEventAdded(true);
        }

        setWidth(window.innerWidth);
      });
    }
  }, [width]);

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {/* Map through the routes to create the navigation buttons. */}
        {routes.map((route, i) => {
          return (
            <button
              // Assign the ref to the default active button.
              ref={i == defaultActiveIndex ? activeTabRef : null}
              key={i}
              // Apply different styles for active and inactive tabs.
              className={
                "p-4 px-5 capitalize " +
                (inPageNavIndex == i ? "text-black" : "text-dark-grey") +
                // Hide tabs that are specified in the 'defaultHidden' prop.
                (defaultHidden.includes(route) ? " md:hidden" : "")
              }
              onClick={(e) => {
                // Change the page state when a tab is clicked.
                changePageState(e.target, i);
              }}
            >
              {route}
            </button>
          );
        })}
        {/* This 'hr' element serves as the animated underline for the active tab. */}
        <hr
          ref={activeTabLineRef}
          className="absolute bottom-0 duration-300 border-dark-grey"
        />
      </div>

      {/* Render the content of the active tab. */}
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;
