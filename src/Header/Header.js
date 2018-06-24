import React from "react";
import Selectors from "./Selectors/Selectors";

const Header = ({
  bookList,
  bookListValue,
  handleBookListChange,
  chapterList,
  chapterListValue,
  handleChapterListChange
}) => (
  <header>
    <Selectors
      bookList={bookList}
      bookListValue={bookListValue}
      handleBookListChange={handleBookListChange}
      chapterList={chapterList}
      chapterListValue={chapterListValue}
      handleChapterListChange={handleChapterListChange}
    />
  </header>
);

export default Header;