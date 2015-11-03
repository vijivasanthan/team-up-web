define(
  ['controllers/controllers', 'config'],
  function (controllers, config)
  {
    'use strict';

    controllers.controller(
      'clientCtrl',
        function ($rootScope, $scope, $location, Settings, Report, Clients, Teams, data, $route, $routeParams, Store, Dater,
                  $filter, $modal, TeamUp, $timeout, Reports, moment, CurrentSelection, Message)
        {
          $rootScope.fixStyles();
          $rootScope.resetPhoneNumberChecker();
          var modalInstance = null;
          dataHasClientId(data.clientId);

          // TODO: Check if it is use!
          $scope.imgHost = Settings.getBackEnd();
          $scope.ns = config.app.namespace;

          $scope.data = data;
          $scope.clients = data.clients;
          $scope.clientGroups = data.clientGroups;
          $scope.search = {query: ''};
          $scope.selection = {};

          setMonthsReportsFilter();

          /**
           * Get url params and open the right view
           */
          getURLParams();

          $scope.setViewTo = function (hash)
          {
            var view = $location.hash();

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

          $scope.requestClientGroup = function (current)
          {
            CurrentSelection.local = current;

            setCurrentClientGroup(current);

            // show reports of this groups
            if ($scope.views.reports)
            {
              //reset the filter
              $scope.currentCLient = '0';
              $scope.currentMonth = '0';

              loadGroupReports();
            }

            $scope.$watch(
              $location.search(),
              function ()
              {
                $location.search({uuid: current});
              }
            );
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
              .then(function (queries)
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

                  var clientGroup = _.findWhere($scope.clientGroups, {id: result.uuid});

                  if(! _.isUndefined(clientGroup))
                  {
                    $scope.clientGroup = clientGroup;

                    $scope.current = clientGroup.id;
                    CurrentSelection.local = $scope.current;

                    $location.url('/client?uuid=' + $scope.current).hash('client');
                  }
                }

                $rootScope.statusBar.off();
              });
          };

          $scope.cGroupSubmit = function (clientGroup)
          {
            if (typeof clientGroup == 'undefined' || $.trim(clientGroup.name) == '')
            {
              $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);

              return;
            }

            $rootScope.statusBar.display($rootScope.ui.teamup.saveClientGroup);

            Clients.addGroup(clientGroup)
              .then(function (result)
              {
                if (result.error)
                {
                  // FIXME: Message does not exist!
                  // $rootScope.notifier.error($rootScope.ui.teamup.cGroupSubmitError);
                }
                else
                {
                  Store('app').save(result.id, result);
                  reloadGroup({'uuid': result.id});
                }
              });
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

            var validationEmail = $scope.newClientForm.email;

            if (validationEmail && validationEmail.$error && validationEmail.$error.pattern) {
              $rootScope.notifier.error($rootScope.ui.validation.email.notValid);

              return;
            }

            if ( client.password == "" || client.password !== client.reTypePassword ) // if passwords are filled in and not identical
            {
              $rootScope.notifier.error($rootScope.ui.teamup.passNotSame);

              return;
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

            Clients.add(client)
              .then(function (result)
                {
                  if (result.error)
                  {
                    var errorMessage = $rootScope.ui.teamup.clientSubmitError;
                    console.error(client);

                    if(result.error.data.indexOf(client.email) >= 0) {
                      errorMessage = $rootScope.ui.teamup.clientSubmitEmailExists;
                    }
                    $rootScope.notifier.error(errorMessage);
                  }
                  else
                  {
                    Store('app').save(result.id, result);
                    $scope.contactForm = null;
                    $scope.newClientForm = null;
                    $rootScope.resetPhoneNumberChecker();
                    reloadGroup({'uuid': result.clientGroupUuid});
                  }
                });
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
              .then(function(result)
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
              });
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
          $scope.removeContact = function(contact)
          {
            // TODO: Contact has only been removed from list also from backend?!
            var indexContact = $scope.contacts.indexOf(contact);
            $scope.contacts.splice(indexContact, 1);
            angular.element('#confirmContactModal').modal('hide');
          };

          $scope.confirmationRemoveContact = function(contact)
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
                      console.log('clientGroups', clientGroups);
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

          /**
           * Remove client from group
           * @param clientId id of the client
           */
          $scope.deleteClient = function (clientId)
          {
            $scope._clientId = {};

            angular.element('#confirmClientModal').modal('hide');

            $rootScope.statusBar.display($rootScope.ui.teamup.deletingClientFromClientGroup);

            Clients.deleteFromGroup($scope.current, clientId)
              .then(function(data)
              {
                if(data)
                {
                  $scope.data = data;
                  $scope.clients = data.clients;
                  $scope.clientGroups = data.clientGroups;

                  $rootScope.notifier.success(
                    $rootScope.ui.teamup.deleteClientFromClientGroup
                  );
                  $rootScope.statusBar.off();
                }
                else
                {
                  console.log('client delete from clientgroup -> ', result);
                }
              });
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

          $scope.getReportView = function (report)
          {
            $scope.view = $scope.view || {};

            $scope.view.editReport = !!(report.editMode);
            $scope.view.viewReport = (!(report.editMode || typeof report.uuid == 'undefined'));
            $scope.view.newReport = (typeof report.uuid == 'undefined');
          };

          $scope.close = function ()
          {
            if (( $location.search() ).reportUuid)
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
            $scope.getReportView($scope.report);

            return $modal(
              {
                template: 'views/reportTemplate.html',
                scope: $scope,
                animation: 'am-fade-and-slide-top'
              }
            );
          }

          // open a report by using the modal plug-in , here you need to use inject function to inject
          // vriables into the Modal controller to prevent the issue that problems caused by Uglifying javascript
          $scope.openReport = function (report)
          {
            var params = $location.search();

            if(!_.isUndefined(params.reportUuid))
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
                      loadClientReports();
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


          function filterReport(clientId, createDate)
          {
            $scope.currentCLient = clientId;
            $scope.currentMonth = moment(createDate).format('M');
            $scope.requestReportsByFilter();
          }

          /**
           * Get the url params like clientgroup url and the hash (view)
           */
          function getURLParams()
          {
            var params = $location.search(),
              uuid = params.uuid,
              view = (data.clientGroups.length)
                ? ($location.hash() || 'client')
                : 'newClient';

            if (! uuid && !$location.hash())
            {
              uuid = $scope.data.currentClientGroupId;
              $location.search({uuid: uuid}).hash(view);
            }
            else
            {
              if(_.isUndefined( getCurrentClientGroup(uuid) ))
              {
                uuid = $scope.data.currentClientGroupId;
                $location.search({uuid: uuid});
              }
            }

            setView(view);
            $scope.current = $scope.data.currentClientGroupId;
            $scope.clients = data.clients[$scope.current];
            $scope.clientGroup = _.findWhere(data.clientGroups, {id: $scope.current});
          }

          /**
           * Check if clientgroup by clientGroupId will match
           * @param clientGroupId
           */
          function getCurrentClientGroup(clientGroupId)
          {
            return  Clients.getSingle(clientGroupId);
          }

          /**
           * Set the current clientgroup and load the reports
           * @param id
           */
          function setCurrentClientGroup(id)
          {
            $scope.current = id;
            getCurrentClientGroup(id)
              .then(function(clients)
              {
                $scope.clientGroup = _.findWhere(data.clientGroups, {id: id});
                data.clients[id] = clients;
                $scope.clients = data.clients[id];
              });
          }

          /**
           * Set current view by hash
           * @param hash one of the different views
           */
          function setView(hash)
          {
            var params = $location.search();

            $scope.views = {
              client: false,
              newClientGroup: false,
              newClient: false,
              reports: false,
              editImg: false
            };

            switch (hash)
            {
              case 'viewClient':
                loadClientReports();
                break;
              case 'reports':
                $scope.currentCLient = '0';
                $scope.currentMonth = '0';

                loadGroupReports();
                break;
              case 'newClient':
                $scope.clientForm = {
                  birthDate: (moment()).format("DD-MM-YYYY")
                };
                break;
            }

            $scope.views[hash] = true;
          }

          /**
           * Load reports list for client profile view
           */
          function loadClientReports()
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);

            Report.all($scope.client.uuid)
              .then(function(reports)
              {
                $rootScope.statusBar.off();

                $scope.reports = $scope.processReports(reports);
              });
          }

          /**
           * Get the list of reports for certain client group for reports tab
           */
          function loadGroupReports()
          {
            $rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);

            // get the groupId from the url
            if (!$scope.clientGroup)
            {
              $scope.clientGroup = data.clientGroups[0];
            }

            Report.allByClientGroup($scope.clientGroup.id)
              .then(function(reports)
              {
                $rootScope.statusBar.off();

                $scope.groupReports = $scope.processReports(reports);

                if ($scope.currentCLient != 0)
                {
                  $scope.requestReportsByFilter();
                }

                // open the report tab if the there is report Id in the params
                var params = $location.search();

                var reportId = params.reportUuid;

                if (reportId)
                {
                  var report = (_.findWhere($scope.groupReports, {uuid: reportId})) || null;

                  if (report == null)
                  {
                    // clear the url param
                    if (reportId)
                    {
                      $location.search('reportUuid', null);
                    }
                    $rootScope.notifier.error($rootScope.ui.teamup.reportNotExists);
                    return;
                  }
                  $scope.openReport(report);
                }
              });
          }

          /**
           * Check if current view is a client instead of a clientgroup
           */
          function dataHasClientId()
          {
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
          }

          /**
           * Set months of the reports filter
           */
          function setMonthsReportsFilter()
          {
            // process month drop-down list
            // TODO: Remove it later on!
            var months = Dater.getMonthTimeStamps();

            $scope.Months = [];

            angular.forEach(
              months,
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
          }
        }
    );
  }
);
