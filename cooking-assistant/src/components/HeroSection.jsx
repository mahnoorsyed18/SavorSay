import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setQuery, addInitialItems } from "../store/recipesSlice";
import { useNavigate } from "react-router-dom";
import css from "../css/HeroSection.module.css";

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

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

  const handleVoiceSearch = () => {
    stopSpeaking();
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript.toLowerCase().trim();
      const cleaned = cleanQuery(voiceText);

      // Check if dish name is empty
      if (!cleaned || cleaned.trim() === "") {
        alert("❌ No recipe name was provided. Please try again.");
        speak("I didn't catch any recipe name. Please say the recipe clearly.");
        setListening(false);
        return;
      }

      dispatch(setQuery(""));
      dispatch(addInitialItems([]));

      navigate(`/recipes?q=${encodeURIComponent(cleaned)}&from=voice`);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      alert("Could not understand. Please try again.");
    };
  };

  useEffect(() => {
    const speakWelcome = () => {
      const text =
        "Welcome to Cooking Assistant. Press the speak dish name button to search recipes.";
      const utter = new SpeechSynthesisUtterance(text);
      utter.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      speechSynthesis.speak(utter);
    };

    const handleFirstClick = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const interactiveTags = [
        "button",
        "input",
        "svg",
        "path",
        "a",
        "i",
        "span",
        "p",
        "label",
      ];

      if (
        interactiveTags.includes(tag) ||
        e.target.closest("a") ||
        e.target.closest("button") ||
        e.target.closest("[data-ignore-welcome='true']")
      ) {
        return;
      }

      if (
        tag === "img" &&
        (e.target.closest("a") || e.target.closest("button"))
      ) {
        return;
      }

      setShowPopup(false);

      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => speakWelcome();
      } else {
        speakWelcome();
      }

      document.removeEventListener("click", handleFirstClick);
    };

    document.addEventListener("click", handleFirstClick);

    // ✅ This part stops the speech if you change page
    return () => {
      window.speechSynthesis.cancel(); // 🔇 Stop talking
      setIsSpeaking(false); // update state
      document.removeEventListener("click", handleFirstClick); // cleanup
    };
  }, []);

  return (
    <section id={css.center} className="clearfix">
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "60px", // Adjust this if your header height is different
            left: 0,
            right: 0,
            backgroundColor: "#fffae6",
            padding: "0.7rem 0",
            zIndex: 999,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div className={css.scrollingWrapper}>
            <div className={css.scrollingContent}>
              👋 Tap anywhere to activate the assistant.
              &nbsp;&nbsp;&nbsp;&nbsp; 👋 Tap anywhere to activate the
              assistant. &nbsp;&nbsp;&nbsp;&nbsp; 👋 Tap anywhere to activate
              the assistant. &nbsp;&nbsp;&nbsp;&nbsp; 👋 Tap anywhere to
              activate the assistant. &nbsp;&nbsp;&nbsp;&nbsp; 👋 Tap anywhere
              to activate the assistant. &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div className={css.scrollingContent}>
              👋 Tap anywhere to activate the assistant.
              &nbsp;&nbsp;&nbsp;&nbsp; 👋 Tap anywhere to activate the
              assistant. &nbsp;&nbsp;&nbsp;&nbsp; 👋 Tap anywhere to activate
              the assistant. &nbsp;&nbsp;&nbsp;&nbsp; 👋 Tap anywhere to
              activate the assistant. &nbsp;&nbsp;&nbsp;&nbsp; 👋 Tap anywhere
              to activate the assistant. &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </div>
      )}

      <div className={`${css.centerMain} clearfix`}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className={css.center1}>
                <h1 className="text-center">🍽️ From Mic to Meal</h1>
                <p className="text-center" style={{ fontSize: "19px" }}>
                  Tap below and speak a dish name to get started!
                </p>
              </div>

              <div className="text-center mt-4">
                {listening ? (
                  <p style={{ fontWeight: "bold", color: "#007bff" }}>
                    🎙️ Listening for dish name...
                  </p>
                ) : (
                  <div className={css.center2}>
                    <button
                      onClick={handleVoiceSearch}
                      className="text-center"
                      data-ignore-welcome="true"
                    >
                      🎤 Speak a Dish Name
                    </button>
                  </div>
                )}
                {isSpeaking && (
                  <div className={`${css.stopButtonFixed} mt-2`}>
                    <button
                      onClick={stopSpeaking}
                      className={`${css.stopButtonCircle} btn btn-danger`}
                      data-ignore-welcome="true"
                    >
                      <span className={css.stopIcon}>🛑</span>
                      <span className={css.stopText}>Stop</span>{" "}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
