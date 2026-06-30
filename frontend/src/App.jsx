import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import Navbar from "./components/common/Navbar";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import StartPage from "./pages/extras/StartPage";
import ErrorPage from "./pages/extras/ErrorPage";
import AboutPage from "./pages/about/About";
import Footer from "./components/common/Footer";

function App() {
  const location = useLocation();

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = ["/login", "/signup"];

  const {
    data: authUser,
    isLoading,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }

        return data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117] text-slate-100">
      {/* Navbar shown on all pages except login/signup */}
      {!shouldHideNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Landing page - shows StartPage or HomePage based on auth */}
          <Route path="/" element={authUser ? <Navigate to="/home" /> : <StartPage />} />

          {/* /home is accessible to EVERYONE including guests */}
          <Route path="/home" element={<HomePage />} />

          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/notifications"
            element={
              authUser ? <NotificationPage /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/profile/:enrollNo"
            element={<ProfilePage />}
          />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>

      {/* Footer always at bottom */}
      <Footer />

      <Toaster
        toastOptions={{
          style: {
            background: "#1e2a3a",
            color: "#e2e8f0",
            border: "1px solid #2d4a6e",
          },
        }}
      />
    </div>
  );
}

export default App;
