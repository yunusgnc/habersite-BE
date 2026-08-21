export type AiTaskName = 'spot' | 'seo' | 'tags' | 'titles';
export declare const AI_TASK_NAMES: AiTaskName[];
type TaskSpec = {
    system: string;
    schema: Record<string, any>;
    maxTokens: number;
};
export declare const AI_TASKS: Record<AiTaskName, TaskSpec>;
export {};
