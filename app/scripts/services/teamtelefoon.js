define(['services/services'],
  function (services)
  {
    'use strict';

    services.factory('TeamTelefoon',
      function ($resource,
                $q,
                Settings)
      {
        // constructor \\
        var teamtelefoonService = function () {};

        (function ()
        {
          // public methods \\

          this.getScenario = getScenario;
          this.getOptions = getOptions;

          /**
           *
           * @param resources teamId, scenarioId
           * @returns {*}
           */
          function getScenario(resources)
          {
            return promisify(resourceScenario().get(resources));
          }

          function getOptions(resources)
          {
            return promisify(resourceOptions().get(resources));
          }
        }).call(teamtelefoonService.prototype);

        // private methods \\

        /**
         * Auto resolve the possible promise rejection
         * This in case of a reject in a route resolve method
         * this needs to be resolved otherwise the controller
         * is not loaded
         * @param resource
         * @returns {*} a resolved promise
         */
        function promisify(resource)
        {
          return $q(function (resolve)
          {
            resource
              .$promise
              .then(function(result)
            {
              resolve(result);
            }, function (err) {
              resolve(err);
            })
          });
        }

        /**
         * Get the current backend url
         * @returns {*} url
         */
        function getBackEnd()
        {
          return Settings.getBackEnd();
        }

        /**
         * Scenario resource
         * possible params teamId and scenarioId
         * @returns {*} resource
           */
        function resourceScenario()
        {
          return $resource(getBackEnd() + 'teamTelephone/:teamId/scenarioInfo', {}, {
            get: {
              method: 'GET',
              params: {}
            }
          });
        }

        /**
         * Options resource
         * possible param teamId
         * @returns {*} resource
         */
        function resourceOptions()
        {
          return $resource(getBackEnd() + 'team/:teamId/teamTelephone', {}, {
            get: {
              method: 'GET',
              params: {}
            }
          });
        }

        return new teamtelefoonService();
      });
  });