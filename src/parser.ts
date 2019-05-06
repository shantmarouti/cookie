import { BaseCookieEncoder } from './base-encoder';
import { Cookie } from './cookie';
import { CookieEncoder } from './encoder';
import { InvalidCookieStringError } from './errors';
import { cookieParserToEncoderOptions, mergeCookieParserOptions, Required } from './option-helpers';
import { CookieEncoderOptions, CookieParserOptions } from './options';

// ----------------------------------------------------------------------------
// Refrences
// https://tools.ietf.org/html/rfc6265
// https://tools.ietf.org/html/draft-west-first-party-cookies-07
// https://tools.ietf.org/html/draft-ietf-httpbis-cookie-prefixes-00
// ----------------------------------------------------------------------------
//
// ---- https://tools.ietf.org/html/rfc6265#section-4.1 -----------------------
//
//      set-cookie-header = "Set-Cookie:" SP set-cookie-string
//      set-cookie-string = cookie-pair *( ";" SP cookie-av )
//      cookie-pair       = cookie-name "=" cookie-value
//      cookie-name       = token
//      cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
//      cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
//                            ; US-ASCII characters excluding CTLs,
//                            ; whitespace DQUOTE, comma, semicolon,
//                            ; and backslash
//      token             = <token, defined in [RFC2616], Section 2.2>
//      token             = 1*<any CHAR except CTLs or separators>
//      separators        = "(" | ")" | "<" | ">" | "@"
//                        | "," | ";" | ":" | "\" | <">
//                        | "/" | "[" | "]" | "?" | "="
//                        | "{" | "}" | SP | HT
//      cookie-av         = expires-av / max-age-av / domain-av /
//                          path-av / secure-av / httponly-av /
//                          extension-av
//      expires-av        = "Expires=" sane-cookie-date
//      sane-cookie-date  = <rfc1123-date, defined in [RFC2616], Section 3.3.1>
//      max-age-av        = "Max-Age=" non-zero-digit *DIGIT
//                            ; In practice, both expires-av and max-age-av
//                            ; are limited to dates representable by the
//                            ; user agent.
//      non-zero-digit    = %x31-39
//                            ; digits 1 through 9
//      domain-av         = "Domain=" domain-value
//      domain-value      = <subdomain>
//                            ; defined in [RFC1034], Section 3.5, as
//                            ; enhanced by [RFC1123], Section 2.1
//      path-av           = "Path=" path-value
//      path-value        = <any CHAR except CTLs or ";">
//      secure-av         = "Secure"
//      httponly-av       = "HttpOnly"
//      extension-av      = <any CHAR except CTLs or ";">
//      OCTET          = <any 8-bit sequence of data>
//      CHAR           = <any US-ASCII character (octets 0 - 127)>
//      UPALPHA        = <any US-ASCII uppercase letter "A".."Z">
//      LOALPHA        = <any US-ASCII lowercase letter "a".."z">
//      ALPHA          = UPALPHA | LOALPHA
//      DIGIT          = <any US-ASCII digit "0".."9">
//      CTL            = <any US-ASCII control character
//                       (octets 0 - 31) and DEL (127)>
//      CR             = <US-ASCII CR, carriage return (13)>
//      LF             = <US-ASCII LF, linefeed (10)>
//      SP             = <US-ASCII SP, space (32)>
//      HT             = <US-ASCII HT, horizontal-tab (9)>
//      <">            = <US-ASCII double-quote mark (34)>
// ----------------------------------------------------------------------------

export class CookieParser {
    private options: Required<CookieParserOptions>;
    // private encoder: Required<CookieEncoder>;
    constructor(options?: CookieParserOptions) {
        const defaultOptions: Required<CookieParserOptions> = {
            encoder: new BaseCookieEncoder(),
            getTime: Date.now,
            strict: false
        };
        this.options = mergeCookieParserOptions(defaultOptions, options);
    }

    /**
     * Parses HTTP Set-Cookie header value.
     */
    parseSetCookie(str: string, options?: CookieParserOptions): Cookie {
        // TODO: If a cookie's name begins with "__Host-", the cookie MUST be:
        //    1.  Set with a "Secure" attribute
        //    2.  Set from a URI whose "scheme" is considered "secure" by the user
        //        agent.
        //    3.  Sent only to the host which set the cookie.  That is, a cookie
        //        named "__Host-cookie1" set from "https://example.com" MUST NOT
        //        contain a "Domain" attribute (and will therefore be sent only to
        //        "example.com", and not to "subdomain.example.com").
        //    4.  Sent to every request for a host.  That is, a cookie named
        //        "__Host-cookie1" MUST contain a "Path" attribute with a value of
        //        "/".
        //    The following cookies would always be rejected:
        //    Set-Cookie: __Host-SID=12345
        //    Set-Cookie: __Host-SID=12345; Secure
        //    Set-Cookie: __Host-SID=12345; Domain=example.com
        //    Set-Cookie: __Host-SID=12345; Domain=example.com; Path=/
        //    Set-Cookie: __Host-SID=12345; Secure; Domain=example.com; Path=/

        const parserOptions: Required<CookieParserOptions> = mergeCookieParserOptions(
            this.options,
            options
        );
        const encoder: Required<CookieEncoder> = <Required<CookieEncoder>>parserOptions.encoder;
        const encoderOptions: Required<CookieEncoderOptions> = cookieParserToEncoderOptions(
            parserOptions
        );
        const strict: boolean = parserOptions.strict;
        // ----------------
        const cookie: Cookie = <Cookie>{};
        const parts: string[] = str.split(';');
        let maxAge: number | undefined;
        let expires: number | undefined;

        // tslint:disable-next-line:prefer-for-of
        for (let i: number = 0; i < parts.length; i++) {
            const part: string = parts[i];
            const eqSignIndex: number = part.indexOf('=');
            let key: string;
            let value: string;

            if (eqSignIndex > -1) {
                key = part.slice(0, eqSignIndex).trim();
                value = part.slice(eqSignIndex + 1).trim();
            } else {
                key = '';
                value = part.trim();
            }

            if (i === 0) {
                if (strict && !key) {
                    throw new InvalidCookieStringError('Name cannot be empty!', str);
                }
                const hostPrefix: boolean = key.startsWith('__Host-');
                const securePrefix: boolean = key.startsWith('__Secure-');

                if (hostPrefix) {
                    cookie.hostPrefix = true;
                    cookie.path = '/';
                    cookie.secure = true;
                    key = key.slice(7);
                } else if (securePrefix) {
                    cookie.securePrefix = true;
                    cookie.secure = true;
                    key = key.slice(9);
                }

                cookie.name = encoder.parseName(key, encoderOptions) || '';
                cookie.value = encoder.parseValue(value, encoderOptions) || '';
                continue;
            }

            const upperKey: string = key.toUpperCase();
            const upperValue: string = value.toUpperCase();

            if (upperKey === 'MAX-AGE') {
                maxAge = encoder.parseMaxAge(value, encoderOptions);
            } else if (upperKey === 'EXPIRES') {
                expires = encoder.parseExpires(value, encoderOptions);
            } else if (upperKey === 'PATH') {
                const path: string | undefined = encoder.parsePath(value, encoderOptions);
                if (path) {
                    cookie.path = path;
                }
            } else if (upperKey === 'DOMAIN') {
                if (!cookie.hostPrefix) {
                    const domain: string | undefined = encoder.parseDomain(value, encoderOptions);
                    if (domain) {
                        cookie.domain = domain;
                    }
                }
            } else if (upperKey === 'SAMESITE') {
                const sameSiteValue: string = (value || '').toUpperCase();
                if (sameSiteValue === 'LAX') {
                    cookie.sameSite = 'Lax';
                } else {
                    cookie.sameSite = 'Strict';
                }
            } else if (upperValue === 'SAMESITE') {
                cookie.sameSite = 'Strict';
            } else if (upperValue === 'SECURE') {
                cookie.secure = true;
            } else if (upperValue === 'HTTPONLY') {
                cookie.httpOnly = true;
            }
        }

        if (Number.isSafeInteger(<number>maxAge)) {
            cookie.expires = maxAge;
        } else if (Number.isSafeInteger(<number>expires)) {
            cookie.expires = expires;
        }

        return cookie;
    }

    /**
     * Paeses HTTP Cookie header value.
     */
    parseCookie(str: string, options?: CookieParserOptions): Cookie[] {
        const parserOptions: Required<CookieParserOptions> = mergeCookieParserOptions(
            this.options,
            options
        );
        const encoder: Required<CookieEncoder> = <Required<CookieEncoder>>parserOptions.encoder;
        const encoderOptions: Required<CookieEncoderOptions> = cookieParserToEncoderOptions(
            parserOptions
        );
        const strict: boolean = parserOptions.strict;
        // ----------------
        const cookies: Cookie[] = [];
        const items: string[] = str.split(';');
        for (const item of items) {
            const cookie: Cookie = <Cookie>{};
            const eqSignIndex: number = item.indexOf('=');

            if (eqSignIndex > -1) {
                cookie.name = item.slice(0, eqSignIndex).trim();
                cookie.value = item.slice(eqSignIndex + 1).trim();
            } else {
                cookie.name = '';
                cookie.value = item.trim();
            }

            if (cookie.name.startsWith('__Host-')) {
                cookie.hostPrefix = true;
                cookie.path = '/';
                cookie.secure = true;
                cookie.name = cookie.name.slice(7);
            } else if (cookie.name.startsWith('__Secure-')) {
                cookie.securePrefix = true;
                cookie.secure = true;
                cookie.name = cookie.name.slice(9);
            }

            cookie.name = encoder.parseName(cookie.name, encoderOptions) || '';
            cookie.value = encoder.parseValue(cookie.value, encoderOptions) || '';

            if (strict) {
                if (!cookie.name) {
                    continue;
                }
            } else if (!cookie.name && !cookie.value) {
                continue;
            }

            cookies.push(cookie);
        }
        return cookies;
    }

    /**
     * Serialize cookie object into string suitable for HTTP Set-Cookie header.
     */
    serializeSetCookie(cookie: Cookie, options?: CookieParserOptions): string {
        const parserOptions: Required<CookieParserOptions> = mergeCookieParserOptions(
            this.options,
            options
        );
        const encoder: Required<CookieEncoder> = <Required<CookieEncoder>>parserOptions.encoder;
        const encoderOptions: Required<CookieEncoderOptions> = cookieParserToEncoderOptions(
            parserOptions
        );
        const strict: boolean = parserOptions.strict;
        // ----------------
        const ctx: Cookie = { ...cookie };

        if (ctx.hostPrefix === true) {
            ctx.secure = true;
            ctx.domain = undefined;
            ctx.path = '/';
        } else if (ctx.securePrefix) {
            ctx.secure = true;
        }

        const parts: string[] = [];
        const maxAge: string | undefined = encoder.serializeMaxAge(ctx.expires, encoderOptions);
        const expires: string | undefined = encoder.serializeExpires(ctx.expires, encoderOptions);
        const domain: string | undefined = encoder.serializeDomain(ctx.domain, encoderOptions);
        const path: string | undefined = encoder.serializePath(ctx.path, encoderOptions);
        const value: string = encoder.serializeValue(ctx.value, encoderOptions) || '';
        let name: string = encoder.serializeName(ctx.name, encoderOptions) || '';

        // TODO: Throw when any of cookie parts contain malformed characters.
        // This check should be configurable by "strict" option
        if (strict) {
            if (!name) {
            }
        }

        if (ctx.hostPrefix) {
            name = `__Host-${name}`;
        } else if (ctx.securePrefix) {
            name = `__Secure-${name}`;
        }

        parts.push(`${name}=${value}`);

        if (typeof expires === 'string') {
            parts.push(`Expires=${expires}`);
        }

        if (typeof maxAge === 'string') {
            parts.push(`Max-Age=${maxAge}`);
        }

        if (typeof domain === 'string') {
            parts.push(`Domain=${domain}`);
        }

        parts.push(`Path=${path || '/'}`);

        if (typeof cookie.sameSite === 'string') {
            const upperSameSite: string = cookie.sameSite.toUpperCase();
            if (upperSameSite === 'LAX') {
                parts.push('SameSite=Lax');
            } else {
                parts.push('SameSite=Strict');
            }
        }

        if (ctx.httpOnly === true) {
            parts.push('HttpOnly');
        }

        if (ctx.secure === true) {
            parts.push('Secure');
        }

        return parts.join('; ');
    }

    /**
     * Serialize cookie object into string suitable for HTTP Cookie header.
     */
    serializeCookie(cookies: Cookie[], options?: CookieParserOptions): string {
        const parserOptions: Required<CookieParserOptions> = mergeCookieParserOptions(
            this.options,
            options
        );
        const encoder: Required<CookieEncoder> = <Required<CookieEncoder>>parserOptions.encoder;
        const encoderOptions: Required<CookieEncoderOptions> = cookieParserToEncoderOptions(
            parserOptions
        );
        const strict: boolean = parserOptions.strict;
        // ----------------
        const items: string[] = [];
        for (const cookie of cookies) {
            let name: string | undefined = encoder.serializeName(cookie.name, encoderOptions);
            const value: string | undefined = encoder.serializeValue(cookie.value, encoderOptions);

            if (strict && !name) {
                throw new InvalidCookieStringError('Name cannot be empty!', JSON.stringify(cookie));
            }
            name = name || '';

            if (cookie.hostPrefix) {
                name = `__Host-${name}`;
            } else if (cookie.securePrefix) {
                name = `__Secure-${name}`;
            }

            items.push(`${name}=${value || ''}`);
        }
        return items.join('; ');
    }

    /**
     * Remove expired cookies from list
     */
    removeExpired(
        cookies: Cookie[],
        removeSessionCookies: boolean = false,
        options?: CookieParserOptions
    ): Cookie[] {
        const parserOptions: Required<CookieParserOptions> = mergeCookieParserOptions(
            this.options,
            options
        );
        const now: number = parserOptions.getTime();
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
    merge(existingCookies: Cookie[], newCookies: Cookie[]): Cookie[] {
        return existingCookies
            .filter((i: Cookie) => newCookies.every((x: Cookie) => x.name !== i.name))
            .concat(newCookies);
    }
}
