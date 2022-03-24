(function() {

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
   * @param {AbortSignal} [options.signal] 
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
        };

    if (signal && signal.aborted) {
      throw new DOMException('`options.signal` is in `aborted` state', 'ABORT_ERR');
    }
    else if (signal) {
      signal.addEventListener('abort', abort, { once: true });
    }
    
    /** @ignore */
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        signal && signal.removeEventListener('abort', abort);
        onComplete(xhr);
        xhr.onreadystatechange = emptyFn;
      }
    };

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
})();
