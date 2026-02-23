import { Radio } from 'react-aria-components';
import type { AnswerButtonProps } from './types';
import './AnswerButton.css';
import classNames from 'classnames';

const AnswerButton = ({
	answerId,
	answerText,
	showAsCorrect,
	showAsIncorrect,
	isDisabled,
}: AnswerButtonProps) => {
	return (
		<Radio
			value={answerId}
			className={classNames(
				'answer-button',
				{ 'answer-button__correct': showAsCorrect },
				{ 'answer-button__incorrect': showAsIncorrect },
			)}
			aria-label={answerText}
			isDisabled={isDisabled ?? false}
		>
			<span className='answer-button__text'>{answerText}</span>
		</Radio>
	);
};

export default AnswerButton;
