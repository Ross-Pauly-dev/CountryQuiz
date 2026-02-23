import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../store/quizStore';
import { questions as questionsStub } from '../../stub/questions_stub';
import QuestionSelector from '../../modules/QuestionSelector';
import AnswerSection from '../../modules/AnswerSection';
import Button from '../../components/Button';
import Card from '../../components/Card';
import './QuizInProgress.css';
import Header from '../../modules/Header';

const QuizInProgress = () => {
	const navigate = useNavigate();
	const { setQuestions, isComplete, resetQuiz, answeredQuestions } =
		useQuizStore();
	const questionSelectorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isComplete) {
			resetQuiz();
		}
		const questions = questionsStub;
		setQuestions(questions);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (answeredQuestions?.length > 0 && !isComplete) {
			// Focus the current question button after we answer a question
			// Make sure it is not the last question, if it is, focus the see results button (elsewhere)
			const currentQuestion = questionSelectorRef.current?.querySelector(
				'[data-current-question="true"]',
			);
			if (currentQuestion) {
				requestAnimationFrame(() => {
					(currentQuestion as HTMLElement).focus();
				});
			}
		}
	}, [answeredQuestions, isComplete]);

	const handleNavigateToResults = useCallback(() => {
		navigate('/results');
	}, [navigate]);

	return (
		<>
			<Header />
			<div className='quiz-container-inprogress'>
				<Card>
					<QuestionSelector containerRef={questionSelectorRef} />
					<AnswerSection />
					{isComplete && (
						<Button
							ref={(node) => {
								if (node) {
									requestAnimationFrame(() => node.focus());
								}
							}}
							label='See results'
							onPress={handleNavigateToResults}
						/>
					)}
				</Card>
			</div>
		</>
	);
};

export default QuizInProgress;
