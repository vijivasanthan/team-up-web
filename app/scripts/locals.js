define(
  {
    ui: {
      en: {
        meta: {
          name: 'en',
          label: 'English'
        },
        login: {
          header: 'Login',
          placeholder_username: 'Fill in your username',
          placeholder_password: 'Fill in your password',
          label_rememberMe: 'Remember me ',
          button_login: 'Login',
          button_loggingIn: 'Login...',
          forgot_password: 'Forgot password?',
          forgetPassword: 'Forgot password',
          emailAddress: 'Email address',
          resetPassword: 'Reset password',
          returnLogin: 'Return to log in',
          changePassword: 'Change password',
          downloadApp: 'Download mobile app',
          ph_username: 'Username',
          ph_password: 'Password',
          ph_newPass: 'New password',
          ph_retypePass: 'Retype password',
          alert_fillfiled: 'Fill in all fields!',
          alert_wrongUserPass: 'Wrong username or password!',
          loading_User: 'Loading user information...',
          loading_Message: 'Loading messages...',
          loading_Group: 'Loading groups...',
          loading_Members: 'Loading team members...',
          loading_everything: 'Finished loading!',
          loggingOff: 'Logging off...',
          logout: 'Log out',
          loading: 'Loading..',
          loading_clientGroups: 'Loading client groups...',
          loading_clients: 'Loading clients',
          loading_teams: 'Loading teams...',
          loading_tasks: 'Loading tasks...'
        },
        video: {
          title: 'Video',
          videoNotLoaded: 'The entered phonenumber is not right. The phonenumber is not known by a team with videocalling.',
          stop: 'Video has stopped'
        },
        dashboard: {
          thisWeek: 'This week',
          welcome: 'Welcome',
          everyone: 'Everyone',
          newMessage: 'New message(s)',
          goToInbox: 'Go to inbox',
          loadingPie: 'Loading pie diagrams...',
          possiblyReachable: 'Possibly reachable ',
          noPlanning: 'No Planning',
          load: 'Loading...',
          time: {
            days: 'd',
            hours: 'h',
            minutes: 'm',
            seconds: 's'
          },
          announcements: 'Announcements',
          loadingP2000: 'Loading P2000...',
          noP2000: 'There are no P2000.',
          accessibilityStatement: 'Accessibility overview',
          loading: 'Loading...',
          accessible: 'Accessible'
        },
        agenda: {
          customDates: 'Custom dates',
          planboard: 'Agenda',
          currentAmountReachable: 'Current amount reachable ',
          amountOfPeopleWished: 'Amount of people wished',
          requiredPeople: 'Required people',
          newAvail: 'New availability',
          day: 'Day',
          week: 'Week',
          month: 'Month',
          updateAvail: 'Update availability',
          from: 'From',
          till: 'Till',
          state: 'State',
          selectAState: 'Select a state',
          reoccuring: 'Every week',
          lessPeople: 'There are $v people less than needed.',
          samePeople: 'There are as much people as needed.',
          morePeople: 'There are $v people more than needed.',
          noMembers: 'This team has no members',
          wished: 'Wished',
          combine_reoccuring: 'This is a combined planning row with consecutive rows.',
          sendMsgToMember: 'Send message to members',
          noMembers: 'There are no members in this team',
          noClients: 'There are no clients in this client group.',
          add: 'Add',
          del: 'Delete',
          change: 'Edit',
          setWish: 'Save wish',
          timeline: 'Timeline',
          statistics: 'Statistics',
          barCharts: 'Bar charts',
          wishes: 'Wishes',
          legenda: 'Legend',
          group: 'Group',
          groups: 'Groups',
          members: 'Members',
          teamMembers: 'Team members',
          bothAvailable: 'Both available',
          northAavailable: 'Available North',
          southAvailable: 'Available South',
          skipperOutService: 'Skipper out of service',
          notAvailable: 'Not available',
          notachieve: 'Not achieved',
          legendaLabels: {
            morePeople: 'more people',
            enoughPeople: 'exactly enough people',
            lessPeople: 'less people'
          },
          lastSyncTime: 'latest sync time:',
          dataRangeStart: 'Date range start: ',
          DataRangeEnd: 'Date range end: ',
          daterangerToday: 'Today',
          daterangerTomorrow: 'Tomorrow',
          daterangerLast7Days: 'Last 7 days',
          daterangerYesterday: 'Yesterday',
          daterangerNext3Days: 'Next 3 days',
          daterangerNext7Days: 'Next 7 days',
          loadingTimeline: 'Loading timeline...',
          rangeInfoTotalSelectedDays: 'Total amount of selected days: ',
          rangeInfoTime: 'Time: ',
          rangeInfoWeekNumber: 'Week number: ',
          rangeInfoMonth: 'Month: ',
          rangeInfoTotalDays: ', Total amount of days: ',
          addTimeSlot: 'Add time slot...',
          slotAdded: 'New time slot is successfully added',
          changingSlot: 'Edit time slot...',
          slotChanged: 'Time slot successfully changed.',
          changingWish: 'Wish is being changed...',
          wishChanged: 'The wish is successfully changed.',
          deletingTimeslot: 'Deleting time slot...',
          timeslotDeleted: 'Time slot is successfully deleted.',
          refreshTimeline: 'Refresh timeline...',
          preCompilingStortageMessage: 'Precompiling stortage message',
          weeklyPlanning: 'My weekly planning',
          weeklyPlanningOf: 'Weekly planning of ',
          planning: 'My planning',
          planningOf: 'Planning of ',
          minNumber: 'Minimum number needed',
          statDays: 'days',
          statHours: 'hours',
          statMinutes: 'minutes',
          statPeopleLess: 'Less people than expected',
          time: 'Time: ',
          weekNumber: 'Week number: ',
          monthNumber: 'Month number: ',
          totalDays: 'Total days: ',
          removeTasksRange: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Are you sure you want to delete the tasks of ' + options.range.start + ' till ' + options.range.end;
              html += ' from ' + options.group + ' ' + options.name;
              html += '?';
            }

            return html;
          },
          tasksDeleted: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Tasks of ' + options.range.start + ' t/m ' + options.range.end;
              html += ' from ' + options.group + ' ' + options.name;
              html += ' are removed.';
            }

            return html;
          },
          noTasksFounded: 'No tasks found in given range.',
          removeTasksTitle: 'Remove tasks',
          removeTasksTitle: 'Remove tasks',
          statPeopleEven: 'exactly enough people',
          statPeopleMore: 'More people than expected',
          getWishes: 'Get minimum needed value...',
          daterangerToday: 'Today',
          daterangerTomorrow: 'Tomorrow',
          daterangerYesterday: 'Yesterday',
          daterangerNext3Days: 'Next three days',
          daterangerNext7Days: 'Next seven days',
          rangeInfoTotalSelectedDays: 'Total selected days: ',
          rangeInfoTime: 'Time: ',
          rangeInfoWeekNumber: 'Week number: ',
          rangeInfoMonth: 'Month: ',
          rangeInfoTotalDays: ', Total number of days: ',
          query: 'There are problems synchronizing the agenda. Please refresh your browser the page.',
          pastAdding: 'It is not possible to plan in the past!',
          errorAdd: 'Error with adding a new planning!',
          errorChange: 'Error with changing planning!',
          pastChanging: 'Changing a planning in the past is not possible!',
          pastDeleting: 'Deleting a planning in the past is not possible!',
          remove: 'Error(s) with removing the planning!',
          wisher: 'Error(s) with changing the wish',
          editTimeline: 'Change the timeline of ',
          notAuth: 'You have to be a coordinator to change someone else\'s planning. As coordinator it is possible to change someone else his/her planning by clicking on their name in the list. You will be navigated to another page where you can change the planning of the selected team member.',
          the: 'The',
          reachabilityChangedSentence: 'reachability can be changed',
          byThe: 'by',
          doubleClick: 'double clicking on already existing blocks or ',
          byDragging: 'by dragging ',
          leftButtonMouse: 'with your mouse. With the left mouse button and the',
          or: 'or',
          buttonPushed: 'button pushed simultaneously.'
        },
        timeline: {
          removeReoccuring: "Remove",
          onlySingleReoccuringSlot: "Only this reachability",
          allReocurringSlots : "Every reoccuring reachability",
          removingSingleReoccuringSlot: "There is a slot with the state of non reachable added, on the same time as the reoccuring slot.",
          query: 'There has been some problems with syncing agenda information. Please refresh your browser for getting the latest agenda information.',
          pastAdding: 'It is not allowed to add a timeslot in the past!',
          swappedStartEnd: 'The end time is earlier than the start time. Did you swap the start and end time?',
          invalidTimeslot: 'Invalid timeslot. The format of the start/end date and/or time may be incorrect.',
          add: 'Error with adding a new timeslot!',
          change: 'Error with changing timeslot!',
          pastChanging: 'Changing timeslot in the past is not allowed!',
          pastDeleting: 'Removing a timeslot in the past is not allowed!',
          remove: 'Error with removing timeslot!',
          wisher: 'Error with changing minimum required staff value!',
          notAuth: 'It is not allowed to alter someone else\'s agenda unless you have a planning role. As a administrator/planner you can change the planning of others by clicking on their name from the list of users. You will be directed to another page for changing the planning of that user.'
        },
        required: {
          pastAdding: 'It is not allowed to add a minimum required staff value in the past!',
          pastDeleting: 'It is not allowed to remove a minimum required staff value in the past!',
          pastChanging: 'It is not allowed to change a minimum required staff value in the past!',
          add: 'Error with adding new minimum required staff value!',
          change: 'Error with changing minimum required staff value!',
          remove: 'Error with removing minimum required staff value!',
          emptyReq: 'Please fill in the minimum required staff value',
          invalidDate: 'The format of the start/end date and/or time may be incorrect.',
          swappedDate: 'The end time is earlier than the start time. Did you swap the start and end time?',
          invalidReq: 'Please fill in a valid value'
        },
        planboard: {
          planboard: 'Agenda',
          newAvail: 'New availability',
          day: 'Day',
          week: 'Week',
          month: 'Month',
          updateAvail: 'Update availability',
          noAffectedTeam: 'This clientgroup has no connected team or members',
          noAffectedClientGroup: 'This tean has no connected clientgroup or clients',
          from: 'From',
          till: 'Till',
          state: 'State',
          customDates: 'Custom dates',
          selectAState: 'select a state',
          reoccuring: 'Reoccurring',
          lessPeople: 'There are $v people less than needed.',
          samePeople: 'There are as much people as needed.',
          morePeople: 'There are $v people more than needed.',
          wished: 'Wished',
          combine_reoccuring: 'This is a combined planning.',
          sendMsgToMember: 'Send message to members',
          noMembers: 'There are no members in this team',
          noClients: 'There are no clients in this client group.',
          add: 'Add',
          del: 'Delete',
          change: 'Change',
          setWish: 'Set wish',
          timeline: 'Timeline',
          statistics: 'Statistics',
          barCharts: 'Bar charts',
          wishes: 'Wishes',
          legenda: 'Legend',
          group: 'Group',
          groups: 'Groups',
          members: 'Members',
          teamMembers: 'Team members',
          bothAvailable: 'Both available',
          northAavailable: 'Available North',
          southAvailable: 'Available South',
          skipperOutService: 'Skipper out of service',
          notAvailable: 'Not available',
          notachieve: 'Not achieved',
          legendaLabels: {
            morePeople: 'more people',
            enoughPeople: 'exactly enough people',
            lessPeople: 'less people'
          },
          lastSyncTime: 'latest sync time:',
          dataRangeStart: 'Date range start: ',
          DataRangeEnd: 'Date range end: ',
          daterangerToday: 'Today',
          daterangerTomorrow: 'Tomorrow',
          daterangerLast7Days: 'Last 7 days',
          daterangerYesterday: 'Yesterday',
          daterangerNext3Days: 'Next 3 days',
          daterangerNext7Days: 'Next 7 days',
          loadingTimeline: 'Loading timeline...',
          rangeInfoTotalSelectedDays: 'Total amount of selected days: ',
          rangeInfoTime: 'Time: ',
          rangeInfoWeekNumber: 'Week number: ',
          rangeInfoMonth: 'Month: ',
          rangeInfoTotalDays: ', Total amount of days: ',
          addTimeSlot: 'Add time slot...',
          slotAdded: 'Time slot successfully added.',
          changingSlot: 'Edit time slot...',
          slotChanged: 'Time slot successfully changed.',
          changingWish: 'Edit wish...',
          wishChanged: 'Wish successfully changed.',
          deletingTimeslot: 'Delete time slot...',
          timeslotDeleted: 'Time slot successfully deleted.',
          refreshTimeline: 'Refresh timeline...',
          preCompilingStortageMessage: 'Precompiling stortage message',

          myWeeklyPlanning: 'My weekly planning',
          weeklyPlanning: 'Weekly planning',
          weeklyPlanningOf: 'Weekly planning of ',
          myPlanning: 'My planning',
          planning: 'Planning',
          planningOf: 'Planning of ',

          minNumber: 'Min needed people',
          time: 'Time: ',
          weekNumber: 'Week number: ',
          monthNumber: 'Month number: ',
          totalDays: 'Total days: ',
          removeTasksRange: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Are you sure you want to delete the tasks of ' + options.range.start + ' till ' + options.range.end;
              html += ' from ' + options.group + ' ' + options.name;
              html += '?';
            }

            return html;
          },
          tasksDeleted: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Tasks of ' + options.range.start + ' t/m ' + options.range.end;
              html += ' from ' + options.group + ' ' + options.name;
              html += ' are removed.';
            }

            return html;
          },
          noTasksFounded: 'No tasks found in given range.',
          removeTasksTitle: 'Remove tasks'
        },
        message: {
          title: 'CHAT',
          messagesLoaded: 'Loading messages...',
          videoStartedBy: 'Video message started by ',
          messages: 'Messages',
          composeAMessage: 'Compose a message',
          compose: 'Compose',
          inbox: 'Inbox',
          outbox: 'Outbox',
          trash: 'Trash',
          composeMessage: 'Compose message',
          close: 'Close',
          broadcast: 'Broadcast',
          sms: 'SMS',
          email: 'Email',
          receviers: 'receiver(s)',
          webTRCWebLink: 'A video conference has been opened, participate! ',
          // troubled
          // chooseRecept: 'Ontvanger(s) selecteren',
          //
          subject: 'Subject',
          message: 'Message',
          sendMessage: 'Send Message',
          sender: 'Sender',
          date: 'Date',
          questionText: 'Message',
          reply: 'Reply',
          del: 'Delete',
          noMessage: 'There are no messages',
          from: 'From',
          newMsg: 'New',
          deleteSelected: 'Delete selected messages',
          someMessage: 'There are $v messages',
          emptyTrash: 'Empty trash ',
          noMsgInTrash: 'There are no messages',
          box: 'Box',
          persons: 'Persons',
          restoreSelected: 'Restore selected messages',
          loadingMessage: 'Loading message...',
          escalation: 'Escalation message',
          reportMessage: 'New report from',
          escalationBody: function (diff, startDate, startTime, endDate, endTime)
          {
            return 'There is a shortage of ' +
              diff +
              ' people between ' +
              startDate + ' ' +
              startTime + ' and ' +
              endDate + ' ' +
              endTime + '. ' +
              'Please change your state to reachable when you are available for that period';
          },
          removed: 'Message successfully deleted',
          removing: 'Removing message...',
          refreshing: 'Refreshing message...',
          removingSelected: 'Removing selected messages...',
          restoring: 'Restoring message...',
          restored: 'Message successfully restored',
          restoringSelected: 'Restoring selected messages...',
          emptying: 'Emptying trash...',
          emptied: 'Trash successfully emptied',
          sending: 'Sending message...',
          sent: 'Message sent',
          typeSubject: 'Fill in a subject',
          // messages: 'Berichten',
          ph_filterMessage: 'Filtering message...',
          noReceivers: 'Select a receiver ',
          emptyMessageBody: 'The message is empty, please type a message',
          send: 'send'
        },
        groups: {
          amountMembers: function (amountMembers)
          {
            return (amountMembers == 1)
              ? "There is " + amountMembers + " member."
              : "There are " + amountMembers + " members.";
          },
          changeMemberShip: 'Change membership',
          doYou: 'Do you ',
          memberOfATeam: ' like to be part of a team ',
          personPartOfTeams: 'This person will be part of the following teams ',
          replace: 'Replace',
          personPartOfTeam: 'This person will only be part of team ',
          groups: 'Groups',
          newGroup: 'New group',
          newMember: 'New team member',
          searchMember: 'Search team member',
          serach: 'Search',
          addNewGroup: 'Add new group',
          deleteTeamError: 'There appears to be a problem while deleting the team',
          editGroup: 'Edit group',
          searchResults: 'Search results',
          group: 'Group',
          close: 'Close',
          name: 'Name',
          saveGroup: 'Save group',
          registerMember: 'Register member',
          role: 'Role',
          selectRole: 'Select a role',
          // troubled
          // selectGroup: 'Selecteer een group',
          //
          email: 'Email',
          phone: 'Telephone',
          address: 'Address',
          postCode: 'Zip code',
          tel: 'Phone number',
          city: 'City',
          userName: 'Username',
          password: 'Password',
          saveMember: 'Save member',
          serachFor: 'Search results for ',
          sorryCanNotFind: 'Sorry, no results',
          addToGroup: 'Add to group',
          addMemberToGroup: 'Add selected members to group',
          resultCount: 'There are $v results.',
          deleteGroup: 'Delete group',
          noMembers: 'There are no members',
          removeSelectedMembers: 'Remove selected members',
          memberCount: 'There are $v members',
          searchingMembers: 'Searching for team members ...',
          addingNewMember: 'Adding new member...',
          memberAdded: 'Member successfully added to group',
          refreshingGroupMember: 'Refreshing groups- and memberlist...',
          removingMember: 'Removing member from group...',
          memberRemoved: 'member successfully removed from team',
          removingSelected: 'Removing selected members...',
          saving: 'Saving group...',
          groupSaved: 'Group successfully saved',
          registerNew: 'register new member...',
          memberRegstered: 'Member successfully registered .',
          deleting: 'Deleting group...',
          deleted: 'Group successfully deleted',
          filterMembers: 'Filter team members...',
          searchfor: 'name, surname..'
        },
        profile: {
          noTeamSelected: 'No team selected',
          extra: 'Extra ',
          default: 'Default',
          back: 'Back',
          profile: 'Profile',
          edit: 'Edit',
          password: 'Password',
          timeline: 'Timeline',
          profileView: 'Profile view',
          userGroups: 'User groups',
          role: 'Role',
          email: 'Email',
          phone: 'Telephone',
          address: 'Address',
          postcode: 'Zip code',
          city: 'City',
          editProfile: 'Edit profile',
          name: 'Name',
          saveProfile: 'Save profile',
          passChange: 'Change password',
          currentPass: 'Current password',
          newPass: 'New password',
          newPassRepeat: 'Repeat new password',
          changePass: 'Change password',
          newAvail: 'New availability',
          userName: 'Username',
          pincode: 'team member code',
          // saveProfile: 'Profielinformatie opslaan...',
          refreshing: 'Refreshing profile information...',
          dataChanged: 'Profile data successfully changed',
          savingPassword: 'Saving new password...',
          passwordChanged: 'The password is successfully changed',
          passwordSavedFailed: 'Something went wrong by updating the password',
          pleaseFill: 'Please fill in all fields with valid information!',
          passNotMatch: 'The passwords do not match',
          changingPass: 'Changing password...',
          passChanged: 'Password successfully changed',
          passwrong: 'Wrong password! Try again',
          currentPassWrong: 'The entered old password does not match the current! Try again',
          newTimeslotAdded: 'New time slot successfully added',
          changingTimeslot: 'Changing time slot...',
          timeslotChanged: 'Time slot successfully changed',
          exampleBirthDate: 'Example birthdate: 01-01-2001',
          firstName: 'First name',
          lastName: 'Last name',
          editProfileImg: 'Edit profile picture',
          profileImgSuccessfullyUploaded: 'The profile picture is successfully uploaded',
          loadUploadURL: 'Load photo upload URL',
          click2upload: 'Click here to upload',
          birthday: 'Birthday',
          username: 'Username',
          retypePassword: 'Repeat password',
          roleChangePrompt: 'You changed your own role, system will automatically logout, press “Yes” to continue.',//'You changed your own role, system will automatically logout, press "Yes" to continue.',
          specifyTeam: 'You need to specify a team to this user.',//'You need to sepcify a team to this user'
          authorInfo: 'Loading author information...',
          changePassWord: 'Change password',
          safePassword: 'Save password',
          oldPassword: 'Old password',
          changePass: 'Wachtwoord wijzigen',
          forgotPassword: 'Wachtwoord vergeten',
          forgotPassInfo: 'We will send you a email with the instructions to reset your password',
          forgotPassInfoSend: 'If the user exists and has an email address, an email is sent to the user with further instructions to change the password',
          keyUsernameWrong: 'The combination of the given key and username is wrong',
          pincode: 'pin code',
          pincodeInUse: 'This pin code is in use. Please choose another one',
          pincodeNotValid: 'Please enter a valid pin code! (At least 4 digits, maximum 8 digits)',
          pincodeCorrect: 'This pin code is either in use or not valid. Please enter a valid pin code',
          pincodeInfo: 'The pin code above is used for TeamUp/TeamTelephone Call-in and is only requested when you are calling with a telephone number unknown by the system',
          duplicateNumber: 'This phone number is already in use by another user. Please enter an another phone number',
          pincodeInfoPhone: 'The last 4 digits of this phone number will be used as pin code, unless the pin code is manually entered'
        },
        settings: {
          settings: 'Settings',
          user: 'User',
          application: 'Application',
          userSettings: 'User settings',
          appSettings: 'Application settings',
          saveSettings: 'Save settings',
          langSetting: 'Language',
          saving: 'Saving settings...',
          refreshing: 'Refreshing settings...',
          saved: 'Settings successfully saved'
        },
        help: {
          header: 'Help & support',
          support: 'Support',
          teamTelephone: {
            setReachabilityPhone: 'How do I set my reachability by phone?',
            setReachabilityWeb: 'How do I set my reachability in the web application?',
            changeReachabilityTeamMember: 'How do I change the reachability of a team member?',
            changeCallOrderTeam: 'How do I change the call order of my team?',
            changeCallOptions: 'How do I change the call option of my team?'
          },
          teams: {
            addNewMember: 'How do I add a new member to my team?',
            addExistingMember: 'How do I add an existing member to my team?',
            removeMember: 'How do I remove a member from my team?'
          },
          web: {
            title: 'Web application',
            newMember: 'How do I create a new client?'
          },
          manuelTeamTelephone: {
            title: 'TeamTelephone manual',
            download: 'Download manual',
          },
          android: {
            title: 'Android',
            addClientReport: 'How do I add a client report?',
            callClient: 'How can I call a client?',
          }
        },
        downloads: {
          app: 'Soon able to be downloaded',
          manual: 'Download manual'
        },
        loading: {
          general: 'Loading',
          manage: 'Manage',
          dashboard: 'dashboard',
          planboard: 'agenda',
          messages: 'messages',
          teams: 'teams',
          profile: 'profile',
          settings: 'settings'
        },
        teamup: {
          noBackends: 'Logging in is temporarily unavailable',
          finished: 'Finished',
          missed: 'Missed',
          teamMembers: 'Team members',
          unknownAddress: 'Address unknown',
          'and': 'and',
          somethingUpdated: function(errors) {
            return (errors.length > 1) ? ' are not updated' : ' is not updated';
          },
          amountReports: function (amountReports)
          {
            return (amountReports == 1)
              ? "There is " + amountReports + " report."
              : "There are " + amountReports + " reports.";
          },
          amountContacts: function(amountContacts)
          {
            return (amountContacts == 1)
              ? "There is " + amountContacts + " contact person."
              : "There are " + amountContacts + " contact persons.";
          },
          removingTeamWithTasks: "There are tasks with the state of planning for the team, remove them first!",
          minimumOneMember: "Atleast one member must be added",
          newNumberOf: "is the new number of ",
          newTeamTelefoonTeam: "New TeamTelephone team",
          syncSucces: 'The teaminfo is syncing.',
          syncError: "The teaminfo couldn't sync",
          notFound: 'Not found',
          clientGroup: 'Client group',
          extraInfo: 'Extra info',
          client: 'Client',
          coordinator: 'Coordinator',
          teamMember: 'Team member',
          teamMembers: 'Team members',
          apply: 'Apply',
          help: "Help",
          'new': 'New',
          'existing': 'Existing',
          teams: 'Teams',
          selectTeams: 'Select team(s)',
          selectTeam: 'Select a team',
          teamNameExistTitle: 'Team name already exist',
          teamNameExistContent: 'Are you sure to add a team which name already exist?',
          seconds: 'seconds',
          hour: 'hour',
          clients: 'Clients',
          title404: 'Oops',
          header404: "Sorry, The page could not found",
          content404: 'It looks like the page does not exist (anymore) or is moved',
          order: 'Order',
          logs: 'Logs',
          options: 'Options',
          selectClientGroup: 'Select a client group',
          loadMembersByName: 'Loading members...',
          loadingMembers: 'searching members...',
          howToSearchMembers: 'Search members by name',
          selectClientGroup: 'Select a client group',
          manage: 'Manage',
          teamTelephone: 'TeamTelephone',
          chooseTeam: 'Select a team',
          undefinedTeamMember: 'Undefined team member',
          defaultTeam: 'Default team',
          edit: 'Edit',
          editTeam: 'Edit team',
          team: 'Team',
          del: 'Delete',
          noMembers: 'No members in this team',
          newTeam: 'New team',
          teamName: 'Team name',
          createTeam: 'Create team',
          newMember: 'New team member',
          searchMember: 'Search team member',
          noMembersFound: 'No members found with the given search criteria',
          name: 'Name',
          role: 'Role',
          phone: 'Telephone',
          street: 'Street',
          postCode: 'Zip code',
          city: 'City',
          email: 'E-mail',
          saveMember: 'Save',
          state: 'State',
          states: 'States',
          saveTeam: 'Save team',
          save: 'Save',
          backEndUnavailable: "The back-end is temporarily unavailable, try to login again. If the problem continues to occur, contact your system administrator.",
          noBackend: function(email)
          {
            var text = "Het is niet gelukt om verbinding te maken met de server.<br />"
            text += "Als u problemen blijft ervaren, kunt u een  <a href='mailto:" + email;
            text += "?subject=Melding van een probleem met TeamUp / TeamTelefoon";
            text += "&body=Beste%20support%2C%0A%0AHelaas%20ervaar%20ik%20problemen%20met%20TeamTelefoon.";
            text += "%20Ik%20krijg%20de%20melding%20%u201CHet%20is%20niet%20gelukt%20om%20verbinding";
            text += "%20te%20maken%20met%20de%20server.%u201D%0A%0AKunt%20u%20mij%20hiermee%20helpen";
            text += "%3F%0A%0AMet%20vriendelijke%20groet%2C%0A%0A%5Buw%20naam";
            text += "%5D%0A%5Buw%20team%5D%0A%5Buw%20organisatie%5D%20";
            text += "'>email</a> sturen naar onze support afdeling."

            return text;
          },
          statusCodeNotRegonized: "Status-code not regonized",
          refreshing: 'Refreshing team information',
          dataChanged: 'Data is changed',
          teamSubmitError: 'Error while creating: ',
          queryTeamError: 'Error while searching the teams',
          teamNamePrompt1: 'Fill in a team name',
          teamNamePrompt2: 'Please add contact data',
          cancel: 'Cancel',
          chooseRole: 'Choose a role',
          func: 'Function',
          chooseFunction: 'Choose function',
          newClientGroup: 'New client group',
          newClient: 'New client',
          reports: 'Reports',
          report: 'Report',
          noClients: 'No clients in this group',
          noClientGroup: 'No client group',
          noClientGroupFound: 'No client group found for this team',
          TeamClients: 'TEAMS - CLIENTS',
          createClientGroup: 'Save',
          contacts: 'Contacts',
          Number: 'Number',
          clientProfileUrl: 'URL Client profile',
          addContact: 'Add contact person',
          editContact: 'Edit contact person',
          saveClient: 'Save',
          group: 'Group',
          errorSaveClientGroup: 'Saving changes client group failed',
          noContacts: 'There are no contact persons defined',
          noReports: 'There are no reports for this client',
          contactCount: 'There are $v contact persons',
          reportCount: 'There are $v reports',
          accountInfoFill: 'Please fill in your account information',
          passNotSame: 'passwords are not the same',
          savingMember: 'Saving member...',
          selectTeams: 'Select team(s)',
          selectTeam: 'Select a team',
          clinetInfoFill: 'Please fill in client information (name, telephone)',
          savingClient: 'Saving client...',
          clientSubmitError: 'Error creating new client',
          clientGroups: 'Client groups',
          saveClientGroup: 'Saving client group...',
          deleteClientFromClientGroup: 'Client is deleted',
          deletingClientFromClientGroup: 'Deleting client form client group...',
          teams_Cap: 'Teams',
          noTeamNameFound: 'Team name unknown',
          noTeam: 'No team',
          searchMembers: 'Search members...',
          editClient: 'Edit client',
          loadingNumber: 'Loading team telephone number...',
          loadClients: 'Loading clients...',
          birthdayError: 'Error in birthday.',
          map: 'map',
          saveContacts: 'Save contact persons',
          loadingReports: 'Loading reports',
          reportEmpty: 'Fill in a valid title and description!',
          reportValid: 'The fields are not valid!',
          reportBody: 'Description',
          reportBodyRequired: 'Fill in a description!',
          reportTitleRequired: 'Fill in a title!',
          reportBodyMinChars: 'The description should contain at least 8 characters!',
          reportTitleMinChars: 'The title should contain at least 4 characters!',
          reportBodyMaxChars: 'The description should contain not more than 150 characters!',
          reportTitleMaxChars: 'The title should contain not more than 30 characters!',
          checkLocalStorage: 'In this browser the private mode is enabled. This is not supported. Here you can find information about how to turn off the private mode:',
          readMore: 'Read more',
          date: 'Data',
          datetime: 'Data and time',
          writenBy: 'Written by',
          noSharedStates: 'No shared states',
          savingContacts: 'Saving contacts',
          // delClientGroupConfirm: 'Weet u zeker dat u deze cliëntengroep wilt verwijderen? Het kan even duren.',
          // delTeamConfirm: 'Weet u zeker dat u dit team wilt verwijderen? Het kan even duren.',
          deletingClientGroup: 'Deleting client group... ',
          from: 'From',
          to: 'Till',
          time: 'Time',
          duration: 'Duration',
          coordinatorNoTeam: 'It looks like you are not in a team. Assign yourself to a team',
          teamMemberNoTeam: 'It looks like you are not in a team. Contact a coordinator',
          //deleteConfirm: 'Druk op OK om door te gaan.',
          confirms: {
            deleteClientTitle: 'Delete client',
            deleteClient: 'Are u sure that you would like to delete the client?',
            deleteClientFromTeamTitle: 'Delete client from team',
            deleteClientFromTeam: 'Are you sure you want to delete the client from the team?',
            deleteReportTitle: 'Delete report',
            deleteReport: 'Are you sure you want to delete the report?',
            deleteProfileTitle: 'delete profile',
            deleteProfile: 'Are you sure you want to delete the profile?',
            deleteMemberFromTeamTitle: 'Delete the member form all teams',
            deleteMemberFromTeam: 'Are you sure you want to delete the member from all teams? Watch out: Someone who is not in a team, is not able to use the system. ',
            deleteMemberTitle: 'Delete team member',
            deleteMember: 'Are you sure you want to delete the team member?',
            deleteClientGroupTitle: 'Delete client group',
            deleteClientGroup: 'Are you sure you want to delete this client group? It can take a couple of seconds',
            deleteTeamTitle: 'Delete team',
            deleteTeam: 'Are you sure you want to delete this team? It can take a couple of seconds',
            deleteTaskTitle: 'Delete task',
            deleteTask: 'Are you sure you want to delete the task?',
            deleteContactTitle: 'Delete contact',
            deleteContact: 'Are you sure you want to delete the contact?',
            remove: 'Delete',
            addTeamMemberCodeAsPhoneTitle: 'Edit pin code',
            addTeamMemberCodeAsPhone: 'The entered pin code does not match with the last four digits of your telephone number ,',
            photoRemoveTitle: 'Remove profile photo',
            photoRemoveBody: 'Are you sure you want to remove the profile photo?',
            yes: 'Yes',
            no: 'No, cancel',
            cancel: 'Cancel',
            day: {
              sunday: 'Sunday',
              monday: 'Monday',
              tuesday: 'Tuesday',
              wednesday: 'Wednesday',
              thursday: 'Thursday',
              friday: 'Friday',
              saturday: 'Saterday'
            },
            shortDay: {
              su: "Su",
              mo: "Mo",
              tu: "Tu",
              we: "We",
              th: "Th",
              fr: "Fr",
              sa: "Sa"
            }
          },
          deletingTeam: 'Deleting team...',
          deletingMember: 'Deleting member ...',
          deletingClient: 'Deleting client ...',
          noMessages: 'There are no messages',
          newReport: 'New report',
          editReport: 'Edit report',
          selectClient: 'Select a client',
          selectMember: 'Select a member',
          selectMonth: 'Select a month',
          saveReport: 'Save report',
          reportTitle: 'Title',
          selectSlot: 'Select a slot',
          editClientImg: 'Edit client profile photo',
          newTask: 'New task',
          updateTask: 'Edit task',
          managePanelchangePrompt: 'Data is changed. Click on \'OK\' to continue, \'Cancel\' to stay.',
          pagePrevious: 'Previous',
          pageNext: 'Next',
          pageFirst: 'First',
          pageLast: 'Last',
          refresh: 'Refresh',
          stateValue: {
            'reachable': 'Reachable',
            'available': 'Available',
            'working': 'Working',
            'offline': 'Offline',
            'on_the_phone': 'On the phone',
            'unknown': 'Unknown',
            'secondline': 'Second line',
            'possibly_reachable': 'Possibly reachable',
            'unreachable': 'Unreachable',
            'unavailable': 'Unavailable',
            'unknown': 'Offline'
          },
          reportNotExists: 'Report does not exist',
          sessionTimeout: 'Your session has ended. Please login again',
          error: {
            support: 'Contact the support team of TeamUp / TeamTelephone'
          },
          errorCode: {
            '1': "A error has been appeared. The requested data couldn't be loaded. ",
            '2': 'The domain agent could not be found. Please try to login again',
            '3': 'This member should have the coordinator role, before a new team is created',
            '4': 'An agent ID can only exist of alphanumeric characters, underscores and dashes',
            '5': 'Can not parse the JSON body',
            '6': 'One or more parameters are missing',
            '7': 'The group "members" is not found',
            '8': 'Team with the given teamUuid does not exist',
            '9': 'This member is not a part of the team',
            '10': 'Team with the given teamUuid does not exist',
            '11': 'This member should have the coordinator role, before a new team is created',
            '12': 'The team agent could not be created',
            '13': 'The uuid parameter and the uuid in the payload do not match',
            '14': 'This username is already in use',
            '15': 'One of the sent values is unknown',
            '16': 'One of the next settings value is zero, this is not possible',
            '17': 'One of the sent values has an unknown type',
            '18': 'The user with the given ID does not exist',
            '19': 'The given old password does not match with the present one',
            '20': 'This member should have the coordinator role before the password of another member can be changed',
            '21': 'A parameter can not be parsed',
            '22': 'This member is not in a team',
            '23': 'No valid body, some attributes are missing',
            '24': 'Something is not configured properly, Ask-Fast can not be reached',
            '25': 'The phone number is already in use',
            '26': 'One of the conditions to activate TeamTelephone was unsuccessful',
            '27': 'The scenario could not be created for this team',
            '28': 'Ask-Fast error',
            '29': 'A voicemail group could not be created',
            '30': 'A setting in the TeamTelephone configuration is not writable',
            '31': 'TeamTelephone is already activated for this team',
            '32': 'Agent not found',
            '33': 'No templates found in the ScenarioTemplateAgent',
            '34': 'Could not generate scenario',
            '36': 'A unexpected parameter of type',
            '39': 'The key to reset the password is expired'
          }
        },
        upload: {
          chooseFile: 'Choose file',
          processFile: 'Process file',
          choiceWeek: 'Choose week',
          processSheet: 'Process sheet',
          checkRoutes: 'Check routes',
          dragSpreadSheet: 'Drag a spreadsheet (XLSX, XLSM or XLSB) to this point',
          checkRoutes: 'Checking routes',
          continue: 'Continue',
          checkNames: 'Checking names',
          passed: 'passed',
          failed: 'failed',
          busy: 'busy',
          open: 'open',
          uploadSpreadSheet: 'upload spreadsheet...',
          nobody: 'Nobody',
          createTasks: 'Create tasks',
          followingTasksNotUploaded: "The next tasks couldn't be uploaded",
          morning: "morning",
          noon: "noon",
          evening: "evening",
          afternoon: "afternoon",
          night: "night",
          importedFromASpreadSheet: 'Imported from spreadsheet',
          expectationTime: function (cellName)
          {
            return "There is a yes/no value found in cell " + cellName + ", while there is a point in time expected.";
          },
          expectationClientName: function (cellName)
          {
            return "There is a yes/no value found in cell " + cellName + ", while there was a client name expected.";
          },
          expectationMinutes: function (cellName)
          {
            return "There is a yes/no value found in cell " + cellName + ", while there are a amount of minutes expected";
          },
          foundIntNeedString: "There is a error found in ",
          readError: function (cellName)
          {
            return "It's not possible to read a timestamp in cell " + cellName + ".";
          },
          nofUnassignedRoutes: function (nofUnassignedRoutes)
          {
            return "There are " + nofUnassignedRoutes + " routes where a team member is assigned to.";
          },
          unknownError: "A unknown error is occurred: ",
          errors: 'Errors'
        },
        options: {
          title: 'Options ',
          teamEmail: 'Team email',
          pickAPhoneNumber: 'Pick a phone number',
          phoneNumberAlias: 'Phone number alias',
          noPhoneNumbers: 'There are no phone numbers left',
          activateTeamTelephone: "Activate team phone for the ",
          teamTelephoneNotActivated: "TeamTelephone is not activated for this team",
          smsMissedCall: 'SMS by a missed call or a new voicemail',
          receiveReachableMembers: 'Reachable team members receive',
          missedOrVoicemail: 'SMS when the team has a missed call or a voicemail has been recorded',
          phoneNumberTeam: "Telephone number for the team",
          phoneNumberTeamDescription: "Choose a phone number for the team. The team will be reachable via this phone number.",
          phoneNumberTeamAlias: "Known public telephone number",
          phoneNumberTeamAliasDescription: "This field is optional. The telephone number can be filled in what is known to the clients. For example, the 06 number of the current relay phone.",
          voicemailEmailAddress: "Voicemail email address",
          voicemailEmailAddressDescription: "A email will be sent to this email address if a voicemail is left or the team has a missed call.",
          requiredFields: "required fields",
          hasSms: function (sms)
          {
            return (sms)
              ? 'one'
              : 'none';
          },
          on: 'On',
          off: 'Off',
          useExternalId: {
            title: 'Telefoonnummer van de beller',
            info: 'Als deze optie is ingeschakeld en u wordt gebeld via TeamTelefoon, dan ziet u in het scherm van uw telefoon het telefoonnummer van de beller. Als deze instelling is uitgeschakeld, dan ziet u in het scherm het telefoonnummer van het team.'
          },
          ringingTimeOut: {
            title: 'Ringing timeout',
            short: 'When the ringing timeout is long the team members will have more time to pick up their phone, but the total waiting time for clients can be longer when many team members are reachable.',
            long: 'When the ringing timeout is 15 seconds or more, it is recommended for team members to disable their personal voice mail.',
          },
          personalVoicemailPrevention: 'Personal voice mail prevention',
          personalVoicemailPreventionInfo: 'When this option is enabled, team members will first get the question of they want to take a call when a client calls in. By enabling this option it can be prevented that a client is connected with a members personal voice mail.',
          voicemailDetectionInfo: 'When the ringing timeout is 15 seconds or more, it is recommended for team members to disable their personal voice mail, or to use the personal voice mail prevention. Enabling / disabling the personal voice mail can be done via the phone provider.'
        },
        task: {
          timeframe: 'Time frame',
          status: 'Status',
          description: 'Description',
          createdBy: 'Created by',
          name: 'Name',
          hasToload: ' are loading..',
          showArchivedTasks: 'Show archived tasks',
          showOnlyNotAssignedTasks: 'Show only the not assigned tasks',
          member: 'Member',
          thereAreAmountTasks: function (amountTasks)
          {
            return (amountTasks == 1)
              ? "There is " + amountTasks + " task."
              : "There are " + amountTasks + " tasks.";
          },
          carer: 'Carer',
          information: 'Information',
          noTasks: 'No active or planned tasks',
          clientName: 'Client',
          memberName: 'Member',
          orderType1: 'Standard order',
          orderType2: 'Time',
          tasks: 'Tasks',
          myTask: 'My tasks',
          newTask: 'New tasks',
          orderby: 'Order by',
          allTasks: 'All tasks',
          description: 'Description',
          filltheTime: 'Fill in start and end time in for the task.',
          startTimeEmpty: 'Fill in the start date and start time.',
          endTimeEmpty: 'Fill in the end date and end time.',
          planTaskInFuture: 'You can not plan a task in the past. Select a start time and end time in the future.',
          startLaterThanEnd: 'Start time must be before end time.',
          specifyClient: 'Select a client for this task.',
          creatingTask: 'Creating task',
          editingTask: 'Editing task',
          taskSaved: 'Task is saved.',
          noArchivedTask: 'No finished tasks found.',
          deleteTaskConfirm: 'Are you sure you want to delete this task?',
          taskDeleted: 'Task deleted.',
          planningTime: 'Time needed',
          refreshTask: 'Refreshing tasks',
          upload: 'Upload tasks',
          deleteTasksConfirm: 'Are you sure you want to delete these tasks?',
          taskDescriptionMinChars: 'The description should contain at least 8 characters.',
          taskDescriptionMaxChars: 'The description should not contain more than 500 characters.',
          taskFormValide: 'The new task is not valid! Check the remarks.'
        },
        order: {
          randomOrder: 'Random',
          fixedOrder: 'Fixed order',
          confirmation: 'Confirm choice',
          evenOrder: 'Evenly',
          loadTeam: 'Load team...',
          orderSaved: 'Order saved',
          noMembers: 'This team has no members.',
          evenOrderFeedback: "With this option, the caller is transferred to the team member that least recently called to.",
          randomFeedback: 'With this option, a caller is always connected to any team member.',
          fixedOrderFeedback: 'With this option, the team can determine the calling sequence.'
        },
        logs: {
          loadLogs: 'Loading logs..',
          empty: 'There are no logs',
          filter: 'Filter logs...',
          to: 'To',
          amountLogs: function (amount)
          {
            if (amount == 1)
            {
              return 'There is ' + amount + ' log shown';
            }
            else
            {
              return 'There are ' + amount + ' logs shown.';
            }
          },
          status: {
            sent: 'Sent',
            received: 'Inbox',
            finished: 'Finished',
            missed: 'Missed',
            delivered: 'Received',
            error: 'Error'
          }
        },
        validation: {
          default: {
            required: function (fieldName)
            {
              return 'A ' + fieldName.toLowerCase() + ' is required';
            },
            minLength: function (fieldName)
            {
              return 'The ' + fieldName.toLowerCase() + ' has not enough characters';
            },
            maxLength: function (fieldName)
            {
              return 'De ' + fieldName.toLowerCase() + ' has to many characters';
            },
            regularPunctuation: "Only regular punctuation is allowed, like -_,!@#$%^&*()"
          },
          phone: {
            notValid: 'Fill in a valid phone number!',
            invalidCountry: 'Invalid country code! Only Dutch (+31) numbers allowed.',
            tooShort: ' (Phone number incorect: not enough digits.)',
            tooLong: ' (Phone number incorrect: too many digits.)',
            notValidOnSubmit: 'Please fill in at least one valid phone number to save.',
            message: 'Entered phone number is correct. Number is registered in ',
            as: ' as ',
            multipleNotvalid: 'One or multiple phone numbers are not valid!',
            fixedLine: 'Fixed line',
            mobile: 'Mobile number',
            mobileOrFixedLine: 'Fixed or mobile number'
          },
          pincode: {
            exists: 'Please choose a different pin code. The chosen pin code is already in use.'
          },
          password: {
            amountMinChars: function (chars)
            {
              return ' and should contain at least ' + chars + ' characters'
            },
            amountMaxChars: function (chars)
            {
              return ' and can contain a maximum of ' + chars + ' characters'
            },
            oldPassMatch: 'The entered old password does not match the current password.',
            required: 'A password is required',
            identical: 'The passwords must be identical'
          },
          email: {
            notValid: 'Enter a valid password!',
            required: 'An email is required'
          },
          role: 'Choose a role!',
          birthDate: {
            notValid: 'Enter a valid birthday!'
          },
          userName: {
            regex: 'and may only contain alphanumeric characters, including scores and underscores',
            valid: 'A username is required',
            email: "A username is allowed ",
            amountMinChars: function (number)
            {
              return ' and must have a minimum of ' + number + ' characters'
            }
          },
          search: {
            notValid: 'Fill in a name and/or surname!'
          },
          wish : {
            integer: 'Give a number in the range of 0 to 30 '
          },
          upload: {
            fileTypeNotAloud: "The type of file you have uploaded is not allowed, Pick one of the following types: 'png', 'jpeg', 'jpg', 'gif', 'bpg' or 'tiff'"
          }
        }
      },
      de: {
        meta: {
          name: 'de',
          label: 'Deutch'
        },
        login: {
          header: 'Anmelden',
          placeholder_username: 'Anwendernamen eingeben',
          placeholder_password: 'Passwort eingeben',
          label_rememberMe: 'Passwort speichern',
          button_login: 'Anmelden',
          button_loggingIn: 'Anmelden...',
          forgot_password: 'Passwort vergessen?',
          forgetPassword: 'Passwort vergessen',
          emailAddress: 'Email-Adresse',
          resetPassword: 'Passwort erneut eingeben',
          returnLogin: 'Zurück zum Login',
          changePassword: 'Passwort ändern',
          downloadApp: 'App downloaden',
          ph_username: 'Anwendername',
          ph_password: 'Passwort',
          ph_newPass: 'Passwort ändern',
          ph_retypePass: 'Passwort wiederholen',
          alert_fillfiled: 'Nicht alle Felder sind ausgefüllt',
          alert_wrongUserPass: 'Anwendername oder Passwort nicht korrekt!',
          loading_User: 'Anwenderinformationen laden...',
          loading_Message: 'Nachrichten laden...',
          loading_Group: 'Gruppen laden...',
          loading_Members: 'Team-Mitglieder laden...',
          loading_everything: 'Alles geladen!',
          loggingOff: 'Abmelden',
          logout: 'Abmelden',
          loading: 'Laden..',
          loading_clientGroups: 'Patientengruppen laden...',
          loading_clients: 'Patienten laden',
          loading_teams: 'Teams laden...',
          loading_tasks: 'Aufgaben laden...'
        },
        video: {
          title: 'Video',
          videoNotLoaded: 'The entered phonenumber is not right. The phonenumber is not known by a team with videocalling.',
          stop: 'Videokonferenz wurde beendet.'
        },
        dashboard: {
          thisWeek: 'Diese Woche',
          welcome: 'Willkommen',
          everyone: 'Alle',
          newMessage: 'Neue Nachrichten',
          goToInbox: 'Zum Posteingang',
          loadingPie: 'Kreisdiagramm laden...',
          possiblyReachable: 'Nicht geplant',
          noPlanning: 'Keine Planung',
          load: 'laden...',
          time: {
            days: 'T',
            hours: 'S',
            minutes: 'M',
            seconds: 'S'
          },
          accessibilityStatement: 'Übersicht Verfügbarkeit',
          loading: 'laden...',
          accessible: 'Verfügbarkeit'
        },
        agenda: {
          requiredPeople: 'Bedarf',
          customDates: 'definierter Zeitraum',
          planboard: 'Agenda',
          currentAmountReachable: 'aktuell verfügbar (ist)',
          amountOfPeopleWished: 'gewünscht (soll)',
          newAvail: 'neue Verfügbarkeit',
          noAffectedTeam: 'This clientgroup has no connected team or members',
          noAffectedClientGroup: 'This tean has no connected clientgroup or clients',
          query: 'Synchronisierung des Terminkalenders fehlgeschlagen. Bitte den Browser aktualisieren (F5).',
          day: 'Tag',
          week: 'Woche',
          month: 'Monat',
          updateAvail: 'Verfügbarkeit aktualisieren',
          from: 'ab',
          till: 'bis',
          state: 'Status',
          selectAState: 'Status wählen',
          reoccuring: 'jede woche',
          lessPeople: 'Es fehlen $v Personen.',
          samePeople: 'Es sind ausreichend Personen vorhanden.',
          morePeople: 'Es sind $v Personen zu viel.',
          wished: 'Bedarf',
          combine_reoccuring: 'Es betrifft eine kombinierte Planung mit mehreren Reihen ?????? ',
          sendMsgToMember: 'Nachricht an Gruppe senden',
          add: 'hinzufügen',
          del: 'löschen',
          change: 'ändern',
          setWish: 'Bedarf speichern',
          timeline: 'Zeitachse',
          statistics: 'Statistiken',
          barCharts: 'Stabdiagramm',
          wishes: 'Bedarf',
          legenda: 'Legende',
          group: 'Team',
          groups: 'Team',
          members: 'Mitglieder',
          teamMembers: 'Team-Mitglieder',
          bothAvailable: 'beide verfügbar',
          northAavailable: 'verfügbar Nord',
          southAvailable: 'verfügbar Süd',
          skipperOutService: 'Skipper oder Service',
          notAvailable: 'nicht verfügbar', // nicht verfügbar
          notachieve: 'nicht gespeichert',
          legendaLabels: {
            morePeople: 'mehr als notwendig',
            enoughPeople: 'exakt',
            lessPeople: 'zu wenig'
          },
          lastSyncTime: 'Letzte Synchronisierung:',
          dataRangeStart: 'Anfang Daten-Skala: ',
          DataRangeEnd: 'Ende Daten-Skala: ',
          daterangerToday: 'heute',
          daterangerTomorrow: 'morgen',
          daterangerLast7Days: 'Letzte 7 Tage',
          daterangerYesterday: 'gestern',
          daterangerNext3Days: 'nächste 3 Tage',
          daterangerNext7Days: 'nächste 7 Tage',
          loadingTimeline: 'Zeitspanne laden...',
          rangeInfoTotalSelectedDays: 'Zeitraum (Tage): ',
          rangeInfoTime: 'Zeit: ',
          rangeInfoWeekNumber: 'Woche: ',
          rangeInfoMonth: 'Monat: ',
          rangeInfoTotalDays: ', Anzahl Tage: ',
          addTimeSlot: 'Planung hinzufügen...',
          slotAdded: 'Planung erfolgreich hinzugefügt.',
          changingSlot: 'Planung ändern...',
          slotChanged: 'Planung erfolgreich geändert.',
          changingWish: 'Bedarf ändern...',
          wishChanged: 'Bedarf erfolgreich geändert.',
          deletingTimeslot: 'Planung löschen...',
          timeslotDeleted: 'Planung erfolgreich gelöscht.',
          refreshTimeline: 'Zeitachse aktualisieren...',
          preCompilingStortageMessage: 'Bedarfsbericht erstellen',
          weeklyPlanning: 'meine wöchentliche Planung',
          weeklyPlanningOf: 'wöchentliche Planung von ',
          planning: 'meine Planung',
          planningOf: 'Planung von ',
          minNumber: 'Minimum Anzahl benötigt ',
          time: 'Zeit: ',
          weekNumber: 'Woche: ',
          monthNumber: 'Monat: ',
          totalDays: 'Anzahl Tage: ',
          removeTasksRange: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Sind Sie sicher, dass Sie die Aufgaben von ' + options.range.start + ' bis' + options.range.end;
              html += ' von  ' + options.group + ' ' + options.name;
              html += ' löschen möchten?';
            }

            return html;
          },
          tasksDeleted: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Die Aufgaben von ' + options.range.start + ' bis' + options.range.end;
              html += ' bis ' + options.group + ' ' + options.name;
              html += ' wurden gelöscht.';
            }

            return html;
          },
          noTasksFounded: 'in diesem Zeitraum gibt es keine Aufgaben ',
          removeTasksTitle: 'Aufgaben löschen',
          pastAdding: 'eine Planung in der Vergangenheit ist nicht möglich!',
          errorAdd: 'neue Planung kann nicht gespeichert werden!',
          errorChange: 'Fehler beim Ändern der Planung!',
          pastChanging: 'eine Planung in der Vergangenheit kann nicht geändert werden!',
          pastDeleting: 'eine Planung in der Vergangenheit kann nicht gelöscht werden!',
          remove: 'Fehler beim Löschen einer Planung!',
          wisher: 'Fehler beim Ändern des Bedarfes',
          editTimeline: 'Zeitspanne ändern  von ',
          notAuth: 'Nur, wenn Sie Koordinator sind, können Sie die Planung von anderen Personen ändern. Dazu wählen Sie die gewünschte Person aus der Liste. Es erscheint daraufhin eine neue Seite, auf der Sie die Planung anpassen können.',
          reachabilityChangedSentence: 'Die Planung Ihrer Verfügbarkeit kann geändert werden',
          byThe: 'durch',
          doubleClick: 'Doppelklick auf eine bereits',
          byDragging: 'vorhandene Planung oder durch Markierung der Planung ',
          leftButtonMouse: 'mit der Maus und anschließender Verschiebung',
          or: 'bei ',
          buttonPushed: 'gedrückter linker Maustaste.'
        },
        timeline: {
          removeReoccuring: "Remove",
          onlySingleReoccuringSlot: "Only this reachability",
          allReocurringSlots : "Every reoccuring reachability",
          removingSingleReoccuringSlot: "There is a slot with the state of non reachable added, on the same time as the reoccuring slot.",
          query: 'There has been some problems with syncing agenda information. Please refresh your browser for getting the latest agenda information.',
          pastAdding: 'It is not allowed to add a timeslot in the past!',
          swappedStartEnd: 'The end time is earlier than the start time. Did you swap the start and end time?',
          invalidTimeslot: 'Invalid timeslot. The format of the start/end date and/or time may be incorrect.',
          add: 'Error with adding a new timeslot!',
          change: 'Error with changing timeslot!',
          pastChanging: 'Changing timeslot in the past is not allowed!',
          pastDeleting: 'Removing a timeslot in the past is not allowed!',
          remove: 'Error with removing timeslot!',
          wisher: 'Error with changing minimum required staff value!',
          notAuth: 'It is not allowed to alter someone else\'s agenda unless you have a planning role. As a administrator/planner you can change the planning of others by clicking on their name from the list of users. You will be directed to another page for changing the planning of that user.'
        },
        required: {
          pastAdding: 'It is not allowed to add a minimum required staff value in the past!',
          pastDeleting: 'It is not allowed to remove a minimum required staff value in the past!',
          pastChanging: 'It is not allowed to change a minimum required staff value in the past!',
          add: 'Error with adding new minimum required staff value!',
          change: 'Error with changing minimum required staff value!',
          remove: 'Error with removing minimum required staff value!',
          emptyReq: 'Please fill in the minimum required staff value',
          invalidDate: 'The format of the start/end date and/or time may be incorrect.',
          swappedDate: 'The end time is earlier than the start time. Did you swap the start and end time?',
          invalidReq: 'Please fill in a valid value'
        },
        planboard: {
          requiredPeople: 'Bedarf',
          customDates: 'definierter Zeitraum',
          planboard: 'Agenda',
          currentAmountReachable: 'aktuell verfügbar (ist)',
          amountOfPeopleWished: 'gewünscht (soll)',
          newAvail: 'neue Verfügbarkeit',
          query: 'Synchronisierung des Terminkalenders fehlgeschlagen. Bitte den Browser aktualisieren (F5).',
          day: 'Tag',
          week: 'Woche',
          month: 'Monat',
          updateAvail: 'Verfügbarkeit aktualisieren',
          from: 'ab',
          till: 'bis',
          state: 'Status',
          selectAState: 'Status wählen',
          reoccuring: 'jede woche',
          lessPeople: 'Es fehlen $v Personen.',
          samePeople: 'Es sind ausreichend Personen vorhanden.',
          morePeople: 'Es sind $v Personen zu viel.',
          wished: 'Bedarf',
          combine_reoccuring: 'Es betrifft eine kombinierte Planung mit mehreren Reihen ?????? ',
          sendMsgToMember: 'Nachricht an Gruppe senden',
          add: 'hinzufügen',
          del: 'löschen',
          change: 'ändern',
          setWish: 'Bedarf speichern',
          timeline: 'Zeitachse',
          statistics: 'Statistiken',
          barCharts: 'Stabdiagramm',
          wishes: 'Bedarf',
          legenda: 'Legende',
          group: 'Team',
          groups: 'Team',
          members: 'Mitglieder',
          teamMembers: 'Team-Mitglieder',
          bothAvailable: 'beide verfügbar',
          northAavailable: 'verfügbar Nord',
          southAvailable: 'verfügbar Süd',
          skipperOutService: 'Skipper oder Service',
          notAvailable: 'nicht verfügbar', // nicht verfügbar
          notachieve: 'nicht gespeichert',
          legendaLabels: {
            morePeople: 'mehr als notwendig',
            enoughPeople: 'exakt',
            lessPeople: 'zu wenig'
          },
          lastSyncTime: 'Letzte Synchronisierung:',
          dataRangeStart: 'Anfang Daten-Skala: ',
          DataRangeEnd: 'Ende Daten-Skala: ',
          daterangerToday: 'heute',
          daterangerTomorrow: 'morgen',
          daterangerLast7Days: 'Letzte 7 Tage',
          daterangerYesterday: 'gestern',
          daterangerNext3Days: 'nächste 3 Tage',
          daterangerNext7Days: 'nächste 7 Tage',
          loadingTimeline: 'Zeitspanne laden...',
          rangeInfoTotalSelectedDays: 'Zeitraum (Tage): ',
          rangeInfoTime: 'Zeit: ',
          rangeInfoWeekNumber: 'Woche: ',
          rangeInfoMonth: 'Monat: ',
          rangeInfoTotalDays: ', Anzahl Tage: ',
          addTimeSlot: 'Planung hinzufügen...',
          slotAdded: 'Planung erfolgreich hinzugefügt.',
          changingSlot: 'Planung ändern...',
          slotChanged: 'Planung erfolgreich geändert.',
          changingWish: 'Bedarf ändern...',
          wishChanged: 'Bedarf erfolgreich geändert.',
          deletingTimeslot: 'Planung löschen...',
          timeslotDeleted: 'Planung erfolgreich gelöscht.',
          refreshTimeline: 'Zeitachse aktualisieren...',
          preCompilingStortageMessage: 'Bedarfsbericht erstellen',

          myWeeklyPlanning: 'My weekly planning',
          weeklyPlanning: 'Weekly planning',
          weeklyPlanningOf: 'Weekly planning of ',
          myPlanning: 'My planning',
          planning: 'Planning',
          planningOf: 'Planning of ',

          minNumber: 'Minimum Anzahl benötigt ',
          time: 'Zeit: ',
          weekNumber: 'Woche: ',
          monthNumber: 'Monat: ',
          totalDays: 'Anzahl Tage: ',
          removeTasksRange: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Sind Sie sicher, dass Sie die Aufgaben von ' + options.range.start + ' bis' + options.range.end;
              html += ' von  ' + options.group + ' ' + options.name;
              html += ' löschen möchten?';
            }

            return html;
          },
          tasksDeleted: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Die Aufgaben von ' + options.range.start + ' bis' + options.range.end;
              html += ' bis ' + options.group + ' ' + options.name;
              html += ' wurden gelöscht.';
            }

            return html;
          },
          noTasksFounded: 'in diesem Zeitraum gibt es keine Aufgaben ',
          removeTasksTitle: 'Aufgaben löschen',
          pastAdding: 'eine Planung in der Vergangenheit ist nicht möglich!',
          errorAdd: 'neue Planung kann nicht gespeichert werden!',
          errorChange: 'Fehler beim Ändern der Planung!',
          pastChanging: 'eine Planung in der Vergangenheit kann nicht geändert werden!',
          pastDeleting: 'eine Planung in der Vergangenheit kann nicht gelöscht werden!',
          remove: 'Fehler beim Löschen einer Planung!',
          wisher: 'Fehler beim Ändern des Bedarfes',
          editTimeline: 'Zeitspanne ändern  von ',
          notAuth: 'Nur, wenn Sie Koordinator sind, können Sie die Planung von anderen Personen ändern. Dazu wählen Sie die gewünschte Person aus der Liste. Es erscheint daraufhin eine neue Seite, auf der Sie die Planung anpassen können.',
          reachabilityChangedSentence: 'Die Planung Ihrer Verfügbarkeit kann geändert werden',
          byThe: 'durch',
          doubleClick: 'Doppelklick auf eine bereits',
          byDragging: 'vorhandene Planung oder durch Markierung der Planung ',
          leftButtonMouse: 'mit der Maus und anschließender Verschiebung',
          or: 'bei ',
          buttonPushed: 'gedrückter linker Maustaste.'
        },
        options: {
          title: 'Einstellungen ',
          teamEmail: 'E-Mail an das Team',
          activateTeamTelephone: "Aktiviere TeamTelefon für ",

          teamTelephoneNotActivated: "TeamTelefon aktiviert",
          phoneNumberTeamAlias: "bekannte Telefonnummer",
          phoneNumberTeam: "Telefonnummer für das Team",
          phoneNumberTeamDescription: "Wählen Sie eine der folgenden Telefonnummern, über die das Team erreichbar sein soll.",
          phoneNumberTeamAlias: "bekannte Telefonnummer",
          phoneNumberTeamAliasDescription: "Feld ist freiwillig. Sofern bekannt, kann die Telefonnummer des Klienten eingetragen werden, bspw. die 06 Nummer des Teamtelefons.",
          voicemailEmailAddress: "Sprachbox Email-Adresse",
          voicemailEmailAddressDescription: "Bei einer Sprachnachricht wird oder einem verpassten Anruf wird eine Email an die Adresse gesendet.",
          requiredFields: "obligatorische Felder",

          smsMissedCall: 'SMS bei verpasstem Anruf oder neuer Sprachnachricht',
          receiveReachableMembers: 'verfügbare Gruppen-Mitglieder empfangen',
          missedOrVoicemail: 'SMS, falls das Team ein Anruf verpasst hat oder bei Eingang einer neuen Sprachnachricht',
          noPhoneNumbers: "Keine Telefonnummern vorhanden",
          pickAPhoneNumber: "Wählen Sie eine Telefonnummer",
          durationDialTone: 'Geben Sie die Dauer der Freizeichen an!',
          dialToneNumber: "Das Freizeichen kann nur eine Zahl sein",
          hasSms: function (sms)
          {
            return (sms)
              ? 'ein'
              : 'kein';
          },
          on: 'an',
          off: 'aus',
          ringingTimeOut: {
            title: 'Anruf-Dauer',
            short: 'bei einer längeren Anruf-Dauer haben die Gruppen-Mitglieder mehr Zeit, ans Telefon zu gehen, die Wartezeit für den Patienten kann dadurch jedoch länger werden.',
            long: 'Bei einer Anruf-Dauer von mehr als 15 Sekunden wird empfohlen, dass die Gruppen-Mitglieder Ihre Voice-Mail abschalten.',
          },
          useExternalId: {
            title: 'Telefoonnummer van de beller weergeven',
            info: 'Als deze optie is ingeschakeld en u wordt gebeld via TeamTelefoon, dan ziet u in het scherm van uw telefoon het telefoonnummer van de beller. Als deze instelling is uitgeschakeld, dan ziet u in het scherm het telefoonnummer van het team.'
          },
          personalVoicemailPrevention: 'persönliche Voicemail Präferenz',
          personalVoicemailPreventionInfo: 'Gruppenmitglieder werden zuerst gefragt, ob Sie das Gespräch entgegen nehmen möchten. Wenn diese Option eingeschaltet ist, vermeidet man, dass ein Patient eine Nachricht auf einer Voice-Mailbox eines Mitglieds hinterlassen kann.',
          voicemailDetectionInfo: 'bei einer Anruf-Dauer von mehr als 15 Sekunden wird empfohlen, dass alle Mitglieder ihre Voice-Mailbox abschalten oder die persönliche Voicemail Präferenz einschalten. Bei Ihrem Provider erfahren Sie, wie Sie die Voice-Mailbox abschalten können.'
        },
        message: {
          title: 'CHAT',
          messagesLoaded: 'Nachrichten laden...',
          videoStartedBy: 'Videokonferenz gestartet von ',
          messages: 'Nachrichten',
          composeAMessage: 'Nachricht erstellen',
          compose: 'erstellen',
          inbox: 'empfangen',
          outbox: 'gesendet',
          trash: 'gelöscht',
          composeMessage: 'Nachricht erstellen',
          close: 'beenden',
          broadcast: 'Extra Medium',
          sms: 'SMS',
          email: 'Email',
          receviers: 'Empfänger',
          webTRCWebLink: 'Eine Video Konferenz wurde gestartet, teilnehmen? ',
          subject: 'Subjekt',
          message: 'Nachricht',
          sendMessage: 'Nachricht versenden',
          sender: 'Absender',
          date: 'Datum',
          questionText: 'Nachricht',
          reply: 'beantworten',
          del: 'löschen',
          noMessage: 'keine Nachrichten.',
          from: 'von',
          newMsg: 'neu',
          deleteSelected: 'markierte Nachrichten löschen',
          someMessage: 'Es gibt $v Nachrichten',
          emptyTrash: 'gelöschte Nachrichten endgültig löschen',
          noMsgInTrash: 'keine gelöschten Nachrichten.',
          box: 'Box',
          persons: 'Personen',
          restoreSelected: 'markierte Nachrichten wiederherstellen',
          loadingMessage: 'Nachricht laden...',
          escalation: 'Eskalations-Nachricht',
          reportMessage: 'neue Nachricht',
          escalationBody: function (diff, startDate, startTime, endDate, endTime)
          {
            return 'Es fehlen ' +
              diff +
              ' Personen zwischen ' +
              startDate + ' ' +
              startTime + ' und ' +
              endDate + ' ' +
              endTime + '. ' +
              'Bitte stellen Sie sich, falls möglich, für diesen Zeitraum verfügbar';
          },
          removed: 'Nachricht wurde gelöscht.',
          removing: 'Nachricht löschen...',
          refreshing: 'Nachricht aktualisieren...',
          removingSelected: 'markierte Nachrichten löschen...',
          restoring: 'Nachricht wiederherstellen...',
          restored: 'Nachricht erfolgreich wiederhergestellt.',
          restoringSelected: 'markierte Nachrichten wiederherstellen...',
          emptying: 'Nachrichten endgültig löschen...',
          emptied: 'Nachrichten endgültig gelöscht.',
          sending: 'Nachricht versenden...',
          sent: 'Nachricht versenden.',
          typeSubject: 'Subjekt eintragen.',
          ph_filterMessage: 'Nachrichten filtern...',
          noReceivers: 'Empfänger festlegen',
          emptyMessageBody: 'bitte Text zu dieser Nachricht eintragen.',
          send: 'versenden'
        },
        groups: {
          amountMembers: function (amountMembers)
          {
            return (amountMembers == 1)
              ? "There is " + amountMembers + " member."
              : "There are " + amountMembers + " members.";
          },
          changeMemberShip: 'Mitgliedschaft ändern',
          doYou: 'Möchten Sie ',
          memberOfATeam: ' in das Team ',
          personPartOfTeams: 'Diese Person wird folgenden Teams zugeordnet ',
          replace: 'Ersetzen',
          personPartOfTeam: 'Diese Person wird nur Teil des Teams ',
          groups: 'Gruppen',
          newGroup: 'neue Gruppe',
          newMember: 'neues Team-Mitglied',
          deleteTeamError: 'There appears to be a problem while deleting the team',
          search: 'Suchen',
          addNewGroup: 'neue Gruppe hinzufügen',
          editGroup: 'Gruppe ändern',
          searchResults: 'Suchergebnisse',
          group: 'Gruppe',
          close: 'beenden',
          name: 'Name',
          saveGroup: 'Gruppe speichern',
          registerMember: 'Mitglied hinzufügen',
          role: 'Funktion',
          selectRole: 'Funktion hinzufügen',
          email: 'Email',
          phone: 'Telefon',
          address: 'Adresse',
          postCode: 'Postleitzahl',
          tel: 'Telefonnummer',
          city: 'Wohnort',
          userName: 'Anwendername',
          password: 'Passwort',
          saveMember: 'Mitglied speichern',
          serachFor: 'Suchergebnis für: ',
          sorryCanNotFind: 'Leider kein Ergebnis.',
          addToGroup: 'der Gruppe hinzufügen',
          addMemberToGroup: 'ausgewählte(n) Teilnehmer der Gruppe hinzufügen',
          resultCount: 'Es gibt $v Ergebnisse.',
          deleteGroup: 'Gruppe löschen',
          noMembers: 'keine Mitglieder in dieser Gruppe.',
          removeSelectedMembers: 'ausgewählte Mitglieder löschen',
          memberCount: 'Es gibt $v Mitglieder.',
          searchingMembers: 'Mitglieder suchen...',
          addingNewMember: 'neues Mitglied hinzufügen...',
          memberAdded: 'Mitglied erfolgreich dieser Gruppe hinzugefügt.',
          refreshingGroupMember: 'Gruppen- und Mitgliederliste aktualisieren...',
          removingMember: 'Mitglied aus dieser Gruppe löschen...',
          memberRemoved: 'Mitglied erfolgreich aus dieser Gruppe gelöscht.',
          removingSelected: 'ausgewählte Mitglieder löschen...',
          saving: 'Gruppe speichern...',
          groupSaved: 'Gruppe erfolgreich gespeichert.',
          registerNew: 'neues Mitglied hinzufügen...',
          memberRegstered: 'Mitglied erfolgreich hinzugefügt.',
          deleting: 'Gruppe löschen...',
          deleted: 'Gruppe erfolgreich gelöscht.',
          filterMembers: 'Teammitglieder filtern...',
          searchfor: 'Vorname, Nachname..'
        },
        profile: {
          noTeamSelected: 'kein Team ausgewählt',
          extra: 'Extra',
          default: 'Standard',
          back: 'Zurück',
          password: 'Passwort',
          timeline: 'Zeitverlauf',
          profile: 'Profil',
          edit: 'ändern',
          profileView: 'Profilwiedergabe',
          userGroups: 'Anwendergruppen',
          role: 'Funktion',
          email: 'Email',
          phone: 'Telefon',
          address: 'Adresse',
          postcode: 'Postleitzahl',
          city: 'Wohnort',
          editProfile: 'Profil ändern',
          name: 'Name',
          saveProfile: 'Profil speichern',
          passChange: 'Passwort ändern',
          currentPass: 'aktuelles Passwort',
          newPass: 'neues Passwort',
          newPassRepeat: 'neues Passwort wiederholen',
          changePass: 'Passwort ändern',
          newAvail: 'neue Verfügbarkeit',
          userName: 'Anwendername',
          pincode: 'Teammitgliedscode',
          refreshing: 'Profil aktualisieren...',
          dataChanged: 'Profildaten erfolgreich geändert.',
          savingPassword: 'neues Passwort speichern...',
          passwordChanged: 'Passwort erfolgreich aktualisiert.',
          passwordSavedFailed: 'Passwort aktualisieren fehlgeschlagen.',
          pleaseFill: 'Nicht alle Felder sind ausgefüllt!',
          passNotMatch: 'Passwort-Einträge stimmen nicht überein.',
          changingPass: 'Passwort ändern...',
          passChanged: 'Passwort erfolgreich geändert.',
          passwrong: 'Passwort ist inkorrekt. Eingabe wiederholen.',
          currentPassWrong: 'Das aktuelle Passwort ist inkorrekt. Eingabe wiederholen.',
          newTimeslotAdded: 'neue Planung erfolgreich hinzugefügt.',
          changingTimeslot: 'Planung ändern...',
          timeslotChanged: 'Planung erfolgreich geändert.',
          exampleBirthDate: 'Beispiel: 31-12-2001 ',
          firstName: 'Vorname',
          lastName: 'Nachname',
          editProfileImg: 'Profilbild ändern',
          profileImgSuccessfullyUploaded: 'Profilbild erfolgreich hochgeladen.',
          loadUploadURL: 'Bild hochladen, URL laden',
          click2upload: 'Klicken Sie hier, um hochzuladen',
          birthday: 'Geburtsdatum',
          username: 'Anwendername',
          retypePassword: 'Passwort wiederholen',
          roleChangePrompt: 'Ihre Rolle ändert sich hiermit. Sie werden automatisch abgemeldet. Klicken Sie "Ok", um die Änderung durchzuführen.',//'You changed your own role, system will automatically logout, press "Yes" to continue.',
          specifyTeam: 'Wählen Sie eine Gruppe für diese Anwender.',//'You need to sepcify a team to this user'
          authorInfo: 'Erfasser-Info laden...',
          changePassWord: 'Passwort ändern',
          safePassword: 'Passwort speichern',
          oldPassword: 'altes Passwort',
          forgotPassword: 'Wachtwoord vergeten',
          forgotPassInfo: 'We will send you a email with the instructions to reset your password',
          forgotPassInfoSend: 'If the user exists and has an email address, an email is sent to the user with further instructions to change the password',
          keyUsernameWrong: 'The combination of the given key and username is wrong',
          pincode: 'Teammitgliedskode',
          pincodeInUse: 'Teammitgliedskode bereits vergeben, geben Sie einen anderen ein.',
          pincodeNotValid: 'Geben Sie den Teammitgliedskode mit maximal 8 Ziffern an',
          pincodeCorrect: 'Teammitgliedskode vergeben oder ungültig, gebene Sie den korrekten Teammitgliedskode an.',
          pincodeInfo: 'Mit dem oben angegebenen Kode können Sie sich bei Teamtelefon anmelden, falls Teamtelefon Ihre Telefonnummer nicht erkennt.',
          duplicateNumber: 'Nummer bereits vorhanden, bitte geben Sie eine andere Nummer an.',
          pincodeInfoPhone: 'Sofern Sie keinen Kode selbst angegeben haben, werden die letzten 4 Ziffern der Telefonnummer als Teammitgliedkode üebrnommen.'
        },
        settings: {
          settings: 'Einstellungen',
          user: 'Anwender',
          application: 'Anwendung',
          userSettings: 'Anwendereinstellungen',
          appSettings: 'App-Einstellungen',
          saveSettings: 'Einstellungen speichern',
          langSetting: 'Sprache',
          saving: 'Einstellungen speichern...',
          refreshing: 'Einstellungen aktualisieren...',
          saved: 'Einstellungen erfolgreich gespeichert.',
          selectTeam: 'Gruppe wählen',
          teamSettings: 'Einstellungen, Gruppen-Name',
          ringtime: 'Rufdauer',
          ButtonSaveChoice: 'Auswahl bestätigen'
        },
        help: {
          header: 'Hilfe und Support',
          support: 'Support',
          teamTelephone: {
            setReachabilityPhone: 'Wie kann ich telefonisch meine Verfügbarkeit melden?',
            setReachabilityWeb: 'Wie kann ich meine Verfügbarkeit im Web angeben?',
            changeReachabilityTeamMember: 'Wie kann ich die Verfügbarkeit eines Gruppenmitgliedes ändern?',
            changeCallOrderTeam: 'Wie kann ich die Anruf-Reihenfolge meiner Gruppe ändern?',
            changeCallOptions: 'Wie kann ich die Anruf-Einstellungen für meine Gruppe ändern?'
          },
          teams: {
            addNewMember: 'Wie kann ich einen neuen Teilnehmer meiner Gruppe hinzufügen?',
            addExistingMember: 'Wie kann ich einen bereits vorhandenen Teilnehmer meiner Gruppe hinzufügen?',
            removeMember: 'Wie kann ich einen Teilnehmer aus meiner Gruppe löschen?'
          },
          web: {
            title: 'Web Anwendung',
            newMember: 'Wie kann ich einen neuen Patienten anlegen?'
          },
          manuelTeamTelephone: {
            title: 'Handbuch TeamTelefon',
            download: 'Handbuch herunterladen',
          },
          android: {
            title: 'Android',
            addClientReport: 'Wie kann ich einem Patienten einen Bericht hinzufügen?',
            callClient: 'Wie kann ich einen Kunden anrufen?',
          }
        },
        downloads: {
          manual: 'Handbuch herunterladen'
        },
        loading: {
          general: 'laden',
          manage: 'verwalten',
          dashboard: 'Dashboard',
          planboard: 'Agenda',
          messages: 'Berichte',
          teams: 'Gruppen',
          profile: 'Profil',
          settings: 'Einstellungen'
        },
        teamup: {
          noBackends: 'Logging in is temporarily unavailable',
          finished: 'Finished',
          missed: 'Missed',
          teamMembers: 'Team members',
          unknownAddress: 'Address unknown',
          'and': 'and',
          somethingUpdated: function(errors) {
            return (errors.length > 1) ? ' are not updated' : ' is not updated';
          },
          amountReports: function (amountReports)
          {
            return (amountReports == 1)
              ? "There is " + amountReports + " report."
              : "There are " + amountReports + " reports.";
          },
          amountContacts: function(amountContacts)
          {
            return (amountContacts == 1)
              ? "There is " + amountContacts + " contact person."
              : "There are " + amountContacts + " contact persons.";
          },
          removingTeamWithTasks: "There are tasks with the state of planning for the team, remove them first!",
          minimumOneMember: "Atleast one member must be added",
          newNumberOf: "is the new number of ",
          newTeamTelefoonTeam: "New TeamTelephone team",
          syncSucces: 'The teaminfo is syncing.',
          syncError: "The teaminfo couldn't sync",
          notFound: 'Not found',
          clientGroup: 'Clientgrupe',
          client: 'Client',
          extraInfo: 'Extra info',
          coordinator: 'Coordinator',
          teamMember: 'Team Mitglied',
          teamMembers: 'Team Mitglieder',
          apply: 'Anwenden',
          hour: 'Stunde',
          logs: 'Logs',
          order: 'Auftrag',
          options: 'Einstellungen',
          teamNameExistTitle: 'Team name already exist',
          teamNameExistContent: 'Are you sure to add a team which name already exist?',
          help: "Hilfe",
          new: 'neu',
          existing: 'vorhanden',
          teams: 'Gruppen',
          selectTeam: 'Gruppe auswählen',
          clients: 'Patienten',
          title404: 'Oops',
          header404: "Sorry, The page could not found",
          content404: 'It looks like the page does not exist (anymore) or is moved',
          selectClientGroup: 'Patientengruppe wählen',
          loadMembersByName: 'Mitglieder laden...',
          loadingMembers: 'Mitglieder suchen...',
          howToSearchMembers: 'Mitglieder suchen per Anfangsbuchstaben des Vor- und/oder Nachnamens.',
          selectClientGroup: 'Patientengruppe wählen',
          manage: 'verwalten',
          teamTelephone: 'TeamTelefon',
          chooseTeam: 'Gruppe wählen',
          undefinedTeamMember: 'unbekanntes Gruppen-Mitglied',
          defaultTeam: 'Standard Gruppe',
          edit: 'bearbeiten',
          editTeam: 'Gruppe bearbeiten',
          team: 'Gruppe',
          del: 'löschen',
          noMembers: 'keine Gruppen-Mitglieder',
          newTeam: 'neue Gruppe',
          teamName: 'Gruppen-Name',
          createTeam: 'speichern',
          newMember: 'neues Gruppen-Mitglied',
          noMembersFound: 'kein Ergebnis für diese Suche.',
          //start TODO
          backEndUnavailable: "The back-end is temporarily unavailable, try to login again. If the problem continues to occur, contact your system administrator.",
          noBackend: function(email)
          {
            var text = "Het is niet gelukt om verbinding te maken met de server.<br />"
            text += "Als u problemen blijft ervaren, kunt u een  <a href='mailto:" + email;
            text += "?subject=Melding van een probleem met TeamUp / TeamTelefoon";
            text += "&body=Beste%20support%2C%0A%0AHelaas%20ervaar%20ik%20problemen%20met%20TeamTelefoon.";
            text += "%20Ik%20krijg%20de%20melding%20%u201CHet%20is%20niet%20gelukt%20om%20verbinding";
            text += "%20te%20maken%20met%20de%20server.%u201D%0A%0AKunt%20u%20mij%20hiermee%20helpen";
            text += "%3F%0A%0AMet%20vriendelijke%20groet%2C%0A%0A%5Buw%20naam";
            text += "%5D%0A%5Buw%20team%5D%0A%5Buw%20organisatie%5D%20";
            text += "'>email</a> sturen naar onze support afdeling."

            return text;
          },
          statusCodeNotRegonized: "Status-code not regonized",
          //end
          name: 'Name',
          role: 'Rolle',
          phone: 'Telefon',
          street: 'Strasse',
          postCode: 'Postleitzahl',
          city: 'Ortsname',
          email: 'E-Mail',
          saveMember: 'speichern',
          state: 'Status',
          states: 'Status',
          saveTeam: 'Gruppe speichern',
          save: 'speichern',
          seconds: "Sekunden",
          refreshing: 'Gruppen-Informationen aktualisieren',
          dataChanged: 'Informationen wurden geändert.',
          teamSubmitError: 'Fehler beim Erstellen: ',
          queryTeamError: 'Fehler bei Gruppe-Suche aufgetreten.',
          teamNamePrompt1: 'Gruppen-Namen eintragen.',
          teamNamePrompt2: 'Kontaktdaten hinzufügen',
          cancel: 'abbrechen',
          chooseRole: 'Rolle wählen',
          func: 'Funktion',
          chooseFunction: 'Funktion wählen',
          newClientGroup: 'neue Gruppe',
          newClient: 'neuer Patient',
          reports: 'Berichte',
          report: 'Bericht',
          noClients: 'keine Patienten in dieser Gruppe',
          noClientGroup: 'keine Patienten-Gruppe',
          noClientGroupFound: 'No client group found for this team',
          TeamClients: 'Gruppe - Patienten',
          createClientGroup: 'speichern',
          contacts: 'Kontakte',
          Number: 'Nummer',
          clientProfileUrl: 'URL Patientenprofil',
          addContact: 'Ansprechpartner hinzufügen',
          editContact: 'Ansprechpartner ändern',
          saveClient: 'speichern',
          group: 'Gruppe',
          errorSaveClientGroup: 'Speichern von Änderungen der Kunden-Gruppe ist fehlgeschlagen.',
          noContacts: 'keine Ansprechpartner vorhanden.',
          noReports: 'keine Berichte für diesen Patienten.',
          contactCount: 'Es gibt $v Ansprechpartner.',
          reportCount: 'Es gibt $v Berichte.',
          accountInfoFill: 'Account-Informationen eintragen',
          passNotSame: 'Passwörter stimmen nicht überein.',
          savingMember: 'Mitglied speichern...',
          selectTeam: 'Gruppe wählen',
          clinetInfoFill: 'Patienteninformationen (Name, Telefonnummer, ...) eintragen',
          savingClient: 'Patienteninformationen speichern...',
          clientSubmitError: 'Fehler beim Anlegen eines neuen Patienten.',
          clientGroups: 'Patienten-Gruppen',
          saveClientGroup: 'Patienten-Gruppe speichern...',
          deleteClientFromClientGroup: 'Patient wurde gelöscht',
          deletingClientFromClientGroup: 'Patient aus Gruppe löschen...',
          teams_Cap: 'Gruppen',
          noTeamNameFound: 'unbekannter Gruppenname',
          noTeam: 'keine Gruppe',
          searchMembers: 'Mitglieder suchen...',
          editClient: 'Patient bearbeiten',
          loadingNumber: 'Telefonnummer der Gruppe wird geladen...',
          loadClients: 'Patienteninformationen werden geladen...',
          birthdayError: 'Geburtsdatum ist ungültig.',
          map: 'Karte',
          saveContacts: 'Ansprechpartner speichern',
          loadingReports: 'Berichte laden',
          reportEmpty: 'Titel und Zusammenfassung eintragen!',
          reportValid: 'Eingabefelder nicht korrekt!',
          reportBody: 'Umschreibung',
          reportBodyRequired: 'Umschreibung eintragen',
          reportTitleRequired: 'Überschrift eintragen',
          reportBodyMinChars: 'Umschreibung sollte mindestens 8 Zeichen enthalten!',
          reportTitleMinChars: 'Überschrift sollte mindestens 4 Zeichen enthalten!',
          reportBodyMaxChars: 'Die Umschreibung darf maximal 150 Zeichen enthalten!',
          reportTitleMaxChars: 'Die Überschrift darf maximal 30 Zeichen enthalten!',
          checkLocalStorage: 'Der von Ihnen eingeschaltete Privat-Modus wird nicht unterstützt. Hier erfahren Sie, wie der Privat-Modus ausgeschaltet wird:',
          readMore: 'mehr erfahren',
          date: 'Datum',
          datetime: 'Datum und Zeit',
          writenBy: 'erfasst von',
          noSharedStates: 'kein geteilter Status',
          savingContacts: 'Ansprechpartner speichern',
          // delClientGroupConfirm: 'Soll diese Patienten-Gruppe tatsächlich gelöscht werden? Dies kann einen Moment dauern.',
          // delTeamConfirm: 'Soll diese Gruppe tatsächlich gelöscht werden? Dies kann einen Moment dauern.',
          deletingClientGroup: 'Gruppe löschen... ',
          from: 'von',
          to: 'bis',
          time: 'Zeit',
          duration: 'Dauer',
          coordinatorNoTeam: 'Sie sind in keiner Gruppe; Tragen Sie sich in eine Gruppe ein.',
          teamMemberNoTeam: 'Sie sind in keiner Gruppe, bitte nehmen Sie Kontakt mit dem Verwalter auf. ',
          //deleteConfirm: 'OK klicken, um weiter zu machen.',
          confirms: {
            deleteClientTitle: 'Patient löschen',
            deleteClient: 'Soll dieser Patient tatsächlich gelöscht werden?',
            deleteClientFromTeamTitle: 'Patient aus Gruppe löschen',
            deleteClientFromTeam: 'Sind Sie sicher, dass dieser Patient aus dieser Gruppe gelöscht werden soll?',
            deleteReportTitle: 'Bericht löschen',
            deleteReport: 'Sind Sie sicher, dass dieser Bericht gelöscht werden soll?',
            deleteProfileTitle: 'Profil löschen',
            deleteProfile: 'Sind Sie sicher, dass dieses Profil gelöscht werden soll?',
            deleteMemberFromTeamTitle: 'Mitglied aus allen Gruppen löschen',
            deleteMemberFromTeam: 'Sind Sie sicher, dass dieses Mitglied aus allen Gruppen gelöscht werden soll? Achtung, wer nicht in einer Gruppe ist, kann TeamUp nicht anwenden!',
            deleteMemberTitle: 'Mitglied löschen',
            deleteMember: ' Sind Sie sicher, dass dieses Mitglied aus der Gruppe gelöscht werden soll?',
            deleteClientGroupTitle: 'Kunden-Gruppe löschen',
            deleteClientGroup: ' Sind Sie sicher, dass diese Kunden-Gruppe gelöscht werden soll? Dies kann einen Moment dauern.',
            deleteTeamTitle: 'Gruppe löschen',
            deleteTeam: ' Sind Sie sicher, dass diese Gruppe gelöscht werden soll? Dies kann einen Moment dauern.',
            deleteTaskTitle: 'Aufgabe löschen',
            deleteTask: ' Sind Sie sicher, dass diese Aufgabe gelöscht werden soll? ',
            deleteContactTitle: 'Ansprechpartner löschen',
            deleteContact: ' Sind Sie sicher, dass dieser Ansprechpartner gelöscht werden soll?',
            remove: 'löschen',
            addTeamMemberCodeAsPhoneTitle: 'Teammitgliedskode ändern',
            addTeamMemberCodeAsPhone: 'Es wurde ein eigener Teammitgliedskode angegeben, der anders lautet, las die 4 letzten Ziffern Ihrer Teamtelefonnummer?',
            photoRemoveTitle: 'Profilbild löschen',
            photoRemoveBody: ' Sind Sie sicher, dass Ihr Profilbild gelöscht werden soll?',
            yes: 'Ja, das möchte ich',
            no: 'Nein, abbrechen',
            cancel: 'abbrechen',
            day: {
              sunday: 'Sonntag',
              monday: 'Montag',
              tuesday: 'Dienstag',
              wednesday: 'Mittwoch',
              thursday: 'Donnerstag',
              friday: 'Freitag',
              saturday: 'Samstag'
            },
            shortDay: {
              su: "So",
              mo: "Mo",
              tu: "Di",
              we: "Mi",
              th: "Do",
              fr: "Fr",
              su: "Sa"
            }
          },
          deletingTeam: 'Gruppe löschen...',
          deletingMember: 'Mitglied löschen ...',
          deletingClient: 'Patient löschen ...',
          noMessages: 'Es gibt keine Berichte.',
          newReport: 'neuer Bericht',
          editReport: 'Bericht ändern',
          selectClient: 'Patient wählen',
          selectMember: 'Mitglied wählen',
          selectMonth: 'Monat wählen',
          saveReport: 'Bericht speichern',
          reportTitle: 'Titel',
          selectSlot: 'Zeitraum wählen',
          editClientImg: 'Patientenbild ändern',
          newTask: 'neue Aufgabe',
          updateTask: 'Aufgabe ändern',
          managePanelchangePrompt: 'Daten wurden geändert. Auf \'Ok\' klicken, um fortzufahren, ansonsten \'Abbrechen\' .',
          pagePrevious: 'vorherige',
          pageNext: 'nächste',
          pageFirst: 'erste',
          pageLast: 'letzte',
          refresh: 'aktualisieren',
          stateValue: {
            'reachable': 'verfügbar',
            'available': 'erreichbar',
            'working': 'beschäftigt',
            'offline': 'offline',
            'on_the_phone': 'am Telefon',
            'unknown': 'unbekannt',
            'secondline': 'Second line',
            'possibly_reachable': 'nichts geplant',
            'unreachable': 'nicht verfügbar',
            'unavailable': 'nicht erreichbar',
            'unknown': 'offline'
          },
          reportNotExists: 'Bericht nicht vorhanden.',
          sessionTimeout: 'Sitzung beendet, Sie müssen sich erneut anmelden.',
          error: {
            support: 'Contact the support team of TeamUp / TeamTelephone'
          },
          errorCode: {
            '1': "A error has been appeared. The requested data couldn't be loaded. ",
            '2': 'Domainagent nicht gefunden. Erneutes Anmelden könnte das Problem beheben.',
            '3': 'Bevor eine Gruppe erstellt werden kann, muss diesem Mitglied die Koordinator-Rolle zugeteilt werden.',
            '4': 'Agent ID darf nur Buchstaben und Zahlen enthalten.',
            '5': 'JSON Parsing oder JSON body Fehler',
            '6': 'Ein oder mehrere Parameter fehlen',
            '7': 'Die Gruppe "Teilnehmer" wurde nicht gefunden',
            '8': 'Keine Gruppe mit dieser ID: teamUuid vorhanden',
            '9': 'Dieser Teilnehmer ist nicht Mitglied dieser Gruppe',
            '10': 'Gruppe mit  teamUuid existiert nicht',
            '11': 'Bevor eine Gruppe erstellt werden kann, muss diesem Mitglied die Koordinator-Rolle zugeteilt werden.',
            '12': 'Team-Agent konnte nicht erstellt werden',
            '13': 'uuid Parameter und uuid in payload sind nicht identisch',
            '14': 'Es gibt bereits ein Mitglied mit dieser uuid ',
            '15': 'einer der Werte ist unbekannt',
            '16': 'eine der Eingaben ist NULL, d.h. ungültig',
            '17': 'einer der Werte ist von einem unbekannten Typ.',
            '18': 'ein Anwender mit dieser ID existiert nicht',
            '19': 'das vorherige und aktuelle Passwort stimmen nicht überein',
            '20': 'Dieses Mitglied muss die Koordinator-Rolle besitzen, um das Passwort eines anderen Mitgliedes zu ändern.',
            '21': 'Ein Parameter kann nicht bearbeitet werden',
            '22': 'Dieser Teilnehmer ist in keiner Gruppe',
            '23': 'Ungültig, es fehlen Angaben',
            '24': 'Konfigurationsfehler, AskFast nicht möglich',
            '25': 'Telefonnummer wird schon verwendet',
            '26': 'One of the conditions to activate TeamTelephone was unsuccessful',
            '27': 'The scenario could not be created for this team',
            '28': 'AskFast error',
            '29': 'A voicemailgroup could not be created',
            '30': 'A item in the TeamTelephone config is not writable',
            '31': 'TeamTelefoon is already activated for this team',
            '32': 'Agent not found',
            '33': 'No templates found in the ScenarioTemplateAgent',
            '34': 'Could not generate scenario',
            '36': 'A unexpected parameter of type',
            '39': 'The key to reset the password is expired'
          },
        },
        upload: {
          chooseFile: 'Choose file',
          processFile: 'Process file',
          choiceWeek: 'Choose week',
          processSheet: 'Process sheet',
          checkRoutes: 'Check routes',
          dragSpreadSheet: 'Drag a spreadsheet (XLSX, XLSM or XLSB) to this point',
          checkRoutes: 'Checking routes',
          continue: 'Continue',
          checkNames: 'Checking names',
          passed: 'passed',
          failed: 'failed',
          busy: 'busy',
          open: 'open',
          uploadSpreadSheet: 'upload spreadsheet...',
          nobody: 'Nobody',
          createTasks: 'Create tasks',
          followingTasksNotUploaded: "The next tasks couldn't be uploaded",
          morning: "morning",
          noon: "noon",
          evening: "evening",
          afternoon: "afternoon",
          night: "night",
          importedFromASpreadSheet: 'Imported from spreadsheet',
          expectationTime: function (cellName)
          {
            return "There is a yes/no value found in cell " + cellName + ", while there is a point in time expected.";
          },
          expectationClientName: function (cellName)
          {
            return "There is a yes/no value found in cell " + cellName + ", while there was a clientname expected.";
          },
          expectationMinutes: function (cellName)
          {
            return "There is a yes/no value found in cell " + cellName + ", while there are a amount of minutes expected";
          },
          foundIntNeedString: "There is a error found in ",
          readError: function (cellName)
          {
            return "It's not possible to read a point in time in cell " + cellName + " te lezen.";
          },
          nofUnassignedRoutes: function (nofUnassignedRoutes)
          {
            return "There are " + nofUnassignedRoutes + " routes where a team member is assigned to.";
          },
          unknownError: "A unknown error is occured: ",
          errors: 'Errors'
        },
        task: {
          timeframe: 'Zeitspanne',
          status: 'Status',
          description: 'Beschreibung',
          createdBy: 'Erstellt durch',
          name: 'Name',
          hasToload: ' läd..',
          showArchivedTasks: 'archivierte Aufgaben anzeigen',
          showOnlyNotAssignedTasks: 'Nur nicht zugewiesene Aufgaben anzeigen',
          member: 'Mitglied',
          thereAreAmountTasks: function (amountTasks)
          {
            return (amountTasks == 1)
              ? "Es gibt eine " + amountTasks + " Aufgabe."
              : "Es gibt " + amountTasks + " Aufgaben.";
          },
          carer: 'Betreuer',
          information: 'Information',
          noTasks: 'No active or planned tasks',
          clientName: 'Klient',
          memberName: 'Mitglied',
          orderType1: 'Standard -Reihenfolge',
          orderType2: 'Zeit',
          tasks: 'Aufgaben',
          myTask: 'Meine Aufgaben',
          newTask: 'Neue Aufgabe',
          orderby: 'Aufsteigend sortieren',
          allTasks: 'Alle Aufgaben',
          description: 'Anmerkungen',
          filltheTime: 'Geben Sie Start- und Endzeit der Aufgabe ein.',
          startTimeEmpty: 'Geben Sie Startdatum und Startzeit ein.',
          endTimeEmpty: 'Geben Sie Enddatum und Endzeit ein.',
          planTaskInFuture: 'Sie können keine Aufgabe in der Vergangenheit einrichten. Wählen Sie Start und Ende in der Zukunft',
          startLaterThanEnd: 'Beginn muss vor dem Ende liegen.',
          specifyClient: 'Wählen Sie einen Klienten für die Aufgabe.',
          creatingTask: 'Aufgabe wird erstellt',
          editingTask: 'Aufgabe wird geändert',
          taskSaved: 'Aufgabe gespeichert.',
          noArchivedTask: 'No finished tasks found.',
          deleteTaskConfirm: 'Sind Sie sicher, dass Sie diese Aufgabe endügltig löschen möchten?',
          taskDeleted: 'Aufgabe gelöscht.',
          planningTime: 'Zeitspanne',
          refreshTask: 'Das Laden von Aufgaben',
          upload: 'Aufgaben hochladen',
          deleteTasksConfirm: 'Sind Sie sicher, dass Sie diese Anmerkungen löschen möchten?',
          taskDescriptionMinChars: 'Anmerkungen müssen mindestens 8 Zeichen umfassen.',
          taskDescriptionMaxChars: 'Anmerkungen können maximal 500 Zeichen umfassen.',
          taskFormValide: 'Neue Aufgabe ungültig! Folgen Sie schrittweise den Anweisungen.'
        },
        order: {
          randomOrder: 'willkürlich',
          fixedOrder: 'Reihenfolge selbst bestimmen',
          evenOrder: 'Evenly',
          confirmation: 'Auswahl bestätigen',
          loadTeam: 'Gruppe laden...',
          orderSaved: 'Reihenfolge gespeichert',
          noMembers: 'keine Mitglieder in dieser Gruppe.',
          evenOrderFeedback: "With this option, the caller is transferred to the team member that least recently called to.",
          randomFeedback: 'With this option, a caller is always connected to any team member.',
          fixedOrderFeedback: 'With this option, the team can determine the sequence.'
        },
        logs: {
          loadLogs: 'Logs laden...',
          empty: 'keine Logs vorhanden',
          filter: 'Logs filtern...',
          to: 'To',
          amountLogs: function (amount)
          {
            if (amount == 1)
            {
              return 'There is ' + amount + ' log shown';
            }
            else
            {
              return 'There are ' + amount + ' logs shown.';
            }
          },
          status: {
            sent: 'ausgehend',
            received: 'eingehend',
            finished: 'beendet',
            missed: 'verpasst',
            delivered: 'empfangen',
            error: 'Fehler'
          }
        },
        validation: {
          data: "Eine oder mehrere Eingaben sind nicht abgeschlossen",
          default: {
            required: function (fieldName)
            {
              return 'A ' + fieldName.toLowerCase() + ' is required';
            },
            minLength: function (fieldName)
            {
              return 'The ' + fieldName.toLowerCase() + ' has not enough characters';
            },
            maxLength: function (fieldName)
            {
              return 'De ' + fieldName.toLowerCase() + ' has to many characters';
            },
            regularPunctuation: "Only regular punctuation is allowed, like -_,!@#$%^&*()"
          },
          phone: {
            notValid: 'Bitte eine gültige Telefonnummer eintragen!',
            invalidCountry: 'Ländervorwahl ist inkorrekt! Es dürfen nur niederländische (+31) Nummern verwendet werden.',
            tooShort: ' (fehlerhafte Telefonnummer: zu wenig Ziffern.)',
            tooLong: ' (fehlerhafte Telefonnummer: zu viele Ziffern.)',
            notValidOnSubmit: 'es muss minimal eine korrekte Telefonnummer eingetragen werden, bevor die Daten gespeichert werden.',
            message: 'fehlerhafte Telefonnummer. Die Nummer ist bereits vorhanden ',
            as: ' als ',
            multipleNotvalid: 'eine oder mehrere fehlerhafte Telefonnummer(n)!',
            fixedLine: 'eine Festnetznummer',
            mobile: 'eine mobile Telefonnummer',
            mobileOrFixedLine: 'eine Festnetz- oder mobile Telefonnummer'
          },
          pincode: {
            exists: 'Dieser Mitgliedskode ist bereits vergeben. Wählen Sie einen anderen!'
          },
          password: {
            amountMinChars: function (chars)
            {
              return ' und sollte minimal ' + chars + ' Zeichen enthalten'
            },
            amountMaxChars: function (chars)
            {
              return ' und maximal ' + chars + ' Zeichen enthalten'
            },
            oldPassMatch: 'Das eingetragene alte Passwort ist nicht identisch mit dem aktuellen Passwort.',
            required: 'Es muss ein Passwort eingetragen werden',
            identical: 'Das Passwort müssen identisch sein'
          },
          email: {
            notValid: 'E-Mail Adresse ist fehlerhaft!',
              required: 'Es muss eine E-Mail Adresse eingetragen werden'
          },
          role: 'Rolle festlegen',
            birthDate: {
            notValid: 'Geburtsdatum ist fehlerhaft!'
          },
          userName: {
            regex: 'AND darf nur Buchstaben, Zahlen und die Zeichen “_” und  “-” enthalten',
            valid: 'Es muss ein Anwendernamen festgelegt werden',
            email: "A username is allowed ",
            amountMinChars: function (number)
            {
              return ' and must have a minimum of ' + number + ' characters'
            }
          },
          search: {
            notValid: 'Vor- und Nachname festlegen!'
          },
          wish : {
            integer: 'Give a number in the range of 0 to 30 '
          },
          upload: {
            fileTypeNotAloud: "The type of file you have uploaded is not allowed, Pick one of the following types: 'png', 'jpeg', 'jpg','gif', 'bpg' or 'tiff'"
          }
        },
      },
      nl: {
        meta: {
          name: 'nl',
          label: 'Nederlands'
        },
        login: {
          header: 'Inloggen',
          placeholder_username: 'Vul uw gebruikersnaam in',
          placeholder_password: 'Vul uw wachtwoord in',
          label_rememberMe: 'Onthoud mij',
          button_login: 'Inloggen',
          button_loggingIn: 'Inloggen...',
          forgot_password: 'Wachtwoord vergeten?',
          forgetPassword: 'Wachtwoord vergeten',
          emailAddress: 'E-mailadres',
          resetPassword: 'Wachtwoord opnieuw instellen',
          returnLogin: 'Naar het inlogscherm',
          changePassword: 'Wachtwoord wijzigen',
          downloadApp: 'Download mobiele app',
          ph_username: 'Gebruikersnaam',
          ph_password: 'Wachtwoord',
          ph_newPass: 'nieuw wachtwoord',
          ph_retypePass: 'Herhaal wachtwoord',
          alert_fillfiled: 'Vul alle velden in!',
          alert_wrongUserPass: 'Onjuiste gebruikersnaam of wachtwoord!',
          loading_User: 'Gebruikersinformatie laden...',
          loading_Message: 'Berichten laden...',
          loading_Group: 'Groepen laden...',
          loading_Members: 'Teamleden laden...',
          loading_everything: 'Alles is geladen!',
          logout: 'Uitloggen',
          loggingOff: 'Uitloggen',
          loading: 'Laden..',
          loading_clientGroups: 'Cliëntengroepen laden...',
          loading_clients: 'Cliënten laden',
          loading_teams: 'Teams laden...',
          loading_tasks: 'Taken laden...'
        },
        video: {
          title: 'Video',
          videoNotLoaded: 'Het ingevoerde nummer is onjuist. Dit nummer is niet bekend bij een team met videobellen.',
          stop: 'Het videogesprek is beëindigd.'
        },
        dashboard: {
          thisWeek: 'Deze week',
          welcome: 'Welkom',
          everyone: 'Iedereen',
          newMessage: 'Nieuwe berichten',
          goToInbox: 'Ga naar inbox',
          loadingPie: 'Cirkeldiagrammen laden...',
          possiblyReachable: 'Niet gepland',
          noPlanning: 'Geen Planning',
          load: 'laden...',
          time: {
            days: 'd',
            hours: 'u',
            minutes: 'm',
            seconds: 's'
          },
          announcements: 'Alarmberichten',
          loadingP2000: 'Alarmberichten laden...',
          noP2000: 'Er zijn geen alarmberichten.',
          accessibilityStatement: 'Overzicht bereikbaarheid',
          loading: 'aan het laden...',
          accessible: 'bereikbaar'
        },
        agenda: {
          currentAmountReachable: 'Huidig aantal beschikbaar ',
          amountOfPeopleWished: 'Gewenst aantal mensen',
          requiredPeople: 'Benodigd',
          customDates: 'Aangepaste periode',
          planboard: 'Agenda',
          newAvail: 'Nieuwe bereikbaarheid',
          day: 'Dag',
          week: 'Week',
          month: 'Maand',
          updateAvail: 'Update bereikbaarheid',
          from: 'Vanaf',
          till: 'Tot',
          state: 'Status',
          selectAState: 'selecteer een status',
          reoccuring: 'Herhaling',
          lessPeople: 'Er is een tekort van $v mens(en)!',
          samePeople: 'Er zijn precies genoeg mensen.',
          morePeople: 'Er is een overschot van $v mens(en)!',
          wished: 'Benodigd',
          combine_reoccuring: 'Dit is een gecombineerde planning rij met opeenvolgende rijen.',
          sendMsgToMember: 'Stuur bericht naar teamleden',
          noMembers: 'Er zijn geen leden in dit team.',
          noClients: 'Er zijn geen cliënten in deze cliëntgroep.',
          add: 'Toevoegen',
          del: 'Verwijderen',
          change: 'Wijzigen',
          setWish: 'Behoefte opslaan',
          timeline: 'Tijdlijn',
          statistics: 'Statistieken',
          barCharts: 'Staafdiagrammen',
          wishes: 'Benodigd',
          legenda: 'Legenda',
          group: 'Team',
          groups: 'Teams',
          members: 'Leden',
          teamMembers: 'Teamleden',
          bothAvailable: 'Beide beschikbaar',
          northAavailable: 'beschikbaar Noord',
          southAvailable: 'beschikbaar Zuid',
          skipperOutService: 'Skipper Of Service',
          notAvailable: 'Niet bereikbaar', // Niet Beschikbaar
          notachieve: 'Niet gearchiveerd',
          legendaLabels: {
            morePeople: 'Ruim genoeg mensen',
            enoughPeople: 'Precies genoeg mensen',
            lessPeople: 'Te weinig mensen'
          },
          lastSyncTime: 'Laatste synchronisatie tijd:',
          dataRangeStart: 'Datumbereik start: ',
          DataRangeEnd: 'Datumbereik eind: ',
          loadingTimeline: 'Tijdlijn laden...',
          addTimeSlot: 'Tijdslot toevoegen...',
          slotAdded: 'Nieuw tijdslot is succesvol toegevoegd',
          changingSlot: 'Tijdslot wijzigen...',
          slotChanged: 'Tijdslot succesvol gewijzigd.',
          changingWish: 'Behofte wordt veranderd...',
          wishChanged: 'De behoefte is succesvol gewijzigd.',
          deletingTimeslot: 'Tijdslot verwijderen...',
          timeslotDeleted: 'Tijdslot is succesvol verwijderd.',
          refreshTimeline: 'Tijdlijn verversen...',
          preCompilingStortageMessage: 'Voor gecompileert kort bericht',

          myWeeklyPlanning: 'Mijn wekelijkse planning',
          weeklyPlanning: 'Wekelijkse planning',
          weeklyPlanningOf: 'Wekelijkse planning van ',
          myPlanning: 'Mijn planning',
          planning: 'Planning',
          planningOf: 'Planning van ',

          minNumber: 'Minimum aantal benodigden',
          statDays: 'dagen',
          statHours: 'uren',
          statMinutes: 'minuten',
          statPeopleLess: 'Minder mensen dan verwacht',
          statPeopleEven: 'Precies genoeg mensen',
          statPeopleMore: 'Meer mensen dan verwacht',
          getWishes: 'Pak de minimale benodigde waarde...',
          daterangerToday: 'Vandaag',
          daterangerTomorrow: 'Morgen',
          daterangerLast7Days: 'Laatste 7 dagen',
          daterangerYesterday: 'Gisteren',
          daterangerNext3Days: 'Volgende 3 dagen',
          daterangerNext7Days: 'Volgende 7 dagen',
          loadingTimeline: 'Tijdlijn laden...',
          rangeInfoTotalSelectedDays: 'Totaal aantal geselecteerde dagen: ',
          rangeInfoTime: 'Tijd: ',
          rangeInfoWeekNumber: 'Weeknummer: ',
          rangeInfoMonth: 'Maand: ',
          rangeInfoTotalDays: ', Totaal aantal dagen: ',
          addTimeSlot: 'Tijdslot toevoegen...',
          slotAdded: 'Tijdslot succesvol toegevoegd.',
          changingSlot: 'Tijdslot wijzigen...',
          slotChanged: 'Tijdslot succesvol gewijzigd.',
          changingWish: 'Behoefte wijzigen...',
          wishChanged: 'Behoefte succesvol gewijzigd.',
          deletingTimeslot: 'Tijdslot verwijderen...',
          timeslotDeleted: 'Tijdslot succesvol verwijderd.',
          refreshTimeline: 'Tijdlijn vernieuwen...',
          preCompilingStortageMessage: 'Opstellen tekortbericht',
          weeklyPlanning: 'Mijn wekelijkse planning',
          weeklyPlanningOf: 'Wekelijkse planning van ',
          planning: 'Mijn planning',
          planningOf: 'Planning van ',
          minNumber: 'Minimum aantal benodigde mensen',
          time: 'Time: ',
          weekNumber: 'Weeknummer: ',
          monthNumber: 'Maand nummer: ',
          totalDays: 'Totaal dagen: ',
          removeTasksRange: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Weet u zeker dat u de taken van ' + options.range.start + ' t/m ' + options.range.end;
              html += ' van ' + options.group + ' ' + options.name;
              html += ' wilt verwijderen?';
            }

            return html;
          },
          tasksDeleted: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'De taken van ' + options.range.start + ' t/m ' + options.range.end;
              html += ' van ' + options.group + ' ' + options.name;
              html += ' zijn verwijderd.';
            }

            return html;
          },
          noTasksFounded: 'Geen taken gevonden in de opgegeven range.',
          removeTasksTitle: 'Taken verwijderen',
          query: 'Er zijn wat problemen met het synchroniseren van de agenda. Kunt u alstublieft uw browser verversen om de laatste informatie op te halen.',
          pastAdding: 'Het is niet mogelijk in het verleden te plannen!',
          errorAdd: 'Fout opgetreden tijdens het toevoegen van een planning!',
          errorChange: 'Fout opgetreden tijdens het wijzigen van een planning!',
          pastChanging: 'Het wijzigen van een planning in het verleden is niet mogelijk!',
          pastDeleting: 'Het verwijderen van een planning in het verleden is niet mogelijk!',
          remove: 'Fout(en) met het verwijderen van de planning!',
          wisher: 'Fout(en) met het wijzigen van de behoefte',
          editTimeline: 'Wijzig de tijdlijn van ',
          notAuth: 'Het is niet mogelijk om iemands anders planning te wijzigen, behalve als de rol van coördinator. Als coördinator kan je de planning van andere wijzigen  door op hun naam te klikken in de lijst. Je wordt naar een andere pagina genavigeerd waar de planning van het betreffende lid is te wijzigen.',
          the: 'De',
          reachabilityChangedSentence: 'bereikbaarheid kan gewijzigd worden',
          byThe: 'door te',
          doubleClick: 'dubbelklikken op reeds bestaande blokken of ',
          byDragging: 'door te slepen',
          leftButtonMouse: 'met uw muis. Met de linkermuisknop en de',
          or: 'of',
          buttonPushed: 'knop tegelijkertijd ingedrukt.'
        },
        planboard: {
          currentAmountReachable: 'Huidig aantal beschikbaar ',
          amountOfPeopleWished: 'Gewenst aantal mensen',
          requiredPeople: 'Benodigd',
          customDates: 'Aangepaste periode',
          planboard: 'Agenda',
          noAffectedTeam: 'Deze clientgroep heeft geen verbonden team of leden',
          noAffectedClientGroup: 'Dit team heeft geen verbonden clientgroep of clienten',
          newAvail: 'Nieuwe bereikbaarheid',
          day: 'Dag',
          week: 'Week',
          month: 'Maand',
          updateAvail: 'Update bereikbaarheid',
          from: 'Vanaf',
          till: 'Tot',
          state: 'Status',
          selectAState: 'selecteer een status',
          reoccuring: 'Herhaling',
          lessPeople: 'Er is een tekort van $v mens(en)!',
          samePeople: 'Er zijn precies genoeg mensen.',
          morePeople: 'Er is een overschot van $v mens(en)!',
          wished: 'Benodigd',
          combine_reoccuring: 'Dit is een gecombineerde planning rij met opeenvolgende rijen.',
          sendMsgToMember: 'Stuur bericht naar teamleden',
          noMembers: 'Er zijn geen leden in dit team.',
          noClients: 'Er zijn geen cliënten in deze cliëntgroep.',
          add: 'Toevoegen',
          del: 'Verwijderen',
          change: 'Wijzigen',
          setWish: 'Behoefte opslaan',
          timeline: 'Tijdlijn',
          statistics: 'Statistieken',
          barCharts: 'Staafdiagrammen',
          wishes: 'Behoefte',
          legenda: 'Legenda',
          group: 'Team',
          groups: 'Teams',
          members: 'Leden',
          teamMembers: 'Teamleden',
          bothAvailable: 'Beide beschikbaar',
          northAavailable: 'beschikbaar Noord',
          southAvailable: 'beschikbaar Zuid',
          skipperOutService: 'Skipper Of Service',
          notAvailable: 'Niet bereikbaar', // Niet Beschikbaar
          notachieve: 'Niet gearchiveerd',
          legendaLabels: {
            morePeople: 'Ruim genoeg mensen',
            enoughPeople: 'Precies genoeg mensen',
            lessPeople: 'Te weinig mensen'
          },
          lastSyncTime: 'Laatste synchronisatie tijd:',
          dataRangeStart: 'Datumbereik start: ',
          DataRangeEnd: 'Datumbereik eind: ',
          loadingTimeline: 'Tijdlijn laden...',
          addTimeSlot: 'Tijdslot toevoegen...',
          slotAdded: 'Nieuw tijdslot is succesvol toegevoegd',
          changingSlot: 'Tijdslot wijzigen...',
          slotChanged: 'Tijdslot succesvol gewijzigd.',
          changingWish: 'Behoefte wordt veranderd...',
          wishChanged: 'De behoefte is succesvol gewijzigd.',
          deletingTimeslot: 'Tijdslot verwijderen...',
          timeslotDeleted: 'Tijdslot is succesvol verwijderd.',
          refreshTimeline: 'Tijdlijn verversen...',
          preCompilingStortageMessage: 'Voor gecompileert kort bericht',
          weeklyPlanning: 'Wekelijkse planninng',
          planning: 'Mijn planning',
          planningOf: 'Planning van ',
          minNumber: 'Minimum aantal benodigden',
          statDays: 'dagen',
          statHours: 'uren',
          statMinutes: 'minuten',
          statPeopleLess: 'Minder mensen dan verwacht',
          statPeopleEven: 'Precies genoeg mensen',
          statPeopleMore: 'Meer mensen dan verwacht',
          getWishes: 'Pak de minimale benodigde waarde...',
          daterangerToday: 'Vandaag',
          daterangerTomorrow: 'Morgen',
          daterangerLast7Days: 'Laatste 7 dagen',
          daterangerYesterday: 'Gisteren',
          daterangerNext3Days: 'Volgende 3 dagen',
          daterangerNext7Days: 'Volgende 7 dagen',
          loadingTimeline: 'Tijdlijn laden...',
          rangeInfoTotalSelectedDays: 'Totaal aantal geselecteerde dagen: ',
          rangeInfoTime: 'Tijd: ',
          rangeInfoWeekNumber: 'Weeknummer: ',
          rangeInfoMonth: 'Maand: ',
          rangeInfoTotalDays: ', Totaal aantal dagen: ',
          addTimeSlot: 'Tijdslot toevoegen...',
          slotAdded: 'Tijdslot succesvol toegevoegd.',
          changingSlot: 'Tijdslot wijzigen...',
          slotChanged: 'Tijdslot succesvol gewijzigd.',
          changingWish: 'Behoefte wijzigen...',
          wishChanged: 'Behoefte succesvol gewijzigd.',
          deletingTimeslot: 'Tijdslot verwijderen...',
          timeslotDeleted: 'Tijdslot succesvol verwijderd.',
          refreshTimeline: 'Tijdlijn vernieuwen...',
          preCompilingStortageMessage: 'Opstellen tekortbericht',

          myWeeklyPlanning: 'Mijn wekelijkse planning',
          weeklyPlanning: 'Wekelijkse planning',
          weeklyPlanningOf: 'Wekelijkse planning van ',
          myPlanning: 'Mijn planning',
          planning: 'Planning',
          planningOf: 'Planning van ',

          minNumber: 'Minimum aantal benodigde mensen',
          time: 'Time: ',
          weekNumber: 'Weeknummer: ',
          monthNumber: 'Maand nummer: ',
          totalDays: 'Totaal dagen: ',
          removeTasksRange: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'Weet u zeker dat u de taken van ' + options.range.start + ' t/m ' + options.range.end;
              html += ' van ' + options.group + ' ' + options.name;
              html += ' wilt verwijderen?';
            }

            return html;
          },
          tasksDeleted: function (options)
          {
            if (!_.isUndefined(options))
            {
              var html = 'De taken van ' + options.range.start + ' t/m ' + options.range.end;
              html += ' van ' + options.group + ' ' + options.name;
              html += ' zijn verwijderd.';
            }

            return html;
          },
          noTasksFounded: 'Geen taken gevonden in de opgegeven range.',
          removeTasksTitle: 'Taken verwijderen',
          query: 'Er zijn wat problemen met het synchroniseren van de agenda. Kunt u alstublieft uw browser verversen om de laatste informatie op te halen.',
          pastAdding: 'Het is niet mogelijk in het verleden te plannen!',
          errorAdd: 'Fout opgetreden tijdens het toevoegen van een planning!',
          errorChange: 'Fout opgetreden tijdens het wijzigen van een planning!',
          pastChanging: 'Het wijzigen van een planning in het verleden is niet mogelijk!',
          pastDeleting: 'Het verwijderen van een planning in het verleden is niet mogelijk!',
          remove: 'Fout(en) met het verwijderen van de planning!',
          wisher: 'Fout(en) met het wijzigen van de behoefte',
          editTimeline: 'Wijzig de tijdlijn van ',
          notAuth: 'Het is niet mogelijk om iemands anders planning te wijzigen, behalve als de rol van coördinator. Als coördinator kan je de planning van andere wijzigen  door op hun naam te klikken in de lijst. Je wordt naar een andere pagina genavigeerd waar de planning van het betreffende lid is te wijzigen.',
          the: 'De',
          reachabilityChangedSentence: 'bereikbaarheid kan gewijzigd worden',
          byThe: 'door te',
          doubleClick: 'dubbelklikken op reeds bestaande blokken of ',
          byDragging: 'door te slepen',
          leftButtonMouse: 'met uw muis. Met de linkermuisknop en de',
          or: 'of',
          buttonPushed: 'knop tegelijkertijd ingedrukt.'
        },
        timeline: {
          removeReoccuring: "Verwijder",
          onlySingleReoccuringSlot: "Alleen deze bereikbaarheid",
          allReocurringSlots : "Alle herhaalde bereikbaarheid",
          removingSingleReoccuringSlot: "Er is een niet bereikbaar tijdslot toegevoegd op het tijdstip van het herhalende slot.",
          query: 'Fout bij het laden van de tijdlijndata. Vernieuw deze webpagina om het nogmaals te proberen.',
          pastAdding: 'Invoer van tijden in het verleden is niet toegestaan!',
          swappedStartEnd: 'De eindtijd is eerder dan de starttijd. Zijn de start- en eindtijd omgewisseld?',
          invalidTimeslot: 'Ongeldig tijdslot. De manier waarop de begin- of eindtijd en/of -datum zijn ingevuld zijn mogelijk incorrect.',
          add: 'Fout bij het toevoegen van een planning.',
          change: 'Fout bij het wijzigen van een planning.',
          pastChanging: 'Veranderen van planning in het verleden is niet toegestaan!',
          pastDeleting: 'Verwijderen van planning in het verleden is niet toegestaan!',
          remove: 'Fout bij het verwijderen van een planning.',
          wisher: 'Fout bij het wijzigen van de minimale bezetting.',
          notAuth: 'Het is niet toegestaan om wijzigingen in de agenda van anderen aan te brengen, tenzij u planner of beheerder bent. Als beheerder/planner kunt u de planning van anderen wijzigen door links van agendabalk de gebruikersnaam te selecteren. U krijgt dan de mogelijkheid om in een apart scherm de wijzigingen aan te brengen.'
        },
        required: {
          pastAdding: 'Het is niet toegestaan de minimale bezetting in het verleden in te stellen!',
          pastDeleting: 'Het is niet toegestaan de minimale bezetting in het verleden te verwijderen!',
          pastChanging: 'Het is niet toegestaan de minimale bezetting in het verleden in te wijzigen!',
          add: 'Toevoegen van minimale bezetting mislukt!',
          change: 'Wijzigen van minimale bezetting mislukt!',
          remove: 'Verwijderen van minimale bezetting mislukt!',
          emptyReq: 'Vul a.u.b. het gewenste aantal in.',
          invalidDate: 'De begin- of eindtijd en/of -datum zijn mogelijk ongeldig.',
          swappedDate: 'De eindtijd is eerder dan de starttijd. Zijn de start- en eindtijd omgewisseld?',
          invalidReq: 'Vul a.u.b. een geldige waarde in'
        },
        message: {
          title: 'CHAT',
          messagesLoaded: 'Berichten laden...',
          videoStartedBy: 'Video gesprek gestart door',
          messages: 'Berichten',
          composeAMessage: 'Bericht opstellen',
          compose: 'Opstellen',
          inbox: 'Inbox',
          outbox: 'Outbox',
          trash: 'Prullenbak',
          composeMessage: 'Bericht opstellen',
          close: 'Sluiten',
          broadcast: 'Extra medium',
          sms: 'SMS',
          email: 'Email',
          receviers: 'Ontvanger(s)',
          webTRCWebLink: 'Een video conferentie is geopend; doe mee! ',
          // troubled
          // chooseRecept: 'Ontvanger(s) selecteren',
          //
          subject: 'Onderwerp',
          message: 'Bericht',
          sendMessage: 'Bericht versturen',
          sender: 'Zender',
          date: 'Datum',
          questionText: 'Bericht',
          reply: 'Antwoorden',
          del: 'Verwijderen',
          noMessage: 'Er zijn geen berichten.',
          from: 'Van',
          newMsg: 'Nieuw',
          deleteSelected: 'Verwijder geselecteerde berichten',
          someMessage: 'Er zijn $v berichten',
          emptyTrash: 'Prullenbak legen',
          noMsgInTrash: 'Er zijn geen berichten.',
          box: 'Box',
          persons: 'Personen',
          restoreSelected: 'Geselecteerde berichten terugplaatsen',
          loadingMessage: 'Bericht laden...',
          escalation: 'Escalatiebericht',
          reportMessage: 'Nieuw rapport van',
          escalationBody: function (diff, startDate, startTime, endDate, endTime)
          {
            return 'Er is een tekort van ' +
              diff +
              ' mensen tussen ' +
              startDate + ' ' +
              startTime + ' en ' +
              endDate + ' ' +
              endTime + '. ' +
              'Zet uzelf a.u.b. op bereikbaar indien u bereikbaar bent voor die periode';
          },
          removed: 'Bericht succesvol verwijderd.',
          removing: 'Bericht verwijderen...',
          refreshing: 'Bericht vernieuwen...',
          removingSelected: 'Geselecteerde berichten verwijderen...',
          restoring: 'Bericht terugplaatsen...',
          restored: 'Bericht succesvol teruggeplaatst.',
          restoringSelected: 'Geselecteerde berichten terugplaatsen...',
          emptying: 'Prullenbak leegmaken...',
          emptied: 'Prullenbak succesvol geleegd.',
          sending: 'Bericht versturen...',
          sent: 'Bericht verstuurd.',
          typeSubject: 'Vul een onderwerp in.',
          // messages: 'Berichten',
          ph_filterMessage: 'Berichten filteren...',
          noReceivers: 'Selecteer een ontvanger',
          emptyMessageBody: 'Het bericht is leeg, typ a.u.b. een bericht.',
          send: 'Versturen'
        },
        groups: {
          amountMembers: function (amountMembers)
          {
            return (amountMembers == 1)
              ? "Er is " + amountMembers + " lid."
              : "Er zijn " + amountMembers + " leden.";
          },
          changeMemberShip: 'Lidmaatschap wijzigen',
          doYou: 'Wilt u ',
          memberOfATeam: 'lid maken van team ',
          personPartOfTeams: 'Deze persoon zal deel uitmaken van de volgende teams ',
          replace: 'Verplaatsen',
          personPartOfTeam: 'Deze persoon zal alleen deel uit maken van team ',
          deleteTeamError: 'Het verwijderen van het team is mislukt',
          groups: 'Groepen',
          newGroup: 'Nieuwe groep',
          newMember: 'Nieuw teamlid',
          serach: 'Zoeken',
          addNewGroup: 'Nieuwe groep toevoegen',
          editGroup: 'Groep wijzigen',
          searchResults: 'Zoekresultaten',
          group: 'Groep',
          close: 'Sluiten',
          name: 'Naam',
          saveGroup: 'Groep opslaan',
          registerMember: 'Lid registreren',
          role: 'Functie',
          selectRole: 'Selecteer een functie',
          // troubled
          // selectGroup: 'Selecteer een group',
          //
          email: 'Email',
          phone: 'Telefoon',
          address: 'Adres',
          postCode: 'Postcode',
          tel: 'Telefoonnummer',
          city: 'Woonplaats',
          userName: 'Gebruikersnaam',
          password: 'Wachtwoord',
          saveMember: 'Lid opslaan',
          serachFor: 'Zoekresultaten voor ',
          sorryCanNotFind: 'Sorry, geen resultaten.',
          addToGroup: 'Aan groep toevoegen',
          addMemberToGroup: 'Voeg geselecteerde leden aan groep toe',
          resultCount: 'Er zijn $v resultaten.',
          deleteGroup: 'Groep verwijderen',
          noMembers: 'Er zijn geen leden.',
          removeSelectedMembers: 'Geselecteerde leden verwijderen',
          memberCount: 'Er zijn $v leden.',
          searchingMembers: 'Teamleden zoeken...',
          addingNewMember: 'Nieuw lid toevoegen...',
          memberAdded: 'Lid succesvol aan groep toegevoegd.',
          refreshingGroupMember: 'Groepen- en ledenlijst vernieuwen...',
          removingMember: 'Lid uit groep verwijderen...',
          memberRemoved: 'Lid succesvol uit groep verwijderd.',
          removingSelected: 'Geselecteerde leden verwijderen...',
          saving: 'Groep opslaan...',
          groupSaved: 'Groep succesvol opgeslagen.',
          registerNew: 'Nieuw lid registreren...',
          memberRegstered: 'Lid succesvol geregistreerd.',
          deleting: 'Groep verwijderen...',
          deleted: 'Groep succesvol verwijderd.',
          filterMembers: 'Teamleden filteren...',
          searchfor: 'voornaam, achternaam..'
        },
        profile: {
          noTeamSelected: 'Geen team geselecteerd',
          extra: 'Extra',
          default: 'Standaard',
          back: 'Terug',
          profile: 'Profiel',
          edit: 'Wijzigen',
          password: 'Wachtwoord',
          timeline: 'Tijdlijn',
          profileView: 'Profiel weergave',
          userGroups: 'Gebruikersgroepen',
          role: 'Functie',
          email: 'E-mail',
          phone: 'Telefoon',
          address: 'Adres',
          postcode: 'Postcode',
          city: 'Woonplaats',
          editProfile: 'Profiel wijzigen',
          name: 'Naam',
          saveProfile: 'Profiel opslaan',
          passChange: 'Wachtwoord wijzigen',
          currentPass: 'Huidig wachtwoord',
          newPass: 'Nieuw wachtwoord',
          newPassRepeat: 'Herhaal nieuw wachtwoord',

          changePass: 'Wachtwoord wijzigen',
          forgotPassword: 'Wachtwoord vergeten',
          forgotPassInfo: 'Verstuur uw gebruikersnaam',
          forgotPassInfoSend: 'Als de gebruiker bestaat en een e-mailadres heeft, is een e-mail naar de gebruiker verstuurd met instructies om het wachtwoord te wijzigen.',
          keyUsernameWrong: 'De combinatie van de opgegeven sleutel en gebruikersnaam klopt niet',

          newAvail: 'Nieuwe bereikbaarheid',
          userName: 'Gebruikersnaam',
          pincode: 'teamlidcode',
          // saveProfile: 'Profielinformatie opslaan...',
          refreshing: 'Profielinformatie vernieuwen...',
          dataChanged: 'Profielgegevens succesvol gewijzigd.',
          savingPassword: 'Nieuw wachtwoord opslaan...',
          passwordChanged: 'Het wachtwoord is succesvol gewijzigd.',
          passwordSavedFailed: 'Er is iets mis gegaan bij het updaten van het wachtwoord.',
          pleaseFill: 'Alle velden dienen valide ingevuld te worden!',
          passNotMatch: 'Het nieuwe wachtwoord en de herhaling komen niet overeen.',
          changingPass: 'Wachtwoord wijzigen...',
          passChanged: 'Wachtwoord succesvol gewijzigd',
          passwrong: 'Ingevoerd wachtwoord is foutief! Probeer het opnieuw.',
          currentPassWrong: 'Het ingevulde oude wachtwoord komt niet overeen met het huidige! Probeer opnieuw.',
          passRecover: 'Verzenden',
          newTimeslotAdded: 'Nieuw tijdslot succesvol toegevoegd.',
          changingTimeslot: 'Tijdslot wijzigen...',
          timeslotChanged: 'Tijdslot succesvol gewijzigd.',
          exampleBirthDate: 'Bijvoorbeeld: 01-01-2001',
          firstName: 'Voornaam',
          lastName: 'Achternaam',
          editProfileImg: 'Profielfoto wijzigen',
          profileImgSuccessfullyUploaded: 'De profielfoto is succesvol geüpload.',
          loadUploadURL: 'Foto upload URL laden',
          click2upload: 'Klik hier om te uploaden',
          birthday: 'Geboortedatum',
          username: 'Gebruikersnaam',
          retypePassword: 'Herhaal wachtwoord',
          roleChangePrompt: 'Je verandert je eigen rol. Het systeem zal hierdoor automatisch uitloggen. Druk op "Ok" om verder te gaan.',//'You changed your own role, system will automatically logout, press "Yes" to continue.',
          specifyTeam: 'Selecteer een team voor deze gebruiker.',//'You need to sepcify a team to this user'
          authorInfo: 'Auteursinfo laden...',
          changePassWord: 'Wachtwoord wijzigen',
          safePassword: 'Wachtwoord opslaan',
          oldPassword: 'Oud wachtwoord',
          pincode: 'Teamlidcode',
          pincodeInUse: 'Deze teamlidcode is in gebruik. Kies een andere.',
          pincodeNotValid: 'Vul a.u.b. een geldige teamlidcode van maximaal 8 cijfers in!',
          pincodeCorrect: 'Deze teamlidcode is in gebruik of niet geldig! Vul a.u.b. een geldige teamlidcode.',
          pincodeInfo: 'Bovenstaande code kunt u telefonisch gebruiken om u aan te melden als TeamTelefoon uw nummer niet herkent.',
          duplicateNumber: 'Nummer bestaat al. Voer a.u.b. een ander nummber in.',
          pincodeInfoPhone: 'De laatste vier cijfers van dit telefoonnummer worden gebruikt voor de teamlidcode, tenzij deze zelf wordt opgegeven.'
        },
        settings: {
          settings: 'Instellingen',
          user: 'Gebruiker',
          application: 'Applicatie',
          userSettings: 'Gebruikersinstellingen',
          appSettings: 'Applicatie-instellingen',
          saveSettings: 'Instellingen opslaan',
          langSetting: 'Taal',
          saving: 'Instellingen wijzigen...',
          refreshing: 'Instellingen vernieuwen...',
          saved: 'Instellingen succesvol gewijzigd.'
        },
        help: {
          header: 'Hulp & Ondersteuning',
          support: 'Ondersteuning',
          teamTelephone: {
            setReachabilityPhone: 'Hoe geef ik telefonisch mijn bereikbaarheid door?',
            setReachabilityWeb: 'Hoe wijzig ik mijn bereikbaarheid in de web applicatie?',
            changeReachabilityTeamMember: 'Hoe wijzig ik de bereikbaarheid van een teamlid?',
            changeCallOrderTeam: 'Hoe wijzig ik de belvolgorde van mijn team?',
            changeCallOptions: 'Hoe wijzig ik de bel-instellingen van mijn team?'
          },
          teams: {
            addNewMember: 'Hoe voeg ik een nieuw lid toe aan mijn team?',
            addExistingMember: 'Hoe voeg ik een bestaand lid toe aan mijn team?',
            removeMember: 'Hoe verwijder ik een lid uit mijn team?'
          },
          web: {
            title: 'Web applicatie',
            newMember: 'Hoe kan ik een nieuwe patiënt te creëren?'
          },
          manuelTeamTelephone: {
            title: 'Handleiding TeamTelefoon',
            download: 'Handleiding downloaden',
          },
          android: {
            title: 'Android',
            addClientReport: 'Hoe voeg ik een cliënt rapport toe?',
            callClient: 'Hoe werkt het als ik een cliënt wil bellen',
          }
        },
        downloads: {
          app: 'Binnenkort te downloaden.',
          manual: 'Download handleiding'
        },
        loading: {
          general: 'Laden',
          manage: 'beheren',
          dashboard: 'dashboard',
          planboard: 'agenda',
          messages: 'berichten',
          teams: 'teams',
          profile: 'profiel',
          settings: 'instellingen'
        },
        teamup: {
          noBackends: 'Inloggen is tijdelijk niet beschikbaar',
          finished: 'Afgerond',
          missed: 'Gemist',
          teamMembers: 'Teamleden',
          unknownAddress: 'Adres onbekend',
          and: ' en ',
          somethingUpdated: function(errors) {
            return (errors.length > 1) ? ' zijn niet geupdate' : ' is niet geupdate';
          },
          amountReports: function (amountReports)
          {
            return (amountReports == 1)
              ? "Er is " + amountReports + " rapport."
              : "Er zijn " + amountReports + " rapporten.";
          },
          amountContacts: function(amountContacts)
          {
            return (amountContacts == 1)
              ? "Er is " + amountContacts + " contactpersoon."
              : "Er zijn " + amountContacts + " contactpersonen.";
          },
          removingTeamWithTasks: "Er staan nog taken in de planning voor het te verwijderen team, verwijder deze eerst!",
          minimumOneMember: "Minimaal één teamlid moet toegevoegd worden",
          newNumberOf: "is het nieuwe nummer van ",
          newTeamTelefoonTeam: "Nieuw TeamTelefoon team",
          syncSucces: 'De teaminformatie wordt nu gesynchroniseerd.',
          syncError: 'Het synchroniseren van teaminformatie is mislukt.',
          notFound: 'Niet gevonden',
          clientGroup: 'Cliëntgroep',
          client: 'Cliënt',
          extraInfo: 'Extra info',
          coordinator: 'Coördinator',
          teamMember: 'Teamlid',
          teamMembers: 'Teamleden',
          apply: 'Bevestigen',
          help: "Help",
          't/m': 't/m',
          'new': 'Nieuw',
          'existing': 'Bestaand',
          teams: 'Teams',
          selectTeam: 'Selecteer team',
          hour: 'uur',
          clients: 'Cliënten',
          title404: 'Oeps',
          header404: 'Sorry, de pagina kan niet gevonden worden',
          content404: 'Het lijkt erop dat deze pagina niet (meer) bestaat of misschien verhuisd is.',
          order: 'Volgorde',
          logs: 'Logs',
          options: 'Instellingen',
          selectClientGroup: 'Selecteer een cliëntgroep',
          loadMembersByName: 'Leden laden...',
          loadingMembers: 'Leden zoeken...',
          howToSearchMembers: 'Zoek leden bij voor- en/of achternaam.',
          selectClientGroup: 'Selecteer een cliëntgroep',
          manage: 'Beheren',
          teamTelephone: 'TeamTelefoon',
          chooseTeam: 'Selecteer een team',
          undefinedTeamMember: 'Onbekend teamlid',
          defaultTeam: 'Standaard team',
          edit: 'Bewerk',
          editTeam: 'Bewerk team',
          team: 'Team',
          del: 'Verwijder',
          seconds: "seconden",
          noMembers: 'Geen leden in dit team.',
          newTeam: 'Nieuw team',
          teamName: 'Teamnaam',
          createTeam: 'Opslaan',
          teamNameExistTitle: 'Teamnaam bestaat al',
          teamNameExistContent: 'Weet u zeker dat u een team wilt aanmaken met een naam die al vaker voorkomt?',
          newMember: 'Nieuw teamlid',
          searchMember: 'Zoek teamlid',
          noMembersFound: 'Geen leden gevonden met de opgegeven zoekterm.',
          name: 'Naam',
          role: 'Rol',
          phone: 'Telefoon',
          street: 'Straat',
          postCode: 'Postcode',
          city: 'Woonplaats',
          email: 'E-mail',
          saveMember: 'Opslaan',
          state: 'Status',
          states: 'Status',
          saveTeam: 'Team opslaan',
          save: 'Opslaan',
          //start TODO
          backEndUnavailable: "De back-end is tijdelijk buiten gebruik, probeer opnieuw in te loggen. Als het probleem blijft voorkomen, neem dan contact op met uw systeembeheerder.",
          noBackend: function(email)
          {
            var text = "Het is niet gelukt om verbinding te maken met de server.<br />"
            text += "Als u problemen blijft ervaren, kunt u een  <a href='mailto:" + email;
            text += "?subject=Melding van een probleem met TeamUp / TeamTelefoon";
            text += "&body=Beste%20support%2C%0A%0AHelaas%20ervaar%20ik%20problemen%20met%20TeamTelefoon.";
            text += "%20Ik%20krijg%20de%20melding%20%u201CHet%20is%20niet%20gelukt%20om%20verbinding";
            text += "%20te%20maken%20met%20de%20server.%u201D%0A%0AKunt%20u%20mij%20hiermee%20helpen";
            text += "%3F%0A%0AMet%20vriendelijke%20groet%2C%0A%0A%5Buw%20naam";
            text += "%5D%0A%5Buw%20team%5D%0A%5Buw%20organisatie%5D%20";
            text += "'>email</a> sturen naar onze support afdeling."

            return text;
          },
          statusCodeNotRegonized: "Status-code is niet bekend.",
          //end
          refreshing: 'Teaminformatie opnieuw ophalen',
          dataChanged: 'Data is veranderd.',
          teamSubmitError: 'Fouten tijdens het aanmaken: ',
          queryTeamError: 'Fouten tijdens het opzoeken van de teams.',
          teamNamePrompt1: 'Vul een teamnaam in.',
          teamNamePrompt2: 'Voeg contactdata toe a.u.b.',
          cancel: 'Annuleren',
          chooseRole: 'Kies een rol',
          func: 'Functie',
          chooseFunction: 'Kies een functie',
          newClientGroup: 'Nieuwe groep',
          newClient: 'Nieuwe cliënt',
          reports: 'Rapporten',
          report: 'Rapport',
          noClients: 'Geen cliënten in deze groep',
          noClientGroup: 'Geen cliëntgroep',
          noClientGroupFound: 'Geen cliëntgroep gevonden voor dit team',
          TeamClients: 'TEAMS - CLIËNTEN',
          createClientGroup: 'Opslaan',
          contacts: 'Contacten',
          Number: 'Nummer',
          clientProfileUrl: 'URL Cliëntenprofiel',
          addContact: 'Contactpersoon toevoegen',
          editContact: 'Contactpersoon wijzigen',
          saveClient: 'Opslaan',
          group: 'Groep',
          errorSaveClientGroup: 'Opslaan wijzigingen cliëntengroep mislukt.',
          noContacts: 'Er zijn geen contactpersonen gedefinieerd.',
          noReports: 'Er zijn geen rapporten voor deze cliënt.',
          contactCount: 'Er zijn $v contactpersonen.',
          reportCount: 'Er zijn $v rapporten.',
          accountInfoFill: 'Vul uw accountinformatie in a.u.b.',
          passNotSame: 'Wachtwoorden zijn niet hetzelfde',
          savingMember: 'Lid aan het opslaan...',
          selectTeams: 'Selecteer team(s)',
          selectTeam: 'Selecteer een team',
          clinetInfoFill: 'Vul de cliëntinformatie (naam en telefoon) in a.u.b.',
          savingClient: 'Cliënt aan het opslaan...',
          clientSubmitError: 'Fouten bij het aanmaken van een nieuwe cliënt.',
          clientGroups: 'Cliëntengroepen',
          saveClientGroup: 'Opslaan cliëntgroep...',
          deleteClientFromClientGroup: 'Cliënt is verwijderd',
          deletingClientFromClientGroup: 'Cliënt uit groep verwijderen...',
          teams_Cap: 'Teams',
          noTeamNameFound: 'Teamnaam onbekend',
          noTeam: 'Geen team',
          searchMembers: 'Zoek leden...',
          editClient: 'Bewerk cliënt',
          loadingNumber: 'Teamtelefoonnummer aan het laden...',
          loadClients: 'Cliënten laden...',
          birthdayError: 'Fout in de geboortedatum.',
          map: 'kaart',
          saveContacts: 'Contactpersonen opslaan',
          loadingReports: 'Rapporten laden',
          reportEmpty: 'Voer een valide titel en beschrijving in!',
          reportValid: 'De invoervelden zijn niet valide!',
          reportBody: 'Beschrijving',
          reportBodyRequired: 'Vul een beschrijving in!',
          reportTitleRequired: 'Vul een titel in!',
          reportBodyMinChars: 'De beschrijving moet uit minimaal 8 karakters bestaan!',
          reportTitleMinChars: 'De beschrijving moet uit minimaal 4 karakters bestaan!',
          reportBodyMaxChars: 'De beschrijving mag maximaal 150 karakters bestaan!',
          reportTitleMaxChars: 'De titel kan uit maximaal 30 karakters bestaan!',
          checkLocalStorage: 'In deze webbrowser is de privé-modus ingeschakeld. Dit wordt niet ondersteund. Hier vindt u informatie over hoe u de privé-modus kunt uitschakelen:',
          readMore: 'Lees meer',
          date: 'Datum',
          datetime: 'Datum en tijd',
          writenBy: 'Geschreven door',
          noSharedStates: 'Geen gedeelde status',
          savingContacts: 'Contactpersonen opslaan',
          // delClientGroupConfirm: 'Weet u zeker dat u deze cliëntengroep wilt verwijderen? Het kan even duren.',
          // delTeamConfirm: 'Weet u zeker dat u dit team wilt verwijderen? Het kan even duren.',
          deletingClientGroup: 'Groep verwijderen... ',
          from: 'Van',
          to: 'Tot',
          time: 'Tijd',
          duration: 'Duur',
          coordinatorNoTeam: 'Het lijkt erop dat je niet in een team zit. Wijs jezelf toe aan een team.',
          teamMemberNoTeam: 'Het lijkt erop dat je niet in een team zit. Neem contact op met een coordinator.',
          //deleteConfirm: 'Druk op OK om door te gaan.',
          confirms: {
            deleteClientTitle: 'Verwijder cliënt',
            deleteClient: 'Weet u zeker dat u de cliënt wilt verwijderen?',
            deleteClientFromTeamTitle: 'Verwijder cliënt uit de groep',
            deleteClientFromTeam: 'Weet u zeker dat u de cliënt uit zijn groep wilt verwijderen?',
            deleteReportTitle: 'Verwijder rapport',
            deleteReport: 'Weet u zeker dat u het rapport wilt verwijderen?',
            deleteProfileTitle: 'Verwijder profile',
            deleteProfile: 'Weet u zeker dat u het profiel wilt verwijderen?',
            deleteMemberFromTeamTitle: 'Verwijder het lid uit alle teams',
            deleteMemberFromTeam: 'Weet u zeker dat u het lid uit alle teams wilt verwijderen? Let op: iemand die niet in een team zit, kan TeamUp niet gebruiken. ',
            deleteMemberTitle: 'Verwijderen teamlid',
            deleteMember: 'Weet u zeker dat u het teamlid van het team wil verwijderen?',
            deleteClientGroupTitle: 'Verwijder cliëntengroep',
            deleteClientGroup: 'Weet u zeker dat u deze cliëntengroep wilt verwijderen? Het kan even duren.',
            deleteTeamTitle: 'Verwijderen team',
            deleteTeam: 'Weet u zeker dat u dit team wilt verwijderen? Het kan even duren.',
            deleteTaskTitle: 'Verwijderen taak',
            deleteTask: 'Weet u zeker dat u de taak wilt verwijderen?',
            deleteContactTitle: 'Verwijder contact',
            deleteContact: 'Weet u zeker dat u het contact wilt verwijderen?',
            remove: 'Verwijderen',
            addTeamMemberCodeAsPhoneTitle: 'Teamlidcode wijzigen',
            addTeamMemberCodeAsPhone: 'Er is een eigen teamlidcode ingevoerd, die niet overeen komt met de laatste vier cijfers van uw standaard telefoonnummer?',
            photoRemoveTitle: 'Profielfoto verwijderen',
            photoRemoveBody: 'Weet u zeker dat u de profielfoto wilt verwijderen?',
            yes: 'Ja, dat wil ik',
            no: 'Nee, annuleren',
            cancel: 'Annuleren',
            day: {
              sunday: 'zondag',
              monday: 'maandag',
              tuesday: 'donderdag',
              wednesday: 'woensdag',
              thursday: 'donderdag',
              friday: 'vrijdag',
              saturday: 'zaterdag'
            },
            shortDay: {
              su: "zo",
              mo: "ma",
              tu: "di",
              we: "wo",
              th: "do",
              fr: "vr",
              sa: "za"
            }
          },
          deletingTeam: 'Team verwijderen...',
          deletingMember: 'Lid verwijderen ...',
          deletingClient: 'Cliënt verwijderen ...',
          noMessages: 'Er zijn geen berichten.',
          newReport: 'Nieuw rapport',
          editReport: 'Wijzig rapport',
          selectClient: 'Selecteer een cliënt',
          selectMember: 'Selecteer een lid',
          selectMonth: 'Selecteer een maand',
          saveReport: 'Rapport opslaan',
          reportTitle: 'Titel',
          selectSlot: 'Selecteer een periode',
          editClientImg: 'Wijzig foto van de cliënt',
          newTask: 'Nieuwe taak',
          updateTask: 'Wijzig taak',
          managePanelchangePrompt: 'Data is gewijzigd. Klik op \'OK\' om door te gaan, \'Annuleren\' om te blijven.',
          pagePrevious: 'Vorige',
          pageNext: 'Volgende',
          pageFirst: 'Eerste',
          pageLast: 'Laatste',
          refresh: 'Verversen',
          stateValue: {
            'reachable': 'Beschikbaar',
            'available': 'Bereikbaar',
            'working': 'Aan het werk',
            'offline': 'Offline',
            'alert': 'Achterwacht',
            'on_the_phone': 'Aan de telefoon',
            'unknown': 'Onbekend',
            'secondline': 'Achterwacht',
            'possibly_reachable': 'Niet gepland',
            'unreachable': 'Niet beschikbaar',
            'unavailable': 'Niet bereikbaar',
            'unknown': 'Offline'
          },
          reportNotExists: 'Rapport bestaat niet.',
          sessionTimeout: 'Uw sessie is verlopen. Graag nogmaals inloggen.',
          menu: 'Menu',
          error: {
            support: 'Neem contact op met de support van  TeamUp / TeamTelefoon'
          },
          errorCode: {
            '1': 'Er heeft zich een foutmelding voorgedaan, waardoor de opgevraagde data helaas niet geladen kon worden. ',
            '2': 'De Domeinagent is niet gevonden. Opnieuw inloggen zou dit probleem op kunnen lossen.',
            '3': 'Dit lid moet de rol van coördinator hebben, voordat er een team aangemaakt kan worden',
            '4': 'Eeen agent id mag alleen uit alfanummerieke karakters, onder- en streepjes bestaan',
            '5': 'Kan de JSON body niet parsen',
            '6': 'Een of meerdere parameters missen',
            '7': 'De groep "members" is niet gevonden',
            '8': 'Team met het gegeven teamUuid bestaat niet',
            '9': 'Dit lid maakt geen deel uit van het team',
            '10': 'Team met het gegeven teamUuid bestaat niet',
            '11': 'Dit lid moet de rol van coördinator hebben, voordat er een nieuw team aangemaakt kan worden',
            '12': 'De team agent kon niet aangemaakt worden',
            '13': 'De uuid parameter en het uuid in de payload komen niet overheen',
            '14': 'De gebruikersnaam is al in gebruik',
            '15': 'Een van de meegestuurde waardes is onbekend',
            '16': 'Een van de volgende settings heeft als waarde null, Dit is niet mogelijk',
            '17': 'Een van de meegestuurde waardes heeft een onbekend type',
            '18': 'De gebruiker met het opgegeven id bestaat niet',
            '19': 'Het ingevoerde oude wachtwoord komt niet overheen met het huidige',
            '20': 'Dit lid moet de rol van coördinator hebben, voordat er een wachtwoord van een ander lid gewijzigd kan worden',
            '21': 'Een parameter kan niet geparsed worden',
            '22': 'Dit lid is in geen enkel team',
            '23': 'Een of meerdere attributen worden gemist',
            '24': 'Er is iets niet goed geconfigureerd, waardoor AskFast niet kan worden bereikt',
            '25': 'Het telefoonnummer is reeds in gebruik',
            '26': 'Een van de condities om TeamTelefoon te activeren is niet gelukt',
            '27': 'Het scenario kon niet aangemaakt worden voor dit team',
            '28': 'AskFast foutmelding',
            '29': 'Een voicemail groep kon niet aangemaakt worden',
            '30': 'Een item in de TeamTelephone configuratie kon niet beschreven worden',
            '31': 'TeamTelefoon is al geactiveerd voor dit team',
            '32': 'Agent niet gevonden',
            '33': 'Geen templates gevonden in de ScenarioTemplateAgent',
            '34': 'Kon het scenario niet genereren',
            '36': 'Een niet verwachte parameter "type"',
            '39': 'De link om uw wachtwoord opnieuw in te stellen is niet meer geldig.'
          }
        },
        options: {
          title: 'Instellingen ',
          teamEmail: 'E-mail van het team',
          activateTeamTelephone: "Activeer TeamTelefoon voor ",
          phoneNumberAlias: 'Telefoonnummer alias',
          teamTelephoneNotActivated: "TeamTelefoon is niet geactiveerd voor dit team",
          smsMissedCall: 'SMS bij een gemist gesprek of nieuwe voicemail',
          receiveReachableMembers: 'Bereikbare teamleden ontvangen',
          missedOrVoicemail: 'SMS als het team een gesprek heeft gemist of als er een voicemail is ingesproken',
          noPhoneNumbers: "Er zijn geen telefoonnummers vrij",
          pickAPhoneNumber: "Kies een telefoonnummer",
          durationDialTone: 'Geef de duur van de kiestoon aan!',
          dialToneNumber: "De duur van de kiestoon kan alleen een nummer zijn!",
          phoneNumberTeam: "Telefoonnummer van het team",
          phoneNumberTeamDescription: "Kies één van de volgende telefoonnummers waarop het team bereikbaar zal zijn.",
          phoneNumberTeamAlias: "Publiek bekend telefoonnummer",
          phoneNumberTeamAliasDescription: "Dit veld is optioneel. Hier kan het telefoonnummer worden ingevuld dat bij de cliënten bekend is. Bijvoorbeeld het 06-nummer van de huidige doorgeef-telefoon.",
          voicemailEmailAddress: "Voicemail e-mailadres",
          voicemailEmailAddressDescription: "Naar dit e-mailadres wordt een email gestuurd als er een voicemail is achtergelaten voor het team en als het team een gemist gesprek heeft.",
          requiredFields: "verplichte velden",
          hasSms: function (sms)
          {
            return (sms)
              ? 'een'
              : 'geen';
          },
          on: 'Aan',
          off: 'Uit',
          ringingTimeOut: {
            title: 'Rinkeltijd',
            short: 'Bij een langere rinkeltijd hebben teamleden meer tijd om op te nemen, maar de totale wachttijd voor cliënten kan langer zijn als er veel teamleden zijn aangemeld.',
            long: 'Bij een rinkeltijd van meer dan 15 seconden is het aanbevolen dat alle teamleden hun persoonlijke voicemail uitschakelen.',
          },
          useExternalId: {
            title: 'Telefoonnummer van de beller',
            info: 'Als deze optie is ingeschakeld en u wordt gebeld via TeamTelefoon, dan ziet u op het scherm van uw telefoon het telefoonnummer van de beller. Als deze instelling is uitgeschakeld, dan ziet u op het scherm het telefoonnummer van het team.'
          },
          personalVoicemailPrevention: 'Persoonlijke voicemailpreventie',
          personalVoicemailPreventionInfo: 'Als deze optie is ingeschakeld, krijgen teamleden eerst de vraag of ze het gesprek willen aannemen van een cli&euml;nt. Door deze optie aan te zetten, kan worden voorkomen dat een cli&euml;nt wordt doorverbonden met de persoonlijke voicemail van een teamlid.',
          voicemailDetectionInfo: 'Bij een rinkeltijd van meer dan 15 seconden is het aanbevolen dat alle teamleden hun persoonlijke voicemail uitschakelen of om gebruik te maken van de persoonlijke voicemailpreventie. Het uitzetten van de persoonlijke voicemail (van de werktelefoon) kunt u regelen bij de telefoonprovider.'
        },
        task: {
          timeframe: 'Tijdsbestek',
          status: 'Status',
          description: 'Beschrijving',
          createdBy: 'Gemaakt door',
          name: 'Naam',
          hasToload: ' aan het laden..',
          showArchivedTasks: 'Toon gearchiveerde taken',
          showOnlyNotAssignedTasks: 'Toon alleen niet toegewezen taken',
          member: 'Lid',
          thereAreAmountTasks: function (amountTasks)
          {
            return (amountTasks == 1)
              ? "Er is " + amountTasks + " taak."
              : "Er zijn " + amountTasks + " taken.";
          },
          carer: 'Verzorger',
          information: 'Informatie',
          noTasks: 'Geen actieve of geplande taken',
          clientName: 'Cliënt ',
          memberName: 'Lid',
          orderType1: 'Standaard volgorde',
          orderType2: 'Tijd',
          tasks: 'Taken',
          myTask: 'Mijn taken',
          newTask: 'Nieuwe Taak',
          orderby: 'Sorteer op',
          allTasks: 'Alle taken',
          description: 'Opmerkingen',
          filltheTime: 'Vul de start- en eindtijd in voor de taak.',
          startTimeEmpty: 'Vul de startdatum en -tijd in.',
          endTimeEmpty: 'Vul de einddatum en -tijd in.',
          planTaskInFuture: 'U kunt geen taak in het verleden aanmaken. Selecteer een start- en eindtijd in de toekomst.',
          startLaterThanEnd: 'Begintijd moet eerder zijn dan de eindtijd.',
          specifyClient: 'Selecteer een cliënt voor deze taak.',
          creatingTask: 'Taak wordt aangemaakt',
          editingTask: 'Taak wordt gewijzigd',
          taskSaved: 'Taak is opgeslagen.',
          noArchivedTask: 'Geen gearchiveerde taken gevonden.',
          deleteTaskConfirm: 'Weet u zeker dat u deze taak permanent wilt verwijderen?',
          taskDeleted: 'Taak verwijderd.',
          planningTime: 'Tijdsbestek',
          refreshTask: 'Het herladen van de taken',
          upload: 'Upload taken',
          deleteTasksConfirm: 'Weet u zeker dat u deze taken permanent wilt verwijderen?',
          taskDescriptionMinChars: 'Opmerkingen moeten uit minimaal 8 karakters bestaan.',
          taskDescriptionMaxChars: 'Het maximaal aantal karakters voor opmerkingen is 500.',
          taskFormValide: 'De nieuwe taak is niet valide! Ga de eisen onder elk veld na.'
        },
        order: {
          randomOrder: 'Willekeurige',
          fixedOrder: 'Eigen volgorde',
          fixedOrderFeedback: 'Met deze optie kan het team zelf de volgorde bepalen.',
          evenOrder: 'Langst niet gebeld',
          confirmation: 'Bevestig Keuze',
          randomFeedback: 'Met deze optie wordt een beller altijd doorverbonden naar een willekeurig teamlid.',
          evenOrderFeedback: "Met deze optie wordt een beller doorverbonden met het teamlid waar het langst geleden naar toe is gebeld.",
          loadTeam: 'Team laden...',
          orderSaved: 'Volgorde opgeslagen',
          noMembers: 'Er zijn geen leden in dit team.'
        },
        upload: {
          chooseFile: 'Bestand kiezen',
          processFile: 'Bestand verwerken',
          choiceWeek: 'Week kiezen',
          processSheet: 'Sheet verwerken',
          checkRoutes: 'routes controleren',
          dragSpreadSheet: 'Sleep een spreadsheet (XLSX, XLSM of XLSB) hier naar toe',
          checkRoutes: 'Routes controleren',
          continue: 'Verder gaan',
          checkNames: 'Names controleren',
          passed: 'gelukt',
          failed: 'gefaald',
          busy: 'bezig',
          open: 'open',
          uploadSpreadSheet: 'spreadsheet uploaden...',
          nobody: 'Niemand',
          createTasks: 'Taken aanmaken',
          followingTasksNotUploaded: 'De volgende taken konden niet geüpload worden',
          morning: "ochtend",
          noon: "namiddag",
          evening: "avond",
          afternoon: "middag",
          night: "nacht",
          importedFromASpreadSheet: 'Geïmporteerd vanuit een spreadsheet',
          expectationTime: function (cellName)
          {
            return "Er is een ja/nee waarde gevonden in cel " + cellName + ", terwijl er een tijdstip werd verwacht.";
          },
          expectationClientName: function (cellName)
          {
            return "Er is een ja/nee waarde gevonden in cel " + cellName + ", terwijl er een cliëntnaam werd verwacht.";
          },
          expectationMinutes: function (cellName)
          {
            return "Er is een ja/nee waarde gevonden in cel " + cellName + ", terwijl er een aantal minuten werd verwacht.";
          },
          foundIntNeedString: "Er is een fout gevonden in cel ",
          readError: function (cellName)
          {
            return "Het is niet mogelijk om het tijdstip in cel " + cellName + " te lezen.";
          },
          nofUnassignedRoutes: function (nofUnassignedRoutes)
          {
            return "Er zijn " + nofUnassignedRoutes + " routes waaraan nog geen teamlid is toegekend.";
          },
          unknownError: "Er is een onbekende fout opgetreden: ",
          errors: 'Fouten'
        },
        logs: {
          loadLogs: 'Logs laden...',
          empty: 'Er zijn geen logs',
          filter: 'Filter logs...',
          to: 'Naar',
          amountLogs: function (amount)
          {
            if (amount == 1)
            {
              return 'Er is ' + amount + ' log getoond.';
            }
            else
            {
              return 'Er zijn ' + amount + ' logs getoond.';
            }
          },
          status: {
            sent: 'Uitgaand',
            received: 'Inkomend',
            finished: 'Afgerond',
            missed: 'Gemist',
            delivered: 'Ontvangen',
            error: 'Fout'
          }
        },
        validation: {
          data: "Een of meerdere velden zijn niet ingevuld",
          default: {
              required: function (fieldName)
              {
                return 'Een ' + fieldName.toLowerCase() + ' is verplicht';
              },
              minLength: function (fieldName)
              {
                return 'De ' + fieldName.toLowerCase() + ' heeft te weinig karakters';
              },
              maxLength: function (fieldName)
              {
                return 'De ' + fieldName.toLowerCase() + ' heeft teveel karakters';
              },
            regularPunctuation: "Alleen reguliere interpunctie is toegestaan, zoals -_,!@#$%^&*()"
          },
          phone: {
            notValid: 'Voer een valide telefoonnummer in!',
            invalidCountry: 'Landcode incorrect! Alleen Nederlandse (+31) nummers toegestaan.',
            tooShort: ' (Telefoonnummer niet correct: te weinig nummers.)',
            tooLong: ' (Telefoonnummer niet correct: teveel cijfers.)',
            notValidOnSubmit: 'Vul alstublieft minimaal een geldig telefoonnummer in om op te slaan.',
            message: 'Ingevoerd telefoonnummer is correct. Nummer is geregistreerd in ',
            as: ' als ',
            multipleNotvalid: 'Een of meerdere telefoonnummers zijn niet valide!',
            fixedLine: 'een vast nummer',
            mobile: 'een mobiel nummer',
            mobileOrFixedLine: 'een vast of mobielnummer'
          },
          pincode: {
            exists: 'Kiest u a.u.b. een andere teamlidcode. Deze is in gebruik!'
          },
          password: {
            amountMinChars: function (chars)
            {
              return ' en dient uit minimaal ' + chars + ' teken(s) te bestaan'
            },
            amountMaxChars: function (chars)
            {
              return ' en uit maximaal ' + chars + ' tekens(s) te bestaan'
            },
            oldPassMatch: 'Het ingevulde oude wachtwoord komt niet overheen met het huidige.',
            required: 'Een wachtwoord is verplicht',
            identical: 'Wachtworden zijn niet identiek'
          },
          email: {
            notValid: 'Voer een valide e-mailadres in!',
            required: 'Een e-mail is verplicht'
          },
          role: 'Kies een rol!',
          birthDate: {
            notValid: 'Voer een valide geboortedatum in!'
          },
          userName: {
            regex: "en mag alleen uit alfanummerieke tekens bestaan, inclusief streepjes ('-') en lage streepjes ('_')",
            valid: 'Een gebruikersnaam is vereist ',
            email: "Een gebruiksnaam kan een emailadres zijn ",
            amountMinChars: function (number)
            {
              return ' en moet uit minimaal ' + number + ' karakters bestaan'
            },
            amountMaxChars: function (number)
            {
              return ' en maximaal ' + number + ' karakters '
            }
          },
          search: {
            notValid: 'Voer een voor- en/of achternaam in!'
          },
          wish : {
            integer: 'Geef een nummer van 0 t/m 30 '
          },
          upload: {
            fileTypeNotAloud: "Dit type bestand is niet toegestaan, kies een van de volgende types: 'png', 'jpeg', 'jpg', 'gif', 'bpg' of 'tiff'"
          }
        }
      }
    }
  }
);
