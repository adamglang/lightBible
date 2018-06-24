import React from "react";
import Verses from "./Verses"

const Passages = ({passages, setStrongsURL}) => (
  passages.map(({title, verses}, idx) =>
    <div className={"passage"} key={idx}>
      <header>
        <h4>{title}</h4>
      </header>
      <Verses verses={verses} setStrongsURL={setStrongsURL}/>
    </div>)
);

export default Passages;