import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { IoMdPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { timerActions } from "../store/timerSlice";
import { useNavigate, useLocation } from "react-router-dom";
import slugify from "slugify";

const RecipeTimer = forwardRef(
  ({ minutes, onTimerEnd, recipeName, recipeImage, showName }, ref) => {
    const [justReset, setJustReset] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const activeTimer = useSelector((state) => state.timer.activeTimer);

    const slug = slugify(recipeName, { lower: true });
    const isThisTheActiveRecipe = activeTimer?.recipeSlug === slug;

    // ✅ FIXED: Use activeTimer data directly, no complex hydration logic
    const [timeLeft, setTimeLeft] = useState(
      activeTimer?.remainingTime || minutes * 60
    );
    const [hasEnded, setHasEnded] = useState(false);
    const [isRunningState, setIsRunningState] = useState(
      activeTimer?.isRunning || false
    );
    const [hasStarted, setHasStarted] = useState(
      activeTimer?.hasStarted || false
    );
    const [showButtons, setShowButtons] = useState(
      activeTimer?.showButtons || false
    );

    const buzzerRefs = useRef([]);
    const startTimeRef = useRef(activeTimer?.startTime || null);

    const isRunningRef = useRef(isRunningState);

    useEffect(() => {
      isRunningRef.current = isRunningState;
    }, [isRunningState]);

    const isOnOriginalRecipePage = recipeName
      ? location.pathname === `/recipe/${slugify(recipeName, { lower: true })}`
      : false;

    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    };

    // ✅ FIXED: Simple sync with activeTimer
    useEffect(() => {
      if (isThisTheActiveRecipe && activeTimer) {
        setTimeLeft(activeTimer.remainingTime);
        setIsRunningState(activeTimer.isRunning);
        setHasStarted(
          activeTimer.hasStarted || activeTimer.remainingTime < minutes * 60
        );
        setShowButtons(
          activeTimer.showButtons ||
            (activeTimer.hasStarted && !activeTimer.wasResetManually)
        );
        startTimeRef.current = activeTimer.startTime;
        setHydrated(true);
      } else if (!activeTimer) {
        // Reset to initial state if no active timer
        setTimeLeft(minutes * 60);
        setIsRunningState(false);
        setHasStarted(false);
        setShowButtons(false);
        startTimeRef.current = null;
        setHydrated(true);
      }
    }, [activeTimer, isThisTheActiveRecipe, minutes]);

    useImperativeHandle(ref, () => ({
      startTimerExternally: ({ recipeName: name, recipeImage: image }) => {
        if (!isRunningState && !hasStarted) {
          const slug = slugify(name, { lower: true });
          const originalDuration = minutes; // ✅ FIXED: Use the correct original duration

          const timerData = {
            remainingTime: minutes * 60,
            isRunning: true,
            startTime: Date.now(),
            recipeName: name,
            recipeImage: image,
            recipeSlug: slug,
            hasStarted: true,
            showButtons: true,
            wasResetManually: false,
            originalDuration: originalDuration, // ✅ FIXED: Store original duration correctly
          };

          saveTimerState(timerData);
          setIsRunningState(true);
          setShowButtons(true);
          setHasStarted(true);
          setHasEnded(false);
          startTimeRef.current = Date.now();
        }
      },

      pauseTimerExternally: () => {
        const timerData = {
          ...activeTimer,
          isRunning: false,
          startTime: null,
        };
        saveTimerState(timerData);
        setIsRunningState(false);
      },

      resumeTimerExternally: () => {
        const timerData = {
          ...activeTimer,
          isRunning: true,
          startTime: Date.now(),
        };
        saveTimerState(timerData);
        setIsRunningState(true);
        startTimeRef.current = Date.now();
      },

      resetTimerExternally: () => {
        stopAllBuzzers();
        const originalDuration = activeTimer?.originalDuration || minutes;

        const timerData = {
          remainingTime: originalDuration * 60, // ✅ FIXED: Use correct original duration
          isRunning: false,
          startTime: null,
          recipeName,
          recipeImage,
          recipeSlug: slug,
          hasStarted: false,
          showButtons: false,
          wasResetManually: true,
          originalDuration: originalDuration,
        };

        saveTimerState(timerData);
        setIsRunningState(false);
        setHasEnded(false);
        setTimeLeft(originalDuration * 60);
        setShowButtons(false);
        setHasStarted(false);
        setJustReset(true);
        startTimeRef.current = null;

        setTimeout(() => setJustReset(false), 100);
        speak("Timer reset.");
      },
    }));

    const saveTimerState = (data) => {
      localStorage.setItem("recipeTimerState", JSON.stringify(data));
      dispatch(timerActions.setActiveTimer(data));
    };

    // ✅ FIXED: Simple countdown logic
    useEffect(() => {
      let timer;
      if (isRunningState && !hasEnded && hydrated) {
        timer = setInterval(() => {
          setTimeLeft((prev) => {
            const next = prev - 1;

            // Update storage every second
            if (activeTimer) {
              const updatedData = {
                ...activeTimer,
                remainingTime: next,
                startTime: startTimeRef.current,
              };
              saveTimerState(updatedData);
            }

            if (next <= 0) {
              setHasEnded(true);
              setIsRunningState(false);
              return 0;
            }
            return next;
          });
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [isRunningState, hasEnded, hydrated, activeTimer]);

    useEffect(() => {
      if (!hasEnded) return;

      buzzerRefs.current = [];
      let count = 0;
      const playNext = () => {
        if (count >= 10) return;
        const buzzer = new Audio("/sounds/buzzer.mp3");
        buzzerRefs.current.push(buzzer);
        buzzer.play();
        count++;
        buzzer.onended = playNext;
      };
      playNext();
      onTimerEnd?.();
    }, [hasEnded, onTimerEnd]);

    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    };

    const handleStart = () => {
      if (hasStarted) return;

      speak(`Starting a timer for ${minutes} minutes`);

      const originalDuration = minutes;
      const timerData = {
        remainingTime: timeLeft,
        isRunning: true,
        startTime: Date.now(),
        recipeName,
        recipeImage,
        recipeSlug: slug,
        hasStarted: true,
        showButtons: true,
        wasResetManually: false,
        originalDuration: originalDuration,
      };

      saveTimerState(timerData);
      setIsRunningState(true);
      setShowButtons(true);
      setHasStarted(true);
      startTimeRef.current = Date.now();
    };

    const stopAllBuzzers = () => {
      buzzerRefs.current.forEach((buzzer) => {
        buzzer.pause();
        buzzer.currentTime = 0;
      });
      buzzerRefs.current = [];
    };

    const handlePause = () => {
      const timerData = {
        ...activeTimer,
        isRunning: false,
        startTime: null,
        remainingTime: timeLeft,
      };
      saveTimerState(timerData);
      setIsRunningState(false);
      speak("Timer paused.");
    };

    const handleResume = () => {
      const timerData = {
        ...activeTimer,
        isRunning: true,
        startTime: Date.now(),
        remainingTime: timeLeft,
      };
      saveTimerState(timerData);
      setIsRunningState(true);
      startTimeRef.current = Date.now();
      speak("Resuming timer.");
    };

    const handleReset = () => {
      stopAllBuzzers();

      const originalDuration = activeTimer?.originalDuration || minutes;
      const resetTime = originalDuration * 60; // ✅ FIXED: Use correct original duration

      const timerData = {
        remainingTime: resetTime,
        isRunning: false,
        startTime: null,
        recipeName,
        recipeImage,
        recipeSlug: slug,
        hasStarted: false,
        showButtons: false,
        wasResetManually: true,
        originalDuration: originalDuration,
      };

      saveTimerState(timerData);
      setIsRunningState(false);
      setHasEnded(false);
      setHasStarted(false);
      setTimeLeft(resetTime);
      setShowButtons(false);
      setJustReset(true);
      startTimeRef.current = null;

      setTimeout(() => setJustReset(false), 100);
      speak("Timer reset.");
    };

    const displayName = activeTimer?.recipeName ?? recipeName;
    const displayImage = activeTimer?.recipeImage ?? recipeImage;

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (
          (e.code === "Space" || e.key === " " || e.key === "Spacebar") &&
          hasStarted &&
          hydrated &&
          !hasEnded
        ) {
          e.preventDefault();
          if (isRunningRef.current) {
            handlePause();
          } else {
            handleResume();
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [hasStarted, hydrated, hasEnded, handlePause, handleResume]);

    // Don't render until hydrated
    if (!hydrated) return null;

    return (
      <div
        className="position-fixed d-flex flex-column justify-content-center align-items-center"
        style={{
          top: "100px",
          right: "20px",
          width: "180px",
          height: "180px",
          backgroundColor: "#d1ecf1",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          zIndex: 9999,
          textAlign: "center",
          padding: "10px",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => {
          const formattedName = recipeName?.toLowerCase().replace(/\s+/g, "-");
          if (formattedName) {
            navigate(`/recipe/${formattedName}`);
          }
          if (!hasStarted && !justReset) {
            handleStart();
          }
          if (justReset) {
            setJustReset(false);
          }
        }}
      >
        {showName && displayName && (
          <div
            className="d-flex flex-column align-items-center"
            style={{ marginBottom: "4px" }}
          >
            {displayImage && (
              <img
                src={displayImage}
                alt={displayName}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            )}
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "black",
                marginTop: "4px",
                maxWidth: "140px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={displayName}
            >
              {displayName}
            </div>
          </div>
        )}
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          {formatTime(timeLeft)}
        </div>
        {!isOnOriginalRecipePage && (
          <button
            className="btn btn-sm btn-outline-danger position-absolute"
            style={{
              top: "0px",
              right: "25px",
              zIndex: 10000,
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              padding: "0",
              fontSize: "14px",
              lineHeight: "1",
            }}
            onClick={(e) => {
              e.stopPropagation();
              const confirmDelete = window.confirm(
                "Are you sure you want to close and remove this timer?"
              );
              if (confirmDelete) {
                localStorage.removeItem("recipeTimerState");
                dispatch(timerActions.clearActiveTimer());
              }
            }}
          >
            ✖
          </button>
        )}
        {!hasStarted && !justReset && (
          <small style={{ fontSize: "12px", color: "#007bff" }}>
            Click to start timer
          </small>
        )}
        {hasStarted && showButtons && !hasEnded && !justReset && (
          <div
            className="mt-2 d-flex flex-column gap-1 w-100"
            style={{
              position: "relative",
              zIndex: 10000,
            }}
          >
            {isRunningState ? (
              <button
                className="btn btn-sm btn-primary w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePause();
                }}
              >
                <IoMdPause className="me-1" />
              </button>
            ) : (
              <button
                className="btn btn-sm btn-success w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResume();
                }}
              >
                <FaPlay className="me-1" />
              </button>
            )}
            <button
              className="btn btn-sm btn-danger w-100"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
            >
              <RiResetLeftFill className="me-1" />
            </button>
          </div>
        )}
        {hasEnded && (
          <div className="mt-2 w-100">
            <button
              className="btn btn-sm btn-danger w-100"
              onClick={handleReset}
            >
              <RiResetLeftFill className="me-1" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default RecipeTimer;
