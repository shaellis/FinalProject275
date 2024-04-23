import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Form } from 'react-bootstrap';
import { MultipleChoiceQuestionForm } from "./MultipleChoiceQuestionForm";

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

  // *******************************************************************************************
  // State Variables for Basic Questions Page
  const basicQ = [
    "I feel most fulfilled when engaging in activities related to team building",
    "I believe my natural talents and strengths lie in leading a team",
    "It's important to me that my career aligns with my personal values and beliefs",
    "I aspire to make a significant impact in science",
    "Engaging in meetings with clients and companies energizes and motivates me",
    "I am passionate about adressing the mistreatment of others in computer science",
    "I thrive in work environments that are calm and relaxing",
    "I am eager to develop my skills and knowledge in technology",
    "I admire individuals who work in computer programming",
    "Success to me means completing small victories at a time to wither away at a bigger project"];
  const [questions] = useState<string[]>(basicQ); // Basic Questions String Array
  const [userAnswers, setUserAnswer] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [curAns, setCurAns] = useState<string>("");
  const [startNewBasic, setSNB] = useState<Boolean>(true); 
  const [detailedQuestionProgress, setDetailedQuestionProgress] = useState<number>(0);


  // Moves onto the next question by adding one to the progress and storing the user answer 
  function NextQuestion () {
    if (progress < 10) {
      setUserAnswer([...userAnswers, curAns]);
      setProgress(progress + 1);
      setCurAns("");
    }
  }

  // This will start the Basic Quiz
  function QuizStart () {

    if (startNewBasic) {
      setCurAns("");
      setUserAnswer([]);
      setProgress(0);
      setSNB(false);
    }

    return (
      <div>
          {(progress < 10) ? (
            <><Form.Group>
                <Form.Label>{questions[progress]}</Form.Label>
                <Form.Check
                  type="radio"
                  name="answer"
                  id="answer-check-option-one"
                  label="Strongly Agree"
                  value="Strongly Agree"
                  checked={curAns === "Strongly Agree"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurAns(event.target.value)} />
                <Form.Check
                  type="radio"
                  name="answer"
                  id="answer-check-option-two"
                  label="Agree"
                  value="Agree"
                  checked={curAns === "Agree"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurAns(event.target.value)} />
                <Form.Check
                  type="radio"
                  name="answer"
                  id="answer-check-option-three"
                  label="Disagree"
                  value="Disagree"
                  checked={curAns === "Disagree"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurAns(event.target.value)} />
                <Form.Check
                  type="radio"
                  name="answer"
                  id="answer-check-option-four"
                  label="Strongly Disagree"
                  value="Strongly Disagree"
                  checked={curAns === "Strongly Disagree"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurAns(event.target.value)} />
              </Form.Group><button onClick={NextQuestion} disabled={!curAns}>Next Question</button></>
          ) : ( 
            <div>
              These are the Questions and each Answer you submitted for each
              <br></br><br></br>
              Question 1: {questions[0]}
              <br></br>
              -{userAnswers[0]}
              <br></br><br></br>
              Question 2: {questions[1]}
              <br></br>
              -{userAnswers[1]}
              <br></br><br></br>
              Question 3: {questions[2]}
              <br></br>
              -{userAnswers[2]}
              <br></br><br></br>
              Question 4: {questions[3]}
              <br></br>
              -{userAnswers[3]}
              <br></br><br></br>
              Question 5: {questions[4]}
              <br></br>
              -{userAnswers[4]}
              <br></br><br></br>
              Question 6: {questions[5]}
              <br></br>
              -{userAnswers[5]}
              <br></br><br></br>
              Question 7: {questions[6]}
              <br></br>
              -{userAnswers[6]}
              <br></br><br></br>
              Question 8: {questions[7]}
              <br></br>
              -{userAnswers[7]}
              <br></br><br></br>
              Question 9: {questions[8]}
              <br></br>
              -{userAnswers[8]}
              <br></br><br></br>
              Question 10: {questions[9]}
              <br></br>
              -{userAnswers[9]}
              <br></br><br></br>
              <button className="Page-to-Page" onClick={() => setPageId(0)}>Home</button>
              <br></br>
            </div>
          )}
        </div>
    )
  }
  // *****************************************************************************************************************************

  // Home Page
  if (pageId === 0) {
    return (
      <div>
        <header>
          <div className="navbar">
            <button className="Page-to-Page" onClick={() => setPageId(3)}>React Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(1)}>Basic Career Assessment Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(2)}>Detailed Career Asssessment Page</button>
          </div>
        </header>

        <h1 className="Homepage-title">Welcome to the Home Page</h1>

        <body className="Home-Page-Body">
          <div>
            <button className="Page-to-Page" onClick={() => {setPageId(1); setSNB(true)}}>Start New Basic Career Assessment Page</button>
            <button className="Page-to-Page" onClick={() => {setPageId(1); setSNB(false);}}>View Basic Results</button>
            <p className="p-content">The Basic Question test is a multiple choice questionaire that
              does not take long and is very simple to understand. Although,
              because of the limited answers, the result of your quiz will not
              be as accurate.
            </p>

            <br></br>
            <button className="Page-to-Page" onClick={() => setPageId(2)}>Detailed Career Asssessment Page</button>
            <p className="p-content">The Detailed Question test is user provided short answer questionaire
              that may take some time to complete and require more thorough thinking.
              While that may be the case, the results from this quiz will be much more
              accurate.
            </p>
          </div>
        </body>

        <footer className="footer">Trademark</footer>

      </div>
    )
  } 

  // Basic Questions Page
  if (pageId === 1) {
    return (
    <div className="whole-page">
      <header>
        <div className="navbar">
          <button className="Page-to-Page" onClick={() => setPageId(0)}>Home</button>
        </div>
      </header>

      <h1>Basic Quiz</h1>
      <p>Make sure that you answer all of the questions to complete the quiz</p>
        

      <body className="body">
        <div>
          <QuizStart></QuizStart>
        </div>
      </body>

      <footer className="footer">Trademark Stuff</footer>
    </div>
    )
  }

  // Detailed Questions Page
  if (pageId === 2) {
    const totalQuestions = 10;
  
    const handleNextQuestion = () => {
      if (detailedQuestionProgress < totalQuestions - 1) {
        setDetailedQuestionProgress(detailedQuestionProgress + 1);
      }
    };
  
    const progressPercentage = (detailedQuestionProgress / totalQuestions) * 100;
  
    const ProgressBar = () => (
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    );
  
    return (
      <div>
        <header>
          <h1>Welcome to the Detailed Questions Page</h1>
          <button className="Page-to-Page" onClick={() => setPageId(0)}>Back</button>
        </header>
        <ProgressBar />
        <MultipleChoiceQuestionForm
          options={["a", "b", "c"]}
          expectedAnswer="b"
        ></MultipleChoiceQuestionForm>
        <button onClick={handleNextQuestion}>Next Question</button>
      </div>
    );
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

  // This should never appear
  return (
    <div><h1>You aren't supposed to be here</h1></div>
  )
}

export default App;
