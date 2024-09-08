import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import BurgerMenu from "./BurgerMenu";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isCharacterPage = currentPath.includes("/character/");

  return (
    !isCharacterPage && (
      <div className="container-all">
        <header>
          <div className="container">
            <div className="menu">
              <BurgerMenu
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            </div>
            <div className="header-logo">
              <img src="src/assets/Marvel_Logo.svg" alt="marvel" />
            </div>
          </div>
        </header>
      </div>
    )
  );
};
export default Header;
