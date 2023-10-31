import Joi from 'joi';

type Config = {
    GOOGLE_APPLICATION_CREDENTIALS: string;
    CLOSE_API_KEY: string;
    BIGQUERY_DATASET: string;
};

const ConfigSchema = Joi.object<Config>({
    GOOGLE_APPLICATION_CREDENTIALS: Joi.string().required(),
    CLOSE_API_KEY: Joi.string().required(),
    BIGQUERY_DATASET: Joi.string().required(),
});

export const getConfig = () => {
    return Joi.attempt(
        {
            GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            CLOSE_API_KEY: process.env.CLOSE_API_KEY,
            BIGQUERY_DATASET: process.env.BIGQUERY_DATASET,
        },
        ConfigSchema,
    );
};
