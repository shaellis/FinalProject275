import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Form } from 'react-bootstrap';
import { DetailedResponse } from "./DetailedResponse";
import { OpenAI, ClientOptions } from 'openai';

// *******************************************************************************************************************************
// API KEY stuffs

// in this new implementation I really am struggling to find a place for the above code ^
const saveKeyData = "MYKEY";

//had some trouble understanding the OpenAI page on this so I used ChatGPT to explain it and edit my drafts
function App() {
  const [key, setKey] = useState<string>(() => { //for api key input
    const prevKey = localStorage.getItem(saveKeyData);
    return prevKey || '';
  }); 
  const [pageId, setPageId] = useState<number>(0); // 0 = Home, 1 = Basic Questions, 2 = Detailed Questions, 3 = React Home
  const [dResponse, setDetailedResponse] = useState<string>("");
  const [dResultsSections, setDetailedResultsSections] = useState<string[]>([]);
  const [bResponse, setBasicResponse] = useState<string>("");
  const [bResultsSections, setBasicResultsSections] = useState<string[]>([]);
  const [openai, setOpenai] = useState<OpenAI | null>(null);


  // Function to handle submitting the API key but remade for openAI 'assistant' you cannot use local storage because apparently the api key will update later than necessary. you can try it if you want I didn't test this.
  // technically the apiKey isn't a string. it's more like a url so you gotta import CLientOptions type to define the "key"
  const handleSubmit = () => {
    //save the key data to local storage
    localStorage.setItem(saveKeyData, key);

    const options: ClientOptions = {
      apiKey : key,
      dangerouslyAllowBrowser: true
    }
    
    let newOpenai = new OpenAI(options); // Create a new OpenAI instance
    setOpenai(newOpenai); // Update the state with the new OpenAI object

  };

  //whenever there's a change it'll store the api key in a local state called key but it won't be set in the local storage until the user clicks the submit button
  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }

  // function for when the API call is loading
  function isLoading() {
    return (
      <div className="loading-indicator"><strong>LOADING ...</strong></div>
    )
  }


  // *******************************************************************************************
  // State Variables for Basic Questions Page
  const basicQ = [
    "I prefer working in teams rather than independently.",
    "I enjoy solving complex problems and puzzles.",
    "I feel comfortable speaking in front of large groups of people.",
    "I value creativity and innovation in my work.",
    "I prefer following a set schedule rather than having flexibility.",
    "I feel energized when I have the opportunity to lead and make decisions.",
    "I am detail-oriented and enjoy paying attention to small nuances.",
    "I prefer jobs that allow me to travel and explore new places.",
    "I find fulfillment in helping others and making a positive impact on their lives.",
    "I enjoy working with my hands and being physically active."];
  const [questions] = useState<string[]>(basicQ); // Basic Questions String Array
  const [userAnswers, setUserAnswer] = useState<string[]>([]); // user answers to the basic questions
  const [bProgress, setBProgress] = useState<number>(0); // user's progress through the basic quiz
  const [curBasicAns, setBasicCurAns] = useState<string>(""); // user's current answer to the basic question
  const [startNewBasic, setSNB] = useState<Boolean>(true);  // boolean to start a new basic quiz 
  
  // const [detailedQuestionProgress, setDetailedQuestionProgress] = useState<number>(0);


  // Moves onto the next question by adding one to the progress and storing the user answer 
  function NextQuestion () {
    if (bProgress < basicQ.length) {
      setUserAnswer([...userAnswers, curBasicAns]);
      setBProgress(bProgress + 1);
      setBasicCurAns("");
    }
  }

  // Goes back to the previous question and removes the previous user's answer
  function PrevQuestion () {
    if (bProgress > 0) {
      setBProgress(bProgress - 1);
      userAnswers.pop();
    }
  }

  // OpenAI call to get the analyzed results (code previded by openAI tutorial website)
  async function GetResults() {
    setBasicResponse("");
    if (openai && userAnswers.length > 8) {
        const basicCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            temperature: 0,
            messages: [
                {"role": "system", "content": "You are a personal career consultant for students ranging from High School to College, Your job is analyze the data provided to you and come up with some career choices that best suit their traits."},
                {"role": "user", "content": 
                    "The following questions have been given to a user and the answers following each question are the user's. Based off these questions and the user's answers please report what career area they are most suited for.\n" +
                    questions[0] + " " + userAnswers[0] + "\n" +
                    questions[1] + " " + userAnswers[1] + "\n" +
                    questions[2] + " " + userAnswers[2] + "\n" +
                    questions[3] + " " + userAnswers[3] + "\n" +
                    questions[4] + " " + userAnswers[4] + "\n" +
                    questions[5] + " " + userAnswers[5] + "\n" +
                    questions[6] + " " + userAnswers[6] + "\n" +
                    questions[7] + " " + userAnswers[7] + "\n" +
                    questions[8] + " " + userAnswers[8] + "\n" +
                    questions[9] + " " + userAnswers[9] + "\n" +
                    "Follow the format by separating each individual section using a #. Each section should contain a job name that would suit the user, a brief description, and the salary range.\nOverall there should be 4 sections, firstly user traits, secondly first job, thirdly second job, and fourthly third job"
                }
            ],
        });
        
        if (basicCompletion.choices[0].message.content) {
            setBasicResponse(basicCompletion.choices[0].message.content);
            // Update bResultsSections using the setter function
            const bResultsSections: string[] = basicCompletion.choices[0].message.content.split("#");
            if (bResultsSections.length >= 5) {
                const modifiedSections = [...bResultsSections];
                modifiedSections[1] = modifiedSections[1].slice(16, modifiedSections[1].length - 1);
                modifiedSections[1] = modifiedSections[1].replace(/ - /g, '\n');
                modifiedSections[2] = modifiedSections[2].slice(11, modifiedSections[2].length - 1);
                modifiedSections[3] = modifiedSections[3].slice(12, modifiedSections[3].length - 1);
                modifiedSections[4] = modifiedSections[4].slice(11, modifiedSections[4].length - 1);
                setBasicResultsSections(modifiedSections); // Update the state variable with modified sections
            }
        }
    }
}


  // This will start the Basic Quiz
  function QuizStart () {

    // if the user wants to start a new quiz then this resets the values
    if (startNewBasic) {
      setBasicCurAns("");
      setUserAnswer([]);
      setBProgress(0);
      setSNB(false);
    }

    return (
      <div>
          {(bProgress < basicQ.length) ? (
            <>
              <p>Make sure that you answer all of the questions to complete the quiz</p>

              <div className="container-pbar">
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{width: `${bProgress*10}%`, backgroundColor: 'rgb(120, 90, 201)' }}>
                    {" "}
                    <div className="progress-label">{bProgress * 10}%</div>
                  </div>
                </div>
              </div>

              <Form.Group>
                <div id="basic-question" className="container-basic-question">
                  <Form.Label><strong>Question {bProgress + 1}:</strong> {questions[bProgress]}</Form.Label>
                </div>
                
                <div id="basic-options" className="container-basic-options">
                  <Form.Check
                    type="radio"
                    name="answer"
                    id="answer-check-option-one"
                    label="Strongly Agree"
                    value="Strongly Agree"
                    checked={curBasicAns === "Strongly Agree"}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBasicCurAns(event.target.value)} />
                  <Form.Check
                    type="radio"
                    name="answer"
                    id="answer-check-option-two"
                    label="Agree"
                    value="Agree"
                    checked={curBasicAns === "Agree"}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBasicCurAns(event.target.value)} />
                  <Form.Check
                    type="radio"
                    name="answer"
                    id="answer-check-option-three"
                    label="Disagree"
                    value="Disagree"
                    checked={curBasicAns === "Disagree"}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBasicCurAns(event.target.value)} />
                  <Form.Check
                    type="radio"
                    name="answer"
                    id="answer-check-option-four"
                    label="Strongly Disagree"
                    value="Strongly Disagree"
                    checked={curBasicAns === "Strongly Disagree"}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBasicCurAns(event.target.value)} />
                </div>
                
              </Form.Group>
              
              <div id="basic-buttons" className="container-quiz-buttons">
                <button onClick={NextQuestion} disabled={!curBasicAns || bProgress === 9}>Next Question</button>
                <button onClick={PrevQuestion} disabled={bProgress === 0}>Previous Question</button>
                <button onClick={NextQuestion} disabled={!curBasicAns || bProgress !== 9}>Finish</button>
              </div>
              
            </>
          ) : ( 
            <div>
              <h4>CONGRATULATIONS ON COMPLETING THE BASIC CAREER ASSESSMENT!</h4>
              Here are the Questions and each Answer you submitted for each
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
              <p>
                If you would like to submit your results for analyzing, please click "Get Results"
                <br></br>
                If not then you can return home when clicking the button at the top left that says, "Home"
              </p>
              <button className="Page-to-Page" onClick={() => {GetResults(); setPageId(5);}}>Get Results</button>
              <br></br>
            </div>
          )}
        </div>
    )
  }

//*************************************************************************************************************************************************** */
    // State Variables for Detailed Questions Page
    const detailedQ = [
      "Can you describe a specific project or task where you demonstrated strong problem-solving skills?",
      "Reflecting on your past experiences, what types of tasks or responsibilities have you found the most rewarding and why?",
      "In what ways do you believe your personality traits align with leadership roles or collaborative environments?",
      "Describe a time when you had to adapt to a new situation or environment. How did you handle it?",
      "Can you identify any specific interests or hobbies that you believe could translate into potential career paths?",
      "Reflect on your communication skills. Do you feel more comfortable expressing yourself verbally, in writing, or through other means?",
      "Think about a challenging situation you've encountered. What strategies did you employ to overcome it?",
      "Describe a situation where you had to work under pressure or meet tight deadlines. How did you manage your time effectively?",
      "Reflect on your long-term career goals. What steps are you currently taking to work towards them?",
      "Considering your strengths and weaknesses, how do you envision yourself contributing to a team or workplace environment?"
    ]
    const [questionsD] = useState<string[]>(detailedQ); // Detailed Questions String Array
    const [startNewDetailed, setSND] = useState<Boolean>(true);  // boolean to start new quiz
    const [detailedUserAnswers, setDetailedUserAnswer] = useState<string[]>([]); // user answers to detailed questions
    const [dProgress, setDProgress] = useState<number>(0); // user's progress in the detailed quiz
    const [curDetailedAns, setDetailedCurAns] = useState<string>(""); // user's current answer for the detailed question
    
    // help function for moving onto the next question
    const handleNextQuestion = (value : string) => {
      setDetailedCurAns(value);
      NextDetailedQuestion();
    }

  // Moves onto the next question by adding one to the progress and storing the user answer but in a different a detailed answer storage instead
  function NextDetailedQuestion () {
    if (dProgress < 11) {
      setDetailedUserAnswer([...detailedUserAnswers, curDetailedAns]);
      setDProgress(dProgress + 1);
    }
  }

  // API call to get the career reports
  async function getDetailedResults () {
    setDetailedResponse("");
    if (openai && detailedUserAnswers.length > 8) {
        const detailedCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            temperature: 0,
            messages: [
                {"role": "system", "content": "You are a personal career consultant for students ranging from High School to College, Your job is analyze the data provided to you and come up with some career choices that best suit their traits."},
                {"role": "user", "content": 
                    "The following questions have been given to a user and the answers following each question are the user's. Based off these questions and the user's answers please report what career area they are most suited for.\n" +
                    questions[0] + " " + detailedUserAnswers[1] + "\n" +
                    questions[1] + " " + detailedUserAnswers[2] + "\n" +
                    questions[2] + " " + detailedUserAnswers[3] + "\n" +
                    questions[3] + " " + detailedUserAnswers[4] + "\n" +
                    questions[4] + " " + detailedUserAnswers[5] + "\n" +
                    questions[5] + " " + detailedUserAnswers[6] + "\n" +
                    questions[6] + " " + detailedUserAnswers[7] + "\n" +
                    questions[7] + " " + detailedUserAnswers[8] + "\n" +
                    questions[8] + " " + detailedUserAnswers[9] + "\n" +
                    questions[9] + " " + detailedUserAnswers[10] + "\n" +
                    "Follow the format by separating each individual section using a #. Each section should contain a job name that would suit the user, a brief description, and the salary range.\nOverall there should be 4 sections, firstly user traits, secondly first job, thirdly second job, and fourthly third job."
                }
            ],
        });
        
        if (detailedCompletion.choices[0].message.content) {
            setDetailedResponse(detailedCompletion.choices[0].message.content);
            // Update dResultsSections using the setter function
            const dResultsSections: string[] = detailedCompletion.choices[0].message.content.split("#");
            if (dResultsSections.length >= 5) {
                const modifiedSections = [...dResultsSections];
                modifiedSections[1] = modifiedSections[1].slice(16, modifiedSections[1].length - 1);
                modifiedSections[1] = modifiedSections[1].replace(/ - /g, '\n');
                modifiedSections[2] = modifiedSections[2].slice(11, modifiedSections[2].length - 1);
                modifiedSections[3] = modifiedSections[3].slice(12, modifiedSections[3].length - 1);
                modifiedSections[4] = modifiedSections[4].slice(11, modifiedSections[4].length - 1);
                setDetailedResultsSections(modifiedSections); // Update the state variable with modified sections
            }
        }
    }
}


  // This will start the Detailed Questions Quiz and work as close in functionality as possible to the Basic Questions Quiz Page
  function DetailedQuizStart () {
    if (startNewDetailed) {
      setDetailedCurAns("");
      setDetailedUserAnswer([]);
      setDProgress(0);
      setSND(false);
    }

    return (
      <div>
        {(dProgress < 11) ? (
          <div>
            <DetailedResponse
            question={questionsD[dProgress]}
            onNextQuestion={handleNextQuestion}
            progress={dProgress}
            ></DetailedResponse>
          </div>
          
        ) : ( 
          <div>
            These are the Questions and each Answer you submitted for each
            <br></br><br></br>
            Question 1: {questionsD[0]}
            <br></br>
            -{detailedUserAnswers[1]}
            <br></br><br></br>
            Question 2: {questionsD[1]}
            <br></br>
            -{detailedUserAnswers[2]}
            <br></br><br></br>
            Question 3: {questionsD[2]}
            <br></br>
            -{detailedUserAnswers[3]}
            <br></br><br></br>
            Question 4: {questionsD[3]}
            <br></br>
            -{detailedUserAnswers[4]}
            <br></br><br></br>
            Question 5: {questionsD[4]}
            <br></br>
            -{detailedUserAnswers[5]}
            <br></br><br></br>
            Question 6: {questionsD[5]}
            <br></br>
            -{detailedUserAnswers[6]}
            <br></br><br></br>
            Question 7: {questionsD[6]}
            <br></br>
            -{detailedUserAnswers[7]}
            <br></br><br></br>
            Question 8: {questionsD[7]}
            <br></br>
            -{detailedUserAnswers[8]}
            <br></br><br></br>
            Question 9: {questionsD[8]}
            <br></br>
            -{detailedUserAnswers[9]}
            <br></br><br></br>
            Question 10: {questionsD[9]}
            <br></br>
            -{detailedUserAnswers[10]}
            <br></br><br></br>
            <button className="Page-to-Page" onClick={() => {getDetailedResults(); setPageId(4);}}>Get Results</button>
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
      <div id="the-home-page">

        <header id="home-header">
          <nav id="navigation-bar" className="navbar">
            <button className="Page-to-Page" onClick={() => setPageId(3)}>React Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(1)}>Basic Career Assessment Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(2)}>Detailed Career Asssessment Page</button>
            <button className="Page-to-Page" disabled={bResponse === ""} hidden={bResponse === ""} onClick={() => setPageId(5)}>Basic Career Quiz Results Page</button>
            <button className="Page-to-Page" disabled={dResponse === ""} hidden={dResponse === ""} onClick={() => setPageId(4)}>Detailed Career Quiz Results Page</button>
          </nav>
        </header>

        <h2 id="website-title"><strong>Profession Finder</strong></h2>

        <body id="homepage-content" className="homepage-body">

          <div id='left-content' className="leftcolumn">
            <div id="purpose-content" className="container-purpose">
              <h5><i><b><u>Why is it important to find your career</u></b></i></h5>
              <p>
                Your career is very important, you spend most of your life working to live as comfortable as possible.
                Unfortunately there are times where people are stuck in a career they do not like or they just do not 
                know what career fits them best. Are they a future Computer Scientist, Psychiatrist, Electrician; we may never know 
                because they have not decided to find out. 
                <br></br><br></br>
                Some people never find out so its important for you to find out as fast as possible!
              </p>
            </div>

            <div className="container-basic">
              <button className="Page-to-Page" onClick={() => {setPageId(1); setSNB(true)}}>Start New Basic Career Assessment</button>
              <p className="p-content"><i><b><u>The Basic Question</u></b></i> test is a multiple choice questionaire that
                does not take long and is very simple to understand. Although,
                because of the limited answers, the result of your quiz will not
                be as accurate.
              </p>
              <button className="Page-to-Page" onClick={() => {setPageId(1); setSNB(false);}}>Continue Basic Assessment</button>
              <p>If you wish to <i><b><u>continue</u></b></i> your basic career assessment, please click this button</p>
            </div>
          </div>

          <div id="right-content" className="rightcolumn">
            <div id="FAQ" className='container-FAQ'>
              <h5><u>FAQs</u></h5>
              <ol>
                <li><i><b><u>How does this work?</u></b></i></li>
                <ul>
                  <li>How the profession finder works is you are givin a questionaire (basic or detailed) and afterwards you can submit your answers to be analyzed by ChatGPT.</li>
                </ul>
                <li><i><b><u>Can I start it and come back to later?</u></b></i></li>
                <ul>
                  <li>YES! You can start it and then come back to it later and you can even switch to the other quiz if you want to.</li>
                </ul>
                <li><i><b><u>How accurate are these results?</u></b></i></li>
                <ul>
                  <li>Depending on which quiz you take the accuracy will differ with the basic quiz being less accurate and vice versa with the detailed quiz.</li>
                </ul>
              </ol>
            </div>

            <div id="detailed-content" className="container-detailed">
              <button className="Page-to-Page" onClick={() => {setPageId(2); setSND(true)}}>Start New Detailed Career Asssessment Page</button>
              <p className="p-content"><i><b><u>The Detailed Question</u></b></i> test is user provided short answer questionaire
                that may take some time to complete and require more thorough thinking.
                While that may be the case, the results from this quiz will be much more
                accurate.
              </p>
              <button className="Page-to-Page" onClick={() => {setPageId(2); setSND(false);}}>Continue Detailed Assessment</button>
              <p>If you wish to <i><b><u>continue</u></b></i> your detailed career assessment, please click this button</p>
            </div>
          </div>

        </body>

        <footer id="home-footer" className="footer">Profession Finder | Dylan Blevins, Luke Bonniwell, Shamus Ellis | Help @ 111-111-1111</footer>

      </div>
    )
  } 

  // Basic Questions Page
  if (pageId === 1) {
    return (
    <div id="the-basic-page">

      <header>
        <div className="navbar">
        <button className="Page-to-Page" onClick={() => setPageId(0)}>Home</button>
          <button className="Page-to-Page" onClick={() => setPageId(3)}>React Page</button>
          <button className="Page-to-Page" onClick={() => setPageId(2)}>Detailed Career Asssessment Page</button>
          <button className="Page-to-Page" disabled={bResponse === ""} hidden={bResponse === ""} onClick={() => setPageId(5)}>Basic Career Quiz Results Page</button>
          <button className="Page-to-Page" disabled={dResponse === ""} hidden={dResponse === ""} onClick={() => setPageId(4)}>Detailed Career Quiz Results Page</button>
        </div>
      </header>

      <body className="quiz-body">
        <div>
          <QuizStart></QuizStart>
        </div>
      </body>

      <footer id="home-footer" className="footer">Profession Finder | Dylan Blevins, Luke Bonniwell, Shamus Ellis | Help @ 111-111-1111</footer>

    </div>
    )
  }

  // Detailed Questions Page
   if (pageId === 2) {
  
    return (
    <div id="the-detailed-page" className="whole-page">

      <header>
        <div className="navbar">
          <button className="Page-to-Page" onClick={() => setPageId(0)}>Home</button>
          <button className="Page-to-Page" onClick={() => setPageId(3)}>React Page</button>
          <button className="Page-to-Page" onClick={() => setPageId(1)}>Basic Career Asssessment Page</button>
          <button className="Page-to-Page" disabled={bResponse === ""} hidden={bResponse === ""} onClick={() => setPageId(5)}>Basic Career Quiz Results Page</button>
          <button className="Page-to-Page" disabled={dResponse === ""} hidden={dResponse === ""} onClick={() => setPageId(4)}>Detailed Career Quiz Results Page</button>
        </div>
      </header>
      
      <body className="quiz-body">
        <div>
          <DetailedQuizStart></DetailedQuizStart>
        </div>
      </body>
      
      <footer id="home-footer" className="footer">Profession Finder | Dylan Blevins, Luke Bonniwell, Shamus Ellis | Help @ 111-111-1111</footer>
    </div>
    
    )
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
    )
  }

  // detailed questions results page
  if (pageId === 4) {

    return (
      <div id="dresults-page">

        <header id="home-header">
          <nav id="navigation-bar" className="navbar">
            <button className="Page-to-Page" onClick={() => setPageId(0)}>Home Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(3)}>React Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(1)}>Basic Career Assessment Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(2)}>Detailed Career Asssessment Page</button>
            <button className="Page-to-Page" disabled={bResponse === ""} onClick={() => setPageId(5)}>Basic Career Quiz Results Page</button>
          </nav>
        </header>

        <h2 id="website-title"><strong>Detailed Career Guidance Page</strong></h2>
        
        <body id="dresults-content" className="homepage-body">
          <div id="left-content" className="dleftcloumn">
            <div id="user-traits" className="containter-user-traits">
              <h5>What did the quiz answers show about your work ethic traits?</h5>
              <p>
                {dResultsSections[1]}
              </p>
            </div>

            <div id="first-job" className="containter-first-job">
              <h5>What job best fit your detailed questions quiz answers?</h5>
              <p>
                {dResultsSections[2]}
              </p>
            </div>
          </div>

          <div id="right-content" className="drightcloumn">
            <div id="second-job" className="containter-second-job">
              <h5>What was the second best job to fit your detailed questions quiz answers?</h5>
              <p>
                {dResultsSections[3]}
              </p>
            </div>

            <div id="third-job" className="containter-third-job">
              <h5>What was the third best job to fit your detailed questions quiz answers?</h5>
              <p>
                {dResultsSections[4]}
              </p>
            </div>
          </div>

          <div>
            {(!dResponse) ? (isLoading()) : (<div></div>)}
          </div>

        </body>

      </div>
        
    )
  }

  // basic questions results page
  if (pageId === 5) {
      
    return (
      <div id="dresults-page">

        <header id="homepage-header">
          <nav id="navigation-bar" className="navbar">
            <button className="Page-to-Page" onClick={() => setPageId(0)}>Home Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(3)}>React Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(1)}>Basic Career Assessment Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(2)}>Detailed Career Asssessment Page</button>
            <button className="Page-to-Page" disabled={dResponse === ""} onClick={() => setPageId(4)}>Detailed Career Quiz Results Page</button>
          </nav>
        </header>

        <h2 id="website-title"><strong>Basic Career Guidance Page</strong></h2>
        
        <body id="dresults-content" className="homepage-body">
          <div id="left-content" className="dleftcloumn">
            <div id="user-traits" className="containter-user-traits">
              <h5>What did the quiz answers show about your work ethic traits?</h5>
              <p>
                {bResultsSections[1]}
              </p>
            </div>

            <div id="first-job" className="containter-first-job">
              <h5>What job best fit your basic questions quiz answers?</h5>
                <p>
                  {bResultsSections[2]}
                </p>
            </div>
          </div>

          <div id="right-content" className="drightcloumn">
            <div id="second-job" className="containter-second-job">
              <h5>What was the second best job to basic questions quiz answers?</h5>
                <p>
                  {bResultsSections[3]}
                </p>
            </div>

            <div id="third-job" className="containter-third-job">
              <h5>What was the third best job to fit your basic questions quiz answers?</h5>
                <p>
                  {bResultsSections[4]}
                </p>
            </div>
          </div>

          <div>
            {(!bResponse) ? (isLoading()) : (<div></div>)}
          </div>

        </body>

      </div>
    );
  }

  // This should never appear
  return (
    <div><h1>You aren't supposed to be here</h1></div>
  )
}

export default App;
