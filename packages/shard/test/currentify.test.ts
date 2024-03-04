import { describe, expect, it } from 'vitest'
import concurrentify, {concurrentMap} from '../src/concurrentify'

describe('concurrentify', () => {
  it('should run concurrently', async () => {
    const maxConcurrent = 3;
    const delay = 100;
    const fn = async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return delay;
    };
    const concurrentFn = concurrentify(maxConcurrent, fn);
    const start = Date.now();
    await Promise.all(
      Array.from({ length: 10 }).map(() => concurrentFn()),
    );
    const end = Date.now();
    expect(end - start).toBeLessThan(delay * 4);
  });
});

