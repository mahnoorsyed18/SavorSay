import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInitialItems } from "../store/recipesSlice";
import { fetchRecStatusActions } from "../store/fetchRecStatusSlice";

const FetchRecipes = () => {
  const fetchRecStatus = useSelector((store) => store.fetchRecipeStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchRecStatus.fetchDone) return;

    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(fetchRecStatusActions.markFetchingStarted());

    fetch(`${import.meta.env.VITE_API_BASE}/recipes`, { signal })
      .then((res) => res.json())
      .then((data) => {
        dispatch(fetchRecStatusActions.markFetchDone());
        dispatch(fetchRecStatusActions.markFetchingFinished());
        dispatch(addInitialItems(data.recipes));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch recipes:", err);
        }
      });

    return () => controller.abort();
  }, [fetchRecStatus, dispatch]);

  return null;
};

export default FetchRecipes;
