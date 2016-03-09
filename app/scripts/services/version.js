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
              var version = (versionInfo.releaseNr) ? "v" + versionInfo.releaseNr : versionInfo.currentBranch;
              var output = "<span>App&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span> " + versionInfo.app;
              output += "<br /><span>Version:</span> " + version;
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
            var release = 'release';
            var indexBranch = unformattedVersionInfo.git_branch.indexOf('release');
            var formattedVersion = {
              releaseNr: '',
              buildDate: unformattedVersionInfo.date,
              currentBranch: unformattedVersionInfo.git_branch
            }

            formattedVersion.buildDate = formattedVersion.buildDate.substr(0, formattedVersion.buildDate.length - 6);
            formattedVersion.buildDate = moment(unformattedVersionInfo.date, "YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY hh:mm");

            if(indexBranch >= 0)
            {
              formattedVersion.currentBranch = unformattedVersionInfo.git_branch.substr(0, (indexBranch + release.length));
              formattedVersion.releaseNr = unformattedVersionInfo.git_branch.substr(
                                                              (indexBranch + (release.length + 1)),
                                                              unformattedVersionInfo.git_branch.length
                                                            );
            }
            return formattedVersion;
          }
        }
    );


  }
);