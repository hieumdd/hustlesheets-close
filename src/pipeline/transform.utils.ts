import { Transform } from 'node:stream';
import JoiDefault, { Schema } from 'joi';
import { chain } from 'lodash';

import dayjs from '../dayjs';

export const Joi = JoiDefault.defaults((schema) => schema.empty('').allow(null));

export const timestamp = Joi.custom((value) => (value ? dayjs(value).toISOString() : null));

export const transformValidation = (schema: Schema) => {
    return new Transform({
        objectMode: true,
        transform: (row, _, callback) => {
            const { value, error } = schema.validate(row, {
                stripUnknown: true,
                abortEarly: false,
            });

            error
                ? callback(error)
                : callback(null, { ...value, _batched_at: dayjs.utc().toISOString() });
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
