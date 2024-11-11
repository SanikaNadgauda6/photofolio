import React, { useContext, useEffect, useState } from "react";
import "./signin.css";
import { UserContext } from "../../context";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { auth } from "../../firebaseinit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [isActive, setIsActive] = useState(false);
  // const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const firestore = getFirestore(); // Initialize Firestore
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [error, setError] = useState(null);

  const provider = new GoogleAuthProvider();

  useEffect(() => {
    if (user) {
      navigate("/albumslist");
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        });
        navigate("/albumslist");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignUpClick = () => {
    setIsActive(true);
  };

  const handleSignInClick = () => {
    setIsActive(false);
  };

  const handleSignUp = async () => {
    try {
      // Log values for debugging
      console.log("Attempting sign up with:", {
        email,
        password,
        username,
        photoURL,
      });

      // Validate inputs
      if (!email || !password || !username) {
        setError("Please fill in all required fields.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser = userCredential.user;

      console.log("User signed up successfully!", loggedInUser);

      // Update user profile
      await updateProfile(loggedInUser, {
        displayName: username,
        photoURL: photoURL || "",
      });

      setUser({
        displayName: loggedInUser.displayName,
        email: loggedInUser.email,
        photoURL: loggedInUser.photoURL,
        uid: loggedInUser.uid,
      });

      console.log("This is user", loggedInUser);
      navigate("/albumslist");
    } catch (error) {
      setError(error.message);
      console.log("Error creating user:", error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully! from auth page");
      navigate("/albumslist");
    } catch (error) {
      setError(error.message); // This will show a more detailed error message in your app
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        provider.addScope("profile");
        provider.addScope("email");
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const loggedInUser = result.user;

        console.log("User Info:", loggedInUser);
        console.log("Access Token:", token);

        // setIsLoggedIn(true);
        navigate("/albumslist");
        setUser({
          displayName: loggedInUser.displayName,
          email: loggedInUser.email,
          photoURL: loggedInUser.photoURL,
          uid: loggedInUser.uid,
        });
        navigate("/albumslist");

        console.log("User Info:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error:", errorCode, errorMessage);
      });
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">
      <div className="form-container sign-up">
        <h1>Create Account</h1>
        <div className="social-icons">
          <FontAwesomeIcon
            className="google"
            icon={faGoogle}
            onClick={handleGoogleSignIn}
          />
        </div>
        <span>or use your email for register</span>
        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Profile Picture URL"
          onChange={(e) => setPhotoURL(e.target.value)}
        />

        <button onClick={handleSignUp}> Sign Up</button>
      </div>

      <div className="form-container sign-in">
        <h1>Sign In</h1>
        <div className="social-icons">
          <FontAwesomeIcon
            className="google"
            icon={faGoogle}
            onClick={handleGoogleSignIn}
          />
        </div>
        <span>or use your email and password</span>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
        <br></br>
        {/* <a href="#">Forgot Password?</a> */}
        <button onClick={handleSignIn}>Sign In</button>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features.</p>
            <button className="hidden" id="login" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Hello, Subscriber!</h1>
            <p>
              Register with your personal details to use all of site features.
            </p>
            <button
              className="hidden"
              id="register"
              onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
