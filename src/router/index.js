import { Routes, Route, Navigate } from "react-router";
import LandingPage from "../views/LandingPage";
import Login from "../views/Login"
import Register from "../views/Register"
import { useAuth } from "../context/AuthContext"
import Box from '@mui/material/Box';

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
    let { isAuth, authLoading } = useAuth()
    if (authLoading) {
        return (
            <Box>
            </Box>
        );
    }
    return isAuth ? children : <Navigate to="/login" />;
}
function RedirectToHomeIfWeAuth({ children }) {
    let { isAuth, authLoading } = useAuth()
    if (authLoading) {
        return (
            <Box>
            </Box>
        );
    }
    return isAuth ? <Navigate to="/" /> : children;
}