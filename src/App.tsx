import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./view/Dashboard";
import Login from "./view/Login";
import "./styles/login.css";
import TableView from "./view/TableView";
import DataView from "./view/DataView";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  window.addEventListener("message", function (event) {
    event.preventDefault();
    event.stopPropagation();
  });

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path='/Dashboard'
          element={isLoggedIn ? <Dashboard /> : <Navigate to='/' />}
        />
        <Route
          path='/:selectedDatabase/createTable'
          element={isLoggedIn ? <TableView /> : <Navigate to='/' />}
        />
        <Route
          path='/:selectedDatabase/updateTable/:selectedTable'
          element={isLoggedIn ? <TableView /> : <Navigate to='/' />}
        />
        <Route
          path='/View/:selectedDatabase/:selectedTable'
          element={isLoggedIn ? <DataView /> : <Navigate to='/' />}
        />
      </Routes>
    </Router>
  );
}

export default App;
