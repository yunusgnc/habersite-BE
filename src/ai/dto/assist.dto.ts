import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { AI_TASK_NAMES } from '../ai.tasks';
// `import type`: dekoratör imzasında geçen tip, `isolatedModules` +
// `emitDecoratorMetadata` açıkken tip olarak içe aktarılmak zorunda.
import type { AiTaskName } from '../ai.tasks';

export class AssistDto {
  @IsIn(AI_TASK_NAMES)
  task: AiTaskName;

  @IsString()
  @MaxLength(500)
  title: string;

  /**
   * Editörden gelen HTML. Servis düz metne çevirip kırpıyor; üst sınır burada
   * yalnızca aşırı büyük gövdelerin isteği şişirmesini engellemek için.
   */
  @IsString()
  @IsOptional()
  @MaxLength(200_000)
  content?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  spot?: string;
}
