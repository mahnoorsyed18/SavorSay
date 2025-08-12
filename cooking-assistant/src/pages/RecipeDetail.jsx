import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { favoritesActions } from "../store/favoritesSlice";
import Spinner from "../components/Spinner";
import RecipeTimer from "../components/RecipeTimer";
import { timerActions } from "../store/timerSlice";
import slugify from "slugify"; // <== for clean URL slugs (install if needed)
import css from "../css/RecipeDetail.module.css";

const RecipeDetail = () => {
  const activeTimer = useSelector((state) => state.timer.activeTimer);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const extractMinutes = (timeStr) => {
    if (!timeStr) return 1;

    let hours = 0;
    let minutes = 0;

    const hourMatch = timeStr.match(/(\d+)\s*hour/);
    const minuteMatch = timeStr.match(/(\d+)\s*minute/);

    if (hourMatch) {
      hours = parseInt(hourMatch[1]);
    }

    if (minuteMatch) {
      minutes = parseInt(minuteMatch[1]);
    }

    return hours * 60 + minutes;
  };

  const { name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const spokenName = location.state?.spokenName;

  const [recipe, setRecipe] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVoiceHint, setShowVoiceHint] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState("top");
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const favorites = useSelector((state) => state.favorites);
  const hasSpoken = useRef(false);
  const buttonRef = useRef(null);
  const timerRef = useRef();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const isPopular = location.pathname.includes("/popular/");
        const endpoint = isPopular ? "popular" : "recipes";

        const res = await fetch(`http://localhost:8080/${endpoint}/${name}`);
        const data = await res.json();
        setRecipe(data.recipe);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, [name, location.pathname]);

  useEffect(() => {
    if (recipe && spokenName && !hasSpoken.current) {
      speak(`Here are the complete details of ${spokenName}`);
      hasSpoken.current = true;
    }
  }, [recipe, spokenName]);

  useEffect(() => {
    if (recipe) {
      const found = favorites.includes(recipe.id);
      setIsFavorite(found);
    }
  }, [favorites, recipe]);

  // Tooltip position based on available space
  useEffect(() => {
    if (showVoiceHint && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceRight = window.innerWidth - rect.right;
      setTooltipPosition(
        spaceAbove > 300 ? "top" : spaceRight > 350 ? "right" : "top"
      );
    }
  }, [showVoiceHint]);

  const handleToggleFavorite = () => {
    if (recipe) dispatch(favoritesActions.toggleFavorite(recipe.id));
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const listenForCommands = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false; // ✅ important: only final results
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];
      if (!result.isFinal) return; // ✅ filter only final result

      const command = result[0].transcript.toLowerCase().trim();
      console.log("Voice command received:", command);

      if (!recipe) return;

      // === VOICE COMMANDS ===
      if (command.includes("add") && command.includes("favorite")) {
        if (!isFavorite) dispatch(favoritesActions.toggleFavorite(recipe.id));
      } else if (command.includes("remove") && command.includes("favorite")) {
        if (isFavorite) handleToggleFavorite();
      } else if (
        command.includes("go back") ||
        command.includes("navigate back") ||
        command.includes("go to recipes")
      ) {
        navigate("/recipes");
      } else if (command.includes("home") || command.includes("homepage")) {
        navigate("/");
      } else if (
        command.includes("favorites") ||
        command.includes("open favorites")
      ) {
        navigate("/favorites");
      } else if (
        command.includes("ingredient") ||
        command.includes("ingredients")
      ) {
        speak(`The ingredients are: ${recipe.ingredients.join(", ")}`);
      } else if (
        command.includes("instruction") ||
        command.includes("method") ||
        command.includes("process")
      ) {
        speak(`The method is: ${recipe.method.join(" ")}`);
      } else if (command.includes("calorie")) {
        speak(`${recipe.name} contains ${recipe.calories} calories.`);
      } else if (command.includes("cooking time")) {
        speak(`${recipe.name} takes ${recipe.cookingtime} to cook.`);
      } else if (command.includes("serving")) {
        speak(`${recipe.name} serves ${recipe.servingsize}.`);
      } else if (command.includes("description")) {
        speak(recipe.description || "No description available.");
      } else if (command.includes("category")) {
        speak(
          `This recipe falls under the ${
            recipe.category || "unknown"
          } category.`
        );
      } else if (command.includes("start timer")) {
        speak(`Starting a timer for ${recipe.cookingtime}`);
        if (!showTimer) {
          setShowTimer(true);
          setTimeout(() => {
            timerRef.current?.startTimerExternally({
              recipeName: recipe.name,
              recipeImage: recipe.images,
            });
          }, 100);
        } else {
          timerRef.current?.startTimerExternally({
            recipeName: recipe.name,
            recipeImage: recipe.images,
          });
        }
      } else if (command.includes("pause timer")) {
        timerRef.current?.pauseTimerExternally();
      } else if (command.includes("resume timer")) {
        timerRef.current?.resumeTimerExternally();
      } else if (command.includes("reset timer")) {
        timerRef.current?.resetTimerExternally();
      } else if (command.includes("stop")) {
        stopSpeaking();
      } else {
        speak("Sorry, I didn’t understand that command.");
      }

      setIsListening(false);
    };

    recognition.onerror = () => {
      alert("Something went wrong while listening.");
      setIsListening(false);
    };
  };

  useEffect(() => {
    const timerFromStorage = localStorage.getItem("recipeTimerState");

    if (
      recipe &&
      (!activeTimer || !activeTimer.recipeId) &&
      !timerFromStorage // 🛡️ prevents reset if already loaded from localStorage
    ) {
      const formattedName = slugify(recipe.name, { lower: true });

      dispatch(
        timerActions.setActiveTimer({
          recipeId: recipe.id,
          recipeSlug: formattedName,
          recipeImage: Array.isArray(recipe.images)
            ? recipe.images[0]
            : recipe.images,
          recipeName: recipe.name,
          remainingTime: extractMinutes(recipe.cookingtime) * 60,
          isRunning: false,
          startTime: null,
          pausedAt: null,
        })
      );
    }
  }, [recipe, dispatch, activeTimer]);

  if (!recipe) return <Spinner />;

  // This gives you the current page's recipe slug
  const currentSlug = slugify(recipe.name, { lower: true });

  // This checks if the current recipe is the one that started the timer

  return (
    <>
      <section id={css.recipesMain} className="clearfix">
        <div className={`${css.recipesMain1} clearfix`}>
          <div className="container">
            <div className="row">
              <div className="topHead">
                <h1 className="text-center">{recipe.name}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          backgroundImage: "url('/img/bg.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          padding: "40px 0",
        }}
      >
        <div
          className="container mt-4"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderRadius: "10px",
            padding: "20px",
            position: "relative",
          }}
        >
          {activeTimer && (
            <RecipeTimer
              minutes={activeTimer.originalDuration}
              onTimerEnd={() => {}}
              recipeName={activeTimer.recipeName}
              recipeImage={activeTimer.recipeImage}
              isRunning={activeTimer.isRunning}
              showName={true}
            />
          )}

          <img
            src={recipe.images}
            alt={recipe.name}
            width="100%"
            className="mb-4 rounded shadow"
            style={{ maxWidth: "500px" }}
          />

          <p>
            {recipe.subtitle} {recipe.description}
          </p>

          <div className="mb-3">
            <p>
              <strong>🕒 Cooking Time:</strong> {recipe.cookingtime}
            </p>
            <p>
              <strong>🍽️ Serving Size:</strong> {recipe.servingsize}
            </p>
            <p>
              <strong>🔥 Calories:</strong> {recipe.calories}
            </p>
          </div>

          <h4>🥕 Ingredients</h4>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {Array.isArray(recipe.ingredients) &&
            recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ing, index) => (
                <li
                  key={index}
                  onClick={() => toggleIngredient(index)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    textDecoration: checkedIngredients[index]
                      ? "line-through"
                      : "none",
                    color: checkedIngredients[index] ? "#999" : "inherit",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedIngredients[index]}
                    onChange={() => toggleIngredient(index)}
                    onClick={() => toggleIngredient(index)}
                  />
                  <span>{ing}</span>
                </li>
              ))
            ) : (
              <li>No ingredients listed.</li>
            )}
          </ul>

          <h4>🍳 Instructions</h4>
          <ol>
            {Array.isArray(recipe.method) && recipe.method.length > 0 ? (
              recipe.method.map((step, index) => <li key={index}>{step}</li>)
            ) : (
              <li>No method steps available.</li>
            )}
          </ol>

          <div className="mb-4 d-flex flex-wrap gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`btn ${isFavorite ? "btn-danger" : "btn-success"}`}
            >
              {isFavorite ? "❌ Remove from Favorites" : "❤️ Add to Favorites"}
            </button>

            {isSpeaking ? (
              <button onClick={stopSpeaking} className="btn btn-warning">
                🛑 Stop Speaking
              </button>
            ) : (
              <button
                onClick={() => {
                  if (recipe?.method?.length) {
                    speak(`The instructions are: ${recipe.method.join(" ")}`);
                  } else {
                    speak("No instructions available.");
                  }
                }}
                className="btn btn-info"
              >
                🔊 Speak Instructions
              </button>
            )}

            {isListening ? (
              <span className="text-primary fw-semibold">
                🎧 Listening to your command…
              </span>
            ) : (
              <div
                style={{ position: "relative", display: "inline-block" }}
                onMouseEnter={() => setShowVoiceHint(true)}
                onMouseLeave={() => setShowVoiceHint(false)}
              >
                <button
                  ref={buttonRef}
                  onClick={listenForCommands}
                  className="btn btn-secondary"
                >
                  🎤 Give Voice Command
                </button>

                {showVoiceHint && (
                  <div
                    style={{
                      position: "absolute",
                      ...(tooltipPosition === "top"
                        ? {
                            bottom: "110%",
                            left: "50%",
                            transform: "translateX(-50%)",
                          }
                        : {
                            top: "50%",
                            left: "110%",
                            transform: "translateY(-50%)",
                          }),
                      background: "#eef6ff",
                      border: "1px solid #007bff",
                      padding: "1rem",
                      margin: "1rem 0",
                      borderRadius: "8px",
                      width: "300px",
                      textAlign: "left",
                      zIndex: 10,
                      fontSize: "14px",
                    }}
                  >
                    <h5>🗣️ Try saying:</h5>
                    <ul style={{ lineHeight: "1.6", paddingLeft: "1rem" }}>
                      <li>“Go back”</li>
                      <li>“Go to home page”</li>
                      <li>“Open favorites”</li>
                      <li>“Add this recipe to favorites”</li>
                      <li>“Remove this recipe from favorites”</li>
                      <li>“What are the ingredients for this recipe?”</li>
                      <li>“Tell me calories for this recipe”</li>
                      <li>“Read instructions for this recipe”</li>
                      <li>“Read description for this recipe”</li>
                      <li>“What is cooking time for this recipe?”</li>
                      <li>“How many servings for this recipe?”</li>
                      <li>“What category is this recipe in?”</li>
                      <li>“Start timer”</li>
                      <li>“Pause timer”</li>
                      <li>“Resume timer”</li>
                      <li>“Reset timer”</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeDetail;
