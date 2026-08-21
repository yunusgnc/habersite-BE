import { PipeTransform } from '@nestjs/common';
export declare class ParseCursorPipe implements PipeTransform<string | undefined> {
    transform(value: string | undefined): string | undefined;
}
