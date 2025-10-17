// This component displays a "Load More" button for paginated data.
const LoadMoreDataBtn = ({ state, fetchDataFunc, additionalParam }) => {
  // Check if the state object exists and if there are more documents to load.
  if (state != null && state.totalDocs > state.results.length) {
    return (
      <button
        // Tailwind CSS classes for styling the button.
        className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
        // When clicked, it calls the fetchDataFunc with the next page number.
        onClick={() =>
          fetchDataFunc({ ...additionalParam, page: state.page + 1 })
        }
      >
        Load More
      </button>
    );
  }
  // If there are no more documents to load, the component returns nothing.
};

export default LoadMoreDataBtn;
