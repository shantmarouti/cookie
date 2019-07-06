import { CookieEncoderOptions } from './options';

/**
 * This interface defines methods used for serializaing/encoding/encrypting
 * diffrent portions of cookie.
 * You can provide your own implementation if the default one dont satisfy your needs.
 */
export class CookieEncoder {
    /**
     * Function used for Domain attribute value serialization.
     *
     * @param {(string | undefined)} domain Cookie.domain value
     * @returns {(string | undefined)} Returns serialized Domain attribute value.
     * Returning undefined causes the parser to ignore this attribute.
     */
    serializeDomain(
        domain: string | undefined,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (typeof domain === 'string') {
            return domain;
        }
        return undefined;
    }

    /**
     * Function used to serialize Cookie.expires into date string suitable for Expires attribute.
     *
     * @param {(number | undefined)} expires Cookie.expires value
     * @returns {(string | undefined)} Returns serialized Expires attribute value.
     * Returning undefined causes the parser to ignore this attribute.
     */
    serializeExpires(
        expires: number | undefined,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (Number.isSafeInteger(<number>expires)) {
            const date: Date = new Date(<number>expires);
            if (!isNaN(+date)) {
                return date.toUTCString();
            }
        }
        return undefined;
    }

    /**
     * Function used for calculating Max-Age attribute.
     *
     * @param {(number | undefined)} expires Cookie.expires value
     * @param {CookieOptionsV2} options Encoder options
     * @returns {(string | undefined)} Returns serialized Max-Age attribute value.
     * Returning undefined causes the parser to ignore this attribute.
     */
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

    /**
     * Function used for encoding cookie name.
     */
    serializeName(
        name: string | undefined,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (typeof name === 'string') {
            return name;
        }
        return undefined;
    }

    /**
     * Function used for encoding Path directive.
     */
    serializePath(
        path: string | undefined,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (typeof path === 'string') {
            return path;
        }
        return undefined;
    }

    /**
     * Function used for encoding cookie value.
     */
    serializeValue(
        value: string,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (typeof value === 'string') {
            return encodeURIComponent(value);
        }
        return undefined;
    }

    /**
     * Function used for decoding Domain attribute.
     */
    parseDomain(
        domain: string | undefined,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (typeof domain === 'string') {
            return domain;
        }
        return undefined;
    }

    /**
     * Function used for converting Expires attribute to Cookie.expires,
     * date in milliseconds starting from January 1, 1970 00:00:00 UTC
     *
     * @param {string} expires Expires attribute value
     */
    parseExpires(
        expires: string | undefined,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): number | undefined {
        if (typeof expires === 'string') {
            const result: number = Date.parse(expires);
            if (Number.isSafeInteger(result)) {
                return result;
            }
        }
        return undefined;
    }

    /**
     * Function used for converting Max-Age directive to Cookie.expires.
     *
     * @param {number} expires Cookie.expires value
     * @param {number} now Current date in milliseconds starting from January 1, 1970 00:00:00 UTC
     */
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

    /**
     * Function used for decoding cookie name.
     * By default cookie names do not get decoded.
     */
    parseName(
        name: string | undefined,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (typeof name === 'string') {
            return name;
        }
        return undefined;
    }

    /**
     * Function used for decoding Path directive.
     */
    parsePath(
        path: string | undefined,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (typeof path === 'string') {
            return path;
        }
        return undefined;
    }

    /**
     * Function used for decoding cookie value.
     */
    parseValue(
        value: string | undefined,
        // tslint:disable-next-line: variable-name
        _options: Required<CookieEncoderOptions>
    ): string | undefined {
        if (typeof value === 'string') {
            // TODO: This can be throw error when an malformed character exists in the passed value.
            return decodeURIComponent(value);
        }
        return undefined;
    }
}
