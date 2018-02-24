import { CookieEncoder } from './encoder';
import { InvalidCookieEncoderError } from './errors';
import { CookieOptions, CookieParserOptions } from './options';
export type Purify<T extends string> = { [P in T]: T }[T];
export type Required<T> = { [key in Purify<keyof T>]: T[key] & {} };

/**
 * @private
 */
export function mergeEncoder(
    defaults: CookieEncoder,
    encoder?: CookieEncoder
): Required<CookieEncoder> {
    const enc: CookieEncoder = encoder || {};
    const result: Required<CookieEncoder> = {
        parseDomain:
            typeof enc.parseDomain === 'function'
                ? enc.parseDomain
                : typeof defaults.parseDomain === 'function'
                  ? defaults.parseDomain
                  : (domain: string | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('parseDomain');
                    },
        parseExpires:
            typeof enc.parseExpires === 'function'
                ? enc.parseExpires
                : typeof defaults.parseExpires === 'function'
                  ? defaults.parseExpires
                  : (expires: string | undefined): number | undefined => {
                        throw new InvalidCookieEncoderError('parseExpires');
                    },
        parseMaxAge:
            typeof enc.parseMaxAge === 'function'
                ? enc.parseMaxAge
                : typeof defaults.parseMaxAge === 'function'
                  ? defaults.parseMaxAge
                  : (maxAge: string | undefined): number | undefined => {
                        throw new InvalidCookieEncoderError('parseMaxAge');
                    },
        parseName:
            typeof enc.parseName === 'function'
                ? enc.parseName
                : typeof defaults.parseName === 'function'
                  ? defaults.parseName
                  : (name: string | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('parseName');
                    },
        parsePath:
            typeof enc.parsePath === 'function'
                ? enc.parsePath
                : typeof defaults.parsePath === 'function'
                  ? defaults.parsePath
                  : (path: string | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('parsePath');
                    },
        parseValue:
            typeof enc.parseValue === 'function'
                ? enc.parseValue
                : typeof defaults.parseValue === 'function'
                  ? defaults.parseValue
                  : (value: string | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('parseValue');
                    },
        serializeDomain:
            typeof enc.serializeDomain === 'function'
                ? enc.serializeDomain
                : typeof defaults.serializeDomain === 'function'
                  ? defaults.serializeDomain
                  : (domain: string | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('serializeDomain');
                    },
        serializeExpires:
            typeof enc.serializeExpires === 'function'
                ? enc.serializeExpires
                : typeof defaults.serializeExpires === 'function'
                  ? defaults.serializeExpires
                  : (expires: number | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('serializeExpires');
                    },
        serializeMaxAge:
            typeof enc.serializeMaxAge === 'function'
                ? enc.serializeMaxAge
                : typeof defaults.serializeMaxAge === 'function'
                  ? defaults.serializeMaxAge
                  : (maxAge: number | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('serializeMaxAge');
                    },
        serializeName:
            typeof enc.serializeName === 'function'
                ? enc.serializeName
                : typeof defaults.serializeName === 'function'
                  ? defaults.serializeName
                  : (name: string | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('serializeName');
                    },
        serializePath:
            typeof enc.serializePath === 'function'
                ? enc.serializePath
                : typeof defaults.serializePath === 'function'
                  ? defaults.serializePath
                  : (path: string | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('serializePath');
                    },
        serializeValue:
            typeof enc.serializeValue === 'function'
                ? enc.serializeValue
                : typeof defaults.serializeValue === 'function'
                  ? defaults.serializeValue
                  : (value: string | undefined): string | undefined => {
                        throw new InvalidCookieEncoderError('serializeValue');
                    }
    };

    return result;
}

/**
 * @private
 */
export function mergeCookieParserOptions(
    defaults: CookieOptions,
    options?: CookieParserOptions
): Required<CookieParserOptions> {
    if (options) {
        return {
            encoder: mergeEncoder(defaults.encoder, options.encoder),
            encoderOptions: options.encoderOptions
                ? { ...defaults.encoderOptions, ...options.encoderOptions }
                : { ...defaults.encoderOptions },
            strict: typeof options.strict === 'boolean' ? options.strict : defaults.strict
        };
    }
    return {
        encoder: { ...defaults.encoder },
        encoderOptions: { ...defaults.encoderOptions },
        strict: defaults.strict
    };
}

/**
 * @private
 */
export function mergeOptionsWithDefaults(defaults: CookieOptions): Required<CookieOptions> {
    return {
        encoder: mergeEncoder(defaults.encoder),
        encoderOptions: {
            getTime: Date.now,
            strict: true,
            ...(defaults.encoderOptions || {})
        },
        getTime: Date.now,
        strict: true
    };
}
