var Paster = {

  init: function(callback) {

    this.callback = callback;

    // if no Clipboard object, create a contenteditable element that catches all pasted data
    if (!window.Clipboard) {
      this.createContentEditable();
    }

    window.addEventListener("paste", this.pasteHandler.bind(this));
  },

  createContentEditable: function() {
    var pasteCatcher = document.createElement("div");
      
    // Firefox allows images to be pasted into contenteditable elements
    pasteCatcher.setAttribute("contenteditable", "");
    pasteCatcher.style.cssText = 'position: fixed; top: 0; left: -9999px;';

    document.body.appendChild(pasteCatcher);

    // make sure it is always in focus
    pasteCatcher.focus();
    document.addEventListener("click", function() {
      pasteCatcher.focus();
    });
  },

  pasteHandler: function(e) {

    if (e.clipboardData) {
      console.log(e.clipboardData);

      var items = e.clipboardData.items;
      if (items) {
        this.checkItems(items);
      }
    }
    else {
      // read what was pasted from the contenteditable element; likely Firefox
      // make sure data read AFTER it has been inserted
      setTimeout(this.checkInput.bind(this), 1);
    }
  },

  checkItems: function(items) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") > -1) {
        this.handleImageItem(items[i]);
      }
      if (items[i].type.indexOf("text/plain") > -1) {
        this.handleTextItem(items[i]);
      }
    }
  },

  handleImageItem: function(item) {

    // represent the image as a file
    var blob = item.getAsFile();

    // and use a URL or webkitURL (whichever is available to the browser)
    // to create a temporary URL to the object
    var URLObj = window.URL || window.webkitURL;
    if (!URLObj) return;

    var source = URLObj.createObjectURL(blob);

    // The URL can then be used as the source of an image
    this.createImage(source);
  },

  handleTextItem: function(item) {
    console.log('handleTextItem');

    var _this = this;
    item.getAsString(function(str) {
      _this.callback(str);
    });
  },

  /* Parse the input in the paste catcher element */
  checkInput: function() {

    // store the pasted content in a variable
    var child = pasteCatcher.childNodes[0];

    // make sure we're always getting the latest inserted content
    pasteCatcher.innerHTML = "";
   
    if (!child) return;
     
    // if the user pastes an image, the src attribute
    // will represent the image as a base64 encoded string.
    if (child.tagName === "IMG") {
      this.createImage(child.src);
    }

    console.log('child', child);
  },
   
  createImage: function(source) {
    var pastedImage = new Image();
    var _this = this;
    pastedImage.onload = function() {
      _this.callback(pastedImage);
    };
    pastedImage.src = source;
  }
};
