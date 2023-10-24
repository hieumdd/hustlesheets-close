import { getActivityStream } from './close.service';

it('getResourceStream', (done) => {
    const extractStream = getActivityStream({
        uri: 'lead',
        paramsBuilder: () => ({
            query: `sort:updated date_updated >= 2023-10-08 date_updated <= 2023-10-09`,
        }),
    })({});

    extractStream
        .on('data', (row) => console.log(row))
        .on('close', done)
        .on('error', (error) => done(error));
});
