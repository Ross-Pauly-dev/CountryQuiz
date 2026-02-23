import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../store/quizStore';
import { useQuestionsQuery } from '../../queries';
import QuestionSelector from '../../modules/QuestionSelector';
import AnswerSection from '../../modules/AnswerSection';
import Button from '../../components/Button';
import Card from '../../components/Card';
import './QuizInProgress.css';
import Header from '../../modules/Header';

const QuizInProgress = () => {
	const navigate = useNavigate();
	const { setQuestions, isComplete, answeredQuestions, questions } =
		useQuizStore();
	const questionSelectorRef = useRef<HTMLDivElement>(null);

	const { data, isPending, error } = useQuestionsQuery();

	useEffect(() => {
		if (data?.length) {
			setQuestions(data);
		}
	}, [data, setQuestions]);

	useEffect(() => {
		if (answeredQuestions?.length > 0 && !isComplete) {
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

	if (isPending) {
		return (
			<>
				<Header />
				<div className='quiz-container-inprogress'>
					<Card>
						<p>Loading questions…</p>
					</Card>
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<Header />
				<div className='quiz-container-inprogress'>
					<Card>
						<p role='alert'>{error.message}</p>
						<Button
							label='Try again'
							onPress={() => window.location.reload()}
						/>
					</Card>
				</div>
			</>
		);
	}

	// Wait for store to have questions after data loads
	if (data && questions.length === 0) {
		return (
			<>
				<Header />
				<div className='quiz-container-inprogress'>
					<Card>
						<p>Loading questions…</p>
					</Card>
				</div>
			</>
		);
	}

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
