import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useContext, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle, handleRedirectResult } from "../common/firebase";

// This component provides the sign-in and sign-up forms.
const UserAuthForm = ({ type }) => {
  const authForm = useRef();
  // State to manage the loading state of the Google authentication button.
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false);

  // Access user authentication data from the context.
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  // This function sends the user's authentication data to the server.
  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        // Store the user data in the session storage.
        storeInSession("user", JSON.stringify(data));
        // Update the user authentication state.
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error || "Authentication failed");
      })
      .finally(() => {
        setIsGoogleAuthLoading(false);
      });
  };

  // This function handles the form submission for both sign-in and sign-up.
  const handleSubmit = (e) => {
    e.preventDefault();
    let serverRoute = type === "sign-in" ? "/signin" : "/signup";
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    let form = new FormData(authForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { fullname, email, password } = formData;

    // Perform form validation.
    if (fullname && fullname.length < 3) {
      return toast.error("Fullname must be atleast 3 letters long");
    }
    if (!email.length) {
      return toast.error("Enter email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is incorrect");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  // This function handles the Google authentication process.
  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    if (isGoogleAuthLoading) return;
    setIsGoogleAuthLoading(true);

    try {
      const result = await authWithGoogle();
      if (result && result.accessToken) {
        userAuthThroughServer("/google-auth", {
          access_token: result.accessToken,
        });
      }
    } catch (error) {
      setIsGoogleAuthLoading(false);
      if (error.code === "auth/popup-closed-by-user") return;
      toast.error("Authentication failed. Please try again.");
      console.error("Google auth error:", error);
    }
  };

  // This effect hook handles the redirect result from Google authentication.
  useEffect(() => {
    const handleRedirectAuthentication = async () => {
      try {
        const result = await handleRedirectResult();
        if (result && result.accessToken) {
          userAuthThroughServer("/google-auth", {
            access_token: result.accessToken,
          });
        }
      } catch (err) {
        toast.error("Failed to complete Google authentication");
        console.log(err);
      }
    };
    handleRedirectAuthentication();
  }, []);

  // If the user is already logged in, redirect them to the home page.
  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form ref={authForm} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome back" : "Join us today"}
          </h1>
          {type !== "sign-in" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />
          <button
            type="submit"
            className="btn-dark center mt-14"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button
            onClick={handleGoogleAuth}
            disabled={isGoogleAuthLoading}
            className={`btn-dark flex items-center justify-center gap-4 w-[90%] center ${
              isGoogleAuthLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img src={googleIcon} className="w-5" />
            {isGoogleAuthLoading ? "Signing in..." : "continue with google"}
          </button>
          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?{" "}
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?{" "}
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
