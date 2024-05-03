import React, { useState } from "react";
import { Form } from "react-bootstrap";

export function DetailedResponse({
    question,
    onNextQuestion,
    progress,
}: {
    question: string;
    onNextQuestion: (value: string) => void;
    progress: number; // Progress value from 0 to 1
}): JSX.Element {
    const [answer, setAnswer] = useState<string>("");

    function updateAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        setAnswer(event.target.value);
    }

    function handleNextQuestion() {
        onNextQuestion(answer);
    }

    function FinalCheck () {
        onNextQuestion(answer);
    }

    return (
        <div>
            {(progress < 10) ? (
                <>
                <p>Think through your answers very thoroughly before moving onto the next question, if you would like to change an answer then you will have to retake the quiz</p>
                <div className="container-pbar">
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress * 10}%`, backgroundColor: 'rgb(120, 90, 201)' }}>
                            {" "}
                            <div className="progress-label">{progress * 10}%</div>
                        </div>
                    </div>
                </div>
                
                <div className="container-detailed-options">
                    <Form.Group className="foreachDetailedQuestion">
                        <Form.Label>{question}</Form.Label>
                        <Form.Control
                            type="text"
                            value={answer}
                            onChange={updateAnswer} />
                    </Form.Group>
                    <p>Type your answer into the text block to submit and move to the next question</p>
                </div>
                
                <div className="container-quiz-buttons">
                    <button onClick={handleNextQuestion} disabled={answer.length < 4}>Next Question</button>
                </div>
                </>
                
        
            ) : (
                <>
                <div className="container-pbar">
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress * 10}%`, backgroundColor: 'rgb(120, 90, 201)' }}>
                            {" "}
                            <div className="progress-label">{progress * 10}%</div>
                        </div>
                    </div>
                </div>
                
                <div className="container-detailed-options">
                    <p>Press the "Finish" button to complete the quiz</p>
                </div>
                    
                <div className="container-quiz-buttons">
                    <button onClick={FinalCheck} disabled={progress < 9}>Finish</button>
                </div>
                </>
            )}
        </div>
    );
}
