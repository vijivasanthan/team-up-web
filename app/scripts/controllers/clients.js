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
        function ($rootScope, $scope, $location, Clients, data, $route, $routeParams, Store, Dater, $filter, $modal, TeamUp)
        {
          $rootScope.fixStyles();

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
                name:   i,
                start:  month.first.timeStamp,
                end:    month.last.timeStamp
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
            client:          true,
            newClientGroup:  false,
            newClient:       false,
            reports:         false,
            editClientGroup: false,
            editClient:      false,
            viewClient:      false,
            editImg:         false
          };

          var setView = function (hash)
          {
            $scope.views = {
              client:         false,
              newClientGroup: false,
              newClient:      false,
              reports:        false,
              editImg:        false
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

          var loadGroupReports = function ()
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);

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

                //                $scope.$watch(
                //                  $scope.groupReports, function (rs)
                //                  {
                //                    console.log('watcher found ... ', rs);
                //                    $scope.loadMembersImg();
                //                  }
                //                );

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

          $scope.processReports = function (reports)
          {
            var _reports = [];            
            angular.forEach(
              reports,
              function (report)
              {
                _reports.push(
                  {
                    uuid:         report.uuid,
                    title:        report.title,
                    creationTime: report.creationTime,
                    clientUuid:   report.clientUuid,
                    body:         report.body,
                    author:       $scope.$root.getTeamMemberById(report.authorUuid),
                    client:       $scope.$root.getClientByID(report.clientUuid),
                    filtered:     'false'
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
              id:   clientGroup.id
            };

            $scope.views.editClientGroup = true;
          };

          $scope.cancelClientGroupEdit = function (clientGroup)
          {
            $scope.cGroupEditForm = {
              name: clientGroup.name,
              id:   clientGroup.id
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
                  $rootScope.notifier.error('Error with saving client Group info');
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

                        $scope.$watch(
                          $location.search(),
                          function () { $location.search({ id: clientGroup.id }) }
                        );
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
                success: function (result) { 
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

          $scope.addContacts = function ()
          {
            if (typeof $scope.contactForm == 'undefined' || $scope.contactForm.func == '')
            {
              $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt2);

              return;
            }

            var contactPerson = {
              firstName: '',
              lastName:  '',
              function:  '',
              phone:     ''
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

          $scope.deleteClientGroup = function ()
          {
            if (window.confirm($rootScope.ui.teamup.delClientGroupConfirm))
            {
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
            }
          };

          $scope.deleteClient = function (clientId)
          {
            if (window.confirm($rootScope.ui.teamup.deleteConfirm))
            {
              $rootScope.statusBar.display($rootScope.ui.teamup.deletingClient);

              // client lost the client group ID, remove this client from the group first
              angular.forEach(
                $scope.clients,
                function (client)
                {
                  if (client.uuid == clientId)
                  {
                    var clientGroupId = client.clientGroupUuid;

                    if (clientGroupId == null || clientGroupId == '')
                    {
                      clientGroupId = $scope.clientGroup.id;
                    }

                    var changes = {},
                        clientIds = [],
                        emptyAddIds = [];

                    clientIds.push(clientId);

                    // TODO: More readable property names
                    changes[clientGroupId] = {
                      a: emptyAddIds,
                      r: clientIds
                    };

                    if (clientGroupId != null && clientGroupId != '' && clientGroupId != $scope.clientGroup.id)
                    {
                      changes[$scope.clientGroup.id] = {a: emptyAddIds, r: clientIds};
                    }

                    Clients.manage(changes).then(
                      function ()
                      {
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
                      });

                  }
                });
            }
          };

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
            $scope.report = report;

            $scope.view = {
              editReport: ! ! (report.editMode),
              viewReport: (! (report.editMode || typeof report.uuid == 'undefined')),
              newReport:  (typeof report.uuid == 'undefined')
            };

            $scope.close = function () { $modalInstance.dismiss() };

            $scope.saveReport = function (report)
            {
              console.log(report);
              if(report.editMode){
                    
                  TeamUp._(
                    'clientReportUpdate',
                    { second: report.clientUuid , 
                      fourth: report.uuid},
                    {
                      uuid:         report.uuid,
                      title:        report.title,
                      body:         report.body,
                      creationTime: report.creationTime
                    }
                  ).then(
                    function ()
                    {
                      $modalInstance.close(report);

                      $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                    }
                  );
              }else{
                  TeamUp._(
                    'clientReportAdd',
                    { second: report.clientUuid },
                    {
                      uuid:         report.uuid,
                      title:        report.title,
                      body:         report.body,
                      creationTime: report.creationTime
                    }
                  ).then(
                    function ()
                    {
                      $modalInstance.close(report);

                      $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                    }
                  );
              }
                                
            };
          };

          $scope.openReport = function (report)
          {
            $scope.report = report;
            $scope.report.editMode = false;

            // var modalInstance = $modal.open(
            $modal.open(
              {
                templateUrl: './views/reportTemplate.html',
                controller:  ModalInstanceCtrl,
                resolve:     {
                  report: function () { return $scope.report }
                }
              });
          };

          $scope.newReport = function ()
          {
            if ($scope.currentCLient == 0)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.selectClient);

              return;
            }

            $scope.report = {
              title:        $rootScope.ui.teamupnewReport,
              creationTime: new Date().getTime(),
              clientUuid:   $scope.currentCLient,
              body:         null,
              author:       $scope.$root.getTeamMemberById($rootScope.app.resources.uuid),
              client:       $scope.$root.getClientByID($scope.currentCLient),
              editMode:     false
            };

            var modalInstance = $modal.open(
              {
                templateUrl: 'views/reportTemplate.html',
                controller:  ModalInstanceCtrl,
                resolve:     {
                  report:   function () { return $scope.report },
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
                controller:  ModalInstanceCtrl,
                resolve:     {
                  report: function () { return $scope.report }
                }
              });
          };

          $scope.removeReport = function (report)
          {
            if (window.confirm($rootScope.ui.teamup.deleteConfirm))
            {
              $rootScope.statusBar.display($rootScope.ui.teamup.loading);

              TeamUp._(
                'clientReportDelete',
                {
                  second:   report.clientUuid,
                  reportId: report.uuid
                }
              ).then(
                function (result)
                {
                  if (result.result == 'ok')
                  {
                    $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);

                    loadGroupReports();
                  }
                  else
                  {
                    $rootScope.notifier.error(result.error);
                  }
                }, function (error) { console.log(error) });
            }
          };

          $scope.editImg = function() {            
              $scope.uploadURL = $scope.imgHost+$scope.ns+"/client/"+$scope.client.uuid+"/photo";              
              $scope.setViewTo('editImg');
          };

        }
      ]
    );
  }
);