import { get, ref } from "firebase/database";
import { auth, database } from "../tools/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [user, setUserState] = useState({ email: "", password: "" });
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

      let userData = { email: user.email, role: "user" };
      if (snapshot.exists()) {
        userData = { ...userData, ...snapshot.val() };
      }

      if (user.email === "k@gmail.com") {
        userData.role = "admin";
      }

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setUserState({ email: "", password: "" });

      navigate(userData.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login xato! Iltimos, qayta urinib ko'ring.");
    }
  }

  return (
    <div className="card m-3 w-25 mt-5 mx-auto">
      <h1 className="font-monospace text-info mx-auto mt-2">SIGN IN</h1>
      <input
        placeholder="Type email..."
        value={user.email}
        onChange={(e) => setUserState({ ...user, email: e.target.value })}
        type="email"
        className="form-control m-2 w-auto"
      />
      <input
        placeholder="Type password..."
        value={user.password}
        onChange={(e) => setUserState({ ...user, password: e.target.value })}
        type="password"
        className="form-control m-2 w-auto"
      />
      <a className="link-info mx-auto mb-2" href="/sign-up">
        Do you have an account?
      </a>
      <button onClick={loginUser} className="btn btn-primary mb-2 w-50 mx-auto">
        SIGN IN
      </button>
    </div>
  );
};
export default SignIn;
