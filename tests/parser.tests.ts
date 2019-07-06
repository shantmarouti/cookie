import { assert } from 'chai';
import { Cookie } from '../src/cookie';
import { CookieEncoder } from '../src/encoder';
import { CookieEncoderOptions } from '../src/options';
import { CookieParser } from '../src/parser';

let parser: CookieParser;

beforeEach(() => {
    const encoder: Required<CookieEncoder> = new CookieEncoder();
    const encoderOptions: Required<CookieEncoderOptions> = {
        getTime: Date.now,
        strict: true
    };
    parser = new CookieParser(encoder, encoderOptions);
});

describe('CookieParser', () => {
    describe('parseSetCookie', () => {
        it('basic parsing', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                value: '5'
            });
        });

        it('preserve name=value casing', () => {
            const cookie: Cookie = parser.parseSetCookie('iD=5Dd');
            assert.deepEqual<Cookie>(cookie, {
                name: 'iD',
                value: '5Dd'
            });
        });

        it('with witespace', () => {
            const cookie: Cookie = parser.parseSetCookie('  id  =  5   ');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                value: '5'
            });
        });

        it('with empty attributes', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; ; ; ');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                value: '5'
            });
        });

        it('additional equalsign in value', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5=6=7');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                value: '5=6=7'
            });
        });

        it('single space in name', () => {
            const cookie: Cookie = parser.parseSetCookie('user id=5');
            assert.deepEqual<Cookie>(cookie, {
                name: 'user id',
                value: '5'
            });
        });

        it('whitespace in value', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5  9 5');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                value: '5  9 5'
            });
        });

        it('path /', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; Path=/');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                path: '/',
                value: '5'
            });
        });

        it('path /hello', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; Path=/hello');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                path: '/hello',
                value: '5'
            });
        });

        it('path lowercase', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; path=/');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                path: '/',
                value: '5'
            });
        });

        it('secure', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; Secure');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                secure: true,
                value: '5'
            });
        });

        it('secure lowercase', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; secure');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                secure: true,
                value: '5'
            });
        });

        it('http-only', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; HttpOnly');
            assert.deepEqual<Cookie>(cookie, {
                httpOnly: true,
                name: 'id',
                value: '5'
            });
        });

        it('http-only lowercase', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; httponly');
            assert.deepEqual<Cookie>(cookie, {
                httpOnly: true,
                name: 'id',
                value: '5'
            });
        });

        it('same-site strict', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; SameSite=Strict');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                sameSite: 'Strict',
                value: '5'
            });
        });

        it('same-site strict lowercase', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; samesite=strict');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                sameSite: 'Strict',
                value: '5'
            });
        });

        it('same-site lax', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; SameSite=Lax');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                sameSite: 'Lax',
                value: '5'
            });
        });

        it('same-site lax lowercase', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; samesite=lax');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                sameSite: 'Lax',
                value: '5'
            });
        });

        it('same-site without value', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; SameSite');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                sameSite: 'Strict',
                value: '5'
            });
        });

        it('same-site without value lowercase', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; samesite');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                sameSite: 'Strict',
                value: '5'
            });
        });

        it('expires', () => {
            const cookie: Cookie = parser.parseSetCookie(
                'id=5; Expires=Thu, 01 Jan 1970 00:00:15 GMT'
            );
            assert.deepEqual<Cookie>(cookie, {
                expires: 15000,
                name: 'id',
                value: '5'
            });
        });

        it('expires lowercase', () => {
            const cookie: Cookie = parser.parseSetCookie(
                'id=5; expires=Thu, 01 Jan 1970 00:00:15 GMT'
            );
            assert.deepEqual<Cookie>(cookie, {
                expires: 15000,
                name: 'id',
                value: '5'
            });
        });

        it('max-age', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; Max-Age=15', {
                getTime: (): number => 0
            });
            assert.deepEqual<Cookie>(cookie, {
                expires: 15000,
                name: 'id',
                value: '5'
            });
        });

        it('max-age lowercase', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; max-age=15', {
                getTime: (): number => 0
            });
            assert.deepEqual<Cookie>(cookie, {
                expires: 15000,
                name: 'id',
                value: '5'
            });
        });

        it('max-age whitespace', () => {
            const cookie: Cookie = parser.parseSetCookie('id=5; max-age  =  15', {
                getTime: (): number => 0
            });
            assert.deepEqual<Cookie>(cookie, {
                expires: 15000,
                name: 'id',
                value: '5'
            });
        });

        it('prefer max-age over expires', () => {
            const cookie: Cookie = parser.parseSetCookie(
                'id=5; Max-Age=60; Expires=Thu, 01 Jan 1970 00:00:15 GMT',
                {
                    getTime: (): number => 0
                }
            );
            assert.deepEqual<Cookie>(cookie, {
                expires: 60000,
                name: 'id',
                value: '5'
            });
        });

        it('secure prefix', () => {
            const cookie: Cookie = parser.parseSetCookie('__Secure-id=5');
            assert.deepEqual<Cookie>(cookie, {
                name: 'id',
                secure: true,
                securePrefix: true,
                value: '5'
            });
        });

        it('secure prefix ignore lowecase', () => {
            const cookie: Cookie = parser.parseSetCookie('__secure-id=5');
            assert.deepEqual<Cookie>(cookie, {
                name: '__secure-id',
                value: '5'
            });
        });

        it('host prefix', () => {
            const cookie: Cookie = parser.parseSetCookie('__Host-id=5');
            assert.deepEqual<Cookie>(cookie, {
                hostPrefix: true,
                name: 'id',
                path: '/',
                secure: true,
                value: '5'
            });
        });

        it('host prefix ignore lowercase', () => {
            const cookie: Cookie = parser.parseSetCookie('__host-id=5');
            assert.deepEqual<Cookie>(cookie, {
                name: '__host-id',
                value: '5'
            });
        });

        it('mixed', () => {
            const cookie: Cookie = parser.parseSetCookie(
                [
                    '__Host-id=5',
                    'Max-Age=60',
                    'Expires=Thu, 01 Jan 1970 00:00:15 GMT',
                    'Path=/',
                    'SameSite=Lax',
                    'HttpOnly',
                    'Secure'
                ].join('; '),
                {
                    getTime: (): number => 0
                }
            );
            assert.deepEqual<Cookie>(cookie, {
                expires: 60000,
                hostPrefix: true,
                httpOnly: true,
                name: 'id',
                path: '/',
                sameSite: 'Lax',
                secure: true,
                value: '5'
            });
        });
    });

    describe('parseCookie', () => {
        it('basic', () => {
            const cookies: Cookie[] = parser.parseCookie('id=5; name=john');
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: 'id',
                    value: '5'
                },
                {
                    name: 'name',
                    value: 'john'
                }
            ]);
        });

        it('surrounding whitespace', () => {
            const cookies: Cookie[] = parser.parseCookie('  id  = 5   ;    name  =   john  ');
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: 'id',
                    value: '5'
                },
                {
                    name: 'name',
                    value: 'john'
                }
            ]);
        });

        it('whitespace in name', () => {
            const cookies: Cookie[] = parser.parseCookie('user id=5');
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: 'user id',
                    value: '5'
                }
            ]);
        });

        it('whitespace in value', () => {
            const cookies: Cookie[] = parser.parseCookie('id=user  5');
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: 'id',
                    value: 'user  5'
                }
            ]);
        });

        it('equalsign in value', () => {
            const cookies: Cookie[] = parser.parseCookie('id=user=5');
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: 'id',
                    value: 'user=5'
                }
            ]);
        });

        it('empty name', () => {
            const cookies: Cookie[] = parser.parseCookie('=5', { strict: false });
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: '',
                    value: '5'
                }
            ]);
        });

        it('just value', () => {
            const cookies: Cookie[] = parser.parseCookie('5', { strict: false });
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: '',
                    value: '5'
                }
            ]);
        });

        it('ignore cookies with empty name in strict mode', () => {
            const cookies: Cookie[] = parser.parseCookie('=5', { strict: true });
            assert.deepEqual<Cookie[]>(cookies, []);
        });

        it('ignore cookies with empty name in strict mode (just value)', () => {
            const cookies: Cookie[] = parser.parseCookie('5', { strict: true });
            assert.deepEqual<Cookie[]>(cookies, []);
        });

        it('secure prefix', () => {
            const cookies: Cookie[] = parser.parseCookie('__Secure-id=5');
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: 'id',
                    secure: true,
                    securePrefix: true,
                    value: '5'
                }
            ]);
        });

        it('ignore lowercase secure prefix', () => {
            const cookies: Cookie[] = parser.parseCookie('__secure-id=5');
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: '__secure-id',
                    value: '5'
                }
            ]);
        });

        it('host prefix', () => {
            const cookies: Cookie[] = parser.parseCookie('__Host-id=5');
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    hostPrefix: true,
                    name: 'id',
                    path: '/',
                    secure: true,
                    value: '5'
                }
            ]);
        });

        it('ignore lowercase host prefix', () => {
            const cookies: Cookie[] = parser.parseCookie('__host-id=5');
            assert.deepEqual<Cookie[]>(cookies, [
                {
                    name: '__host-id',
                    value: '5'
                }
            ]);
        });
    });

    describe('serializeSetCookie', () => {
        it('basic', () => {
            const result: string = parser.serializeSetCookie({ name: 'id', value: '5' });
            // TODO: should Path=/ exists in result by default?
            assert.strictEqual(result, 'id=5; Path=/');
        });

        it('path /hello', () => {
            const result: string = parser.serializeSetCookie({
                name: 'id',
                path: '/hello',
                value: '5'
            });
            assert.strictEqual(result, 'id=5; Path=/hello');
        });

        it('path /hello', () => {
            const result: string = parser.serializeSetCookie({
                domain: 'example.com',
                name: 'id',
                value: '5'
            });
            assert.strictEqual(result, 'id=5; Domain=example.com; Path=/');
        });

        it('expires', () => {
            const result: string = parser.serializeSetCookie(
                {
                    expires: 15000,
                    name: 'id',
                    value: '5'
                },
                { getTime: (): number => 0 }
            );
            assert.strictEqual(
                result,
                'id=5; Expires=Thu, 01 Jan 1970 00:00:15 GMT; Max-Age=15; Path=/'
            );
        });

        it('http-only', () => {
            const result: string = parser.serializeSetCookie({
                httpOnly: true,
                name: 'id',
                value: '5'
            });
            assert.strictEqual(result, 'id=5; Path=/; HttpOnly');
        });

        it('secure', () => {
            const result: string = parser.serializeSetCookie({
                name: 'id',
                secure: true,
                value: '5'
            });
            assert.strictEqual(result, 'id=5; Path=/; Secure');
        });

        it('samesite=lax', () => {
            const result: string = parser.serializeSetCookie({
                name: 'id',
                sameSite: 'Lax',
                value: '5'
            });
            assert.strictEqual(result, 'id=5; Path=/; SameSite=Lax');
        });

        it('samesite=strict', () => {
            const result: string = parser.serializeSetCookie({
                name: 'id',
                sameSite: 'Strict',
                value: '5'
            });
            assert.strictEqual(result, 'id=5; Path=/; SameSite=Strict');
        });

        it('secure prefix', () => {
            const result: string = parser.serializeSetCookie({
                name: 'id',
                securePrefix: true,
                value: '5'
            });
            assert.strictEqual(result, '__Secure-id=5; Path=/; Secure');
        });

        it('host prefix', () => {
            const result: string = parser.serializeSetCookie({
                hostPrefix: true,
                name: 'id',
                value: '5'
            });
            assert.strictEqual(result, '__Host-id=5; Path=/; Secure');
        });

        it('host prefix should ignore domain', () => {
            // TODO: should this instead throw error in strict mode?
            const result: string = parser.serializeSetCookie({
                domain: 'example.com',
                hostPrefix: true,
                name: 'id',
                value: '5'
            });
            assert.strictEqual(result, '__Host-id=5; Path=/; Secure');
        });

        it('host prefix should set path to /', () => {
            const result: string = parser.serializeSetCookie({
                hostPrefix: true,
                name: 'id',
                path: '/hello',
                value: '5'
            });
            assert.strictEqual(result, '__Host-id=5; Path=/; Secure');
        });

        it('host prefix should ignore path and set it to /', () => {
            // TODO: should this instead throw error in strict mode?
            const result: string = parser.serializeSetCookie({
                hostPrefix: true,
                name: 'id',
                path: '/hello',
                value: '5'
            });
            assert.strictEqual(result, '__Host-id=5; Path=/; Secure');
        });
    });

    describe('serializeCookie', () => {
        it('basic', () => {
            const result: string = parser.serializeCookie([
                {
                    name: 'id',
                    value: '5'
                },
                {
                    name: 'name',
                    value: 'john'
                }
            ]);
            assert.deepEqual(result, 'id=5; name=john');
        });

        it('should only include name=value in result', () => {
            const result: string = parser.serializeCookie([
                {
                    domain: 'example.com',
                    expires: 15000,
                    httpOnly: true,
                    name: 'id',
                    path: '/',
                    sameSite: 'Strict',
                    secure: true,
                    value: '5'
                }
            ]);
            assert.deepEqual(result, 'id=5');
        });

        it('secure prefix', () => {
            const result: string = parser.serializeCookie([
                {
                    name: 'id',
                    securePrefix: true,
                    value: '5'
                }
            ]);
            assert.deepEqual(result, '__Secure-id=5');
        });

        it('host prefix', () => {
            const result: string = parser.serializeCookie([
                {
                    hostPrefix: true,
                    name: 'id',
                    value: '5'
                }
            ]);
            assert.deepEqual(result, '__Host-id=5');
        });
    });

    describe('merge', () => {
        it('basic', () => {
            const existingCookies: Cookie[] = [{ name: 'id', value: '5' }];
            const newCookies: Cookie[] = [{ name: 'id', value: '10' }];

            const result: Cookie[] = parser.merge(existingCookies, newCookies);
            assert.deepEqual(result, [{ name: 'id', value: '10' }]);
        });
    });
});
