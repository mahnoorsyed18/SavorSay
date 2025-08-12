import React, { useState, useEffect } from "react";
import "../css/bootstrap.min.css";
import "../css/element.css";
import "../css/index.css";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        fontWeight: "bold",
        width: "100%",
      }}
    >
      <nav
        className={`navbar navbar-default navbar-fixed-top ${
          isScrolled ? "scrolled" : ""
        }`}
        role="navigation"
      >
        <div className="container">
          <div className="navbar-header">
            <button
              className="navbar-toggle"
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">
              <img
                src="/img/SavorSay-icon.png"
                alt="SavorSay Logo"
                style={{
                  height: "50px",
                  marginRight: "8px",
                  marginTop: "-5px",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              SAVORSAY
            </Link>
          </div>

          {/* Mobile Sidebar */}
          <div
            className={`navbar-collapse custom-mobile-sidebar ${
              isCollapsed ? "collapse" : "open"
            }`}
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right">
              <li className={location.pathname === "/" ? "active" : ""}>
                <Link to="/" onClick={() => setIsCollapsed(true)}>
                  HOME
                </Link>
              </li>
              <li className={location.pathname === "/recipes" ? "active" : ""}>
                <Link to="/recipes" onClick={() => setIsCollapsed(true)}>
                  RECIPES
                </Link>
              </li>
              <li
                className={
                  location.pathname.startsWith("/favorites") ? "active" : ""
                }
              >
                <Link to="/favorites" onClick={() => setIsCollapsed(true)}>
                  FAVORITES
                </Link>
              </li>

              <li className={location.pathname === "/about" ? "active" : ""}>
                <Link to="/about" onClick={() => setIsCollapsed(true)}>
                  ABOUT
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default Header;
