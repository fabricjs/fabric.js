// @ts-nocheck
import { getWindow } from '../env';
import { noop } from '../constants';

/**
 * Cross-browser abstraction for sending XMLHttpRequest
 * @deprecated this has to go away, we can use a modern browser method to do the same.
 * @param {String} url URL to send XMLHttpRequest to
 * @param {Object} [options] Options object
 * @param {String} [options.method="GET"]
 * @param {Record<string, string>} [options.parameters] parameters to append to url in GET or in body
 * @param {String} [options.body] body to send with POST or PUT request
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @param {Function} options.onComplete Callback to invoke when request is completed
 * @return {XMLHttpRequest} request
 */
export function request(url, options = {}) {
  const method = options.method ? options.method.toUpperCase() : 'GET',
    onComplete = options.onComplete || noop,
    xhr = new (getWindow().XMLHttpRequest)(),
    body = options.body || options.parameters,
    signal = options.signal,
    abort = function () {
      xhr.abort();
    },
    removeListener = function () {
      signal && signal.removeEventListener('abort', abort);
      xhr.onerror = xhr.ontimeout = noop;
    };

  if (signal && signal.aborted) {
    throw new Error('`options.signal` is in `aborted` state');
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

  if (method === 'GET' && options.parameters) {
    const { origin, pathname, searchParams } = new URL(url);
    url = `${origin}${pathname}?${new URLSearchParams([
      ...Array.from(searchParams.entries()),
      ...Object.entries(options.parameters),
    ])}`;
  }

  xhr.open(method, url, true);

  if (method === 'POST' || method === 'PUT') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }

  xhr.send(method === 'GET' ? null : body);
  return xhr;
}
