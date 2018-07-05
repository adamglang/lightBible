import React from "react";
import Swipeable from "react-swipeable";

const ChapterController = ({
    className,
    directionToMove,
    chapterListValue,
    handleBookListChange,
    handleChapterListChange,
    newChapter = chapterListValue && (chapterListValue.value + directionToMove),
    goToNewChapter = () => handleChapterListChange({"value": newChapter, "label": newChapter}),
  }) => (
  <Swipeable
    className={"ChapterSwipableArea"}
    onSwipedLeft={goToNewChapter}
    onSwipedRight={goToNewChapter}
  >
    <span className={`chapterController ${className}`} onClick={goToNewChapter}> </span>
  </Swipeable>
);

export default ChapterController;