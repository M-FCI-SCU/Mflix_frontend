// import logo from './logo.svg';
//<img src={logo} className="App-logo" alt="logo" />
// import './App.css';
import React from "react";
import AppRouter from "./router";
import { BrowserRouter } from "react-router-dom"
import {AuthProvider} from "./context/AuthContext"
import CustomTheme from "./UI/CustomTheme"

function App() {
  return (
    <div>
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
