import { Link } from "react-router-dom";
import lightPageNotFoundImage from "../imgs/404-light.png";
import darkPageNotFoundImage from "../imgs/404-dark.png";
import lightFullLogo from "../imgs/full-logo-light.png";
import darkFullLogo from "../imgs/full-logo-dark.png";
import { useContext } from "react";
import { ThemeContext } from "../App";

// This component renders a "Page Not Found" error page for any invalid routes.
const PageNotFound = () => {
  let { theme, setTheme } = useContext(ThemeContext);

  return (
    // The main section for the 404 page content.
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      {/* The 404 error image. */}
      <img
        src={theme == "light" ? darkPageNotFoundImage : lightPageNotFoundImage}
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
      />
      {/* The main heading for the page. */}
      <h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>
      {/* A descriptive message with a link to the home page. */}
      <p className="text-dark-grey text-xl leading-7 -mt-8">
        The page you are looking for does not exists. Head back to the{" "}
        <Link to="/" className="text-black underline text-xl">
          Home page
        </Link>
      </p>

      {/* The website logo and a slogan at the bottom of the page. */}
      <div className="mt-auto">
        <img
          src={theme == "light" ? darkFullLogo : lightFullLogo}
          className="h-8 object-contain block mx-auto select-none"
        />
        <p className="mt-5 text-dark-grey">
          Read millions of stories around the world
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;
