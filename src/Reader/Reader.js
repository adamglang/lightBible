import React from "react";
import Fetch from "react-fetch-component";
import Chapter from "./Chapter";

const Reader = ({chapterURL, setStrongsURL}) => (
  <section id={"Reader"}>
    <Fetch url={chapterURL}>
      {
        ({loading, error, data}) => (
          <div>
            {loading && <div>Loading...</div>}
            {error && console.error(`Could not fetch from ${chapterURL}. Got ${error.stack}`)}
            {data && (<Chapter {...data} setStrongsURL={setStrongsURL}/>)}
          </div>
        )
      }
    </Fetch>
  </section>
);

export default Reader;