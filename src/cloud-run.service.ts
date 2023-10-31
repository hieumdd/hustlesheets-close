import { JobsClient } from '@google-cloud/run';

const client = new JobsClient();

export const runJob = async (args: string[]) => {
    return client.runJob({
        name: `close-etl-executor`,
        overrides: { containerOverrides: [{ args }] },
    });
};
