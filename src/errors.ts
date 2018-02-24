export class CookieError extends Error {}
export class InvalidCookieEncoderError extends CookieError {
    constructor(encoderName: string) {
        super(`Invalid cookie encoder: ${encoderName}`);
        this.name = 'InvalidCookieEncoderError';
    }
}
export class InvalidCookieEncoderArgumentError extends CookieError {}
export class InvalidCookieStringError extends CookieError {
    constructor(msg: string, cookieString?: string, invalidPortion?: string) {
        let errorMessage: string = msg;
        if (cookieString) {
            let cookie: string = cookieString;
            if (invalidPortion) {
                cookie = cookie.replace(
                    invalidPortion,
                    Array.from(invalidPortion)
                        .map((i: string) => `${i}\u0330`)
                        .join('')
                );
            }
            errorMessage += `\n${cookie}`;
        }
        super(`Invalid cookie string: ${invalidPortion}\n${errorMessage}`);
        this.name = 'InvalidCookieArgumentError';
    }
}
