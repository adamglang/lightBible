import React from "react";
import Fetch from "react-fetch-component";
import {PropagateLoader} from 'react-spinners';
import Chapter from "./Chapter";
import ChapterController from "./ChapterController";


const Reader = ({
  chapterURL,
  setStrongsURL,
  chapterListValue,
  handleBookListChange,
  handleChapterListChange,
}) => (


  <Fetch url={chapterURL}>
    {
      ({loading, error, data}) => (
        <section id={"readerWrapper"}>
          {error && console.error(`Could not fetch from ${chapterURL}. Got ${error.stack}`)}

          {loading && (
            <div className={"spinLoader"}>
                <PropagateLoader color={"#333333"} className={"loader"}/>
            </div>
          )}

          {data && (
            <div id={"Reader"}>
              <ChapterController
                chapterListValue={chapterListValue}
                handleBookListChange={handleBookListChange}
                handleChapterListChange={handleChapterListChange}
                directionToMove={-1}
                className={"icon-chevron-left"}
              />
              <Chapter
                {...data}
                setStrongsURL={setStrongsURL}
                handleBookListChange={handleBookListChange}
                handleChapterListChange={handleChapterListChange}
              />
              <ChapterController
                chapterListValue={chapterListValue}
                handleBookListChange={handleBookListChange}
                handleChapterListChange={handleChapterListChange}
                directionToMove={1}
                className={"icon-chevron-right"}
              />
            </div>
          )}
        </section>
      )
    }
  </Fetch>

);

export default Reader;