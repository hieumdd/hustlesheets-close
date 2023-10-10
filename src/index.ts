import { program } from 'commander';

import { logger } from './logging.service';

import * as pipelines from './pipeline/pipeline.const';
import { runPipeline } from './pipeline/pipeline.service';
import { RunPipelineBodySchema } from './pipeline/pipeline.request.dto';

['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
        logger.info({ action: 'interupt' });
        process.exit(0);
    });
});

(async () => {
    program
        .requiredOption(
            '-p, --pipeline <name>',
            `[Required] Pipeline name, allowed values are ${JSON.stringify(
                Object.keys(pipelines),
            )}`,
        )
        .option(
            '-s, --start <start>',
            `for resource based pipelines, in YYYY-MM-DD format. If left blank then it will default to config's settings`,
        )
        .option(
            '-e, --end <end>',
            `for resource based pipelines, in YYYY-MM-DD format. If left blank then it will default to config's settings`,
        );
    program.parse(process.argv);

    const opts = program.opts();

    logger.debug({ fn: 'index', opts });

    const { value, error } = RunPipelineBodySchema.validate(opts);

    if (error) {
        logger.warn({ fn: 'index', error });
        return;
    }

    logger.info({ fn: 'index', value, status: 'start' });
    await runPipeline(pipelines[value.pipeline], value)
        .then(() => logger.info({ fn: 'index', value, status: 'done' }))
        .catch((error) => logger.error({ fn: 'index', error }));
})();
