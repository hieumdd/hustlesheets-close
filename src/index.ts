import { program } from 'commander';

import { logger } from './logging.service';
import { Subcommand } from './subcommand.enum';
import * as pipelines from './pipeline/pipeline.const';
import { createPipelineRuns, runPipeline } from './pipeline/pipeline.service';
import {
    CreatePipelineRunsRequestSchema,
    RunPipelineRequestSchema,
} from './pipeline/pipeline.request.dto';

['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
        logger.info({ action: 'interupt' });
        process.exit(0);
    });
});

program
    .command(Subcommand.QUEUE)
    .option('-s, --start <start>')
    .option('-e, --end <end>')
    .action(async (value) => {
        return CreatePipelineRunsRequestSchema.validateAsync(value)
            .then(async (options) => {
                return createPipelineRuns(options)
                    .then(() => {
                        logger.info({ command: Subcommand.QUEUE, value, status: 'done' });
                        process.exit(0);
                    })
                    .catch((error) => {
                        logger.error({ command: Subcommand.QUEUE, error });
                        process.exit(1);
                    });
            })
            .catch((error) => {
                logger.warn({ command: Subcommand.QUEUE, error });
                process.exit(1);
            });
    });

program
    .command(Subcommand.EXECUTE)
    .requiredOption('-p, --pipeline <pipeline>')
    .option('-s, --start <start>')
    .option('-e, --end <end>')
    .action(async (value) => {
        return RunPipelineRequestSchema.validateAsync(value)
            .then(async (options) => {
                return runPipeline(pipelines[options.pipeline], options)
                    .then(() => {
                        logger.info({ command: Subcommand.QUEUE, value, status: 'done' });
                        process.exit(0);
                    })
                    .catch((error) => {
                        logger.error({ command: Subcommand.QUEUE, error });
                        process.exit(1);
                    });
            })
            .catch((error) => {
                logger.warn({ command: Subcommand.QUEUE, error });
                process.exit(1);
            });
    });

program.parse();
