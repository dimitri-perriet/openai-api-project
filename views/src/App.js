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
import Header from "./components/Header";

function App() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout /> }>
            <Route index element={<Home />} />
            <Route path="dashboard" element={
                <ProtectedRoutes>
                    <Header title={"Que souhaites-tu faire, " + user.firstname + " ?"}/>
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
