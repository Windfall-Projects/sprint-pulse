import { Hono } from 'hono';
import profiles from './routes/profiles.ts';
import accounts from './routes/accounts.ts';
import accountMembers from './routes/account-members.ts';
import teams from './routes/teams.ts';
import teamMembers from './routes/team-members.ts';
import sprints from './routes/sprints.ts';
import projects from './routes/projects.ts';
import workItems from './routes/work-items.ts';
import surveys from './routes/surveys.ts';
import surveyResponses from './routes/survey-responses.ts';
import kudos from './routes/kudos.ts';
import sprintCommitments from './routes/sprint-commitments.ts';
import sprintSnapshots from './routes/sprint-snapshots.ts';
import historicalMetrics from './routes/historical-metrics.ts';
import integrations from './routes/integrations.ts';
import github from './routes/github.ts';

const app = new Hono().basePath('/api');

app.route('/profiles', profiles);
app.route('/accounts', accounts);
app.route('/account-members', accountMembers);
app.route('/teams', teams);
app.route('/team-members', teamMembers);
app.route('/sprints', sprints);
app.route('/projects', projects);
app.route('/work-items', workItems);
app.route('/surveys', surveys);
app.route('/survey-responses', surveyResponses);
app.route('/kudos', kudos);
app.route('/sprint-commitments', sprintCommitments);
app.route('/sprint-snapshots', sprintSnapshots);
app.route('/historical-metrics', historicalMetrics);
app.route('/integrations', integrations);
app.route('/github', github);

Deno.serve(app.fetch);
