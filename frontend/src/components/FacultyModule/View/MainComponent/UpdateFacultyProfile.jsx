import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateFacultyProfile = ({ username }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch current profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/faculty/${username}`);
        setProfile({
          name: res.data.name,
          email: res.data.email,
        });
        console.log("Profile fetched successfully:", res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.put(
      `http://localhost:5000/api/faculty/update-profile/${username}`,
      profile
    );
    alert(res.data.message); // Show success message
  } catch (err) {
    console.error("Profile update error:", err);

    // Show specific error message from backend if available
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert("Failed to update profile.");
    }
  }
};

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/faculty/change-password/${username}`, {
        oldPassword,
        newPassword,
      });
      alert(res.data.message);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password change error:", err);
      alert("Failed to change password.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h3>Update Profile</h3>
      <form onSubmit={handleProfileUpdate}>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleProfileChange}
          placeholder="Full Name"
          className="form-control mb-2"
        />
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleProfileChange}
          placeholder="Email"
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-success w-100 mb-4">
          Update Profile
        </button>
      </form>

      <h4>Change Password</h4>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          name="oldPassword"
          value={passwords.oldPassword}
          onChange={handlePasswordChange}
          placeholder="Old Password"
          className="form-control mb-2"
          required
        />
        <input
          type="password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          placeholder="New Password"
          className="form-control mb-2"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handlePasswordChange}
          placeholder="Confirm New Password"
          className="form-control mb-3"
          required
        />
        <button type="submit" className="btn btn-warning w-100">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default UpdateFacultyProfile;
