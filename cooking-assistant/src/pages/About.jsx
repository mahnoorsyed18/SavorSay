import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLemon, faUtensils } from "@fortawesome/free-solid-svg-icons";
import commitmentImg from "/img/commitment.jpg";
import { Link } from "react-router-dom";
import css from "../css/About.module.css";

const About = () => {
  return (
    <>
      <section id={css.aboutSection}>
        <div className="container">
          <div className="row">
            <div className="topHead">
              <h1 className="text-center">ABOUT</h1>
            </div>
          </div>
        </div>
      </section>

      <section id={css.tasteSection}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className={css.tasteIntro}>
                <h1 className="text-center">WHERE TASTE SPEAKS</h1>
                <p className="text-center">
                  Welcome to SavorSay, where flavor finds its voice! Discover a
                  smarter way to cook with our voice-assisted platform that
                  turns everyday meals into interactive experiences. From quick
                  dinners to festive feasts, SavorSay is here to guide you every
                  step of the way. <br /> At SavorSay, we believe cooking should
                  be joyful, effortless, and accessible to all. Our recipes are
                  designed with simplicity and clarity, supported by intuitive
                  voice commands that help you focus more on flavor and less on
                  fumbling with screens.
                  <br /> Born from the idea that technology and taste can work
                  together, SavorSay brings a fresh twist to home cooking.
                  Whether you're a beginner in the kitchen or a seasoned cook
                  exploring new horizons, let SavorSay be your trusted kitchen
                  companion — one delicious step at a time.
                </p>
              </div>
              <div className="col-sm-4">
                <div className={css.tasteFeature}>
                  <h1 className="text-center">
                    <i>
                      <FontAwesomeIcon icon={faLemon} />
                    </i>
                  </h1>
                  <h3 className="text-center">
                    <p>FRESH INGREDIENTS</p>
                  </h3>
                  <p className="text-center">
                    Our recipes are crafted using fresh, high-quality
                    ingredients that enhance every dish. <br /> Taste the
                    difference in every bite!
                  </p>
                </div>
              </div>
              <div className="col-sm-4">
                <div className={css.tasteFeature}>
                  <h1 className="text-center">
                    <i className="fa fa-fire"></i>
                  </h1>
                  <h3 className="text-center">
                    <p>SPICE IT UP</p>
                  </h3>
                  <p className="text-center">
                    Add a little kick to your meals with the perfect blend of
                    spices. <br /> Our recipes bring bold flavors to life.
                  </p>
                </div>
              </div>
              <div className="col-sm-4">
                <div className={css.tasteFeature}>
                  <h1 className="text-center">
                    <i>
                      <FontAwesomeIcon icon={faUtensils} />
                    </i>
                  </h1>
                  <h3 className="text-center">
                    <p>PERFECTLY CRAFTED DISHES</p>
                  </h3>
                  <p className="text-center">
                    Each recipe is carefully designed to create a harmonious and
                    delicious dish. <br /> Your taste buds will thank you!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id={css.commitmentSection}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 padding_all">
              <div className={css.commitmentHeader}>
                <h3 className="text-center">OUR COMMITMENT</h3>
                <br />
                <h1 className="text-center">BRINGING FLAVORS TO LIFE</h1>
              </div>
              <div className="col-sm-7">
                <div className={css.commitmentImage}>
                  <p>
                    <img
                      src={commitmentImg}
                      width="100%"
                      alt="Delicious Dish"
                    />
                  </p>
                </div>
              </div>
              <div className="col-sm-5">
                <div className={css.commitmentText}>
                  <h4>
                    Welcome to SavorSay, your voice-powered cooking companion!
                    We’re here to make cooking simple, fun, and hands-free.
                    Whether you're whipping up a quick lunch or exploring a new
                    dish, just say the word — and SavorSay will guide you
                    through it.
                  </h4>
                  <p>
                    We believe great food shouldn’t be complicated. With
                    easy-to-follow recipes and helpful voice instructions,
                    you’ll enjoy every step from prep to plate. SavorSay was
                    built for home cooks of all levels — so whether you're just
                    starting out or already love experimenting in the kitchen,
                    we’re excited to cook with you!
                  </p>
                </div>
                <div className={css.commitmentButton}>
                  <p>
                    <Link to="/recipes">EXPLORE OUR RECIPES</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id={css.statsSection}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="col-sm-3">
                <div className={css.statsCard}>
                  <h2 className="text-center">250+</h2>
                  <p className="text-center">Global Recipes</p>
                </div>
              </div>
              <div className="col-sm-3">
                <div className={css.statsCard}>
                  <h2 className="text-center">10+</h2>
                  <p className="text-center">Cuisine Types</p>
                </div>
              </div>
              <div className="col-sm-3">
                <div className={css.statsCard}>
                  <h2 className="text-center">1M+</h2>
                  <p className="text-center">Happy Foodies</p>
                </div>
              </div>
              <div className="col-sm-3">
                <div className={css.statsCard}>
                  <h2 className="text-center">20+</h2>
                  <p className="text-center">Popular Recipes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id={css.communitySection}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className={css.communityContent}>
                <h1 className="text-center">JOIN OUR COMMUNITY</h1>
                <p className="text-center">
                  Be a part of our growing family of food lovers and home chefs.
                  Explore tasty recipes to make your cooking even better!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
