import { Transform } from 'node:stream';
import JoiDefault, { Schema } from 'joi';
import { chain } from 'lodash';
import { DateTime } from 'luxon';

export const Joi = JoiDefault.defaults((schema) => schema.empty('').allow(null));

export const timestamp = Joi.custom((value) => (value ? DateTime.fromISO(value).toJSON() : null));

export const transformValidation = (schema: Schema) => {
    return new Transform({
        objectMode: true,
        transform: (row, _, callback) => {
            schema
                .validateAsync(row, { stripUnknown: true, abortEarly: false })
                .then((value) => callback(null, { ...value, _batched_at: DateTime.utc().toJSON() }))
                .catch((error) => callback(error));
        },
    });
};

export const transformCustomFields = () => {
    return new Transform({
        objectMode: true,
        transform: (row, _, callback) => {
            const custom = chain(row)
                .entries()
                .filter(([key]) => !!key.match(/^custom.cf_.*$/))
                .map(([key, value]) => {
                    const [_, id] = key.split('.');
                    return { id, value: JSON.stringify(value) };
                })
                .value();

            callback(null, { ...row, custom });
        },
    });
};
