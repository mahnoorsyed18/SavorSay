import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./css/bootstrap.min.css"; // Import Bootstrap
import "./css/font-awesome.min.css"; // Import FontAwesome
import "./css/element.css"; // Other custom styles
import "./css/index.css"; // Your main stylesheet
import App from "./App";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import Recipes from "./pages/Recipes";
import Favorites from "./pages/Favorites";
import RecipeDetail from "./pages/RecipeDetail";
import recipesStore from "./store/index.js";
import About from "./pages/About.jsx";
import Popular from "./components/Popular.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/recipes",
        element: <Recipes />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/recipe/:name",
        element: <RecipeDetail />,
      },
      { path: "/popular/:name", element: <RecipeDetail /> },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/popular",
        element: <Popular />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={recipesStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
