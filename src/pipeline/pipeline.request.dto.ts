import Joi from 'joi';
import { DateTime } from 'luxon';

import { DATE_FORMAT } from '../luxon.utils';
import * as pipelines from './pipeline.const';

export type RunPipelineOptions = { start: string; end: string };

type RunPipelineBody = RunPipelineOptions & { pipeline: keyof typeof pipelines };

export const RunPipelineBodySchema = Joi.object<RunPipelineBody>({
    start: Joi.string()
        .optional()
        .empty(null)
        .allow(null)
        .default(DateTime.utc().minus({ day: 7 }).toFormat(DATE_FORMAT)),
    end: Joi.string()
        .optional()
        .empty(null)
        .allow(null)
        .default(DateTime.utc().minus({ day: 7 }).toFormat(DATE_FORMAT)),
    pipeline: Joi.string().valid(...Object.keys(pipelines)),
});
