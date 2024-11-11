import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./navbar.css";
import { faPhotoFilm } from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseinit";
import { useContext } from "react";
import { LoginContext } from "../../context";
import { signOut } from "firebase/auth";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth);
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <FontAwesomeIcon icon={faPhotoFilm} className="logo_icon" />
          <h2>Photo-folio</h2>
        </div>

        <div className="menu-list">
          <ul>
            {isLoggedIn ? (
              <li>
                <Link to="/albumslist" className="nav-item">
                  {" "}
                  Albums{" "}
                </Link>
              </li>
            ) : null}
            {isLoggedIn ? (
              <li>
                <Link to="/profile" className="nav-item">
                  Profile
                </Link>
              </li>
            ) : null}

            {isLoggedIn ? (
              <li>
                <Link
                  to="/profile"
                  className="nav-item"
                  onClick={handleSignOut}>
                  Signout
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/signin" className="nav-item">
                  {" "}
                  Sign in{" "}
                </Link>
              </li>
            )}
          </ul>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default Navbar;
