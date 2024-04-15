import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Form } from 'react-bootstrap';

//local storage and API Key: key should be entered in by the user and will be stored in local storage (NOT session storage)
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData); //so it'll look like: MYKEY: <api_key_value here> in the local storage when you inspect
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function App() {
  const [key, setKey] = useState<string>(keyData); //for api key input
  const [pageId, setPageId] = useState<number>(3); // 0 = Home, 1 = Basic Questions, 2 = Detailed Questions, 3 = React Home
  
  //sets the local storage item to the api key the user inputed
  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload(); //when making a mistake and changing the key again, I found that I have to reload the whole site before openai refreshes what it has stores for the local storage variable
  }

  //whenever there's a change it'll store the api key in a local state called key but it won't be set in the local storage until the user clicks the submit button
  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }

  // Using buttons to change the value of 'pageId' to switch pages -Dylan Blevins
  // React Home Page
  if (pageId === 3) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
          Shamus Ellis : Dylan Blevins : Luke Bonniwell
        </p>

        <button className="Home-Page-Button" onClick={() => setPageId(0)}>Home Page</button>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Form>
        <Form.Label>API Key:</Form.Label>
        <Form.Control type="password" placeholder="Insert API Key Here" onChange={changeKey}></Form.Control>
        <br></br>
        <Button variant="primary" className="Submit-Button" onClick={handleSubmit}>Submit</Button>
      </Form>
    </div>
    
  );
  }

  // Home Page
  if (pageId === 0) {
    return (
      <div>
        <header>
          <h1 className="Homepage-title">Welcome to the Home Page</h1>
          <button className="Page-to-Page" onClick={() => setPageId(3)}>React Page</button>
          <button className="Page-to-Page" onClick={() => setPageId(1)}>Basic Career Assessment Page</button>
          <button className="Page-to-Page" onClick={() => setPageId(2)}>Detailed Career Asssessment Page</button>
        </header>

        <body className="Home-Page-Body">
          <div>
            <button className="Page-to-Page" onClick={() => setPageId(1)}>Basic Career Assessment Page</button>
            <p>The Basic Question test is a multiple choice questionaire that
              does not take long and is very simple to understand. Although,
              because of the limited answers, the result of your quiz will not
              be as accurate.
            </p>

            <button className="Page-to-Page" onClick={() => setPageId(2)}>Detailed Career Asssessment Page</button>
            <p>The Detailed Question test is user provided short answer questionaire
              that may take some time to complete and require more thorough thinking.
              While that may be the case, the results from this quiz will be much more
              accurate.
            </p>
          </div>
        </body>

        <footer></footer>

      </div>
    )
  }

  // Basic Questions Page
  if (pageId === 1) {
    return (
    <div>
      <header>
        <div className="navbar">
          <button className="Page-to-Page" onClick={() => setPageId(0)}>Home</button>
        </div>
      </header>
      <body>
        <h1>Basic Quiz</h1>
        <p>Make sure that you answer all of the questions to complete the quiz</p>
      </body>
      <footer>Trademark Stuff</footer>
    </div>
    )
  }

  // Detailed Questions Page
  if (pageId === 2) {
    return (
    <div>
      <header>
        <h1>Welcome to the Detailed Questions Page</h1>
        <button className="Page-to-Page" onClick={() => setPageId(0)}>Back</button>
      </header>
    </div>
    )
  }

  // This should never appear
  return (
    <div><h1>You aren't supposed to be here</h1></div>
  )
}

export default App;
