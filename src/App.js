import React from "react";
import Header from "./Header/Header";
import Reader from "./Reader/Reader";
import BookList from "./Reader/BookList"
import StrongsModal from "./StrongsModal/StrongsModal"
import 'react-select/dist/react-select.css';
import "./App.css";
import _ from "lodash";

const remote = false;
const API = remote ? "http://206.189.161.101:8080" : "http://localhost:8080";
const baseKJURL = `${API}/api/kjbible/`;
const baseStrongsURL = `${API}/api/strongsdata/`;

class App extends React.Component {

  constructor(props) {
    super(props);

    this.handleBookListChange = this.handleBookListChange.bind(this);
    this.handleChapterListChange = this.handleChapterListChange.bind(this);
    this.setStrongsURL = this.setStrongsURL.bind(this);

    this.state = {
      bookList: BookList,
      chapterList: App.loadChapterList(50),
      bookListValue: {value: "Genesis", label: "Genesis"},
      chapterListValue: {value: 1, label: 1},
      chapterURL: `${baseKJURL}Genesis/1`,
      strongsURL: "",
      modalOpen: false
    };
  }

  setStrongsURL = (strongsLanguage, strongsNumber) => {
    this.setState({
      strongsURL: `${baseStrongsURL}${strongsLanguage}/${strongsNumber}`,
      modalOpen: true
    });
  };

  handleBookListChange = (newValue) => {
    this.setState({
      bookListValue: newValue,
      chapterList: App.loadChapterList(newValue.numberOfChapters),
      chapterListValue: {value: 1, label: 1},
      chapterURL: App.setReaderURL(newValue.value, 1)
    });
  };

  handleChapterListChange = (newValue) => {
    this.setState({
      chapterListValue: newValue,
      chapterURL: App.setReaderURL(_.get(this, "state.bookListValue.value"), newValue.value)
    });
  };

  onCloseModal = () => {
    this.setState({modalOpen: false});
  };

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
      <section id="view">
        <Header
          handleBookListChange={this.handleBookListChange}
          handleChapterListChange={this.handleChapterListChange}
          {...this.state}
        />
        <Reader {...this.state} setStrongsURL={this.setStrongsURL}/>
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