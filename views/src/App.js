import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game";
import Footer from "./components/Footer";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout /> }>
            <Route index element={<Home />} />
            <Route path="dashboard" element={
                <ProtectedRoutes>
                    <Navbar/>
                    <Dashboard/>
                    <Footer/>
                </ProtectedRoutes>
            } />
              <Route path="game" element={
                  <ProtectedRoutes>
                      <Navbar/>
                      <Game/>
                      <Footer/>
                  </ProtectedRoutes>
              } />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
