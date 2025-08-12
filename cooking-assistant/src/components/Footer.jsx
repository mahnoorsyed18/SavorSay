import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import css from "../css/Footer.module.css";

const Footer = () => {
  return (
    <section id={css.footer}>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
              <div className={css.footer1}>
                <h1 className="text-center">
                  <Link to="/">
                    <img
                      src="/img/SavorSay-icon.png"
                      alt="SavorSay Logo"
                      style={{
                        height: "30px",
                        marginRight: "8px",
                        marginTop: "-5px",
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    />
                    SAVORSAY
                  </Link>
                </h1>
                <Link
                  to="/"
                  className={css.footerLink}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Home
                </Link>
                <Link
                  to="/recipes"
                  className={css.footerLink}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Recipes
                </Link>
                <Link
                  to="/favorites"
                  className={css.footerLink}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Your Favorite Recipes
                </Link>
                <HashLink to="/#popular" className={css.footerLink}>
                  Popular Recipes
                </HashLink>
                <Link
                  to="/about"
                  className={css.footerLink}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  About Us
                </Link>
              </div>
            </div>
            <div className="col-sm-3"></div>
          </div>
          <div className="col-sm-12">
            <div className={css.footer2}>
              <p className="text-center">
                © 2025 SavorSay, All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
