import React from "react";
import styles from "./Footer.module.css"; // Import CSS module for styling

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>Midlertidig Footer - virker den?</p>
        <p>Logo? Copyright? Names? Emails?</p>
      </div>
    </footer>
  );
};

export default Footer;
