import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import { auth, database } from "../tools/firebase.config";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  async function loginUser() {
    if (!user.email || !user.password) {
      alert("Email va parolni kiriting!");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      const userId = res.user.uid;
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);

      let userData = { email: user.email, role: "user" }; // Default role: user
      if (snapshot.exists()) {
        userData = { ...userData, ...snapshot.val() };
      }

      if (user.email === "k@gmail.com") {
        userData.role = "admin"; // Admin email uchun maxsus rol
      }

      localStorage.setItem("user", JSON.stringify(userData));

      setUser({ email: "", password: "" });

      navigate(userData.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login xato! Iltimos, qayta urinib ko'ring.");
    }
  }

  return (
    <div>
      <div className="card m-3 w-25 mt-5 mx-auto">
        <h1 className="font-monospace text-info mx-auto mt-2">SIGN IN</h1>
        <input
          placeholder="Type email..."
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          type="email"
          className="form-control m-2 w-auto"
        />
        <input
          placeholder="Type password..."
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
          className="form-control m-2 w-auto"
        />
        <button
          onClick={loginUser}
          className="btn btn-primary mb-2 w-50 mx-auto"
        >
          SIGN IN
        </button>
      </div>
    </div>
  );
};

export default SignIn;
