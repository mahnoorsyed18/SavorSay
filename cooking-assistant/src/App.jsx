import { Outlet, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect } from "react";
import RecipeTimer from "./components/RecipeTimer";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { timerActions } from "./store/timerSlice";
import Spinner from "./components/Spinner";

const App = () => {
  const location = useLocation();
  const fetchRecipeStatus = useSelector((store) => store.fetchRecipeStatus);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    if (!fetchRecipeStatus.currentlyFetching) {
      window.scrollTo(0, 0);
    }
  }, [fetchRecipeStatus.currentlyFetching]);

  const timerRef = useRef();
  const dispatch = useDispatch();

  // ✅ FIXED: Simplified rehydration logic
  useEffect(() => {
    const saved = localStorage.getItem("recipeTimerState");
    if (saved) {
      const parsed = JSON.parse(saved);

      // ❌ Don't modify remainingTime here
      // ✅ Let RecipeTimer handle time passing using startTime

      dispatch(timerActions.setActiveTimer(parsed));
    }
  }, [dispatch]);

  const activeTimer = useSelector((state) => state.timer.activeTimer);

  return (
    <>
      <Header />
      {fetchRecipeStatus.currentlyFetching ? <Spinner /> : <Outlet />}
      {activeTimer && (
        <RecipeTimer
          ref={timerRef}
          minutes={
            activeTimer.originalDuration ||
            Math.ceil(activeTimer.remainingTime / 60)
          }
          onTimerEnd={() => {}}
          recipeName={activeTimer.recipeName}
          recipeImage={activeTimer.recipeImage}
          isRunning={activeTimer.isRunning}
          showName={true}
        />
      )}
      <Footer />
    </>
  );
};

export default App;
