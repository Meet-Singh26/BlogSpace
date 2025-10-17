import axios from "axios";
/**
 * A utility function to handle pagination of data. It can either create a new state object
 * or append new data to an existing state object.
 *
 * @param {object} options - The options for filtering and pagination.
 * @param {boolean} options.create_new_state - If true, a new state object will be created.
 * @param {object} options.state - The current state object.
 * @param {Array} options.data - The new data to be added.
 * @param {number} options.page - The current page number.
 * @param {string} options.countRoute - The API route to get the total count of documents.
 * @param {object} options.data_to_send - Additional data to send with the count request.
 * @returns {Promise<object>} A promise that resolves with the new state object.
 */
export const filterPaginationData = async ({
  create_new_state = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
  user = undefined,
}) => {
  let obj;
  let headers = {};

  if (user) {
    headers.headers = { Authorization: `Bearer ${user}` };
  }

  // If a state object exists and we are not creating a new one,
  // append the new data to the existing results.
  if (state != null && !create_new_state) {
    obj = {
      ...state,
      results: [...state.results, ...data], // Add new data to existing results.
      page: page, // Update the page number.
    };
  } else {
    // Otherwise, create a new state object by fetching the total number of documents.
    await axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + countRoute,
        data_to_send,
        headers
      )
      .then(({ data: { totalDocs } }) => {
        obj = { results: data, page: 1, totalDocs };
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return obj;
};
