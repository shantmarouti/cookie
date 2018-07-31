import { Cookie } from './cookie';
import { CookieParserOptions } from './options';

/**
 * Remove expired cookies from list
 */
export function removeExpired(
    cookies: Cookie[],
    removeSessionCookies: boolean = false,
    options?: CookieParserOptions
): Cookie[] {
    const getTime: () => number =
        options && options.encoderOptions ? options.encoderOptions.getTime : Date.now;
    const now: number = getTime();
    return cookies.filter(
        (i: Cookie): boolean => {
            if (typeof i.expires === 'number' && Number.isSafeInteger(i.expires)) {
                return i.expires > now;
            } else if (!removeSessionCookies) {
                return false;
            }
            return true;
        }
    );
}

/**
 * Merge two collection of cookies
 */
export function merge(existingCookies: Cookie[], newCookies: Cookie[]): Cookie[] {
    return existingCookies
        .filter((i: Cookie) => newCookies.every((x: Cookie) => x.name !== i.name))
        .concat(newCookies);
}
