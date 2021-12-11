import { Routes, Route, Navigate } from "react-router";
import LandingPage from "../views/LandingPage";
import Login from "../views/Login"
import Register from "../views/Register"

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="*"
                element={<Navigate to="/" />}
            />
        </Routes>
    )
}

function PrivateRoute({ children }) {
    const auth = true
    return auth ? children : <Navigate to="/login" />;
}