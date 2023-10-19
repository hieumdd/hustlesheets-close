import * as pipelines from './pipeline/pipeline.const';
import { runPipeline } from './pipeline/pipeline.service';
import { RunPipelineRequest, RunPipelineRequestSchema } from './pipeline/pipeline.request.dto';
import { executeCommands } from './cli.utils';

(async () => {
    return await executeCommands(RunPipelineRequestSchema, (value: RunPipelineRequest) => {
        return runPipeline(pipelines[value.pipeline], value);
    });
})();
