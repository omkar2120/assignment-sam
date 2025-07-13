import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <ScrollToTop />

          <Toaster position="buttom-left" reverseOrder={false} />
          <Routes>
            <Route element={<AppLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
