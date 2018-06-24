import React from "react";
import Select from "react-select"

const Selectors = ({
  bookList,
  bookListValue,
  handleBookListChange,
  chapterList,
  chapterListValue,
  handleChapterListChange
}) => (
  <nav className={"selectBoxWrapper"}>
    <Select
      options={bookList}
      clearable={false}
      className={"bookSelectBox"}
      value={bookListValue}
      onChange={handleBookListChange}
    />
    <Select
      options={chapterList}
      clearable={false}
      className={"chapterSelectBox"}
      value={chapterListValue}
      onChange={handleChapterListChange}
    />
  </nav>
);

export default Selectors;