import React from "react";

const ModalContent = (
    {
      strongsNumber,
      originalWord,
      biblicalOutline,
      setStrongsURL,
      strongsInfo: {
        pronuciation,
        definition
      }
    },
  ) => (
  <div>
    <section className={"modalContainer"}>
      <header>
        <span className={"originalWord"}>{originalWord}</span>
        <span className={"pronuciation"}>"{pronuciation}"</span>
      </header>
      <div className={"biblicalUsage"}><b>Biblical Usage</b>: {generateBiblicalUsage(biblicalOutline)}</div>
      <div><b>Strongs Definintions: </b>{definitionWithStrongsLinks(definition, setStrongsURL)}</div>
    </section>
  </div>
);

const definitionWithStrongsLinks = (definition, setStrongsURL) => {
  const wordsInDefinition = definition.split(" ");

  return wordsInDefinition.map((word, idx) => {
    let contentToReturn = `${word} `;
    const strongsNumber = parseInt(word.substring(1), 10);
    const isStrongsRefrence = (word[0] === "H" || word[0] === "G") && strongsNumber;

    if(isStrongsRefrence) {
      const strongsLanguage = word[0] === "H" ? "Hebrew" : "Greek";

      contentToReturn = <span
        key={idx}
        className={"strongsReference"}
        onClick={() => setStrongsURL(strongsLanguage, strongsNumber)}
      >
        {word }
      </span>;
    }

    return contentToReturn;
  });
};

const generateBiblicalUsage = (biblicalOutline, isLetter) => {
  const olType = isLetter ? "a" : "1";

  const list = Object.keys(biblicalOutline).map((key) => {
    const outlineItem = biblicalOutline[key];

    return <li>{outlineItem.text} {outlineItem.subList ? generateBiblicalUsage(outlineItem.subList, !isLetter) : ""}</li>
  });

  return <ol type={olType}>{list}</ol>;
};

export default ModalContent;