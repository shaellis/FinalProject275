import React, { useState } from "react";
import { Form } from "react-bootstrap";

export function DetailedResponse({
    question, 
    onNextQuestion
}: {
    question : string;
    onNextQuestion : (value:string) => void;

}) : JSX.Element {
    const [answer, setAnswer] = useState<string>("");

    function updateAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        setAnswer(event.target.value);
    }
    function handleNextQuestion() {
        onNextQuestion(answer);
    }

    return (
        <div>
            <Form.Group className="foreachDetailedQuestion">
                <Form.Label>{question}</Form.Label>
                <Form.Control
                    type="text"
                    value={answer}
                    onChange={updateAnswer}
                />
            </Form.Group>
            Type your answer into the textblock to submit and move to the next question
            <button className="Detailed-Qs" onClick={handleNextQuestion} disabled={answer.length < 4}>Next Question</button>
        </div>
    );
}
