import bcrypt from "bcrypt";
import User from "../models/User.js";
import { formatDatatoSend, generateUsername } from "../utils/helpers.js";
import { emailRegex, passwordRegex } from "../utils/validators.js";
import { getAuth } from "firebase-admin/auth";

// Registers a new user with email and password
export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  // Validation
  if (fullname.length < 3) {
    return res.status(403).json({
      error: "Fullname must be at least 3 letters long",
    });
  }

  if (!email.length) {
    return res.status(403).json({ error: "Enter email" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is incorrect" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
    });
  }

  try {
    const hashed_password = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

    const user = new User({
      personal_info: { fullname, email, password: hashed_password, username },
    });

    const savedUser = await user.save();
    return res.status(200).json(formatDatatoSend(savedUser));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(500).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: err.message });
  }
};

// Authenticates user with email and password
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ "personal_info.email": email });

    if (!user) {
      return res.status(403).json({ error: "Email not found" });
    }

    if (user.google_auth) {
      return res.status(403).json({
        error: "Account was created with Google. Try logging in with Google.",
      });
    }

    const result = await bcrypt.compare(password, user.personal_info.password);

    if (!result) {
      return res.status(403).json({ error: "Incorrect Password" });
    }

    return res.status(200).json(formatDatatoSend(user));
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

// Handles Google OAuth authentication
export const googleAuth = async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      // enhance resolution of the picture
      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      // login the user only if the user was previously signed up with the google
      // account, else ask him to use email and password for login.
      if (user) {
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email was signe up without google. Please login with password to access the account",
          });
        }
      } else {
        // if he hasn't signed up with the google previously, then make his account.
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
            profile_img: picture,
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }

      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((err) => {
      return res.status(500).json({
        error:
          "Failed to authenticate you with Google. Try with some other Google account",
      });
    });
};
