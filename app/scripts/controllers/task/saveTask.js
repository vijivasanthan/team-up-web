define(
  ['../controllers'],
  function (controllers) {
    'use strict';

    controllers.controller(
      'saveTask',
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
                TaskService,
                CurrentSelection,
                data) {

        var self = this;
        //props
        self.currentTeamMembers = data.currentTeamMembers;
        self.clientGroups = data.clientGroups;
        self.teamClientgroupLinks = data.teamClientgroupLinks;
        self.currentGroupClients = data.currentGroupClients;
        self.task = data.task;

        //methods
        self.setTeam = setTeam;
        self.changeTeam = changeTeam;
        self.newDate = newDate;
        self.newTime = newTime;
        self.setDates = setDates;
        self.save = save;
        self.init = init;
        //initialisation
        self.init(data.currentTeamId);

        console.log(self.task);


        function setTeam(teamId){
          Team.read(teamId)
        }

        /**
         * get team and client related data after input
         * @param teamId
         */
        function changeTeam(teamId) {
          Team.read(teamId)
            .then(function (members) {
              CurrentSelection.local = teamId;
              self.currentTeamMembers = members;
              return Clients.getAllLocal();
            })
            .then(function (clientGroups) {
              data.clientGroups = clientGroups;
              return TaskService.teamClientLink(teamId, clientGroups);
            })
            .then(function (teamClientgroupLinks)
            {
              self.teamClientgroupLinks = teamClientgroupLinks;
              self.form.currentGroup = teamClientgroupLinks[0].id;
              return Clients.getSingle(self.form.currentGroup);
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


          self.form.startDate = {
              date: setDefaultDate(new Date()),
              time: currentStartTime,
              datetime: updateMobileDateTime(moment().toDate(), 15)
          };
          self.form.endDate = {
              date: setDefaultDate(new Date()),
              time: currentEndTime,
              datetime: updateMobileDateTime(moment().toDate(), 30)
          };
        }

        //update the time
        function newTime(newTime) {
          self.form.endDate.time = updateTime(newTime, 15);
        }

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
          createTask(taskValues);
        }

        function createTask(task) {
          $rootScope.statusBar.display($rootScope.ui.task.creatingTask);
          TeamUp._('taskAdd', null, task)
            .then(function (result) {
              if(! result.error) {
                redirect(task.assignedTeamMemberUuid);
              }
            });
        }

        function redirect(assignedTeamMember){
          var location = (assignedTeamMember === $rootScope.app.resources.uuid)
            ? '/tasks2#myTasks'
            : '/tasks2#allTasks'
          $location.path(location);
        }

        /**
         * Mody a task and prepare the form with the right values
         * @param task
         */
        function modifyTask(task)
        {
          self.form.uuid = task.uuid;
          self.form.team = task.assignedTeamUuid;
          self.form.member = task.assignedTeamMemberUuid;
          self.form.currentClient = task.relatedClientUuid;
          self.form.startDate = {
              date: new Date(task.plannedStartVisitTime),
              time: task.plannedStartVisitTime,
              datetime: convertDateTimeToLocal(
                moment(task.plannedStartVisitTime)
              )
          };
          self.form.endDate = {
              date: new Date(task.plannedEndVisitTime),
              time: task.plannedEndVisitTime,
              datetime: convertDateTimeToLocal(
                moment(task.plannedEndVisitTime)
              )
          };
          self.form.description = task.description;
          console.log(self.form);
        }

        //initialise the team and dates
        function init(teamId) {
          Team.init(teamId);
          self.teams = Team.list;
          self.form = {};
          self.form.team = data.currentTeamId;
          if(data.teamClientgroupLinks && data.teamClientgroupLinks.length) {
            self.form.currentGroup = data.teamClientgroupLinks[0].id;
          }
          setDates();
          modifyTask(self.task);
          console.log(self.form.start);

        }
      });
  });