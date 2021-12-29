// import logo from './logo.svg';
//<img src={logo} className="App-logo" alt="logo" />
// import './App.css';
import React from "react";
import AppRouter from "./router";
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import CustomTheme from "./UI/CustomTheme"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover></ToastContainer>
      <AuthProvider>
        <CustomTheme>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </CustomTheme>
      </AuthProvider>
    </div>
  );
}

export default App;
