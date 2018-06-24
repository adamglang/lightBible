import React from "react";

const Text = ({text, setStrongsURL}) => (
  text.map(({text, strongsNumber, strongsLanguage} ,idx) =>
    <span
      key={idx}
      className={"strongsReference"}
      onClick={() => setStrongsURL(strongsLanguage, strongsNumber)}
    >
      {`${text}\u00A0`}
    </span>
  )
);

export default Text;