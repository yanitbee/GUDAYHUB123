import React, { useState, useEffect } from "react";
import { useLocation, Link as RouterLink, useNavigate, NavLink  } from "react-router-dom";
import { Link } from "react-scroll";
import useAuth from "../Hooks/UseAuth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoutPopup from "../components/LogoutPopup";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [shownav, setshowNav] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const { t } = useTranslation();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 50) {
      setNav(true);
    } else {
      setNav(false);
    }
  };
  useEffect(() => {
    switch (location.pathname) {
      case "/freelancerpage/Messenger":
      case "/Messenger":
      case "/Interview":
      case "/room/:roomId":
      case "/employerpage/Freelancerdetails":
      case "/freelancerlist/Freelancerdetails":
      case "/joblist/apply":
      case "/admin":
      case "/ReadMore":
      case "/freelancerpage/Freelancerdetails":
        setshowNav(false);
        break;
      default:
        setshowNav(true);
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutPopup(true); 
  };

  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    logOut();
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const renderNavLinks = () => {
    switch (location.pathname) {
      case "/freelancerpage":
      case "/freelancerpage/Taskmanager":
      case "/freelancerpage/Apply":
      case "/freelancerpage/Offer":
        return (
          <>
            <li>
              <RouterLink to="/freelancerpage">{t("Home")}</RouterLink>
            </li>
            <li>
              <RouterLink to="/freelancerpage/Taskmanager">
                {t("Task Manager")}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/freelancerpage/Offer">
                {t("Offer")}
              </RouterLink>
            </li>
            <li>
              <a href="/" onClick={handleLogoutClick}>
                {t("LogOut")}
              </a>
            </li>
          </>
        );
      case "/employerpage":
      case "/employerpage/Post":
      case "/employerpage/Applicantsdetails":
      case "/employerpage/Applicantsdetails/more":
      case "/employerpage/Freelancerdetails":
        return (
          <>
            <li>
              <RouterLink to="/employerpage">{t("Home")}</RouterLink>
            </li>
            <li>
              <RouterLink to="/employerpage/Post">{t("Post")}</RouterLink>
            </li>
            <li>
              <RouterLink to="/employerpage/Applicantsdetails">
                {t("Applicants")}
              </RouterLink>
            </li>
            <li>
              <a href="/" onClick={handleLogoutClick}>
                {t("LogOut")}
              </a>
            </li>
          </>
        );
        case "/joblist":
        case "/freelancerlist":
          case "/login":
            case "/Register":
          return(
            <> <li>
            <NavLink to="/" smooth={true} duration={500}>
              {t("Home")}
            </NavLink>
          </li>
          <div className="drop">
            <li className="serv">
            <NavLink to="/#service">
              {t("Service")}
            </NavLink>
            </li>
            <li className="item">
              <NavLink to="/joblist">
                {t("Job List")}
              </NavLink>
            </li>
            <li className="item otheritem">
              <NavLink to="/freelancerlist">
                {t("Freelancer")}
              </NavLink>
            </li>
          </div>
          <li>
          <NavLink to="/#about">
            {t("About")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/#testimony">
            {t("Testimony")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/#contact">
            {t("Contact")}
          </NavLink>
          </li>
          <LanguageSwitcher />
            </>
          )
      case "/":
        return (
          <>
            <li>
              <Link to="main" smooth={true} duration={500}>
                {t("Home")}
              </Link>
            </li>
            <div className="drop">
            <li className="serv">
              <Link to="service" smooth={true} duration={500}>
                {t("Service")}
              </Link>
            </li>
           
            <li className="item">
              <RouterLink to="/joblist">
                {t("Job List")}
              </RouterLink>
            </li>
            <li className="item otheritem">
              <RouterLink to="/freelancerlist">
                {t("Freelancer")}
              </RouterLink>
            </li>
            </div>
            <li>
              <Link to="about" smooth={true} duration={500}>
                {t("About")}
              </Link>
            </li>
            <li>
              <Link to="testimony" smooth={true} duration={500}>
                {t("Testimony")}
              </Link>
            </li>
            <li>
              <Link to="contact" smooth={true} duration={500}>
                {t("Contact")}
              </Link>
            </li>
          
            <LanguageSwitcher />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {shownav && (
        <nav className={nav ? "nav active" : "nav"}>
          <RouterLink to="" className="logo">
            <img src="/image/logo.png" alt="" />
          </RouterLink>
          <input className="menu-btn" type="checkbox" id="menu-btn" />
          <label className="menu-icon" htmlFor="menu-btn">
            <span className="nav-icon"></span>
          </label>
          <ul className="menu">{renderNavLinks()}</ul>
        </nav>
      )}
            {showLogoutPopup && (
        <LogoutPopup
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </>
  );
};

export default Navbar;
