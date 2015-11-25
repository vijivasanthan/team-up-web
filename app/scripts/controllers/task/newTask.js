define(
  ['../controllers'],
  function (controllers) {
    'use strict';

    controllers.controller(
      'newTask',
      function ($rootScope,
                $location,
                $timeout,
                $filter,
                Store,
                TeamUp,
                Task,
                Team,
                Dater,
                moment,
                Clients,
                NewTask,
                data) {

        var self = this;
        //props
        self.currentTeamMembers = data.currentTeamMembers;
        self.clientGroups = data.clientGroups;
        self.teamClientgroupLinks = data.teamClientgroupLinks;
        self.currentGroupClients = data.currentGroupClients;

        //methods
        self.changeTeam = changeTeam;
        self.newDate = newDate;
        self.newTime = newTime;
        self.setDates = setDates;
        self.save = save;
        self.init = init;

        //initialisation
        self.init(data.currentTeamId);


        /**
         * get team and client related data after input
         * @param teamId
         */
        function changeTeam(teamId) {
          Team.read(teamId)
            .then(function (members) {
              self.currentTeamMembers = members;
              return Clients.getAllLocal();
            })
            .then(function (clientGroups) {
              data.clientGroups = clientGroups;
              return NewTask.teamClientLink(teamId, clientGroups);
            })
            .then(function (teamClientgroupLinks) {
              self.teamClientgroupLinks = teamClientgroupLinks;
              var clientGroupId = teamClientgroupLinks[0].id;
              return Clients.getSingle(clientGroupId);
            })
            .then(function (currentGroupClients) {
              self.currentGroupClients = currentGroupClients;
            });
        }

        function formatDateTime(date, dateFormat) {
          return $filter('date')(date, dateFormat);
        }

        function updateTime(date, minutes) {
          var roundMinutes = formatDateTime(date, 'm');
          roundMinutes = (roundMinutes % 15);

          return new Date(date.getTime() - (roundMinutes * 60000) + (minutes * 60000));
        }

        function updateMobileDateTime(newDate, minutes) {
          var start = moment(newDate),
            roundMinutes = (start.minute() % 15),
            newEndDateTime = moment(start).subtract(roundMinutes, "minutes").add(minutes, "minutes");

          return convertDateTimeToLocal(newEndDateTime);
        }

        function convertDateTimeToLocal(d) {
          var d1 = new Date(d);

          d1.setMinutes(d1.getMinutes() - d1.getTimezoneOffset());

          return d1.toISOString().replace("Z", "");
        }

        //set start and end date objects with default values
        function setDates() {
          var currentStartTime = updateTime(new Date(), 15);
          var currentEndTime = updateTime(new Date(), 30);
          var setDefaultDate = function (date) {
            return moment(date).format('DD-MM-YYYY');
          };

          self.form = {
            startDate: {
              date: setDefaultDate(new Date()),
              time: currentStartTime,
              datetime: updateMobileDateTime(moment().toDate(), 15)
            },
            endDate: {
              date: setDefaultDate(new Date()),
              time: currentEndTime,
              datetime: updateMobileDateTime(moment().toDate(), 30)
            }
          };
        }

        //update the time
        function newTime(newTime) {
          self.form.endDate.time = updateTime(newTime, 15);
        };

        //update the date
        function newDate(newDate, mobile) {
          if (mobile) {
            self.form.endDate.datetime = convertDateTimeToLocal(moment(newDate).add(15, "minutes"));
          }
          else {
            self.form.endDate.date = newDate;
          }

        }

        //validate the task properties, and store them in a object
        function save(form) {
          form.startTime = ($rootScope.browser.mobile) ?
            moment(form.startDate.datetime).utc().valueOf() :
            Dater.convert.absolute(formatDateTime(form.startDate.date, 'dd-MM-yyyy'), formatDateTime(form.startDate.time, 'HH:mm'), false);

          form.endTime = ($rootScope.browser.mobile) ?
            moment(form.endDate.datetime).utc().valueOf() :
            Dater.convert.absolute(formatDateTime(form.endDate.date, 'dd-MM-yyyy'), formatDateTime(form.endDate.time, 'HH:mm'), false);


          if (!form.team) {
            $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
            return;
          }
          //TODO
          if ($rootScope.app.domainPermission.clients) {
            if (!form.currentGroup) {
              $rootScope.notifier.error($rootScope.ui.teamup.selectClientGroup);
              return;
            }
            if (!form.currentClient) {
              $rootScope.notifier.error($rootScope.ui.task.specifyClient);
              return;
            }
          }

          var now = new Date().getTime();
          if (form.startDate.time <= now || form.endDate.time <= now) {
            $rootScope.notifier.error($rootScope.ui.task.planTaskInFuture);
            return false;
          }

          if (form.startDate.time >= form.endDate.time) {
            $rootScope.notifier.error($rootScope.ui.task.startLaterThanEnd);
            return false;
          }

          var taskValues = {
            status: 2,
            plannedStartVisitTime: form.startTime,
            plannedEndVisitTime: form.endTime,
            relatedClientUuid: form.currentClient,
            assignedTeamUuid: form.team,
            description: form.description,
            assignedTeamMemberUuid: form.member
          };
          console.log(taskValues);

          createTask(taskValues);
        }

        function createTask(task) {
          $rootScope.statusBar.display($rootScope.ui.task.creatingTask);
          TeamUp._('taskAdd', null, task);
          //redirect();
        }




        //function redirect(){
        //  if (result.error) {
        //    if (result.error.data) {
        //      $rootScope.notifier.error($rootScope.transError(result.error.data.result));
        //    }
        //    else {
        //      $rootScope.notifier.error($rootScope.transError(result.error));
        //    }
        //    $rootScope.statusBar.off();
        //  }
        //  else {
        //    if (task.assignedTeamMemberUuid == $rootScope.app.resources.uuid) {
        //      queryMine(
        //        true,
        //        function () {
        //          //setView('myTasks');
        //
        //          $rootScope.notifier.success($rootScope.ui.task.taskSaved);
        //        }
        //      );
        //    }
        //    else {
        //      queryAll(
        //        function () {
        //          //setView('allTasks');
        //
        //          $rootScope.notifier.success($rootScope.ui.task.taskSaved);
        //        }
        //      );
        //    }
        //    $rootScope.statusBar.off();
        //  }
        //}


        //initialise the team and dates
        function init(teamId) {
          Team.init(teamId);
          self.teams = Team.list;
          setDates();
        }
      });
  });