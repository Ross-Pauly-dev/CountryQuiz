import express from 'express';
import cors from 'cors';
import { fetchAllCountries } from './restCountriesClient.js';
import { generateQuestions } from './questionService.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

const DEFAULT_COUNT = 10;
const MIN_COUNT = 1;
const MAX_COUNT = 20;

// Allow comma-separated origins; default localhost for local dev. No env = local only.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());

app.get('/questions', async (req, res) => {
  try {
    const countParam = req.query.count;
    const count = countParam !== undefined
      ? Number(countParam)
      : DEFAULT_COUNT;

    if (
      !Number.isInteger(count) ||
      Number.isNaN(count) ||
      count < MIN_COUNT ||
      count > MAX_COUNT
    ) {
      res.status(400).json({
        error: `Invalid count. Use a number between ${MIN_COUNT} and ${MAX_COUNT}.`,
      });
      return;
    }

    const countries = await fetchAllCountries();
    const questions = generateQuestions(countries, count);

    if (questions.length === 0) {
      res.status(500).json({
        error: 'Could not generate questions from country data.',
      });
      return;
    }

    res.json(questions);
  } catch (err) {
    console.error('Error fetching or generating questions:', err);
    res.status(502).json({
      error: 'Failed to fetch countries. Please try again later.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
