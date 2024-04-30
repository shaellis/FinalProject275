import React, { useState } from "react";
import { Form, ProgressBar } from "react-bootstrap";

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
            <ProgressBar now={progress * 100} label={`${Math.round(progress * 100)}%`} />
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
