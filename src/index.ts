import { createPipelineRuns } from './pipeline/pipeline.service';
import {
    CreatePipelineRunsRequestSchema,
    RunPipelineOptions,
} from './pipeline/pipeline.request.dto';
import { executeCommands } from './cli.utils';

(async () => {
    return await executeCommands(CreatePipelineRunsRequestSchema, (value: RunPipelineOptions) => {
        return createPipelineRuns(value);
    });
})();
