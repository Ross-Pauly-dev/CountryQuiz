import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../store/quizStore';
import Header from '../../modules/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import './Results.css';

const Results = () => {
  const navigate = useNavigate();
  const { questions, numCorrectAnswers, resetQuiz } = useQuizStore();

  const handleGenerateNewQuiz = useCallback(() => {
    resetQuiz();
    navigate('/quiz');
  }, [resetQuiz, navigate]);

  return (
    <>
      <Header />
      <div className="results-container">
        <Card>
          <h2 className="results-container__title">Results</h2>
          <p className="results-container__score">
            You got {numCorrectAnswers} out of {questions.length} correct.
          </p>
          <Button onPress={handleGenerateNewQuiz}>
            Generate new quiz
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Results;
