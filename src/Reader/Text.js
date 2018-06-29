import React from "react";

const Text = ({text, setStrongsURL}) => (
  text.map(({text, redText, strongsNumber, strongsLanguage} ,idx) => {
    const textClass = redText ? "strongsReference redText" : "strongsReference";

    return <span
      key={idx}
      className={textClass}
      onClick={() => setStrongsURL(strongsLanguage, strongsNumber)}
    >
      {`${text} `}
    </span>
  }
));

export default Text;