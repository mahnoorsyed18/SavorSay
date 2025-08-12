import { useSelector } from "react-redux";
import css from "../css/Popular.module.css";
import EachPopular from "./EachPopular";
import Spinner from "./Spinner";

const Popular = () => {
  const popular = useSelector((store) => store.popular);

  return (
    <main>
      <div className={`card ${css.popularHeader}`}>
        <div className="card-body">
          <h5 className="card-title">
            <p className={css.heading}>Our Popular Recipes</p>
          </h5>
        </div>
      </div>
      <div className={css.container}>
        {Array.isArray(popular) && popular.length > 0 ? (
          popular.map((pop) => <EachPopular key={pop.id} pop={pop} />)
        ) : (
          <Spinner />
        )}
      </div>
    </main>
  );
};

export default Popular;
