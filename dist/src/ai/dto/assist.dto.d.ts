import type { AiTaskName } from '../ai.tasks';
export declare class AssistDto {
    task: AiTaskName;
    title: string;
    content?: string;
    spot?: string;
}
