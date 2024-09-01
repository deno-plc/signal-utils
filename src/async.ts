/**
 * @license GPL-3.0-or-later
 *
 * @Deno-PLC/signal-utils
 *
 * Copyright (C) 2024 Hans Schallmoser
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { effect, type Signal } from "@preact/signals-core";

/**
 * Waits until the `signal` is `value` or the `timeout` is reached.
 *
 * @returns true if the value matches or false if the timeout is reached.
 *
 * If you need a custom comparison function use {@link awaitMatch}
 */
export function awaitSignal<T>(signal: Signal<T>, value: T): Promise<true>;
export function awaitSignal<T>(
    signal: Signal<T>,
    value: T,
    timeout: number = Infinity,
): Promise<boolean> {
    return new Promise((resolve) => {
        let resolved = false;
        let timeoutID = -1;
        const dispose = effect(() => {
            if (!resolved && signal.value === value) {
                resolve(true);
                dispose?.();
                resolved = true;
                clearTimeout(timeoutID);
            }
        });
        if (timeout < Infinity) {
            timeoutID = setTimeout(() => {
                if (!resolved) {
                    dispose();
                    resolve(false);
                }
            }, timeout);
        }
    });
}

/**
 * Waits until `match` returns true when called with the `signal` value or the `timeout` is reached.
 *
 * @returns true if the value matches or false if the timeout is reached.
 *
 * If you only need a simple comparison use {@link awaitSignal}
 */
export function awaitMatch<T>(
    signal: Signal<T>,
    match: ($: T) => boolean,
): Promise<true>;
export function awaitMatch<T>(
    signal: Signal<T>,
    match: ($: T) => boolean,
    timeout: number = Infinity,
): Promise<boolean> {
    return new Promise((resolve) => {
        let resolved = false;
        let timeoutID = -1;
        const dispose = effect(() => {
            if (!resolved && match(signal.value)) {
                resolve(true);
                dispose?.();
                resolved = true;
                clearTimeout(timeoutID);
            }
        });
        if (timeout < Infinity) {
            timeoutID = setTimeout(() => {
                if (!resolved) {
                    dispose();
                    resolve(false);
                }
            }, timeout);
        }
    });
}
