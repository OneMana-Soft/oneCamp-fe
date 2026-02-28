// src/lib/utils/throttle.ts
export interface ThrottledFunction<T extends (...args: unknown[]) => void> {
    (...args: Parameters<T>): void;
    cancel: () => void;
}

export function throttle<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number,
    options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true }
): ThrottledFunction<T> {
    let lastCall: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let lastArgs: Parameters<T> | null = null;

    const execute = (args: Parameters<T>) => {
        fn(...args);
        lastCall = Date.now();
    };

    const throttled = (...args: Parameters<T>) => {
        const now = Date.now();
        lastArgs = args;

        if (options.leading && lastCall === null) {
            execute(args);
            return;
        }

        const timeSinceLastCall = lastCall === null ? delay : now - lastCall;
        const shouldExecuteNow = timeSinceLastCall >= delay;

        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        if (shouldExecuteNow) {
            execute(args);
        } else if (options.trailing) {
            timeoutId = setTimeout(() => {
                if (lastArgs) {
                    execute(lastArgs);
                }
                timeoutId = null;
            }, delay - timeSinceLastCall);
        }
    };

    // Attach cancel method
    throttled.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return throttled as ThrottledFunction<T>;
}