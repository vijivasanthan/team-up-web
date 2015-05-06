define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'clientCtrl',
        function ($rootScope, $scope, $location, Report, Clients, Teams, data, $route, $routeParams, Store, Dater,
                  $filter, $modal, TeamUp, $timeout, Reports, moment, CurrentSelection, Message)
        {
          //TODO clients can't have more then one clientGroup by viewing this url. Remove the uuid from url and create a new controller clientDetail or profile
          //http://localhost:3000/index.html#/clientProfile/17093d63-dd99-4aef-b83f-dbf3f8ac18c3?uuid=3467f9e3-b354-4ce3-807c-92695485ce08#viewClient

          console.log('data', data);

          $rootScope.fixStyles();
          $rootScope.resetPhoneNumberChecker();

          var modalInstance = null;

          if (data.clientId)
          {
            var clientHasClientGroup = false;
            Reports.clientId = data.clientId;

            data.clientGroups = Store('app').get('ClientGroups');
            data.clients = {};

            angular.forEach(
              data.clientGroups,
              function (clientGroup)
              {
                data.clients[clientGroup.id] = Store('app').get(clientGroup.id);
                var clientInTeam = _.findWhere(data.clients[clientGroup.id], {uuid: data.clientId});

                if(!_.isUndefined(clientInTeam))
                {
                  clientInTeam.birthDate = moment(clientInTeam.birthDate).format('DD-MM-YYYY');
                  $scope.client = clientInTeam;
                  $scope.contacts = clientInTeam.contacts;

                  $scope.clientmeta = clientInTeam;
                  clientHasClientGroup = true;
                }
              }
            );

            if (!clientHasClientGroup)
            {
              data.clients = Store('app').get('clients');
              data.client = _.findWhere(data.clients, {uuid: data.clientId});
              data.client.birthDate = moment(data.client.birthDate).format('DD-MM-YYYY');
              $scope.client = data.client;
              Reports.clientId = $scope.client.uuid;
              $scope.contacts = data.client.contacts;
              $scope.clientmeta = data.client;
            }
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

          var params = $location.search(),
            reportUuid = params.reportUuid;

          $scope.search = {query: ''};

          $scope.selection = {};

          $scope.data = data;

          var uuid,
            view;

          if (!params.uuid && !$location.hash())
          {
            uuid = CurrentSelection.getClientGroupId();
            view = 'client';

            $location.search({uuid: uuid}).hash('client');
          }
          else if (!params.uuid)
          {
            uuid = CurrentSelection.getClientGroupId();

            view = $location.hash();

            $location.search({uuid: uuid});
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

            if (hash == 'reports' && _.isUndefined(reportUuid))
            {
              loadGroupReports();
            }

            $scope.views[hash] = true;
          };

          // Load reports list for client profile view
          var loadReports = function ()
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);

            Report.all($scope.client.uuid)
              .then(
                function(reports)
                {
                  $rootScope.statusBar.off();

                  $scope.reports = $scope.processReports(reports);
                }
              );
          };

          // Get the list of reports for certain client group for reports tab
          var loadGroupReports = function ()
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);

            // get the groupId from the url
            if (!$scope.clientGroup)
            {
              $scope.clientGroup = data.clientGroups[0];
            }

            Report.allByClientGroup($scope.clientGroup.id)
              .then(
                function(reports)
                {
                  $rootScope.statusBar.off();

                  $scope.groupReports = $scope.processReports(reports);

                  if ($scope.currentCLient != 0)
                  {
                    $scope.requestReportsByFilter();
                  }

                  // open the report tab if the there is report Id in the params
                  var reportId = $location.search().reportUuid;

                  if (reportId)
                  {
                    var report = (_.findWhere($scope.groupReports, {uuid: reportId})) || null;

                    if (report == null)
                    {
                      // clear the url param
                      if ($location.search().reportUuid)
                      {
                        $location.search('reportUuid', null);
                      }
                      $rootScope.notifier.error($rootScope.ui.teamup.reportNotExists);
                      return;
                    }
                    $scope.openReport(report);
                  }
                }
            );
          };

          setView(view);

          setClientView(uuid);

          function setClientView(id)
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
            CurrentSelection.local = current;

            setClientView(current);

            $scope.$watch(
              $location.search(),
              function ()
              {
                $location.search({uuid: current});
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
                if (!$scope.clientGroup)
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
              {second: clientGroup.id},
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

                  reloadGroup({'uuid': result.id});
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
          $scope.changeContacts = function (contactIndex)
          {
            if (_.isUndefined($scope.contactForm) || $scope.contactForm.func == ''
              || $scope.contactForm.name != null)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt2);

              return;
            }

            if ($rootScope.phoneNumberParsed.result == false)
            {
              $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);

              return;
            }
            else if ($rootScope.phoneNumberParsed.result == true)
            {
              $scope.contactForm.phone = $rootScope.phoneNumberParsed.format;
            }

            if (!_.isNumber(contactIndex))
            {
              var contactPerson = {
                firstName: $scope.contactForm.firstName,
                lastName: $scope.contactForm.lastName,
                function: $scope.contactForm.function,
                phone: $scope.contactForm.phone
              };

              if (typeof $scope.contacts == 'undefined')
              {
                $scope.contacts = [];
              }

              if ($scope.contacts == null)
              {
                $scope.contacts = [];
              }

              $scope.contacts.push(contactPerson);
            }

            $scope.contactForm = null;
            $rootScope.resetPhoneNumberChecker();
          };

          $scope.editContact = function (contact, index)
          {
            $scope.contactForm = contact;
            $scope.contactForm.index = index;
          };

          // create a new client
          $scope.clientSubmit = function (client)
          {
            if (typeof client == 'undefined' || !client.firstName || !client.lastName)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.clinetInfoFill);

              return;
            }

            if(! client.phone)
            {
              $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);

              return;
            }

            if ($rootScope.phoneNumberParsed.result == false)
            {
              $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);

              return;
            }
            else if ($rootScope.phoneNumberParsed.result == true)
            {
              client.phone = $rootScope.phoneNumberParsed.format;
            }

            client.clientGroupUuid = $scope.clientGroup.id;

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
              'clientAdd',
              null,
              client,
              {
                success: function (result)
                {
                  Store('app').save(result.id, result)
                }
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
                  $scope.contactForm = null;
                  $rootScope.resetPhoneNumberChecker();
                  reloadGroup({'uuid': result.clientGroupUuid});
                }
              }
            );

          };

          // update client infomation
          $scope.clientChange = function (client)
          {
            //todo client address must be required in the client form
            if (client.address)
            {
              if
              (
                !client.address.city && !client.address.country && !client.address.latitude && !client.address.longitude
                && !client.address.street && !client.address.zip
              )
              {
                client.address = null;
              }
            }

            if ($rootScope.phoneNumberParsed.result == false)
            {
              $rootScope.notifier.error($rootScope.ui.validation.phone.notValid);

              return;
            }
            else if ($rootScope.phoneNumberParsed.result == true)
            {
              client.phone = $rootScope.phoneNumberParsed.format;
            }

            $rootScope.statusBar.display($rootScope.ui.teamup.savingClient);

            //temp var, so the user should't see the date changing
            var changedClient = angular.copy(client);

            try
            {
              //convert birthdate into miliseconds for saving
              changedClient.birthDate = Dater.convert.absolute(client.birthDate, 0);
            }
            catch (error)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.birthdayError);

              return;
            }

            Clients.singleUpdate(changedClient)
              .then(
              function (result)
              {
                if (result.error)
                {
                  $rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
                }
                else
                {
                  $rootScope.resetPhoneNumberChecker();
                  $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

                  //todo redirect to the clientprofile who was edited
                  var clientGroupId = result.clientGroupUuid || $scope.current || $scope.clientGroups[0].id;

                  reloadGroup({'uuid': clientGroupId});

                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
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

            //var currentClientGroup = Store('app').get($route.current.params.uuid),
            //    clientIndex = _.findIndex(currentClientGroup, {uuid: client.uuid});
            //
            //currentClientGroup[clientIndex] = client;
            //
            //Store('app').save($route.current.params.uuid, currentClientGroup);

            TeamUp._(
              'clientUpdate',
              {second: client.uuid},
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
                    {'uuid': result.clientGroupUuid}
                  );

                  $scope.client.birthDate = $filter('nicelyDate')($scope.client.birthDate);
                }
              }
            );
          };

          // after people remove the contacts, you still need to save it to make it work.
          $scope.removeContact = function (contact)
          {
            // TODO: Contact has only been removed from list also from backend?!
            var indexContact = $scope.contacts.indexOf(contact);
            $scope.contacts.splice(indexContact, 1);
            angular.element('#confirmContactModal').modal('hide');
          };

          $scope.confirmationRemoveContact = function (contact)
          {
            $timeout(
              function ()
              {
                $scope._contact = contact;

                angular.element('#confirmContactModal').modal('show');
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
              {second: $scope.current}
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
                    }, function (error)
                    {
                      console.log(error)
                    });

                }

                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
              }, function (error)
              {
                console.log(error)
              });
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

            Clients.removeSingleFromAllLocally(clientId);

            if ($scope.views.viewClient == true)
            {
              $scope.setViewTo('client');
            }
            else
            {
              $route.reload();
            }

            //TeamUp._(
            //  'clientDelete',
            //  {second: clientId}
            //).then(
            //  function ()
            //  {
            //
            //  }, function (error)
            //  {
            //    console.log(error)
            //  });
          };

          var filterReport = function(clientId, createDate)
          {
            $scope.currentCLient = clientId;
            $scope.currentMonth = moment(createDate).format('M');
            $scope.requestReportsByFilter();
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

          $scope.getView = function (report)
          {
            $scope.view = $scope.view || {};

            $scope.view.editReport = !!(report.editMode);
            $scope.view.viewReport = (!(report.editMode || typeof report.uuid == 'undefined'));
            $scope.view.newReport = (typeof report.uuid == 'undefined');
          };

          $scope.close = function ()
          {
            if ($location.search().reportUuid)
            {
              $location.search('reportUuid', null);
            }

            modalInstance.hide();
          };

          // add new report, send systemm message at the same time.
          $scope.saveReport = function (report)
          {
            if(_.isEmpty(report.title) || _.isEmpty(report.body))
            {
              $rootScope.notifier.error($rootScope.ui.teamup.reportEmpty);
              return;
            }

            if (report.editMode)
            {
              Report.update(report)
                .then(
                function ()
                {
                  $scope.close(report);
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  loadGroupReports();
                }
              );
            }
            else
            {
              Report.save(report)
                .then(
                function ()
                {
                  $scope.close(report);
                  $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                  loadGroupReports();
                  filterReport(report.clientUuid, report.creationTime);
                }
              );
            }
          };

          function getModal()
          {
            $scope.getView($scope.report);

            return $modal(
              {
                template: 'views/reportTemplate.html',
                scope: $scope,
                animation: 'am-fade'
              }
            );
          }

          // open a report by using the modal plug-in , here you need to use inject function to inject
          // vriables into the Modal controller to prevent the issue that problems caused by Uglifying javascript
          $scope.openReport = function (report)
          {
            if(!_.isUndefined(reportUuid))
            {
              filterReport(report.clientUuid, report.creationTime);
            }

            trackGa('send', 'event', 'Report', 'User is viewing a report');

            $scope.report = report;
            $scope.report.editMode = false;

            modalInstance = getModal();
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

            trackGa('send', 'event', 'Report', 'User creates report');

            modalInstance = getModal();


          };

          $scope.editReport = function (report)
          {
            $scope.report = report;
            $scope.report.editMode = true;

            modalInstance = getModal();
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

            Report.remove(report.clientUuid, report.uuid)
              .then(
                function(result)
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
                }
            );
          };

          $scope.editImg = function ()
          {
            $scope.uploadURL = $scope.imgHost + $scope.ns + "/client/" + $scope.client.uuid + "/photo?square=true";
            $scope.setViewTo('editImg');
          };

          $scope.makeVideoCall = function(client, contact)
          {
            var typeData = {
              type: 'client',
              client: client
            };

            if(! _.isUndefined(contact))
            {
              typeData.contact = contact;
              typeData.type = 'contact';
            }

            Message.addByType(typeData);
          };
        }
    );
  }
);
