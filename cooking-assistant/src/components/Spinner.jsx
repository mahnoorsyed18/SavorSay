import React from "react";
import styles from "../css/Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.loader}></div>
      <p>Loading...</p>
    </div>
  );
};

export default Spinner;
