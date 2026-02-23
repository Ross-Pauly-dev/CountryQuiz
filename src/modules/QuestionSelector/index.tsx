import React, { useCallback } from 'react';
import { ToggleButtonGroup } from 'react-aria-components';
import type { QuestionSelectorProps } from './types';
import './QuestionSelector.css';
import QuestionButton from '../../components/QuestionButton';
import { useQuizStore } from '../../store/quizStore';

const QuestionSelector = ({ containerRef }: QuestionSelectorProps) => {
	const {
		answeredQuestions,
		currentQuestionId,
		setCurrentQuestion,
		questions,
	} = useQuizStore();
	const selectedKeys = currentQuestionId
		? new Set([currentQuestionId])
		: new Set<string>();

	const handleQuestionSelection = useCallback(
		(keys: Set<React.Key>) => {
			const key = keys.keys().next().value;
			if (key != null) {
				setCurrentQuestion(String(key));
			}
		},
		[setCurrentQuestion],
	);

	return (
		<div
			tabIndex={-1}
			className='question-selector-wrapper'
		>
			<ToggleButtonGroup
				ref={containerRef}
				aria-label='Question number'
				selectionMode='single'
				selectedKeys={selectedKeys}
				onSelectionChange={handleQuestionSelection}
				disallowEmptySelection
				className='question-selector'
			>
				{questions.map((q, index) => {
					const answeredQuestion = answeredQuestions.find(
						(aq) => aq.questionId === q.id,
					);
					const isAnswered = !!answeredQuestion;
					const isCorrect = answeredQuestion
						? answeredQuestion.selectedAnswerId ===
							answeredQuestion.correctAnswerId
						: undefined;

					return (
						<QuestionButton
							key={q.id}
							questionId={q.id}
							label={String(index + 1)}
							isAnswered={isAnswered}
							currentlySelected={currentQuestionId === q.id}
							isCorrect={isCorrect}
						/>
					);
				})}
			</ToggleButtonGroup>
		</div>
	);
};

export default QuestionSelector;
