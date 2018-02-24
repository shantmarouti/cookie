import { CookieEncoderOptions } from './options';

/**
 * This interface defines methods used for serializaing/encoding/encrypting
 * diffrent portions of cookie.
 * You can provide your own implementation if the default one dont satisfy your needs.
 */
export interface CookieEncoder {
    /**
     * Function used for Domain attribute value serialization.
     *
     * @param {(string | undefined)} domain Cookie.domain value
     * @returns {(string | undefined)} Returns serialized Domain attribute value.
     * Returning undefined causes the parser to ignore this attribute.
     */
    serializeDomain?(domain: string | undefined, options: CookieEncoderOptions): string | undefined;

    /**
     * Function used to serialize Cookie.expires into date string suitable for Expires attribute.
     *
     * @param {(number | undefined)} expires Cookie.expires value
     * @returns {(string | undefined)} Returns serialized Expires attribute value.
     * Returning undefined causes the parser to ignore this attribute.
     */
    serializeExpires?(
        expires: number | undefined,
        options: CookieEncoderOptions
    ): string | undefined;
    /**
     * Function used for calculating Max-Age attribute.
     *
     * @param {(number | undefined)} expires Cookie.expires value
     * @param {CookieEncoderOptions} options Encoder options
     * @returns {(string | undefined)} Returns serialized Max-Age attribute value.
     * Returning undefined causes the parser to ignore this attribute.
     */
    serializeMaxAge?(
        expires: number | undefined,
        options: CookieEncoderOptions
    ): string | undefined;

    /**
     * Function used for encoding cookie name.
     */
    serializeName?(name: string | undefined, options: CookieEncoderOptions): string | undefined;

    /**
     * Function used for encoding Path directive.
     */
    serializePath?(path: string | undefined, options: CookieEncoderOptions): string | undefined;

    /**
     * Function used for encoding cookie value.
     */
    serializeValue?(value: string | undefined, options: CookieEncoderOptions): string | undefined;

    /**
     * Function used for decoding Domain attribute.
     */
    parseDomain?(domain: string | undefined, options: CookieEncoderOptions): string | undefined;

    /**
     * Function used for converting Expires attribute to Cookie.expires,
     * date in milliseconds starting from January 1, 1970 00:00:00 UTC
     *
     * @param {string} expires Expires attribute value
     */
    parseExpires?(expires: string | undefined, options: CookieEncoderOptions): number | undefined;

    /**
     * Function used for converting Max-Age directive to Cookie.expires.
     *
     * @param {number} expires Cookie.expires value
     * @param {number} now Current date in milliseconds starting from January 1, 1970 00:00:00 UTC
     */
    parseMaxAge?(maxAge: string | undefined, options: CookieEncoderOptions): number | undefined;

    /**
     * Function used for decoding cookie name.
     * By default cookie names do not get decoded.
     */
    parseName?(name: string | undefined, options: CookieEncoderOptions): string | undefined;

    /**
     * Function used for decoding Path directive.
     */
    parsePath?(path: string | undefined, options: CookieEncoderOptions): string | undefined;

    /**
     * Function used for decoding cookie value.
     */
    parseValue?(value: string | undefined, options: CookieEncoderOptions): string | undefined;
}
