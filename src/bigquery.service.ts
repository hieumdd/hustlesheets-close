import { BigQuery } from '@google-cloud/bigquery';

import { logger } from './logging.service';
import { getConfig } from './config.service';

const client = new BigQuery();

const dataset = getConfig().BIGQUERY_DATASET;

export type CreateLoadStreamConfig = {
    schema: Record<string, any>[];
    writeDisposition: 'WRITE_APPEND' | 'WRITE_TRUNCATE';
    partitionField?: string;
};

export const createLoadStream = (options: CreateLoadStreamConfig, table: string) => {
    const { schema, writeDisposition, partitionField } = options;

    return client
        .dataset(dataset)
        .table(writeDisposition === 'WRITE_TRUNCATE' ? table : `p_${table}`)
        .createWriteStream({
            schema: { fields: [...schema, { name: '_batched_at', type: 'TIMESTAMP' }] },
            timePartitioning: partitionField ? { field: partitionField, type: 'DAY' } : undefined,
            sourceFormat: 'NEWLINE_DELIMITED_JSON',
            createDisposition: 'CREATE_IF_NEEDED',
            writeDisposition,
        })
        .on('job', () => logger.debug({ fn: 'load', table }));
};
