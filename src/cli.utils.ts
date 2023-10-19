import { program } from 'commander';
import Joi from 'joi';

import { logger } from './logging.service';

export const executeCommands = async (
    schema: Joi.Schema,
    handler: (value: any) => Promise<any>,
) => {
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, () => {
            logger.info({ action: 'interupt' });
            process.exit(0);
        });
    });

    const opts = program
        .option('-p, --pipeline <name>')
        .option('-s, --start <start>')
        .option('-e, --end <end>')
        .parse(process.argv)
        .opts();
    logger.debug({ fn: 'parseCommands', opts });

    const { value, error } = schema.validate(opts);

    if (error) {
        logger.warn({ fn: 'index', error });
        return;
    }

    return handler(value)
        .then(() => logger.info({ fn: 'index', value, status: 'done' }))
        .catch((error) => logger.error({ fn: 'index', error }));
};
