import Joi from 'joi';

type Config = {
    CLOSE_API_KEY: string;
    BIGQUERY_DATASET: string;
    REGION: string;
    IMAGE: string;
    JOB_PREFIX: string;
};

const ConfigSchema = Joi.object<Config>({
    CLOSE_API_KEY: Joi.string().required(),
    BIGQUERY_DATASET: Joi.string().required(),
    REGION: Joi.string().required(),
    IMAGE: Joi.string().required(),
    JOB_PREFIX: Joi.string().required(),
});

export const getConfig = () => {
    return Joi.attempt(
        {
            CLOSE_API_KEY: process.env.CLOSE_API_KEY,
            BIGQUERY_DATASET: process.env.BIGQUERY_DATASET,
            REGION: process.env.REGION,
            IMAGE: process.env.IMAGE,
            JOB_PREFIX: process.env.JOB_PREFIX,
        },
        ConfigSchema,
    );
};
