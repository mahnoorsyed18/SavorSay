import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../../css/ManualSearch.module.css";
import useManualSearch from "./useManualSearch";

const ManualSearchBar = () => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const { handleManualSearch } = useManualSearch();

  const toggleVisibility = () => setVisible(!visible);

  const onSubmit = (e) => {
    e.preventDefault();
    handleManualSearch(query);
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.toggle} onClick={toggleVisibility}>
        👁 Manual Search
      </span>

      {visible && (
        <form onSubmit={onSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            <FaSearch />
          </button>
        </form>
      )}
    </div>
  );
};

export default ManualSearchBar;
