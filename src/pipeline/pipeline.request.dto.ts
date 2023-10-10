import Joi from 'joi';

import dayjs from '../dayjs';
import * as pipelines from './pipeline.const';

export type RunPipelineOptions = { start: string; end: string };

type RunPipelineBody = RunPipelineOptions & { pipeline: keyof typeof pipelines };

export const RunPipelineBodySchema = Joi.object<RunPipelineBody>({
    start: Joi.string()
        .optional()
        .empty(null)
        .allow(null)
        .default(dayjs.utc().subtract(7, 'day').format('YYYY-MM-DD')),
    end: Joi.string().optional().empty(null).allow(null).default(dayjs.utc().format('YYYY-MM-DD')),
    pipeline: Joi.string().valid(...Object.keys(pipelines)),
});
