import { CreateBreakingNewsDto } from './create-breaking-news.dto';
declare const UpdateBreakingNewsDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBreakingNewsDto>>;
export declare class UpdateBreakingNewsDto extends UpdateBreakingNewsDto_base {
    active?: boolean;
}
export {};
