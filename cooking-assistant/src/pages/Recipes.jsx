import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import RecipeCard from "../components/RecipeCard";
import Spinner from "../components/Spinner";
import { addInitialItems, setQuery } from "../store/recipesSlice";
import { favoritesActions } from "../store/favoritesSlice";
import styles from "../css/Recipes.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import ManualSearchBar from "../components/ManualSearch/ManualSearchBar";
import ViewAllRecipesButton from "../components/ViewAllRecipesButton";

const Recipes = () => {
  useEffect(() => {
    // Cleanup function to cancel speech when navigating away from this page
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hasSpokenRef = React.useRef(false);
  const headingRef = React.useRef(null);

  const recipes = useSelector((state) => state.recipes.items);
  const query = useSelector((state) => state.recipes.query);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [commandListening, setCommandListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCommands, setShowCommands] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const queryParam = new URLSearchParams(location.search).get("q");
    const fromParam = new URLSearchParams(location.search).get("from");

    if (!queryParam) return;

    const cleaned = cleanQuery(queryParam);

    // ✅ Move dispatch early, before anything async or conditionally blocked
    dispatch(setQuery(cleaned));

    setLoading(true);
    hasSpokenRef.current = false;

    const fetchFromQuery = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/recipes`);
        const data = await res.json();

        const filtered = data.recipes.filter(
          (r) =>
            r.name.toLowerCase().includes(cleaned) ||
            (r.category && r.category.toLowerCase().includes(cleaned))
        );

        dispatch(addInitialItems(filtered));

        if (
          (fromParam === "voice" || fromParam === "herosection") &&
          !hasSpokenRef.current
        ) {
          speak(`Here are some recipes for ${cleaned}`);
          hasSpokenRef.current = true;

          const newSearch = `?q=${cleaned}`;
          window.history.replaceState(null, "", newSearch);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }

      setLoading(false);
    };

    fetchFromQuery();
  }, [location.search, dispatch]);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [recipes]);

  const speak = (text) => {
    window.speechSynthesis.cancel(); // clear any queued speech
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const cleanQuery = (voiceText) => {
    let cleaned = voiceText.toLowerCase().trim();

    const preserveCombos = [
      "fast food",
      "junk food",
      "street food",
      "baby food",
    ];
    preserveCombos.forEach((combo) => {
      cleaned = cleaned.replace(combo, combo.replace(" ", "__preserve__"));
    });

    const noiseWords = [
      "go",
      "back",
      "page",
      "can you",
      "could you",
      "would you",
      "will you",
      "shall you",
      "should you",
      "may you",
      "might you",
      "please",
      "kindly",
      "tell me",
      "i",
      "me",
      "mine",
      "cook",
      "want",
      "want to",
      "i want",
      "i want to see",
      "look for",
      "i want to look",
      "some",
      "give me",
      "hello",
      "hi",
      "assistant",
      "ai",
      "AI",
      "artificial inteligence",
      "chief",
      "cheif",
      "find",
      "search",
      "open",
      "show",
      "show me",
      "show me the",
      "show me recipes for",
      "display",
      "see",
      "all",
      "the",
      "a",
      "an",
      "of",
      "to",
      "for",
      "list",
      "lists",
      "result",
      "results",
      "recipes",
      "recipe",
      "recip",
      "items",
      "item",
      "dishes",
      "dish",
      "how",
      "are",
      "you",
      "what",
      "doing",
      "what's up",
      "foods",
      "food",
      "healthy",
      "healthier",
      "healthiest",
      "nutritious",
      "nutrition",
      "nutrients",
      "best",
      "bester",
      "bestest",
      "delicious",
      "tasty",
      "tastier",
      "tastiest",
      "flavor",
      "taste",
      "tasteful",
      "mouth-watering",
      "mouthwatering",
      "more",
      "common",
      "less",
      "famous",
      "popular",
    ];

    noiseWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      cleaned = cleaned.replace(regex, "");
    });

    cleaned = cleaned.replace(/\s+/g, " ").trim();
    cleaned = cleaned.replace(/__preserve__/g, " ");

    const corrections = {
      milkshakes: "milkshake",
      shake: "milkshake",
      shakes: "milkshake",
      shaakes: "milkshake",
      shaake: "milkshake",
      kafi: "coffee",
      cofe: "coffee",
      cafe: "coffee",
      chai: "tea",
      chaye: "tea",
      chaan: "tea",
      chaa: "tea",
      desert: "dessert",
      deserts: "dessert",
      desserts: "dessert",
      snacks: "snack",
      snaks: "snack",
      snax: "snack",
      drinks: "drink",
      beverages: "drink",
      italion: "italian",
      italiann: "italian",
      italiano: "italian",
      italions: "italian",
      chinise: "chinese",
      chinees: "chinese",
      chinies: "chinese",
      pakistanii: "pakistani",
      pakstani: "pakistani",
      fastfood: "fast food",
      "fast food": "fast food",
      "fast foods": "fast food",
      "fast foood": "fast food",
      "fast fooodz": "fast food",
      "fast-food": "fast food",
      fastfoood: "fast food",
      fastfooodz: "fast food",
      burger: "burger",
      burgers: "burger",
      biriyani: "biryani",
      biryanis: "biryani",
      bryani: "biryani",
      chiken: "chicken",
      chickens: "chicken",
      chickn: "chicken",
      muttun: "mutton",
      motton: "mutton",
      moton: "mutton",
      beefs: "beef",
      beaf: "beef",
      soupz: "soup",
      supe: "soup",
      soupp: "soup",
      soups: "soup",
      pastaas: "pasta",
      pastas: "pasta",
      pastaa: "pasta",
      sanwich: "sandwich",
      sandwiche: "sandwich",
      sandwitch: "sandwich",
      sanwiches: "sandwich",
      sandwiches: "sandwich",
      peezzaz: "pizza",
      pezaz: "pizza",
      peezas: "pizza",
      peezzas: "pizza",
      pizzaz: "pizza",
      piza: "pizza",
      pissa: "pizza",
      pizaaz: "pizza",
      kabab: "kebab",
      kebap: "kebab",
      kabob: "kebab",
      kababs: "kebab",
      kebabs: "kebab",
      lassi: "lassi",
      lassy: "lassi",
      laasi: "lassi",
      lassie: "lassi",
      rollz: "roll",
      rolls: "roll",
      samossa: "samosa",
      samusa: "samosa",
      samoosa: "samosa",
      qorma: "korma",
      kurma: "korma",
      karhai: "karahi",
      karai: "karahi",
      karhii: "karahi",
      karaahi: "karahi",
      karaai: "karahi",
      karahee: "karahi",
      kadhai: "karahi",
      kadai: "karahi",
      qadhai: "karahi",
      qadai: "karahi",
      "chicken karhai": "chicken karahi",
      "chicken karai": "chicken karahi",
      "chicken karaahi": "chicken karahi",
      "chicken kadhai": "chicken karahi",
      "chicken kadai": "chicken karahi",
      "chicken qadhai": "chicken karahi",
      "chicken qadai": "chicken karahi",
      parata: "paratha",
      pratha: "paratha",
      parotta: "paratha",
      nihari: "nihari",
      nehaari: "nihari",
      nihaari: "nihari",
      shawarma: "shawarma",
      shawrma: "shawarma",
      halwa: "dessert",
      halva: "dessert",
      halawat: "dessert",
      kunafa: "dessert",
      kanafa: "dessert",
      falooda: "dessert",
      faluda: "dessert",
      pakora: "snack",
      pakoda: "snack",
      pakoras: "snack",
      bhajji: "snack",
      tikka: "bbq",
      boti: "bbq",
      noodles: "chinese",
      noddles: "noodles",
      nodles: "noodles",
      nudles: "noodles",
      noodals: "noodles",
      noodels: "noodles",
      nuddles: "noodles",
      noodlz: "noodles",
      newdles: "noodles",
      fish: "seafood",
      prawns: "seafood",
      shrimp: "seafood",
      shrimps: "seafood",
      expresso: "coffee",
      expressso: "coffee",
      smoothie: "drink",
      smoothies: "drink",
      juice: "drink",
      juices: "drink",
      icecream: "ice cream",
      icecreams: "ice cream",
      "ice creams": "ice cream",
    };

    return corrections[cleaned] || cleaned;
  };

  const findRecipeByName = (dish) => {
    return recipes.find((r) =>
      r.name.toLowerCase().includes(dish.toLowerCase())
    );
  };

  const findRecipeByNumber = (num) => {
    const i = parseInt(num) - 1;
    return recipes[i] || null;
  };

  const getCleanName = (cmd, wordsToRemove) => {
    let result = cmd.toLowerCase();
    wordsToRemove.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      result = result.replace(regex, "");
    });
    return result.replace(/\s+/g, " ").trim();
  };

  const handleVoiceCommand = () => {
    stopSpeaking();
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("SpeechRecognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    setCommandListening(true);
    setShowCommands(false);
    recognition.start();

    recognition.onresult = async (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      const cleaned = cleanQuery(command);
      const recipeByName = findRecipeByName(cleaned);
      const numberMatch = command.match(/recipe number (\d+)/);

      try {
        // 1. Go back to homepage
        if (
          /go back|homepage|home page|home|back to home|go back to home page|open home page|open home/.test(
            command
          )
        ) {
          navigate("/");
          return;
        }

        // 2. Open favorites page
        if (
          /open favorites|open favorites page|go to favorites|go to favorites page|go to favorites section|open favorites section/.test(
            command
          )
        ) {
          navigate("/favorites");
          return;
        }

        // 4. Calories for recipe number X
        if (/calories.*recipe number/.test(command) && numberMatch) {
          const recipe = findRecipeByNumber(numberMatch[1]);
          if (recipe) {
            speak(
              `${recipe.name} has approximately ${
                recipe.calories || "unknown"
              } calories.`
            );
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 5. Calories for dish name
        if (/calories.*(recipe|for)/.test(command)) {
          const dish = getCleanName(command, [
            "calories",
            "recipe",
            "for",
            "of",
            "tell me",
            "the",
            "how many",
            "what",
            "are",
            "is",
            "can you",
            "please",
            "kindly",
            "read",
            "assistant",
            "hello",
            "ai",
            "would you",
          ]);
          const recipe = findRecipeByName(dish);
          if (recipe) {
            speak(
              `${recipe.name} has approximately ${
                recipe.calories || "unknown"
              } calories.`
            );
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 6. Instructions for recipe number X
        if (/instructions.*recipe number/.test(command) && numberMatch) {
          const recipe = findRecipeByNumber(numberMatch[1]);
          if (recipe) {
            speak(
              `Instructions for ${recipe.name}: ${recipe.method.join(". ")}`
            );
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 7. Instructions for dish name
        if (/instructions|steps/.test(command)) {
          const dish = getCleanName(command, [
            "instructions",
            "steps",
            "for",
            "read",
            "show",
            "recipe",
            "tell me",
            "what",
            "are",
            "is",
            "method",
            "process",
            "please",
            "kindly",
            "assistant",
            "hello",
            "ai",
            "can you",
            "would you",
            "the",
          ]);
          const recipe = findRecipeByName(dish);
          if (recipe) {
            speak(
              `Instructions for ${recipe.name}: ${recipe.method.join(". ")}`
            );
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 8. Cooking time for recipe number X
        if (/cooking time.*recipe number/.test(command) && numberMatch) {
          const recipe = findRecipeByNumber(numberMatch[1]);
          if (recipe) {
            speak(`${recipe.name} takes approximately ${recipe.cookingtime}.`);
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 9. Cooking time for dish name
        if (/cooking time.*(for|of)/.test(command)) {
          const dish = getCleanName(command, [
            "cooking time",
            "time to cook",
            "for",
            "of",
            "what is",
            "long",
            "how",
            "will",
            "this",
            "it",
            "take",
            "recipe",
            "much",
            "time",
            "can you",
            "will you",
            "i",
            "want",
            "to",
            "know",
            "please",
            "kindly",
            "let",
            "me",
            "the",
            "cook",
            "assistant",
            "hello",
            "ai",
          ]);
          const recipe = findRecipeByName(dish);
          if (recipe) {
            speak(`${recipe.name} takes approximately ${recipe.cookingtime}.`);
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 10. Ingredients for recipe number
        if (/ingredients.*recipe number/.test(command) && numberMatch) {
          const recipe = findRecipeByNumber(numberMatch[1]);
          if (recipe) {
            speak(
              `Ingredients for ${recipe.name}: ${recipe.ingredients.join(", ")}`
            );
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 11. Ingredients for dish name
        if (/ingredients.*(for|of)/.test(command)) {
          const dish = getCleanName(command, [
            "ingredients",
            "for",
            "of",
            "what are",
            "tell me",
            "which things",
            "how many",
            "which",
            "things",
            "does",
            "it",
            "require",
            "how",
            "what is",
            "how many",
            "kindly",
            "please",
            "can you",
            "requirements",
            "i",
            "want",
            "to",
            "know",
            "the",
            "recipe",
            "assistant",
            "hello",
            "ai",
          ]);
          const recipe = findRecipeByName(dish);
          if (recipe) {
            speak(
              `Ingredients for ${recipe.name}: ${recipe.ingredients.join(", ")}`
            );
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 12. Serving size for recipe number
        if (/servings.*recipe number/.test(command) && numberMatch) {
          const recipe = findRecipeByNumber(numberMatch[1]);
          if (recipe) {
            speak(`${recipe.name} serves: ${recipe.servingsize}`);
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 13. Serving size for dish name
        if (/how many.*(serve|people)|servings.*(for|of)/.test(command)) {
          const dish = getCleanName(command, [
            "servings",
            "for",
            "of",
            "how many",
            "people",
            "does",
            "can",
            "be",
            "served",
            "serve",
            "please",
            "kindly",
            "tell me",
            "eat",
            "this",
            "recipe",
            "how much",
            "persons",
            "person",
            "it",
            "can you",
            "tell",
            "the",
            "me",
            "serve",
            "to",
            "assistant",
            "hello",
            "ai",
          ]);
          const recipe = findRecipeByName(dish);
          if (recipe) {
            speak(`${recipe.name} serves: ${recipe.servingsize}`);
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 14. Category for recipe number
        if (/category.*recipe number/.test(command) && numberMatch) {
          const recipe = findRecipeByNumber(numberMatch[1]);
          if (recipe) {
            speak(
              `${recipe.name} falls under the ${recipe.category} category.`
            );
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 15. Category for dish name
        if (/what.*category.*(for|of|in|is)/.test(command)) {
          const dish = getCleanName(command, [
            "category",
            "for",
            "of",
            "what",
            "tell me",
            "is",
            "in",
            "please",
            "can you",
            "kindly",
            "which",
            "does",
            "it",
            "this",
            "fall",
            "recipe",
            "let me",
            "know",
            "the",
            "assistant",
            "hello",
            "ai",
          ]);
          const recipe = findRecipeByName(dish);
          if (recipe) {
            speak(
              `${recipe.name} falls under the ${recipe.category} category.`
            );
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 16. Description for recipe number
        if (/description.*recipe number/.test(command) && numberMatch) {
          const recipe = findRecipeByNumber(numberMatch[1]);
          if (recipe) {
            speak(`${recipe.name}: ${recipe.description}`);
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // 17. Description for dish name
        if (/tell me about|description.*(for|of)/.test(command)) {
          const dish = getCleanName(command, [
            "tell me about",
            "description",
            "for",
            "of",
            "describe",
            "recipe",
            "what",
            "is",
            "the",
            "recipe",
            "kindly",
            "please",
            "can you",
            "tell me",
            "let",
            "know",
            "me",
            "read",
            "assistant",
            "hello",
            "ai",
          ]);
          const recipe = findRecipeByName(dish);
          if (recipe) {
            speak(`${recipe.name}: ${recipe.description}`);
          } else {
            speak("Recipe not found.");
          }
          return;
        }

        // Existing Commands (unchanged)
        if (
          /(show|search|find|look for|recipe for)/.test(command) ||
          (recipeByName &&
            !command.includes("open") &&
            !command.includes("add") &&
            !command.includes("remove"))
        ) {
          if (!cleaned || cleaned.trim().length === 0 || cleaned === "recipe") {
            alert("❌ No recipe name was provided. Please try again.");
            speak(
              "I didn't catch any recipe name. Please say the recipe clearly."
            );
            return;
          }

          navigate(`/recipes?q=${encodeURIComponent(cleaned)}&from=voice`);
          dispatch(setQuery(cleaned));
          localStorage.setItem("lastQuery", cleaned); // ✅ persist it

          setLoading(true);
          const res = await fetch(`${import.meta.env.VITE_API_BASE}/recipes`);
          const data = await res.json();
          const filtered = data.recipes.filter(
            (r) =>
              r.name.toLowerCase().includes(cleaned) ||
              (r.category && r.category.toLowerCase().includes(cleaned))
          );

          dispatch(addInitialItems(filtered));
        } else if (command.includes("open")) {
          const name = cleanQuery(command.replace(/open|recipe|by|name/g, ""));
          const recipe = numberMatch
            ? findRecipeByNumber(numberMatch[1])
            : findRecipeByName(name);

          if (recipe) {
            const formattedName = recipe.name
              .toLowerCase()
              .replace(/\s+/g, "-");
            navigate(`/recipe/${formattedName}`, {
              state: { spokenName: recipe.name },
            });
          } else {
            speak("Recipe not found.");
          }
        } else if (
          command.includes("add") &&
          /(to|into|in) favorites/.test(command)
        ) {
          const name = cleanQuery(
            command.replace(/add|recipe|to|into|in|favorites/g, "")
          );
          const recipe = numberMatch
            ? findRecipeByNumber(numberMatch[1])
            : findRecipeByName(name);

          recipe
            ? (dispatch(favoritesActions.addToFavorite(recipe.id)),
              speak(`${recipe.name} added to favorites.`))
            : speak("Recipe not found.");
        } else if (
          command.includes("remove") &&
          command.includes("from favorites")
        ) {
          const name = cleanQuery(
            command.replace(/remove|recipe|from|favorites/g, "")
          );
          const recipe = numberMatch
            ? findRecipeByNumber(numberMatch[1])
            : findRecipeByName(name);

          recipe
            ? (dispatch(favoritesActions.removeFromFavorite(recipe.id)),
              speak(`${recipe.name} removed from favorites.`))
            : speak("Recipe not found.");
        } else {
          speak("Sorry, command not recognized.");
        }
      } catch (error) {
        console.error("Voice command error:", error);
        speak("Something went wrong while processing the command.");
      } finally {
        recognition.stop();
        setCommandListening(false);
        setLoading(false);
      }
    };

    recognition.onerror = () => {
      recognition.stop();
      setCommandListening(false);
      alert("❌ Could not understand the voice command.");
    };
  };

  const handleDishNameVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      const cleaned = cleanQuery(voiceInput);

      if (!cleaned || cleaned.trim() === "") {
        alert("❌ No recipe name was provided. Please try again.");
        speak("I didn't catch any recipe name. Please say the recipe clearly.");
        setListening(false);
        recognition.stop();
        return;
      }

      // ✅ Let URL trigger the useEffect to fetch & dispatch
      navigate(`/recipes?q=${encodeURIComponent(cleaned)}&from=voice`);
      dispatch(setQuery(cleaned)); // Update Redux query for immediate UI use

      setListening(false);
      recognition.stop();
    };

    recognition.onerror = () => {
      alert("❌ Could not understand the dish name.");
      setListening(false);
    };
  };

  return (
    <>
      <section id={styles.recipesInner} className="clearfix">
        <div className={`${styles.recipesInner1} clearfix`}>
          <div className="container">
            <div className="row">
              <div className={styles.topHead}>
                <h1 className="text-center">🍲 Explore Recipes</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id={styles.recipes}
        style={{
          backgroundImage: "url('/img/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          padding: "60px 0",
        }}
      >
        {" "}
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className={`${styles.recipesMain} clearfix`}>
                <div className="text-center mt-4 mb-4 d-flex flex-column align-items-center gap-3">
                  {/* ✅ Grouped Buttons */}
                  <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
                    {listening ? (
                      <p className={styles.listening}>
                        🎧 Listening for dish name...
                      </p>
                    ) : (
                      <button
                        onClick={handleDishNameVoiceInput}
                        className="btn btn-primary"
                      >
                        🎤 Speak a Dish Name
                      </button>
                    )}

                    {commandListening ? (
                      <p className={styles.listening}>
                        🎧 Listening for command...
                      </p>
                    ) : (
                      <div
                        className="position-relative"
                        onMouseEnter={() => setShowCommands(true)}
                        onMouseLeave={() => setShowCommands(false)}
                      >
                        <button
                          onClick={handleVoiceCommand}
                          className="btn btn-secondary"
                        >
                          🧠 Give Voice Command
                        </button>

                        {/* Command Tooltip */}
                        {showCommands && (
                          <div
                            style={{
                              position: "absolute",
                              top: "110%",
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: "#eef6ff",
                              border: "1px solid #007bff",
                              padding: "1rem",
                              borderRadius: "8px",
                              width: "400px",
                              margin: "1rem",
                              textAlign: "left",
                              zIndex: 10,
                              fontSize: "14px",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: "-8px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 0,
                                height: 0,
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderBottom: "8px solid #007bff",
                              }}
                            ></div>

                            <h5>🗣️ Try saying:</h5>
                            <ul
                              style={{ lineHeight: "1.6", paddingLeft: "1rem" }}
                            >
                              <li>“Go back to homepage”</li>
                              <li>“Open favorites”</li>
                              <li>“Show me recipes for Chicken”</li>
                              <li>“Open recipe number 2”</li>
                              <li>“Add recipe number 3 to favorites”</li>
                              <li>“Remove recipe number 3 from favorites”</li>
                              <li>
                                “What are the ingredients for recipe number 2?”
                              </li>
                              <li>“Tell me calories for recipe number 2”</li>
                              <li>“Read instructions for recipe number 2”</li>
                              <li>“Read description for recipe number 5”</li>
                              <li>
                                “What is cooking time for recipe number 1?”
                              </li>
                              <li>“How many servings for recipe number 2?”</li>
                              <li>“What category is recipe number 1 in?”</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stop Speaking Button */}
                  {isSpeaking && (
                    <div
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "20px",
                        transform: "translateY(-50%)",
                        zIndex: 9999,
                      }}
                    >
                      <button
                        onClick={stopSpeaking}
                        className="btn btn-danger d-flex align-items-center gap-2 shadow rounded-pill px-3 py-2"
                        style={{ fontSize: "16px" }}
                        title="Stop Speaking"
                      >
                        <span style={{ fontSize: "20px" }}>🛑</span>
                        <span>Stop Speaking</span>
                      </button>
                    </div>
                  )}
                </div>

                <ViewAllRecipesButton />

                <ManualSearchBar />

                {query && recipes.length > 0 && (
                  <h1 ref={headingRef} className="mt-5">
                    Recipes for: <span className="text-primary">{query}</span>
                  </h1>
                )}

                {loading ? (
                  <Spinner />
                ) : recipes.length > 0 ? (
                  <div className={styles.recipeGrid}>
                    {recipes.map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                ) : query ? (
                  <p>No recipes found. Try another dish.</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Recipes;
