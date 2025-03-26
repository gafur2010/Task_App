import { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/sign-in");
  };

  const ProtectedRoute = ({
    children,
    isAdmin = false,
  }: {
    children: JSX.Element;
    isAdmin?: boolean;
  }) => {
    if (!user) {
      return <Navigate to="/sign-in" />;
    }
    if (isAdmin && user.role !== "admin") {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <div>
      {/* Navbar */}
      {user && (
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
      )}

      {/* Routes */}
      <Routes>
        <Route path="/sign-in" element={<SignIn setUser={setUser} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};
export default App;
