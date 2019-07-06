# @maloos/cookie

Full feature cookie parser/serializer for browser and Node.JS.
This package can be used to parse and serialize `Cookie` and `Set-Cookie` HTTP headers.

It is fully customizable so you can implement your custom parsing logic when you need to.

> This package is still in an early development stage and not ready for production use just yet. Please try it out, give feedback, and help fix bugs.

## Installation

```sh
npm install @maloos/cookie --save
```

## Import

Modern JS

```typescript
import { CookieParser } from '@maloos/cookie';
```

## Create parser

#### Simplified

```typescript
import { createCookieParser } from '@maloos/cookie';

const parser = createCookieParser();
```

#### Advanced

```typescript
import { CookieEncoder, CookieParser, CookieParserOptions } from '@maloos/cookie';

const encoder = new CookieEncoder();
const options: CookieParserOptions = {
    getTime: Date.now,
    strict: false
};
const parser = new CookieParser(encoder, options);
```

## Parse Set-Cookie Header

```typescript
const setCookieHeader = 'id=5; path=/; Secure';
const cookie = parser.parseSetCookie(setCookieHeader);

console.log(cookie);
// {
//     name: 'id',
//     value: '5',
//     path: '/',
//     secure: true
// }
```

## Parse Cookie Header

```typescript
const cookieHeader = 'id=5; name=john';
const cookies = parser.parseCookie(cookieHeader);

console.log(cookies);
// [
//     {
//         name: 'id',
//         value: '5'
//     },
//     {
//         name: 'name',
//         value: 'john'
//     }
// ]
```

## Merge two collection of cookies

```typescript
const existingCookies = [{ name: 'id', value: '5' }];
const newCookies = [{ name: 'id', value: '10' }];
const mergedCookies = parser.merge(existingCookies, newCookies);

console.log(mergedCookies);
// [{ name: 'id', value: '10' }]
```

## Development setup

```sh
npm install
npm test
```

## Meta

Shant Marouti – [@shantmarouti](https://twitter.com/shantmarouti) – shantmarouti@gmail.com

Distributed under the MIT license. See `LICENSE` for more information.

[https://github.com/shantmarouti/cookie](https://github.com/shantmarouti/cookie)

## Contributing

1. Fork it (<https://github.com/shantmarouti/cookie/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Run all required tests (`npm run precommit`)
4. Commit your changes (`git commit -am 'Add some fooBar'`)
5. Push to the branch (`git push origin feature/fooBar`)
6. Create a new Pull Request
