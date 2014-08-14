(function (jQuery, window)
{
  'use strict';

  var matched, browser;

  jQuery.uaMatch = function (ua)
  {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) || ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

    var platform_match = /(ipad)/.exec(ua) ||
                         /(iphone)/.exec(ua) ||
                         /(android)/.exec(ua) || [];

    return {
      browser: match[1] || '',
      version: match[2] || '0',
      platform: platform_match[0] || ''
    };
  };

  matched = jQuery.uaMatch(window.navigator.userAgent);
  browser = {};

  if (matched.browser)
  {
    browser[matched.browser] = true;
    browser.version = matched.version;
  }

  if (matched.platform)
  {
    browser[matched.platform] = true;
  }

  if (browser.chrome)
  {
    browser.webkit = true;
  }
  else if (browser.webkit)
  {
    browser.safari = true;
  }

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(window.navigator.userAgent))
  {
    browser.mobile = true;

    browser.android = (/Android/i.test(window.navigator.userAgent)) ? true : false;

    browser.ios = (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) ? true : false;
  }
  else
  {
    browser.mobile = false;
  }

  jQuery.browser = browser;

})(jQuery, window);

(function (jQuery, window)
{
  'use strict';

  var os = {},
      navOS = window.navigator.appVersion;

  if (navOS.indexOf('Win') != - 1)   os.windows = true;
  if (navOS.indexOf('Mac') != - 1)   os.mac = true;
  if (navOS.indexOf('X11') != - 1)   os.unix = true;
  if (navOS.indexOf('Linux') != - 1) os.linux = true;

  jQuery.os = os;

})(jQuery, window);

(function ()
{
  var method,
      noop = function () {},
      methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
      ],
      length = methods.length,
      console = (
        window.console = window.console || {});

  while (length --)
  {
    method = methods[length];

    if (! console[method]) console[method] = noop;
  }
}());

if ($.browser.msie)
{
  var ver = $.browser.version || $.browser.version[0];

  if (ver == '6.0' || ver == '7.0') window.location = 'browsers.html';
}