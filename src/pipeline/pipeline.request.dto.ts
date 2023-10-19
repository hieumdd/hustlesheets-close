import Joi from 'joi';

import dayjs from '../dayjs';
import * as pipelines from './pipeline.const';

export type RunPipelineOptions = { start: string; end: string };

export const CreatePipelineRunsRequestSchema = Joi.object<RunPipelineOptions>({
    start: Joi.string()
        .optional()
        .empty(null)
        .allow(null)
        .default(dayjs.utc().subtract(7, 'day').format('YYYY-MM-DD')),
    end: Joi.string().optional().empty(null).allow(null).default(dayjs.utc().format('YYYY-MM-DD')),
});

export type RunPipelineRequest = RunPipelineOptions & { pipeline: keyof typeof pipelines };

export const RunPipelineRequestSchema = Joi.object<RunPipelineRequest>({
    start: Joi.string()
        .optional()
        .empty(null)
        .allow(null)
        .default(dayjs.utc().subtract(7, 'day').format('YYYY-MM-DD')),
    end: Joi.string().optional().empty(null).allow(null).default(dayjs.utc().format('YYYY-MM-DD')),
    pipeline: Joi.string().valid(...Object.keys(pipelines)),
});
