import { CookieEncoder } from './encoder';
import { InvalidCookieEncoderError } from './errors';
import { CookieEncoderOptions, CookieParserOptions } from './options';

export function validateEncoder(encoder: CookieEncoder): void {
    const methods: string[] = [
        'parseDomain',
        'parseExpires',
        'parseMaxAge',
        'parseName',
        'parsePath',
        'parseValue',
        'serializeDomain',
        'serializeExpires',
        'serializeMaxAge',
        'serializeName',
        'serializePath',
        'serializeValue'
    ];

    for (const method of methods) {
        if (typeof (encoder as any)[method] !== 'function') {
            throw new InvalidCookieEncoderError(`Missing or invalid method "${method}"!`);
        }
    }
}

/**
 * @private
 */
export function mergeCookieEncoderOptions(
    defaults: Required<CookieEncoderOptions>,
    options: CookieEncoderOptions | undefined | null
): Required<CookieEncoderOptions> {
    const newOptions: CookieEncoderOptions = options || {};

    return {
        getTime: typeof newOptions.getTime === 'function' ? newOptions.getTime : defaults.getTime,
        strict: typeof newOptions.strict === 'boolean' ? newOptions.strict : defaults.strict
    };
}

/**
 * @private
 */
export function mergeCookieParserOptions(
    defaults: Required<CookieParserOptions>,
    options: CookieParserOptions | undefined | null
): Required<CookieParserOptions> {
    const newOptions: CookieParserOptions = options || {};

    const combined: Required<CookieParserOptions> = {
        encoder: newOptions.encoder || defaults.encoder,
        getTime: typeof newOptions.getTime === 'function' ? newOptions.getTime : defaults.getTime,
        strict: typeof newOptions.strict === 'boolean' ? newOptions.strict : defaults.strict
    };

    validateEncoder(combined.encoder);

    return combined;
}

export function cookieParserToEncoderOptions(
    cookieParserOptions: Required<CookieParserOptions>
): Required<CookieEncoderOptions> {
    return { getTime: cookieParserOptions.getTime, strict: cookieParserOptions.strict };
}
