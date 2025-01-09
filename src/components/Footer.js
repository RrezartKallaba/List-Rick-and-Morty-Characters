import React from "react";

function Footer({ handleLanguageSwitch, activeLanguage }) {
  return (
    <footer className="p-2 text-center shadow">
      <button
        className={`btn me-2 ${
          activeLanguage === "en" ? "btn-primary text-white" : "btn-outline-light text-black"
        }`}
        onClick={() => handleLanguageSwitch("en")}
      >
        English
      </button>
      <button
        className={`btn ${
          activeLanguage === "de" ? "btn-primary text-white" : "btn-outline-light text-black"
        }`}
        onClick={() => handleLanguageSwitch("de")}
      >
        German
      </button>
    </footer>
  );
}

export default Footer;
