import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { favoritesActions } from "../store/favoritesSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "../css/RecipeCard.module.css";

const EachPopular = ({ pop }) => {
  if (!pop || !pop.name) return null;

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const isFav = favorites.includes(pop.id); // ✅ FIXED: compare IDs

  const handleToggleFavorite = () => {
    dispatch(favoritesActions.toggleFavorite(pop.id)); // ✅ pass only ID now
  };

  const formattedName = pop?.name
    ? pop.name.toLowerCase().replace(/\s+/g, "-")
    : "unknown";

  return (
    <div className={`card ${styles.card}`}>
      <img src={pop.images} className="card-img-top" alt={pop.name} />
      <div className="card-body">
        <h5 className="card-title">{pop.name}</h5>
        <Link
          to={`/popular/${formattedName}`}
          className="btn btn-primary btn-sm"
        >
          View Details
        </Link>
        <button
          className="btn btn-link float-end"
          onClick={handleToggleFavorite}
        >
          {isFav ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
};

export default EachPopular;
