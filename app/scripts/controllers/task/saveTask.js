define(
  ['../controllers', 'config'],
  function (controllers, config)
  {
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
                moment,
                Clients,
                TaskCRUD,
                CurrentSelection,
                data)
      {
        //viewmodel
        var self = this;

        //properties
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

        function setTeam(teamId)
        {
          Team.read(teamId)
        }
        /**
         * get team and client related data after input
         * @param teamId
         */
        function changeTeam(teamId)
        {
          Team.read(teamId)
            .then(function (members)
            {
              CurrentSelection.local = teamId;
              self.currentTeamMembers = members;
              return Clients.getAllLocal();
            })
            .then(function (clientGroups)
            {
              data.clientGroups = clientGroups;
              return TaskCRUD.teamClientLink(teamId, clientGroups);
            })
            .then(function (teamClientgroupLinks)
            {
              self.teamClientgroupLinks = teamClientgroupLinks;
              if(!teamClientgroupLinks[0])
              {
                $rootScope.notifier.error($rootScope.ui.teamup.noClientGroupFound);
                return null;
              }
              else
              {
                self.form.currentGroup = teamClientgroupLinks[0].id;
                return Clients.getSingle(self.form.currentGroup);
              }
            })
            .then(function (currentGroupClients)
            {
              self.currentGroupClients = currentGroupClients;
            });
        }

        /**
         * format date and time using filter
         * @param date
         * @param dateFormat
         * @returns {*}
         */
        function formatDateTime(date, dateFormat)
        {
          return $filter('date')(date, dateFormat);
        }

        /**
         * set and update time values
         * @param date
         * @param minutes
         * @returns {Date}
         */
        function setTime(date, minutes)
        {
          var roundMinutes = formatDateTime(date, 'm');
          roundMinutes = (roundMinutes % 15);
          return new Date(date.getTime() - (roundMinutes * 60000) + (minutes * 60000));
        }

        function setDefaultDate(date)
        {
          return moment(date).format('DD-MM-YYYY');
        }

        /**
         * prepare start and end date objects with default values
         */
        function setDates()
        {
          var currentStartTime = setTime(new Date(), 15);
          var currentEndTime = setTime(new Date(), 30);

          self.form.startDate = {
            date: setDefaultDate(new Date()),
            time: currentStartTime,
            datetime: setMobileDatetime(new Date(), 15)
          };
          self.form.endDate = {
            date: setDefaultDate(new Date()),
            time: currentEndTime,
            datetime: setMobileDatetime(new Date(), 30)
          };
        }

        /**
         * validate the task properties and store them in a object
         * @param form
         * @returns {boolean}
         */
        function save(form)
        {
          form.startTime = ($rootScope.browser.mobile)
            ? moment(form.startDate.datetime).utc().valueOf()
            : +moment(
                  form.startDate.date +' '+ moment(form.startDate.time).format(config.app.formats.time),
                  config.app.formats.datetime
              );

          form.endTime = ($rootScope.browser.mobile) ?
            moment(form.endDate.datetime).utc().valueOf() :
            +moment(form.endDate.date +' '+ moment(form.endDate.time).format(config.app.formats.time),
                    config.app.formats.datetime);

          if (!form.team)
          {
            $rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
            return;
          }

          if ($rootScope.app.domainPermission.clients)
          {
            if (!form.currentGroup)
            {
              $rootScope.notifier.error($rootScope.ui.teamup.selectClientGroup);
              return;
            }
            if (!form.currentClient)
            {
              $rootScope.notifier.error($rootScope.ui.task.specifyClient);
              return;
            }
          }
          var now = new Date().getTime();
          if (form.startTime <= now || form.endTime <= now)
          {
            $rootScope.notifier.error($rootScope.ui.task.planTaskInFuture);
            return false;
          }

          if (form.startTime >= form.endTime)
          {
            $rootScope.notifier.error($rootScope.ui.task.startLaterThanEnd);
            return false;
          }

          var taskValues = {
            uuid: (form.uuid) ? form.uuid : '',
            status: 2,
            plannedStartVisitTime: form.startTime,
            plannedEndVisitTime: form.endTime,
            relatedClientUuid: form.currentClient,
            assignedTeamUuid: form.team,
            description: form.description,
            assignedTeamMemberUuid: form.member
          };

          (!_.isEmpty(form.uuid))
            ? edit(taskValues)
            : create(taskValues);
        }

        /**
         * fill the form object with values of an existing task
         * @param task uuid
         */
        function modifyExistingTask(task)
        {
          self.form = {
            uuid: task.uuid,
            team: task.assignedTeamUuid,
            member: task.assignedTeamMemberUuid,
            currentClient: task.relatedClientUuid,
            startDate: {
              date: setDefaultDate(new Date(task.plannedStartVisitTime)),
              time: new Date(task.plannedStartVisitTime),
              datetime: setMobileDatetime(task.plannedStartVisitTime)
            },
            endDate: {
              date: setDefaultDate(new Date(task.plannedEndVisitTime)),
              time: task.plannedEndVisitTime,
              datetime: setMobileDatetime(task.plannedEndVisitTime)
            },
            description: task.description
          };
        }

        /**
         * create a new task
         * @param task
         */
        function create(task)
        {
          $rootScope.statusBar.display($rootScope.ui.task.creatingTask);

          TaskCRUD.create(task)
            .then(function(result)
            {
              if (!result.error)
              {
                redirect(task.assignedTeamMemberUuid);
              }
            });
        }

        /**
         * do edit to an existing task
         * @param task
         */
        function edit(task)
        {
          $rootScope.statusBar.display($rootScope.ui.task.editingTask);

          TaskCRUD.update(task)
            .then(function (result)
            {
              if (!result.error)
              {
                redirect(task.assignedTeamMemberUuid);
              }
            });
        }

        /**
         * redirect to mytasks or alltasks after task save
         * @param assignedTeamMember
         */
        function redirect(assignedTeamMember)
        {
          var location = (assignedTeamMember === $rootScope.app.resources.uuid)
            ? '/task/mytasks'
            : '/task/alltasks';
          $location.path(location);
          $rootScope.notifier.success($rootScope.ui.task.taskSaved);
        }

        /**
         * set datetime values (for mobile devices)
         * @param datetime
         * @param minutes
         * @returns {*}
         */
        function setMobileDatetime(datetime, minutes)
        {
          var dateTime = moment(datetime);//TODO two times a moment object?
          var roundMinutes = (dateTime.minute() % 15);
          return moment(dateTime)//TODO two times a moment object?
                  .subtract(roundMinutes, "minutes")
                  .add(minutes, "minutes")
                  .toDate();
        }

        /**
         * update time
         * @param newTime
         */
        function newTime(newTime)
        {
          self.form.endDate.time = setTime(newTime, 15);
        }

        /**
         * update date or datetime
         * @param newDate
         * @param mobile
         */
        function newDate(newDate, mobile)
        {
          (mobile)
            ? self.form.endDate.datetime = moment(self.form.startDate.datetime)
                                              .add(15, "minutes")
                                              .toDate()
            : self.form.endDate.date = newDate;
        }

        /**
         * check if a task has to be edited. if not, initialise default team and date values
         * @param teamId
         */
        function init(teamId)
        {
          Team.init(teamId);
          self.teams = Team.list;

          //create tasks object
          if (data.task)
          {
            modifyExistingTask(self.task);
          }
          else
          {
            self.form = {};
            self.form.team = data.currentTeamId;
            setDates();
          }

          //Set the clientGroups who has a relation with the selected team
          if (data.teamClientgroupLinks && data.teamClientgroupLinks.length)
          {
            self.form.currentGroup = data.teamClientgroupLinks[0].id;
          }
        }
      });
  });