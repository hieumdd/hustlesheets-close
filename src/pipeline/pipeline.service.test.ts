import * as pipelines from './pipeline.const';
import { runPipeline } from './pipeline.service';

it('pipeline', async () => {
    return runPipeline(pipelines.ActivityCall, {
        start: '2023-09-01',
        end: '2023-09-15',
    })
        .then((results) => expect(results).toBeDefined())
        .catch((error) => {
            console.error({ error });
            throw error;
        });
}, 100_000_000);
