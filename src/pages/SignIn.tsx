import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useState } from "react";
import { auth, database } from "../tools/firebase.config";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [user, setUser] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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

      let userData: { role?: string } = {};
      if (snapshot.exists()) {
        userData = snapshot.val();
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ email: user.email, role: userData.role || "user" })
      );

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert("Kirishda xatolik: " + (error as Error).message);
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
        <a className="link-info mx-auto mb-2" href="/sign-up">
          Don't have an account?
        </a>
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
