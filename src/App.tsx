import { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

const Navbar = ({ user, setUser }: { user: any; setUser: any }) => {
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
            {user ? (
              <button onClick={handleSignOut} className="btn btn-danger">
                Sign Out
              </button>
            ) : (
              <Link className="nav-link" to="/sign-in">
                <button className="btn btn-success">Sign In</button>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/"
          element={
            user ? (
              <Home />
            ) : (
              <h1 className="text-center mt-5 text-danger">Access Denied</h1>
            )
          }
        />
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <Admin />
            ) : (
              <h1 className="text-center mt-5 text-danger">Access Denied</h1>
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
