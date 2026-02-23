import { useCallback, useRef } from 'react';
import { RadioGroup } from 'react-aria-components';
import './AnswerSection.css';
import AnswerButton from '../../components/AnswerButton';
import { useQuizStore } from '../../store/quizStore';

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const AnswerSection = () => {
	const optionsRef = useRef<HTMLDivElement>(null);
	const { questions, currentQuestionId, answeredQuestions, submitAnswer } =
		useQuizStore();
	const question = questions.find((q) => q.id === currentQuestionId);
	const selectedAnswerId = answeredQuestions.find(
		(aq) => aq.questionId === currentQuestionId,
	)?.selectedAnswerId;

	const answeredEntry = answeredQuestions.find(
		(aq) => aq.questionId === currentQuestionId,
	);
	const liveMessage =
		question && answeredEntry
			? answeredEntry.selectedAnswerId === answeredEntry.correctAnswerId
				? `Correct. ${question.answers.find((a) => a.id === answeredEntry.selectedAnswerId)?.text ?? ''}.`
				: `Incorrect. The correct answer was ${question.answers.find((a) => a.id === answeredEntry.correctAnswerId)?.text ?? ''}.`
			: '';

	const headingId = `answer-section-question-${currentQuestionId}`;

	const handleAnswerChange = useCallback(
		(value: string) => {
			if (currentQuestionId) {
				submitAnswer(currentQuestionId, value);
			}
		},
		[currentQuestionId, submitAnswer],
	);

	const handleKeyDownCapture = useCallback((e: React.KeyboardEvent) => {
		if (!ARROW_KEYS.includes(e.key) || !optionsRef.current) {
			return;
		} else {
			e.preventDefault();
			e.stopPropagation();
			// get all the radio buttons (Answer Buttons) in the group
			// make sure they are not disabled
			const radios = Array.from(
				optionsRef.current.querySelectorAll<HTMLInputElement>(
					'input[type="radio"]:not([disabled])',
				),
			);

			// Make sure we have an active element
			const currentIndex = radios.indexOf(
				document.activeElement as HTMLInputElement,
			);
			if (currentIndex === -1) {
				return;
			}

			// Determine if we are moving forward or backward
			const isNext = e.key === 'ArrowDown' || e.key === 'ArrowRight';

			// Calculate next index and modulo to wrap around
			const nextIndex = isNext
				? (currentIndex + 1) % radios.length
				: (currentIndex - 1 + radios.length) % radios.length;
			radios[nextIndex]?.focus();
		}
	}, []);

	return (
		question &&
		currentQuestionId && (
			<section
				className='answer-section'
				aria-labelledby={headingId}
				role='region'
			>
				<div
					className='answer-section__sr-only'
					aria-live='polite'
					aria-atomic='true'
				>
					{liveMessage}
				</div>
				<h2
					id={headingId}
					className='answer-section__question'
				>
					{question.question}
				</h2>
				<div
					ref={optionsRef}
					tabIndex={0}
					onFocus={(e) => {
						// Create tab stop since roving tab index is used by the RadioGroup
						if (e.target === e.currentTarget) {
							const first = optionsRef.current?.querySelector<HTMLInputElement>(
								'input[type="radio"]:not([disabled])',
							);
							first?.focus();
						}
					}}
					onKeyDownCapture={handleKeyDownCapture}
				>
					<RadioGroup
						key={question.id}
						name={`answer-section-${question.id}`}
						value={selectedAnswerId ?? ''}
						onChange={handleAnswerChange}
						aria-labelledby={headingId}
						className='answer-section__options'
					>
						{question.answers.map((answer) => (
							<AnswerButton
								key={answer.id}
								answerId={answer.id}
								answerText={answer.text}
								{...(selectedAnswerId && {
									isDisabled: true,
									showAsCorrect:
										answer.id === selectedAnswerId &&
										answer.id === question.correctAnswerId,
									showAsIncorrect:
										answer.id === selectedAnswerId &&
										answer.id !== question.correctAnswerId,
									showCorrectCheckMark:
										!!selectedAnswerId &&
										answer.id === question.correctAnswerId &&
										selectedAnswerId !== question.correctAnswerId,
								})}
							/>
						))}
					</RadioGroup>
				</div>
			</section>
		)
	);
};

export default AnswerSection;
