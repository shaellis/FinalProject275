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
  const [pageId, setPageId] = useState<number>(3); // 0 = Home, 1 = Basic Questions, 2 = Detailed Questions, 3 = React Home
  const [response, setResponse] = useState<string>();
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

    newOpenai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant who helps college and high school students decide on a career based on their responses to different questions"},
        { role: "user", content: "create 7 questions that can be answered with 'strongly agree', 'agree', 'disagree', and 'strongly disagree' that can be analyzed be you in order to find some possible future careers for me"},
      ],
      model: "gpt-3.5-turbo",
    }).then((result) => {
      // handle API response if it comes out without error
      setResponse(result.choices[0].message.content || '');
    }).catch((error) => {
      console.error('Error', error);
    });
  };

  //whenever there's a change it'll store the api key in a local state called key but it won't be set in the local storage until the user clicks the submit button
  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }
  // *******************************************************************************************
  // API Assistant section

  //now you can use the 'openai' object to make API calls this is used to create the assistant that we will be talking to
  //I AM MAKING THIS AS A PLACE HOLDER PLEASE REPLACE LATER AND IF YOU ARE THE PROFESSOR READING THIS I TOTALLY MEANT TO REMOVE THE ANY KEYWORD
  const [assistant, setAssistant] = useState<any | null>(null);
  async function CareerChoice() { 
    if (openai) {
      const newAssistant = await openai.beta.assistants.create({
        name: "Math Tutor",
        instructions: "You are a personal math tutor. Write and run code to answer math questions.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-turbo"
      });
      setAssistant(newAssistant);
    }
  }
  CareerChoice();

  //this can be used by basic questions to create a thread, which is like starting a conversation
  const [basicQsThreadId, setBasicQsThreadId] = useState<string | null>(null);
  async function CreateOpenAiBasicQsThread() {
    if (openai) {
      const basicQsThread = await openai.beta.threads.create();
      setBasicQsThreadId(basicQsThread.id);
      await openai.beta.threads.messages.create(
        basicQsThread.id,
        {
          role: "user",
          content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
        }
      );
    }
  }
  CreateOpenAiBasicQsThread();

  // this is only good for one thread because the state variable's type would need to be defined and this is easier
  async function AddMessageToBasicThread(message: string) {
    if (openai && basicQsThreadId) {
      await openai.beta.threads.messages.create(
        basicQsThreadId,
        {
          role: "user",
          content: message
        }
      );
    }
  }
  AddMessageToBasicThread("I need to solve the equation `3x + 8 = 14`. Can you help me?")

  //this can be used by detailed questions to create a thread, which is like starting a conversation
  const [detailedQsThreadId, setDetailedQsThreadId] = useState<string | null>(null);
  async function CreateOpenAiDetailedQsThread() {
    if (openai) {
      const detailedQsThread = await openai.beta.threads.create();
      setDetailedQsThreadId(detailedQsThread.id);
      await openai.beta.threads.messages.create(
        detailedQsThread.id,
        {
          role: "user",
          content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
        }
      );
    }
  }
  CreateOpenAiDetailedQsThread();



    // this is only good for one thread because the state variable's type would need to be defined and this is easier
    async function AddMessageToDetailedThread(message: string) {
      if (openai && detailedQsThreadId) {
        await openai.beta.threads.messages.create(
          detailedQsThreadId,
          {
            role: "user",
            content: message
          }
        );
      }
    }
    AddMessageToDetailedThread("I need to solve the equation `3x + 5 = 14`. Can you help me?")



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
  const [bProgress, setBProgress] = useState<number>(0);
  const [curBasicAns, setBasicCurAns] = useState<string>("");
  const [startNewBasic, setSNB] = useState<Boolean>(true); 
  
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
  async function GetResults () {
    if (openai && basicQsThreadId) {
      let run = await openai.beta.threads.runs.createAndPoll(
        basicQsThreadId,
        { 
          assistant_id: assistant.id,
          instructions: "Please address the user as Jane Doe. The user has a premium account."
        }
      );
      if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(
          run.thread_id
        );
        for (const message of messages.data.reverse()) {
          console.log(`${message.role} > ${message.content}`);
        }
      } else {
        console.log(run.status);
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
              <button className="Page-to-Page" onClick={() => GetResults()}>Get Results</button>
              <br></br>
            </div>
          )}
        </div>
    )
  }

//*************************************************************************************************************************************************** */
    // State Variables for Detailed Questions Page
    const detailedQ = [
      "What subjects do you excel at or find most engaging in school?",
      "Have you considered internships or part-time jobs in your field of interest?",
      "What kind of work-life balance are you looking for in your future career?",
      "Are you interested in pursuing further education beyond your undergraduate degree?",
      "What values are most important to you in a career",
      "How do you handle challenges or setbacks in your academic or personal life?",
      "Have you researched potential career paths and industries related to your major? If so, what?",
      "Are you willing to relocate for job opportunities?",
      "What skills or experiences do you already possess that could be valuable in your future career?",
      "Have you spoken with professionals or alumni in your desired field to gain insights into potential career paths?"
    ]
    const [questionsD] = useState<string[]>(detailedQ); // Detailed Questions String Array
    const [startNewDetailed, setSND] = useState<Boolean>(true); 
    const [detailedUserAnswers, setDetailedUserAnswer] = useState<string[]>([]);
    const [dProgress, setDProgress] = useState<number>(0);
    const [curDetailedAns, setDetailedCurAns] = useState<string>("");
    
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
      <div id="the-home-page">

        <header id="home-header">
          <nav id="navigation-bar" className="navbar">
            <button className="Page-to-Page" onClick={() => setPageId(3)}>React Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(1)}>Basic Career Assessment Page</button>
            <button className="Page-to-Page" onClick={() => setPageId(2)}>Detailed Career Asssessment Page</button>
          </nav>
        </header>

        <h2 id="website-title"><strong>Profession Finder</strong></h2>

        <body id="homepage-content" className="homepage-body">

          <div id='left-content' className="leftcolumn">
            <div id="Purpose" className="container-purpose">
              <h5>Why is it important to find your career</h5>
              <p>
                "Finding your career is essential for personal fulfillment, financial stability, and professional growth. 
                A career aligned with your passions, values, and skills brings purpose and satisfaction. Financially, it 
                provides stability, ensuring you meet needs and pursue desired lifestyles. Identifying a path with income 
                growth and advancement prospects secures long-term financial security.
                <br></br><br></br>
                Moreover, your career facilitates professional development, offering learning, skill enhancement, and 
                progression opportunities. Through continuous growth, you expand expertise and evolve professionally. A 
                fulfilling career boosts self-esteem, confidence, and accomplishment, fostering a healthy work-life balance 
                and reducing stress.
                <br></br><br></br>
                Additionally, it strengthens social connections and community engagement through collaboration and contribution. 
                Overall, finding your career enhances well-being, encompassing fulfillment, stability, growth, and satisfaction. 
                Identifying a path resonant with values and aspirations allows a journey of self-discovery and fulfillment, 
                leading to a more rewarding life." 
              </p>
              <p>
                -ChatGPT
              </p>
            </div>

            <div className="container-basic">
              <button className="Page-to-Page" onClick={() => {setPageId(1); setSNB(true)}}>Start New Basic Career Assessment</button>
              <p className="p-content">The Basic Question test is a multiple choice questionaire that
                does not take long and is very simple to understand. Although,
                because of the limited answers, the result of your quiz will not
                be as accurate.
              </p>
              <button className="Page-to-Page" onClick={() => {setPageId(1); setSNB(false);}}>Continue Basic Assessment</button>
              <p>If you wish to continue your basic career assessment, please click this button</p>
            </div>
          </div>

          <div id="right-content" className="rightcolumn">
            <div id="FAQ" className='container-FAQ'>
              <h5>FAQs</h5>
              <ol>
                <li>~~~~~~~~~~~~~</li>
                <ul>
                  <li>Because</li>
                </ul>
                <li>~~~~~~~~~~~~~</li>
                <ul>
                  <li>Because</li>
                </ul>
                <li>~~~~~~~~~~~~~</li>
                <ul>
                  <li>Because</li>
                </ul>
                <li>~~~~~~~~~~~~~</li>
                <ul>
                  <li>Because</li>
                </ul>
                <li>~~~~~~~~~~~~~</li>
                <ul>
                  <li>Because</li>
                </ul>
              </ol>
            </div>

            <div id="WRM" className='container-WRM'>
              <h5>What Results Mean</h5>
              <p>
                Firstly, each quiz will ask you a set number of questions that will in reference
                determine which type of career area caters to your style the most.
                The results you receive have been analyzed by OpenAI or better known as ChatGPT.
              </p>
            </div>

            <div id="detailed-content" className="container-detailed">
              <button className="Page-to-Page" onClick={() => {setPageId(2); setSND(true)}}>Start New Detailed Career Asssessment Page</button>
              <p className="p-content">The Detailed Question test is user provided short answer questionaire
                that may take some time to complete and require more thorough thinking.
                While that may be the case, the results from this quiz will be much more
                accurate.
              </p>
              <button className="Page-to-Page" onClick={() => {setPageId(2); setSND(false);}}>Continue Detailed Assessment</button>
              <p>If you wish to continue your detailed career assessment, please click this button</p>
            </div>
          </div>

        </body>

        <footer id="home-footer" className="footer">Trademark</footer>

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
        </div>
      </header>

      <body className="quiz-body">
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
  
    return (
    <div id="the-detailed-page" className="whole-page">

      <header>
        <div className="navbar">
          <button className="Page-to-Page" onClick={() => setPageId(0)}>Home</button>
        </div>
      </header>
      
      <body className="quiz-body">
        <div>
          <DetailedQuizStart></DetailedQuizStart>
        </div>
      </body>
      
    <footer className="footer">Trademark Stuff</footer>
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
        {response && (
          <div>
            <h2>API Response: </h2>
            <p>{response}</p>
          </div>
        )}
      </div>
      
    );
    }

  // This should never appear
  return (
    <div><h1>You aren't supposed to be here</h1></div>
  )
}

export default App;
