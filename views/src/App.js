/*
import logo from './logo.svg';
*/
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout /> }>
            <Route index element={<Home />} />
            <Route path="dashboard" element={
                <ProtectedRoutes>
                    <Dashboard/>
                    <Footer/>
                </ProtectedRoutes>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
