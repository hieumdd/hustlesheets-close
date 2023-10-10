import Joi from 'joi';

type Config = {
    CLOSE_API_KEY: string;
    BIGQUERY_DATASET: string;
};

const ConfigSchema = Joi.object<Config>({
    CLOSE_API_KEY: Joi.string().required(),
    BIGQUERY_DATASET: Joi.string().required(),
});

export const getConfig = () => {
    return Joi.attempt(
        {
            CLOSE_API_KEY: process.env.CLOSE_API_KEY,
            BIGQUERY_DATASET: process.env.BIGQUERY_DATASET,
        },
        ConfigSchema,
    );
};
