import { CookieEncoder } from './encoder';

export interface CookieEncoderOptions {
    /**
     * Indicates that parser is running in strict mode.
     * If strict mode is enabled encoders can throw error if the passed argument is invalid
     * or the output contains malformed characters that is not suitable for cookie string.
     * @default false
     */
    strict?: boolean;

    /**
     * Returns number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
     * If the encoder needs current date/time it should not directly call Date.now()
     * or any other method that leads it to be impure, instead it should use this method.
     * Developers can override this method for time coordination or testing purposes.
     * @default Date.now()
     */
    getTime?: () => number;
}

export interface CookieParserOptions extends CookieEncoderOptions {
    /**
     * Defines methods used for serializaing/encoding/encrypting diffrent portions of cookie.
     * You can provide your own implementation if the default one dont satisfy your needs.
     */
    encoder?: CookieEncoder;
}
