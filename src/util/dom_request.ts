//@ts-nocheck
(function(global) {
  var fabric = global.fabric;
  function addParamToUrl(url, param) {
    return url + (/\?/.test(url) ? '&' : '?') + param;
  }

  function emptyFn() { }

  /**
   * Cross-browser abstraction for sending XMLHttpRequest
   * @memberOf fabric.util
   * @deprecated this has to go away, we can use a modern browser method to do the same.
   * @param {String} url URL to send XMLHttpRequest to
   * @param {Object} [options] Options object
   * @param {String} [options.method="GET"]
   * @param {String} [options.parameters] parameters to append to url in GET or in body
   * @param {String} [options.body] body to send with POST or PUT request
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @param {Function} options.onComplete Callback to invoke when request is completed
   * @return {XMLHttpRequest} request
   */
  function request(url, options) {
    options || (options = { });

    var method = options.method ? options.method.toUpperCase() : 'GET',
        onComplete = options.onComplete || function () { },
        xhr = new fabric.window.XMLHttpRequest(),
        body = options.body || options.parameters,
        signal = options.signal,
        abort = abort = function () {
          xhr.abort();
        },
        removeListener = function () {
          signal && signal.removeEventListener('abort', abort);
          xhr.onerror = xhr.ontimeout = emptyFn;
        };

    if (signal && signal.aborted) {
      throw new Error('`options.signal` is in `aborted` state');
    }
    else if (signal) {
      signal.addEventListener('abort', abort, { once: true });
    }

    /** @ignore */
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        removeListener();
        onComplete(xhr);
        xhr.onreadystatechange = emptyFn;
      }
    };

    xhr.onerror = xhr.ontimeout = removeListener;

    if (method === 'GET') {
      body = null;
      if (typeof options.parameters === 'string') {
        url = addParamToUrl(url, options.parameters);
      }
    }

    xhr.open(method, url, true);

    if (method === 'POST' || method === 'PUT') {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    xhr.send(body);
    return xhr;
  }

  fabric.util.request = request;
})(typeof exports !== 'undefined' ? exports : window);
