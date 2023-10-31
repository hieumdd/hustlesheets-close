import { Readable } from 'node:stream';
import axios from 'axios';
import qs from 'query-string';
import pMap from 'p-map';
import { DateTime, Interval } from 'luxon';

import { DATE_FORMAT } from '../luxon.utils';
import { logger } from '../logging.service';
import { getConfig } from '../config.service';

const client = axios.create({
    baseURL: 'https://api.close.com/api/v1',
    auth: { username: getConfig().CLOSE_API_KEY, password: '' },
    paramsSerializer: { serialize: (params) => qs.stringify(params, { arrayFormat: 'comma' }) },
});

type GetResponse = { data: object[]; has_more: boolean };

export type GetExtractStream = (options: GetIncrementalStreamOptions) => Promise<Readable>;

export type GetIncrementalStreamOptions = { start: string; end: string };

export type GetIncrementalStreamConfig = {
    uri: string;
    paramsBuilder: (options: GetIncrementalStreamOptions) => object;
};

export const getIncrementalStream = ({ uri, paramsBuilder }: GetIncrementalStreamConfig) => {
    return async (options: GetIncrementalStreamOptions) => {
        let count = 0;
        const stream = new Readable({ objectMode: true, read: () => {} });

        const limit = 100;
        const params = Interval.fromDateTimes(
            DateTime.fromFormat(options.start, DATE_FORMAT),
            DateTime.fromFormat(options.end, DATE_FORMAT),
        )
            .splitBy({ day: 1 })
            .map((date: Interval) => ({
                start: (<DateTime>date.start).toFormat(DATE_FORMAT),
                end: (<DateTime>date.end).toFormat(DATE_FORMAT),
            }))
            .map(paramsBuilder);

        pMap(
            params,
            async (params) => {
                const get = async (skip = 0): Promise<any> => {
                    return client
                        .request<GetResponse>({
                            method: 'GET',
                            url: uri,
                            params: { ...params, _limit: limit, _skip: skip },
                        })
                        .then(({ data }) => {
                            count = count + data.data.length;
                            logger.debug({ fn: 'getIncrementalStream', uri, progress: count });
                            data.data.forEach((row) => stream.push(row));
                            return data.has_more ? get(skip + limit) : undefined;
                        });
                };

                return get();
            },
            { concurrency: 10 },
        )
            .then(() => stream.push(null))
            .catch((error) => {
                logger.error({ fn: 'getIncrementalStream', error });
                stream.emit('error', error);
            });

        return stream;
    };
};

type GetDimensionStreamConfig = { uri: string };

export const getDimensionStream = ({ uri }: GetDimensionStreamConfig) => {
    return async () => {
        const stream = new Readable({ objectMode: true, read: () => {} });

        client
            .request<GetResponse>({ method: 'GET', url: uri })
            .then(({ data }) => {
                logger.debug({ fn: 'getDimensionStream', uri });
                data.data.forEach((row) => stream.push(row));
                stream.push(null);
            })
            .catch((error) => {
                logger.error({ fn: 'getDimensionStream', error });
                stream.emit('error', error);
            });

        return stream;
    };
};
