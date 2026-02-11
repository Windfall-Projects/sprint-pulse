import { Hono } from 'hono';
import teams from './routes/teams.ts';
import sprints from './routes/sprints.ts';
import surveys from './routes/surveys.ts';

const app = new Hono().basePath('/api');

app.route('/teams', teams);
app.route('/sprints', sprints);
app.route('/surveys', surveys);

Deno.serve(app.fetch);
