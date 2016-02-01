define(
  ['services/services', 'config'],
  function (services, config) {
    'use strict';

    services.factory(
      'Strings',
      function () {
        return {

          /**
           * Truncate string from words with ..
           */
          truncate: function (txt, n, useWordBoundary) {
            var toLong = txt.length > n,
              s_ = toLong ? txt.substr(0, n - 1) : txt,
              s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;

            return toLong ? s_ + '..' : s_;
          },

          /**
           * To title case
           */
          toTitleCase: function (str) {
            if (str) {
              return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            }
          }
        }
      }
    );


  }
);