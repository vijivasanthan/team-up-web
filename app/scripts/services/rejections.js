define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Rejections',
        function ($rootScope)
        {
          return {
            sessionTimeOut: function()
            {
              $rootScope.logout();
              localStorage.setItem('sessionTimeout', '');
            },
            trowError: function (error)
            {
              if(error.config && !error.config.ignore)
              {
                var errorCode = error.data && error.data.errorCode || 1,
                    controller = error.config.url.split('/');
                controller = controller[controller.length - 1];

                $rootScope.statusBar.off();

                if(controller !== 'login' && controller !== 'passwordReset')
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.errorCode[errorCode.toString()]);
                }
                console.log('error -> ' + error.config.url, error);

                trackGa('send', 'exception', {
                  exDescription: error.statusText,
                  exFatal: false,
                  exError: 'Response error',
                  exStatus: error.status,
                  exUrl: error.config.url,
                  exData: error.data,
                  exParams: _.values(error.config.params).join() || '',
                  exMethodData: _.values(error.config.data).join() || ''
                });
              }
            }
          };
        }
    );
  }
);