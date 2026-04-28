import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./auth";

import Home from "./Pages/Home";
import AllRoutes from "./Pages/AllRoutes";
import AddRoute from "./Pages/AddRoute";
import InterestedStudents from "./Pages/InterestedStudents";
import MyRoutes from "./Pages/MyRoutes";
import MyChats from "./Pages/MyChats";
import ManagedTrips from "./Pages/ManagedTrips";
import Chat from "./Pages/Chat";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const hideNavbar = location.pathname === "/" || location.pathname === "/login";

  const navLinks = [
    { path: "/routes", label: "Explore" },
    { path: "/add-route", label: "Create Trip" },
    { path: "/my-routes", label: "My Trips" },
    { path: "/interested-students", label: "Requests" },
    { path: "/my-chats", label: "My Friends" },
    { path: "/managed-trips", label: "Managed" },
    { path: "/profile", label: "Profile" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!hideNavbar && (
        <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link to="/routes" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                SR
              </div>
              <span className="font-bold text-slate-900 hidden sm:block">
                Student Route Finder
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold"
                    title={user.displayName}
                  >
                    {user.displayName?.charAt(0)}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden border-t px-4 py-2 flex gap-2 overflow-x-auto text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`whitespace-nowrap px-3 py-2 rounded-lg ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/routes" element={<AllRoutes user={user} />} />

        <Route
          path="/add-route"
          element={
            <ProtectedRoute user={user}>
              <AddRoute user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-routes"
          element={
            <ProtectedRoute user={user}>
              <MyRoutes user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interested-students"
          element={
            <ProtectedRoute user={user}>
              <InterestedStudents user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-chats"
          element={
            <ProtectedRoute user={user}>
              <MyChats user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/managed-trips"
          element={
            <ProtectedRoute user={user}>
              <ManagedTrips />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:requestId"
          element={
            <ProtectedRoute user={user}>
              <Chat user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;