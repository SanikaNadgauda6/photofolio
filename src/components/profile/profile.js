import React, { useContext } from "react";
import "./profile.css";
import { UserContext } from "../../context";

const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container-profile">
      {user.photoURL ? (
        <div>
          <img 
            src={user.photoURL} 
            alt={`${user.displayName || 'User'}'s profile`} 
            className="profile-picture"
            />
        </div>
      ) : (
        <p>No profile picture available</p>
      )}
      <h5>{user.displayName || 'N/A'}</h5>
      <h5>{user.email || 'N/A'}</h5>
    </div>
  );
};

export default Profile;
