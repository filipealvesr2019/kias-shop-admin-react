// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";

import AdminPage from "./AdminPage";
import EmployeePage from "./EmployeePage";
import CustomerDetails from "./components/CustomerDetails";
import BoletoOrderDetails from "./components/BoletoOrderDetails";
import PixOrderDetails from "./components/PixOrderDetails";
import CreditCardOrderDetails from "./components/CreditCardOrderDetails";
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <div className="containerLogin">
            <nav>
              <ul>
                <li>
                  <Link to="/"></Link>
                </li>
              </ul>
            </nav>

            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/employee" element={<EmployeePage />} />
              <Route path={"/boleto/:id" } element={<BoletoOrderDetails  />} />{" "}
              <Route path={"/creditCard/:id"} element={<CreditCardOrderDetails  />} />{" "}

              <Route path={"/pix/:id"} element={<PixOrderDetails  />} />{" "}
              
              <Route path={"/customers/data/:customer"} element={<CustomerDetails  />} />{" "}


            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
