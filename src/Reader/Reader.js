import React from "react";
import Fetch from "react-fetch-component";
import {PropagateLoader} from 'react-spinners';
import Chapter from "./Chapter";

const Reader = ({chapterURL, setStrongsURL}) => (
  <section id={"Reader"}>
    <Fetch url={chapterURL}>
      {
        ({loading, error, data}) => (
          <div>
            {loading && <div className={"spinLoader"}><PropagateLoader color={"#333333"} className={"loader"}/></div>}
            {error && console.error(`Could not fetch from ${chapterURL}. Got ${error.stack}`)}
            {data && (<Chapter {...data} setStrongsURL={setStrongsURL}/>)}
          </div>
        )
      }
    </Fetch>
  </section>
);

export default Reader;