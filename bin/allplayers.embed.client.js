(function(){var a=false,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(g){var f=this.prototype;a=true;var e=new this();a=false;for(var d in g){e[d]=typeof g[d]=="function"&&typeof f[d]=="function"&&b.test(g[d])?(function(h,i){return function(){var k=this._super;this._super=f[h];var j=i.apply(this,arguments);this._super=k;return j}})(d,g[d]):g[d]}function c(){if(!a&&this.init){this.init.apply(this,arguments)}}c.prototype=e;c.prototype.constructor=c;c.extend=arguments.callee;return c}})();(function(c){var b={trace:function(d){if(c.console!==undefined){c.console.log("Porthole: "+d)}},error:function(d){if(c.console!==undefined){c.console.error("Porthole: "+d)}}};b.WindowProxy=function(){};b.WindowProxy.prototype={post:function(e,d){},addEventListener:function(d){},removeEventListener:function(d){}};b.WindowProxyBase=Class.extend({init:function(d){if(d===undefined){d=""}this.targetWindowName=d;this.origin=c.location.protocol+"//"+c.location.host;this.eventListeners=[]},getTargetWindowName:function(){return this.targetWindowName},getOrigin:function(){return this.origin},getTargetWindow:function(){return b.WindowProxy.getTargetWindow(this.targetWindowName)},post:function(e,d){if(d===undefined){d="*"}this.dispatchMessage({data:e,sourceOrigin:this.getOrigin(),targetOrigin:d,sourceWindowName:c.name,targetWindowName:this.getTargetWindowName()})},addEventListener:function(d){this.eventListeners.push(d);return d},removeEventListener:function(g){var d;try{d=this.eventListeners.indexOf(g);this.eventListeners.splice(d,1)}catch(h){this.eventListeners=[]}},dispatchEvent:function(f){var d;for(d=0;d<this.eventListeners.length;d++){try{this.eventListeners[d](f)}catch(g){}}}});b.WindowProxyLegacy=b.WindowProxyBase.extend({init:function(d,e){this._super(e);if(d!==null){this.proxyIFrameName=this.targetWindowName+"ProxyIFrame";this.proxyIFrameLocation=d;this.proxyIFrameElement=this.createIFrameProxy()}else{this.proxyIFrameElement=null;throw new Error("proxyIFrameUrl can't be null")}},createIFrameProxy:function(){var d=document.createElement("iframe");d.setAttribute("id",this.proxyIFrameName);d.setAttribute("name",this.proxyIFrameName);d.setAttribute("src",this.proxyIFrameLocation);d.setAttribute("frameBorder","1");d.setAttribute("scrolling","auto");d.setAttribute("width",30);d.setAttribute("height",30);d.setAttribute("style","position: absolute; left: -100px; top:0px;");if(d.style.setAttribute){d.style.setAttribute("cssText","position: absolute; left: -100px; top:0px;")}document.body.appendChild(d);return d},dispatchMessage:function(e){var d=c.encodeURIComponent;if(this.proxyIFrameElement){var f=this.proxyIFrameLocation+"#"+d(b.WindowProxy.serialize(e));this.proxyIFrameElement.setAttribute("src",f);this.proxyIFrameElement.height=this.proxyIFrameElement.height>50?50:100}}});b.WindowProxyHTML5=b.WindowProxyBase.extend({init:function(d,e){this._super(e);this.eventListenerCallback=null},dispatchMessage:function(d){this.getTargetWindow().postMessage(b.WindowProxy.serialize(d),d.targetOrigin)},addEventListener:function(e){if(this.eventListeners.length===0){var d=this;this.eventListenerCallback=function(f){d.eventListener(d,f)};c.addEventListener("message",this.eventListenerCallback,false)}return this._super(e)},removeEventListener:function(d){this._super(d);if(this.eventListeners.length===0){c.removeEventListener("message",this.eventListenerCallback);this.eventListenerCallback=null}},eventListener:function(e,d){var f=b.WindowProxy.unserialize(d.data);if(f&&(e.targetWindowName==""||f.sourceWindowName==e.targetWindowName)){e.dispatchEvent(new b.MessageEvent(f.data,d.origin,e))}}});if(typeof c.postMessage!=="function"){b.trace("Using legacy browser support");b.WindowProxy=b.WindowProxyLegacy.extend({})}else{b.trace("Using built-in browser support");b.WindowProxy=b.WindowProxyHTML5.extend({})}b.WindowProxy.serialize=function(d){if(typeof JSON==="undefined"){throw new Error("Porthole serialization depends on JSON!")}return JSON.stringify(d)};b.WindowProxy.unserialize=function(g){if(typeof JSON==="undefined"){throw new Error("Porthole unserialization dependens on JSON!")}try{var d=JSON.parse(g)}catch(f){return false}return d};b.WindowProxy.getTargetWindow=function(d){if(d===""){return top}else{if(d==="top"||d==="parent"){return c[d]}}return parent.frames[d]};b.MessageEvent=function a(f,d,e){this.data=f;this.origin=d;this.source=e};b.WindowProxyDispatcher={forwardMessageEvent:function(i){var g,h=c.decodeURIComponent,f,d;if(document.location.hash.length>0){g=b.WindowProxy.unserialize(h(document.location.hash.substr(1)));f=b.WindowProxy.getTargetWindow(g.targetWindowName);d=b.WindowProxyDispatcher.findWindowProxyObjectInWindow(f,g.sourceWindowName);if(d){if(d.origin===g.targetOrigin||g.targetOrigin==="*"){d.dispatchEvent(new b.MessageEvent(g.data,g.sourceOrigin,d))}else{b.error("Target origin "+d.origin+" does not match desired target of "+g.targetOrigin)}}else{b.error("Could not find window proxy object on the target window")}}},findWindowProxyObjectInWindow:function(d,g){var f;if(d.RuntimeObject){d=d.RuntimeObject()}if(d){for(f in d){if(d.hasOwnProperty(f)){try{if(d[f]!==null&&typeof d[f]==="object"&&d[f] instanceof d.Porthole.WindowProxy&&d[f].getTargetWindowName()===g){return d[f]}}catch(h){}}}}return null},start:function(){if(c.addEventListener){c.addEventListener("resize",b.WindowProxyDispatcher.forwardMessageEvent,false)}else{if(document.body.attachEvent){c.attachEvent("onresize",b.WindowProxyDispatcher.forwardMessageEvent)}else{b.error("Cannot attach resize event")}}}};if(typeof c.exports!=="undefined"){c.exports.Porthole=b}else{c.Porthole=b}})(this);var allplayers = allplayers || {};

/**
 * Create the embedded class.
 *
 * @param {object} options The options for this embed library.
 * @param {object} defaults The default params for this libarary.
 * @this The allplayers.embed object.
 */
allplayers.embed = function(options, defaults) {
  if (defaults) {

    // Keep track of the self pointer.
    var self = this;

    // Add the proxy default.
    defaults.proxy = 'https://www.allplayers.com';
    defaults.proxy += '/sites/all/libraries/porthole/src/proxy.html';

    // Set the defaults.
    options = options || {};
    for (var name in defaults) {
      if (!options.hasOwnProperty(name)) {
        options[name] = defaults[name];
      }
    }

    // Set the options and initialize.
    this.options = options;
    this.init();
  }
};

/**
 * Initialize this embed code.
 */
allplayers.embed.prototype.init = function() {
  document.proxy = this;
};
var allplayers = allplayers || {embed: {}};

if (!jQuery.fn.allplayers_client) {

  /**
   * Define the jQuery plugin.
   *
   * @param {object} options The options for this plugin.
   * @return {object} A jQuery object.
   * @this The jQuery context for each element.
   **/
  jQuery.fn.allplayers_client = function(options) {
    return jQuery(this).each(function() {
      new allplayers.embed.client(options, jQuery(this));
    });
  };
}

/**
 * The allplayers embed client.
 *
 * @param {object} options The options for this embed client.
 * @param {object} context The display context for this plugin.
 * @this The allplayers.embed.client.
 */
allplayers.embed.client = function(options, context) {

  // Store the context.
  this.context = context;

  var spinner = 'https://www.allplayers.com';
  spinner += '/sites/all/themes/allplayers960/images/loading.gif';

  // Call the allplayers.embed constructor.
  allplayers.embed.call(this, options, {
    spinner: spinner,
    loading: 'loading...',
    base: 'https://platform.allplayers.com',
    type: 'registration',
    group: 'api',
    query: {},
    src: '',
    complete: function() {}
  });
};

/** Derive from allplayers.embed. */
allplayers.embed.client.prototype = new allplayers.embed();

/** Reset the constructor. */
allplayers.embed.client.prototype.constructor = allplayers.embed.client;

/**
 * Return the value of a parameter.
 *
 * @param {string} name The name of the parameter to get.
 * @return {string} The value of the parameter.
 */
allplayers.embed.client.getParam = function(name) {
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
  var regexS = '[\\?&]' + name + '=([^&#]*)';
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if (results == null) {
    return '';
  }
  else {
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
};

/**
 * Initialize the allplayer embed library.
 */
allplayers.embed.client.prototype.init = function() {

  // Call the parent.
  allplayers.embed.prototype.init.call(this);

  // Say that the plugin isn't ready.
  this.pluginReady = false;

  // Add the loading and iframe.
  var loading = jQuery(document.createElement('div')).css({
    background: 'url(' + this.options.spinner + ') no-repeat',
    margin: '0 5px',
    paddingLeft: '20px'
  });

  // Add the loading text.
  loading.append(this.options.loading);

  // Add the iframe.
  var iframeId = this.context.attr('id') + '_iframe';

  // Get the source for the iframe.
  var source = '';
  if (this.options.src) {
    source = this.options.src;
  }
  else {

    // Start the source out on the base.
    source = this.options.base + '/';

    // See if they provide their own query.
    var q = allplayers.embed.client.getParam('apq');
    if (q) {
      source += q;
    }
    else {
      source += 'g/' + this.options.group;
      switch (this.options.type) {
        case 'registration':
          source += '/register';
          break;
        case 'forms':
          source += '/forms';
          break;
      }
    }

    // Add the type as a query parameter.
    this.options.query.embedtype = this.options.type;

    // Define our own isEmptyObject function.
    var isEmptyObject = function(obj) {
      var name;
      for (name in obj) {
        return false;
      }
      return true;
    };

    // If they have some query options then add them here.
    if (!isEmptyObject(this.options.query)) {
      source += '?';
      for (var param in this.options.query) {
        source += param + '=' + encodeURIComponent(this.options.query[param]);
        source += '&';
      }
      source = source.replace(/\&$/, '');
    }
  }

  // Add the embed source to the url.
  source += (source.search(/\?/) === -1) ? '?' : '&';
  source += 'embedsource=' + encodeURIComponent(window.location.href);

  // Add the iframe ID to the iframe source.
  source += '#' + iframeId;

  var iframe = jQuery(document.createElement('iframe')).attr({
    id: iframeId,
    name: iframeId,
    scrolling: 'no',
    seamless: 'seamless',
    width: '100%',
    height: '0px',
    src: source
  }).css({
    border: 'none',
    overflowY: 'hidden'
  });

  // Create the loading element.
  this.context.append(loading);
  this.context.append(iframe);

  // Get the proxy.
  this.proxy = new Porthole.WindowProxy(
    this.options.proxy,
    iframe.attr('id')
  );

  var self = this;

  // Pass along chrome message responses to the server.
  if (typeof window.postMessage !== 'undefined') {
    window.addEventListener('message', function(event) {
      switch (event.data.name) {
        case 'chromeMsgResp':
          self.proxy.post({event: event.data});
          break;
        case 'chromePluginReady':
          self.pluginReady = true;
          break;
      }
    });
  }

  // Add the event listener.
  this.proxy.addEventListener(function(e) {

    // Switch on the event name.
    var event = e.data.hasOwnProperty('event') ? e.data.event : false;
    if (event) {
      switch (event.name) {

        // Pass along chrome messages.
        case 'chromeMsg':
          if (typeof window.postMessage !== 'undefined') {
            window.postMessage(event, '*');
          }
          break;

        // Called when the iframe has initalized.
        case 'init':
          loading.remove();
          iframe.height(event.height).attr('height', event.height + 'px');
          break;

        // Called when the process is complete.
        case 'complete':
          self.options.complete.call(self, event);
          break;

        // See when the server is ready.
        case 'serverReady':
          if (self.pluginReady) {
            self.proxy.post({event: {name: 'chromePluginReady'}});
          }
          break;
/* Investigate iframe redirects.
        case 'redirect':
          var current = window.location.href;
          if (current.search(/\?.*q\=([^&]*)/) > 0) {
            var replaceWith = '$1q=' + event.data + '$3';
            current.replace(/(.*\?.*)q\=([^&]*)(.*)/, replaceWith);
          }
          else {
            current += (window.location.search) ? '&' : '?';
            current += 'q=' + event.data;
          }
          window.location = current;
          break;
*/
      }
    }
  });
};
