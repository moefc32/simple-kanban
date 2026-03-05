/*!
 * Copyright (c) 2025 Faizal Chan.
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

const MULTIPLIERS = Object.freeze({
    ms: 1,
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
    y: 31557600000,
});

export default function parseMs(str, fallback = null) {
    if (
        fallback !== null &&
        (
            typeof fallback !== 'number' ||
            !Number.isFinite(fallback) ||
            !Number.isSafeInteger(fallback) ||
            fallback < 0
        )
    ) {
        throw new TypeError(
            'Fallback value must be a non-negative safe integer or null!'
        );
    }

    if (typeof str !== 'string') return fallback;

    const input = str.trim();
    if (!input) return fallback;

    const match = input.toLowerCase().match(/^(\d+)(ms|s|m|h|d|w|y)?$/);
    if (!match) return fallback;

    const value = Number(match[1]);
    const unit = match[2] || 'ms';

    const result = value * MULTIPLIERS[unit];
    if (!Number.isSafeInteger(result))
        throw new RangeError('Duration exceeds safe integer range!');

    return result;
}
