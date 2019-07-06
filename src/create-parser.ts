import { CookieEncoder } from './encoder';
import { CookieParserOptions } from './options';
import { CookieParser } from './parser';

export function createCookieParser(options?: CookieParserOptions): CookieParser {
    const opts: Required<CookieParserOptions> = {
        encoder: new CookieEncoder(),
        getTime: Date.now,
        strict: false,
        ...(options || {})
    };

    return new CookieParser(opts.encoder, options);
}
