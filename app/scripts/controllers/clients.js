define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'clientCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        'Clients',
        'data',
        '$route',
        '$routeParams',
        'Store',
        'Dater',
        '$filter',
        '$modal',
        'TeamUp',
        '$timeout',
        function ($rootScope, $scope, $location, Clients, data, $route, $routeParams, Store, Dater,
                  $filter, $modal, TeamUp, $timeout)
        {
          $rootScope.fixStyles();

          // $rootScope.notifier.success('test message');

          if (data.clientId)
          {
            data.clientGroups = Store('app').get('ClientGroups');
            data.clients = {};

            angular.forEach(
              data.clientGroups,
              function (clientGroup)
              {
                data.clients[clientGroup.id] = Store('app').get(clientGroup.id);

                angular.forEach(
                  data.clients[clientGroup.id],
                  function (client)
                  {
                    if (client.uuid == data.clientId)
                    {
                      $scope.client = client;
                      $scope.contacts = client.contacts;

                      // deal with the date thing for editing
                      client.birthDate = $filter('nicelyDate')(client.birthDate);
                      $scope.clientmeta = client;
                    }
                  }
                );
              }
            );
          }

          // TODO: Check if it is use!
          $scope.imgHost = config.app.host;
          $scope.ns = config.app.namespace;

          $scope.clients = data.clients;
          $scope.clientGroups = data.clientGroups;

          // process month drop-down list
          // TODO: Remove it later on!
          var Months = Dater.getMonthTimeStamps();

          $scope.Months = [];

          angular.forEach(
            Months,
            function (month, i)
            {
              $scope.Months[i] = {
                number: i,
                name: i,
                start: month.first.timeStamp,
                end: month.last.timeStamp
              };
            }
          );

          $scope.Months[0] = {number: 0, name: $rootScope.ui.teamup.selectMonth};

          var params = $location.search();

          $scope.search = { query: '' };

          $scope.selection = {};

          $scope.data = data;

          var uuid,
              view;

          if (! params.uuid && ! $location.hash())
          {
            uuid = data.clientGroups[0].id;
            view = 'client';

            $location.search({ uuid: data.clientGroups[0].id }).hash('client');
          }
          else if (! params.uuid)
          {
            uuid = data.clientGroups[0].id;

            view = $location.hash();

            $location.search({ uuid: data.clientGroups[0].id });
          }
          else
          {
            uuid = params.uuid;

            if (typeof uuid == 'undefined')
            {
              uuid = $scope.client.clientGroupUuid;
            }

            view = $location.hash();
          }

          $scope.views = {
            client: true,
            newClientGroup: false,
            newClient: false,
            reports: false,
            editClientGroup: false,
            editClient: false,
            viewClient: false,
            editImg: false
          };

          var setView = function (hash)
          {
            $scope.views = {
              client: false,
              newClientGroup: false,
              newClient: false,
              reports: false,
              editImg: false
            };

            //load the reports on this view
            if (hash == 'viewClient')
            {
              loadReports();
            }

            if (hash == 'reports')
            {
              loadGroupReports();
            }

            $scope.views[hash] = true;
          };

          // Load reports list for client profile view
          var loadReports = function ()
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);

            TeamUp._(
              'clientReportsQuery',
              { second: $scope.client.uuid },
              null,
              {
                success: function (reports) { Store('app').save('reports_' + $scope.client.uuid, reports) }
              }
            ).then(
              function (reports)
              {
                $rootScope.statusBar.off();

                $scope.reports = $scope.processReports(reports);

                //                $scope.$watch(
                //                  $scope.reports, function (rs)
                //                  {
                //                    console.log('watcher found ... ', rs);
                //                    $scope.loadMembersImg();
                //                  }
                //                );

              }, function (error) { console.log(error) });
          };

          // Get the list of reports for certain client group for reports tab
          var loadGroupReports = function ()
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);

            // get the groupId from the url
            if (! $scope.clientGroup)
            {
              $scope.clientGroup = data.clientGroups[0];
            }

            TeamUp._(
              'clientGroupReportsQuery',
              {
                second: $scope.clientGroup.id
              }
            ).then(
              function (reports)
              {
                $rootScope.statusBar.off();

                $scope.groupReports = $scope.processReports(reports);

                if ($scope.currentCLient != 0)
                {
                  $scope.requestReportsByFilter();
                }

                // open the report tab if the there is report Id in the params
                var reportId = $location.search().reportUuid;
                var report_modal = null;
                if (reportId)
                {
                  angular.forEach(
                    $scope.groupReports, function (report)
                    {
                      if (report.uuid == reportId)
                      {
                        report_modal = report;
                      }
                    });
                  if (report_modal == null)
                  {
                    // clear the url param
                    if ($location.search().reportUuid)
                    {
                      $location.search('reportUuid', null);
                    }
                    $rootScope.notifier.error($rootScope.ui.teamup.reportNotExists);
                    return;
                  }
                  $scope.openReport(report_modal);
                }

              }, function (error) { console.log(error) });

          };

          setView(view);

          setClientView(uuid);

          function setClientView (id)
          {
            angular.forEach(
              data.clientGroups,
              function (clientGroup)
              {
                if (clientGroup.id == id)
                {
                  $scope.clientGroup = clientGroup;
                }
              }
            );

            $scope.clients = data.clients[id];

            $scope.current = id;

            // show reports of this groups
            if ($scope.views.reports)
            {
              //reset the filter
              $scope.currentCLient = '0';
              $scope.currentMonth = '0';

              loadGroupReports();
            }
          }

          $scope.requestClientGroup = function (current, switched)
          {
            setClientView(current);

            $scope.$watch(
              $location.search(),
              function ()
              {
                $location.search({ uuid: current });
              });

            if (switched)
            {
              if ($location.hash() != 'client')
              {
                $location.hash('client');
              }

              setView('client');
            }
          };

          // Make reports data view friendly
          $scope.processReports = function (reports)
          {
            var _reports = [];

            angular.forEach(
              reports,
              function (report)
              {
                _reports.push(
                  {
                    uuid: report.uuid,
                    title: report.title,
                    creationTime: report.creationTime,
                    clientUuid: report.clientUuid,
                    body: report.body,
                    media: report.media || [],
                    author: $scope.$root.getTeamMemberById(report.authorUuid),
                    client: $scope.$root.getClientByID(report.clientUuid),
                    filtered: 'false'
                  }
                );
              }
            );

            return _reports;
          };

          $scope.setViewTo = function (hash)
          {
            $scope.$watch(
              hash,
              function ()
              {
                if (! $scope.clientGroup)
                {
                  $scope.clientGroup = $scope.clientGroups[0]
                }

                if (($location.hash() == 'viewClient' ||
                     $location.hash() == 'editClient' ||
                     $location.hash() == 'editImg') && hash == 'client')
                {
                  $location.path('/client').search({uuid: $scope.clientGroup.id});
                }

                $location.hash(hash);

                setView(hash);
              }
            );
          };

          $scope.editClientGroup = function (clientGroup)
          {
            $scope.cGroupEditForm = {
              name: clientGroup.name,
              id: clientGroup.id
            };

            $scope.views.editClientGroup = true;
          };

          $scope.cancelClientGroupEdit = function (clientGroup)
          {
            $scope.cGroupEditForm = {
              name: clientGroup.name,
              id: clientGroup.id
            };

            $scope.views.editClientGroup = false;
          };

          $scope.changeClientGroup = function (clientGroup)
          {
            // TODO: Replace jQuery trimmer
            if ($.trim(clientGroup.name) == '')
            {
              // FIXME: Message does not exist!
              // $rootScope.notifier.error($rootScope.ui.teamup.cGroupNamePrompt1);
              return;
            }

            // FIXME: Message does not exist!
            // $rootScope.statusBar.display($rootScope.ui.teamup.saveClientGroup);

            TeamUp._(
              'clientGroupUpdate',
              { second: clientGroup.id },
              clientGroup.id
            ).then(
              function (result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.errorSaveClientGroup);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                  Clients.query(false)
                    .then(
                    function ()
                    {
                      $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                      $rootScope.statusBar.off();

                      $scope.clientGroup.name = clientGroup.name;
                      $scope.views.editClientGroup = false;
                    }
                  );
                }
              }
            );
          };

          // Refresh the clients in the certain group after adding , updating or removing client. 
          // forward user to the client view if the group is successfully refreshed. 
          var reloadGroup = function (result)
          {
            Clients.query(false, result)
              .then(
              function (queries)
              {
                if (queries.error)
                {
                  // FIXME: Message does not exist!
                  // $rootScope.notifier.error($rootScope.ui.teamup.queryCGroupError);
                  console.warn('error ->', queries);
                }
                else
                {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  $scope.closeTabs();

                  $scope.data = queries;

                  $scope.clientGroups = queries.clientGroups;
                  $scope.clients = queries.clients;

                  angular.forEach(
                    queries.clientGroups,
                    function (clientGroup)
                    {
                      if (clientGroup.id == result.uuid)
                      {
                        $scope.clientGroup = clientGroup;

                        $scope.current = clientGroup.id;

                        // $scope.$watch(
                        //   $location.search(),
                        //   function () { $location.search({ id: clientGroup.id }) }
                        // );

                        $location.url('/client?uuid=' + clientGroup.id).hash('client');
                      }
                    }
                  );
                }

                $rootScope.statusBar.off();
              }
            );
          };

          $scope.cGroupSubmit = function (clientGroup)
          {
            if (typeof clientGroup == 'undefined' || $.trim(clientGroup.name) == '')
            {
              $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);

              return;
            }

            // FIXME: Message does not exist!
            // $rootScope.statusBar.display($rootScope.ui.teamup.saveClientGroup);

            TeamUp._(
              'clientGroupAdd',
              null,
              clientGroup,
              {
                success: function (result)
                {
                  Store('app').save(result.id, result);
                }
              }
            ).then(
              function (result)
              {
                if (result.error)
                {
                  // FIXME: Message does not exist!
                  // $rootScope.notifier.error($rootScope.ui.teamup.cGroupSubmitError);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                  reloadGroup({ 'uuid': result.id });
                }
              }
            );
          };

          $scope.closeTabs = function ()
          {
            $scope.clientGroupForm = {};

            $scope.clientForm = {};

            setView('client');
          };

          // This function only push new contact into a scope array, need to submit to save the contact
          // TODO: design a way to save the contact directly
          $scope.addContacts = function ()
          {
            if (typeof $scope.contactForm == 'undefined' || $scope.contactForm.func == '')
            {
              $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt2);

              return;
            }

            var contactPerson = {
              firstName: '',
              lastName: '',
              function: '',
              phone: ''
            };

            contactPerson.firstName = $scope.contactForm.firstName;
            contactPerson.lastName = $scope.contactForm.lastName;
            contactPerson.function = $scope.contactForm.function;
            contactPerson.phone = $scope.contactForm.phone;

            if (typeof $scope.contacts == 'undefined')
            {
              $scope.contacts = [];
            }

            if ($scope.contacts == null)
            {
              $scope.contacts = [];
            }

            $scope.contacts.push(contactPerson);
          };

          // create a new client
          $scope.clientSubmit = function (client)
          {
            if (typeof client == 'undefined' || ! client.firstName || ! client.lastName || ! client.phone)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.clinetInfoFill);

              return;
            }

            $rootScope.statusBar.display($rootScope.ui.teamup.savingClient);

            // might need to convert the client to client obj
            try
            {
              client.birthDate = Dater.convert.absolute(client.birthDate, 0);
            }
            catch (error)
            {
              // console.log(error);

              $rootScope.notifier.error($rootScope.ui.teamup.birthdayError);

              return;
            }

            client.clientGroupUuid = $scope.clientGroup.id;

            TeamUp._(
              'clientAdd',
              null,
              client,
              {
                success: function (result) { Store('app').save(result.id, result) }
              }
            ).then(
              function (result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
                }
                else
                {
                  reloadGroup({ 'uuid': result.clientGroupUuid });
                }
              }
            );

          };

          // update client infomation
          $scope.clientChange = function (client)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.savingClient);

            try
            {
              client.birthDate = Dater.convert.absolute(client.birthDate, 0);
            }
            catch (error)
            {
              // console.log(error);

              $rootScope.notifier.error($rootScope.ui.teamup.birthdayError);

              return;
            }

            TeamUp._(
              'clientUpdate',
              { second: client.uuid },
              client
            ).then(
              function (result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
                }
                else
                {
                  $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                  reloadGroup({ 'uuid': result.clientGroupUuid });
                }
              }
            );
          };

          // update the client's contact , this one really submit the info to the backend.
          // addContacts only add contact to the scope.
          $scope.saveContacts = function (contacts)
          {
            var client = $scope.client;

            try
            {
              client.birthDate = Dater.convert.absolute(client.birthDate, 0);
            }
            catch (error)
            {
              // console.log(error);
              $rootScope.notifier.error($rootScope.ui.teamup.birthdayError);

              return;
            }

            client.contacts = contacts;

            $rootScope.statusBar.display($rootScope.ui.teamup.savingContacts);

            TeamUp._(
              'clientUpdate',
              { second: client.uuid },
              client
            ).then(
              function (result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
                }
                else
                {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  $rootScope.statusBar.off();

                  // TODO: Nothing has been done with the result of query!!!
                  Clients.query(
                    false,
                    { 'uuid': result.clientGroupUuid }
                  ).then(function (queryRs) {});
                }

                $scope.client.birthDate = $filter('nicelyDate')($scope.client.birthDate);
              }
            );
          };
          // after people remove the contacts, you still need to save it to make it work.
          $scope.removeContact = function (contact)
          {
            // TODO: Contact has only been removed from list also from backend?!
            angular.forEach(
              $scope.contacts,
              function (_contact, i)
              {
                if (contact.name == _contact.name &&
                    contact.func == _contact.func &&
                    contact.phone == _contact.phone)
                {
                  $scope.contacts.splice(i, 1);
                }
              }
            );
          };

          $scope.confirmDeleteClientGroup = function ()
          {
            $timeout(
              function ()
              {
                angular.element('#confirmClientGroupModal').modal('show');
              }
            );
          };

          $scope.deleteClientGroup = function ()
          {
            angular.element('#confirmClientGroupModal').modal('hide');

            $rootScope.statusBar.display($rootScope.ui.teamup.deletingClientGroup);

            TeamUp._(
              'clientGroupDelete',
              { second: $scope.current }
            ).then(
              function (result)
              {
                if (result.id)
                {
                  Clients.query(
                    true,
                    {}
                  ).then(
                    function (clientGroups)
                    {
                      $scope.requestClientGroup(clientGroups[0].id);

                      angular.forEach(
                        $scope.clientGroups,
                        function (clientGroup, i)
                        {
                          if (clientGroup.id == result.id)
                          {
                            $scope.clientGroups.splice(i, 1);
                          }
                        }
                      );
                    }, function (error) { console.log(error) });

                }

                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
              }, function (error) { console.log(error) });
          };

          $scope._clientId = {};

          $scope.confirmDeleteClient = function (clientId)
          {
            $timeout(
              function ()
              {
                $scope._clientId = clientId;

                angular.element('#confirmClientModal').modal('show');
              }
            );
          };

          // after delete the client, refresh the client group which used to have the client inside.
          $scope.deleteClient = function (clientId)
          {
            $scope._clientId = {};

            angular.element('#confirmClientModal').modal('hide');

            $rootScope.statusBar.display($rootScope.ui.teamup.deletingClient);


            TeamUp._(
              'clientDelete',
              { second: clientId }
            ).then(
              function ()
              {
                TeamUp._(
                  'clientsQuery'
                ).then(
                  function (clients)
                  {
                    Store('app').save('clients', clients);

                    if ($scope.views.viewClient == true)
                    {
                      $scope.setViewTo('client');
                    }
                    else
                    {
                      $route.reload();
                    }
                  }
                );
              }, function (error) { console.log(error) });
          };

          // filter the report by client or the created month 
          $scope.requestReportsByFilter = function ()
          {
            angular.forEach(
              $scope.groupReports,
              function (report)
              {
                // filter need to be checked
                // client Id, month
                if (report.clientUuid != $scope.currentCLient && $scope.currentCLient != '0')
                {
                  report.filtered = 'true';
                }
                else
                {
                  report.filtered = 'false';
                }

                // TODO: Could they be converted to boolans?
                var reportMonth = new Date(report.creationTime).getMonth() + 1;

                if ((reportMonth != $scope.currentMonth && $scope.currentMonth != '0') || report.filtered == 'true')
                {
                  report.filtered = 'true';
                }
                else
                {
                  report.filtered = 'false';
                }

              }
            );
          };

          var ModalInstanceCtrl = function ($scope, $modalInstance, report)
          {
            // console.log(' ModalInstanceCtrl ->', $scope, $modalInstance, report);

            $scope.report = report;

            $scope.view = {
              editReport: ! ! (report.editMode),
              viewReport: (! (report.editMode || typeof report.uuid == 'undefined')),
              newReport: (typeof report.uuid == 'undefined')
            };

            $scope.close = function ()
            {
              $modalInstance.dismiss();
              if ($location.search().reportUuid)
              {
                $location.search('reportUuid', null);
              }
            };

            // add new report, send systemm message at the same time. 
            $scope.saveReport = function (report)
            {
              console.log(report);
              if (report.editMode)
              {

                TeamUp._(
                  'clientReportUpdate',
                  { second: report.clientUuid,
                    fourth: report.uuid},
                  {
                    uuid: report.uuid,
                    title: report.title,
                    body: report.body,
                    creationTime: report.creationTime
                  }
                ).then(
                  function (result)
                  {
                    $modalInstance.close(report);

                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  }
                );
              }
              else
              {
                TeamUp._(
                  'clientReportAdd',
                  { second: report.clientUuid },
                  {
                    uuid: report.uuid,
                    title: report.title,
                    body: report.body,
                    creationTime: report.creationTime
                  }
                ).then(
                  function (result)
                  {
                    $modalInstance.close(report);

                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  }
                );
              }

            };
          };

          // open a report by using the modal plug-in , here you need to use inject function to inject 
          // vriables into the Modal controller to prevent the issue that problems caused by Uglifying javascript 

          ModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'report'];

          $scope.openReport = function (report)
          {
            $scope.report = report;
            $scope.report.editMode = false;

            $modal.open(
              {
                templateUrl: './views/reportTemplate.html',
                controller: ModalInstanceCtrl,
                resolve: {
                  report: function () { return $scope.report }
                }
              }
            );
          };

          $scope.newReport = function ()
          {
            if ($scope.currentCLient == 0)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.selectClient);

              return;
            }

            $scope.report = {
              title: $rootScope.ui.teamup.newReport,
              creationTime: new Date().getTime(),
              clientUuid: $scope.currentCLient,
              body: null,
              author: $scope.$root.getTeamMemberById($rootScope.app.resources.uuid),
              client: $scope.$root.getClientByID($scope.currentCLient),
              editMode: false
            };

            var modalInstance = $modal.open(
              {
                templateUrl: 'views/reportTemplate.html',
                controller: ModalInstanceCtrl,
                resolve: {
                  report: function () { return $scope.report },
                  editMode: false
                }
              }
            );

            modalInstance.result.then(
              function () { loadGroupReports() },
              function () { console.log('Modal dismissed at: ' + new Date()) });
          };

          $scope.editReport = function (report)
          {
            $scope.report = report;
            $scope.report.editMode = true;

            // var modalInstance = $modal.open(
            $modal.open(
              {
                templateUrl: './views/reportTemplate.html',
                controller: ModalInstanceCtrl,
                resolve: {
                  report: function () { return $scope.report }
                }
              });
          };

          $scope._report = {};

          $scope.confirmDeleteReport = function (report)
          {
            $timeout(
              function ()
              {
                $scope._report = report;

                angular.element('#confirmReportModal').modal('show');
              }
            );
          };

          $scope.removeReport = function (report)
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loading);

            $scope._report = {};

            angular.element('#confirmReportModal').modal('hide');

            TeamUp._(
              'clientReportDelete',
              {
                second: report.clientUuid,
                reportId: report.uuid
              }
            ).then(
              function (result)
              {
                if (result.result == 'ok')
                {
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                  loadGroupReports();

                  if ($scope.views.viewClient == true)
                  {
                    loadReports();
                  }
                }
                else
                {
                  $rootScope.notifier.error(result.error);
                }
              }, function (error) { console.log(error) });
          };

          $scope.editImg = function ()
          {
            $scope.uploadURL = $scope.imgHost + $scope.ns + "/client/" + $scope.client.uuid + "/photo?square=true";
            $scope.setViewTo('editImg');
          };

          // open report from the link ( from the chat message ) 
          // there will be a link URL changing when opening a report from other views , need to do some special process
          $scope.$on(
            '$locationChangeSuccess', function (event, currentURL, preURL)
            {
              // console.log("event ", event);
              var currentScope = event.currentScope;
              if ($location.hash() == "reports")
              {
                var param_clientGroup = $location.search().uuid;
                var param_report = $location.search().reportUuid;

                if (param_clientGroup)
                {
                  if (param_clientGroup != currentScope.clientGroup.id)
                  {
                    angular.forEach(
                      currentScope.data.clientGroups, function (cGrp)
                      {
                        if (cGrp.id == param_clientGroup)
                        {
                          currentScope.clientGroup = cGrp;
                        }
                      });
                    currentScope.setViewTo('reports');
                  }
                  else
                  {
                    if (param_report)
                    {
                      var report_obj = null;
                      angular.forEach(
                        $scope.groupReports, function (rpt)
                        {
                          if (rpt.uuid == param_report)
                          {
                            report_obj = rpt;
                          }
                        });
                      if (report_obj == null)
                      {
                        $rootScope.notifier.error($rootScope.ui.teamup.reportNotExists);
                        // clear the url param
                        if ($location.search().reportUuid)
                        {
                          $location.search('reportUuid', null);
                        }
                        return;
                      }
                      currentScope.openReport(report_obj);
                    }
                  }
                }
              }

            });

        }
      ]
    );
  }
);