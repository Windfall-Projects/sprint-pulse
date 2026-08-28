import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

// HistoricalMetrics
type DBHistoricalMetric = Tables<'historical_metrics'>;
type ZodHistoricalMetric = z.infer<typeof schemas.HistoricalMetricSchema>;
const m29: Exclude<keyof ZodHistoricalMetric, keyof DBHistoricalMetric> = null as never;
const m30: Exclude<keyof DBHistoricalMetric, keyof ZodHistoricalMetric> = null as never;
