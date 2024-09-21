import SignIn from "./components/Auth/sign-in";
import Navbar from "./components/navbar/Navbar";
import Profile from "./components/profile/profile";
import { LoginContext } from "./context";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./app.css";
import { useContext } from "react";
import AlbumsList from "./components/Albums/albumsList";


function App() {
    const { isLoggedIn } = useContext(LoginContext);

  return (
    <div className="App">
      <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={isLoggedIn ? <Profile /> : <Navigate to="/signin" />} />
                    <Route path="/albumslist" element={isLoggedIn ? <AlbumsList /> : <Navigate to="/signin" />} />
                    <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/signin" />} />
                    <Route path="/signin" element={<SignIn />} />
                </Routes>
            </Router>
    </div>
  );
}

export default App;
