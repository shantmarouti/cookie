export interface Cookie<T = string> {
    /**
     * Cookie name.
     */
    name: string;

    /**
     * Cookie value.
     */
    value: T;

    /**
     * Expire date in milliseconds starting from January 1, 1970 00:00:00 UTC.
     */
    expires?: number;

    /**
     * Indicates a URL path that must exist in the requested resource
     * before sending the Cookie header.
     */
    path?: string;

    /**
     * Specifies those hosts to which the cookie will be sent.
     */
    domain?: string;

    /**
     * HTTP-only cookies aren't accessible via JavaScript through the Document.cookie property,
     * the XMLHttpRequest and Request APIs.
     */
    httpOnly?: boolean;

    /**
     * A secure cookie will only be sent to the server when a request
     * is made using SSL and the HTTPS protocol.
     */
    secure?: boolean;

    /**
     * Allows servers to assert that a cookie ought not to be sent along with cross-site requests.
     */
    sameSite?: 'Lax' | 'Strict';

    /**
     * Indicates that cookie name was prefixed with __Secure prefix.
     * This also enables secure attribute.
     */
    securePrefix?: boolean;

    /**
     * Indicates that cookie name was prefixed with __Host prefix.
     */
    hostPrefix?: boolean;
}
