define(
  ['services/services', 'config'],
  function (services, config) {
    'use strict';

    services.factory(
      'Version',
        function (TeamUp, moment, Store, $q)
        {
          return {
	          /**
             * Get version info
             * @returns {Promise} return the version local or by request
             */
            getVersionInfo: function ()
            {
              var versionInfoLocal = Store('app').get('versionInfo'),
                  versionInfo = Object.keys(versionInfoLocal).length > 1 && versionInfoLocal || versionRequest();
              return $q.when(versionInfo);

              function versionRequest()
              {
                return TeamUp._('versionInfo')
                             .then(function(versionInfo)
                                   {
                                     if(! versionInfo.error)
                                     {
                                       versionInfo = formatVersionInfo(versionInfo);
                                       Store('app').save('versionInfo', versionInfo);
                                       return versionInfo;
                                     }
                                   });
              }
            },

	          /**
             * set the html output for the tooltip
             * @param versionInfo
             * @returns {string}
             */
            setVersionToolTip : function(versionInfo)
            {
              var output = "<span>App&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span> " + versionInfo.app;
              output += "<br /><span>Version:</span> v" + versionInfo.releaseNr;
              output += "<br /><span>Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span> " +  versionInfo.buildDate;
              output += "<br /><span>Branch&nbsp;:</span> " +  versionInfo.currentBranch;

              return output;
            }
          };

	        /**
           * Format the version info
           * @param unformattedVersionInfo
           * @returns {{releaseNr: string, buildDate: *, currentBranch: *}}
           */
          function formatVersionInfo(unformattedVersionInfo)
          {
            unformattedVersionInfo.date = unformattedVersionInfo.date.substr(
              0,
              unformattedVersionInfo.date.length - 6
            );
            var buildDate = moment(
              unformattedVersionInfo.date,
              "YYYY-MM-DD hh:mm:ss"
            ).format("DD-MM-YYYY hh:mm");

            return {
              releaseNr: "1.19",//hardcoded until the release nr is added,
              buildDate: buildDate,
              currentBranch: unformattedVersionInfo.git_branch
            }
          }
        }
    );


  }
);