import { assert } from 'chai';
import { CookieEncoder } from '../src/encoder';
import { CookieEncoderOptions } from '../src/options';

let encoder: Required<CookieEncoder>;
let basicEncoderOptions: Required<CookieEncoderOptions>;
beforeEach(() => {
    encoder = new CookieEncoder();
    basicEncoderOptions = {
        getTime: Date.now,
        strict: true
    };
});

describe('CookieEncoder', () => {
    describe('parseDomain', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.parseDomain);
        });

        it('should parse domain attribute value properly', () => {
            const result: string | undefined = encoder.parseDomain(
                '*.example.com',
                basicEncoderOptions
            );
            assert.strictEqual(result, '*.example.com');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.parseDomain(
                <any>undefined,
                basicEncoderOptions
            );
            assert.isUndefined(result);
        });
    });

    describe('parseExpires', () => {
        // https://tools.ietf.org/html/rfc822#section-5
        it('should have typeof function', () => {
            assert.isFunction(encoder.parseExpires);
        });

        describe('parse ISO 8601', () => {
            const variants: string[] = [
                '1970-01-01T00:01:00.000Z',
                '1970-01-01T00:01:00+00:00',
                '1970-01-01T00:01:00Z',
                '1970-01-01T00:01Z'
            ];

            for (const date of variants) {
                it(`parse ${date}`, () => {
                    const result: number | undefined = encoder.parseExpires(
                        date,
                        basicEncoderOptions
                    );
                    assert.strictEqual(result, 60000);
                });
            }
        });

        describe('parse RFC 822', () => {
            const variants: string[] = [
                'Thu, 01 Jan 1970 00:01:00 GMT',
                'Thu, 01 Jan 1970 00:01:00 UT',
                'Thu, 01 Jan 1970 00:01:00 UTC',
                'Thu, 01 Jan 1970 00:01:00 Z',
                'Thu, 01 Jan 1970 00:01:00Z',
                '01 Jan 1970 00:01:00 GMT',
                '01-Jan-1970 00:01:00 GMT',
                'Thu, 01 Jan 1970 00:01:00 +0',
                'Thu, 01 Jan 1970 00:01:00 -0',
                'Thu, 01 Jan 1970 00:01:00 +0000',
                'Thu, 01 Jan 1970 01:01:00 +0100',
                'Thu, 01 Jan 1970 01:01:00 +0100'
            ];

            for (const date of variants) {
                it(`parse ${date}`, () => {
                    const result: number | undefined = encoder.parseExpires(
                        date,
                        basicEncoderOptions
                    );
                    assert.strictEqual(result, 60000);
                });
            }
        });
    });

    describe('parseMaxAge', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.parseMaxAge);
        });

        it('should parse max-age attribute value properly', () => {
            const result: number | undefined = encoder.parseMaxAge('15', {
                ...basicEncoderOptions,
                getTime: (): number => 0
            });
            assert.strictEqual(result, 15000);
        });

        it('should return undefined when get invalid argument', () => {
            const result: number | undefined = encoder.parseMaxAge(
                '<invalid number/>',
                basicEncoderOptions
            );
            assert.isUndefined(result);
        });
    });

    describe('parseName', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.parseName);
        });

        it('should parse cookie name properly', () => {
            const result: string | undefined = encoder.parseName('john', basicEncoderOptions);
            assert.strictEqual(result, 'john');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.parseName(<any>1, basicEncoderOptions);
            assert.isUndefined(result);
        });
    });

    describe('parsePath', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.parsePath);
        });

        it('should parse path attribute value properly', () => {
            const result: string | undefined = encoder.parsePath('/', basicEncoderOptions);
            assert.strictEqual(result, '/');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.parsePath(<any>0, basicEncoderOptions);
            assert.isUndefined(result);
        });
    });

    describe('parseValue', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.parseValue);
        });

        it('should parse cookie value properly', () => {
            const result: string | undefined = encoder.parseValue('%25%26%24', basicEncoderOptions);
            assert.strictEqual(result, '%&$');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.parseValue(<any>0, basicEncoderOptions);
            assert.isUndefined(result);
        });
    });

    ////////////////////////////////

    describe('serializeDomain', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.serializeDomain);
        });

        it('should serialize domain attribute value properly', () => {
            const result: string | undefined = encoder.serializeDomain(
                '*.example.com',
                basicEncoderOptions
            );
            assert.strictEqual(result, '*.example.com');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.serializeDomain(<any>0, basicEncoderOptions);
            assert.isUndefined(result);
        });
    });

    describe('serializeExpires', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.serializeExpires);
        });

        it('should serialize expires attribute value properly', () => {
            const result: string | undefined = encoder.serializeExpires(0, basicEncoderOptions);
            assert.strictEqual(result, 'Thu, 01 Jan 1970 00:00:00 GMT');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.serializeExpires(
                <any>'<invalid timestamp/>',
                basicEncoderOptions
            );
            assert.isUndefined(result);
        });
    });

    describe('serializeMaxAge', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.serializeMaxAge);
        });

        it('should serialize max-age cookie attribute properly', () => {
            const result: string | undefined = encoder.serializeMaxAge(15000, {
                ...basicEncoderOptions,
                getTime: (): number => 0
            });
            assert.strictEqual(result, '15');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.serializeMaxAge(<any>undefined, {
                ...basicEncoderOptions,
                getTime: (): number => 0
            });
            assert.isUndefined(result);
        });
    });

    describe('serializeName', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.serializeName);
        });

        it('should serialize cookie name properly', () => {
            const result: string | undefined = encoder.serializeName('%&$', basicEncoderOptions);
            assert.strictEqual(result, '%&$');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.serializeName(<any>1, basicEncoderOptions);
            assert.isUndefined(result);
        });
    });

    describe('serializePath', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.serializePath);
        });

        it('should serialize cookie path attribute properly', () => {
            const result: string | undefined = encoder.serializePath('%&$', basicEncoderOptions);
            assert.strictEqual(result, '%&$');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.serializePath(<any>1, basicEncoderOptions);
            assert.isUndefined(result);
        });
    });

    describe('serializeValue', () => {
        it('should have typeof function', () => {
            assert.isFunction(encoder.serializeValue);
        });

        it('should serialize cookie value properly', () => {
            const result: string | undefined = encoder.serializeValue('%&$', basicEncoderOptions);
            assert.strictEqual(result, '%25%26%24');
        });

        it('should return undefined when get invalid argument', () => {
            const result: string | undefined = encoder.serializeValue(<any>1, basicEncoderOptions);
            assert.isUndefined(result);
        });
    });
});
