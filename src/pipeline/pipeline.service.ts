import { pipeline } from 'node:stream/promises';
import ndjson from 'ndjson';

import { logger } from '../logging.service';
import { createLoadStream } from '../bigquery.service';
import { Subcommand } from '../subcommand.enum';
import { RunPipelineOptions } from './pipeline.request.dto';
import * as pipelines from './pipeline.const';
import { runJob } from '../cloud-run.service';

export const runPipeline = async (_pipeline: pipelines.Pipeline, options: RunPipelineOptions) => {
    logger.info({ fn: 'runPipeline', pipeline: _pipeline.name, options });

    return pipeline([
        await _pipeline.getExtractStream(options),
        ..._pipeline.transforms,
        ndjson.stringify(),
        createLoadStream(_pipeline.loadConfig, _pipeline.name),
    ]).then(() => options);
};

export const createPipelineRuns = async (options: RunPipelineOptions) => {
    logger.info({ fn: 'createRunPipelineExecutions', options });

    return Promise.all(
        Object.keys(pipelines).map((key) => {
            const args = [
                Subcommand.EXECUTE,
                `-p ${key}`,
                `-s ${options.start}`,
                `-e ${options.end}`,
            ];
            return runJob(args);
        }),
    ).then(() => options);
};
