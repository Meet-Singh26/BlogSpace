import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../App";
import axios from "axios";

// This component provides a form for users to change their password.
const ChangePassword = () => {
  // Access the user's authentication token from the context.
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  // A ref to access the form data directly.
  let changePasswordForm = useRef();

  // A regular expression for validating password strength.
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  // This function handles the form submission.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the form data.
    let form = new FormData(changePasswordForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { currentPassword, newPassword } = formData;

    // Validate the input fields.
    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Fill all the inputs");
    }
    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
      );
    }

    // Disable the button to prevent multiple submissions.
    e.target.setAttribute("disabled", true);
    let loadingToast = toast.loading("Updating....");

    // Send the password change request to the server.
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then(() => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        // Reset the form fields after successful password change.
        changePasswordForm.current.reset();
        return toast.success("Password changed successfully");
      })
      .catch(({ response }) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        return toast.error(response.data.error);
      });
  };

  return (
    <AnimationWrapper>
      <Toaster />
      <form ref={changePasswordForm}>
        <h1 className="max-md:hidden">Change Password</h1>
        <div className="w-full py-10 md:max-w-[400px]">
          <InputBox
            className="profile-edit-input"
            name="currentPassword"
            type="password"
            placeholder="Current Password"
            icon="fi-rr-unlock"
          />
          <InputBox
            className="profile-edit-input"
            name="newPassword"
            type="password"
            placeholder="New Password"
            icon="fi-rr-lock"
          />
          <button
            className="btn-dark px-10"
            type="submit"
            onClick={handleSubmit}
          >
            Change Password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;
