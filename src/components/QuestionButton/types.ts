

export type QuestionButtonProps = {
    label: string;
    isAnswered: boolean;
    currentlySelected: boolean;
    questionId: string;
    isCorrect?: boolean;
}