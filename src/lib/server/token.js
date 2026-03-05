/*!
 * Copyright (c) 2026 Faizal Chan.
 * Licensed under the MIT License.

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
    VITE_JWT_SECRET as JWT_SECRET,
    VITE_TOKEN_PREFIX as TOKEN_PREFIX,
} from '$env/static/private';
import jwt from 'jsonwebtoken';

const PREFIX = TOKEN_PREFIX || '';

export default Object.freeze({
    access: PREFIX + 'access_token',
    refresh: PREFIX + 'refresh_token',
    key: (name) => {
        if (!name || typeof name !== 'string')
            throw new TypeError('Cookie name is required!');

        return PREFIX + name;
    },
    sign: (payload, expiration = '10m', options = {}) => {
        if (!JWT_SECRET) throw new Error('JWT secret not defined!');
        if (!payload || typeof payload !== 'object' || Array.isArray(payload))
            throw new TypeError('JWT payload must be an object');

        return jwt.sign(payload,
            JWT_SECRET, {
            expiresIn: expiration,
            algorithm: 'HS256',
            ...options,
        });
    },
    decode: (token) => {
        if (!token) return false;

        const payload = jwt.decode(token);
        return payload || false;
    },
    validate: (cookies, name = 'access_token', options = {}) => {
        if (!JWT_SECRET) throw new Error('JWT secret not defined!');
        if (!cookies) throw new TypeError('Cookies instance is required!');
        if (!name || typeof name !== 'string')
            throw new TypeError('Cookie name is required!');

        const token = cookies.get(PREFIX + name);
        if (!token) return false;

        const SECRET = options.secret || JWT_SECRET;
        delete options.secret;

        try {
            return jwt.verify(token, SECRET, {
                algorithms: ['HS256', 'RS256'],
                ...options,
            });
        } catch (e) {
            return false;
        }
    },
    set: (cookies, name, token, options = {}) => {
        if (!cookies) throw new TypeError('Cookies instance is required!');
        if (!name || typeof name !== 'string')
            throw new TypeError('Cookie name is required!');
        if (!token) throw new TypeError('Token value is required!');

        cookies.set(PREFIX + name, token, {
            path: '/',
            httpOnly: true,
            ...options,
        });
    },
    purge: (cookies, list = []) => {
        if (!cookies) throw new TypeError('Cookies instance is required!');

        const itemsToPurge = (typeof list === 'string') ? [list] : list;
        if (!Array.isArray(itemsToPurge))
            throw new TypeError('List must be an array or a string!');

        itemsToPurge.forEach((item) => {
            if (typeof item === 'string') {
                cookies.delete(PREFIX + item, {
                    path: '/',
                });
            }

            if (
                item && typeof item === 'object' &&
                item.name && typeof item.name === 'string'
            ) {
                cookies.delete(PREFIX + item.name, {
                    path: '/',
                    ...item?.options,
                });
            }
        });
    },
});
