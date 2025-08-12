import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popularActions } from "../store/popularSlice";
import { fetchPopStatusActions } from "../store/fetchPopStatusSlice";

const FetchPopular = () => {
  const fetchPopularStatus = useSelector((store) => store.fetchPopularStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchPopularStatus.fetchDone) return;

    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(fetchPopStatusActions.markFetchingStarted());

    fetch("http://localhost:8080/popular", { signal })
      .then((res) => res.json())
      .then((data) => {
        dispatch(fetchPopStatusActions.markFetchDone());
        dispatch(fetchPopStatusActions.markFetchingFinished());
        dispatch(popularActions.addInitialItems(data.popular));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch popular recipes:", err);
        }
      });

    return () => controller.abort();
  }, [fetchPopularStatus, dispatch]);

  return null;
};

export default FetchPopular;
