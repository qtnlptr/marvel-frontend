import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import "./style/Header.css";
import "./style/Characters.css";
import "./style/Character.css";
import "./style/Comics.css";
import "./style/SignUp.css";
import "./style/Favorites.css";
import "./style/Home.css";
import Header from "./components/Header";
import Characters from "./pages/Characters";
import Character from "./pages/Character";
import Comics from "./pages/Comics";
import Cookies from "js-cookie";
import SignUp from "./pages/SignUp";
import Favorites from "./pages/Favorites";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Cookies.get("token") ? true : false
  );

  return (
    <>
      <Router>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/characters"
            element={<Characters isOpen={isOpen} />}
          ></Route>
          <Route
            path="character/:id"
            element={
              <Character
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/comics"
            element={
              <Comics isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          ></Route>
          <Route
            path="/signup"
            element={
              <SignUp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          ></Route>
          <Route
            path="/login"
            element={
              <LogIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          ></Route>
          <Route
            path="favorites"
            element={<Favorites isLoggedIn={isLoggedIn} />}
          ></Route>
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
