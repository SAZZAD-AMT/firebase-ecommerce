// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { users, setUser } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Load user data
  useEffect(() => {
    if (users) {
      setProfile({
        name: users.name || "",
        phone: users.phone || "",
        address: users.address || "",
        image: users.image || "",
      });
      setImagePreview(users.image || "/default-avatar.png");
    }
  }, [users]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess("");
    try {
      let imageUrl = profile.image;

      // Upload new image if changed
      if (profile.image instanceof File) {
        const imageRef = ref(storage, `profile_images/${users.id}`);
        await uploadBytes(imageRef, profile.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const userRef = doc(db, "users", users.id);
      await updateDoc(userRef, {
        name: profile.name,
        phone: parseInt(profile.phone),
        address: profile.address,
        image: imageUrl,
        updated_at: new Date(),
      });

      setUser({ ...users, ...profile, image: imageUrl });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setSuccess("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Left: Profile Card */}
        <div className="profile-card">
          <div className="profile-image-container">
            <img
              src={imagePreview || "/default-avatar.png"}
              alt="Profile"
              className="profile-image"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="profileImage"
              style={{ display: "none" }}
            />
            <label htmlFor="profileImage" className="btn-upload">
              {imagePreview ? "Change Image" : "Upload Image"}
            </label>
          </div>

          <div className="profile-info">
            <h3>{profile.name || "Your Name"}</h3>
            <p>📞 {profile.phone || "Phone Number"}</p>
            <p>🏠 {profile.address || "Address"}</p>
          </div>
        </div>

        {/* Right: Editable Form */}
        <div className="profile-form">
          <h2>Edit Profile</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <button
            className="btn-save"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {success && <p className="success-message">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
