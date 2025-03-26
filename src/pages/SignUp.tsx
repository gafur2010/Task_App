import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, database } from "../tools/firebase.config";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const createUser = async () => {
    if (!user.email || !user.password || !user.name) {
      alert("Email, password va ismni kiriting!");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      if (res.user) {
        await set(ref(database, `users/${res.user.uid}`), {
          name: user.name,
          email: user.email,
          messages: [],
        });

        localStorage.setItem(
          "user",
          JSON.stringify({ email: user.email, name: user.name, role: "user" })
        );

        setUser({ name: "", email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      console.error("Sign-up xatosi:", error);
      alert("Sign-up amalga oshmadi! Qayta urinib ko'ring.");
    }
  };

  return (
    <div className="card m-3 w-25 mt-5 mx-auto">
      <h1 className="font-monospace text-info mx-auto mt-2">SIGN UP</h1>
      <input
        placeholder="Type name..."
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        type="text"
        className="form-control m-2"
      />
      <input
        placeholder="Type email..."
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        type="email"
        className="form-control m-2"
      />
      <input
        placeholder="Type password..."
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        type="password"
        className="form-control m-2"
      />
      <a className="link-info mx-auto mb-2" href="/sign-in">
        Already have an account?
      </a>
      <button
        onClick={createUser}
        className="btn btn-success mb-2 w-50 mx-auto"
      >
        SIGN UP
      </button>
    </div>
  );
};

export default SignUp;
