import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebase';
import { useNavigate } from "react-router-dom";


function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const adminEmail = "sazzad01794@gmail.com"; // your admin email

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Login with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is the admin
      if (user.email === adminEmail) {
        alert("Admin Login Successful!");
        navigate("/admin"); // <-- redirect to Admin Dashboard
      } else {
        setError("You are not authorized as admin.");
        auth.signOut();
      }
    } catch (err) {
      setError("Login Failed: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-80">
        <h2 className="text-xl font-bold text-center mb-4">Admin Login</h2>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter admin email"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-2 border rounded mb-3"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:opacity-80"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
