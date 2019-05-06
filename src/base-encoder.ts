import { CookieEncoder } from './encoder';
import { Required } from './option-helpers';
import { CookieEncoderOptions } from './options';

/**
 * Default implementation for CookieEncoder
 */
export class BaseCookieEncoder implements Required<CookieEncoder> {
    serializeDomain(domain?: string): string | undefined {
        if (typeof domain === 'string') {
            return domain;
        }
        return undefined;
    }

    serializeExpires(expires?: number): string | undefined {
        if (Number.isSafeInteger(<number>expires)) {
            const date: Date = new Date(<number>expires);
            if (!isNaN(+date)) {
                return date.toUTCString();
            }
        }
        return undefined;
    }

    serializeMaxAge(
        expires: number | undefined,
        options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (Number.isSafeInteger(<number>expires)) {
            const expirationSecondsFromNow: number = Math.max(
                0,
                (<number>expires - options.getTime()) / 1000
            );
            return expirationSecondsFromNow.toString();
        }
        return undefined;
    }

    serializeName(name?: string): string | undefined {
        if (typeof name === 'string') {
            return name;
        }
        return undefined;
    }

    serializePath(path?: string): string | undefined {
        if (typeof path === 'string') {
            return path;
        }
        return undefined;
    }

    serializeValue(value: string): string | undefined {
        if (typeof value === 'string') {
            return encodeURIComponent(value);
        }
        return undefined;
    }

    parseDomain(domain?: string): string | undefined {
        if (typeof domain === 'string') {
            return domain;
        }
        return undefined;
    }

    parseExpires(expires?: string): number | undefined {
        if (typeof expires === 'string') {
            const result: number = Date.parse(expires);
            if (Number.isSafeInteger(result)) {
                return result;
            }
        }
        return undefined;
    }

    parseMaxAge(
        maxAge: string | undefined,
        options: Required<CookieEncoderOptions>
    ): number | undefined {
        if (typeof maxAge === 'string') {
            const maxAgeNumber: number = +maxAge;
            if (Number.isSafeInteger(maxAgeNumber)) {
                return options.getTime() + maxAgeNumber * 1000;
            }
        }
        return undefined;
    }

    parseName(name?: string): string | undefined {
        if (typeof name === 'string') {
            return name;
        }
        return undefined;
    }

    parsePath(path?: string): string | undefined {
        if (typeof path === 'string') {
            return path;
        }
        return undefined;
    }

    parseValue(value?: string): string | undefined {
        if (typeof value === 'string') {
            // TODO: This can be throw error when an malformed character exists in the passed value.
            return decodeURIComponent(value);
        }
        return undefined;
    }
}
