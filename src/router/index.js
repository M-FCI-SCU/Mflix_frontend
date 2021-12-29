import { Routes, Route, Navigate } from "react-router";
import LandingPage from "../views/LandingPage";
import Login from "../views/Login"
import Register from "../views/Register"
import { useAuth } from "../context/AuthContext"

export default function AppRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <LandingPage />
                    </PrivateRoute>
                }
            />
            <Route path="/login" element={
                <RedirectToHomeIfWeAuth>
                    <Login />
                </RedirectToHomeIfWeAuth>
            } />
            <Route path="/register" element={
                <RedirectToHomeIfWeAuth>
                    <Register />
                </RedirectToHomeIfWeAuth>
            } />
            <Route
                path="*"
                element={<Navigate to="/" />}
            />
        </Routes>
    )
}

function PrivateRoute({ children }) {
    let { loggedIn } = useAuth()
    return loggedIn ? children : <Navigate to="/login" />;
}
function RedirectToHomeIfWeAuth({ children }) {
    let { loggedIn } = useAuth()
    return loggedIn ? <Navigate to="/" /> : children;
}