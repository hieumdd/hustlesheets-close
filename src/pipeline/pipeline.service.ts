import { pipeline } from 'node:stream/promises';
import ndjson from 'ndjson';

import { logger } from '../logging.service';
import { createLoadStream } from '../bigquery.service';
import { RunPipelineOptions } from './pipeline.request.dto';
import * as pipelines from './pipeline.const';

export const runPipeline = async (_pipeline: pipelines.Pipeline, options: RunPipelineOptions) => {
    logger.info({ fn: 'runPipeline', pipeline: _pipeline.name, options });

    return pipeline([
        await _pipeline.getExtractStream(options),
        ..._pipeline.transforms,
        ndjson.stringify(),
        createLoadStream(_pipeline.loadConfig, _pipeline.name),
    ]).then(() => options);
};
