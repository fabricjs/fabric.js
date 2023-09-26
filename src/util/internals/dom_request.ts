import { getFabricWindow } from '../../env';
import { noop } from '../../constants';
import type { Abortable } from '../../typedefs';
import { SignalAbortedError } from './console';

type requestOptions = Abortable & {
  onComplete?: (xhr: XMLHttpRequest) => void;
};

/**
 * Cross-browser abstraction for sending XMLHttpRequest
 * @deprecated this has to go away, we can use a modern browser method to do the same.
 * @param {String} url URL to send XMLHttpRequest to
 * @param {Object} [options] Options object
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @param {Function} options.onComplete Callback to invoke when request is completed
 * @return {XMLHttpRequest} request
 */

export function request(url: string, options: requestOptions = {}) {
  const onComplete = options.onComplete || noop,
    xhr = new (getFabricWindow().XMLHttpRequest)(),
    signal = options.signal,
    abort = function () {
      xhr.abort();
    },
    removeListener = function () {
      signal && signal.removeEventListener('abort', abort);
      xhr.onerror = xhr.ontimeout = noop;
    };

  if (signal && signal.aborted) {
    throw new SignalAbortedError('request');
  } else if (signal) {
    signal.addEventListener('abort', abort, { once: true });
  }

  /** @ignore */
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      removeListener();
      onComplete(xhr);
      xhr.onreadystatechange = noop;
    }
  };

  xhr.onerror = xhr.ontimeout = removeListener;

  xhr.open('get', url, true);

  xhr.send();
  return xhr;
}
