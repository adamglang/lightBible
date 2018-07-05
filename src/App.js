import React from "react";
import Header from "./Header/Header";
import Reader from "./Reader/Reader";
import BookList from "./Reader/BookList"
import StrongsModal from "./StrongsModal/StrongsModal"
import 'react-select/dist/react-select.css';
import "./App.css";
import _ from "lodash";

const remote = true;
const API = remote ? "http://206.189.161.101:8080" : "http://localhost:8080";
const baseKJURL = `${API}/api/kjbible/`;
const baseStrongsURL = `${API}/api/strongsdata/`;

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      bookList: BookList,
      chapterList: App.loadChapterList(50),
      bookListValue: {value: "Genesis", label: "Genesis"},
      chapterListValue: {value: 1, label: 1},
      chapterURL: `${baseKJURL}Genesis/1`,
      strongsURL: "",
      modalOpen: false,
      isTouchScreen: false
    };
  }

  setStrongsURL = (strongsLanguage, strongsNumber) => {
    this.setState({
      strongsURL: `${baseStrongsURL}${strongsLanguage}/${strongsNumber}`,
      modalOpen: true
    });
  };

  handleBookListChange = (newValue, useLastChapter) => {
    const lastChapter = newValue.numberOfChapters;
    const chapterListValue = useLastChapter ? {value: lastChapter, label: lastChapter} : {value: 1, label: 1};
    const chapterToLoad = useLastChapter ? lastChapter : 1;

    this.setState({
      bookListValue: newValue,
      chapterList: App.loadChapterList(newValue.numberOfChapters),
      chapterListValue: chapterListValue,
      chapterURL: App.setReaderURL(newValue.value, chapterToLoad)
    });
  };

  handleChapterListChange = (newValue) => {
    const totalChapters = _.get(this, "state.chapterList.length");
    const bookList = _.get(this, "state.bookList");
    const presentBookIndex = bookList.findIndex((book) => {
      return book.value === _.get(this, "state.bookListValue.value");
    });

    if(newValue.value > totalChapters) {
      this.handleBookEnd(presentBookIndex, bookList);
    }

    else if(newValue.value < 1) {
      this.handleBookEnd(presentBookIndex, bookList, true);
    }

    else {
      this.setState({
        chapterListValue: newValue,
        chapterURL: App.setReaderURL(_.get(this, "state.bookListValue.value"), newValue.value)
      });
    }
  };

  handleBookEnd = (presentBookIndex, bookList, movingBackward) => {
    const condition = movingBackward ? (presentBookIndex) === 0 : (presentBookIndex + 2) > bookList.length;
    const bookReset = movingBackward ? bookList[65] : bookList[0];


    if(condition) {
      this.handleBookListChange(bookReset, movingBackward);
    }
    else {
      const newBookIndex = movingBackward ? presentBookIndex - 1 : presentBookIndex + 1;
      const newBook = bookList[newBookIndex];
      this.handleBookListChange(newBook, movingBackward);
    }
  };

  onCloseModal = () => this.setState({modalOpen: false});

  declareTouchScreen = () => this.setState({isTouchScreen: true});

  static setReaderURL(book, chapter) {
    return `${baseKJURL}${book}/${chapter}`;
  }

  static loadChapterList(numberOfChapters) {
    const chapterList = [];

    for(let i = 1; i <= numberOfChapters; i++) {
      chapterList.push({value: i, label: i})
    }

    return chapterList;
  };

  render() {
    return (
      <section
        id="view"
        className={this.state.isTouchScreen ? "touchScreen" : ""}
        onTouchStart={this.declareTouchScreen}
      >
        <Header
          handleBookListChange={this.handleBookListChange}
          handleChapterListChange={this.handleChapterListChange}
          {...this.state}
        />
        <Reader
          {...this.state}
          setStrongsURL={this.setStrongsURL}
          handleBookListChange={this.handleBookListChange}
          handleChapterListChange={this.handleChapterListChange}
        />
        <StrongsModal
          {...this.state}
          onCloseModal={this.onCloseModal}
          setStrongsURL={this.setStrongsURL}
        />
      </section>
    );
  };
}

export default App;