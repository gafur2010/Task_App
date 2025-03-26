import { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

const Navbar = ({ user, setUser }: { user: string | null; setUser: any }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/sign-in");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          MyApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {user ? (
                <button onClick={handleSignOut} className="btn btn-danger">
                  Sign Out
                </button>
              ) : (
                <Link className="nav-link" to="/sign-in">
                  <button className="btn btn-success">Sign In</button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const ProtectedAdmin = ({ user }: { user: string | null }) => {
  if (user !== "k@gmail.com") {
    return <Navigate to="/" replace />;
  }
  return <Admin />;
};

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    setUser(localStorage.getItem("user"));
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<ProtectedAdmin user={user} />} />
      </Routes>
    </div>
  );
};

export default App;
