import React from "react";
import Passages from "./Passages"

const Chapter = ({
  title,
  passages,
  setStrongsURL
}) => (
  <section id={"Chapter"}>
    <header>
      <h2>{title}</h2>
    </header>
    <Passages passages={passages} setStrongsURL={setStrongsURL} />
  </section>
);

export default Chapter;