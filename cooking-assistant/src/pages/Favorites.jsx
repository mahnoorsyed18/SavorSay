import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { favoritesActions } from "../store/favoritesSlice";
import Spinner from "../components/Spinner";
import css from "../css/Favorites.module.css";

const Favorites = () => {
  useEffect(() => {
    // Cleanup function to cancel speech when navigating away from this page
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const favoriteIds = useSelector((state) => state.favorites);
  const allRecipes = useSelector((state) => state.recipes.items);
  const popularRecipes = useSelector((state) => state.popular);
  const dispatch = useDispatch();

  const combinedRecipes = [...(allRecipes || []), ...(popularRecipes || [])];

  const favoriteRecipes = combinedRecipes.filter((recipe) =>
    favoriteIds.includes(recipe.id)
  );

  const handleRemove = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this recipe from favorites?"
    );
    if (confirm) {
      dispatch(favoritesActions.removeFromFavorite(id));
    }
  };

  return (
    <>
      <section id={css.favoritesSection} className="clearfix">
        <div className={css.favoritesContent}>
          <div className="container">
            <div className="row">
              <div className="topHead">
                <h1 className="text-center">FAVORITES</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={css.favWrapper}>
        {!Array.isArray(allRecipes) || allRecipes.length === 0 ? (
          <Spinner />
        ) : favoriteRecipes.length > 0 ? (
          <div className={css.fav}>
            {favoriteRecipes.map((recipe) => (
              <div key={recipe.id} className={css.recipeCard}>
                <img
                  src={recipe.image || recipe.images}
                  alt={recipe.title || recipe.name}
                  className={css.recipeImage}
                />
                <h4>{recipe.title || recipe.name}</h4>
                <Link
                  to={`/recipe/${
                    recipe.name
                      ? recipe.name.toLowerCase().replace(/\s+/g, "-")
                      : "unknown"
                  }`}
                >
                  View Details
                </Link>
                <br />
                <button
                  onClick={() => handleRemove(recipe.id)}
                  className={css.removeButton}
                >
                  Remove ❌
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={css.emptyMessage}>No favorites yet.</p>
        )}
      </div>
    </>
  );
};

export default Favorites;
