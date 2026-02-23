import { ToggleButton } from 'react-aria-components';
import type { QuestionButtonProps } from './types';
import classNames from 'classnames';
import './QuestionButton.css';

const QuestionButton = ({
	label,
	isAnswered,
	currentlySelected,
	questionId,
	isCorrect,
}: QuestionButtonProps) => {
	return (
		<ToggleButton
			id={questionId}
			data-current-question={currentlySelected}
			className={classNames(
				'question-button',
				{ 'question-button--selected': currentlySelected },
				{ 'question-button--correct': isAnswered && isCorrect === true },
				{ 'question-button--incorrect': isAnswered && isCorrect === false },
			)}
		>
			{label}
		</ToggleButton>
	);
};

export default QuestionButton;
