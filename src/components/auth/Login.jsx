import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, runTransaction,setDoc} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); 
  const [address, setAddress] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (activeTab === "register") {
          if (!name || !phone || !address) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
          }

          if (!snapshot.empty) {
            setError("User already exists. Please login.");
            setLoading(false);
            return;
          }

          const counterRef = doc(db, "counters", "users");
          let newUserId = 0;

          // 🔐 Atomic increment
          await runTransaction(db, async (transaction) => {
            const counterSnap = await transaction.get(counterRef);

            if (!counterSnap.exists()) {
              newUserId = 1;
              transaction.set(counterRef, { last_user_id: 1 });
            } else {
              newUserId = counterSnap.data().last_user_id + 1;
              transaction.update(counterRef, { last_user_id: newUserId });
            }
          });

          const userIdString = String(newUserId); // Firestore doc ID must be string

          const newUser = {
            user_id: newUserId,     // ✅ SAME AS doc_id
            name,
            email,
            password,
            role: "user",
            phone: parseInt(phone),
            address,
            is_active: true,
            is_deleted: false,
            created_at: new Date(),
            updated_at: new Date(),
          };

          // ✅ doc_id === user_id
          await setDoc(doc(db, "users", userIdString), newUser);

          setUser({ id: userIdString, ...newUser });
          navigate("/");
        

      } else {
        // LOGIN
        if (snapshot.empty) {
          setError("Invalid email or password");
          setLoading(false);
          return;
        }

        const userData = snapshot.docs[0].data();
        const userId = snapshot.docs[0].id;

        // Check active/deleted
        if (!userData.is_active || userData.is_deleted) {
          setError("Your account is inactive or deleted.");
          setLoading(false);
          return;
        }

        // Check password
        if (userData.password !== password) {
          setError("Invalid email or password");
          setLoading(false);
          return;
        }

        // Set logged-in user
        setUser({ id: userId, user_id: userData.user_id || userId, ...userData });

        // Redirect based on role
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h1>ShopHub</h1>
          <p>Connect with friends and the world around you.</p>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="tab-buttons">
              <button
                className={activeTab === "login" ? "active" : ""}
                onClick={() => { setActiveTab("login"); setError(""); }}
              >
                Login
              </button>
              <button
                className={activeTab === "register" ? "active" : ""}
                onClick={() => { setActiveTab("register"); setError(""); }}
              >
                Register
              </button>
            </div>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit} className="form">
              {activeTab === "register" && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="show-pass"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              <button type="submit" disabled={loading}>
                {loading
                  ? activeTab === "register"
                    ? "Registering..."
                    : "Logging in..."
                  : activeTab === "register"
                  ? "Register"
                  : "Login"}
              </button>
            </form>

            <p className="switch">
              {activeTab === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <span
                onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
              >
                {activeTab === "login" ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
