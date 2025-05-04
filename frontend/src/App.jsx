import { Navigate, Route, Routes } from "react-router-dom";
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
  const { data: authUser, isLoading, error, isError } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include", // Include credentials to send the cookie
        });
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <>
      <div>
        {authUser && <Navbar />}
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <StartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
          <Route path="/profile/:enrollNo" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer/>
        <Toaster />
      </div>
    </>
  );
}

export default App;
