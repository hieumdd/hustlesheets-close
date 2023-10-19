import { JobsClient, protos } from '@google-cloud/run';

import { getConfig } from './config.service';

const client = new JobsClient();

export const runJob = async (
    override: protos.google.cloud.run.v2.RunJobRequest.Overrides.IContainerOverride,
) => {
    const { JOB_PREFIX } = getConfig();

    return client.runJob({
        name: `${JOB_PREFIX}-executor`,
        overrides: { containerOverrides: [override] },
    });
};
