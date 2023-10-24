import 'dotenv/config';
import { readJSONSync } from 'fs-extra';
import gulp, { TaskFunction } from 'gulp';
import execa from 'execa';

import { getConfig } from './src/config.service';

const execaOptions = { stdio: 'inherit' } as const;
const {
    GOOGLE_APPLICATION_CREDENTIALS,
    CLOSE_API_KEY,
    BIGQUERY_DATASET,
    REGION,
    IMAGE,
    JOB_PREFIX,
} = getConfig();

const getProjectId = () => readJSONSync(GOOGLE_APPLICATION_CREDENTIALS).project_id;

export const activateServiceAccount: TaskFunction = (done) => {
    execa.sync(
        'gcloud',
        ['auth', 'activate-service-account', `--key-file=${GOOGLE_APPLICATION_CREDENTIALS}`],
        execaOptions,
    );
    execa.sync('gcloud', ['config', 'set', 'project', getProjectId()], execaOptions);
    execa.sync('gcloud', ['auth', 'configure-docker']);
    done();
};

export const createArtifactRegistry: TaskFunction = (done) => {
    execa(
        'gcloud',
        [
            'artifacts',
            'repositories',
            'create',
            'docker-1',
            '--repository-format=docker',
            '--location=us',
            '--quiet',
        ],
        execaOptions,
    ).then(
        () => done(),
        () => done(),
    );
};

export const buildImage: TaskFunction = (done) => {
    execa.sync('docker', ['build', `-t=${IMAGE}`, '.'], execaOptions);
    execa.sync('docker', ['push', IMAGE]);
    done();
};

export const createJobs: TaskFunction = (done) => {
    const cmdArgs = ['run', 'jobs', 'create', `--region=${REGION}`];
    Promise.allSettled([
        execa(
            'gcloud',
            [...cmdArgs, `${JOB_PREFIX}-master`, `--image=${IMAGE}`, `--args='dist/index.js'`],
            execaOptions,
        ),
        execa(
            'gcloud',
            [...cmdArgs, `${JOB_PREFIX}-executor`, `--image=${IMAGE}`, `--args='dist/executor.js'`],
            execaOptions,
        ),
    ])
        .then(() => done())
        .catch((error) => done(error));
};
