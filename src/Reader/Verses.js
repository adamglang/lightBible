import React from "react";
import Text from "./Text"

const Verses = ({verses, setStrongsURL}) => (
  verses.map(({verseNumber, text}, idx) =>
    <span className={"verse"} key={idx}>
      <span className={"verseNumber"}>{`${verseNumber}.\u00A0`}</span>
      <Text text={text} setStrongsURL={setStrongsURL}/>
      <br/><br/>
    </span>
  )
);

export default Verses;