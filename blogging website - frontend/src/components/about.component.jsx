import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

/**
 * A component that displays information about a user, including their bio, social links, and join date.
 * @param {object} props - The component props.
 * @param {string} props.className - Additional CSS classes for the component.
 * @param {string} props.bio - The user's biography.
 * @param {object} props.social_links - An object containing the user's social media links.
 * @param {string} props.joinedAt - The timestamp of when the user joined.
 * @returns {JSX.Element} The rendered component.
 */
const AboutUser = ({ className, bio, social_links, joinedAt }) => {
  return (
    <div className={`md:w-[90%] md:mt-7 ` + className}>
      <p className="text-xl leading-7">
        {bio.length ? bio : "Nothing to read here"}
      </p>

      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {/* Iterate over the social_links object and render an icon for each link. */}
        {Object.keys(social_links).map((key) => {
          let link = social_links[key];

          return link ? (
            <Link to={link} key={key} target="_blank">
              <i
                className={
                  `text-2xl hover:text-black ` +
                  // Use a different icon for the website link.
                  (key !== "website" ? `fi fi-brands-${key}` : `fi fi-rr-globe`)
                }
              ></i>
            </Link>
          ) : (
            " "
          );
        })}
      </div>

      <p className="text-xl leading-7 text-dark-grey">
        Joined on {getFullDay(joinedAt)}
      </p>
    </div>
  );
};

export default AboutUser;
