import React, { useEffect } from "react";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import EmailVerification from "./pages/emailVerification/EmailVerification.jsx";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/AuthStore.js";
import ConfirmDelete from "./pages/pagesForEditables/confirmDelete/ConfirmDelete.jsx";
import ConfirmRemove from "./pages/pagesForEditables/confirmRemove/ConfirmRemove.jsx";
import LandingPage from "./pages/website/LandingPage.jsx";

const App = () => {
  const { isCheckingAuth, checkAuth, isAuthenticated, user, onlineUsers } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({onlineUsers});
  // console.log("isAuthenticated : ", isAuthenticated);
  // console.log("user : ", user);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<LandingPage />} />
          <Route
            path="/home/*"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />

          {/* Auth Pages: Redirect to Home if already authenticated */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/home" /> : <Signup />}
          />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/home/:id" element={<Home />} />
          <Route path="/home/:id/:channelName/:channelid" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
