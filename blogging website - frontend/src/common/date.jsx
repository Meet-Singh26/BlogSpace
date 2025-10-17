// Arrays of month and day names for formatting dates.
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Formats a timestamp into a "day month" string (e.g., "1 Jan").
 * @param {string} timestamp - The timestamp to format.
 * @returns {string} The formatted date string.
 */
export const getDay = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

/**
 * Formats a timestamp into a "day month year" string (e.g., "1 Jan 2023").
 * @param {string} timestamp - The timestamp to format.
 * @returns {string} The formatted date string.
 */
export const getFullDay = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
