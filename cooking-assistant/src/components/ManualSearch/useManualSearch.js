import { useNavigate } from "react-router-dom";

const cleanQuery = (query) => query.trim().toLowerCase();

const useManualSearch = () => {
  const navigate = useNavigate();

  const handleManualSearch = (rawQuery) => {
    const cleaned = cleanQuery(rawQuery);
    if (cleaned) {
      navigate(`/recipes?q=${encodeURIComponent(cleaned)}&from=manual`);
    }
  };

  return { handleManualSearch };
};

export default useManualSearch;
