import React, { useState } from "react";
import { Form } from "react-bootstrap";

export function MultipleChoiceQuestionForm({
    options,
    expectedAnswer
}: {
    options: string[];
    expectedAnswer: string;
}): JSX.Element {
    const [choice, setChoice] = useState(options[0]);

    function isRight() {
        return choice === expectedAnswer;
    }
    function updateChoice(event: React.ChangeEvent<HTMLSelectElement>) {
        setChoice(event.target.value);
    }
    return (
        <div>
            <Form.Group controlId="userQuestions">
                <Form.Label>What is the answer?</Form.Label>
                <Form.Select value={choice} onChange={updateChoice}>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            {isRight() ? "✔️" : "❌"}
        </div>
    );
}
