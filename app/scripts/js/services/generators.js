'use strict';


angular.module('WebPaige.Services.Generators', ['ngResource'])


/**
 * Custom genrators
 */
.factory('Generators', 
  function ()
  {
    return {

      /**
       * Produce range
       */
      range: function ()
      {
        var min = 5,
            max = 120;

        return Math.floor( Math.random() * (max - min + 1) ) + min;
      },

      /**
       * Produce number
       */
      number: function ()
      {
        return Math.floor( Math.random() * 9000000 );
      },

      /**
       * Produce numbers list
       */
      list: function ()
      {
        var normals   = [],
            premiums  = ['1111111', '2222222', '3333333', '4444444', '5555555', '6666666', '7777777', '8888888', '9999999'];

        for (var i = 0; i < this.range(); i++)
        {
          var number = String(this.number());

          if (number.length > 6) normals.push(Number(number));
        }

        return {
          normals:  normals,
          premiums: premiums
        }
      }
    }
  }
);