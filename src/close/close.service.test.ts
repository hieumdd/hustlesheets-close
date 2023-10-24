import { getIncrementalStream } from './close.service';

it('getIncrementalStream', (done) => {
    getIncrementalStream({
        uri: 'lead',
        paramsBuilder: () => ({
            query: `sort:updated date_updated >= 2023-10-08 date_updated <= 2023-10-09`,
        }),
    })({ start: '', end: '' }).then((stream) => {
        stream
            .on('data', (row) => console.log(row))
            .on('close', done)
            .on('error', (error) => done(error));
    });
});
