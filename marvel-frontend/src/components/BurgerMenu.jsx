import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const BurgerMenu = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="burger-cta" onClick={handleClick}>
        <GiHamburgerMenu className="burger-menu" />
      </button>
      <nav className={isOpen ? "burger-open" : "burger-closed"}>
        <button className="burger-cta" onClick={handleClick}>
          <GiHamburgerMenu className="burger-menu" />
        </button>
        <Link to="/">
          <button onClick={handleClick} className="nav-items">
            Home
          </button>
        </Link>
        <Link to="/characters">
          <button onClick={handleClick} className="nav-items">
            Characters
          </button>
        </Link>
        <Link to="/comics">
          <button onClick={handleClick} className="nav-items">
            Comics
          </button>
        </Link>
        {isLoggedIn ? (
          <Link to="/favorites">
            <button onClick={handleClick} className="nav-items">
              Favorites
            </button>
          </Link>
        ) : (
          <Link to="/signup">
            <button onClick={handleClick} className="sign-up-cta">
              Sign Up
            </button>
          </Link>
        )}
        {isLoggedIn && (
          <button
            className="logout-cta"
            onClick={() => {
              Cookies.remove("token");
              setIsLoggedIn(!isLoggedIn);
            }}
          >
            Log out
          </button>
        )}
        {!isLoggedIn && (
          <Link to="/login">
            <button onClick={handleClick} className="login-cta">
              Login
            </button>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default BurgerMenu;
