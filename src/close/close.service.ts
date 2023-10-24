import { Readable } from 'node:stream';
import axios from 'axios';
import qs from 'query-string';
import pMap from 'p-map';
import { range } from 'lodash';
import { DateTime, Interval } from 'luxon';

import { logger } from '../logging.service';
import { getConfig } from '../config.service';

const DATE_FORMAT = 'yyyy-MM-dd';

const client = axios.create({
    baseURL: 'https://api.close.com/api/v1',
    auth: { username: getConfig().CLOSE_API_KEY, password: '' },
    paramsSerializer: { serialize: (params) => qs.stringify(params, { arrayFormat: 'comma' }) },
});

export type GetExtractStream = (options: GetIncrementalStreamOptions) => Promise<Readable>;

type GetResourceOptions = { uri: string; params: object };

const getResource = ({ uri, params }: GetResourceOptions) => {
    type GetResourceResponse = { data: object[]; has_more: boolean; total_results: number };

    return client.request<GetResourceResponse>({ method: 'GET', url: uri, params });
};

export type GetIncrementalStreamOptions = { start: string; end: string };

export type GetIncrementalStreamConfig = {
    uri: string;
    paramsBuilder: (options: GetIncrementalStreamOptions) => object;
};

export const getResourceStream = ({ uri, paramsBuilder }: GetIncrementalStreamConfig) => {
    return async (options: GetIncrementalStreamOptions) => {
        let count = 0;
        const stream = new Readable({ objectMode: true, read: () => {} });

        const limit = 200;
        const params = paramsBuilder(options);

        const skips = await getResource({ uri, params }).then(({ data }) => {
            return Math.ceil(data.total_results / limit);
        });

        pMap(
            range(0, skips * limit, limit),
            async (skip) => {
                return getResource({ uri, params: { ...params, _limit: limit, _skip: skip } }).then(
                    ({ data }) => {
                        count = count + data.data.length;
                        logger.debug({
                            fn: 'getResourceStream',
                            progress: `${count}/${data.total_results}`,
                        });
                        data.data.forEach((row) => stream.push(row));
                    },
                );
            },
            { concurrency: 10 },
        )
            .then(() => stream.push(null))
            .catch((error) => stream.emit('error', error));

        return stream;
    };
};

export const getActivityStream = ({ uri, paramsBuilder }: GetIncrementalStreamConfig) => {
    return async (options: GetIncrementalStreamOptions) => {
        let count = 0;
        const stream = new Readable({ objectMode: true, read: () => {} });

        const limit = 100;
        const params = Interval.fromDateTimes(
            DateTime.fromFormat(options.start, DATE_FORMAT),
            DateTime.fromFormat(options.end, DATE_FORMAT),
        )
            .splitBy({ day: 1 })
            .map((date) => ({
                start: (<DateTime>date.start).toFormat(DATE_FORMAT),
                end: (<DateTime>date.end).toFormat(DATE_FORMAT),
            }))
            .map(paramsBuilder);

        pMap(
            params,
            async (params) => {
                const get = async (skip = 0): Promise<any> => {
                    return getResource({
                        uri,
                        params: { ...params, _limit: limit, _skip: skip },
                    }).then(({ data }) => {
                        count = count + data.data.length;
                        logger.debug({ fn: 'getActivityStream', progress: count });
                        data.data.forEach((row) => stream.push(row));
                        return data.has_more ? get(skip + limit) : undefined;
                    });
                };

                return get();
            },
            { concurrency: 10 },
        )
            .then(() => stream.push(null))
            .catch((error) => stream.emit('error', error));

        return stream;
    };
};

type GetDimensionStreamConfig = { uri: string };

export const getDimensionStream = ({ uri }: GetDimensionStreamConfig) => {
    return async () => {
        type GetDimensionResponse = { data: object[] };

        const stream = new Readable({ objectMode: true, read: () => {} });

        client
            .request<GetDimensionResponse>({ method: 'GET', url: uri })
            .then(({ data }) => {
                data.data.forEach((row) => stream.push(row));
                stream.push(null);
            })
            .catch((error) => stream.emit('error', error));

        return stream;
    };
};
