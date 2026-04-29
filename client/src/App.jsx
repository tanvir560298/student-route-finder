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
  const [newRequestsCount, setNewRequestsCount] = useState(0);
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

  useEffect(() => {
    if (!user) {
      setNewRequestsCount(0);
      return;
    }

    const loadNewRequests = () => {
      fetch(`${import.meta.env.VITE_API_URL}/interested`)
        .then((res) => res.json())
        .then((data) => {
          const pendingRequests = data.filter(
            (item) =>
              item.routeOwnerEmail === user.email &&
              (!item.status || item.status === "pending")
          );

          setNewRequestsCount(pendingRequests.length);
        })
        .catch((error) => {
          console.log("New request count error:", error);
        });
    };

    loadNewRequests();

    const interval = setInterval(loadNewRequests, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    signOut(auth);
  };

  const renderNavLabel = (link) => {
    if (link.path === "/interested-students" && newRequestsCount > 0) {
      return (
        <span className="flex items-center gap-2">
          {link.label}
          <span className="bg-red-500 text-white text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
            {newRequestsCount}
          </span>
        </span>
      );
    }

    return link.label;
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
                    {renderNavLabel(link)}
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
                  {renderNavLabel(link)}
                </Link>
              );
            })}
          </div>

          {newRequestsCount > 0 && location.pathname !== "/interested-students" && (
            <div className="fixed top-20 right-4 z-50 bg-white border border-slate-200 shadow-lg rounded-2xl px-4 py-3 text-sm">
              🔔 You have {newRequestsCount} new request
              {newRequestsCount > 1 ? "s" : ""}
            </div>
          )}
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