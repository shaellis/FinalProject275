import React, { useState } from "react";
import { Form } from "react-bootstrap";

export function DetailedResponse({
    question,
    onNextQuestion,
    questionNumber,
    totalQuestions,
    progress,
}: {
    question: string;
    onNextQuestion: (value: string) => void;
    questionNumber: number; // Current question number
    totalQuestions: number; // Total number of questions
    progress: number; // Progress value from 0 to 1
}): JSX.Element {
    const [answer, setAnswer] = useState<string>("");

    function updateAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        setAnswer(event.target.value);
    }

    function handleNextQuestion() {
        onNextQuestion(answer);
    }

    return (
        <div>
            <p>Make sure that you answer all of the questions to complete the quiz</p>
            <div className="container-pbar">
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{width: `${progress*100}%`, backgroundColor: 'rgb(120, 90, 201)' }}>
                    {" "}
                    <div className="progress-label">{progress * 100}%</div>
                  </div>
                </div>
              </div>
            <Form.Group className="foreachDetailedQuestion">
                <Form.Label>{question}</Form.Label>
                <Form.Control
                    type="text"
                    value={answer}
                    onChange={updateAnswer}
                />
            </Form.Group>
            <p>Type your answer into the text block to submit and move to the next question</p>
            <button className="Detailed-Qs" onClick={handleNextQuestion} disabled={answer.length < 4}>Next Question</button>
        </div>
    );
}
