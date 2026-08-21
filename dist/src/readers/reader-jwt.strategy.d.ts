import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
interface ReaderJwtPayload {
    sub: string;
    tenantId: string;
    type: 'reader';
}
declare const ReaderJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class ReaderJwtStrategy extends ReaderJwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: ReaderJwtPayload): {
        readerId: string;
        tenantId: string;
    };
}
export {};
