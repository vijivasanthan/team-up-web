/*jslint node: true */
'use strict';

/**
 * Localizations
 */
var ui = {
    en: {
      meta: {
        name: 'en',
        label: 'English'
      },
      login: {
        header: "Please sign in",
        placeholder_username: "Please enter your username",
        placeholder_password: "Your password",
        label_rememberMe: "Remember Me",
        button_login: "Login",
        button_loggingIn: "Logging...",
        forgot_password: "Forgot password?",
        forgetPassword: "Forgot password",
        emailAddress: "Email address",
        resetPassword: "Reset Password",
        returnLogin: "return back to login",
        changePassword: "change password",
        downloadApp: "Download Mobile App",
        ph_username: "username",
        ph_newPass: "new  password",
        ph_retypePass: "retype password",
        alert_fillfiled: 'Please fill all fields!',
        alert_wrongUserPass: 'Wrong username or password!',
        loading_User: 'Loading user information...',
        loading_Message: 'Loading messages...',
        loading_Teams:'Loading Teams...',
        loading_Members: 'Loading members...',
        loading_everything: 'Everything loaded!',
        logout: 'Logout',
        loading: 'Loading..',
        loading_clientGroups: 'Loading client groups...',
      },
      dashboard: {
        thisWeek: 'This Week',
        welcome: 'Welcome',
        newMessage: 'New Messages',
        goToInbox: 'Go to inbox',
        announcements: 'Announcements',
        loadingPie: 'Loading pie charts...',
        loadingP2000: 'Loading alarm messages',
        noP2000: 'There are no alarm messages'
      },
      planboard: {
        planboard: 'Agenda',
        newAvail: 'New Availability',
        day: 'Day',
        week: 'Week',
        month: 'Month',
        updateAvail: 'Update Availability',
        from: 'From',
        till: 'Till',
        state: 'State',
        selectAState: 'select a state',
        reoccuring: 'Re-occuring',
        lessPeople: 'There $v less people than needed!',
        samePeople: 'There are just as many peopleas needed.',
        morePeople: 'There are $v more people than needed!',
        wished: 'Wished' ,
        combine_reoccuring: 'This is a combined row of planning with re-occuring rows.',
        sendMsgToMember: 'Send Message To Members',
        add: 'Add',
        del: 'Delete',
        change: 'Change',
        setWish: 'Set Wish',
        timeline: 'Timeline',
        statistics: 'Statistics',
        barCharts: 'Bar charts',
        wishes: 'Wishes',
        legenda: 'Legenda',
        group: 'Group',
        groups: 'Groups',
        members: 'Members',
        bothAvailable: 'Both available',
        northAavailable: 'available North' ,
        southAvailable: 'available South',
        skipperOutService: 'Skipper Of Service',
        notAvailable: 'Not Available', // Niet Beschikbaar
        notachieve: 'Not Achieved',
        legendaLabels: {
          morePeople: 'More people',
          enoughPeople: 'Just enough people',
          lessPeople: 'Less people'
        },
        lastSyncTime: 'Last sync time:',
        dataRangeStart: 'Data range start: ',
        DataRangeEnd: 'Data range end: ',
        loadingTimeline: 'Loading timeline...',
        addTimeSlot: 'Adding a timeslot...',
        slotAdded: 'New timeslot added successfully.',
        changingSlot: 'Changing a timeslot...',
        slotChanged: 'Timeslot changed successfully.',
        changingWish: 'Changing wish value...',
        wishChanged: 'Wish value changed successfully.',
        deletingTimeslot: 'Deleting a timeslot...',
        timeslotDeleted: 'Timeslot deleted successfully.',
        refreshTimeline: 'Refreshing timeline...',
        preCompilingStortageMessage: 'Pre-compiling shortage message',
        weeklyPlanning: 'Weekly planning',
        planning: 'Planning',
        minNumber: 'Minimum number benodigden'
      },
      message: {
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
        receviers: 'Recevier(s)',
        // troubled
        // chooseRecept: 'Choose a Recipient',
        //
        subject: 'Subject',
        message: 'Message',
        sendMessage: 'Send Message',
        sender: 'Sender',
        date: 'Date',
        questionText: 'Message',
        reply: 'Reply',
        del: 'Delete',
        noMessage: 'There are no messages.',
        from: 'From',
        newMsg: 'New',
        deleteSelected: 'Delete Selected Messages',
        someMessage: 'There are $v message(s)',
        emptyTrash: 'Empty Trash',
        noMsgInTrash: 'There are no messages in trash.',
        box: 'Box',
        persons: 'Person(s)',
        restoreSelected: 'Restore Selected Messages',
        loadingMessage: 'Loading message...',
        escalation: 'Escalation message',
        escalationBody: function (diff,startDate,startTime,endDate,endTime)
        {
            return 'We have ' +
            diff +
            ' shortage in between ' +
            startDate + ' ' +
            startTime + ' and ' +
            endDate + ' ' +
            endTime + '. ' +
            'Would you please make yourself available if you are available for that period?';
        },
        removed: 'Message removed successfully.',
        removing: 'Removing the message...',
        refreshing: 'Refreshing messages...',
        removingSelected: 'Removing selected messages...',
        restoring: 'Restoring the message back...',
        restored: 'Message restored successfully.',
        restoringSelected: 'Restoring selected messages...',
        emptying: 'Emptying trash...',
        emptied: 'Trash bin emptied successfully.',
        sending: 'Sending the message...',
        sent: 'Message sent.',
        typeSubject: 'Type a subject',
        // messages: 'Messages',
        ph_filterMessage: 'Filter messages..',
        noReceivers: 'Please select a receiver.',
        emptyMessageBody: 'Please write a message',
        send: 'Send'
      },
      groups: {
        groups: 'Groups',
        newGroup: 'New Group',
        newMember: 'New Member',
        serach: 'Search',
        addNewGroup: 'Add New Group',
        editGroup: 'Edit Group',
        searchResults: 'Search results',
        group: 'Group',
        close: 'Close',
        name: 'Name',
        saveGroup: 'Save Group',
        registerMember: 'Register Member',
        role: 'Role',
        selectRole: 'Select a role',
        selectGroup: 'Choose a group',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        postCode: 'Postcode',
        tel: 'Tel',
        city: 'City',
        userName: 'Username',
        password: 'Password',
        saveMember: 'Save Member',
        serachFor: 'Search results for ',
        sorryCanNotFind: 'Sorry but we couldn\'t find what you are looking for.',
        // troubled
        // selectGroup: '-- select a group --',
        //
        addToGroup: 'Add to group',
        addMemberToGroup: 'Add Selected Members To Groups',
        resultCount: 'There are $v results in your query.',
        deleteGroup: 'Delete Group',
        noMembers: 'There are no members.',
        removeSelectedMembers: 'Remove Selected Members',
        memberCount:  'There are $v member(s)',
        searchingMembers: 'Searching members..',
        addingNewMember: 'Adding a new member..',
        memberAdded: 'Member added to group successfully.',
        refreshingGroupMember: 'Refreshing groups and members list..',
        removingMember: 'Removing member from group..',
        memberRemoved: 'Member removed from group successfully.',
        removingSelected: 'Removing selected members..',
        saving: 'Saving group..',
        groupSaved: 'Group saved successfully.',
        registerNew: 'Registering a new member..',
        memberRegstered: 'Member registered successfully.',
        deleting: 'Deleting group..',
        deleted: 'Group deleted successfully.',
        filterMembers: 'Filter members..',
        searchfor: 'firstname, lastname..'
      },
      profile: {
        profile: 'Profile',
        edit: 'Edit',
        password: 'Password',
        timeline: 'Timeline',
        profileView: 'Profile View',
        userGroups: 'User Groups',
        role: 'Role',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        postcode: 'Postcode',
        city: 'City',
        editProfile: 'Edit Profile',
        name: 'Name',
        saveProfile: 'Save Profile',
        passChange: 'Password Change',
        currentPass: 'Current password',
        newPass: 'New password',
        newPassRepeat: 'New password (Repeat)',
        changePass: 'Change password',
        newAvail: 'New Availability',
        // saveProfile: 'Saving profile information..',
        refreshing: 'Refreshing profile information..',
        dataChanged: 'Profile data is succesfully changed.',
        pleaseFill: 'Please fill all fields!',
        passNotMatch: 'Provided passwords do not match! Please try it again.',
        changingPass: 'Changing password..',
        passChanged: 'Password is succesfully changed.',
        passwrong: 'Given current password is wrong! Please try it again.',
        newTimeslotAdded: 'New timeslot added successfully.',
        changingTimeslot: 'Changing a timeslot..',
        timeslotChanged: 'Timeslot is succesfully changed.',
        firstName: 'first name',
        lastName: 'last name',
        editProfileImg : 'Edit profile image',
        loadUploadURL : 'Loading image upload URL ',
        click2upload : 'click here to upload',
        birthday: 'Birthday',        
        username: 'username',
        retypePassword: 'retype password'
        
      },
      settings: {
        settings: 'Settings',
        user: 'User',
        application: 'Application',
        userSettings: 'User Settings',
        appSettings: 'Application Settings',
        saveSettings: 'Save Settings',
        langSetting: 'Language',
        saving: 'Saving settings...',
        refreshing: 'Refreshing settings...',
        saved: 'Settings successfully saved.'
      },
      help: {
        header: 'Help & Support',
        support: 'Support'
      },
      downloads: {
        app: 'Soon it will be downloadable.<br>',
        manual: 'Download Manual'
      },
      loading: {
        general:    'Loading',
        dashboard:  'dashboard',
        planboard:  'agenda',
        messages:   'messages',
        groups:     'groups',
        profile:    'profile',
        settings:   'settings'
      },
      teamup: {
         teams: 'teams',
         clients: 'clients',
         client: 'client',
         manage: 'manage',
         chooseTeam: 'choose a team',         
         edit: 'edit',
         editTeam: 'edit team',
         team: 'team',
         del: 'delete',
         noMembers: 'No members in this team.',
         newTeam: 'New Team',
         teamName: 'Team name',
         createTeam: 'Create New Team',
         newMember: 'New Member',
         name: 'Name',
         role: 'role',
         phone: 'phone',
         street: 'street',
         postCode: 'post',
         city: 'city',
         saveMember: 'Save',
         state: 'state',
         states: 'States',
         saveTeam: 'Saving team',
         save: 'Save',
         refreshing : 'Refreshing team info',
         dataChanged : 'Data is changed',
         teamSubmitError: 'Errors in creating the team',
         queryTeamError: 'Errors in quering the teams',
         teamNamePrompt1: 'Team name can not be empty',
         teamNamePrompt2: 'Please fill the conatct data',
         cancel: 'Cancel',
         chooseRole : 'Choose a role',
         func: 'function',
         chooseFunction: 'Choose a function',
         newClientGroup: 'New Group',
         newClient: 'New Client',
         reports: 'Reports',
         report: 'Report',
         noClients: 'There are no clients in this group',
         TeamClients: 'TEAMS-CLIENTS',
         createClientGroup: 'Create new client group',
         contacts: 'Contacts',
         Number: 'No',
         clientProfileUrl: 'Client profile URL',
         addContact: 'add contact',
         saveClient: 'Save',
         group: 'Group',
         noContacts: 'There is no contact person.',
         contactCount:  'There are $v contact(s)',
         accountInfoFill: 'Please fill your account info.',
         passNotSame: 'Passwrods are not same.',
         savingMember: 'Saving member',
         selectTeam: 'Please select a team',
         clinetInfoFill: 'Please fill the basic client info : name and phone',
         savingClient: 'Saving client',
         clientSubmitError: 'Errors when creating new client',
         clientGroups: 'Client groups',
         teams_Cap: 'Teams',
         editClient: 'Edit client',
         loadingNumber: 'loading call-in number of this team',
         birthdayError: 'Birthday error',
         map: 'map',
         saveContacts: 'Save contacts',
         loadingReports: 'Loading reports',
         datetime: 'Date & time',
         writenBy: 'written by',
         noSharedStates: 'No shared states',
         savingContacts: 'Saving the contacts',
         delClientGroupConfirm: 'Are you sure you want to delet this client group ? It might take a while.',
         delTeamConfirm: 'Are you sure you want to delet this team ? It might take a while.',
         deletingClientGroup: "Deleting group ... ",
         deleteConfirm: "Please OK to process.",
         deletingTeam: "Deleting team ...",
         deletingMember: "Deleting member ...",
         deletingClient: "Deleting client ...",
         noMessages: "There are no messages",
         newReport: "New Report",
         selectClient: "Select a client",
         selectMember: "Select a member",
         selectMonth: "Select a month",
         saveReport: "Save report",
         reportTitle: "Title",
         selectSlot: "Please select a slot",
         editClientImg: "Edit client image",
         newTask: "New Task",
         updateTask: "Update Task"
      }
    },
    nl: {
      meta: {
        name: 'nl',
        label: 'Nederlands'
      },
      login: {
        header: "Inloggen",
        placeholder_username: "Vul uw gebruikersnaam in",
        placeholder_password: "Vul uw wachtwoord in",
        label_rememberMe: "Onthoud mij",
        button_login: "Login",
        button_loggingIn: "Inloggen...",
        forgot_password: "Wachtwoord vergeten?",
        forgetPassword: "Wachtwoord vergeten",
        emailAddress: "Email adres",
        resetPassword: "Wachtwoord opnieuw instellen",
        returnLogin: "Terugkeren om in te loggen",
        changePassword: "Wachtwoord wijzigen",
        downloadApp: "Download Mobiele App",
        ph_username: "gebruikersnaam",
        ph_newPass: "nieuw wachtwoord",
        ph_retypePass: "Typ wachtwoord",
        alert_fillfiled: 'Vul alle velden in!',
        alert_wrongUserPass: 'Onjuiste gebruikersnaam of wachtwoord!',
        loading_User: 'Gebruikersinformatie laden...',
        loading_Message: 'Berichten laden...',
        loading_Group:'Groepen laden...',
        loading_Members: 'Leden laden...',
        loading_everything: 'Alles is geladen!',
        logout: 'Logout',
        loading: 'Loading..'
      },
      dashboard: {
        thisWeek: 'Deze week',
        welcome: 'Welkom',
        newMessage: 'Nieuwe berichten',
        goToInbox: 'Ga naar inbox',
        loadingPie: 'Cirkeldiagrammen laden...',
        announcements: 'Alarm berichten',
        loadingP2000: 'Alarm berichten laden...',
        noP2000: 'Er zijn geen alarm berichten.'
      },
      planboard : {
        planboard: 'Agenda',
        newAvail: 'Nieuwe beschikbaarheid',
        day: 'Dag',
        week: 'Week',
        month: 'Maand',
        updateAvail: 'Update beschikbaarheid',
        from: 'Van',
        till: 'Tot',
        state: 'Status',
        selectAState: 'selecteer een status',
        reoccuring: 'Herhaling',
        lessPeople: 'Er is een tekort van $v mens(en)!',
        samePeople: 'Er zijn precies genoeg mensen.',
        morePeople: 'Er is een overschot van $v mens(en)!',
        wished: 'Gewenst' ,
        combine_reoccuring: 'Dit is een gecombineerde planning.',
        sendMsgToMember: 'Stuur bericht naar leden',
        add: 'Toevoegen',
        del: 'Verwijderen',
        change: 'Wijzigen',
        setWish: 'Behoefte instellen',
        timeline: 'Tijdlijn',
        statistics: 'Statistieken',
        barCharts: 'Staafdiagrammen',
        wishes: 'Behoefte',
        legenda: 'Legenda',
        group: 'Groep',
        groups: 'Groepen',
        members: 'Leden',
        bothAvailable: 'Beiden beschikbaar',
        northAavailable: 'Beschikbaar Noord' ,
        southAvailable: 'Beschikbaar Zuid',
        skipperOutService: 'Schipper van dienst',
        notAvailable: 'Niet beschikbaar',
        notachieve: 'Niet behaald',
        legendaLabels: {
          morePeople: 'Meer mensen',
          enoughPeople: 'Precies genoeg mensen',
          lessPeople: 'Te weinig mensen'
        },
        lastSyncTime: 'Laatste synchronisatietijd:',
        dataRangeStart: 'Begin gegevensscala: ',
        DataRangeEnd: 'Eind gegevensscala: ',
        loadingTimeline: 'Tijdlijn laden...',
        addTimeSlot: 'Tijdslot toevoegen...',
        slotAdded: 'Tijdslot succesvol toegevoegd.',
        changingSlot: 'Tijdslot wijzigen...',
        slotChanged: 'Tijdslot succesvol gewijzigd.',
        changingWish: 'Behoefte veranderen...',
        wishChanged: 'Behoefte succesvol veranderd.',
        deletingTimeslot: 'Tijdslot verwijderen...',
        timeslotDeleted: 'Tijdslot succesvol verwijderd.',
        refreshTimeline: 'Tijdlijn vernieuwen...',
        preCompilingStortageMessage: 'Opstellen tekortbericht',
        weeklyPlanning: 'Wekelijkse planning',
        planning: 'Planning',
        minNumber: 'Minimum aantal benodigde mensen'
      },
      message: {
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
        escalationBody: function(diff,startDate,startTime,endDate,endTime)
        {
            return 'Er is een tekort van ' +
            diff +
            ' mensen tussen ' +
            startDate + ' ' +
            startTime + ' en ' +
            endDate + ' ' +
            endTime + '. ' +
            'Zet uzelf a.u.b. op beschikbaar indien u beschikbaar bent voor die periode';
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
        typeSubject: 'Vul een onderwerp in',
        // messages: 'Berichten',
        ph_filterMessage: 'Berichten filteren...',
        noReceivers: 'Graag een ontvanger selecteren.'
      },
      groups: {
        groups: 'Groepen',
        newGroup: 'Nieuwe Group',
        newMember: 'Nieuw lid',
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
        tel: 'Tel',
        city: 'Stad',
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
        memberCount:  'Er zijn $v leden',
        searchingMembers: 'Leden zoeken...',
        addingNewMember: 'Nieuw lid toevoegen...',
        memberAdded: 'Lid succesvol aan groep toegevoegd.',
        refreshingGroupMember: 'Groepen- en ledenlijst vernieuwen...',
        removingMember: 'Lid van groep verwijderen...',
        memberRemoved: 'Lid succesvol van groep verwijderd.',
        removingSelected: 'Geselecteerde leden verwijderen...',
        saving: 'Groep opslaan...',
        groupSaved: 'Groep succesvol opgeslagen.',
        registerNew: 'Nieuw lid registreren...',
        memberRegstered: 'Lid succesvol geregistreerd.',
        deleting: 'Groep verwijderen...',
        deleted: 'Groep succesvol verwijderd.',
        filterMembers: 'Leden filteren...',
        searchfor: 'voornaam, achternaam..'
      },
      profile: {
        profile: 'Profiel',
        edit: 'Wijzigen',
        password: 'Wachtwoord',
        timeline: 'Tijdlijn',
        profileView: 'Profiel weergave',
        userGroups: 'Gebruikersgroepen',
        role: 'Functie',
        email: 'Email',
        phone: 'Telefoon',
        address: 'Adres',
        postcode: 'Postcode',
        city: 'Stad',
        editProfile: 'Profiel wijzigen',
        name: 'Naam',
        saveProfile: 'Profiel opslaan',
        passChange: 'Wachtwoord wijzigen',
        currentPass: 'Huidig wachtwoord',
        newPass: 'Nieuw wachtwoord',
        newPassRepeat: 'Herhaal nieuw wachtwoord',
        changePass: 'Wachtwoord wijzigen',
        newAvail: 'Nieuwe beschikbaarheid',
        // saveProfile: 'Profielinformatie opslaan...',
        refreshing: 'Profielinformatie vernieuwen...',
        dataChanged: 'Profielgegevens succesvol gewijzigd.',
        pleaseFill: 'Vul a.u.b. alle velden in!',
        passNotMatch: 'Ingevoerd wachtwoord komt niet overeen. Probeer het opnieuw.',
        changingPass: 'Wachtwoord wijzigen...',
        passChanged: 'Wachtwoord succesvol gewijzigd.',
        passwrong: 'Ingevoerd wachtwoord is foutief! Probeer het opnieuw.',
        newTimeslotAdded: 'Nieuw tijdslot succesvol toegevoegd.',
        changingTimeslot: 'Tijdslot wijzigen...',
        timeslotChanged: 'Tijdslot succesvol gewijzigd.'
      },
      settings: {
        settings: 'Instellingen',
        user: 'Gebruiker',
        application: 'Applicatie',
        userSettings: 'Gebruikersinstellingen',
        appSettings: 'Applicatie-instellingen',
        saveSettings: 'Instellingen Opslaan',
        langSetting: 'Taal',
        saving: 'Instellingen wijzigen...',
        refreshing: 'Instellingen vernieuwen...',
        saved: 'Instellingen succesvol gewijzigd.'
      },
      help: {
        header: 'Hulp & Ondersteuning',
        support: 'Ondersteuning'
      },
      downloads: {
        app: 'Binnenkort te downloaden.',
        manual: 'Download Handleiding'
      },
      loading: {
        general:    'Laden',
        dashboard:  'dashboard',
        planboard:  'agenda',
        messages:   'berichten',
        groups:     'groepen',
        profile:    'profiel',
        settings:   'instellingen'
      },
      teamup: {
          teams: 'teams',
          clients: 'clients',
          manage: 'manage'
      }
    }
};;/*jslint node: true */
/*global angular */
/*global basket */
'use strict';


/**
 * Declare app level module which depends on filters, and services
 */
angular.module('WebPaige',[
  'ngResource',
  // modals
   'WebPaige.Modals.User',
  // 'WebPaige.Modals.Dashboard',
  'WebPaige.Modals.Core',
  'WebPaige.Modals.Teams',
  'WebPaige.Modals.Clients',
  'WebPaige.Modals.Profile',
  'WebPaige.Modals.Settings',
  // 'WebPaige.Modals.Help',
  'WebPaige.Modals.Messages',
  'WebPaige.Modals.Slots',
  
  // controller
  'WebPaige.Controllers.Login',
  'WebPaige.Controllers.Forgotpass',
  'WebPaige.Controllers.Register',
  // 'WebPaige.Controllers.Logout',
  // 'WebPaige.Controllers.Dashboard',
  'WebPaige.Controllers.Core',
  'WebPaige.Controllers.Teams',
  'WebPaige.Controllers.Clients',
  'WebPaige.Controllers.Manage',
  'WebPaige.Controllers.TreeGrid',
  'WebPaige.Controllers.Planboard',
  'WebPaige.Controllers.Timeline',
  'WebPaige.Controllers.Timeline.Navigation',
  'WebPaige.Controllers.Profile',
  'WebPaige.Controllers.Messages',
  // 'WebPaige.Controllers.Settings',
  // 'WebPaige.Controllers.Help',
  
  // services
  // 'WebPaige.Services.Timer',
  'WebPaige.Services.Session',
  'WebPaige.Services.Dater',
  // 'WebPaige.Services.EventBus',
  // 'WebPaige.Services.Interceptor',
  'WebPaige.Services.MD5',
  'WebPaige.Services.Storage',
  'WebPaige.Services.Strings',
  'WebPaige.Services.Generators',
  'WebPaige.Services.Sloter',
  // 'WebPaige.Services.Stats',
  // 'WebPaige.Services.Offsetter',
  
  // directives
  'WebPaige.Directives',
  '$strap.directives',
  
  // filters
  'WebPaige.Filters',
  
  // libs 
  'ui.bootstrap.modal'
]);


/**
 * Fetch libraries with AMD (if they are not present) and save in localStorage
 * If a library is presnet it wont be fetched from server
 */
if ('localStorage' in window && window['localStorage'] !== null)
{
  basket
    .require(
      { url: 'libs/chosen/chosen.jquery.min.js' },
      { url: 'libs/chaps/timeline/2.4.0/timeline_modified.min.js' },
      { url: 'libs/bootstrap-datepicker/bootstrap-datepicker.min.js' },
      { url: 'libs/bootstrap-timepicker/bootstrap-timepicker.min.js' },
      { url: 'libs/daterangepicker/1.1.0/daterangepicker.min.js' },
      { url: 'libs/sugar/1.3.7/sugar.min.js' },
      { url: 'libs/raphael/2.1.0/raphael-min.js' }
    )
    .then(function ()
      {
        basket
          .require(
            { url: 'libs/g-raphael/0.5.1/g.raphael-min.js' },
            { url: 'libs/g-raphael/0.5.1/g.pie-min.js' }
          )
          .then(function ()
          {
            // console.warn('basket parsed scripts..');
        });
      }
    );
};/*jslint node: true */
/*global angular */
/*global profile */
'use strict';


/**
 * App configuration
 */
angular.module('WebPaige')
.value(
  '$config',
  {
    title:    'TeamUp',
    version:  '0.1.0',
    lang:     'en',

    fullscreen: true,

    // REMOVE
    demo_users: false,

    profile: {
      meta:   profile.meta,
      title:  profile.title,
      logos: {
        login:  'profiles/' + profile.meta + '/img/login_logo.png',
        app:    ''
      },
      background: 'profiles/' + profile.meta + '/img/login_bg.jpg', // jpg for smaller size,
      p2000:      profile.p2000,
      mobileApp:  profile.mobileApp
    },

    statesall: {
      'com.ask-cs.State.Available':
      {
        className:'state-available',
        label:    'Beschikbaar',
        color:    '#4f824f',
        type:     'Beschikbaar'
      },
      'com.ask-cs.State.KNRM.BeschikbaarNoord':
      {
        className:'state-available-north',
        label:    'Beschikbaar voor Noord',
        color:    '#000',
        type:     'Beschikbaar'
      },
      'com.ask-cs.State.KNRM.BeschikbaarZuid':
      {
        className:'state-available-south',
        label:    'Beschikbaar voor Zuid',
        color:    '#e08a0c',
        type:     'Beschikbaar'
      },
      'com.ask-cs.State.Unavailable':
      {
        className:'state-unavailable',
        label:    'Niet Beschikbaar',
        color:    '#a93232',
        type:     'Niet Beschikbaar'
      },
      'com.ask-cs.State.KNRM.SchipperVanDienst':
      {
        className:'state-schipper-service',
        label:    'Schipper van Dienst',
        color:    '#e0c100',
        type:     'Beschikbaar'
      },
      'com.ask-cs.State.Unreached':
      {
        className:'state-unreached',
        label:    'Niet Bereikt',
        color:    '#65619b',
        type:     'Niet Beschikbaar'
      }
    },

    host: profile.host(),

    formats: {
      date:         'dd-MM-yyyy',
      time:         'HH:mm',
      datetime:     'dd-MM-yyyy HH:mm',
      datetimefull: 'dd-MM-yyyy HH:mm'
    },

    roles: profile.roles,
    
    mfunctions: profile.mfunctions,
    
    stateIcons : profile.stateIcons,
    
    stateColors : profile.stateColors,
    
    noImgURL : profile.noImgURL,
    
    timeline: {
      options: {
        axisOnTop:        true,
        width:            '100%',
        height:           'auto',
        selectable:       true,
        editable:         true,
        style:            'box',
        groupsWidth:      '200px',
        eventMarginAxis:  0,
        showCustomTime:   true,
        groupsChangeable: false,
        showNavigation:   false,
        intervalMin:      1000 * 60 * 60 * 1
      },
      config: {
        zoom:       '0.4',
        bar:        false,
        layouts:    profile.timeline.config.layouts,
        wishes:     false,
        legenda:    {},
        legendarer: false,
        states:     {},
        divisions:  profile.divisions,
        densities: {
          less:   '#a0a0a0',
          even:   '#ba6a24',
          one:    '#415e6b',
          two:    '#3d5865',
          three:  '#344c58',
          four:   '#2f4550',
          five:   '#2c424c',
          six:    '#253943',
          more:   '#486877'
        }
      }
    },

    pie: {
      colors: ['#415e6b', '#ba6a24', '#a0a0a0']
    },

    defaults: {
      settingsWebPaige: {
        user: {
          language: 'nl'
        },
        app: {
          widgets: {
            groups: {}
          }
        }
      }
    },

    cookie: {
      expiry: 30,
      path:   '/'
    },

    // notifications: {
    //   webkit: {
    //     user: true,
    //     app: window.webkitNotifications && (window.webkitNotifications.checkPermission() == 0) ? true : false
    //   }
    // },

    init: function ()
    {
      var _this = this;

      angular.forEach(profile.states, function (state, index)
      {
        _this.timeline.config.states[state] = _this.statesall[state];
      });
    },


    countries: [
      {
        id:     44,
        label: 'United Kingdom (44)'
      },
      {
        id:     32,
        label: 'Belgium (32)'
      }, 
      {
        id:     33,
        label: 'France (33)'
      }, 
      {
        id:     49,
        label: 'Germany (49)'
      },
      {
        id:     31,
        label: 'Netherlands (31)'
      },
      {
        id:     90,
        label: 'Turkey (90)'
      }
    ],


    regions: {
      31: [
        {
          id:     297,
          label:  'Aalsmeer (297)'
        },
        {
          id:     72,
          label:  'Alkmaar (72)'
        },
        {
          id:     546,
          label:  'Almelo (546)'
        },
        {
          id:     36,
          label:  'Almere (36)'
        },
        {
          id:     172,
          label:  'Alphen A/D Rijn (172)'
        },
        {
          id:     33,
          label:  'Amersfoort (33)'
        },
        {
          id:     20,
          label:  'Amsterdam (20)'
        },
        {
          id:     55,
          label:  'Apeldoorn (55)'
        },
        {
          id:     26,
          label:  'Arnhem (26)'
        },
        {
          id:     10,
          label:  'Rotterdam (10)'
        }
      ],
      90: [
        {
          id:     1,
          label:  'Turkey 1'
        },
        {
          id:     2,
          label:  'Turkey 2'
        }
      ],
      44: [
        {
          id:     1,
          label:  'United Kingdom 1'
        },
        {
          id:     2,
          label:  'United Kingdom 2'
        }
      ],
      49: [
        {
          id:     1,
          label:  'Germany 1'
        },
        {
          id:     2,
          label:  'Germany 2'
        }
      ],
      33: [
        {
          id:     1,
          label:  'France 1'
        },
        {
          id:     2,
          label:  'France 2'
        }
      ],
      32: [
        {
          id:     1,
          label:  'Belgium 1'
        },
        {
          id:     2,
          label:  'Belgium 2'
        }
      ]
    },

    packages: {
      1: {
        id:    1,
        label: 'Local Numbers',
        prices:{
          monthly: {
            normal:   5,
            premium:  15
          },
          yearly: {
            normal:   50,
            premium:  150
          }
        }
      },
      2: {
        id:    2,
        label: 'Virtual Numbers',
        prices:{
          monthly: {
            normal:   10,
            premium:  30
          },
          yearly: {
            normal:   100,
            premium:  300
          }
        }
      }
    },

    packages__: [
      {
        id:    1,
        label: 'Local Numbers',
        prices:{
          monthly: {
            normal:   5,
            premium:  15
          },
          yearly: {
            normal:   50,
            premium:  150
          }
        }
      },
      {
        id:    2,
        label: 'Virtual Numbers',
        prices:{
          monthly: {
            normal:   10,
            premium:  30
          },
          yearly: {
            normal:   100,
            premium:  300
          }
        }
      }
    ],


    virtuals: [
      {
        id:     1,
        label:  'Personal assistant services (84-87)'
      },
      {
        id:     2,
        label:  'VPN (82)'
      },
      {
        id:     3,
        label:  'Elektronisch communicatie (85 - 91)'
      },
      {
        id:     4,
        label:  'Company numbers (88)'
      }
    ],

    ranges: {
      1: [84, 85, 86, 87],
      2: [82],
      3: [85, 86, 87, 88, 89, 90, 91],
      4: [88]
    },

    premiums: [
      {
        package:  1,
        country:  31,
        region:   10,
        number:   2222222
      },
    ]

  }
);;/*jslint node: true */
/*global angular */
'use strict';


/**
 * Providers & Routes
 */
angular.module('WebPaige')
.config(
[
  '$locationProvider', '$routeProvider', '$httpProvider',
  function ($locationProvider, $routeProvider, $httpProvider)
  {
    /**
     * Login router
     */
    $routeProvider
    .when('/login',
    {
      templateUrl: 'dist/views/login.html',
      controller: 'login'
    })


    /**
     * Forgot password router
     */
    .when('/forgotpass',
    {
      templateUrl: 'dist/views/forgotpass.html',
      controller: 'forgotpass'
    })


    /**
     * Register router
     */
    .when('/register',
    {
      templateUrl: 'dist/views/register.html',
      controller: 'register'
    })


    /**
     * Logout router
     */
    .when('/logout',
    {
      templateUrl: 'dist/views/login.html',
      controller: 'login'
    })


    /**
     * Teams router
     */
     .when('/team',
     {
       templateUrl: 'dist/views/teams.html',
       controller: 'teamCtrl',
       resolve: {
           data: [
             'Teams','$route',
             function (Teams,$route)
             {
               if($route.current.params.local && $route.current.params.local == "true"){
                   return Teams.queryLocal();
               }else{
                   return Teams.query(false,$route.current.params); 
               }
             }
           ]
       },
       reloadOnSearch: false
     })


    /**
     * Client router
     */
    .when('/client',
    {
      templateUrl:    'dist/views/clients.html',
      controller:     'clientCtrl',
      resolve: {
          data: [
            'Clients','$route',
            function (ClientGroups,$route)
            {
                if($route.current.params.local && $route.current.params.local == "true"){
                    return ClientGroups.queryLocal();
                }else{
                    return ClientGroups.query(false,$route.current.params);
                }
            }
          ]
      },
      reloadOnSearch: false
    })
    
    /**
     * Client Profile router
     */
    .when('/clientProfile/:clientId',
    {
      templateUrl:    'dist/views/clients.html',
      controller:     'clientCtrl',
      resolve: {
          data: [
            '$rootScope', '$route', '$location', 'Clients', 
            function ($rootScope, $route, $location, Clients)
            {
                var data = {clientId : $route.current.params.clientId};
                return data;
//                return Clients.getReports($route.current.params.clientId, false);
            }
          ]
      },
      reloadOnSearch: false
    })
    
    /**
     * Client Group - Team , Management 
     */
    .when('/manage',
    {
      templateUrl:    'dist/views/manage.html',
      controller:     'manageCtrl',
      resolve: {
          data: [
            'Clients','Teams','$location',
            function (ClientGroups,Teams,$location)
            {
                  var ret = {};
                  
                  if($location.hash() && $location.hash() == 'reload'){
                      var teams = Teams.query();
                      var cGroups = ClientGroups.query();
                      ret = { t : teams , cg : cGroups};
                      // ret = Teams.getAll();
                  }else{
                      ret.local = true;
                  }
              
                  return ret;
            }
          ]
      },
      reloadOnSearch: false
    })


    /**
     * Agenda router
     */
    .when('/planboard',
    {
       templateUrl: 'dist/views/planboard.html',
       controller: 'planboard',
       reloadOnSearch: false
    })


    /**
     * Settings router
     */
      // .when('/settings',
      // {
      //   templateUrl: 'dist/views/settings.html',
      //   controller: 'settings'
      // })


    /**
     * Planboard router
     */
    // .when('/planboard',
    // {
    //   templateUrl: 'dist/views/planboard.html',
    //   controller: 'planboard',
    //   resolve: {
    //     data:
    //     [
    //       '$route', 'Slots', 'Storage', 'Dater',
    //       function ($route, Slots, Storage, Dater)
    //       {
    //         var periods = Storage.local.periods(),
    //             current = Dater.current.week(),
    //             initial = periods.weeks[current],
    //             groups  = Storage.local.groups(),
    //             settings = Storage.local.settings();

    //         return  Slots.all({
    //                   groupId:  settings.app.group,
    //                   division: 'all',
    //                   stamps: {
    //                     start:  initial.first.timeStamp,
    //                     end:    initial.last.timeStamp
    //                   },
    //                   month: Dater.current.month(),
    //                   layouts: {
    //                     user:     true,
    //                     group:    true,
    //                     members:  false
    //                   }
    //                 });
    //       }
    //     ]
    //   },
    //   reloadOnSearch: false
    // })


    /**
     * Messages router
     */
     .when('/messages',
     {
       templateUrl: 'dist/views/messages.html',
       controller: 'messages',
//       resolve: {
//         data: [
//           '$route', 'Messages',
//           function ($route, Messages)
//           {
//             return Messages.query();
//           }
//         ]
//       },
       reloadOnSearch: false
     })


    /**
     * Groups router
     */
    // .when('/groups',
    // {
    //   templateUrl: 'dist/views/groups.html',
    //   controller: 'groups',
    //   resolve: {
    //     data: [
    //       'Groups',
    //       function (Groups)
    //       {
    //         return Groups.query();
    //       }
    //     ]
    //   },
    //   reloadOnSearch: false
    // })


    /**
     * Profile (user specific) router
     */
     .when('/profile/:userId',
     {
       templateUrl: 'dist/views/profile.html',
       controller: 'profileCtrl',
       resolve: {
         data: [
           '$rootScope', 'Profile', '$route', '$location', 'Dater',
           function ($rootScope, Profile, $route, $location, Dater)
           {
               return Profile.get($route.current.params.userId, false);
           }
         ]
       },
       reloadOnSearch: false
     })

    /**
     * Profile (user hiself) router
     */
     .when('/profile',
     {
       templateUrl: 'dist/views/profile.html',
       controller: 'profileCtrl',
       resolve: {
         data: [
           '$rootScope', '$route', '$location',
           function ($rootScope, $route, $location)
           {
             if (!$route.current.params.userId || !$location.hash())
               $location.path('/profile/' + $rootScope.app.resources.uuid).hash('profile');
           }
         ]
       }
     })


    /**
     * Settings router
     */
    // .when('/settings',
    // {
    //   templateUrl: 'dist/views/settings.html',
    //   controller: 'settings',
    //   resolve: {
    //     data: [
    //       'Settings',
    //       function (Settings)
    //       {
    //         return angular.fromJson(Settings.get());
    //       }
    //     ]
    //   }
    // })


    /**
     * Help router
     */
    // .when('/help',
    // {
    //   templateUrl: 'dist/views/help.html',
    //   controller: 'help'
    // })


    /**
     * Router fallback
     */
    .otherwise({
      redirectTo: '/login'
    });


    /**
     * Define interceptor
     */
    // $httpProvider.responseInterceptors.push('Interceptor');
  }
]);;/*jslint node: true */
/*global angular */
/*global $ */
/*global ui */
/*global screenfull */
'use strict';


/**
 * Initial run functions
 */
angular.module('WebPaige')
.run(
[
  '$rootScope', '$location', '$timeout', 'Session','Storage', '$config', '$window','Teams','Dater',
  function ($rootScope, $location, $timeout, Session, Storage, $config, $window,Teams,Dater)
  {
    /**
     * Pass config and init dynamic config values
     */
    $rootScope.config = $config;

    $rootScope.config.init();


    /**
     * TODO
     * Move these checks to jquery.browser
     * 
     * Pass Jquery browser data to angular
     */
    $rootScope.browser = $.browser;

    angular.extend($rootScope.browser, {
      screen: $window.screen
    });

    if ($rootScope.browser.ios)
    {
      angular.extend($rootScope.browser, {
        landscape:    Math.abs($window.orientation) == 90 ? true : false,
        portrait:     Math.abs($window.orientation) != 90 ? true : false
      });
    }
    else
    {
      angular.extend($rootScope.browser, {
        landscape:    Math.abs($window.orientation) != 90 ? true : false,
        portrait:     Math.abs($window.orientation) == 90 ? true : false
      });
    }

    $window.onresize = function () { $rootScope.browser.screen = $window.screen; };

    $window.onorientationchange = function ()
    {
      $rootScope.$apply(function ()
      {
        if ($rootScope.browser.ios)
        {
          angular.extend($rootScope.browser, {
            landscape:    Math.abs($window.orientation) == 90 ? true : false,
            portrait:     Math.abs($window.orientation) != 90 ? true : false
          });
        }
        else
        {
          angular.extend($rootScope.browser, {
            landscape:    Math.abs($window.orientation) != 90 ? true : false,
            portrait:     Math.abs($window.orientation) == 90 ? true : false
          });
        }
      });
    };


    /**
     * Default language and change language
     */
    $rootScope.changeLanguage = function (lang) { $rootScope.ui = ui[lang]; };
    $rootScope.ui = ui[$rootScope.config.lang];




    /**
     * If periods are not present calculate them
     */
     if (!Storage.get('periods')) Dater.registerPeriods();




    /**
     * Set important info back if refreshed
     */
     $rootScope.app = $rootScope.app || {};




    /**
     * Set up resources
     */
     $rootScope.app.resources = angular.fromJson(Storage.get('resources'));




    /**
     * Count unread messages
     */
    // if (!$rootScope.app.unreadMessages) Messages.unreadCount();




    /**
     * Show action loading messages
     */
    $rootScope.statusBar =
    {
      init: function ()
      {
        $rootScope.loading = {
          status: false,
          message: 'Loading..'
        };

        // $rootScope.app.preloader = {
        //   status: false,
        //   total:  0,
        //   count:  0
        // }
      },

      display: function (message)
      {
        // $rootScope.app.preloader || {status: false};

        // $rootScope.app.preloader.status = false;

        $rootScope.loading = {
          status:   true,
          message:  message
        };
      },

      off: function ()
      {
        $rootScope.loading.status = false;
      }
    };

    $rootScope.statusBar.init();





    $rootScope.notification = {
      status:   false,
      type:     '',
      message:  ''
    };





    /**
     * Show notifications
     */
    $rootScope.notifier =
    {
      init: function (status, type, message)
      {
        $rootScope.notification.status = true;

        if ($rootScope.browser.mobile && status == true)
        {
          $window.alert(message);
        }
        else
        {
          $rootScope.notification = {
            status:   status,
            type:     type,
            message:  message
          };
        }
      },

      success: function (message, permanent)
      {
        this.init(true, 'alert-success', message);

        if (!permanent) this.destroy();
      },

      error: function (message, permanent)
      {
        this.init(true, 'alert-danger', message);

        if (!permanent) this.destroy();
      },

      destroy: function ()
      {
        setTimeout(function ()
        {
          $rootScope.notification.status = false;
        }, 5000);
      }
    };

    $rootScope.notifier.init(false, '', '');





    /**
     * Allow webkit desktop notifications
     */
    // $rootScope.allowWebkitNotifications = function ()
    // {
    //   // Callback so it will work in Safari 
    //   $window.webkitNotifications.requestPermission(function () {});     
    // };


    /**
     * Set webkit notification
     */
    // $rootScope.setWebkitNotification = function (title, message, params)
    // {
    //   if ($window.webkitNotifications && $config.notifications.webkit.app)
    //   {
    //     var notification =  $window.webkitNotifications.createNotification(
    //                           location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + 
    //                           '/js/profiles/' + $config.profile.meta + '/img/ico/apple-touch-icon-144x144-precomposed.png', 
    //                           title, 
    //                           message
    //                         );

    //     notification.onclick = function () 
    //     {
    //       $rootScope.$apply(function ()
    //       {            
    //         if (params.search && !params.hash)
    //         {
    //           $location.path('/' + params.path).search(params.search);
    //         }
    //         else if (!params.search && params.hash)
    //         {
    //           $location.path('/' + params.path).hash(params.hash); 
    //         }
    //         else if (!params.search && !params.hash)
    //         {
    //           $location.path('/' + params.path); 
    //         }
    //         else if (params.search && params.hash)
    //         {
    //           $location.path('/' + params.path).search(params.search).hash(params.hash); 
    //         }
    //       });
    //     };

    //     notification.show();
    //   };     
    // };




    /**
     * Detect route change start
     */
    $rootScope.$on('$routeChangeStart', function (event, next, current)
    {
       function resetLoaders ()
       {
         $rootScope.loaderIcons = {
           general:    false,
           teams:  false,
           clients:  false,
           messages:   false,
           manage:     false,
           profile:    false,
           settings:   false
         };
       }

       resetLoaders();

       switch ($location.path())
       {
         case '/team':
           $rootScope.loaderIcons.team = true;

           $rootScope.location = 'team';
         break;

         case '/client':
           $rootScope.loaderIcons.client = true;

           $rootScope.location = 'cilent';
         break;

         case '/messages':
           $rootScope.loaderIcons.messages = true;

           $rootScope.location = 'messages';
         break;
         
         case '/manage':
             $rootScope.loaderIcons.messages = true;

             $rootScope.location = 'manage';
         break;
         
		 case '/logout':
		   
           $rootScope.location = 'logout';
           var logindata = angular.fromJson(Storage.get('logindata'));
           
           Storage.clearAll();
           
           if(logindata.remember){
			  Storage.add('logindata', angular.toJson({
                username: logindata.username,
                password: logindata.password,
                remember: logindata.remember
              }));           	
           }   
           
         break;
         
      //   case '/groups':
      //     $rootScope.loaderIcons.groups = true;

      //     $rootScope.location = 'groups';
      //   break;

      //   case '/settings':
      //     $rootScope.loaderIcons.settings = true;

      //     $rootScope.location = 'settings';
      //   break;

         default:
           if ($location.path().match(/profile/))
           {
             $rootScope.loaderIcons.profile = true;

             $rootScope.location = 'profile';
           }
           else
           {
             $rootScope.loaderIcons.general = true;
           }
       }

      if (!Session.check()) $location.path("/login");

      $rootScope.loadingBig = true;

      $rootScope.statusBar.display('Loading..');



       switch ($location.path())
       {
         case '/team':
           $rootScope.location = 'team';
         break;

         case '/client':
           $rootScope.location = 'client';
         break;

         case '/messages':
           $rootScope.location = 'messages';
         break;

         case '/manage':
           $rootScope.location = 'manage';
         break;

         case '/settings':
           $rootScope.location = 'settings';
         break;
         
         default:
           if ($location.path().match(/profile/))
           {
             $rootScope.location = 'profile';
           }
       }


      $rootScope.location = $location.path().substring(1);


      $('div[ng-view]').hide();
    });






    /**
     * Route change successfull
     */
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous)
    {
      $rootScope.newLocation = $location.path();

      $rootScope.loadingBig = false;

      $rootScope.statusBar.off();

      $('div[ng-view]').show();
    });






    /**
     * TODO
     * A better way of dealing with this error!
     * 
     * Route change is failed!
     */
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection)
    {
      $rootScope.notifier.error(rejection);
    });





    /**
     * Fix styles
     */
    $rootScope.fixStyles = function ()
    {
      var tabHeight = $('.tabs-left .nav-tabs').height();

      $.each($('.tab-content').children(), function () 
      {
        var $parent = $(this),
            $this = $(this).attr('id'),
            contentHeight = $('.tabs-left .tab-content #' + $this).height();

        /**
         * TODO
         * 
         * Append left border fix
         */
        // $parent.append('<div class="left-border-fix"></div>');
        // console.log('parent ->', $parent);
        // $('#' + $this + ' .left-border-fix').css({
        //   height: contentHeight
        // });
        /**
         * Check if one is bigger than another
         */

        if (tabHeight > contentHeight)
        {
          // console.log('tab is taller than content ->', $this);
          $('.tabs-left .tab-content #' + $this).css({
            height: $('.tabs-left .nav-tabs').height() + 6
          });
        }
        else if (contentHeight > tabHeight)
        {
          // console.log('content is taller than tabs ->', $this);
          // $('.tabs-left .nav-tabs').css( { height: contentHeight } );
        };
      });

      /**
       * Correct icon-font-library icons for mac and linux
       */
      if ($.os.mac || $.os.linux)
      {
        $('.nav-tabs-app li a span').css({
          paddingTop: '10px',
          marginBottom: '0px'
        });

        // $('#loading').css({
        //   //marginTop: '-160px'
        //   display: 'none'
        // });
      }
    };





    /**
     * Experimental full screen ability
     */
    $rootScope.fullScreen = function () { screenfull.toggle($('html')[0]); };





    /**
     * Detect OS for some specific styling issues
     */
    if ($.os.windows)
    {
      $('#loading p').css({
        paddingTop: '130px'
      });
    }





    

    // if (!$config.profile.mobileApp.status) $('#copyrights span.muted').css({right: 0});

    // $rootScope.downloadMobileApp = function ()
    // {
    //   $rootScope.statusBar.display('Instructies aan het verzenden...');

    //   Messages.email()
    //   .then(function (result)
    //   {
    //     $rootScope.notifier.success('Controleer uw inbox voor de instructies.');

    //     $rootScope.statusBar.off();
    //   })
    // }
    
	$rootScope.getTeamMemberById = function(memberId) {
		var teams_local = angular.fromJson(Storage.get("Teams"));
		var member;
		angular.forEach(teams_local, function(team, index) {

			var mems = angular.fromJson(Storage.get(team.uuid));
			angular.forEach(mems, function(mem, index) {
				if (mem.uuid == memberId) {
					member = mem;
					return;
				}
			});
		});

		if(typeof member == "undefined"){
			member = {uuid : memberId ,
					 firstName : memberId,
					 lastName : '',					
					};
		}
		return member;
	};

	$rootScope.getClientByID = function(clientId) {
		var ret;
		var clients_Not_In_Group = angular.fromJson(Storage.get("clients"));

		angular.forEach(clients_Not_In_Group, function(client, index) {
			if (clientId == client.uuid) {
				ret = client;
				return;
			}
		});

		if (ret == null) {
			var groups = angular.fromJson(Storage.get("ClientGroups"));
			angular.forEach(groups, function(group, index) {
				var cts = angular.fromJson(Storage.get(group.id));

				angular.forEach(cts, function(client, index) {
					if (client.uuid = clientId) {
						ret = client;
						return;
					}
				});

			});
		}

		return ret;
	}; 
	
	/**
	 * Here we need to find the clients for this team member, 
	 * 1> get the team,
	 * 2> find the groups belong to this team,
	 * 3> get all the clients under the group
	 */
	$rootScope.getClientsByTeam = function(teamIds) {
		var clients = [];
		var clientIds = [];
		angular.forEach(teamIds, function(teamId) {
			var teamGroups = angular.fromJson(Storage.get('teamGroup_' + teamId));
			angular.forEach(teamGroups, function(teamGrp) {
				var gMembers = angular.fromJson(Storage.get(teamGrp.id));
				angular.forEach(gMembers, function(mem) {
					if(clientIds.indexOf(mem.uuid) == -1){
						clientIds.add(mem.uuid);
						
						var clt = {uuid : mem.uuid, name : mem.firstName + " " + mem.lastName};
						clients.add(clt);
					}
					
				});
			});
		});
		
		return clients;
	}; 

	/**
	 * Here we need to find the team members that can actually take this client
	 * 1> get the team link to this client group ,
	 * 2> get the members in the team. 
	 */
	$rootScope.getMembersByClient = function(clientGroup){
		var members = [];
		var memberIds = [];
		var teams = angular.fromJson(Storage.get('Teams'));
		angular.forEach(teams,function(team){
			var teamGroups = angular.fromJson(Storage.get('teamGroup_' + team.uuid));
			angular.forEach(teamGroups, function(teamGrp) {
				if(clientGroup == teamGrp.id){
					var mebrs = angular.fromJson(Storage.get(team.uuid));
					angular.forEach(mebrs,function(mem){
						if(memberIds.indexOf(mem.uuid) == -1){
							memberIds.add(mem.uuid);
							
							var tm = {uuid : mem.uuid, name : mem.firstName + " " + mem.lastName};
							members.add(tm);
						}
					});
				}
			});
		});
		
		return members;
	};
    
  }
]);


/**
 * Sticky timeline header
 */
// $('#mainTimeline .timeline-frame div:first div:first').css({'top': '0px'});'use strict';


angular.module('WebPaige.Modals.User', ['ngResource'])


/**
 * User
 */
.factory('User', 
[
	'$resource', '$config', '$q', '$location', 'Storage', '$rootScope', 
	function ($resource, $config, $q, $location, Storage, $rootScope) 
	{
	  var self = this;


	  var User = $resource();


	  var Login = $resource(
	    $config.host + 'login',
	    {
	    },
	    {
	      process: {
	        method: 'GET',
	        params: {username:'', passwordHash:''}
	      }
	    }
	  );


	  var Logout = $resource(
	    $config.host + 'logout',
	    {
	    },
	    {
	      process: {
	        method: 'GET',
	        params: {}
	      }
	    }
	  );


	  var MemberInfo = $resource(
	    $config.host + 'teamup/team/member',
	    {
	    },
	    {
	      get: {
	        method: 'GET',
	        params: {}
	      }
	    }
	  );


	  var Reset = $resource(
	    $config.host + '/passwordReset',
	    {
	    },
	    {
	      password: {
	        method: 'GET',
	        params: {uuid: '', path:''}
	      }
	    }
	  );

	  // var changePassword = $resource($config.host+'/passwordReset', 
	  //   {uuid: uuid,
	  //    pass: newpass,
	  //    key: key});
	  
	  
	  /**
	   * TODO
	   * RE-FACTORY
	   * 
	   * User login
	   */
	  User.prototype.password = function (uuid)
	  {
	    var deferred = $q.defer();

	    Reset.password(
	      {
	        uuid: uuid.toLowerCase(),
	        path: $location.absUrl()
	      }, 
	      function (result)
	      {
	        if (angular.equals(result, []))
	        {
	          deferred.resolve("ok");
	        }
	        else
	        {
	          deferred.resolve(result);
	        };
	      },
	      function (error)
	      {
	        deferred.resolve(error);
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * User login
	   */
	  User.prototype.login = function (uuid, pass) 
	  {    
	    var deferred = $q.defer();

	    Login.process({username: uuid, passwordHash: pass}, 
	      function (result) 
	      {
	        if (angular.equals(result, [])) 
	        {
	          deferred.reject("Something went wrong with login!");
	        }
	        else 
	        {
	          deferred.resolve(result);
	        };
	      },
	      function (error)
	      {
	        deferred.resolve(error);
	      }
	    );

	    return deferred.promise;
	  };
	  

	  /**
	   * RE-FACTORY
	   * change user password
	   */
	  User.prototype.changePass = function (uuid, newpass, key)
	  {
	    var deferred = $q.defer();
	    
	    /**
	     * RE-FACTORY
	     */
	    changePassword.get(
	      function (result)
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve(error);
	      }
	    );
	    
	    return deferred.promise;
	  }


	  /**
	   * User logout
	   */
	  User.prototype.logout = function () 
	  {    
	    var deferred = $q.defer();

	    Logout.process(null, 
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Get user resources
	   */
	  User.prototype.memberInfo = function () 
	  {    
	    var deferred = $q.defer();

	    MemberInfo.get(null, 
	      function (result) 
	      {
	        if (angular.equals(result, [])) 
	        {
	          deferred.reject("User has no resources!");
	        }
	        else 
	        {
	          Storage.add('resources', angular.toJson(result));

	          deferred.resolve(result);
	        }
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };

	  return new User;
	}
]);;'use strict';


angular.module('WebPaige.Modals.Profile', ['ngResource'])


/**
 * Profile modal
 */
.factory('Profile', 
[
	'$rootScope', '$config', '$resource', '$q', 'Storage', 'Teams',  'MD5',
	function ($rootScope, $config, $resource, $q, Storage, Teams,  MD5) 
	{
	  
	  
	  var Profile = $resource(
	    $config.host + 'teamup/team/member/:memberId/',{},{
	      get: {
	        method: 'GET'
	      },
	      save: {
	        method: 'PUT',	        
	      },
	      role: {
	        method: 'PUT',
	        params: {section: 'role'}
	      }
	    }
	  );
	  
	  var ProfileSave = $resource(
	    $config.host + 'teamup/team/:teamId/member/:memberId/',{},{
          save: {
            method: 'PUT',          
          }
        }
      ); 
	  
	  var ProfileImg = $resource(
          $config.host + 'teamup/team/member/:memberId/photourl',{},{
            getURL: {
              method: 'GET',
              isArray: false              
            }
          }
        ); 
	  
	  var Register = $resource(
	    $config.host + '/register',
	    {
	      direct: 'true',
	      module: 'default'
	    },
	    {
	      profile: {
	        method: 'GET',
	        params: {uuid: '', pass: '', name: '', phone: ''}
	      }
	    }
	  );


	  var Resources = $resource(
	    $config.host + '/resources',
	    {
	    },
	    {
	      get: {
	        method: 'GET',
	        params: {}
	      },
	      save: {
	        method: 'POST',
	        params: {
	          /**
	           * It seems like backend accepts data in request payload as body as well
	           */
	          //tags: ''
	        }
	      }
	    }
	  );


	  /**
	   * Change password for user
	   */
	  Profile.prototype.register = function (profile) 
	  {    
	    var deferred = $q.defer();

	    Register.profile(
	      {
	        uuid: 	profile.username,
	        pass: 	MD5(profile.password),
	        name: 	profile.name,
	        phone: 	profile.PhoneAddress
	      }, 
	      function (registered) 
	      {
	        Profile.prototype.role(profile.username, profile.role.id)
	        .then(function (roled)
	        {
	          Profile.prototype.save(profile.username, {
	            EmailAddress: profile.EmailAddress,
	            PostAddress: 	profile.PostAddress,
	            PostZip: 			profile.PostZip,
	            PostCity: 		profile.PostCity
	          }).then(function (resourced)
	          {
	            var calls = [];

	            angular.forEach(profile.groups, function (group, index)
	            {
	              calls.push(Groups.addMember({
	                id: 		profile.username,
	                group: 	group
	              }));
	            });

	            $q.all(calls)
	            .then(function (grouped)
	            {
	              deferred.resolve({
	                registered: registered,
	                roled: 			roled,
	                resourced: 	resourced,
	                grouped: 		grouped
	              });
	            });

	          }); // save profile

	        }); // role
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    ); // register
	   
	    return deferred.promise;
	  };


	  /**
	   * Set role of given user
	   */
	  Profile.prototype.role = function (id, role) 
	  {    
	    var deferred = $q.defer();

	    Profile.role(
	      {id: id}, 
	      role, 
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Change password for user
	   */
	  Profile.prototype.changePassword = function (passwords) 
	  {    
	    var deferred = $q.defer();

	    Resources.save(
	      null, 
	      { askPass: MD5(passwords.new1) }, 
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Get profile of given user
	   */
	  Profile.prototype.get = function (id, localize) 
	  {    
	    var deferred = $q.defer();

	    Profile.get({memberId: id}, function (result) 
	    {
	      if (id == $rootScope.app.resources.uuid) $rootScope.app.resources = result;

	      if (localize) Storage.add('resources', angular.toJson(result));

	      deferred.resolve({resources: result});
	    }, function(error){
	        console.log(error);
	    });

	    return deferred.promise;
	  };


	  /**
	   * Get profile of given user with slots
	   */
	  Profile.prototype.getWithSlots = function (id, localize, params) 
	  {
	    var deferred = $q.defer();

	    Profile.prototype.get(id, localize)
	    .then(function (resources)
	    {
	      Slots.user({
	        user: 	id,
	        start: 	params.start,
	        end: 		params.end
	      }).then(function (slots)
	      {
	        deferred.resolve(angular.extend(resources, {
	          slots: 		slots,
	          synced: 	new Date().getTime(),
	          periods: {
	            start: 	params.start * 1000,
	            end: 		params.end * 1000
	          }
	        }));        
	      }); // user slots
	    }); // profile get

	    return deferred.promise;
	  };


	  /**
	   * Get user slots
	   */
	  Profile.prototype.getSlots = function (id, params) 
	  {
	    var deferred = $q.defer();

	    Slots.user(
	    {
	      user:   id,
	      start: 	params.start / 1000,
	      end: 		params.end / 1000
	      // start:  params.start,
	      // end:    params.end
	    }).then(function (slots)
	    {
	      deferred.resolve({
	        slots: 	slots,
	        synced: new Date().getTime(),
	        periods: {
	          start: 	params.start,
	          end: 		params.end
	        }
	      });        
	    });

	    return deferred.promise;
	  };


	  /**
	   * Get local resource data
	   */
	  Profile.prototype.local = function () { return angular.fromJson(Storage.get('resources')) };


	  /**
	   * Save profile
	   */
	  Profile.prototype.save = function (id, resources) 
	  {
	    var deferred = $q.defer();
	    
	    ProfileSave.save(
	      {teamId : resources.teamUuids[0] , memberId: id  }, 
	      resources, 
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };
	  
	  /**
	   * get the upload URL
	   */
	  Profile.prototype.loadUploadURL = function(id){
	      var deferred = $q.defer();
	      
	      ProfileImg.getURL(
              {memberId : id},
              function(result){
                  deferred.resolve(result);
              },
              function(error){
                  deferred.resolve({error: error});	                  
              }
	      );
	      return deferred.promise;
	  };
	  
	  /**
	   * Create settings resources for user if it is missing
	   */
	  Profile.prototype.createSettings_ = function (id) 
	  {
	    var deferred = $q.defer();

	    Profile.prototype.get(id, false)
	    .then(function (result) 
	    {
	      if (result.settingsWebPaige == undefined || result.settingsWebPaige == null)
	      {
	        Profile.save(
	          {id: result.resources.uuid}, 
	          angular.toJson({ settingsWebPaige: $rootScope.config.defaults.settingsWebPaige }), 
	          function (result)
	          {
	            deferred.resolve({
	              status: 'modified',
	              resources: result
	            });
	          },
	          function (error)
	          {
	            deferred.resolve({error: error});
	          }
	        );
	      }
	      else
	      {
	        deferred.resolve({
	          status: 'full',
	          resources: result
	        });
	      }
	    });

	    return deferred.promise;
	  };


	  return new Profile;
	}
]);;/*jslint node: true */
/*global angular */
/*global $ */
/*global error */
'use strict';


angular.module('WebPaige.Modals.Core', ['ngResource'])


/**
 * Core modal
 */
.factory('Core',
[
	'$rootScope', '$resource', '$config', '$q', '$http',
	function ($rootScope, $resource, $config, $q, $http)
	{

	}
]);;'use strict';


angular.module('WebPaige.Modals.Teams', ['ngResource'])


/**
 * Teams modal
 */
.factory('Teams', 
[
    '$resource', '$config', '$q', 'Storage', '$rootScope', 
    function ($resource, $config, $q, Storage, $rootScope) 
    {
      var Teams = $resource(
        $config.host + 'teamup/team/',
        {
        },
        {
          query: {
            method: 'GET',
            params: {},
            isArray: true
          },
          get: {
            method: 'GET',
            params: {id:''}
          },
          save: {
            method: 'POST',
            params: {id:''}
          },
          edit: {
            method: 'PUT',
            params: {id:''}
          },
          remove: {
            method: 'DELETE',
            params: {id:''}
          }
//          search: {
//            method: 'POST',
//            params: {id:'', action:'searchPaigeUser'},
//            isArray: true
//          }
        }
      );


	
//		var Containers = $resource($config.host + '/node/:id/container', {
//		}, {
//			get : {
//				method : 'GET',
//				params : {
//					id : ''
//				},
//				isArray : true
//			}
//		});
//	
//		var Parents = $resource($config.host + '/parent', {
//		}, {
//			get : {
//				method : 'GET',
//				params : {},
//				isArray : true
//			}
//		});
	
		var TeamStatus = $resource($config.host + 'teamup/team/status/:teamId/', {
		}, {
			query : {
				method : 'GET',
				params : {},
				isArray : true
			}
		});
	
		var Team = $resource($config.host + 'teamup/team/:teamId/', {
		}, {
			edit : {
				method : 'PUT',
			},
			del : {
				method : 'DELETE'
			}
		});
	
		var Members = $resource($config.host + 'teamup/team/:teamId/member', {
		}, {
			save : {
				method : 'POST',
			}
		});
	
		var RemoveMembers = $resource($config.host + 'teamup/team/:teamId/removeMember', {
		}, {
			remove : {
				method : 'PUT',
			}
		});
	
		var cGroup = $resource($config.host + 'teamup/team/:teamId/clientGroups', {
		}, {
			query : {
				method : 'GET',
				params : {},
				isArray : true
			},
			add : {
				method : 'POST'
			}
		});
		
		var unAssignGroups = $resource($config.host + 'teamup/team/:teamId/unAssignClientGroups', {
		}, {
			unssign : {
				method : 'PUT',
			}
		});
		
		var updateGroups = $resource($config.host + 'teamup/team/:teamId/updateClientGroups', {
		}, {
			update : {
				method : 'PUT',
			}
		});
		
		var updateMembers = $resource($config.host + 'teamup/team/:teamId/updateMembers', {
		}, {
			update : {
				method : 'PUT',
			}
		}); 
		
		var Member = $resource($config.host + 'teamup/team/member', {
		}, {
			save : {
				method : 'POST',
			}
		}); 
		
		var TeamTasks = $resource($config.host + 'teamup/team/:teamId/tasks', {
		}, {
			query : {
				method : 'GET',
				params : {
					from : '',
					to: ''
				}
			}
		});
		
		var MembersNotInTeam = $resource($config.host + 'teamup/team/members', {
		}, {
			query : {
				method : 'GET',
				isArray : true
			}
		}); 
		
		var RemoveMember = $resource($config.host + 'teamup/team/member/:memberId', {
		}, {
			remove : {
				method : 'DELETE',
			}
		});
		
//      /**
//       * Get parent team data
//       */
//      Teams.prototype.parents = function (all) 
//      {   
//        var deferred = $q.defer();
//
//        Parents.get(
//          null, 
//          function (result) 
//          {
//            if (!all)
//            {
//              // console.warn('returned ===>', result.length);
//
//              if (result.length == 0)
//              {
//                deferred.resolve(null);
//              }
//              else
//              {
//                deferred.resolve(result[0].uuid);
//              }
//            }
//            else
//            {
//              deferred.resolve(result);
//            }
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;
//      };
//
//
//      /**
//       * TODO
//       * Extract only the Teams which are in the local list
//       * 
//       * Get container (parent) team data
//       */
//      Teams.prototype.containers = function (id) 
//      {   
//        var deferred  = $q.defer(),
//            cons      = [];
//
//        Containers.get(
//          {id: id}, 
//          function (result) 
//          {
//            /**
//             * team save call returns only uuid and that is parsed as json
//             * by angular, this is a fix for converting returned object to plain string
//             */
//            angular.forEach(result, function (_r, _i)
//            {
//              var returned = [];
//
//              angular.forEach(_r, function (chr, i) { returned += chr });
//
//              cons.push(returned);
//            });
//            
//            deferred.resolve(cons);
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;
//      };
//
//
      /**
       * Add Member to a team
       */
      Teams.prototype.addMember = function (id , memberIds)
      {
        var deferred = $q.defer();
        Members.save({teamId: id },memberIds, 
          function (result) 
          {
            deferred.resolve(result);
          },
          function (error)
          {
            deferred.resolve({error: error});
          }
        );

        return deferred.promise;    
      };


      /**
       * Remove member from team
       */
      Teams.prototype.delMember = function (tId,memberIds)
      {
        var deferred = $q.defer();

        RemoveMembers.remove({teamId: tId},  memberIds,
          function (result) 
          {
            deferred.resolve(result);
          },
          function (error)
          {
            deferred.resolve({error: error});
          }
        );

        return deferred.promise;    
      };
      
      /**
       * Add client groups to a team 
       */
      Teams.prototype.addGroup = function (id , groupIds)
      {
        var deferred = $q.defer();
        cGroup.add({teamId: id },groupIds, 
          function (result) 
          {
            deferred.resolve(result);
          },
          function (error)
          {
            deferred.resolve({error: error});
          }
        );

        return deferred.promise;    
      };
      
      /**
       * Remove client group from a team
       */
      Teams.prototype.delGroup = function (tId,groupIds)
      {
        var deferred = $q.defer();

        unAssignGroups.unssign({teamId: tId},  groupIds,
          function (result) 
          {
            deferred.resolve(result);
          },
          function (error)
          {
            deferred.resolve({error: error});
          }
        );

        return deferred.promise;    
      };
      
      /**
       * update client groups from a team (add and remove)
       */
      Teams.prototype.updateGroup = function (tId,changes)
      {
        var deferred = $q.defer();

        updateGroups.update({teamId: tId},  changes , 
          function (result) 
          {
            deferred.resolve(result);
          },
          function (error)
          {
            deferred.resolve({error: error});
          }
        );

        return deferred.promise;    
      };
      
      /** 
       * update the members in the Team. add and remove members from the Team
       * prevent  a concurrent issue. 
       */
      Teams.prototype.updateMemberRelation = function(tId,changes){
    	  var deferred = $q.defer();
    	  
    	  updateMembers.update({teamId: tId},  changes ,
			  function (result) 
	          {
	            deferred.resolve(result);
	          },
	          function (error)
	          {
	            deferred.resolve({error: error});
	          }	  
    	  );
    	  
    	  return deferred.promise;
      }
      
      /**
       * General query function from Teams and their members
       */
      Teams.prototype.query = function (only,routePara)
      {
        var deferred = $q.defer();
        
        Teams.query(
          function (teams) 
          {
            Storage.add('Teams', angular.toJson(teams));
            
            if (!only)
            {
              var calls = [];

              angular.forEach(teams, function (team, index)
              {
                if(routePara.uuid){
                    if(routePara.uuid == team.uuid){
                        calls.push(Teams.prototype.get(team.uuid));
                    }
                }else{
                    calls.push(Teams.prototype.get(team.uuid));
                }
              });

              $q.all(calls)
              .then(function (results)
              {
//                Teams.prototype.uniqueMembers();

                var data = {};

                data.members = {};

                angular.forEach(teams, function (team, gindex)
                {
                  data.teams = teams;

                  data.members[team.uuid] = [];

                  angular.forEach(results, function (result, mindex)
                  {
                      if(routePara.uuid){
                          if (result.id == team.uuid && routePara.uuid == team.uuid){
                              data.members[team.uuid] = result.data;
                          }else{
                              data.members[team.uuid] = angular.fromJson(Storage.get(team.uuid));
                          }
                      }else{
                          if (result.id == team.uuid){
                              data.members[team.uuid] = result.data;
                          }
                      }
                        
                  });
                });

                deferred.resolve(data);
              });
            }
            else
            {
              deferred.resolve(teams);
            }
            
          },
          function (error)
          {
            console.log("Error" + error);
            deferred.resolve({error: error});
          }
        );

        return deferred.promise;
      };
      
      /**
       * General query function from Teams and their members from local storage
       */
      Teams.prototype.queryLocal = function ()
      {
        var deferred = $q.defer();
        
        var teams_local = angular.fromJson(Storage.get("Teams"));
        
        var data = {};
        data.teams = teams_local;
        
        data.members = {};
        angular.forEach(teams_local, function (team, i){
            var members = angular.fromJson(Storage.get(team.uuid));
            data.members[team.uuid] = members; 
        });
        
        deferred.resolve(data);
        
        return deferred.promise;
      };
      
      /**
       * get members of the team
       */
      Teams.prototype.queryStatus = function( teamId){
          var deferred = $q.defer();
          TeamStatus.query({
          },function(result){
              deferred.resolve({
                  id: id,
                  data: returned
              });
          },function(error){
              deferred.resolve({error: error});
          });
          
      };
      
	     
		/**
		 * Get team data
		 */
	
		Teams.prototype.get = function(id) {
			var deferred = $q.defer();
	
			TeamStatus.query({
				teamId : id
			}, function(result) {
				/**
				 * DIRTY CHECK!
				 *
				 * Check for 'null' return from back-end
				 * if team is empty
				 */
				var returned;
	
				if (result.length == 4 && result[0][0] == 'n' && result[1][0] == 'u') {
					returned = [];
				} else {
					returned = result;
				};
	
				Storage.add(id, angular.toJson(returned));
	
				deferred.resolve({
					id : id,
					data : returned
				});
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
	
			return deferred.promise;
		};

//
//
//      /**
//       * Make an inuque list of members
//       */
//      Teams.prototype.uniqueMembers = function ()
//      {
//        angular.forEach(angular.fromJson(Storage.get('Teams')), function (team, index)
//        {
//          var members = angular.fromJson(Storage.get('members')) || {};
//
//          angular.forEach(angular.fromJson(Storage.get(team.uuid)), function (member, index)
//          {
//            members[member.uuid] = member;
//          });
//
//          Storage.add('members', angular.toJson(members));
//        });
//      };
//
//
      /**
       * Save team
       */
      Teams.prototype.save = function (team) 
      {
          var deferred = $q.defer();

       
          Teams.save(
            { id: $rootScope.app.resources.uuid }, 
            team, 
            function (result) 
            {
              deferred.resolve(result);
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          ); 
        

          return deferred.promise;
      };

      Teams.prototype.saveMember = function (member){
    	  var deferred = $q.defer();
    	  Member.save({},
			  member,
			  function(result){
				  deferred.resolve(result);
			  },function(error){
				  deferred.resolve({error: error});
			  }
    	  );
    	  
    	  return deferred.promise;
      };
//
//      /**
//       * Delete team
//       */
//      Teams.prototype.remove = function (id) 
//      {
//        var deferred = $q.defer();
//
//        Teams.remove(
//          {id: id}, 
//          function (result) 
//          {
//            deferred.resolve(result);
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;
//      };
//
//
//      /**
//       * Search candidate mambers
//       */
//      Teams.prototype.search = function (query) 
//      {
//        var deferred = $q.defer();
//
//        Teams.search(
//          null, 
//          {key: query}, 
//          function (results) 
//          {
//            var processed = [];
//
//            angular.forEach(results, function (result, index)
//            {
//              processed.push({
//                id: result.id,
//                name: result.name,
//                Teams: Teams.prototype.getMemberTeams(result.id)
//              });
//            });
//
//            deferred.resolve(processed);
//          },
//          function (error)
//          {
//            deferred.resolve({error: error});
//          }
//        );
//
//        return deferred.promise;
//      };
//
//
//      /**
//       * Get Teams of given member
//       */
//      Teams.prototype.getMemberTeams = function (id)
//      {
//        var Teams = angular.fromJson(Storage.get('Teams')),
//            memberTeams = [];
//
//        angular.forEach(Teams, function (team, index)
//        {
//          var localteam = angular.fromJson(Storage.get(team.uuid));
//
//          angular.forEach(localteam, function (member, index)
//          {
//            if (member.uuid === id)
//              memberTeams.push({
//                uuid: team.uuid,
//                name: team.name
//              });
//          });
//        });
//
//        return memberTeams;
//      };
//
//
        /**
        * Save team
        */
       Teams.prototype.edit = function (team) 
       {
         var deferred = $q.defer();
    
         /**
          * Check if team id supplied
          * if save submitted from add / edit form
          */
         if (team.uuid){
           Team.edit({teamId: team.uuid}, team, function (result) 
           {
             deferred.resolve(result);
           });
         }
         else
         {
         };
    
         return deferred.promise;
       };
      
       /**
        * try  to preload the image from here, that ng-src can use the cache.
        */
       Teams.prototype.loadImg = function(imgURL){
          
          var LoadImg = $resource(
               imgURL,{
               },{
                   get : {
                       method: 'GET',
                   }
               }
         );
          
         var deferred = $q.defer();
          
         LoadImg.get(function(result){
             deferred.resolve(result); 
         },function(error){
         	deferred.resolve(error);
         }); 
         
         return deferred.promise;
       };
       
       
       
		/**
		 *  load the callin number for the team
		 */
		Teams.prototype.loadTeamCallinNumber = function(teamUuid) {
			var TeamNumber = $resource($config.host + 'teamup/team/:teamId/phone', {
			}, {
				get : {
					method : 'GET',
				}
			});

			var deferred = $q.defer();

			TeamNumber.get({
				teamId : teamUuid
			}, function(result) {
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});

			return deferred.promise;
		}; 

       
		/**
		 * load the client groups belong to all the teams
		 */
		Teams.prototype.queryClientGroups = function(teams) {
			var deferred = $q.defer();

			var calls = [];
			angular.forEach(teams, function(team, index) {
				calls.push(Teams.prototype.getGroup(team.uuid));
			});
			
			$q.all(calls).then(function(results) {
				//                Teams.prototype.uniqueMembers();

				var data = {};

				data.groups = {};

				angular.forEach(teams, function(team, gindex) {
					data.teams = teams;

					data.groups[team.uuid] = [];

					angular.forEach(results, function(result, mindex) {
						data.groups[team.uuid] = result.data;
					});
				});

				deferred.resolve(data);
			});

			return deferred.promise;
		}; 


		/**
		 * get  the client group for specific team
		 */
		Teams.prototype.getGroup = function(id) {
			var deferred = $q.defer();
	
			cGroup.query({
				teamId : id
			}, function(result) {
				/**
				 * DIRTY CHECK!
				 *
				 * Check for 'null' return from back-end
				 * if team is empty
				 */
				var returned;
	
				if (result.length == 4 && result[0][0] == 'n' && result[1][0] == 'u') {
					returned = [];
				} else {
					returned = result;
				};
	
				Storage.add("teamGroup_" + id, angular.toJson(returned));
	
				deferred.resolve({
					id : id,
					data : returned
				});
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
	
			return deferred.promise;
		};

       
      
		/**
		 * add or remove the members from the teams
		 */
		Teams.prototype.manage = function(changes) {
			var deferred = $q.defer();
	
			var calls = [];
	
			angular.forEach(changes, function(change, teamId) {
				if(change.a.length > 0 && change.r.length == 0) {
					calls.push(Teams.prototype.addMember(teamId, {
						ids : change.a
					}));
				}
				if(change.r.length > 0 && change.a.length == 0) {
					calls.push(Teams.prototype.delMember(teamId, {
						ids : change.r
					}));
				}
				if(change.a.length > 0 && change.r.length > 0){
					calls.push(Teams.prototype.updateMemberRelation(teamId, {
						remove : change.r,
						add : change.a
					}));
				}
			});
	
			$q.all(calls).then(function(results) {
				//                Teams.prototype.uniqueMembers();
				var queryCalls = [];
	
				var data = {};
	
				angular.forEach(changes, function(change, teamId) {
					queryCalls.push(Teams.prototype.get(teamId));
				});
	
				$q.all(queryCalls).then(function(results) {
					deferred.resolve(data);
				});
			});
			return deferred.promise;
		};

       	/**
       	 * add or remove the client group from the teams 
       	 */
    	Teams.prototype.manageGroups = function(changes) {
			var deferred = $q.defer();
	
			var calls = [];
	
			angular.forEach(changes, function(change, teamId) {
				if(change.a.length > 0 && change.r.length == 0) {
					calls.push(Teams.prototype.addGroup(teamId, {
						ids : change.a
					}));
				}
				if(change.r.length > 0 && change.a.length == 0) {
					calls.push(Teams.prototype.delGroup(teamId, {
						ids : change.r
					}));
				}
				if(change.a.length > 0 && change.r.length > 0){
					// to prevent the race condition when do "removing and adding " on a team at same time
					// so just create new REST call to do it backend
					calls.push(Teams.prototype.updateGroup(teamId, {
						remove : change.r,
						add : change.a
					}));

				}
			}); 
	
			$q.all(calls).then(function(changeResults) {
				
				var data = changeResults;
					
				var queryCalls = [];	
				angular.forEach(changes, function(change, teamId) {
					queryCalls.push(Teams.prototype.getGroup(teamId));
				});
	
				$q.all(queryCalls).then(function(results) {
					deferred.resolve(data);
				});
	
			});
			
			return deferred.promise;
		};   
	     
		/**
		 * get  the client group for specific team
		 */
		Teams.prototype.getTeamTasks = function(id,start,end) {
			var deferred = $q.defer();
	
			TeamTasks.query({
				teamId : id , from : start, to : end 
			}, function(result) {
				
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
	
			return deferred.promise;
		};
		
		/**
		 * get  the members that not belong to any teams 
		 */
		Teams.prototype.queryMembersNotInTeams = function() {
			var deferred = $q.defer();
	
			MembersNotInTeam.query({}, function(result) {
				
				Storage.add("members", angular.toJson(result));
				
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
	
			return deferred.promise;
		};
		
		/**
		 * Delete a team
		 */
		Teams.prototype.deleteTeam = function(id){
			var deferred = $q.defer();
			
			Team.delete({
				teamId : id  
			}, function(result) {
				deferred.resolve(result.result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
	
			return deferred.promise;
		}
		
		/**
		 * delete team member 
		 */
		Teams.prototype.deleteMember = function(id){
			
			var deferred = $q.defer();
			
			RemoveMember.remove({
				memberId : id
			},function(result){
				deferred.resolve(result);
			},function(error){
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		}
		
      return new Teams;
    }
]);;'use strict';


angular.module('WebPaige.Modals.Clients', ['ngResource'])


/**
 * Teams modal
 */
.factory('Clients', 
[
    '$resource', '$config', '$q', 'Storage', '$rootScope', 
    function ($resource, $config, $q, Storage, $rootScope)
    {
        
		var ClientGroups = $resource($config.host + 'teamup/client/clientGroups/', {
		}, {
			query : {
				method : 'GET',
				params : {},
				isArray : true
			},
			get : {
				method : 'GET',
				params : {
					id : ''
				}
			},
			save : {
				method : 'POST',
				params : {
					id : ''
				}
			},
			edit : {
				method : 'PUT',
				params : {
					id : ''
				}
			},
			remove : {
				method : 'DELETE',
				params : {
					id : ''
				}
			}
		});
	
		var Clients_ByGroupId = $resource($config.host + 'teamup/client/clientGroup/:clientGroupId/clients/', {}, {
			get : {
				method : 'GET',
				params : {},
				isArray : true
			},
			save : {
				method : 'POST',
			},
			remove : {
				method : 'DELETE',
			}
		});
	
		var ClientGroup = $resource($config.host + 'teamup/clientGroup/:clientGroupId', {}, {
			save : {
				method : 'POST',
			},
			edit : {
				method : 'PUT',
			},
			del : {
				method : 'DELETE',
			}
		});
	
		var Client = $resource($config.host + 'teamup/client/:clientId', {}, {
			save : {
				method : 'POST',
			},
			edit : {
				method : 'PUT',
			},
			del : {
				method : 'DELETE'
			},
		});


        
        
		var Clients = $resource($config.host + 'teamup/client/clients', {}, {
			query : {
				method : 'GET',
				params : {},
				isArray : true
			}
		});

		var ClientReports = $resource($config.host + 'teamup/client/:clientId/reports', {}, {
            query : {
                method : 'GET',
                params : {},
                isArray : true
            }
        }); 
		
		var ClientsRemove = $resource($config.host + 'teamup/client/clientGroup/:clientGroupId/removeClients/', {}, {
            remove : {
                method : 'PUT',
            }
        });
		
		var ClientGroupReports = $resource($config.host + 'teamup/clientGroup/:clientGroupId/reports', {}, {
            query : {
                method : 'GET',
                params : {},
                isArray : true
            }
        });
        
        var GroupTasks = $resource($config.host + 'teamup/clientGroup/:clientGroupId/tasks', {
		}, {
			query : {
				method : 'GET',
				params : {
					from : '',
					to: ''
				}
			}
		});
        
        var ClientReport = $resource($config.host + 'teamup/client/:clientId/report', {
		}, {
			save : {
				method : 'POST',
			},
			remove : {
				method : 'DELETE',
				params : {reportId : ''}
			}
		}); 
        
  	  	var ClientImg = $resource(
          $config.host + 'teamup/client/:clientId/photourl',{},{
            getURL: {
              method: 'GET',
              isArray: false              
            }
          }
        ); 
        
		/**
		 * get the client groups and the clients
		 */
		ClientGroups.prototype.query = function(only, routePara) {
			var deferred = $q.defer();

			ClientGroups.query(function(cGroups) {
				Storage.add('ClientGroups', angular.toJson(cGroups));

				if(!only) {
					var calls = [];

					angular.forEach(cGroups, function(clientGroup, index) {
						if(routePara.uuid) {
							if(routePara.uuid == clientGroup.id) {
								calls.push(ClientGroups.prototype.get(clientGroup.id));
							}
						} else {
							calls.push(ClientGroups.prototype.get(clientGroup.id));
						}

					});

					$q.all(calls).then(function(results) {
						//                        Teams.prototype.uniqueMembers();

						var data = {};

						data.clients = {};

						angular.forEach(cGroups, function(cGroup, gindex) {
							data.clientGroups = cGroups;

							data.clients[cGroup.id] = [];

							angular.forEach(results, function(result, mindex) {
								if(routePara.uuid) {
									if(result.id == cGroup.id && routePara.uuid == cGroup.id) {
										data.clients[cGroup.id] = result.data;
									} else {
										data.clients[cGroup.id] = angular.fromJson(Storage.get(cGroup.id));
									}
								} else {
									if(result.id == cGroup.id) {
										data.clients[cGroup.id] = result.data;
									}
								}

							});
						});
						if( typeof data.clientGroups == 'undefined') {
							data.clientGroups = {};
						}

						deferred.resolve(data);
					});
				} else {
					deferred.resolve(cGroups);
				}

			}, function(error) {
				console.log("Error" + error);
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		};


        
        /**
         * Get team data ( clients in the group)
         */
        ClientGroups.prototype.get = function (id)
        {   
          var deferred = $q.defer();

          Clients_ByGroupId.get(
            {clientGroupId : id}, 
            function (result) 
            {
              /**
               * DIRTY CHECK!
               * 
               * Check for 'null' return from back-end
               * if team is empty
               */
              var returned;

              if (result.length == 4 && 
                  result[0][0] == 'n' && 
                  result[1][0] == 'u')
              {
                returned = [];
              }
              else
              {
                returned = result;
              };

              Storage.add(id, angular.toJson(returned));

              deferred.resolve({
                id: id,
                data: returned
              });
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          );

          return deferred.promise;
        };
        
        /**
         * add new client group
         */
        ClientGroups.prototype.saveGroup = function(group){
        	var deferred = $q.defer();
        	
        	ClientGroup.save(
        		group,
        		function(result){
        			Storage.add(result.id, angular.toJson(result));
        			
        			deferred.resolve(result);
        		},function(error){
        			deferred.resolve({error: error});
        		}
        	);
        	
        	return deferred.promise;
        };
        
        /**
         * add new client 
         */
        ClientGroups.prototype.save = function(client){
        	var deferred = $q.defer();
        	
        	Client.save(
        		client,
        		function(result){
        			Storage.add(result.id, angular.toJson(result));
        			
        			deferred.resolve(result);
        		},function(error){
        			deferred.resolve({error: error});
        		}
        	);
        	
        	return deferred.promise;
        };
        
        /**
         * update client group
         */
        ClientGroups.prototype.edit = function(clientGroup){
        	var deferred = $q.defer();
		
		     /**
		      * Check if team id supplied
		      * if save submitted from add / edit form
		      */
		     if (clientGroup.id){
		       ClientGroup.edit({clientGroupId: clientGroup.id}, clientGroup, function (result) 
		       {
		         deferred.resolve(result);
		       });
		     }
		     
		     return deferred.promise;
        };
        
        /**
         * update client 
         */
        ClientGroups.prototype.updateClient = function(client){
        	var deferred = $q.defer();
        	
        	Client.edit(
        		{clientId: client.uuid },
        		client,
        		function(result){
        			deferred.resolve(result);
        		},function(error){
        			deferred.resolve({error: error});
        		}
        	);
        	
        	return deferred.promise;
        };
        
        
          
		/**
		 * Add Member to a team
		 */
		ClientGroups.prototype.addClient = function(id, memberIds) {
			var deferred = $q.defer();
			Clients_ByGroupId.save({
				clientGroupId : id
			}, memberIds, function(result) {
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		};


		
		    
		/**
		 * Remove member from team
		 */
		ClientGroups.prototype.delClient = function(id, memberIds) {
			var deferred = $q.defer();
	
			ClientsRemove.remove({
				clientGroupId : id
			}, memberIds, function(result) {
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		};

		
		// private function 
		var getClientFromLocal = function(clientId){
			var ret;
			var cGrps = angular.fromJson(Storage.get("ClientGroups"));
			angular.forEach(cGrps,function(cGrp,i){
				var clients = angular.fromJson(Storage.get(cGrp.id));
				angular.forEach(clients,function(client,j){
					if(client.uuid == clientId){
						ret = client;
					}
				});
			});
			return ret;
		};
		
		/**
		 * add or remove the clientfrom the client group
		 */
		ClientGroups.prototype.manage = function(changes) {
			var deferred = $q.defer();
		
			var calls = [];
		
			angular.forEach(changes, function(change, clientGroupId) {
				if(change.a.length > 0) {
					calls.push(ClientGroups.prototype.addClient(clientGroupId, {
						ids : change.a
					}));
				}
				if(change.r.length > 0) {
					calls.push(ClientGroups.prototype.delClient(clientGroupId, {
						ids : change.r
					}));
				}
			});
		
			$q.all(calls).then(function(results) {
				//                Teams.prototype.uniqueMembers();
				var queryCalls = [];
		
				var data = {};
		
				var refreshGroups = [];
				angular.forEach(changes, function(change, clientGroupId) {
					// refresh the groups that used to have the client inside. 
					refreshGroups.add(clientGroupId);
					if(change.a.length > 0){
						angular.forEach(change.a,function(clientId){
							var client = getClientFromLocal(clientId);
							if(typeof client != 'undefined' && refreshGroups.indexOf(client.clientGroupUuid) == -1){
								refreshGroups.add(client.clientGroupUuid);
								queryCalls.push(ClientGroups.prototype.get(client.clientGroupUuid));
							}
						});
					}
					
					queryCalls.push(ClientGroups.prototype.get(clientGroupId));
				});
		
				$q.all(queryCalls).then(function(results) {
					deferred.resolve(data);
				});
			});
			return deferred.promise;
		};


				
		/**
		 * get all the clients , in or not in the client gourps
		 */
		ClientGroups.prototype.queryAll = function(changes) {
			var deferred = $q.defer();
	
			Clients.query(function(clients) {
				Storage.add('clients', angular.toJson(clients));
				deferred.resolve(clients);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
	
			return deferred.promise;
		};

	
	
		/**
		 * get reports by the client id
		 */
		ClientGroups.prototype.queryReports = function(cId) {
			var deferred = $q.defer();

			ClientReports.query({
				clientId : cId
			}, function(reports) {
				Storage.add('reports_' + cId, angular.toJson(reports));
				deferred.resolve(reports);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		}; 

	
      
	
		/**
		 * try  to preload the image from here, that ng-src can use the cache.
		 */
		ClientGroups.prototype.loadImg = function(imgURL) {

			var LoadImg = $resource(imgURL, {
			}, {
				get : {
					method : 'GET',
				}
			});

			var deferred = $q.defer();

			LoadImg.get(function(result) {
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		}; 

	
	
		/**
		 * get client groups and clients from local storage
		 */
		ClientGroups.prototype.queryLocal = function() {
			var deferred = $q.defer();

			var clientGroups_local = angular.fromJson(Storage.get("ClientGroups"));

			var data = {};
			data.clientGroups = clientGroups_local;

			data.clients = {};
			angular.forEach(clientGroups_local, function(clientGroup, i) {
				var clients = angular.fromJson(Storage.get(clientGroup.id));
				data.clients[clientGroup.id] = clients;
			});

			deferred.resolve(data);

			return deferred.promise;
		}; 

		/**
		 * get reports by the client group Id
		 */
		ClientGroups.prototype.queryGroupReports = function(cId) {
			var deferred = $q.defer();
			
			ClientGroupReports.query({
				clientGroupId : cId
			}, function(reports) {
//				Storage.add('reports_' + cId, angular.toJson(reports));
				
				deferred.resolve(reports);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			
			return deferred.promise;
		};
		
	
		/**
		 * get  the client group for specific team
		 */
		ClientGroups.prototype.getClientTasks = function(id, start, end) {
			var deferred = $q.defer();

			GroupTasks.query({
				clientGroupId : id,
				from : start,
				to : end
			}, function(result) {

				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});

			return deferred.promise;
		}; 
		
		/**
		 * delete the client group 
		 */
		ClientGroups.prototype.deleteClientGroup = function(id){
			var deferred = $q.defer();

			ClientGroup.del({
				clientGroupId : id				
			}, function(result) {
				var rs = angular.fromJson(result)
				deferred.resolve(rs);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});

			return deferred.promise;
		}
		
		ClientGroups.prototype.deleteClient = function(id){
			var deferred = $q.defer();

			Client.del({
				clientId : id				
			}, function(result) {
				var rs = angular.fromJson(result)
				deferred.resolve(rs);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});

			return deferred.promise;
		};
		
		// add or edit report
		ClientGroups.prototype.saveReport = function(id,report){
			var deferred = $q.defer();

			ClientReport.save({
				clientId : id				
			}, report,function(result) {
				var rs = angular.fromJson(result)
				deferred.resolve(rs);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});

			return deferred.promise;
		};
		
		// remove the report
		ClientGroups.prototype.removeReport = function(cId,rId){
			var deferred = $q.defer();
			ClientReport.remove({
				clientId : cId,
				reportId : rId
			},function(result){
				var rs = angular.fromJson(result)
				deferred.resolve(rs);
			},function(error){
				deferred.resolve({
					error : error
				});
			});
			
			return deferred.promise;
		};
		

		/**
		 * get the upload URL
		 */
		ClientGroups.prototype.loadUploadURL = function(id) {
			var deferred = $q.defer();

			ClientImg.getURL({
				clientId : id
			}, function(result) {
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		};
	

        return new ClientGroups; 
    }
    
  
   
   
    
    
]);;'use strict';


angular.module('WebPaige.Modals.Settings', ['ngResource'])


/**
 * Settings module
 */
.factory('Settings', 
[
	'$rootScope', '$config', '$resource', '$q', 'Storage', 'Profile',
	function ($rootScope, $config, $resource, $q, Storage, Profile) 
	{
	  /**
	   * Define settings resource
	   * In this case it empty :)
	   */
	  var Settings = $resource();


	  /**
	   * Get settings from localStorage
	   */
	  Settings.prototype.get = function ()
	  {
	    return angular.fromJson(Storage.get('resources')).settingsWebPaige || {};
	  };


	  /**
	   * Save settings
	   */
	  Settings.prototype.save = function (id, settings) 
	  {
	    var deferred = $q.defer();

	    Profile.save(id, {
	      settingsWebPaige: angular.toJson(settings)
	    })
	    .then(function (result)
	    {
	      deferred.resolve({
	        saved: true
	      });
	    });

	    return deferred.promise;
	  };


	  return new Settings;
	}
]);;/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Modals.Messages', ['ngResource'])

/**
 * Messages model
 */
.factory('Messages', ['$rootScope', '$config', '$resource', '$q', 'Storage', '$http',
function($rootScope, $config, $resource, $q, Storage, $http) {
	var Messages = $resource($config.host + 'teamup/team/teamMessage/', {
	}, {
		query : {
			method : 'GET',
			params : {
				action : '',
				// 0: 'dm'
				0 : 'all',
				status : 'READ',
				limit : 50,
				offset : 0
			},
			isArray : true
		},
		get : {
			method : 'GET',
			params : {}
		},
		send : {
			method : 'POST',			
		},
		save : {
			method : 'POST',
			params : {}
		},
		changeState : {
			method : 'POST',
			params : {
				action : 'changeState'
			}
		},
		remove : {
			method : 'POST',
			params : {
				action : 'deleteQuestions'
			}
		}
	});

	

	var TeamMessage = $resource($config.host + 'teamup/team/teamMessage/:teamId', {}, {
		query : {
			method : 'GET',
			params : {},
			isArray : true
		},
	});

	Messages.prototype.queryTeamMessage = function(tId){
		var deferred = $q.defer();
		
		TeamMessage.query({
			teamId: tId
		},function(result){
			deferred.resolve(result);
		},function(error){
			deferred.resolve({
				error : error
			});
		});
		
		return deferred.promise;
	};

	Messages.prototype.sendTeamMessage = function(messageObj){
		var deferred = $q.defer();
		
		Messages.send(messageObj,function(result){
			deferred.resolve(result);
		},function(error){
			deferred.resolve({
				error : error
			});
		});
		
		return deferred.promise;
	};
	
	return new Messages;
}]); ;'use strict';


angular.module('WebPaige.Modals.Slots', ['ngResource'])


/**
 * Slots
 */
.factory('Slots', 
[
	'$rootScope', '$config', '$resource', '$q', 'Storage', 'Dater', 'Sloter', 
	function ($rootScope, $config, $resource, $q, Storage, Dater, Sloter) 
	{
	  /**
	   * Define Slot Resource from back-end
	   */
	  var Slots = $resource(
	    $config.host + 'teamup/team/member/tasks/:member/',{},
	    {
	      query: {
	        method: 'GET',
	        params: {start:'', end:''},
	        isArray: true
	      },
	      change: {
	        method: 'PUT',
	      },
	      save: {
	        method: 'POST',
	      },
	      remove: {
	        method: 'DELETE',
	        params: {taskId: ''}
	      }
	    }
	  );
	  
	  /**
	   * Group aggs resource
	   */
	  var Aggs = $resource(
	    $config.host + '/calc_planning/:id',
	    {
	    },
	    {
	      query: {
	        method: 'GET',
	        params: {id: '', start:'', end:''},
	        isArray: true
	      }
	    }
	  );


	  /**
	   * Wishes resource
	   */
	  var Wishes = $resource(
	    $config.host + '/network/:id/wish',
	    {
	    },
	    {
	      query: {
	        method: 'GET',
	        params: {id: '', start:'', end:''},
	        isArray: true
	      },
	      save: {
	        method: 'PUT',
	        params: {id: ''}
	      },
	    }
	  );


	  /**
	   * Get group wishes
	   */
	  Slots.prototype.wishes = function (options) 
	  {
	    var deferred  = $q.defer(),
	        params    = {
	          id:     options.id,
	          start:  options.start,
	          end:    options.end
	        };

	    Wishes.query(params, 
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Set group wish
	   */
	  Slots.prototype.setWish = function (options) 
	  {
	    var deferred = $q.defer(),
	        params = {
	          start:      options.start,
	          end:        options.end,
	          wish:       options.wish,
	          recurring:  options.recursive
	        };

	    Wishes.save({id: options.id}, params, 
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Get group aggs
	   */
	  Slots.prototype.aggs = function (options) 
	  {
	    var deferred = $q.defer(),
	        params = {
	          id:     options.id,
	          start:  options.start,
	          end:    options.end
	        };

	    if (options.division != undefined) params.stateGroup = options.division;

	    Aggs.query(params, 
	      function (result) 
	      {
	        var stats = Stats.aggs(result);

	        Slots.prototype.wishes(params)
	        .then(function (wishes)
	        {
	          deferred.resolve({
	            id:       options.id,
	            division: options.division,
	            wishes:   wishes,
	            data:     result,
	            ratios:   stats.ratios,
	            durations: stats.durations
	          });
	        });
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Get group aggs for pie charts
	   */
	  Slots.prototype.pie = function (options) 
	  {
	    var deferred  = $q.defer(),
	        now       = Math.floor(Date.now().getTime() / 1000),
	        periods   = Dater.getPeriods(),
	        current   = Dater.current.week(),
	        weeks      = {
	          current:  {
	            period: periods.weeks[current],
	            data:   [],
	            shortages: []
	          },
	          next: {
	            period: periods.weeks[current + 1],
	            data:   [],
	            shortages: []
	          }
	        },
	        slicer    = weeks.current.period.last.timeStamp;

	    Aggs.query({
	      id:     options.id,
	      start:  weeks.current.period.first.timeStamp / 1000,
	      end:    weeks.next.period.last.timeStamp / 1000
	    }, 
	      function (results)
	      {
	        var state;

	        // Check whether it is only one
	        if (results.length > 1)
	        {
	          angular.forEach(results, function (slot, index)
	          {
	            // Fish out the current
	            if (now >= slot.start && now <= slot.end) state = slot;

	            // Slice from end of first week
	            if (slicer <= slot.start * 1000)
	            {
	              weeks.next.data.push(slot);
	            }
	            else if (slicer >= slot.start * 1000)
	            {
	              weeks.current.data.push(slot)
	            };
	          });

	          // slice extra timestamp from the last of current week dataset and add that to week next
	          var last        = weeks.current.data[weeks.current.data.length-1],
	              next        = weeks.next.data[0],
	              difference  = (last.end * 1000 - slicer) / 1000,
	              currents    = [];

	          // if start of current of is before the start reset it to start
	          weeks.current.data[0].start = weeks.current.period.first.timeStamp / 1000;

	          // if there is a leak to next week adjust the last one of current week and add new slot to next week with same values
	          if (difference > 0)
	          {
	            last.end = slicer / 1000;

	            weeks.next.data.unshift({
	              diff: last.diff,
	              start: slicer / 1000,
	              end: last.end,
	              wish: last.wish
	            });
	          };

	          // shortages and back-end gives more than asked sometimes, with returning values out of the range which being asked !
	          angular.forEach(weeks.current.data, function (slot, index)
	          {
	            if (slot.end - slot.start > 0) currents.push(slot);

	            // add to shortages
	            if (slot.diff < 0) weeks.current.shortages.push(slot);
	          });

	          // reset to start of current weekly begin to week begin
	          currents[0].start = weeks.current.period.first.timeStamp / 1000;

	          // add to shortages
	          angular.forEach(weeks.next.data, function (slot, index)
	          {
	            if (slot.diff < 0) weeks.next.shortages.push(slot);
	          });

	          deferred.resolve({
	            id:       options.id,
	            name:     options.name,
	            weeks:    {
	              current: {
	                data:   currents,
	                state:  state,
	                shortages: weeks.current.shortages,
	                start: {
	                  date:       new Date(weeks.current.period.first.timeStamp).toString($config.formats.date),
	                  timeStamp:  weeks.current.period.first.timeStamp
	                },
	                end: {
	                  date:       new Date(weeks.current.period.last.timeStamp).toString($config.formats.date),
	                  timeStamp:  weeks.current.period.last.timeStamp
	                },
	                ratios: Stats.pies(currents)
	              },
	              next: {
	                data:   weeks.next.data,
	                shortages: weeks.next.shortages,
	                start: {
	                  date:       new Date(weeks.next.period.first.timeStamp).toString($config.formats.date),
	                  timeStamp:  weeks.next.period.first.timeStamp
	                },
	                end: {
	                  date:       new Date(weeks.next.period.last.timeStamp).toString($config.formats.date),
	                  timeStamp:  weeks.next.period.last.timeStamp
	                },
	                ratios: Stats.pies(weeks.next.data)
	              }
	            }
	          }); 
	        }
	        else
	        {
	          if (results[0].diff == null) results[0].diff = 0;
	          if (results[0].wish == null) results[0].wish = 0;

	          var currentWeek = [{
	                start:  weeks.current.period.first.timeStamp / 1000,
	                end:    weeks.current.period.last.timeStamp / 1000,
	                wish:   results[0].wish,
	                diff:   results[0].diff
	              }],
	              nextWeek = [{
	                start:  weeks.next.period.first.timeStamp / 1000,
	                end:    weeks.next.period.last.timeStamp / 1000,
	                wish:   results[0].wish,
	                diff:   results[0].diff
	              }];
	          
	          if (currentWeek[0].diff < 0) weeks.current.shortages.push(currentWeek[0]);
	          if (nextWeek[0].diff < 0) weeks.next.shortages.push(nextWeek[0]);

	          deferred.resolve({
	            id:       options.id,
	            name:     options.name,
	            weeks:    {
	              current: {
	                data: currentWeek,
	                state: currentWeek,
	                shortages: weeks.current.shortages,
	                start: {
	                  date:       new Date(weeks.current.period.first.timeStamp).toString($config.formats.date),
	                  timeStamp:  weeks.current.period.first.timeStamp
	                },
	                end: {
	                  date:       new Date(weeks.current.period.last.timeStamp).toString($config.formats.date),
	                  timeStamp:  weeks.current.period.last.timeStamp
	                },
	                ratios: Stats.pies(currentWeek)
	              },
	              next: {
	                data: nextWeek,
	                shortages: weeks.next.shortages,
	                start: {
	                  date:       new Date(weeks.next.period.first.timeStamp).toString($config.formats.date),
	                  timeStamp:  weeks.next.period.first.timeStamp
	                },
	                end: {
	                  date:       new Date(weeks.next.period.last.timeStamp).toString($config.formats.date),
	                  timeStamp:  weeks.next.period.last.timeStamp
	                },
	                ratios: Stats.pies(nextWeek)
	              }
	            }
	          });
	        };          
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Slots percentage calculator
	   */
	  var preloader = {

	  	/**
	  	 * Init preloader
	  	 */
	  	init: function (total)
	  	{
	  		$rootScope.app.preloader = {
	  			status: true,
	  			total: 	total,
	  			count: 	0
	  		}
	  	},

	  	/**
	  	 * Countdown
	  	 */
	  	count: function ()
	  	{
	  		$rootScope.app.preloader.count = Math.abs(Math.floor( $rootScope.app.preloader.count + (100 / $rootScope.app.preloader.total) ));
	  	}
	  };


	  /**
	   * Get slot bundels; user, group aggs and members
	   */
	  Slots.prototype.all = function (options) 
	  {
	    /**
	     * Define vars
	     */
	    var deferred  = $q.defer(),
	        periods   = Dater.getPeriods(),
	        params    = {
	          user:   angular.fromJson(Storage.get('resources')).uuid, // user hardcoded!!
	          start:  options.stamps.start / 1000,
	          end:    options.stamps.end / 1000
	        },
	        data      = {};
	    
	    Slots.query(params, 
	      function (user) 
	      {
	        if (options.layouts.group)
	        {
	          var groupParams = {
	              id:     options.groupId,
	              start:  params.start,
	              end:    params.end,
	              month:  options.month
	          };

	          if (options.division != 'all') groupParams.division = options.division;

	          Slots.prototype.aggs(groupParams)
	          .then(function (aggs)
	          {
	            if (options.layouts.members)
	            {
	              var members = angular.fromJson(Storage.get(options.groupId)),
	                  calls   = [];

	              /**
	               * Run the preloader
	               */
	              preloader.init(members.length);

	              angular.forEach(members, function (member, index)
	              {
	              	calls.push(Slots.prototype.user({
	                  user: member.uuid,
	                  start:params.start,
	                  end:  params.end,
	                  type: 'both'
	                }));
	              });

	              $q.all(calls)
	              .then(function (members)
	              {
	                deferred.resolve({
	                  user:     user,
	                  groupId:  options.groupId,
	                  aggs:     aggs,
	                  members:  members,
	                  synced:   new Date().getTime(),
	                  periods: {
	                    start:  options.stamps.start,
	                    end:    options.stamps.end
	                  }
	                });
	              });
	            }
	            else
	            {
	              deferred.resolve({
	                user:     user,
	                groupId:  options.groupId,
	                aggs:     aggs,
	                synced:   new Date().getTime(),
	                periods: {
	                  start:  options.stamps.start,
	                  end:    options.stamps.end
	                }
	              });
	            };
	          });
	        }
	        else
	        {
	          deferred.resolve({
	            user:   user,
	            synced: new Date().getTime(),
	            periods: {
	              start:  options.stamps.start,
	              end:    options.stamps.end
	            }
	          });
	        };
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Fetch user slots
	   * This is needed as a seperate promise object
	   * for making the process wait in Slots.all call bundle
	   */
	  Slots.prototype.user = function (params) 
	  {
	    var deferred = $q.defer();

	    Slots.query(params, 
	      function (result) 
	      {
	      	/**
	      	 * Countdown on preloader
	      	 */
					preloader.count();

	        deferred.resolve({
	          id:     params.user,
	          data:   result,
	          stats:  Stats.member(result)
	        });
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Return local slots
	   */
	  Slots.prototype.local = function () { return angular.fromJson(Storage.get('slots')); };


	  /**
	   * Slot adding process
	   */
	  Slots.prototype.add = function (slot, user) 
	  {
	    var deferred = $q.defer();

	    Slots.save({member: user}, slot,
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * TODO
	   * Add back-end
	   *
	   * Check whether slot is being replaced on top of an another
	   * slot of same sort. If so combine them silently and show them as
	   * one slot but keep aligned with back-end, like two or more slots 
	   * in real.
	   * 
	   * Slot changing process
	   */
	  Slots.prototype.change = function (changed, user) 
	  {
	    var deferred = $q.defer();

	    Slots.change(angular.extend(naturalize(changed), {member: user}),  
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Slot delete process
	   */
	  Slots.prototype.remove = function (tId, mId) 
	  {
	    var deferred = $q.defer();
//
	    Slots.remove({ taskId : tId , member: mId},  
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };
	  

	  /**
	   * Naturalize Slot for back-end injection
	   */
	  function naturalize (slot)
	  {
	    var content = angular.fromJson(slot.content);

	    return {
	      start:      new Date(slot.start).getTime() / 1000,
	      end:        new Date(slot.end).getTime() / 1000,
	      recursive:  content.recursive,
	      text:       content.state,
	      id:         content.id
	    }
	  };


	  /**
	   * Check whether slot extends from saturday to sunday and if recursive?
	   * 
	   * Produce timestamps for sunday 00:00 am through the year and
	   * check whether intended to change recursive slot has one of those
	   * timestamps, if so slice slot based on midnight and present as two
	   * slots in timeline.
	   */
	  // function checkForSatSun (slot) { };


	  /**
	   * Check for overlaping slots exists?
	   * 
	   * Prevent any overlaping slots by adding new slots or changing
	   * the current ones in front-end so back-end is almost always aligned with
	   * front-end.
	   */
	  // function preventOverlaps (slot) { };


	  /**
	   * Slice a slot from a give point
	   */
	  // function slice (slot, point) { };


	  /**
	   * Combine two slots
	   */
	  // function combine (slots) { };


	  return new Slots;
	}
]);;/*jslint node: true */
/*global angular */
/*global $ */
'use strict';


angular.module('WebPaige.Directives', ['ngResource'])


/**
 * Chosen
 */
.directive('chosen',
  function ()
  {
    var linker = function (scope,element,attr)
    {
      scope.$watch('receviersList', function ()
      {
         element.trigger('liszt:updated');
      });

      scope.$watch('message.receviers', function ()
      {
        $(element[0]).trigger('liszt:updated');
      });

      element.chosen();
    };

    return {
      restrict: 'A',
      link:     linker
    };
  }
)

/**
 * uploader (file upload)
 */
.directive('uploader', [function() {

    return {
        restrict: 'E',
        scope: {
            action: '@'
            // scope
            // define a new isolate scope

        },
        controller: ['$scope','$rootScope', 'Storage' ,function ($scope,$rootScope,Storage) {

            // controller:
            // here you should define properties and methods
            // used in the directive's scope
            
            $scope.progress = 0;
            $scope.avatar = '';
            $scope.uploadLabel = $rootScope.ui.profile.click2upload;
            
            var session = angular.fromJson(Storage.cookie.get('session'));
            if(session){
                $scope.sessionId = session.id;
            }else{
                $rootScope.notifier.success($rootScope.ui.profile.sessionExpired);
                return false;
            }
         
            $scope.sendFile = function(el) {

                var $form = $(el).parents('form');

                if ($(el).val() == '') {
                    return false;
                }

                $form.attr('action', $scope.action);

                $scope.$apply(function() {
                    $scope.progress = 0;
                });             

                $form.ajaxSubmit({
                    type: 'POST',
                    headers: {'X-SESSION_ID' : $scope.sessionId},
                    uploadProgress: function(event, position, total, percentComplete) { 
                        
                        $scope.$apply(function() {
                            // upload the progress bar during the upload
                            $scope.progress = percentComplete;
                        });

                    },
                    error: function(event, statusText, responseText, form) { 

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        /*
                            handle the error ...
                        */
                        console.log("response : ",responseText);
                    },
                    success: function(responseText, statusText, xhr, form) { 

                        var ar = $(el).val().split('\\'), 
                            filename =  ar[ar.length-1];

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.$apply(function() {
                            $scope.avatar = filename;
                        });

                    },
                });

            }
        }],
        link: function(scope, elem, attrs, ctrl) {
            
            // link function 
            // here you should register listeners
            elem.find('.fake-uploader').click(function() {
                elem.find('input[type="file"]').click();
            });
        },
        replace: false,    
        templateUrl: 'js/views/uploader.html'
    };

}])

/**
 * uploader (file upload)
 */
.directive('loadimg', [function() {

    return {
        restrict: 'E',
        scope: {
            url: '@'
            // scope
            // define a new isolate scope

        },
        controller: ['$scope','$rootScope', 'Storage' ,function ($scope,$rootScope,Storage,$element) {

            // controller:
            // here you should define properties and methods
            // used in the directive's scope
            
            
            
            var session = angular.fromJson(Storage.cookie.get('session'));
            if(session){
                $scope.sessionId = session.id;
            }else{
                $rootScope.notifier.success($rootScope.ui.profile.sessionExpired);
                return false;
            }
//            console.log('scope',$scope);
//            console.log('url',$scope.url);
//            console.log('session',$scope.sessionId);
//            $scope.url = "http://192.168.128.205:8888//teamup/team/member/richard@ask-cs.com/photo";
            $scope.loadImg = function(el){
                $.ajax({ 
                    url: $scope.url,
                    type:"GET", 
                    headers: {'X-SESSION_ID' : $scope.sessionId},
                    success: function(data)
                    {
//                        console.log($element);
                        console.log(el);
                        
                        //var f = $element.attr("src", data); // use self instead of this
                        //console.log(f);
                    },
                    error: function(jqXHR, textStatus, errorThrow)
                    {
                        debugger;
                    }
               });  
            }
            
            
        }],
        link: function(scope, elem, attrs, ctrl) {
            
            // link function 
            // here you should register listeners
//            elem.find('.fake-uploader').click(function() {
//                elem.find('input[type="file"]').click();
//            });
//            console.log('elem',elem);
//            console.log('scope',scope);
            console.log('url',scope.url);
        },
        replace: true    ,
        template : '<div onReady="angular.element(this).scope().loadImg(this);">click</div>'
    };

}])

/**
 * Notification item
 */
// .directive('notificationItem',
//   function ($compile)
//   {
//     return {
//       restrict: 'E',
//       rep1ace:  true,
//       templateUrl: 'dist/views/messages-scheadule-item.html',
//       link: function (scope, element, attrs)
//       {
//         /**
//          * Pass the scheadule data
//          */
//         scope.s = scope.scheadule;

//         // element.html(template).show();
//         // $compile(element.contents())(scope);

//         /**
//          * Serve to the controller
//          */
//         scope.remover = function (key)
//         {
//           console.log('coming to remover');

//           scope.$parent.$parent.remover(key);
//         };
//       },
//       scope: {
//         scheadule: '='
//       }
//     };

//   }
// )


/**
 * Daterangepicker
 */
// .directive('daterangepicker',
// [
//   '$rootScope',
//   function ($rootScope)
//   {
//     return {
//       restrict: 'A',

//       link: function postLink(scope, element, attrs, controller)
//       {
//         // var startDate = Date.create().addDays(-6),
//         //     endDate   = Date.create();       
//         //element.val(startDate.format('{MM}-{dd}-{yyyy}') + ' / ' + endDate.format('{MM}-{dd}-{yyyy}'));

//         element.daterangepicker({
//           // startDate: startDate,
//           // endDate: endDate,
//           ranges: {
//             'Today':        ['today',     'tomorrow'],
//             'Tomorrow':     ['tomorrow',  new Date.today().addDays(2)],
//             'Yesterday':    ['yesterday', 'today'],
//             'Next 3 Days':  ['today',     new Date.create().addDays(3)],
//             'Next 7 Days':  ['today',     new Date.create().addDays(7)]
//           }
//         },
//         function (start, end)
//         {
//           scope.$apply(function ()
//           {
//             var diff = end.getTime() - start.getTime();

//             /**
//              * Scope is a day
//              */
//             if (diff <= 86400000)
//             {
//               scope.timeline.range = {
//                 start:  start,
//                 end:    start
//               };
//               scope.timeline.scope = {
//                 day:    true,
//                 week:   false,
//                 month:  false
//               };
//             }
//             /**
//              * Scope is less than a week
//              */
//             else if (diff < 604800000)
//             {
//               scope.timeline.range = {
//                 start:  start,
//                 end:    end
//               };
//               scope.timeline.scope = {
//                 day:    false,
//                 week:   true,
//                 month:  false
//               };
//             }
//             /**
//              * Scope is more than a week
//              */
//             else if (diff > 604800000)
//             {
//               scope.timeline.range = {
//                 start:  start,
//                 end:    end
//               };
//               scope.timeline.scope = {
//                 day:    false,
//                 week:   false,
//                 month:  true
//               };
//             }

//             $rootScope.$broadcast('timeliner', {
//               start:  start,
//               end:    end
//             });

//           });
//         });

//         /**
//          * Set data toggle
//          */
//         element.attr('data-toggle', 'daterangepicker');

//         /**
//          * TODO
//          * Investigate if its really needed!!
//          */
//         element.daterangepicker({
//           autoclose: true
//         });
//       }
//     };
//   }
// ])

/**
 * show the member's profile
 */
.directive('profile', [function() {

    return {
        restrict: 'E',
        scope: {
            memberId: '@'
            // scope
            // define a new isolate scope

        },
        controller: ['$scope','$rootScope', 'Storage' ,function ($scope,$rootScope,Storage) {
            console.log($scope.memberId );
            
            $scope.loadMember = function(el){
                
            }
            
        }],
        link: function(scope, elem, attrs, ctrl) {
            // link function 
            console.log(attrs.memberId );
        },
        replace: false,    
        templateUrl: 'js/views/profileTemplate.html'
    };

}])


.directive('ngenter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngenter);
                });
                event.preventDefault();
            }
        });
    };
});


;


/**
 * ???
 */
// .directive('wpName', 
// [
//   'Storage', 
//   function (Storage)
//   {
//     return {
//       restrict : 'A',
//       link : function linkfn(scope, element, attrs)
//       {
//         var getmemberName = function (uid)
//         {
//           var members = angular.fromJson(Storage.get('members')),
//               retName = uid;

//           angular.forEach(members , function (mem, i)
//           {
//             if (mem.uuid == uid)
//             {
//               retName = mem.name;

//               return false;
//             };
//           });

//           return retName;
//         };
//         scope.$watch(attrs.wpName, function (uid)
//         {
//           element.text(getmemberName(uid)); 
//         });
//       }
//     }
//   }
// ]);


/**
 * 
 */
// .directive('shortcuts', 
// [
//   '$rootScope', 
//   function ($rootScope)
//   {
//     return {
//       restrict: 'E',
//       template: '<link rel="shortcut icon" ng-href="js/profiles/{{profile}}/img/ico/favicon.ico">' +
//                 '<link rel="apple-touch-icon-precomposed" sizes="144x144" ng-href="js/profiles/{{profile}}/img/ico/apple-touch-icon-144-precomposed.png">' +
//                 '<link rel="apple-touch-icon-precomposed" sizes="114x114" ng-href="js/profiles/{{profile}}/img/ico/apple-touch-icon-114-precomposed.png">' +
//                 '<link rel="apple-touch-icon-precomposed" sizes="72x72"   ng-href="js/profiles/{{profile}}/img/ico/apple-touch-icon-72-precomposed.png">' +
//                 '<link rel="apple-touch-icon-precomposed" sizes="57x57"   ng-href="js/profiles/{{profile}}/img/ico/apple-touch-icon-57-precomposed.png">',
//       replace: true,
//       scope: {
//         profile: '@profile'
//       },
//       link: function (scope, element, attrs)
//       {
//       }
//     }
//   }
// ]);

;/**
 * AngularStrap - Twitter Bootstrap directives for AngularJS
 * @version v0.7.0 - 2013-03-11
 * @link http://mgcrea.github.com/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module("$strap.config",[]).value("$strap.config",{}),angular.module("$strap.filters",["$strap.config"]),angular.module("$strap.directives",["$strap.config"]),angular.module("$strap",["$strap.filters","$strap.directives","$strap.config"]),angular.module("$strap.directives").directive("bsAlert",["$parse","$timeout","$compile",function(t,e,n){"use strict";return{restrict:"A",link:function(e,i,a){var o=t(a.bsAlert),r=(o.assign,o(e));a.bsAlert?e.$watch(a.bsAlert,function(t,o){r=t,i.html((t.title?"<strong>"+t.title+"</strong>&nbsp;":"")+t.content||""),t.closed&&i.hide(),n(i.contents())(e),(t.type||o.type)&&(o.type&&i.removeClass("alert-"+o.type),t.type&&i.addClass("alert-"+t.type)),(angular.isUndefined(a.closeButton)||"0"!==a.closeButton&&"false"!==a.closeButton)&&i.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>')},!0):(angular.isUndefined(a.closeButton)||"0"!==a.closeButton&&"false"!==a.closeButton)&&i.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>'),i.addClass("alert").alert(),i.hasClass("fade")&&(i.removeClass("in"),setTimeout(function(){i.addClass("in")}));var s=a.ngRepeat&&a.ngRepeat.split(" in ").pop();i.on("close",function(t){var n;s?(t.preventDefault(),i.removeClass("in"),n=function(){i.trigger("closed"),e.$parent&&e.$parent.$apply(function(){for(var t=s.split("."),n=e.$parent,i=0;t.length>i;++i)n&&(n=n[t[i]]);n&&n.splice(e.$index,1)})},$.support.transition&&i.hasClass("fade")?i.on($.support.transition.end,n):n()):r&&(t.preventDefault(),i.removeClass("in"),n=function(){i.trigger("closed"),e.$apply(function(){r.closed=!0})},$.support.transition&&i.hasClass("fade")?i.on($.support.transition.end,n):n())})}}}]),angular.module("$strap.directives").directive("bsButton",["$parse","$timeout",function(t){"use strict";return{restrict:"A",require:"?ngModel",link:function(e,n,i,a){if(a){n.parent('[data-toggle="buttons-checkbox"], [data-toggle="buttons-radio"]').length||n.attr("data-toggle","button");var o=!!e.$eval(i.ngModel);o&&n.addClass("active"),e.$watch(i.ngModel,function(t,e){var i=!!t,a=!!e;i!==a?$.fn.button.Constructor.prototype.toggle.call(r):i&&!o&&n.addClass("active")})}n.hasClass("btn")||n.on("click.button.data-api",function(){n.button("toggle")}),n.button();var r=n.data("button");r.toggle=function(){if(!a)return $.fn.button.Constructor.prototype.toggle.call(this);var i=n.parent('[data-toggle="buttons-radio"]');i.length?(n.siblings("[ng-model]").each(function(n,i){t($(i).attr("ng-model")).assign(e,!1)}),e.$digest(),a.$modelValue||(a.$setViewValue(!a.$modelValue),e.$digest())):e.$apply(function(){a.$setViewValue(!a.$modelValue)})}}}}]).directive("bsButtonsCheckbox",["$parse",function(){"use strict";return{restrict:"A",require:"?ngModel",compile:function(t){t.attr("data-toggle","buttons-checkbox").find("a, button").each(function(t,e){$(e).attr("bs-button","")})}}}]).directive("bsButtonsRadio",["$parse",function(){"use strict";return{restrict:"A",require:"?ngModel",compile:function(t,e){return t.attr("data-toggle","buttons-radio"),e.ngModel||t.find("a, button").each(function(t,e){$(e).attr("bs-button","")}),function(t,e,n,i){i&&(e.find("[value]").button().filter('[value="'+t.$eval(n.ngModel)+'"]').addClass("active"),e.on("click.button.data-api",function(e){t.$apply(function(){i.$setViewValue($(e.target).closest("button").attr("value"))})}),t.$watch(n.ngModel,function(i,a){if(i!==a){var o=e.find('[value="'+t.$eval(n.ngModel)+'"]');o.length&&$.fn.button.Constructor.prototype.toggle.call(o.data("button"))}}))}}}}]),angular.module("$strap.directives").directive("bsButtonSelect",["$parse","$timeout",function(t){"use strict";return{restrict:"A",require:"?ngModel",link:function(e,n,i,a){var o=t(i.bsButtonSelect);o.assign,a&&(n.text(e.$eval(i.ngModel)),e.$watch(i.ngModel,function(t){n.text(t)}));var r,s,l,u;n.bind("click",function(){r=o(e),s=a?e.$eval(i.ngModel):n.text(),l=r.indexOf(s),u=l>r.length-2?r[0]:r[l+1],console.warn(r,u),e.$apply(function(){n.text(u),a&&a.$setViewValue(u)})})}}}]),angular.module("$strap.directives").directive("bsDatepicker",["$timeout",function(){"use strict";var t="ontouchstart"in window&&!window.navigator.userAgent.match(/PhantomJS/i),e={"/":"[\\/]","-":"[-]",".":"[.]",dd:"(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))",d:"(?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1}))",mm:"(?:[0]?[1-9]|[1][012])",m:"(?:[0]?[1-9]|[1][012])",yyyy:"(?:(?:[1]{1}[0-9]{1}[0-9]{1}[0-9]{1})|(?:[2]{1}[0-9]{3}))(?![[0-9]])",yy:"(?:(?:[0-9]{1}[0-9]{1}))(?![[0-9]])"};return{restrict:"A",require:"?ngModel",link:function(n,i,a,o){var r=function(t,n){n||(n={});var i=t,a=e;return angular.forEach(a,function(t,e){i=i.split(e).join(t)}),RegExp("^"+i+"$",["i"])},s=t?"yyyy/mm/dd":r(a.dateFormat||"mm/dd/yyyy");o&&o.$parsers.unshift(function(t){return!t||s.test(t)?(o.$setValidity("date",!0),t):(o.$setValidity("date",!1),void 0)});var l=i.next('[data-toggle="datepicker"]');if(l.length&&l.on("click",function(){t?i.trigger("focus"):i.datepicker("show")}),t&&"text"===i.prop("type"))i.prop("type","date"),i.on("change",function(){n.$apply(function(){o.$setViewValue(i.val())})});else{o&&i.on("changeDate",function(){n.$apply(function(){o.$setViewValue(i.val())})});var u=i.closest(".popover");u&&u.on("hide",function(){var t=i.data("datepicker");t&&(t.picker.remove(),i.data("datepicker",null))}),i.attr("data-toggle","datepicker"),i.datepicker({autoclose:!0,forceParse:a.forceParse||!1,language:a.language||"en"})}}}}]),angular.module("$strap.directives").directive("bsDropdown",["$parse","$compile",function(t,e){"use strict";var n=Array.prototype.slice,i='<ul class="dropdown-menu" role="menu" aria-labelledby="drop1"><li ng-repeat="item in items" ng-class="{divider: !!item.divider, \'dropdown-submenu\': !!item.submenu && item.submenu.length}"><a ng-hide="!!item.divider" tabindex="-1" ng-href="{{item.href}}" ng-click="{{item.click}}" target="{{item.target}}" ng-bind-html-unsafe="item.text"></a></li></ul>',a=function(t,n,a){for(var r,s,l,u=0,c=t.length;c>u;u++)(r=t[u].submenu)&&(l=a.$new(),l.items=r,s=e(i)(l),s=s.appendTo(n.children("li:nth-child("+(u+1)+")")),o(r,s,l))},o=function(){var t=n.call(arguments);setTimeout(function(){a.apply(null,t)})};return{restrict:"EA",scope:!0,link:function(n,a,r){var s=t(r.bsDropdown);n.items=s(n);var l=e(i)(n);o(n.items,l,n),l.insertAfter(a),a.addClass("dropdown-toggle").attr("data-toggle","dropdown")}}}]),angular.module("$strap.directives").directive("bsModal",["$parse","$compile","$http","$timeout","$q","$templateCache",function(t,e,n,i,a,o){"use strict";return{restrict:"A",scope:!0,link:function(r,s,l){var u=t(l.bsModal),c=(u.assign,u(r));a.when(o.get(c)||n.get(c,{cache:!0})).then(function(t){angular.isObject(t)&&(t=t.data);var n=u(r).replace(".html","").replace(/[\/|\.|:]/g,"-")+"-"+r.$id,a=$('<div class="modal hide" tabindex="-1"></div>').attr("id",n).attr("data-backdrop",l.backdrop||!0).attr("data-keyboard",l.keyboard||!0).addClass(l.modalClass?"fade "+l.modalClass:"fade").html(t);$("body").append(a),s.attr("href","#"+n).attr("data-toggle","modal"),i(function(){e(a)(r)}),r._modal=function(t){a.modal(t)},r.hide=function(){a.modal("hide")},r.show=function(){a.modal("show")},r.dismiss=r.hide})}}}]),angular.module("$strap.directives").directive("bsNavbar",["$location",function(t){"use strict";return{restrict:"A",link:function(e,n){e.$watch(function(){return t.path()},function(t){n.find("li[data-match-route]").each(function(e,n){var i=angular.element(n),a=i.attr("data-match-route"),o=RegExp("^"+a+"$",["i"]);o.test(t)?i.addClass("active"):i.removeClass("active")})})}}}]),angular.module("$strap.directives").directive("bsPopover",["$parse","$compile","$http","$timeout","$q","$templateCache",function(t,e,n,i,a,o){"use strict";return $("body").on("keyup",function(t){27===t.keyCode&&$(".popover.in").each(function(){$(this).popover("hide")})}),{restrict:"A",scope:!0,link:function(i,r,s){var l=t(s.bsPopover),u=(l.assign,l(i)),c={};angular.isObject(u)&&(c=u),a.when(c.content||o.get(u)||n.get(u,{cache:!0})).then(function(t){angular.isObject(t)&&(t=t.data),s.unique&&r.on("show",function(){$(".popover.in").each(function(){var t=$(this),e=t.data("popover");e&&!e.$element.is(r)&&t.popover("hide")})}),s.hide&&i.$watch(s.hide,function(t,e){t?n.hide():t!==e&&n.show()}),r.popover(angular.extend({},c,{content:t,html:!0}));var n=r.data("popover");n.hasContent=function(){return this.getTitle()||t},n.getPosition=function(){var t=$.fn.popover.Constructor.prototype.getPosition.apply(this,arguments);return e(this.$tip)(i),i.$digest(),this.$tip.data("popover",this),t},i._popover=function(t){r.popover(t)},i.hide=function(){r.popover("hide")},i.show=function(){r.popover("show")},i.dismiss=i.hide})}}}]),angular.module("$strap.directives").directive("bsTabs",["$parse","$compile",function(t,e){"use strict";return{restrict:"A",link:function(t,n){var i=['<ul class="nav nav-tabs">',"</ul>"],a=['<div class="tab-content">',"</div>"];n.find("[data-tab]").each(function(e){var n=angular.element(this),o="tab-"+t.$id+"-"+e,r=n.hasClass("active"),s=n.hasClass("fade"),l=t.$eval(n.data("tab"));i.splice(e+1,0,"<li"+(r?' class="active"':"")+'><a href="#'+o+'" data-toggle="tab">'+l+"</a></li>"),a.splice(e+1,0,'<div class="tab-pane '+n.attr("class")+(s&&r?" in":"")+'" id="'+o+'">'+this.innerHTML+"</div>")}),n.html(i.join("")+a.join("")),e(n.children("div.tab-content"))(t)}}}]),angular.module("$strap.directives").directive("bsTimepicker",["$timeout",function(){"use strict";var t="((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)";return{restrict:"A",require:"?ngModel",link:function(e,n,i,a){a&&n.on("change",function(){e.$apply(function(){a.$setViewValue(n.val())})});var o=RegExp("^"+t+"$",["i"]);a.$parsers.unshift(function(t){return!t||o.test(t)?(a.$setValidity("time",!0),t):(a.$setValidity("time",!1),void 0)});var r=n.closest(".popover");r&&r.on("hide",function(){var t=n.data("timepicker");t&&(t.$widget.remove(),n.data("timepicker",null))}),n.attr("data-toggle","timepicker"),n.timepicker()}}}]),angular.module("$strap.directives").directive("bsTooltip",["$parse","$compile",function(t){"use strict";return{restrict:"A",scope:!0,link:function(e,n,i){var a=t(i.bsTooltip),o=(a.assign,a(e));e.$watch(i.bsTooltip,function(t,e){t!==e&&(o=t)}),i.unique&&n.on("show",function(){$(".tooltip.in").each(function(){var t=$(this),e=t.data("tooltip");e&&!e.$element.is(n)&&t.tooltip("hide")})}),n.tooltip({title:function(){return angular.isFunction(o)?o.apply(null,arguments):o},html:!0});var r=n.data("tooltip");r.show=function(){var t=$.Event("show");if(this.$element.trigger(t),!t.isDefaultPrevented()){var e=$.fn.tooltip.Constructor.prototype.show.apply(this,arguments);return this.tip().data("tooltip",this),e}},r.hide=function(){var t=$.Event("hide");return this.$element.trigger(t),t.isDefaultPrevented()?void 0:$.fn.tooltip.Constructor.prototype.hide.apply(this,arguments)},e._tooltip=function(t){n.tooltip(t)},e.hide=function(){n.tooltip("hide")},e.show=function(){n.tooltip("show")},e.dismiss=e.hide}}}]),angular.module("$strap.directives").directive("bsTypeahead",["$parse",function(t){"use strict";return{restrict:"A",require:"?ngModel",link:function(e,n,i,a){var o=t(i.bsTypeahead),r=(o.assign,o(e));e.$watch(i.bsTypeahead,function(t,e){t!==e&&(r=t)}),n.attr("data-provide","typeahead"),n.typeahead({source:function(){return angular.isFunction(r)?r.apply(null,arguments):r},minLength:i.minLength||1,items:i.items,updater:function(t){return a&&e.$apply(function(){a.$setViewValue(t)}),t}});var s=n.data("typeahead");s.lookup=function(){var t;return this.query=this.$element.val()||"",this.query.length<this.options.minLength?this.shown?this.hide():this:(t=$.isFunction(this.source)?this.source(this.query,$.proxy(this.process,this)):this.source,t?this.process(t):this)},"0"===i.minLength&&setTimeout(function(){n.on("focus",function(){0===n.val().length&&setTimeout(n.typeahead.bind(n,"lookup"),200)})})}}}]);;angular.module("ui.bootstrap", ["ui.bootstrap.modal"]);
angular.module('ui.bootstrap.modal', [])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function () {
    return {
      createNew: function () {
        var stack = [];

        return {
          add: function (key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function (key) {
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function () {
            return stack[stack.length - 1];
          },
          remove: function (key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function () {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function () {
            return stack.length;
          }
        };
      }
    };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('modalBackdrop', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/modal/backdrop.html',
      link: function (scope, element, attrs) {

        //trigger CSS transitions
        $timeout(function () {
          scope.animate = true;
        });

        scope.close = function (evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop && modal.value.backdrop != 'static') {
            evt.preventDefault();
            evt.stopPropagation();
            $modalStack.dismiss(modal.key, 'backdrop click');
          }
        };
      }
    };
  }])

  .directive('modalWindow', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      scope: {
        index: '@'
      },
      replace: true,
      transclude: true,
      templateUrl: 'template/modal/window.html',
      link: function (scope, element, attrs) {
        scope.windowClass = attrs.windowClass || '';

        //trigger CSS transitions
        $timeout(function () {
          scope.animate = true;
        });
      }
    };
  }])

  .factory('$modalStack', ['$document', '$compile', '$rootScope', '$$stackedMap',
    function ($document, $compile, $rootScope, $$stackedMap) {

      var backdropjqLiteEl, backdropDomEl;
      var backdropScope = $rootScope.$new(true);
      var body = $document.find('body').eq(0);
      var openedWindows = $$stackedMap.createNew();
      var $modalStack = {};

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex){
        backdropScope.index = newBackdropIndex;
      });

      function removeModalWindow(modalInstance) {

        var modalWindow = openedWindows.get(modalInstance).value;

        //clean up the stack
        openedWindows.remove(modalInstance);

        //remove window DOM element
        modalWindow.modalDomEl.remove();

        //remove backdrop if no longer needed
        if (backdropIndex() == -1) {
          backdropDomEl.remove();
          backdropDomEl = undefined;
        }

        //destroy scope
        modalWindow.modalScope.$destroy();
      }

      $document.bind('keydown', function (evt) {
        var modal;

        if (evt.which === 27) {
          modal = openedWindows.top();
          if (modal && modal.value.keyboard) {
            $rootScope.$apply(function () {
              $modalStack.dismiss(modal.key);
            });
          }
        }
      });

      $modalStack.open = function (modalInstance, modal) {

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard
        });

        var angularDomEl = angular.element('<div modal-window></div>');
        angularDomEl.attr('window-class', modal.windowClass);
        angularDomEl.attr('index', openedWindows.length() - 1);
        angularDomEl.html(modal.content);

        var modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl;
        body.append(modalDomEl);

        if (backdropIndex() >= 0 && !backdropDomEl) {
            backdropjqLiteEl = angular.element('<div modal-backdrop></div>');
            backdropDomEl = $compile(backdropjqLiteEl)(backdropScope);
            body.append(backdropDomEl);
        }
      };

      $modalStack.close = function (modalInstance, result) {
        var modal = openedWindows.get(modalInstance);
        if (modal) {
          modal.value.deferred.resolve(result);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.dismiss = function (modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance).value;
        if (modalWindow) {
          modalWindow.deferred.reject(reason);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.getTop = function () {
        return openedWindows.top();
      };

      return $modalStack;
    }])

  .provider('$modal', function () {

    var $modalProvider = {
      options: {
        backdrop: true, //can be also false or 'static'
        keyboard: true
      },
      $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
        function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
                return result.data;
              });
          }

          function getResolvePromises(resolves) {
            var promisesArr = [];
            angular.forEach(resolves, function (value, key) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              }
            });
            return promisesArr;
          }

          $modal.open = function (modalOptions) {

            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              close: function (result) {
                $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of template or templateUrl options is required.');
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


            templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

              var modalScope = (modalOptions.scope || $rootScope).$new();
              modalScope.$close = modalInstance.close;
              modalScope.$dismiss = modalInstance.dismiss;

              var ctrlInstance, ctrlLocals = {};
              var resolveIter = 1;

              //controllers
              if (modalOptions.controller) {
                ctrlLocals.$scope = modalScope;
                ctrlLocals.$modalInstance = modalInstance;
                angular.forEach(modalOptions.resolve, function (value, key) {
                  ctrlLocals[key] = tplAndVars[resolveIter++];
                });

                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
              }

              $modalStack.open(modalInstance, {
                scope: modalScope,
                deferred: modalResultDeferred,
                content: tplAndVars[0],
                backdrop: modalOptions.backdrop,
                keyboard: modalOptions.keyboard,
                windowClass: modalOptions.windowClass
              });

            }, function resolveError(reason) {
              modalResultDeferred.reject(reason);
            });

            templateAndResolvePromise.then(function () {
              modalOpenedDeferred.resolve(true);
            }, function () {
              modalOpenedDeferred.reject(false);
            });

            return modalInstance;
          };

          return $modal;
        }]
    };

    return $modalProvider;
  });;angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.modal"]);
angular.module("ui.bootstrap.tpls", ["template/modal/backdrop.html","template/modal/window.html"]);
angular.module('ui.bootstrap.modal', [])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function () {
    return {
      createNew: function () {
        var stack = [];

        return {
          add: function (key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function (key) {
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function () {
            return stack[stack.length - 1];
          },
          remove: function (key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function () {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function () {
            return stack.length;
          }
        };
      }
    };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('modalBackdrop', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/modal/backdrop.html',
      link: function (scope, element, attrs) {

        //trigger CSS transitions
        $timeout(function () {
          scope.animate = true;
        });

        scope.close = function (evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop && modal.value.backdrop != 'static') {
            evt.preventDefault();
            evt.stopPropagation();
            $modalStack.dismiss(modal.key, 'backdrop click');
          }
        };
      }
    };
  }])

  .directive('modalWindow', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      scope: {
        index: '@'
      },
      replace: true,
      transclude: true,
      templateUrl: 'template/modal/window.html',
      link: function (scope, element, attrs) {
        scope.windowClass = attrs.windowClass || '';

        //trigger CSS transitions
        $timeout(function () {
          scope.animate = true;
        });
      }
    };
  }])

  .factory('$modalStack', ['$document', '$compile', '$rootScope', '$$stackedMap',
    function ($document, $compile, $rootScope, $$stackedMap) {

      var backdropjqLiteEl, backdropDomEl;
      var backdropScope = $rootScope.$new(true);
      var body = $document.find('body').eq(0);
      var openedWindows = $$stackedMap.createNew();
      var $modalStack = {};

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex){
        backdropScope.index = newBackdropIndex;
      });

      function removeModalWindow(modalInstance) {

        var modalWindow = openedWindows.get(modalInstance).value;

        //clean up the stack
        openedWindows.remove(modalInstance);

        //remove window DOM element
        modalWindow.modalDomEl.remove();

        //remove backdrop if no longer needed
        if (backdropIndex() == -1) {
          backdropDomEl.remove();
          backdropDomEl = undefined;
        }

        //destroy scope
        modalWindow.modalScope.$destroy();
      }

      $document.bind('keydown', function (evt) {
        var modal;

        if (evt.which === 27) {
          modal = openedWindows.top();
          if (modal && modal.value.keyboard) {
            $rootScope.$apply(function () {
              $modalStack.dismiss(modal.key);
            });
          }
        }
      });

      $modalStack.open = function (modalInstance, modal) {

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard
        });

        var angularDomEl = angular.element('<div modal-window></div>');
        angularDomEl.attr('window-class', modal.windowClass);
        angularDomEl.attr('index', openedWindows.length() - 1);
        angularDomEl.html(modal.content);

        var modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl;
        body.append(modalDomEl);

        if (backdropIndex() >= 0 && !backdropDomEl) {
            backdropjqLiteEl = angular.element('<div modal-backdrop></div>');
            backdropDomEl = $compile(backdropjqLiteEl)(backdropScope);
            body.append(backdropDomEl);
        }
      };

      $modalStack.close = function (modalInstance, result) {
        var modal = openedWindows.get(modalInstance);
        if (modal) {
          modal.value.deferred.resolve(result);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.dismiss = function (modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance).value;
        if (modalWindow) {
          modalWindow.deferred.reject(reason);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.getTop = function () {
        return openedWindows.top();
      };

      return $modalStack;
    }])

  .provider('$modal', function () {

    var $modalProvider = {
      options: {
        backdrop: true, //can be also false or 'static'
        keyboard: true
      },
      $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
        function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
                return result.data;
              });
          }

          function getResolvePromises(resolves) {
            var promisesArr = [];
            angular.forEach(resolves, function (value, key) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              }
            });
            return promisesArr;
          }

          $modal.open = function (modalOptions) {

            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              close: function (result) {
                $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of template or templateUrl options is required.');
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


            templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

              var modalScope = (modalOptions.scope || $rootScope).$new();
              modalScope.$close = modalInstance.close;
              modalScope.$dismiss = modalInstance.dismiss;

              var ctrlInstance, ctrlLocals = {};
              var resolveIter = 1;

              //controllers
              if (modalOptions.controller) {
                ctrlLocals.$scope = modalScope;
                ctrlLocals.$modalInstance = modalInstance;
                angular.forEach(modalOptions.resolve, function (value, key) {
                  ctrlLocals[key] = tplAndVars[resolveIter++];
                });

                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
              }

              $modalStack.open(modalInstance, {
                scope: modalScope,
                deferred: modalResultDeferred,
                content: tplAndVars[0],
                backdrop: modalOptions.backdrop,
                keyboard: modalOptions.keyboard,
                windowClass: modalOptions.windowClass
              });

            }, function resolveError(reason) {
              modalResultDeferred.reject(reason);
            });

            templateAndResolvePromise.then(function () {
              modalOpenedDeferred.resolve(true);
            }, function () {
              modalOpenedDeferred.reject(false);
            });

            return modalInstance;
          };

          return $modal;
        }]
    };

    return $modalProvider;
  });
angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/backdrop.html",
    "<div class=\"modal-backdrop fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1040 + index*10}\" ng-click=\"close($event)\"></div>");
}]);

angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/window.html",
    "<div class=\"modal fade {{ windowClass }}\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10}\" ng-transclude></div>");
}]);
;'use strict';


angular.module('WebPaige.Services.Session', ['ngResource'])


/**
 * Session Service
 */
.factory('Session', 
[
  '$rootScope', '$http', 'Storage', 
  function ($rootScope, $http, Storage)
  {
    return {
      /**
       * Check session
       */
      check: function()
      {
        var session = angular.fromJson(Storage.cookie.get('session'));

        if (session)
        {
          this.set(session.id);

          return true;
        }
        else
        {
          return false;
        };
      },

      /**
       * Read cookie value
       */
      cookie: function(session)
      {
        var values,
            pairs = document.cookie.split(";");

        for (var i=0; i < pairs.length; i++)
        {
          values = pairs[i].split("=");

          if (values[0].trim() == "WebPaige.session") return angular.fromJson(values[1]);
        };

      },

      /**
       * Get session
       * Prolong session time by every check
       */
      get: function(session)
      {
        this.check(session);

        this.set(session.id);

        return session.id;
      },

      /**
       * Set session
       */
      set: function(sessionId)
      {
        var session = {
          id: sessionId,
          time: new Date()
        };

        Storage.cookie.add('session', angular.toJson(session));

        $rootScope.session = session;

        $http.defaults.headers.common['X-SESSION_ID'] = $rootScope.session.id;

        return session;
      },

      /**
       * Clear session
       */
      clear: function()
      {
        $rootScope.session = null;

        $http.defaults.headers.common['X-SESSION_ID'] = null;
      }
    }
  }
]);;'use strict';


angular.module('WebPaige.Services.Dater', ['ngResource'])


/**
 * Dater service (Wrapper on Date)
 */
.factory('Dater', 
[
  '$rootScope', 'Storage', 
  function ($rootScope, Storage)
  {
    return {

      current:
      {
        today: function ()
        {
          return Date.today().getDayOfYear() + 1;
        },

        week: function ()
        {
          return new Date().getWeek();
        },

        month: function ()
        {
          return new Date().getMonth() + 1;
        }
      },

      readable: 
      {
        date: function (date)
        {
          return  new Date(date).toString($rootScope.config.formats.date);
        }
      },

      convert:
      {
        absolute: function (date, time, flag)
        {
          var dates   = date.split('-'),
              result  = new Date(Date.parse(dates[2] + 
                                      '-' + 
                                      dates[1] + 
                                      '-' + 
                                      dates[0] + 
                                      ' ' + 
                                      time)).getTime();
          
          return (flag) ? result / 1000 : result;
        }
      },

      calculate:
      {
        diff: function (range)
        {
          return new Date(range.end).getTime() - new Date(range.start).getTime()
        }
      },

      /**
       * Get the current month
       */
      getThisMonth: function ()
      {
        return new Date().toString('M');
      },

      /**
       * Get the current year
       */
      getThisYear: function ()
      {
        return new Date().toString('yyyy');
      },

      /**
       * Get begin and end timestamps of months
       * in the current year
       */
      getMonthTimeStamps: function ()
      {
        var months  = {}, 
            year    = this.getThisYear();

        for (var i = 0; i < 12; i++)
        {
          var firstDay  = new Date(year, i).moveToFirstDayOfMonth(),
              lastDay   = new Date(year, i).moveToLastDayOfMonth(),
              month     = {
                first: {
                  day: firstDay,
                  timeStamp: firstDay.getTime()
                },
                last: { 
                  day: lastDay,
                  timeStamp: lastDay.getTime() 
                },
                totalDays: Date.getDaysInMonth(year, i)
              };

          months[i+1] = month;
        };

        return months;
      },

      /**
       * Get begin and end timestamps of weeks
       */
      getWeekTimeStamps: function()
      {
        var nweeks    = [],
            weeks     = {},
            nextMonday,
            year      = this.getThisYear(), 
            firstDayInYear    = new Date(year, 0).moveToFirstDayOfMonth(),
            firstMondayOfYear = new Date(year, 0).moveToFirstDayOfMonth().last().sunday().addWeeks(0),
            firstMonday       = new Date(firstMondayOfYear);

        for (var i = 0; i < 53; i++)
        {
          if (i == 0)
          {
            nextMonday = firstMondayOfYear.addWeeks(1);
          }
          else
          {
            nextMonday = new Date(nweeks[i-1]).addWeeks(1);
          }

          nweeks.push(new Date(nextMonday));
        }

        nweeks.unshift(firstMonday);

        var firstMondayofNextYear = new Date(nweeks[51].addWeeks(1));

        for (var i = 0; i < 55; i++)
        {
          weeks[i+1] = {
            first: {
              day: nweeks[i],
              timeStamp: new Date(nweeks[i]).getTime()
            },
            last: {
              day: nweeks[i+1],
              timeStamp: new Date(nweeks[i+1]).getTime()
            }
          }
        }

        /**
         * Remove unneccessary periods
         */
        delete weeks[54];
        delete weeks[55];

        return weeks;
      },

      /**
       */
      getDayTimeStamps: function()
      {
        var nextDay,
            ndays = [],
            days = {},
            year = this.getThisYear(),
            firstDayInYear = new Date(year, 0).moveToFirstDayOfMonth();
        
        for (var i = 0; i < 366; i++)
        {
          if (i == 0)
          {
            nextDay = firstDayInYear;
          }
          else
          {
            nextDay = new Date(ndays[i-1]).addDays(1);
          }

          ndays.push(new Date(nextDay));
        }

        for (var i = 0; i < 366; i++)
        {
          days[i+1] = {
            first: {
              day: ndays[i],
              timeStamp: new Date(ndays[i]).getTime()
            },
            last: {
              day: ndays[i+1],
              timeStamp: new Date(ndays[i+1]).getTime()
            }
          };
        }

        /**
         * Remove not existing date
         */
        if (!days[366].timeStamp)
        {
          delete days[366];

          days.total = 365;
        }
        else
        {
          days.total = 366;
        }

        return days;
      },

      registerPeriods: function ()
      {
        var periods = angular.fromJson(Storage.get('periods') || '{}');

        Storage.add('periods', angular.toJson({
          months: this.getMonthTimeStamps(),
          weeks: this.getWeekTimeStamps(),
          days: this.getDayTimeStamps()
        }));      
      },

      getPeriods: function ()
      {
        return angular.fromJson(Storage.get('periods'));
      }
    }
  }
]);;'use strict';


angular.module('WebPaige.Services.MD5', ['ngResource'])


/**
 * MD5
 */
.factory('MD5', 
  function ()
  {
    return function (string)
    {
      function RotateLeft(lValue, iShiftBits)
      {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
      }
     
      function AddUnsigned(lX,lY)
      {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);

        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);

        if (lX4 | lY4)
        {
          if (lResult & 0x40000000)
          {
            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
          }
          else
          {
            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
          }
        }
        else
        {
          return (lResult ^ lX8 ^ lY8);
        }
      }
     
      function F(x,y,z) { return (x & y) | ((~x) & z) }
      function G(x,y,z) { return (x & z) | (y & (~z)) }
      function H(x,y,z) { return (x ^ y ^ z) }
      function I(x,y,z) { return (y ^ (x | (~z))) }
     
      function FF(a,b,c,d,x,s,ac)
      {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));

        return AddUnsigned(RotateLeft(a, s), b);
      }
     
      function GG(a,b,c,d,x,s,ac)
      {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));

        return AddUnsigned(RotateLeft(a, s), b);
      }
     
      function HH(a,b,c,d,x,s,ac)
      {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));

        return AddUnsigned(RotateLeft(a, s), b);
      }
     
      function II(a,b,c,d,x,s,ac)
      {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));

        return AddUnsigned(RotateLeft(a, s), b);
      }
     
      function ConvertToWordArray(string)
      {
        var lWordCount,
            lMessageLength = string.length,
            lNumberOfWords_temp1 = lMessageLength + 8,
            lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64,
            lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16,
            lWordArray = Array(lNumberOfWords - 1),
            lBytePosition = 0,
            lByteCount = 0;

        while ( lByteCount < lMessageLength )
        {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4)*8;
          lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
          lByteCount++;
        }

        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
      }
     
      function WordToHex(lValue)
      {
        var WordToHexValue = "", 
            WordToHexValue_temp = "",
            lByte,
            lCount;

        for (lCount = 0; lCount<=3; lCount++)
        {
          lByte = (lValue>>>(lCount*8)) & 255;
          WordToHexValue_temp = "0" + lByte.toString(16);
          WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }

        return WordToHexValue;
      };
     
      function Utf8Encode(string)
      {
        string = string.replace(/\r\n/g, "\n");

        var utftext = "";
     
        for (var n = 0; n < string.length; n++)
        {
          var c = string.charCodeAt(n);
     
          if (c < 128)
          {
            utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048))
          {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          }
          else
          {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
     
        return utftext;
      };
     
      var x = Array();
      var k,AA,BB,CC,DD,a,b,c,d;
      var S11=7, S12=12, S13=17, S14=22;
      var S21=5, S22=9 , S23=14, S24=20;
      var S31=4, S32=11, S33=16, S34=23;
      var S41=6, S42=10, S43=15, S44=21;
     
      string = Utf8Encode(string);
     
      x = ConvertToWordArray(string);
     
      a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
     
      for (k=0; k<x.length; k+=16)
      {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
      }
     
      var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
     
      return temp.toLowerCase();
    }
  }
);;'use strict';


angular.module('WebPaige.Services.Storage', ['ngResource'])


/**
 * Storage service for localStorage, Session and cookies management
 */
.factory('Storage', ['$rootScope', '$config', function ($rootScope, $config)
{
  // If there is a prefix set in the config lets use that with an appended 
  // period for readability
  // var prefix = angularLocalStorage.constant;
  
  if ($config.title.substr(-1) !== '.') $config.title = !!$config.title ? $config.title + '.' : '';

  // Checks the browser to see if local storage is supported
  var browserSupportsLocalStorage = function ()
  {
    try {
      return ('localStorage' in window && window['localStorage'] !== null);           
    }
    catch (e) {
      return false;
    }
  };

  // Directly adds a value to local storage
  // If local storage is not available in the browser use cookies
  // Example use: Storage.add('library','angular');
  var addToLocalStorage = function (key, value)
  {
    if (!browserSupportsLocalStorage()) return false;

    // 0 and "" is allowed as a value but let's limit other falsey values like "undefined"
    if (!value && value !== 0 && value !== "") return false;

    try {
      localStorage.setItem($config.title + key, value);
    }
    catch (e) {
      return false;
    };

    return true;
  };


  // Directly get a value from local storage
  // Example use: Storage.get('library'); // returns 'angular'
  var getFromLocalStorage = function (key)
  {
    if (!browserSupportsLocalStorage()) return false;

    var item = localStorage.getItem($config.title + key);

    if (!item) return null;

    return item;
  };


  // Remove an item from local storage
  // Example use: Storage.remove('library'); // removes the key/value pair of library='angular'
  var removeFromLocalStorage = function (key) 
  {
    if (!browserSupportsLocalStorage()) return false;

    try {
      localStorage.removeItem($config.title + key);
    } 
    catch (e) {
      return false;
    };

    return true;
  };


  // Remove all data for this app from local storage
  // Example use: Storage.clearAll();
  // Should be used mostly for development purposes
  var clearAllFromLocalStorage = function () 
  {
    if (!browserSupportsLocalStorage()) return false;

    var prefixLength = $config.title.length;

    for (var key in localStorage) 
    {
      // Only remove items that are for this app
      if (key.substr(0, prefixLength) === $config.title) 
      {
        try {
          removeFromLocalStorage(key.substr(prefixLength));
        } 
        catch (e) {
          return false;
        };
      };
    };

    return true;
  };


  /**
   * Checks the browser to see if session storage is supported
   */
  var browserSupportsSessionStorage = function ()
  {
    try {
      return ('sessionStorage' in window && window['sessionStorage'] !== null);           
    }
    catch (e) {
      return false;
    }
  };


  /**
   * Directly adds a value to session storage
   */
  var addToSessionStorage = function (key, value)
  {
    if (!browserSupportsSessionStorage()) return false;

    if (!value && value !== 0 && value !== "") return false;

    try {
      sessionStorage.setItem($config.title + key, value);
    }
    catch (e) {
      return false;
    };

    return true;
  };


  /**
   * Get value from session storage
   */
  var getFromSessionStorage = function (key)
  {
    if (!browserSupportsSessionStorage()) return false;

    var item = sessionStorage.getItem($config.title + key);

    if (!item) return null;

    return item;
  };


  /**
   * Remove item from session storage
   */
  var removeFromSessionStorage = function (key) 
  {
    if (!browserSupportsSessionStorage()) return false;

    try {
      sessionStorage.removeItem($config.title + key);
    } 
    catch (e) {
      return false;
    };

    return true;
  };


  /**
   * Remove all data from session storage
   */
  var clearAllFromSessionStorage = function () 
  {
    if (!browserSupportsSessionStorage()) return false;

    var prefixLength = $config.title.length;

    for (var key in sessionStorage) 
    {
      // Only remove items that are for this app
      if (key.substr(0, prefixLength) === $config.title) 
      {
        try {
          removeFromSessionStorage(key.substr(prefixLength));
        } 
        catch (e) {
          return false;
        };
      };
    };

    return true;
  };


  // Checks the browser to see if cookies are supported
  var browserSupportsCookies = function () 
  {
    try {
      return navigator.cookieEnabled ||
        ("cookie" in document && (document.cookie.length > 0 ||
        (document.cookie = "test").indexOf.call(document.cookie, "test") > -1));
    } 
    catch (e) {
      return false;
    }
  };


  // Directly adds a value to cookies
  // Typically used as a fallback is local storage is not available in the browser
  // Example use: Storage.cookie.add('library','angular');
  var addToCookies = function (key, value) 
  {
    if (typeof value == "undefined") return false;

    if (!browserSupportsCookies())  return false;

    try {
      var expiry      = '', 
          expiryDate  = new Date();

      if (value === null) 
      {
        $config.cookie.expiry = -1;

        value = '';
      };

      if ($config.cookie.expiry !== 0) 
      {
        expiryDate.setTime(expiryDate.getTime() + ($config.cookie.expiry * 60 * 60 * 1000));

        expiry = "; expires=" + expiryDate.toGMTString();
      };

      document.cookie = $config.title + 
                        key + 
                        "=" + 
                        //encodeURIComponent(value) + 
                        value + 
                        expiry + 
                        "; path=" + 
                        $config.cookie.path;
    } 
    catch (e) {
      return false;
    };

    return true;
  };


  // Directly get a value from a cookie
  // Example use: Storage.cookie.get('library'); // returns 'angular'
  var getFromCookies = function (key) 
  {
    if (!browserSupportsCookies()) 
    {
      $rootScope.$broadcast('StorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
      return false;
    }

    var cookies = document.cookie.split(';');
    
    for (var i=0; i < cookies.length; i++) 
    {
      var thisCookie = cookies[i];
      
      while (thisCookie.charAt(0)==' ')
        thisCookie = thisCookie.substring(1, thisCookie.length);

      if (thisCookie.indexOf($config.title + key + '=') == 0)
        return decodeURIComponent(thisCookie.substring($config.title.length + key.length + 1, thisCookie.length));
    };

    return null;
  };


  var removeFromCookies = function (key) 
  {
    addToCookies(key, null);
  };


  var clearAllFromCookies = function () 
  {
    var thisCookie    = null, 
        thisKey       = null,
        prefixLength  = $config.title.length,
        cookies       = document.cookie.split(';');
    
    for (var i=0; i < cookies.length; i++) 
    {
      thisCookie = cookies[i];
      
      while (thisCookie.charAt(0) == ' ') 
        thisCookie = thisCookie.substring(1, thisCookie.length);

      key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));

      removeFromCookies(key);
    };
  };


  var storageSize = function (key)
  {
    var item = (key) ? localStorage.key : localStorage;

    return ((3 + ((item.length * 16) / (8 * 1024))) * 0.0009765625).toPrecision(2) + ' MB';
  }


  var getPeriods = function ()
  {
    return angular.fromJson(getFromLocalStorage('periods'));
  };


  var getGroups = function ()
  {
    return angular.fromJson(getFromLocalStorage('groups'));
  };


  var getMembers = function ()
  {
    return angular.fromJson(getFromLocalStorage('members'));
  };


  var getSettings = function ()
  {
    var settings = angular.fromJson(getFromLocalStorage('resources'));

    return (!settings.settingsWebPaige) ? $rootScope.config.defaults.settingsWebPaige : angular.fromJson(settings.settingsWebPaige);
  };


  return {
    isSupported: browserSupportsLocalStorage,
    add:        addToLocalStorage,
    get:        getFromLocalStorage,
    remove:     removeFromLocalStorage,
    clearAll:   clearAllFromLocalStorage,
    session: {
      add:      addToSessionStorage,
      get:      getFromSessionStorage,
      remove:   removeFromSessionStorage,
      clearAll: clearAllFromSessionStorage
    },
    cookie: {
      add:      addToCookies,
      get:      getFromCookies,
      remove:   removeFromCookies,
      clearAll: clearAllFromCookies
    },
    size: storageSize,
    local: {
      periods:  getPeriods,
      groups:   getGroups,
      members:  getMembers,
      settings: getSettings
    }
  }

}]);;'use strict';


angular.module('WebPaige.Services.Strings', ['ngResource'])


/**
 * TODO
 * Add example usage!
 * 
 * String manupulators
 */
.factory('Strings', 
  function ()
  {
    return {

      /**
       * Truncate string from words with ..
       */
      truncate: function (txt, n, useWordBoundary)
      {
         var toLong = txt.length > n,
             s_ = toLong ? txt.substr(0, n-1) : txt,
             s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;

         return toLong ? s_ + '..' : s_;
      },

      /**
       * To title case
       */
      toTitleCase: function (str)
      {
        if (str)
          return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
      }
    }
  }
);;'use strict';


angular.module('WebPaige.Services.Generators', ['ngResource'])


/**
 * Custom genrators
 */
.factory('Generators', 
  function ()
  {
    return {

      /**
       * Produce range
       */
      range: function ()
      {
        var min = 5,
            max = 120;

        return Math.floor( Math.random() * (max - min + 1) ) + min;
      },

      /**
       * Produce number
       */
      number: function ()
      {
        return Math.floor( Math.random() * 9000000 );
      },

      /**
       * Produce numbers list
       */
      list: function ()
      {
        var normals   = [],
            premiums  = ['1111111', '2222222', '3333333', '4444444', '5555555', '6666666', '7777777', '8888888', '9999999'];

        for (var i = 0; i < this.range(); i++)
        {
          var number = String(this.number());

          if (number.length > 6) normals.push(Number(number));
        }

        return {
          normals:  normals,
          premiums: premiums
        }
      }
    }
  }
);;'use strict';


angular.module('WebPaige.Services.Sloter', ['ngResource'])


/**
 * Planboard data processors
 */
.factory('Sloter', 
[
  '$rootScope', 'Storage', 
  function ($rootScope, Storage) 
  {
    return {

      /**
       * Getters
       */
      get: {
        groups: function ()
        {
          var groups = {};

          angular.forEach(Storage.local.groups(), function (group, index)
          {
            groups[group.uuid] = group.name;
          });

          return groups;
        },

        members: function ()
        {
          var members = {};

          angular.forEach(Storage.local.members(), function (member, index)
          {
            members[member.uuid] = member.name;
          });

          return members;
        }
      },

      /**
       * Wrap for sorting in list
       */
      wrapper: function (rank) { return '<span style="display:none;">' + rank + '</span>' },

      /**
       * Wrap secrets in slot contents
       */
      secret: function (content) { return '<span class="secret">' + content + '</span>' },

      /**
       * Add loading bars on both ends
       */
      addLoading: function (data, timedata, rows)
      {
        angular.forEach(rows, function(row, index)
        {
          timedata.push({
            start:  data.periods.end,
            end:    1577836800000,
            group:  row,
            content:    'loading',
            className:  'state-loading-right',
            editable:   false
          });

          timedata.push({
            start:  0,
            end:    data.periods.start,
            group:  row,
            content:    'loading',
            className:  'state-loading-left',
            editable:   false
          });
        });

        return timedata;
      },

      /**
       * Handle user slots
       */
      user: function (data, timedata, config)
      {
        var _this = this;

        angular.forEach(data.user, function (slot, index)
        {
          angular.forEach(config.legenda, function (value, legenda)
          {
            if (slot.text == legenda && value)
            {
              timedata.push({
                start:  Math.round(slot.start * 1000),
                end:    Math.round(slot.end * 1000),
                group:  (slot.recursive) ?  _this.wrapper('b') + $rootScope.ui.planboard.weeklyPlanning + _this.wrapper('recursive') : 
                                            _this.wrapper('a') + $rootScope.ui.planboard.planning + _this.wrapper('planning'),
                content:  _this.secret(angular.toJson({
                  type:   'slot',
                  id:     slot.id, 
                  recursive: slot.recursive, 
                  state:  slot.text 
                  })),
                className:  config.states[slot.text].className,
                editable:   true
              });
            };
          });       
        });

        timedata = _this.addLoading(data, timedata, [
          _this.wrapper('b') + $rootScope.ui.planboard.weeklyPlanning + _this.wrapper('recursive'),
          _this.wrapper('a') + $rootScope.ui.planboard.planning + _this.wrapper('planning')
        ]);

        return timedata;
      },
    
      /**
       * TODO
       * Look for ways to combine with user
       * 
       * Profile timeline data processing
       */
      profile: function (data, config)
      {
        var _this = this,
            timedata = [];

        angular.forEach(data, function (slot, index)
        {
          angular.forEach(config.legenda, function (value, legenda)
          {
            if (slot.text == legenda && value)
            {
              timedata.push({
                start:  Math.round(slot.start * 1000),
                end:    Math.round(slot.end * 1000),
                group:  (slot.recursive) ?  _this.wrapper('b') + $rootScope.ui.planboard.weeklyPlanning + _this.wrapper('recursive') : 
                                            _this.wrapper('a') + $rootScope.ui.planboard.planning + _this.wrapper('planning'),
                content: _this.secret(angular.toJson({
                  type: 'slot',
                  id:   slot.id, 
                  recursive:  slot.recursive, 
                  state:      slot.text 
                  })),
                className:  config.states[slot.text].className,
                editable:   true
              });  
            };
          });       
        });

        timedata.push({
          start:  0,
          end:    1,
          group:  _this.wrapper('b') + $rootScope.ui.planboard.weeklyPlanning + _this.wrapper('recursive'),
          content:    '',
          className:  null,
          editable:   false
        });

        timedata.push({
          start:  0,
          end:    1,
          group:  _this.wrapper('a') + $rootScope.ui.planboard.planning + _this.wrapper('planning'),
          content:    '',
          className:  null,
          editable:   false
        });

        return timedata;
      },

      /**
       * Handle group name whether divisions selected
       */
      namer: function (data, divisions, privilage)
      {
        var groups  = this.get.groups(),
            name    = groups[data.aggs.id],
            link    = '<a href="#/groups?uuid=' + 
                      data.aggs.id + 
                      '#view">' +
                      name +
                      '</a>',
                      title;

        if (data.aggs.division == 'all' || data.aggs.division == undefined)
        {
          title = (privilage == 1) ? link : '<span>' + name + '</span>';
        }
        else
        {
          var label;

          angular.forEach(divisions, function (division, index) { if (division.id == data.aggs.division) label = division.label; });

          title = (privilage == 1) ? link : '<span>' + name + '</span>';

          title += ' <span class="label">' + label + '</span>';
        };

        return title;
      },

      /**
       * Handle group aggs (with divisions) with bars
       */
      bars: function (data, timedata, config, name)
      {
        var _this = this,
            maxh = 0;

        angular.forEach(data.aggs.data, function (slot, index) { if (slot.wish > maxh)  maxh = slot.wish; });

        angular.forEach(data.aggs.data, function (slot, index)
        {
          var maxNum      = maxh,
              num         = slot.wish,
              xwish       = num,
              height      = Math.round(num / maxNum * 80 + 20), // a percentage, with a lower bound on 20%
              minHeight   = height,
              style       = 'height:' + height + 'px;',
              requirement = '<div class="requirement" style="' + 
                            style + 
                            '" ' + 

                            'title="'+'Minimum aantal benodigden'+': ' + 

                            num + 
                            ' personen"></div>';

          num = slot.wish + slot.diff;

          var xcurrent = num;

          height = Math.round(num / maxNum * 80 + 20);

          if (slot.diff >= 0 && slot.diff < 7)
          {
            switch (slot.diff)
            {
              case 0:
                var color = config.densities.even;
              break
              case 1:
                var color = config.densities.one;
              break;
              case 2:
                var color = config.densities.two;
              break;
              case 3:
                var color = config.densities.three;
              break;
              case 4:
                var color = config.densities.four;
              break;
              case 5:
                var color = config.densities.five;
              break;
              case 6:
                var color = config.densities.six;
              break;
            }
          }
          else if (slot.diff >= 7)
          {
            var color = config.densities.more;
          }
          else
          {
            var color = config.densities.less;
          };

          var span = '<span class="badge badge-inverse">' + slot.diff + '</span>';

          if (xcurrent > xwish) height = minHeight;

          style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';

          var actual = '<div class="bar" style="' + 
                        style + 
                        '" ' + 

                        ' title="Huidig aantal beschikbaar: ' + 

                        num + 
                        ' personen">' + 
                        span + 
                        '</div>';

          if (  (slot.diff > 0  && config.legenda.groups.more) ||
                (slot.diff == 0 && config.legenda.groups.even) || 
                (slot.diff < 0  && config.legenda.groups.less) )
          {
            timedata.push({
              start:    Math.round(slot.start * 1000),
              end:      Math.round(slot.end * 1000),
              group:    _this.wrapper('c') + name,
              content:  requirement + 
                        actual +
                        _this.secret(angular.toJson({
                          type: 'group',
                          diff: slot.diff,
                          group: name
                        })),
              className: 'group-aggs',
              editable: false
            });
          };

          timedata = _this.addLoading(data, timedata, [
            _this.wrapper('c') + name
          ]);
        });

        return timedata;
      },

      /**
       * Process plain group aggs
       */
      aggs: function (data, timedata, config, name)
      {
        var _this = this;

        angular.forEach(data.aggs.data, function (slot, index)
        {
          var cn;

          if (slot.diff >= 0 && slot.diff < 7)
          {
            switch (slot.diff)
            {
              case 0: cn = 'even';  break
              case 1: cn = 1;       break
              case 2: cn = 2;       break
              case 3: cn = 3;       break
              case 4: cn = 4;       break
              case 5: cn = 5;       break
              case 6: cn = 6;       break
            }
          }
          else if (slot.diff >= 7)
          {
            cn = 'more';
          }
          else
          {
            cn = 'less'
          };

          if (  (slot.diff > 0  && config.legenda.groups.more) ||
                (slot.diff == 0 && config.legenda.groups.even) || 
                (slot.diff < 0  && config.legenda.groups.less) )
          {
            timedata.push({
              start:  Math.round(slot.start * 1000),
              end:    Math.round(slot.end * 1000),
              group: _this.wrapper('c') + name,
              content:  cn +
                        _this.secret(angular.toJson({
                          type: 'group',
                          diff: slot.diff,
                          group: name
                        })),
              className:  'agg-' + cn,
              editable:   false
            });
          };

          timedata = _this.addLoading(data, timedata, [
            _this.wrapper('c') + name
          ]);
        });

        return timedata;
      },

      /**
       * Wish slots
       */
      wishes: function (data, timedata, name)
      {
        var _this = this;

        angular.forEach(data.aggs.wishes, function (wish, index)
        {
          if ( wish.count >= 7 )
          {
            var cn = 'wishes-more';
          }
          else if ( wish.count == 0 )
          {
            var cn = 'wishes-even';
          }
          else
          {
            var cn = 'wishes-' + wish.count;
          };

          timedata.push({
            start:  Math.round(wish.start * 1000),
            end:    Math.round(wish.end * 1000),
            group:  _this.wrapper('c') + name + ' (Wishes)',
            content: '<span class="badge badge-inverse">' + wish.count + '</span>' + 
                      _this.secret(angular.toJson({
                        type: 'wish',
                        wish: wish.count,
                        group: name,
                        groupId: data.aggs.id
                      })),
            className:  cn,
            editable:   false
          });

          timedata = _this.addLoading(data, timedata, [
            _this.wrapper('c') + name + ' (Wishes)'
          ]);
        });

        return timedata;
      },

      /**
       * Process members
       */
      members: function (data, timedata, config, privilage)
      {
        var _this   = this;
        var offset = Number(Date.now());
        
          angular.forEach(data.members, function (member, index)
          {


        	var tasks = [];
        	if(data.section == "teams"){
        		console.log("data.teams.tasks " , data.teams.tasks);
        		if(data.teams.tasks[member.memId] != null){
        			tasks.add(data.teams.tasks[member.memId]);	
        		}        		
        	}else if(data.section == "clients"){
        		console.log("data.clients.tasks " , data.clients.tasks);
        		if(data.clients.tasks[member.memId] != null){
        			tasks.add(data.clients.tasks[member.memId]);	
        		}  
        	}
        	
        	
            var mdata = [];

            angular.forEach(tasks, function (task)
            {
              var relatedUser = "";
              if(data.section == "teams"){
            	  // should get the name from team members ;
            	  
            	  relatedUser = $rootScope.getClientByID(task.relatedUserId);
              }else if(data.section == "clients"){
            	  // should get the name from clients;
            	  
            	  relatedUser = $rootScope.getTeamMemberById(task.relatedUserId);
              }
              var slotContent = "";
              if(typeof relatedUser != 'undefined'){
            	  slotContent = relatedUser.firstName + " " + relatedUser.lastName; 
              }
              // deal with the unfinished task 
              if(task.endTime == 0){
            	  task.endTime = offset/1000;
              }
              timedata.push({
	              start:  Math.round(task.startTime * 1000),
	              end:    Math.round(task.endTime * 1000),
	              // group:  link,
	              group: member.head,
	              /*
	              content: _this.secret(angular.toJson({
	                type: 'member',
	                id:   slot.id,
	                mid:  member.id,
	                recursive: slot.recursive,
	                state: slot.text
	              })),
	              */
	              content: "<span>"+slotContent +"</span>" + 
	              "<input type=hidden value='"+ angular.toJson({
		                type: 'slot',
		                id:   task.uuid,
		                mid:  task.authorId,
//		                recursive: slot.recursive,
		                state: task.description,
		                relatedUser : task.relatedUserId,
		              }) +"'>",
	              // className:  config.states[slot.text].className,
	              className:  'state-available',
	              editable:   false,	              
	          });
              
            });



            timedata = _this.addLoading(data, timedata, [ member.head ]);

            /**
             * TODO
             * Good place to host this here?
             */
            angular.forEach(member.stats, function (stat, index)
            {
              var state = stat.state.split('.');
              state.reverse();
              stat.state = 'bar-' + state[0];
            });
          });


        return timedata;
      },

      /**
       * Produce pie charts
       */
      pies: function (data)
      {
        document.getElementById("groupPie").innerHTML = '';

        var ratios    = [],
            colorMap  = {
              more: '#415e6b',
              even: '#ba6a24',
              less: '#a0a0a0'
            },
            colors    = [],
            xratios   = [];

        angular.forEach(data.aggs.ratios, function (ratio, index)
        {
          if (ratio != 0)
          {
            ratios.push({
              ratio: ratio, 
              color: colorMap[index]
            });
          };
        });

        ratios = ratios.sort(function (a, b) { return b.ratio - a.ratio });

        angular.forEach(ratios, function (ratio, index)
        {
          colors.push(ratio.color);
          xratios.push(ratio.ratio);
        });

        var r   = Raphael("groupPie"),
            pie = r.piechart(120, 120, 100, xratios, { colors: colors });
      },
      
      /**
       * Timeline data processing
       */
      process: function (data, config, divisions, privilage)
      {
        var _this     = this,
            timedata  = [];

        // if (data.user) timedata = _this.user(data, timedata, config);

        /*
        if (data.aggs)
        {
          var name = _this.namer(data, divisions, privilage);

          if (config.bar) 
          {
            timedata = _this.bars(data, timedata, config, name);
          }
          else
          {
            timedata = _this.aggs(data, timedata, config, name);
          };
        };

        if (config.wishes) timedata = _this.wishes(data, timedata, name);
        */

        if (data.members) timedata = _this.members(data, timedata, config, privilage);

        /*
        if (data.aggs && data.aggs.ratios) _this.pies(data);
        */

        return timedata;
      }

    }
  }
]);;'use strict';


angular.module('WebPaige.Filters', ['ngResource'])


/**
 * Translate package
 */
.filter('translatePackage', 
[
	'$config', 
	function ($config)
	{
		return function (selected)
		{
			if (selected)
			{
				var gem;

				angular.forEach($config.packages, function (pack)
				{
					if (pack.id == selected) gem = pack;
				});

				return gem.label;
			}
		}
	}
])


/**
 * Translate country
 */
.filter('translateCountry', 
[
	'$config', 
	function ($config)
	{
		return function (selected)
		{
			if (selected)
			{
				var gem;

				angular.forEach($config.countries, function (country)
				{
					if (country.id == selected) gem = country;
				});

				return gem.label;
			}
		}
	}
])


/**
 * Translate region
 */
.filter('translateRegion', 
[
	'$config', 
	function ($config)
	{
		return function (selected, country)
		{
			if (selected && country)
			{
				var gem;

				angular.forEach($config.regions[country], function (region)
				{
					if (region.id == selected) gem = region;
				});

				return gem.label;
			}
		}
	}
])



/**
 * Translate service
 */
.filter('translateService', 
[
	'$config', 
	function ($config)
	{
		return function (selected)
		{
			if (selected)
			{
				var gem;

				angular.forEach($config.virtuals, function (virtual)
				{
					if (virtual.id == selected) gem = virtual;
				});

				return gem.label;
			}
		}
	}
])




/**
 * Translate roles
 */
 .filter('translateRole', 
 [
 	'$config', 
 	function ($config)
 	{
 		return function (role)
 		{
 			var urole;

 			angular.forEach($config.roles, function (prole)
 			{
 				if (prole.id == role) urole = prole.label;
 			});

 			return urole;
 		}
 	}
 ])


 /**
 * Translate roles
 */
 .filter('translateFunc', 
 [
 	'$config', 
 	function ($config)
 	{
 		return function (func)
 		{
 			var ufunc;

 			angular.forEach($config.mfunctions, function (pfunc)
 			{
 				if (pfunc.id == func) ufunc = pfunc.label;
 			});

 			return ufunc;
 		}
 	}
 ])
 

/**
 * Translate state value to icon
 */
 .filter('stateDataIcon', 
 [
    '$config', 
    function ($config)
    {
        return function (name,type){
            var ret;

            angular.forEach($config.stateIcons, function (stateIcon, index)
            {
                if (angular.lowercase(stateIcon.name) == angular.lowercase(name)){
                  if(type == "data_icon"){
                      ret = stateIcon.data_icon;
                  }else if(type == "class_name"){
                      ret = stateIcon.class_name;
                  }  
                } 
            });

            return ret;
        }
    }
 ])

 
/**
 * Translate state circle color 
 */
 .filter('stateColor', 
 [
    '$config', 
    function ($config)
    {
        return function (states)
        {
            var ret = $config.stateColors.none;
            
            angular.forEach(states, function (state, index){
                /**
                 *    WORKING
                 *    OFFLINE
                 *    AVAILABLE
                 *    UNAVAILABLE
                 *    UNKNOWN
                 */
                if(angular.lowercase(state.name) == "availability" && state.share){
                    if(angular.lowercase(state.value) == "availalbe" || angular.lowercase(state.value) == "working" ){
                        ret = $config.stateColors.availalbe; 
                    }else if(angular.lowercase(state.value) == "unavailable"){
                        ret = $config.stateColors.busy;
                    }else if(angular.lowercase(state.value) == "offline"){
                        ret = $config.stateColors.offline;
                    }
                }
            });

            return ret;
        }
    }
 ])

 
 /**
 * Translate state circle color 
 */
 .filter('stateValue', 
 [
    '$config', 
    function ($config){
        return function (state,type){
            if(angular.lowercase(state.name) == "location"){
                var value = state.value;
                var match = value.match(/\((.*?)\)/);
                if(match == null){
                    return value;
                }else{
                    var ll = match[1];
                    value = value.replace(match[0],"");
                    if(type == "data"){
                        return ll;
                    }else{
                        return value;
                    }
                }
            }else{
                return state.value;
            }
        }
    }
])




/**
 * Main range filter
 */
.filter('rangeMainFilter',
[
	'Dater', 'Storage',
	function (Dater, Storage)
	{
		var periods = Dater.getPeriods();

		return function (dates)
		{
      // console.log('dates ->', dates);

			if ((new Date(dates.end).getTime() - new Date(dates.start).getTime()) == 86401000)
				dates.start = new Date(dates.end).addDays(-1);

			var dates = {
						start: {
							real: 	new Date(dates.start).toString('dddd, MMMM d'),
							month: 	new Date(dates.start).toString('MMMM'),
							day: 		new Date(dates.start).toString('d')
						},
						end: {
							real: 	new Date(dates.end).toString('dddd, MMMM d'),
							month: 	new Date(dates.end).toString('MMMM'),
							day: 		new Date(dates.end).toString('d')
						}
					},
					monthNumber = Date.getMonthNumberFromName(dates.start.month);

			if ((((Math.round(dates.start.day) + 1) == dates.end.day && dates.start.hour == dates.end.hour) || dates.start.day == dates.end.day) && dates.start.month == dates.end.month)
			{
				return 	dates.start.real +
								', ' +
								Dater.getThisYear();
			}
			else if(dates.start.day == 1 && dates.end.day == periods.months[monthNumber + 1].totalDays)
			{
				return 	dates.start.month +
								', ' +
								Dater.getThisYear();
			}
			else
			{
				return 	dates.start.real +
								' / ' +
								dates.end.real +
								', ' +
								Dater.getThisYear();
			}

		}
	}
])








/**
 * Main range week filter
 */
.filter('rangeMainWeekFilter',
[
	'Dater', 'Storage',
	function (Dater, Storage)
	{
		var periods = Dater.getPeriods();

		return function (dates)
		{
			if (dates)
			{
				var dates = {
					start: 	new Date(dates.start).toString('dddd, MMMM d'),
					end: 		new Date(dates.end).toString('dddd, MMMM d')
				};

				return 	dates.start +
								' / ' +
								dates.end +
								', ' +
								Dater.getThisYear();
			}
		}
	}
])








/**
 * Range info filter
 */
.filter('rangeInfoFilter',
[
	'Dater', 'Storage',
	function (Dater, Storage)
	{
		var periods = Dater.getPeriods();

		return function (timeline)
		{
			var diff = new Date(timeline.range.end).getTime() - new Date(timeline.range.start).getTime();

			if (diff > (2419200000 + 259200000))
			{
				return 'Total selected days: ' + Math.round(diff / 86400000);
			}
			else
			{
				if (timeline.scope.day)
				{
					var hours = {
						start: new Date(timeline.range.start).toString('HH:mm'),
						end: new Date(timeline.range.end).toString('HH:mm')
					};

					/**
					 *  00:00 fix => 24:00
					 */
					if (hours.end == '00:00') hours.end = '24:00';

					return 	'Time: ' +
									hours.start +
									' / ' +
									hours.end;
				}
				else if (timeline.scope.week)
				{
					return 	'Week number: ' +
									timeline.current.week;
				}
				else if (timeline.scope.month)
				{
					return 	'Month number: ' +
									timeline.current.month +
									', Total days: ' +
									periods.months[timeline.current.month].totalDays;
				}
			}
		};
	}
])







/**
 * Range info week filter
 */
.filter('rangeInfoWeekFilter',
[
	'Dater', 'Storage',
	function (Dater, Storage)
	{
		var periods = Dater.getPeriods();

		return function (timeline)
		{
			if (timeline) return 'Week number: ' + timeline.current.week;
		};
	}
])








/**
 * BUG!
 * Maybe not replace bar- ?
 * 
 * TODO
 * Implement state conversion from config later on!
 * 
 * Convert ratios to readable formats
 */
// .filter('convertRatios', 
// [
// 	'$config', 
// 	function ($config)
// 	{
// 		return function (stats)
// 		{
// 			var ratios = '';

// 			angular.forEach(stats, function (stat, index)
// 			{
// 				ratios += stat.ratio.toFixed(1) + '% ' + stat.state.replace(/^bar-+/, '') + ', ';
// 			});

// 			return ratios.substring(0, ratios.length - 2);
// 		};
// 	}
// ])








/** 
 * Calculate time in days
 */
// .filter('calculateTimeInDays', 
// 	function ()
// 	{
// 		return function (stamp)
// 		{
// 			var day 		= 1000 * 60 * 60 * 24,
// 					hour		=	1000 * 60 * 60,
// 					days 		= 0,
// 					hours 	= 0,
// 					stamp 	= stamp * 1000,
// 					hours 	= stamp % day,
// 					days 		= stamp - hours;

// 			return 	Math.floor(days / day);
// 		};
// 	}
// )








/**
 * Calculate time in hours
 */
// .filter('calculateTimeInHours', 
// 	function ()
// 	{
// 		return function (stamp)
// 		{
// 			var day 		= 1000 * 60 * 60 * 24,
// 					hour		=	1000 * 60 * 60,
// 					days 		= 0,
// 					hours 	= 0,
// 					stamp 	= stamp * 1000,
// 					hours 	= stamp % day,
// 					days 		= stamp - hours;

// 			return 	Math.floor(hours / hour);
// 		};
// 	}
// )







/**
 * Calculate time in minutes
 */
// .filter('calculateTimeInMinutes', 
// 	function ()
// 	{
// 		return function (stamp)
// 		{
// 			var day 		= 1000 * 60 * 60 * 24,
// 					hour		=	1000 * 60 * 60,
// 					minute 	= 1000 * 60,
// 					days 		= 0,
// 					hours 	= 0,
// 					minutes = 0,
// 					stamp 	= stamp * 1000,
// 					hours 	= stamp % day,
// 					days 		= stamp - hours,
// 					minutes = stamp % hour;

// 			return 	Math.floor(minutes / minute);
// 		};
// 	}
// )







/**
 * Convert eve urls to ids
 */
// .filter('convertEve', 
// 	function ()
// 	{
// 	  return function (url)
// 	  {
// 	  	var eve = url;

// 	  	eve = (typeof url != "undefined") ? url.split("/") : ["", url, ""];

// 	    return eve[eve.length-2];
// 	  };
// 	}
// )







/** 
 * Convert user uuid to name
 */
// .filter('convertUserIdToName', 
// [
// 	'Storage', 
// 	function (Storage)
// 	{
// 		var members = angular.fromJson(Storage.get('members'));

// 		return function (id)
// 		{	
// 	    if (members == null || typeof members[id] == "undefined")
// 	    {
// 	      return id;
// 	    }
// 	    else
// 	    {
// 	      return members[id].name;
// 	    };
// 		};
// 	}
// ])







/**
 * Convert timeStamps to dates
 */
 .filter('nicelyDate', 
 [
 	'$rootScope', 
 	function ($rootScope)
 	{
 	 	return function (date)
 	 	{
      if (typeof date == 'string')
      {
        date = Number(date);
      }



      if (String(date).length == 10)
      {
        date *= 1000
      }

 	 		return new Date(date).toString($rootScope.config.formats.date);
 	 	};
 	}
 ])


/**
 * Convert timeStamps to dates
 */
 .filter('nicelyTime', 
 [
 	'$rootScope', 
 	function ($rootScope)
 	{
 	 	return function (date)
 	 	{
 	 		if (typeof date == 'string') date = Number(date);

 	 		return new Date(date).toString($rootScope.config.formats.time);
 	 	};
 	}
 ])




/**
 * TODO
 * Not used probably!
 *
 * Combine this either with nicelyDate or terminate!
 * 
 * Convert timeStamp to readable date and time
 */
// .filter('convertTimeStamp', 
// 	function ()
// 	{
// 		return function (stamp)
// 		{
// 			console.warn(typeof stamp);

// 			return new Date(stamp).toString('dd-MM-yyyy HH:mm');
// 		};
// 	}
// )







/**
 * TODO
 * Still used?
 * 
 * No title filter
 */
// .filter('noTitle',
// 	function ()
// 	{
// 		return function (title)
// 		{
// 			return (title == "") ? "- No Title -" : title;
// 		}
// 	}
// )







/**
 * TODO
 * Finish it!
 * 
 * Strip span tags
 */
// .filter('stripSpan', 
// 	function ()
// 	{
// 	  return function (string)
// 	  {
// 	    return string.match(/<span class="label">(.*)<\/span>/);
// 	  }
// 	}
// )







/**
 * Strip html tags
 */
// .filter('stripHtml', 
// 	function ()
// 	{
// 	  return function (string)
// 	  {
// 	  	if (string) return string.split('>')[1].split('<')[0];
// 	  }
// 	}
// )







/**
 * Convert group id to name
 */
// .filter('groupIdToName', 
// [
// 	'Storage', 
// 	function (Storage)
// 	{
// 	  return function (id)
// 	  {
// 	  	var groups = angular.fromJson(Storage.get('groups'));

// 	  	for (var i in groups)
// 	  	{
// 	  		if (groups[i].uuid == id) return groups[i].name;
// 	  	};
// 	  }
// 	}
// ])








/**
 * TODO
 * Internationalization 
 */ 
 .filter('i18n_spec',
 [
 	'$rootScope', 
 	function ($rootScope)
 	{
 		return function (string, type)
 		{
 			var types = type.split("."),
 					ret 	= $rootScope.ui[types[0]][types[1]],
 					ret 	= ret.replace('$v',string);
			
 			return ret;
 		}
 	}
 ])


.filter('stateIcon',
[
     '$rootScope',
     function ($rootScope){
         return function(state){    
             switch(state){
                 case 'emotion':
                     return "icon-face";
                 break;
                 case 'availability':
                     return "icon-avail";
                 break;
                 case 'location':
                     return "icon-location";
                 break;
                 case 'activity':
                     return "icon-activity";
                 break;
                 case 'reachability':
                     return "icon-reach";
                 break;
                 default:
                     return "icon-info-sign";
             }
         }
     }
])

/**
 * TODO
 * Internationalization 
 */ 
 .filter('escape',
 [
    '$rootScope', 
    function ($rootScope)
    {
        return function (string)
        {
        	if(!string || string.indexOf(".") == -1){
        		return string;
        	}
            var ret = string.replace(".","").replace("@","")
            
            return ret;
        }
    }
 ])


/**
 * Truncate group titles for dashboard pie widget
 */
// .filter('truncateGroupTitle', 
// [
// 	'Strings', 
// 	function (Strings) 
// 	{
// 		return function (title)
// 		{
// 	     return Strings.truncate(title, 20, true);
// 	  }
// 	}
// ])







/**
 * Make first letter capital
 */
// .filter('toTitleCase', 
// [
// 	'Strings', 
// 	function (Strings) 
// 	{
// 		return function (txt)
// 		{
// 	     return Strings.toTitleCase(txt);
// 	  }
// 	}
// ])







/**
 * Count messages in box
 */
// .filter('countBox',
// 	function () 
// 	{
// 		return function (box)
// 		{
// 			var total = 0;

// 			angular.forEach(box, function (bulk, index)
// 			{
// 				total = total + bulk.length;
// 			});

// 	    return total;
// 	  }
// 	}
// )








/**
 * Convert offsets array to nicely format in scheaduled jobs
 */
// .filter('nicelyOffsets', 
// [
// 	'Dater', 'Storage', 'Offsetter',
// 	function (Dater, Storage, Offsetter)
// 	{
// 		return function (data)
// 		{
// 			var offsets 	= Offsetter.factory(data),
// 					compiled 	= '';

// 			angular.forEach(offsets, function (offset, index)
// 			{
// 				compiled += '<div style="display:block; margin-bottom: 5px;">';

// 				compiled += '<span class="badge">' + offset.time + '</span>&nbsp;';

// 				if (offset.mon) compiled += '<span class="muted"><small><i> maandag,</i></small></span>';
// 				if (offset.tue) compiled += '<span class="muted"><small><i> dinsdag,</i></small></span>';
// 				if (offset.wed) compiled += '<span class="muted"><small><i> woensdag,</i></small></span>';
// 				if (offset.thu) compiled += '<span class="muted"><small><i> donderdag,</i></small></span>';
// 				if (offset.fri) compiled += '<span class="muted"><small><i> vrijdag,</i></small></span>';
// 				if (offset.sat) compiled += '<span class="muted"><small><i> zaterdag,</i></small></span>';
// 				if (offset.sun) compiled += '<span class="muted"><small><i> zondag,</i></small></span>';

// 				compiled = compiled.substring(0, compiled.length - 20);

// 				compiled = compiled += '</i></small></span>';

// 				compiled += '</div>';

// 				compiled = compiled.substring(0, compiled.length);
// 			});

// 			return compiled;
// 		}
// 	}
// ])








/**
 * Convert array of audience to a nice list
 */
// .filter('nicelyAudience', 
// [
// 	'Storage',
// 	function (Storage)
// 	{
// 		return function (data)
// 		{
// 			var members 	= angular.fromJson(Storage.get('members')),
// 	    		groups 		= angular.fromJson(Storage.get('groups')),
// 	    		audience 	= [];

// 			angular.forEach(data, function (recipient, index)
// 			{
// 	  		var name;

// 	  		if (members[recipient])
// 	  		{
// 		  		name = members[recipient].name;
// 	  		}
// 	  		else
// 	  		{
// 	  			angular.forEach(groups, function (group, index)
// 	  			{
// 	  				if (group.uuid == recipient) name = group.name;
// 	  			});
// 	  		}

// 		  	audience += name + ', ';
// 			});

// 			return audience.substring(0, audience.length - 2);
// 		}
// 	}
// ])
;;/*jslint node: true */
/*global angular */
'use strict';

angular.module('WebPaige.Controllers.Login', [])

/**
 * Login controller
 */
.controller('login',
[ '$rootScope', '$location', '$q', '$scope', 'Session', 'User', 'Teams', 'Clients', 'Storage', '$routeParams', 'Settings', 'Profile', 'MD5', 
        function($rootScope, $location, $q, $scope, Session, User, Teams, Clients, Storage, $routeParams, Settings, Profile, MD5) {
            var self = this;


          // console.log('location ->', $location.path());

          if ($location.path() == '/logout')
          {
            $('body').css({
              'backgroundColor': '#1dc8b6',
              'backgroundImage': 'none'
            });
          }

            /**
             * Set default views
             */
            if ($routeParams.uuid && $routeParams.key) {
                $scope.views = {
                    changePass : true
                };

                $scope.changepass = {
                    uuid : $routeParams.uuid,
                    key : $routeParams.key
                }
            } else {
                $scope.views = {
                    login : true,
                    forgot : false
                };
            }
            
            /**
             * Set default alerts
             */
            $scope.alert = {
              login: {
                display:  false,
                type:     '',
                message:  ''
              },
              forgot: {
                display:  false,
                type:     '',
                message:  ''
              }
            };
            
            /**
             * Init rootScope app info container
             */
            if (!Storage.session.get('app')) Storage.session.add('app', '{}');
            
            /**
             * TODO
             * Lose this jQuery stuff later on!
             * 
             * Jquery solution of toggling between login and app view
             */
            $('.navbar').hide();
            $('#footer').hide();
            $('#watermark').hide();
            $('body').css({
              'backgroundColor': '#1dc8b6'
            });

            /**
             * TODO
             * use native JSON functions of angular and Store service
             */
            var logindata = angular.fromJson(Storage.get('logindata'));

            if (logindata && logindata.remember) $scope.logindata = logindata;
            
            /**
             * TODO
             * Remove unneccessary DOM manipulation
             * Use cookies for user credentials
             * 
             * Login trigger
             */
            $scope.login = function()
            {
              $('#alertDiv').hide();

              if (!$scope.logindata ||
                  !$scope.logindata.username || 
                  !$scope.logindata.password)
              {
                $scope.alert = {
                  login: {
                    display: true,
                    type:    'alert-error',
                    message: $rootScope.ui.login.alert_fillfiled
                  }
                };

                $('#login button[type=submit]')
                  .text($rootScope.ui.login.button_login)
                  .removeAttr('disabled');

                return false;     
              }

              $('#login button[type=submit]')
                .text($rootScope.ui.login.button_loggingIn)
                .attr('disabled', 'disabled');

              Storage.add('logindata', angular.toJson({
                username: $scope.logindata.username,
                password: $scope.logindata.password,
                remember: $scope.logindata.remember
              }));

              self.auth( $scope.logindata.username, MD5($scope.logindata.password ));
            };

            /**
             * Authorize user
             */
            self.auth = function (uuid, pass)
            {
              User.login(uuid.toLowerCase(), pass)
              .then(function (result)
                {
                if (result.status == 400 || result.status == 403)
                {
                  $scope.alert = {
                    login: {
                      display: true,
                      type: 'alert-error',
                      message: $rootScope.ui.login.alert_wrongUserPass
                    }
                  };

                  $('#login button[type=submit]')
                    .text($rootScope.ui.login.button_loggingIn)
                    .removeAttr('disabled');

                  return false;
                }
                else
                {
                  Session.set(result["X-SESSION_ID"]);

                  self.preloader();
                }
                });
            };
            
            
            /**
             * TODO
             * What happens if preloader stucks?
             * Optimize preloader and messages
             * 
             * Initialize preloader
             */
            self.preloader = function()
            {
              $('#login').hide();
              $('#download').hide();
              $('#preloader').show();

              self.progress(20, $rootScope.ui.login.loading_User);
              
              // preload the user's info 
              User.memberInfo()
              .then(function (resources)
              {
                if (resources.error)
                {
                  console.warn('error ->', resources);
                }
                else
                {
                  $rootScope.app.resources = resources;

                  self.progress(40, $rootScope.ui.login.loading_Teams);
                  
                  // preload the teams and members
                  Teams.query(true,{})
                  .then(function (teams)
                  {
                    console.log("got teams ");
                    
                    // try to get the members not in the teams Aync 
                    console.log("got members not in any teams");
                    Teams.queryMembersNotInTeams().then(function(result){
                    	console.log("members not in any teams loaded ");
                    },function(error){
                    	
                    });
                    
                    if (teams.error)
                    {
                      console.warn('error ->', teams);
                    }
                    
                    console.log("start to query team-clientgroup relation async ");
                    
                    self.progress(60, $rootScope.ui.login.loading_clientGroups);
                    // preload the clientGroups for each team
                    Teams.queryClientGroups(teams)
                    .then(function(){
                        console.log("got clientGroups belong to the teams ");
                        
                        self.progress(80, $rootScope.ui.login.loading_clientGroups);
                        
                        Clients.queryAll()
                        .then(function(){
                            console.log("got all clients in or not in the client groups ");
                            
                            Clients.query(false,{})
                            .then(function(){
                                console.log("got all grous and the clients in the groups ");
                                
                                finalize();
                            },function(error){
                                deferred.resolve({error: error});
                            })
                            
                            
                        },function(error){
                            deferred.resolve({error: error});
                        });
                        
                        
                    },function(error){
                        deferred.resolve({error: error});
                    });
                    
                    
                  },function (error){
                      deferred.resolve({error: error});
                  });
                }
              });
            };
            
            /**
             * Finalize the preloading
             */
            function finalize ()
            {
              // console.warn( 'settings ->',
              //               'user ->', angular.fromJson($rootScope.app.resources.settingsWebPaige).user,
              //               'widgets ->', angular.fromJson($rootScope.app.resources.settingsWebPaige).app.widgets,
              //               'group ->', angular.fromJson($rootScope.app.resources.settingsWebPaige).app.group);

              self.progress(100, $rootScope.ui.login.loading_everything);

              self.redirectToTeamPage();

//              self.getMessages();

//              self.getMembers();    
            }
            
            /**
             * Redirect to dashboard
             */
            self.redirectToTeamPage = function ()
            {
              $location.path('/team');

              setTimeout(function ()
              {
                $('body').css({ 'background': 'none' });
                $('.navbar').show();
                // $('#mobile-status-bar').show();
                // $('#notification').show();
                if (!$rootScope.browser.mobile) $('#footer').show();
                $('#watermark').show();
                $('body').css({ 'background': 'url(../img/bg.jpg) repeat' });
              }, 100);
            };
            
            /**
             * Progress bar
             */
            self.progress = function (ratio, message)
            {
              $('#preloader .progress .bar').css({ width: ratio + '%' }); 
              $('#preloader span').text(message);    
            };
        } 
]);;/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Forgotpass', [])


/**
 * Forgot password controller
 */
.controller('forgotpass',
[
	'$rootScope', '$scope', '$location',
	function ($rootScope, $scope, $location)
	{
		/**
		 * Fix styles
		 */
		$rootScope.fixStyles();

	}
]);;/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Register', [])


/**
 * Forgot password controller
 */
.controller('register',
[
	'$rootScope', '$scope', '$location',
	function ($rootScope, $scope, $location)
	{
		/**
		 * Fix styles
		 */
		$rootScope.fixStyles();

	}
]);;/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Core', [])


/**
 * Core controller
 */
.controller('core',
[
	'$rootScope', '$scope', '$location', 'Generators','Team',
	function ($rootScope, $scope, $location, Generators,Team)
	{
		/**
		 * Fix styles
		 */
	    console.log(Team);
		$rootScope.fixStyles();


	  /**
	   * General order container
	   */
	  $scope.order = {
	  	package: 	null,
	  	country: 	31
	  	// package: 	1,
	  	// country: 	31,
	  	// region: 		10,
	  	// number: 		1234567
	  };


		/**
		 * Pass containers
		 */
		$scope.packages 	= $rootScope.config.packages;
		$scope.countries 	= $rootScope.config.countries;
		$scope.virtuals 	= $rootScope.config.virtuals;



		/**
		 * Set defaults
		 */
		$scope.defaults = {
			package: 	1,
			country: 	31
		};

		$scope.order.country = $scope.defaults.country;


	  /**
	   * Watcher on -order- container
	   */
    $scope.$watch('order', function ()
    {
	  	$scope.regions 	= $rootScope.config.regions[$scope.order.country];
	  	$scope.ranges 	= $rootScope.config.ranges[$scope.order.virtual];

	  	if ($scope.order.package)
	  	{
				var prices = {
					monthly: 	$rootScope.config.packages[$scope.order.package].prices.monthly,
					yearly: 	$rootScope.config.packages[$scope.order.package].prices.yearly
				};

				$scope.prices = {
					monthly: 	($scope.order.premium) ? prices.monthly.premium : prices.monthly.normal,
					yearly: 	($scope.order.premium) ? prices.yearly.premium : prices.yearly.normal
				}
	  	}

    }, true);





		/**
		 * Reset purchaser
		 */
		$scope.resetPurchaser = function ()
		{
			$scope.order = {
				package: 	null,
				country: 	$scope.defaults.country,
				region: 	null
			};
		};


		/**
		 * Set region
		 */
		$scope.setRegion = function ()
		{
			if ($scope.order.region)
				$scope.numbers = Generators.list();
		}


		/**
		 * Set virtual area code
		 */
		$scope.setVirtualArea = function ()
		{
			if ($scope.order.virtual)
				$scope.numbers = Generators.list();
		}


	  /**
	   * Set number type
	   */
	  $scope.setPackage = function (pack)
	  {  
		  $scope.order.package 	= Number(pack);

		  $scope.order.number 	= null;
	  };





	  /**
	   * Tabs arranger
	   */
	  $scope.tabs = {
	  	normals: 	true,
	  	premiums: false
	  };



	  /**
	   * View setter
	   */
	  function setView (hash)
	  {
	    $scope.views = {
	      purchaser: 	false,
	      manager: 		false,
	      notifier: 	false,
	      reporter:  	false,
	      guarder:  	false
	    };

	    $scope.views[hash] = true;
	  };


	  /**
	   * Switch between the views and set hash accordingly
	   */
	  $scope.setViewTo = function (hash)
	  {
	    $scope.$watch(hash, function ()
	    {
	      $location.hash(hash);

	      setView(hash);
	    });
	  };


	  /**
	   * If no params or hashes given in url
	   */
	  if (!$location.hash())
	  {
	    var view = 'purchaser';

	    $location.hash('purchaser');
	  }
	  else
	  {
	    var view = $location.hash();
	  }


	  /**
	   * Set view
	   */
	  setView(view);





	  /**
	   * Switch step
	   */
	  $scope.switchStep = function (step)
	  {
	    $scope.purchaser = {step: step};
	  };


	  /**
	   * Switch step in default value
	   */
	  $scope.switchStep(0);


	  /**
	   * Go further in steps
	   */
	  $scope.increaseStep = function ()
	  {
	  	if ($scope.purchaser.step < 5) $scope.switchStep($scope.purchaser.step + 1);
	  };


	  /**
	   * Go back in steps
	   */
	  $scope.decreaseStep = function ()
	  {
	  	if ($scope.purchaser.step > 1) $scope.switchStep($scope.purchaser.step - 1);
	  };





	}
]);;/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Profile', [])


/**
 * Profile controller
 */
.controller('profileCtrl', 
[
	'$rootScope', '$scope', '$q', '$location', '$window', '$route', 'data', 'Profile', 'Storage', 'Teams', 'Dater', 'MD5','$filter', 
	function ($rootScope, $scope, $q, $location, $window, $route, data, Profile, Storage, Teams, Dater, MD5,$filter) 
	{
	  /**
	   * Fix styles
	   */
	  $rootScope.fixStyles();

	  /**
	   * Pass the self
	   */
	  $scope.self = this;
		
	  /**
	   * Pass periods
	   */
	  $scope.periods = Dater.getPeriods();

	  /**
	   * apply the host to img url
	   */
	  $scope.imgHost = profile.host();
	  
	  /**
	   * Pass current
	   */
		$scope.current = {
	      day:    Date.today().getDayOfYear() + 1,
	      week:   new Date().getWeek(),
	      month:  new Date().getMonth() + 1
	    };
	
		/**
	     * Grab and set roles for view
	     */
	    $scope.roles = $rootScope.config.roles;
	    $scope.mfuncs = $rootScope.config.mfunctions;  
	     
	
	  /**
	   * Set data for view
	   */
	  if (data.slots) 
	  	data.user = data.slots.data;


	  /**
	   * PAss data container
	   */
	  $scope.data = data;
	  $scope.noImgURL = $rootScope.config.noImgURL;
	  
	  /**
	   * Pass profile information
	   */
	  $scope.profilemeta = data.resources;
	  // deal with date 
	  $scope.profilemeta.birthday = $filter('nicelyDate')(data.resources.birthDate);	  
	  
	  $scope.currentRole = $scope.profilemeta.role; 
	  /**
	   * Get teams of user
	   */
	  var teams = [];
	  var storage_teams = angular.fromJson(Storage.get("Teams"));
	  angular.forEach($scope.profilemeta.teamUuids,function(teamId,index){
	      angular.forEach(storage_teams,function(team,index){
	         if(team.uuid == teamId){
	             teams.add(team);
	         } 
	      });
	  });
	  
	  if(teams.length == 0){
		  angular.forEach(storage_teams,function(team,index){
	         if(team.uuid == sessionStorage.getItem(data.resources.uuid+"_team")){
	             teams.add(team);
	         } 
	      });
	  }
	  
	  $scope.teams = teams;
	  $scope.selectTeams = storage_teams;
	  
	  /**
	   * Default values for passwords
	   */
	  $scope.passwords = {
	    current: 	'',
	    new1: 		'',
	    new2: 		''
	  };


	  /**
	   * Default form views
	   */
	  $scope.forms = {
	    add:  false,
	    edit: false
	  };


	  /**
	   * Slot form toggler
	   */
	  $scope.toggleSlotForm = function ()
	  {
	    if ($scope.forms.add)
	    {
	      $scope.resetInlineForms();
	    }
	    else
	    {
	      $scope.slot = {};

	      $scope.slot = {
	        start: {
	          date: new Date().toString($rootScope.config.formats.date),
	          time: new Date().toString($rootScope.config.formats.time),
	          datetime: new Date().toISOString()
	        },
	        end: {
	          date: new Date().toString($rootScope.config.formats.date),
	          time: new Date().addHours(1).toString($rootScope.config.formats.time),
	          datetime: new Date().toISOString()
	        },
	        state:      '',
	        recursive:  false,
	        id:         ''
	      };

	      $scope.forms = {
	        add: 	true,
	        edit: false
	      };
	    }
	  };


	  /**
	   * Reset inline forms
	   */
	  $scope.resetInlineForms = function ()
	  {
	    $scope.slot = {};

	    $scope.original = {};

	    $scope.forms = {
	      add:  false,
	      edit: false
	    };
	  };


	  /**
	   * Extract view action from url and set view
	   */
	  setView($location.hash());


	  /**
	   * View setter
	   */
	  function setView (hash)
	  {
	    $scope.views = {
	      profile:  false,
	      edit:     false,
	      editImg:     false,
	      password: false,
	      timeline: false
	    };

	    $scope.views[hash] = true;

	    $scope.views.user = ($rootScope.app.resources.uuid == $route.current.params.userId) ? true : false;
	    
	    // load the avatar by ajax way
	    var memberId = $route.current.params.userId;
	    var imgURL = $scope.imgHost+"/teamup/team/member/"+memberId+"/photo";
        Teams.loadImg(imgURL).then(function(result){
            // console.log("loading pic " + imgURL);
            
            var imgId = memberId.replace(".","").replace("@","");
            if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
                console.log("loading pic " ,result);
                $('#img_'+imgId).css('background-image','url('+$scope.noImgURL+')');
            }else{
                $('#img_'+imgId).css('background-image','url('+imgURL+')');
            }
            
        },function(error){
            console.log("error when load pic " + error);
        });
	  };


	  /**
	   * Switch between the views and set hash ccordingly
	   */
	  $scope.setViewTo = function (hash)
	  {
	    $scope.$watch($location.hash(), function ()
	    {
	      $location.hash(hash);

	      setView(hash);
	    });
	  };


	  /**
	   * Save user
	   */
	  $scope.save = function (resources)
	  {
	    $rootScope.statusBar.display($rootScope.ui.profile.saveProfile);
	    
	    if(resources.teamUuids == null || typeof resources.teamUuids[0] == 'undefined'){
	        resources.teamUuids = [];
	        if($scope.teams.length == 0 ){
	            //resources.teamUuids.push($scope.selectTeams[0].uuid);
	            resources.teamUuids.push(sessionStorage.getItem(resources.uuid+"_team"));
	        }else{
	            resources.teamUuids.push($scope.teams[0].uuid);
	        }
	            
	    }
	    // deal with birthday 
	    try{
	    	resources.birthDate = Dater.convert.absolute(resources.birthday, 0);
		}catch(error){
			console.log(error);
			$rootScope.notifier.error($rootScope.ui.teamup.birthdayError);
			return;
		}
	    delete resources.birthday;
	    
	    Profile.save($route.current.params.userId, resources)
	    .then(function (result)
	    {
	      if (result.error)
	      {
	        $rootScope.notifier.error('Error with saving profile information.');
	        console.warn('error ->', result);
	      }
	      else
	      {
	        $rootScope.statusBar.display($rootScope.ui.profile.refreshing);

	        var flag = ($route.current.params.userId == $rootScope.app.resources.uuid) ? true : false;

	        Profile.get($route.current.params.userId, flag)
	        .then(function (data)
	        {
	          if (data.error)
	          {
	            $rootScope.notifier.error('Error with getting profile data.');
	            console.warn('error ->', data);
	          }
	          else
	          {
	            $rootScope.notifier.success($rootScope.ui.profile.dataChanged);

	            $scope.data = data;

	            $rootScope.statusBar.off();
	            
	            $scope.setViewTo("profile");
	            
	            // refresh the teams in the background
	            angular.forEach(resources.teamUuids, function(teamId){
	            	var routePara = {uuid : teamId};
	            	$rootScope.statusBar.display($rootScope.ui.profile.refreshTeam);
		            Teams.query(false,routePara).then(function(){
		            	$rootScope.statusBar.off();
		            }); 
	            });
	            
	          };
	        });
	      };
	    });
	  };


	  /**
	   * Change passwords
	   */
	  $scope.change = function (passwords)
	  {
	    if (passwords.new1 == '' || passwords.new2 == '')
	    {
	      $rootScope.notifier.error($rootScope.ui.profile.pleaseFill, true);

	      return false;
	    };

	    if (passwords.new1 != passwords.new2)
	    {
	      $rootScope.notifier.error($rootScope.ui.profile.passNotMatch, true);

	      return false;
	    }
	    else if ($rootScope.app.resources.askPass == MD5(passwords.current))
	    {
	      $rootScope.statusBar.display($rootScope.ui.profile.changingPass);

	      Profile.changePassword(passwords)
	      .then(function (result)
	      {
	        if (result.error)
	        {
	          $rootScope.notifier.error('Error with changing password.');
	          console.warn('error ->', result);
	        }
	        else
	        {
	          $rootScope.statusBar.display($rootScope.ui.profile.refreshing);

	          Profile.get($rootScope.app.resources.uuid, true)
	          .then(function (data)
	          {
	            if (data.error)
	            {
	              $rootScope.notifier.error('Error with getting profile data.');
	              console.warn('error ->', data);
	            }
	            else
	            {
	              $rootScope.notifier.success($rootScope.ui.profile.passChanged);

	              $scope.data = data;

	              $rootScope.statusBar.off();
	            };
	          });
	        };
	      });
	    }
	    else
	    {
	      $rootScope.notifier.error($rootScope.ui.profile.passwrong, true);
	    };
	  };
	  

	  /**
	   * Render timeline if hash is timeline
	   */
	  // if ($location.hash() == 'timeline')
//	  if ($rootScope.app.resources.uuid != $route.current.params.userId)
//	  {
//	  	timelinebooter();
//	  };



	  /**
	   * Redraw timeline
	   */
	  $scope.redraw = function ()
	  {
	  	setTimeout(function ()
	  	{
	  		// timelinebooter();
	  	}, 100);
		};


	  function timelinebooter ()
	  {
      $scope.timeline = {
      	id: 'userTimeline',
      	main: false,
      	user: {
      		id: $route.current.params.userId
      	},
        current: $scope.current,
        options: {
          start:  new Date($scope.periods.weeks[$scope.current.week].first.day),
          end:    new Date($scope.periods.weeks[$scope.current.week].last.day),
          min:    new Date($scope.periods.weeks[$scope.current.week].first.day),
          max:    new Date($scope.periods.weeks[$scope.current.week].last.day)
        },
        range: {
          start: 	$scope.periods.weeks[$scope.current.week].first.day,
          end: 		$scope.periods.weeks[$scope.current.week].last.day
        },
        config: {
          legenda:    {},
          legendarer: $rootScope.config.timeline.config.legendarer,
          states:     $rootScope.config.timeline.config.states
        }
      };

      var states = {};

      angular.forEach($scope.timeline.config.states, function (state, key) { states[key] = state.label });

      $scope.states = states;

      angular.forEach($rootScope.config.timeline.config.states, function (state, index)
      {
        $scope.timeline.config.legenda[index] = true;
      });


	  /**
	   * Prepeare timeline range for dateranger widget
	   */
	  $scope.daterange =  Dater.readable.date($scope.timeline.range.start) + ' / ' + 
	                      Dater.readable.date($scope.timeline.range.end);

	                      

      $('#timeline').html('');
      $('#timeline').append('<div id="userTimeline"></div>');
	  };

	  /**
	   * show edit member profile TabView  
	   */
	  
	  $scope.editProfile = function(){
	      setView('edit');
	  }
	  
	  /**
	   * load the dynamic upload URL for GAE 
	   */
	  $scope.editImg = function(){
	      $rootScope.statusBar.display($rootScope.ui.profile.loadUploadURL);
	      Profile.loadUploadURL($route.current.params.userId)
	        .then(function (result)
	        {
	          if (result.error){
	            $rootScope.notifier.error('Error with loading upload URL.');
	            console.warn('error ->', result);
	          }else{
	              
	            $rootScope.statusBar.off();
	            $scope.uploadURL = result.url;
	            
	            $scope.setViewTo('editImg');
	          };
	      });
	      
	      
	  }
	  
	  /**
	   * delete the team member 
	   */
	  $scope.deleteProfile = function(){
		  if(window.confirm($rootScope.ui.teamup.deleteConfirm)){
			$rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);
			
			Teams.deleteMember($scope.profilemeta.uuid).then(function(result){
				if(result.uuid){
					$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
	                
	                // refresh the teams that contains  this user
	                
    				angular.forEach($scope.profilemeta.teamUuids,function(teamId,i){
    					$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
    					
    					var routePara = {'uuid' : teamId};
    					Teams.query(false,routePara).then(function(queryRs) {
    						$rootScope.statusBar.off();
    					});
    					
    			   });
	        			
	             // try to get the members not in the teams Aync 
                    Teams.queryMembersNotInTeams().then(function(result){
                    	console.log("members not in any teams loaded ");
                    	$rootScope.statusBar.off();
                    },function(error){
                    	console.log(error);
                    });
	                
				}
								
			},function(error){
				console.log(error);
			});
		}
	  }
	  
	  
	}
]);;/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Controllers.Teams', [])

/**
 * Groups controller
 */
 .controller('teamCtrl', ['$rootScope', '$scope', '$location', 'Teams', 'data', '$route', '$routeParams', 'Storage', 'MD5', 'Dater',
function($rootScope, $scope, $location, Teams, data, $route, $routeParams, Storage, MD5, Dater) {
	/**
	 * Fix styles
	 */
	$rootScope.fixStyles();

	$scope.members = data.members;
	$scope.teams = data.teams;

	/**
	 * Self this
	 */
	var self = this, params = $location.search();

	$scope.imgHost = profile.host();

	/**
	 * Init search query
	 */
	$scope.search = {
		query : ''
	};

	/**
	 * Reset selection
	 */
	$scope.selection = {};

	/**
	 * Set groups
	 */
	$scope.data = data;

	/**
	 * Grab and set roles for view
	 */
	$scope.roles = $rootScope.config.roles;
	$scope.mfuncs = $rootScope.config.mfunctions;	
	var uuid, view;

	/**
	 * If no params or hashes given in url
	 */
	if(!params.uuid && !$location.hash()) {
		uuid = data.teams[0].uuid;
		view = 'team';

		$location.search({
			uuid : data.teams[0].uuid
		}).hash('team');
	} else {
		uuid = params.uuid;
		view = $location.hash();
	}

	/**
	 * Set group
	 */
	setTeamView(uuid);

	/**
	 * Set Team View
	 */
	$scope.views = {
		team : true,
		newTeam : false,
		newMember : false,
		editTeam : false,
	};

	/**
	 * Set given team for view
	 */
	function setTeamView(id) {

		angular.forEach(data.teams, function(team, index) {
			if(team.uuid == id)
				$scope.team = team;
		});

		$scope.members = data.members[id];

		$scope.current = id;
		
		// load image 
		angular.forEach($scope.members, function(member, index) {
			var imgURL = $scope.imgHost+"/teamup/team/member/"+member.uuid+"/photo";
			Teams.loadImg(imgURL).then(function(result){
				// console.log("loading pic " + imgURL);
				
				var imgId = member.uuid.replace(".","").replace("@","");
				if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
					console.log("no pics " ,result);
				}else{
					$('.tab-content #img_'+imgId).css('background-image','url('+imgURL+')');
				}
				
			},function(error){
				console.log("error when load pic " + error);
			});
		});
		
		$scope.team.phone = $rootScope.ui.teamup.loadingNumber;
		Teams.loadTeamCallinNumber($scope.team.uuid).then(function(result){
			$scope.team.phone = result.phone;
		});
		
	}

	/**
	 * Request for a team
	 */
	$scope.requestTeam = function(current, switched) {
		setTeamView(current);

		$scope.$watch($location.search(), function() {
			$location.search({
				uuid : current
			});
		});
		if(switched) {
			if($location.hash() != 'team')
				$location.hash('team');

			setView('team');
		}
	};
	/**
	 * View setter
	 */
	var setView = function(hash) {
		$scope.views = {
			team : false,
			newTeam : false,
			newMember : false,
			editTeam : false
		};

		$scope.views[hash] = true;
	};
	/**
	 * Switch between the views and set hash accordingly
	 */
	$scope.setViewTo = function(hash) {
		$scope.$watch(hash, function() {
			$location.hash(hash);

			setView(hash);
		});
	};
	/**
	 * Set view
	 */
	setView(view);

	/**
	 * Selection toggler
	 */
	$scope.toggleSelection = function(group, master) {
		var flag = (master) ? true : false, members = angular.fromJson(Storage.get(group.uuid));

		angular.forEach(members, function(member, index) {
			$scope.selection[member.uuid] = flag;
		});
	};
	/**
	 * show edit mode of the Team
	 */
	$scope.editTeam = function(team) {
		$scope.teamEditForm = {
			name : team.name,
			uuid : team.uuid
		};
		$scope.views.editTeam = true;
	};

	$scope.cancelTeamEdit = function(team) {
		$scope.teamEditForm = {
			name : team.name,
			uuid : team.uuid
		};
		$scope.views.editTeam = false;
	};
	/**
	 * save the changes on the team
	 */
	$scope.changeTeam = function(team) {

		if($.trim(team.name) == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

		Teams.edit(team).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error("Error with saving team info : " + result.error);
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
				
				Teams.query(false,result).then(function(result) {
					$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
					$rootScope.statusBar.off();

					$scope.team.name = team.name;
					$scope.views.editTeam = false;
				});
			}
		});
	};
	/**
	 * create new Team
	 */
	$scope.teamSubmit = function(team) {

		if( typeof team == 'undefined' || $.trim(team.name) == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

		Teams.save(team).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError);
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

				Teams.query(false,result).then(function(queryRs) {
					if(queryRs.error) {
						$rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
						console.warn('error ->', queryRs);
					} else {
						$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
						$scope.closeTabs();

						$scope.data = queryRs;

						angular.forEach(queryRs.teams, function(t_obj) {
							if(t_obj.uuid == result.uuid) {
								$scope.teams = queryRs.teams;

								angular.forEach(queryRs.teams, function(t) {
									if(t.uuid == t_obj.uuid) {
										$scope.team = t;
									}
								});

								$scope.members = data.members[t_obj.uuid];

								$scope.current = t_obj.uuid;

								$scope.$watch($location.search(), function() {
									$location.search({
										uuid : t_obj.uuid
									});
								});
							}
						});
					}

					$rootScope.statusBar.off();

				});
			}
		});
	};
	/**
	 * create a new team member
	 */
	$scope.memberSubmit = function(member) {
		if( typeof member == 'undefined' || !member.username || !member.password || !member.reTypePassword) {
			$rootScope.notifier.error($rootScope.ui.teamup.accountInfoFill);
			return;
		}
		if(member.password != member.reTypePassword) {
			$rootScope.notifier.error($rootScope.ui.teamup.passNotSame);
			return;
		}
		if(!member.team) {
			$rootScope.notifier.error($rootScope.ui.teamup.selectTeam);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

		var obj = {
			uuid : member.username,
			userName : member.username,
			passwordHash : MD5(member.password),
			firstName : member.firstName,
			lastName : member.lastName,
			phone : member.phone,
			teamUuids : [member.team],
			role : member.role,
			birthDate : Dater.convert.absolute(member.birthDate, 0)
		};

		
		Teams.saveMember(obj).then(function(result) {
			// change the REST return to json.

			if(result.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError + " : " + result.error);
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
				
				var routePara = {'uuid' : result.teamId};
				
				Teams.query(false,routePara).then(function(queryRs) {
					if(queryRs.error) {
						$rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
						console.warn('error ->', queryRs);
					} else {
						$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
						$scope.closeTabs();

						$scope.data = queryRs;

						angular.forEach(queryRs.teams, function(t_obj) {
							if(t_obj.uuid == routePara.uuid) {
								$scope.teams = queryRs.teams;

								angular.forEach(queryRs.teams, function(t) {
									if(t.uuid == t_obj.uuid) {
										$scope.team = t;
									}
								});

								$scope.members = data.members[t_obj.uuid];

								$scope.current = t_obj.uuid;

								$scope.$watch($location.search(), function() {
									$location.search({
										uuid : t_obj.uuid
									});
								});
							}
						});
					}

					$rootScope.statusBar.off();

				});
			}
		});
	};
	
	/**
	 * Close inline form
	 */
	$scope.closeTabs = function() {
		$scope.teamForm = {};

		$scope.memberForm = {};

		$scope.setViewTo('team');
	};
	
	/**
	 * edit the profile function 
	 * only for set the team Id in sessionStorage , for later saving
	 */
	$scope.editProfile = function(memberId, teamId){
		sessionStorage.setItem(memberId+"_team", teamId);
	}
	
	/**
	 * show the String "no shared states" if there is no shared states 
	 */
	$scope.noSharedStates = function(states){
		var flag = true;
		var ret = true;
		angular.forEach(states, function(state){
			if(state.share && flag){
				ret = false;
				flag = false;
			}
		});
		return ret;
	}
	
	/*
	 * delete the team 
	 */
	$scope.deleteTeam = function(){
		console.log($scope.current);
		if(window.confirm($rootScope.ui.teamup.delTeamConfirm)){
			$rootScope.statusBar.display($rootScope.ui.teamup.deletingTeam);
			
			Teams.deleteTeam($scope.current).then(function(result){
				
				if(result){
					Teams.query(true,{}).then(function(teams){
						$scope.requestTeam(teams[0].uuid);
						
						// locally refresh
						angular.forEach($scope.teams,function(team,i){
							if(team.uuid == result){
								$scope.teams.splice(i,1);
							}
						});
						
						// 	try to get the members not in the teams Aync 
	                    Teams.queryMembersNotInTeams().then(function(result){
	                    	console.log("members not in any teams loaded ");
	                    	$rootScope.statusBar.off();
	                    },function(error){
	                    	console.log(error);
	                    });
					},function(error){
						console.log(error);
					});
					
				}
				
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
                
			},function(error){
				console.log(error);
			});
		}
	}
	
	/**
	 * delete the team member
	 */
	$scope.deleteMember = function(memberId){
		
		if(window.confirm($rootScope.ui.teamup.deleteConfirm)){
			$rootScope.statusBar.display($rootScope.ui.teamup.deletingMember);
			Teams.deleteMember(memberId).then(function(result){
				if(result.uuid){
					$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
	                
	                // refresh the teams that contains  this user
	                angular.forEach($scope.members,function(mem,i){
	        			if(mem.uuid == memberId){
	        				angular.forEach(mem.teamUuids,function(teamId,i){
	        					$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
	        					
	        					var routePara = {'uuid' : teamId};
	        					Teams.query(false,routePara).then(function(queryRs) {
	        						$rootScope.statusBar.off();
	        					});
	        					
	        					angular.forEach(data.members[teamId],function(mem,j){
		        					if(mem.uuid == memberId){
		        						data.members[teamId].splice(j,1);
		        					}
		        				});
	        					
	        				});
	        				
	        			}
	        		});
	             // 	try to get the members not in the teams Aync 
                    Teams.queryMembersNotInTeams().then(function(result){
                    	console.log("members not in any teams loaded ");
                    	$rootScope.statusBar.off();
                    },function(error){
                    	console.log(error);
                    });
	                
				}
								
			},function(error){
				console.log(error);
			});
		}
	}
	
	
	// brefoe I know there is a good place to put this code 
    // load the login user's avatar
	
	var imgURL = profile.host() + "/teamup/team/member/" + $rootScope.app.resources.uuid + "/photo";
	Teams.loadImg(imgURL).then(function(result) {
		// console.log("loading pic " + imgURL);
		var mId = $rootScope.app.resources.uuid;
		var imgId = mId.replace(".", "").replace("@", "");
		if (result.status && (result.status == 404 || result.status == 403 || result.status == 500)) {
			console.log("no pics ", result);
		} else {
			$('.navbar-inner #img_'+imgId).css('background-image', 'url(' + imgURL + ')');
		}

	}, function(error) {
		console.log("error when load pic " + error);
	}); 
	
}]);
;/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Controllers.Clients', [])

/**
 * Groups controller
 */.controller('clientCtrl', ['$rootScope', '$scope', '$location', 'Clients', 'data', '$route', '$routeParams', 'Storage','Dater','$filter','$modal','Teams',
function($rootScope, $scope, $location, Clients, data, $route, $routeParams, Storage,Dater,$filter,$modal, Teams) {
	/**
	 * Fix styles
	 */
	$rootScope.fixStyles();

	if(data.clientId) {
		data.clientGroups = angular.fromJson(Storage.get("ClientGroups"));
		data.clients = {};
		angular.forEach(data.clientGroups, function(cGroup, index) {
			var clients = angular.fromJson(Storage.get(cGroup.id));

			var key = cGroup.id;
			data.clients[cGroup.id] = clients;

			angular.forEach(clients, function(client, index) {
				if(client.uuid == data.clientId) {
					$scope.client = client;
					$scope.contacts = client.contacts;
					
					// deal with the date thing for editing
					client.birthDate = $filter('nicelyDate')(client.birthDate)
					$scope.clientmeta = client;
				}
			});
		});
	}

	$scope.clients = data.clients;
	$scope.clientGroups = data.clientGroups;
	
	// process month dropdown list
	var Months = Dater.getMonthTimeStamps();
	$scope.Months = [];
	angular.forEach(Months,function(mon,i){
		var newMon = {number : i,
				name : i,
				start : mon.first.timeStamp,
				end : 	mon.last.timeStamp};
		$scope.Months[i] = newMon;
	});
	
	$scope.Months[0] = {number: 0 , name : $rootScope.ui.teamup.selectMonth};
	
	/**
	 * Self this
	 */
	var self = this, params = $location.search();

	$scope.imgHost = profile.host();
	/**
	 * Init search query
	 */
	$scope.search = {
		query : ''
	};

	/**
	 * Reset selection
	 */
	$scope.selection = {};

	/**
	 * Set groups
	 */
	$scope.data = data;

	var uuid, view;

	/**
	 * If no params or hashes given in url
	 */
	if(!params.uuid && !$location.hash()) {
		uuid = data.clientGroups[0].id;
		view = 'client';

		$location.search({
			uuid : data.clientGroups[0].id
		}).hash('client');
	} else {
		uuid = params.uuid;
		if( typeof uuid == 'undefined') {
			uuid = $scope.client.clientGroupUuid;
		}
		view = $location.hash();
	}

	/**
	 * Set Team View
	 */
	$scope.views = {
		client : true,
		newClientGroup : false,
		newClient : false,
		reports : false,
		editClientGroup : false,
		editClient : false,
		viewClient : false,
		editImg : false,
	}
	
	/**
	 * View setter
	 */
	var setView = function(hash) {
		$scope.views = {
			client : false,
			newClientGroup : false,
			newClient : false,
			reports : false,
			editImg:  false,
		};

		//load the reports on this view 
        if(hash == "viewClient"){
            loadReports();
        }
		
        if(hash == "reports"){
        	loadGroupReports();
        }
        
		$scope.views[hash] = true;
        
	}
	
	/**
	 * load the reports by the client ID
	 */
    var loadReports = function(){
        $rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);
        Clients.queryReports($scope.client.uuid).then(function(reports){
            $rootScope.statusBar.off();
            $scope.reports = $scope.processReports(reports);
            
        },function(error){
           console.log(error); 
        });
    }
    
    /**
	 *  load the reports by the client group ID
	 */
    var loadGroupReports = function(){
    	$rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);
    	
    	Clients.queryGroupReports($scope.clientGroup.id).then(function(reports){
            $rootScope.statusBar.off();
            $scope.groupReports = $scope.processReports(reports);
            
            if($scope.currentCLient != 0){
            	$scope.requestReportsByFilter();
            }
            
            $scope.$watch($scope.groupReports,function(rs){
            	console.log("watcher found ... " , rs);
            	$scope.loadMembersImg();
            });
        },function(error){
           console.log(error); 
        });
    	
    }
	
	/**
	 * Set view
	 */
	setView(view);
	
	/**
	 * Set group
	 */
	setClientView(uuid);
	
	/**
	 * Set given team for view
	 */
	function setClientView(id) {
		
		angular.forEach(data.clientGroups, function(cGroup, index) {
			if(cGroup.id == id)
				$scope.clientGroup = cGroup;
		});

		$scope.clients = data.clients[id];

		$scope.current = id;
		
		// show reports of this groups 
		if($scope.views.reports){
			//reset the filter 
			$scope.currentCLient = '0';
			$scope.currentMonth = '0';
			
			loadGroupReports();
		}

		// load image 
		if($scope.views.client){
			angular.forEach($scope.clients, function(client, index) {
	            var imgURL = $scope.imgHost+"teamup/client/"+client.uuid+"/photo";
	            Clients.loadImg(imgURL).then(function(result){
	                // console.log("loading pic " + imgURL);
	                
	                var imgId = client.uuid.replace(".","").replace("@","");
	                if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
	                    console.log("loading pic " ,result);
	                }else{
	                    $('#img_'+imgId).css('background-image','url('+imgURL+')');
	                }
	                
	            },function(error){
	                console.log("error when load pic " + error);
	            });
	        });
		}
        
		// load the image in the client profile page 
		if($scope.views.viewClient){
			var imgURL = $scope.imgHost+"teamup/client/"+$scope.client.uuid+"/photo";
			Clients.loadImg(imgURL).then(function(result){
                // console.log("loading pic " + imgURL);
                
                var imgId = $scope.client.uuid.replace(".","").replace("@","");
                if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
                    console.log("loading pic " ,result);
                }else{
                    $('#viewClientTab #img_'+imgId).css('background-image','url('+imgURL+')');
                }
                
            },function(error){
                console.log("error when load pic " + error);
            });
		}
        
	}

	/**
	 * Request for a client group
	 */
	$scope.requestClientGroup = function(current, switched) {
		
		setClientView(current);

		$scope.$watch($location.search(), function() {
			$location.search({
				uuid : current
			});
		});
		if(switched) {
			if($location.hash() != 'client')
				$location.hash('client');

			setView('client');
		}
	};
	
	$scope.processReports = function(reports){
		var rpts = [];
		angular.forEach(reports,function(report,i){
			var newReport = {uuid : report.uuid, 
				title : report.title,
				creationTime : report.creationTime,
				clientUuid : report.clientUuid,
				body : report.body,
				author: $scope.$root.getTeamMemberById(report.authorUuid),
				client: $scope.$root.getClientByID(report.clientUuid),
				filtered: "false"};
			
			rpts.add(newReport);
		});
		return rpts;
	}
		
    
   $scope.loadMembersImg = function(){
	// load the team members image
		
		var memberIds = [];
		angular.forEach($scope.groupReports, function(rept,i){
			if(memberIds.indexOf(rept.author.uuid) == -1){
				memberIds.add(rept.author.uuid);
			}
		});
		angular.forEach(memberIds , function(memberId,j){
			var imgURL = $scope.imgHost+"/teamup/team/member/"+memberId+"/photo";
			Teams.loadImg(imgURL).then(function(result){
				// console.log("loading pic " + imgURL);
				
				var imgId = memberId.replace(".","").replace("@","");
				if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
					console.log("no pics " ,result);
				}else{
					$('.tab-content #img_'+imgId).css('background-image','url('+imgURL+')');
				}
				
			},function(error){
				console.log("error when load pic " + error);
			});
		});
   }
    
	
    
	

	/**
	 * Switch between the views and set hash accordingly
	 */
	$scope.setViewTo = function(hash) {
		$scope.$watch(hash, function() {
			if(!$scope.clientGroup){
				$scope.clientGroup = $scope.clientGroups[0]
			}
			if(($location.hash() == "viewClient" || $location.hash() == "editClient" || $location.hash() == "editImg") && hash == "client"){
				$location.path("/client").search({uuid : $scope.clientGroup.id});
			}
		
			$location.hash(hash);
		
			setView(hash);
			
			
		});
	};
	
	
	/**
	 * Selection toggler
	 */
	//        $scope.toggleSelection = function (group, master)
	//        {
	//            var flag = (master) ? true : false,
	//                    members = angular.fromJson(Storage.get(group.uuid));
	//
	//            angular.forEach(members, function (member, index)
	//            {
	//                $scope.selection[member.uuid] = flag;
	//            });
	//        };

	/**
	 * show edit mode of the Team
	 */
	$scope.editClientGroup = function(clientGroup) {
		$scope.cGroupEditForm = {
			name : clientGroup.name,
			id : clientGroup.id
		};
		$scope.views.editClientGroup = true;
	}

	$scope.cancelClientGroupEdit = function(clientGroup) {
		$scope.cGroupEditForm = {
			name : clientGroup.name,
			id : clientGroup.id
		};
		$scope.views.editClientGroup = false;
	}
	/**
	 * save the changes on the team
	 */
	$scope.changeClientGroup = function(cGroup) {

		if($.trim(cGroup.name) == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.cGroupNamePrompt1);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.saveClientGroup);

		Clients.edit(cGroup).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error("Error with saving client Group info");
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

				Clients.query(false).then(function(result) {
					$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
					$rootScope.statusBar.off();

					$scope.clientGroup.name = cGroup.name;
					$scope.views.editClientGroup = false;
				});
			}
		});
	}
	
	var reloadGroup = function(result) {
		Clients.query(false,result).then(function(queryRs) {
			if(queryRs.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.queryCGroupError);
				console.warn('error ->', queryRs);
			} else {
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
				$scope.closeTabs();

				$scope.data = queryRs;
				
				$scope.clientGroups = queryRs.clientGroups;
				$scope.clients = queryRs.clients;
				
				angular.forEach(queryRs.clientGroups, function(cg_obj) {
					if(cg_obj.id == result.uuid) {
						
					    $scope.clientGroup = cg_obj;

						$scope.current = cg_obj.id;

						$scope.$watch($location.search(), function() {
							$location.search({
								id : cg_obj.id
							});
						});
					}
				});
			}

			$rootScope.statusBar.off();

		});
	}
	/**
	 * create new client group
	 */
	$scope.cGroupSubmit = function(cGroup) {

		if( typeof cGroup == 'undefined' || $.trim(cGroup.name) == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.saveClientGroup);

		Clients.saveGroup(cGroup).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.cGroupSubmitError);
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
				var routePara = {'uuid' : result.id};
				reloadGroup(routePara);
			}
		});
	}
	/**
	 * Close inline form
	 */
	$scope.closeTabs = function() {
		$scope.clientGroupForm = {};

		$scope.clientForm = {};

		setView('client');
	};
	/**
	 *  add contact to client locally.
	 */
	$scope.addContacts = function() {
		if( typeof $scope.contactForm == 'undefined' || $scope.contactForm.func == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt2);
			return;
		}

		var contactPerson = {
			firstName : '',
			lastName : '',
			function : '',
			phone : ''
		};
		contactPerson.firstName = $scope.contactForm.firstName;
		contactPerson.lastName = $scope.contactForm.lastName;
		contactPerson.function = $scope.contactForm.function;
		contactPerson.phone = $scope.contactForm.phone;

		if( typeof $scope.contacts == 'undefined') {
			$scope.contacts = [];
		}

		if($scope.contacts == null){
			$scope.contacts = [];
		}
		$scope.contacts.push(contactPerson);
		
	}
	/**
	 * add new client
	 */
	$scope.clientSubmit = function(client) {
		if( typeof client == 'undefined' || !client.firstName || !client.lastName || !client.phone) {
			$rootScope.notifier.error($rootScope.ui.teamup.clinetInfoFill);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.savingClient);

		// might need to convert the client to client obj
		try{
			client.birthDate = Dater.convert.absolute(client.birthDate, 0);
		}catch(error){
			console.log(error);
			$rootScope.notifier.error($rootScope.ui.teamup.birthdayError);
			return;
		}
		
		client.clientGroupUuid = $scope.clientGroup.id; 
		
		Clients.save(client).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
			} else {
				var routePara = {'uuid' : result.clientGroupUuid};
				reloadGroup(routePara);
			}
		});
	}
	
	/**
	 * edit client profile 
	 */
	$scope.clientChange = function(client){
	    $rootScope.statusBar.display($rootScope.ui.teamup.savingClient);
	    
		try{
			client.birthDate = Dater.convert.absolute(client.birthDate, 0);
		}catch(error){
			console.log(error);
			$rootScope.notifier.error($rootScope.ui.teamup.birthdayError);
			return;
		}
		
		Clients.updateClient(client).then(function(result){
			if(result.error){
				$rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
			}else{
			    $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
			    
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
				var routePara = {'uuid' : result.clientGroupUuid}; 
				reloadGroup(routePara);
			}
		});
	}
	
	/**
	 * save the contacts for the client
	 */
	$scope.saveContacts = function(contacts){
		console.log("client id " , $scope.client.uuid ); 
		console.log("contacts " , contacts);
        
		var client = $scope.client;
		
		try{
            client.birthDate = Dater.convert.absolute(client.birthDate, 0);
        }catch(error){
            console.log(error);
            $rootScope.notifier.error($rootScope.ui.teamup.birthdayError);
            return;
        }
		
		client.contacts = contacts;
		
		$rootScope.statusBar.display($rootScope.ui.teamup.savingContacts);
		
        Clients.updateClient(client).then(function(result){
            if(result.error){
                $rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
            }else{
                
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
//                
                var routePara = {'uuid' : result.clientGroupUuid};
                Clients.query(false,routePara).then(function(queryRs) {});
                
            }
            $scope.client.birthDate = $filter('nicelyDate')($scope.client.birthDate);
        });
	}
	
	/**
	 * remove this line of contact info
	 */
	$scope.removeContact = function(contact){
		angular.forEach($scope.contacts,function(ctc,i){
			if(contact.name == ctc.name && contact.func == ctc.func && contact.phone == ctc.phone){
				$scope.contacts.splice(i,1);
			}
		});
	}
	
	/**
	 * delete the client group  
	 */
	$scope.deleteClientGroup = function(){
		if(window.confirm($rootScope.ui.teamup.delClientGroupConfirm)){
			
			$rootScope.statusBar.display($rootScope.ui.teamup.deletingClientGroup);
			
			Clients.deleteClientGroup($scope.current).then(function(result){
				if(result.id){
					Clients.query(true,{}).then(function(clientGroups){
						$scope.requestClientGroup(clientGroups[0].id);
						
						angular.forEach($scope.clientGroups,function(cg,i){
							if(cg.id == result.id){
								$scope.clientGroups.splice(i,1); 
							}
						});
					},function(error){
						console.log(error);
					});
					
				}
				
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
			},function(error){
				console.log(error);
			});
		}
	}
	
	/**
	 *  delete the client 
	 */
	$scope.deleteClient = function(clientId){
		if(window.confirm($rootScope.ui.teamup.deleteConfirm)){
			$rootScope.statusBar.display($rootScope.ui.teamup.deletingClient);
			
			// client lost the client group ID, remove this client from the group first
			angular.forEach($scope.clients, function(clt,i){
				if(clt.uuid == clientId){
					var clientGroupId = clt.clientGroupUuid; 
					if(clientGroupId == null || clientGroupId == ""){
						clientGroupId = $scope.clientGroup.id;
					}
					
					var changes = {};
					var clientIds = [];
					var emptyAddIds = []; 
					clientIds.add(clientId);
					changes[clientGroupId] = {a : emptyAddIds, r : clientIds};
					if(clientGroupId != null && clientGroupId != "" && clientGroupId != $scope.clientGroup.id){
						changes[$scope.clientGroup.id] = {a : emptyAddIds, r : clientIds};
					}
					Clients.manage(changes).then(function(result){
						// delete the client 
						Clients.deleteClient(clientId).then(function(){
							Clients.queryAll().then(function(){
								if($scope.views.viewClient == true){
									$scope.setViewTo("client");
								}else{
									$route.reload();
								}
							});
						},function(error){
							console.log(error);
						});
					});
					
				}
			});

		}
	}
	
	$scope.requestReportsByFilter = function(){
		
		angular.forEach($scope.groupReports,function(report,i){
			// filter need to be checked 
			// client Id, month
			if(report.clientUuid != $scope.currentCLient && $scope.currentCLient != "0"){
				report.filtered = "true";
			}else{
				report.filtered = "false";
			}
			
			var reportMonth = new Date(report.creationTime).getMonth() + 1; 
			
			if( ( reportMonth != $scope.currentMonth && $scope.currentMonth != "0") 
					|| report.filtered == "true"){
				report.filtered = "true";
			}else{
				report.filtered = "false";
			}
			
		});
		
		$scope.loadMembersImg();
	}
	
	
	var ModalInstanceCtrl = function($scope, $modalInstance, report) {
		
		$scope.report = report;
		
		$scope.view = {
			editReport : (report.editMode)? true : false,
			viewReport : (report.editMode || typeof report.uuid == 'undefined')? false : true,
			newReport : (typeof report.uuid == 'undefined')? true : false ,
		};
		
		$scope.close = function() {
			$modalInstance.dismiss();
		};
	
		$scope.saveReport = function(report) {
			console.log("save report");
			console.log(Clients);
			var paraObj = {uuid : report.uuid,
					title : report.title,
					body : report.body,
					creationTime : report.creationTime/1000
					};
			
			Clients.saveReport(report.clientUuid,paraObj).then(function(result){								
				$modalInstance.close(report);
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
			});
		};
	};
	
	$scope.openReport = function(report) {
		$scope.report = report;
		$scope.report.editMode = false;
		
		var modalInstance = $modal.open({
			templateUrl : './js/views/reportTemplate.html',
			controller : ModalInstanceCtrl,
			resolve : {
				report : function() {
					return $scope.report;
				}
			}
		});

	};
	
	$scope.newReport = function(){
		if($scope.currentCLient == 0){
			$rootScope.notifier.error($rootScope.ui.teamup.selectClient);
			return;
		}
		
		var newReport = { 
				title : $rootScope.ui.teamupnewReport,
				creationTime : new Date().getTime(),
				clientUuid : $scope.currentCLient,
				body : null,
				author: $scope.$root.getTeamMemberById($rootScope.app.resources.uuid),
				client: $scope.$root.getClientByID($scope.currentCLient),
				editMode: false};
		
		$scope.report = newReport;
		
		var modalInstance = $modal.open({
			templateUrl : './js/views/reportTemplate.html',
			controller : ModalInstanceCtrl,
			resolve : {
				report : function() {
					return $scope.report;
				},
				editMode : false
			}
		});
		
		modalInstance.result.then(function(report) {
			console.log('Modal close at: ' + new Date());
			loadGroupReports();
		}, function() {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.editReport = function(report){
		$scope.report = report;
		$scope.report.editMode = true;
		var modalInstance = $modal.open({
			templateUrl : './js/views/reportTemplate.html',
			controller : ModalInstanceCtrl,
			resolve : {
				report : function() {
					return $scope.report;
				}
			}
		});
	}
	
	$scope.removeReport = function(report){
		if(window.confirm($rootScope.ui.teamup.deleteConfirm)){
			$rootScope.statusBar.display($rootScope.ui.teamup.loading);
			Clients.removeReport(report.clientUuid,report.uuid).then(function(rs){
				console.log(rs);
				if(rs.result == "ok"){
					$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
					loadGroupReports();
				}else{
					$rootScope.notifier.error(rs.error);
				}
			},function(error){
				console.log(error);
			});
		}
	}
		
	/**
	 * load the dynamic upload URL for GAE
	 */
	$scope.editImg = function() {
		$rootScope.statusBar.display($rootScope.ui.profile.loadUploadURL);
		
		Clients.loadUploadURL($scope.client.uuid).then(function(result) {
			if (result.error) {
				$rootScope.notifier.error('Error with loading upload URL.');
				console.warn('error ->', result);
			} else {
	
				$rootScope.statusBar.off();
				$scope.uploadURL = result.url;
	
				$scope.setViewTo('editImg');
			};
		});
	
	}

	  
	
}]);
;/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Manage', [])

/**
 * Groups controller
 */
.controller('manageCtrl',[
    '$rootScope', '$scope', '$location', 'Clients', '$route', '$routeParams', 'Storage', 'Teams', '$window','data',
    function ($rootScope, $scope, $location, Clients, $route, $routeParams, Storage , Teams, $window,data){


      $scope.loadData = function(data){
          
          if(data && data.local){
              /*
               * data from local storage
               */

              /**
               * teams , team-member , team-group connection data
               */
              var teams_local = angular.fromJson(Storage.get("Teams"));

//              console.log('teams ->', teams_local);

              var connections = {teamClients: {} , teams: {} ,clients: {} };

              var members = [];
              data.teams = [];
              var memGlobalIds = [];
              
              angular.forEach(teams_local,function(team,index){

                /*
                 * push team data
                 */
                data.teams.push({"id" : team.uuid , "name" : team.name});

                var mems = angular.fromJson(Storage.get(team.uuid));
                var memIds = [];
                
                angular.forEach(mems,function(mem,index){
                    memIds.push(mem.uuid);
                    if(memGlobalIds.indexOf(mem.uuid) == -1 ){
                        members.push({"name" : mem.firstName+" "+mem.lastName , "id" : mem.uuid });
                        memGlobalIds.push(mem.uuid);
                    }
                });

//                console.log(team.name+"("+team.uuid+")","==>",memIds);
                connections.teams[team.uuid] = memIds;

              });
              
              var members_Not_In_team = angular.fromJson(Storage.get("members"));
              angular.forEach(members_Not_In_team,function(mem,index){
            	  if(memGlobalIds.indexOf(mem.uuid) == -1 ){
            		  members.push({"name" : mem.firstName+" "+mem.lastName , "id" : mem.uuid });
            	  }
              });
              
              data.members = members;

              /**
               * clients , group-client connection data
               */
              var groups = angular.fromJson(Storage.get("ClientGroups"));
              var groupIds = [];
              data.groups = groups;

              var clients = [];
              var clientIds = [];

              angular.forEach(groups,function(group,index){
                var cts = angular.fromJson(Storage.get(group.id));
                var ctIds = [];
                angular.forEach(cts,function(client,index){
                  
                  ctIds.push(client.uuid);

                  // add to global client ids
                  if(clientIds.indexOf(client.uuid) == -1){
                      clientIds.push(client.uuid);
                      clients.push({"name" : client.firstName+" "+client.lastName , "id" : client.uuid});
                  }
                });

                connections.clients[group.id] = ctIds;

                groupIds.push(group.id);
              });

              /*
               * get the clients not in the client group
               */
              var clients_Not_In_Group = angular.fromJson(Storage.get("clients"));

              angular.forEach(clients_Not_In_Group,function(client,index){
                  if(clientIds.indexOf(client.uuid) == -1){
                      clientIds.push(client.uuid);
                      clients.push({"name" : client.firstName+" "+client.lastName , "id" : client.uuid});
                  }
              });

              data.clients = clients;

              angular.forEach(teams_local,function(team,index){
                  /*
                   * push team group connection data
                   */
                  var grps = angular.fromJson(Storage.get("teamGroup_"+team.uuid));
                  var kp = true;
                  angular.forEach(grps,function(grp,i){
                      if(groupIds.indexOf(grp.id) != -1 && kp){
                          connections.teamClients[team.uuid] = grp.id;
                          kp = false;
                      }
                  });

              });
              
              // log the links 
//              angular.forEach(connections.teamClients,function(grpLink,teamId){
//                  angular.forEach(data.groups,function(grp){
//                     if(grpLink == grp.id){
//                         console.log("group in the team-clients links " , grp);
//                     } 
//                  });
//              });
//              console.log("data.groups" , data.groups);
              
              // keep the original connections into the scope
              $scope.connections = connections;
              
//              console.log("Members : " , data.members);
              return {'data' : data, 'con' : connections};
          }else{
            // data from the server
              return {'data' : {}, 'con' : {}};
          }
          
      }


      var localdata = $scope.loadData(data);
      data = localdata.data;
      var connections = localdata.con;


      /**
       * Introduce and reset data containers
       */
      $scope.data = {
        left: [],
        right: []
      };


      /**
       * View setter
       */
      function setView (hash)
      {
        $scope.views = {
          teamClients:  false,
          teams:        false,
          clients:      false
        };

        $scope.views[hash] = true;
        
        var localdata = $scope.loadData(data);
        data = localdata.data;
        connections = localdata.con;
        
      }


      /**
       * Switch between the views and set hash accordingly
       */
      $scope.setViewTo = function (hash)
      {
        $scope.$watch(hash, function ()
        {
          $location.hash(hash);

          setView(hash);

          $scope.manage(hash);
        });
      };


      /**
       * Default view
       */
      $scope.setViewTo('teamClients');


      /**
       * Prepare connections
       */
      $scope.connector = {

        /**
         * Cache connections
         */
        data: connections,

        /**
         * Containers
         */
        connections: {
          teamClients:  [],
          teams:        {},
          clients:      {}
        },

        /**
         * Team & Clients connections
         */
        teamClients: function ()
        {
          this.connections.teamClients = [];

          var _this = this;

          angular.forEach(this.data.teamClients, function (gid, tid)
          {
            var connection = {
              sourceItems:  [],
              targetItem:   {}
            };

            angular.forEach(data.teams, function (team)
            {
              if (team.id == tid)
              {
                connection.targetItem = team;
              }
            });

            var _group;

            for (var i = 0; i < data.groups.length; i++)
            {
              if (data.groups[i].id == gid)
              {
                _group = data.groups[i];

                connection.sourceItems.push(_group);
              }
            }

            _this.connections.teamClients.push(connection);
          });

          return this.connections;
        },

        /**
         * Populate connections
         */
        populate: function (connections, data, section)
        {
          var population = {};

          angular.forEach(connections, function (nodes, key)
          {
            population[key] = [];

            angular.forEach(nodes, function (kid)
            {
              angular.forEach(data, function (node)
              {
                if (node.id == kid)
                {
                  population[key].push({
                    _id:     node.id,
                    name:    node.name,
                    _parent: section + key
                  });
                }
              })
            });
          });

          return population;
        },

        /**
         * Teams connections
         */
        teams: function ()
        {
          this.connections.teams = {};

          this.connections.teams = this.populate(this.data.teams, data.members, 'teams_right_');

          return this.connections;
        },

        /**
         * Clients connections
         */
        clients: function ()
        {
          this.connections.clients = {};

          this.connections.clients = this.populate(this.data.clients, data.clients, 'clients_right_');

          return this.connections;
        }
      };


      /**
       * Manage TreeGrids
       */
      $scope.manage = function (grid)
      {
        switch (grid)
        {
          case 'teamClients':
            $rootScope.$broadcast('TreeGridManager', grid, '1:1', {
              left:   data.groups,
              right:  data.teams
            },
            $scope.connector.teamClients());
            break;

          case 'teams':
            $rootScope.$broadcast('TreeGridManager', grid, '1:n', {
              left:   data.members,
              right:  data.teams
            },
            $scope.connector.teams());
            break;

          case 'clients':
            $rootScope.$broadcast('TreeGridManager', grid, '1:n', {
              left:   data.clients,
              right:  data.groups
            },
            $scope.connector.clients());
            break;
        }
      };

      $scope.getChanges = function(preTeams,afterTeams){
          
          var changes = {};
          angular.forEach(preTeams,function(pMembers,tId){
              var notChanged = [];
              var afterMembers = afterTeams[tId]
              // find the unchanged items
              angular.forEach(pMembers,function(p_mem,t_i){
                  angular.forEach(afterMembers,function(at,t_j){
                      if(p_mem == at){
                          notChanged.push(p_mem);
                      }
                  });
              });
//              console.log(tId,"-->",notChanged);
              
              /*
               * try to remove the unchanged items from both list
               * 
               * then for items in the previous list are the items need to be removed
               *  
               *          items in the changed list are the items need to be added
               */ 
              
              angular.forEach(notChanged,function(nc){
                  pMembers.splice(pMembers.indexOf(nc),1);
                  afterMembers.splice(afterMembers.indexOf(nc),1);
              });
              
//              console.log("need to remove : " + pMembers); 
//              console.log("need to add : " + afterMembers);
//              console.log("----------------------");
              
              var addMembers = [];
              var removeMembers = [];
              
              angular.copy(pMembers, removeMembers);
              angular.copy(afterMembers, addMembers);
              
              if(addMembers.length > 0 || addMembers.length > 0 || removeMembers.length > 0 || removeMembers.length > 0 ){
                  changes[tId] = {a : addMembers, 
                                  r : removeMembers};
              }
              
              // add the nonChanged item back 
              angular.forEach(notChanged,function(nc){
                  pMembers.push(nc);
                  afterMembers.push(nc);
              });
              
          });
          
          return changes; 
      }

      /**
       * Save function listeners
       */
      
      /*
       * remove the duplicated listeners when going back to the controller 
       * temp solution
       */
      if($rootScope.$$listeners["save:teamClients"] && $rootScope.$$listeners["save:teamClients"].length > 0){
          $rootScope.$$listeners["save:teamClients"] = [];
      }
      
      if($rootScope.$$listeners["save:teams"] && $rootScope.$$listeners["save:teams"].length > 0){
          $rootScope.$$listeners["save:teams"] = [];
      }
      
      if($rootScope.$$listeners["save:clients"] && $rootScope.$$listeners["save:clients"].length > 0){
          $rootScope.$$listeners["save:clients"] = [];
      }
      
      
      $rootScope.$on('save:teamClients', function ()
      {
        console.log("before changing ->",$scope.connections.teamClients);
        console.log('saving team clients ->', arguments[1]);
        
        var preTc = $scope.connections.teamClients;
        var afterTc = arguments[1];
        
//        var addGroups = {};
//        var removeGroups = {};
        
        var teamIds = [];
        
        angular.forEach(preTc,function(preG,teamId_i){
            if(teamIds.indexOf(teamId_i) == -1){
                teamIds.push(teamId_i);
            }
        });
        
        angular.forEach(afterTc,function(afterG,teamId_j){
            if(teamIds.indexOf(teamId_j) == -1){
                teamIds.push(teamId_j);
            }
        });
        
        var changes = {};
        
        angular.forEach(teamIds,function(tId){
        	
            if(typeof preTc[tId] == 'undefined' &&  afterTc[tId] ){
                changes[tId] = {a : [afterTc[tId]], r : []};
            }else if(typeof afterTc[tId] == 'undefined' &&  preTc[tId] ){
                changes[tId] = {r : [preTc[tId]] , a : []};
            }else if(preTc[tId] && afterTc[tId] && preTc[tId] != afterTc[tId]){
            	changes[tId] = {a : [afterTc[tId]] , r : [preTc[tId]]};
            }
            
        });
        
//        console.log("added ones :  " , addGroups);
//        console.log("removed ones :  " , removeGroups);
        
        
//        if(!angular.equals({},addGroups) || !angular.equals({},removeGroups) ){
//            changes = {a : addGroups , r : removeGroups};
//        }
        
//        console.log(changes);
        
        if(angular.equals({},changes)){
            console.log("no changes ! ");
        }else{
            console.log("Team Groups changes : " ,changes);
            
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
            
            Teams.manageGroups(changes).then(function(results){
                var error = "";
            	angular.forEach(results,function(res,i){
            		if(res.error){
            			error += res.error.data.error;
            		}
            	});
            	
            	if(error == ""){
            		$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
            		$route.reload();
            	}else{
            		$rootScope.notifier.error(error);
            	}
                
                $rootScope.statusBar.off();
                
            });
        }
        
        
      });
      
      $rootScope.$on('save:teams', function ()
      {
        console.log("before teams -> ", $scope.connections.teams);  
        console.log('saving teams ->', arguments[1]);
        
        var preTeams = $scope.connections.teams;
        var afterTeams = arguments[1];
        var changes = $scope.getChanges(preTeams,afterTeams);
        
        // get all the changes  
        if(angular.equals({},changes)){
            console.log("no changes ! ");
        }else{
            console.log("Team Member changes : " ,changes);
            
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
            
            Teams.manage(changes).then(function(result){
                
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                
//             	try to get the members not in the teams Aync 
                Teams.queryMembersNotInTeams().then(function(result){
                	console.log("members not in any teams loaded ");
                	$rootScope.statusBar.off();
                	$route.reload();
                },function(error){
                	console.log(error);
                });
                
            });
        }
        
        
      });

      $rootScope.$on('save:clients', function ()
      {
        console.log("before clients -> ", $scope.connections.clients);
        console.log('saving clients ->', arguments[1]);
        
        var preClients = $scope.connections.clients;
        var afterClients = arguments[1];
        var changes = $scope.getChanges(preClients,afterClients);
        
        console.log("Group Client changes : ", changes);
        
        // get all the changes  
        if(angular.equals({},changes)){
            console.log("no changes ! ");
        }else{
            $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
            
            Clients.manage(changes).then(function(result){
                
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
                $route.reload();
            });
        }
        
      });
      
      
      
    }
    
]);
;/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.TreeGrid', [])


  .controller('treegrid',
    [
      '$rootScope', '$scope', '$window',
      function ($rootScope, $scope, $window)
      {
        $scope.treeGrid = {

          options: {
            grid: {
              width: 'auto',
              height: null,
              items: {
                minHeight: 40
              }
            }
          },
          type: null,
          grid: null,
          data:        {},
          processed:   {},
          grids:       {},
          stores:      {},
          caches:      {},
          connections: {},


          /**
           * Calculate height of available area
           */
          areas: function ()
          {
            this.options.grid.height = $('#wrap').height() - (270 + 200) + 'px'
          },


          /**
           * Build TreeGrid
           */
          build: function (id, data)
          {
            var _this = this,
                key   = $scope.treeGrid.grid + '_' + id;

            this.grids[key] = new links.TreeGrid(
              document.getElementById($scope.treeGrid.grid + '_' + id),
              this.options.grid
            );

            angular.forEach(this.stores, function (store)
            {
              var filtered = [];

              angular.forEach(store.data, function (node)
              {
                node._id && filtered.push(node);
              });

              store.data = store.filteredData = filtered;
            });

            this.grids[key].draw(this.store(id, data));


            /**
             * Expand listener
             */
            links.events.addListener(this.grids[key], 'expand',
              function (properties)
              {
                // console.log('expanding ->', key, properties);
              }
            );


            /**
             * Collapse listener
             */
            links.events.addListener(this.grids[key], 'collapse',
              function (properties)
              {
                // console.log('collapsing ->', key, properties);
              }
            );


            /**
             * Select listener
             */
            links.events.addListener(this.grids[key], 'select',
              function (properties)
              {
                // console.log('selecting ->', key, properties);
              }
            );


            /**
             * Remove listener
             */
            links.events.addListener(this.grids[key], 'remove',
              function (event)
              {
                var items = event.items;

                for (var i = 0; i < items.length; i++)
                {
                  _this.stores[key].removeLink(items[i]);
                }
              }
            );
          },


          /**
           * Initialize a DataTable
           */
          store: function (id, data)
          {
            var _this = this,
                key   = $scope.treeGrid.grid + '_' + id;

            this.stores[key] = new links.DataTable(
              this.process(id, data),
              this.configure(id)
            );

            this.stores[key].totalItems = this.stores[key].data.length;

            /**
             * Append items
             */
            this.stores[key].appendItems = function (items, callback)
            {
              function isUnique (item, data)
              {
                var ret = true;

                for (var i = 0; i < data.length; i++)
                {
                  if (item._id == data[i]._id)
                  {
                    ret = false;
                  }
                }

                if (item.nodes)
                {
                  ret = false;
                }

                return ret;
              }

              for (var i = 0; i < items.length; i++)
              {
                var unique = isUnique(items[i], this.data);

                if (unique)
                {
                  items[i]._actions = [
                    {
                      event:  'remove',
                      text:   'remove'
                    }];

                  this.data.push(items[i]);
                }
              }

              if (unique)
              {
                this.updateFilters();

                if (callback)
                {
                  callback({
                    'totalItems': this.filteredData.length,
                    'items':      items
                  });
                }

                this.trigger('change', undefined);
              }
            };


            /**
             * Link items
             */
            this.stores[key].linkItems = function (sourceItems, targetItem, callback, errback)
            {
              var index = this.data.indexOf(targetItem);

              if (index == -1)
              {
                errback('Error: targetItem not found in data');
                return;
              }

              var names = [],
                  ids   = [];

              for (var i = 0; i < sourceItems.length; i++)
              {
                names.push(sourceItems[i].name);
                  ids.push(sourceItems[i]._id);
              }

              this.data[index] = {
                '_id':      targetItem._id,
                'name':     targetItem.name,
                'links':    names.join(', '),
                '_ids':     ids.join(', '),
                '_actions': [{'event': 'unlink', 'text': 'unlink'}]
              };

              callback({
                'items':      [targetItem],
                'totalItems': this.data.length
              });

              this.update();
            };


            /**
             * Unlink items
             */
            this.stores[key].unlink = function (item)
            {
              var index = this.data.indexOf(item);

              if (index == -1)
              {
                throw Error('item not found in data');
              }

              this.data[index] = {
                _id:  item._id,
                name: item.name
              };

              this.update();
            };



            /**
             * Remove links
             */
            this.stores[key].removeLink = function (item)
            {
              var filtered = [];

              angular.forEach(_this.stores[item._parent].data, function (data)
              {
                (data._id != item._id) && filtered.push(data);
              });

              _this.stores[item._parent].data = _this.stores[item._parent].filteredData = filtered;

              this.updateFilters();

              this.trigger('change', undefined);

              var processed = [],
                  pieces    = item._parent.split('_'),
                  section   = pieces[0],
                  last      = pieces[pieces.length - 1];

              angular.forEach(_this.connections[section][last], function (connection)
              {
                if (connection._id != item._id)
                {
                  connection._actions = [{
                    event:  'remove',
                    text:   'remove'
                  }];

                  processed.push(connection);
                }
              });

              _this.connections[section][last] = _this.caches[item._parent] = processed;

              this.update();
            };



            /**
             * Change listener
             */
            links.events.addListener(this.stores[key], 'change',
              function ()
              {
                angular.forEach(_this.stores[key].data, function (data)
                {
                  data._parent = key;
                });

                _this.caches[key] = _this.stores[key].data;
              }
            );


            /**
             * (Custom) unlink listener
             */
            links.events.addListener(this.stores[key], 'unlink',
              function (event)
              {
                var items = event.items;

                for (var i = 0; i < items.length; i++)
                {
                  _this.stores[key].unlink(items[i]);
                }
              }
            );


            /**
             * Add teamClients connections if they exist
             */
            if ($scope.treeGrid.grid == 'teamClients' && id == 'right')
            {
              if (this.connections.teamClients.length > 0)
              {
                angular.forEach(this.connections.teamClients, function (connection)
                {
                  var index;

                  angular.forEach(_this.stores['teamClients_right'].data, function (data, ind)
                  {
                    if (connection.targetItem.id == data._id)
                    {
                      index = ind;

                      var names = [],
                          ids   = [];

                      for (var i = 0; i < connection.sourceItems.length; i++)
                      {
                        names.push(connection.sourceItems[i].name);
                          ids.push(connection.sourceItems[i].id);
                      }

                      _this.stores['teamClients_right'].data[index] = {
                        '_id':      connection.targetItem.id,
                        'name':     connection.targetItem.name,
                        'links':    names.join(', '),
                        '_ids':     ids.join(', '),
                        '_actions': [{'event': 'unlink', 'text': 'unlink'}]
                      };

                      _this.stores['teamClients_right'].update();
                    }
                  });
                });
              }
            }

            return this.stores[key];
          },


          /**
           * Process data
           */
          process: function (id, data)
          {
            var _this = this,
                key   = $scope.treeGrid.grid + '_' + id;

            var filtered = [];

            angular.forEach(data, function (node)
            {
              (node.id) && filtered.push(node);
            });

            this.processed[key] = [];

            angular.forEach(filtered, function (node)
            {
              var fid = _this.grid + '_' + id + '_' + node.id;

              var record = {
                name:     node.name,
                _id:      node.id,
                _parent:  fid
              };

              if (_this.type == '1:n' && id == 'right')
              {
                if (_this.grid == 'teams' &&
                  _this.connections.teams[node.id] &&
                  _this.connections.teams[node.id].length > 0)
                {
                  setTimeout(function ()
                  {
                    _this.stores[fid].appendItems(
                      _this.connections.teams[node.id],
                      function (results)
                      {
                        _this.stores[fid].totalItems = results.totalItems;
                      }
                    );
                  }, 100);
                }

                if (_this.grid == 'clients' &&
                  _this.connections.clients[node.id] &&
                  _this.connections.clients[node.id].length > 0)
                {
                  setTimeout(function ()
                  {
                    _this.stores[fid].appendItems(
                      _this.connections.clients[node.id],
                      function (results)
                      {
                        _this.stores[fid].totalItems = results.totalItems;
                      }
                    );
                  }, 100);
                }

                var data = (_this.caches[fid]) ? _this.caches[fid] : [];

                record.nodes = _this.store(
                  id + '_' + node.id,
                  data
                );

                // record.name += ' (' + _this.stores[fid].totalItems + ')';
              }

              _this.processed[key].push(record);
            });

            return this.processed[key];
          },


          /**
           * Configure TreeGrids
           */
          configure: function (id)
          {
            var options = {
              showHeader:   false,
              dataTransfer: {}
            };

            switch (this.type)
            {
              case '1:1':
                switch (id)
                {
                  case 'left':
                    options.dataTransfer = {
                      allowedEffect: 	'link'
                    };
                    break;
                  case 'right':
                    options.dataTransfer = {
                      dropEffect: 	'link'
                    };
                    break;
                }
                break;

              case '1:n':
                options.dataTransfer = {
                  allowedEffect: 	'copy',
                  dropEffect: 		'copy'
                };
                break;
            }

            return options;
          },


          /**
           * Init TreeGrid
           */
          init: function ()
          {
            this.areas();

            this.build('left',  this.data.left);
            this.build('right', this.data.right);

            /*
             setTimeout(function ()
             {
             console.log('treeGrid ->', $scope.treeGrid);
             }, 500);
             */
          }
        };


        /**
         * TreeGrid manager listener
         */
        $rootScope.$on('TreeGridManager', function ()
        {
          $scope.treeGrid.grid        = arguments[1];
          $scope.treeGrid.type        = arguments[2];
          $scope.treeGrid.data        = arguments[3];
          $scope.treeGrid.connections = arguments[4];

          (function ($scope)
          {
            setTimeout(function ()
            {
              $scope.treeGrid.init();
            }, 100)
          })($scope);
        });


        /**
         * Attach listener for window resizing
         */
        $window.onresize = function ()
        {
          $scope.treeGrid.init();
        };


        /**
         * Save treeGrid
         */
        $scope.save = {

          /**
           * Teams & Clients
           */
          teamClients: function ()
          {
            var data        = $scope.treeGrid.stores['teamClients_right'].data,
                connections = {};

            angular.forEach(data, function (node)
            {
              if (node._ids || node.links)
              {
                connections[node._id] = node._ids;
              }
            });

            $rootScope.$broadcast('save:teamClients', connections);
          },

          /**
           * Extract data
           */
          extract: function (sources)
          {
            var connections = {};

            angular.forEach(sources, function (source)
            {
              if (source.nodes.data.length > 0)
              {
                var nodes = [];

                angular.forEach(source.nodes.data, function (node)
                {
                  nodes.push(node._id);
                });

                connections[source._id] = nodes;
              }
            });

            return connections;
          },

          /**
           * Teams
           */
          teams: function ()
          {
            $rootScope.$broadcast('save:teams',
              this.extract($scope.treeGrid.stores['teams_right'].data)
            );
          },

          /**
           * Clients
           */
          clients: function ()
          {
            $rootScope.$broadcast('save:clients',
              this.extract($scope.treeGrid.stores['clients_right'].data)
            );
          }

        };
      }
    ]);;/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Controllers.Planboard', [])

/**
 * Planboard controller
 */
.controller('planboard', ['$rootScope', '$scope', '$location', 'Dater', 'Storage', 'Teams','Clients',
function($rootScope, $scope, $location, Dater, Storage, Teams,Clients) {

	var self = this, params = $location.search();
	$scope.imgHost = profile.host();

	var teams = angular.fromJson(Storage.get('Teams')), clients = angular.fromJson(Storage.get('ClientGroups'));

	$scope.data = {
		teams : {
			list : [],
			members : {},
			tasks : []
		},
		clients : {
			list : [],
			members : {},
			tasks : []
		},
		user : [{
			"count" : 0,
			"end" : 1378681200,
			"recursive" : true,
			"start" : 1378504800,
			"text" : "com.ask-cs.State.Available",
			"type" : "availability",
			"wish" : 0
		}, {
			"count" : 0,
			"end" : 1378850400,
			"recursive" : true,
			"start" : 1378720800,
			"text" : "com.ask-cs.State.Available",
			"type" : "availability",
			"wish" : 0
		}],
		members : [],
		synced : Number(Date.today()),
		periods : {
			start : Number(Date.today()) - (7 * 24 * 60 * 60 * 1000),
			end : Number(Date.today()) + (7 * 24 * 60 * 60 * 1000)
		}
	};

	angular.forEach(teams, function(team) {
		var members = angular.fromJson(Storage.get(team.uuid));

		if (members && members.length > 0) {
			$scope.data.teams.list.push({
				uuid : team.uuid,
				name : team.name
			});

			$scope.data.teams.members[team.uuid] = [];

			angular.forEach(members, function(member) {
				var imgURL = $scope.imgHost + "/teamup/team/member/" + member.uuid + "/photo";
				var avatar = '<div class="roundedPicSmall memberStateNone" ' + 'style="float: left; background-image: url(' + imgURL + ');" memberId="'+member.uuid+'"></div>';

				var name = avatar + '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' + member.firstName + ' ' + member.lastName + '</div>';
				var obj = {"head" : name , "memId" : member.uuid};
				$scope.data.teams.members[team.uuid].push(obj);
			});
		}
	});

	angular.forEach(clients, function(client) {
		var members = angular.fromJson(Storage.get(client.id));

		if (members && members.length > 0) {
			$scope.data.clients.list.push({
				uuid : client.id,
				name : client.name
			});

			$scope.data.clients.members[client.id] = [];

			angular.forEach(members, function(member) {
				var imgURL = $scope.imgHost + "/teamup/client/" + member.uuid + "/photo";
				var avatar = '<div class="roundedPicSmall memberStateNone" ' + 'style="float: left; background-image: url(' + imgURL + ');" memberId="'+member.uuid+'"></div>';

				var name = avatar + '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' + member.firstName + ' ' + member.lastName + '</div>';
				var obj = {"head" : name , "memId" : member.uuid};
				$scope.data.clients.members[client.id].push(obj);
			});
		}
	});

	function switchData() {
		switch ($scope.section) {
			case 'teams':
				$scope.list = $scope.data.teams.list;
				if(typeof $scope.currentTeam == "undefined"){
					$scope.currentTeam = $scope.data.teams.list[0].uuid;
				}
				$scope.changeCurrent($scope.currentTeam);
				break;
			case 'clients':
				$scope.list = $scope.data.clients.list;
				if(typeof $scope.currentClientGroup == "undefined"){
					$scope.currentClientGroup = $scope.data.clients.list[0].uuid;
				}
				$scope.changeCurrent($scope.currentClientGroup);
				break;
		}

		
	}


	$scope.changeCurrent = function(current) {

		angular.forEach($scope.data[$scope.section].list, function(node) {
			if (node.uuid == current) {
				$scope.currentName = node.name;
			}
		});
		
		// change the tab
//		if(typeof $scope.data.section != "undefined" && $scope.data.section != $scope.section){
//			if($scope.section == "teams"){
//				$scope.current = $scope.data.teams.list[0].uuid;
//				
//			}else if($scope.section == "clients"){
//				$scope.current = $scope.data.clients.list[0].uuid;
//				
//			}
//		}
		if($scope.section == "teams"){
			$scope.currentTeam = current;
			$scope.data.members = $scope.data[$scope.section].members[$scope.currentTeam];
		}else if($scope.section == "clients"){
			$scope.currentClientGroup = current;
			$scope.data.members = $scope.data[$scope.section].members[$scope.currentClientGroup];
		}
		$scope.data.section = $scope.section;

		
		
		// try to loading the slots from here
		var startTime = Number(Date.today()) - (7 * 24 * 60 * 60 * 1000);
		var endTime = Number(Date.today()) + (7 * 24 * 60 * 60 * 1000);
		
		var storeTask = function(tasks,startTime,endTime){
			console.log("tasks " , tasks);
			angular.forEach(tasks, function(task,memberId) {
				if(task != null){
					$scope.data[$scope.section].tasks[memberId] = task;
				}
			});
			
			$rootScope.$broadcast('timeliner', {
				start : startTime,
				end : endTime 
			});
		};
		
		if($scope.data.section == "teams"){
			
			$location.search({
				uuid : $scope.currentTeam
			}).hash('teams');
			
			Teams.getTeamTasks($scope.currentTeam,startTime/1000,endTime/1000).then(function(tasks){
				// process the tasks data
				storeTask(tasks,startTime,endTime);
			},function(error){
				console.log("error happend when getting the tasks for the team members " + error);
			});
		}else if($scope.data.section == "clients"){
			
			$location.search({
				uuid : $scope.currentClientGroup
			}).hash('clients');
			
			Clients.getClientTasks($scope.currentClientGroup,startTime/1000,endTime/1000).then(function(tasks){
				storeTask(tasks,startTime,endTime);
			},function(error){
				console.log("error happend when getting the tasks for the team members " + error);
			});
		}	
		
	};


    
    
	/**
	 * View setter
	 */
	function setView(hash) {
		$scope.views = {
			teams : false,
			clients : false,
			member : false,
			slot: {
	          add:  false,
	          edit: false
		    }
		};

		$scope.views[hash] = true;
	}
	
	/**
	 * Switch between the views and set hash accordingly
	 */
	$scope.setViewTo = function(uuid,hash) {
		$scope.$watch(hash, function() {
			$location.hash(hash);

			$scope.section = hash;

			switchData();

			setView(hash);
		});
	};
	
	
	$scope.resetViews = function ()
    {
      $scope.views.slot = {
              add:  false,
              edit: false
      };
        
    };
    
	/**
     * Reset planboard views
     */
    $rootScope.$on('resetPlanboardViews', function (){
    	$scope.resetViews();    	
    });

	
    var uuid, view;
    /**
	 * If no params or hashes given in url
	 */
	if(!params.uuid && !$location.hash()) {
		uuid = $scope.data.teams.list[0].uuid;
		view = 'teams';

		$location.search({
			uuid : $scope.data.teams.list[0].uuid
		}).hash('teams');
	} else {
		uuid = params.uuid;
		view = $location.hash();
	}
	
	/**
	 * Default view
	 */
	$scope.setViewTo(uuid,view);

	/*
	var data = {
	"user": [
	{
	"count": 0,
	"end": 1378681200,
	"recursive": true,
	"start": 1378504800,
	"text": "com.ask-cs.State.Available",
	"type": "availability",
	"wish": 0
	},
	{
	"count": 0,
	"end": 1378850400,
	"recursive": true,
	"start": 1378720800,
	"text": "com.ask-cs.State.Available",
	"type": "availability",
	"wish": 0
	}
	],
	"synced": Number(Date.today()),
	"periods": {
	"start": Number(Date.today()),
	"end":   Number(Date.today()) + (7 * 24 * 60 * 60 * 1000)
	}
	};

	// console.log('data ->', angular.toJson(data));

	console.log('this week ->', Number(Date.today()));
	*/

	/**
	 * Pass the self
	 */
	$scope.self = this;

	/**
	 * Pass time slots data
	 */
	// $scope.data = data;

	/**
	 * Get groups and settings
	 */
	//      var groups  	= Storage.local.groups(),
	//        settings 	= Storage.local.settings();

	/**
	 * Pass current
	 */
	$scope.current = {
		layouts : {
			user : true,
			group : false,
			members : false
		},
		/**
		 * Fix for timeline scope to day
		 */
		day : Dater.current.today() + 1,
		week : Dater.current.week(),
		month : Dater.current.month(),
		// group:    settings.app.group,
		division : 'all'
	};

	/**
	 * Pass periods
	 */
	Dater.registerPeriods();

	$scope.periods = Dater.getPeriods();

	/**
	 * Reset and init slot container which
	 * is used for adding or changing slots
	 */
	$scope.slot = {};

	/**
	 * Set defaults for timeline
	 */
	$scope.timeline = {
		id : 'mainTimeline',
		main : true,
		user : {
			id : $rootScope.app.resources.uuid,
			role : $rootScope.app.resources.role
		},
		current : $scope.current,
		/**
		 * Initial start up is next 7 days
		 */
		options : {
			start : $scope.periods.days[Dater.current.today() - 7].last.day,
			end : $scope.periods.days[Dater.current.today() + 7].last.day,
			min : $scope.periods.days[Dater.current.today() - 7].last.day,
			max : $scope.periods.days[Dater.current.today() + 7].last.day
		},
		range : {
			start : $scope.periods.days[Dater.current.today() - 7].last.day,
			end : $scope.periods.days[Dater.current.today() + 7].last.day
		},
		scope : {
			day : false,
			week : true,
			month : false
		},
		config : {
			bar : $rootScope.config.timeline.config.bar,
			layouts : $rootScope.config.timeline.config.layouts,
			wishes : $rootScope.config.timeline.config.wishes,
			legenda : {},
			legendarer : $rootScope.config.timeline.config.legendarer,
			states : $rootScope.config.timeline.config.states,
			divisions : $rootScope.config.timeline.config.divisions,
			densities : $rootScope.config.timeline.config.densities
		}
	};

	/**
	 * IE8 fix for inability of - signs in date object
	 */
	if ($.browser.msie && $.browser.version == '8.0') {
		$scope.timeline.options = {
			start : $scope.periods.days[Dater.current.today() - 7].last.timeStamp,
			end : $scope.periods.days[Dater.current.today() + 7].last.timeStamp,
			min : $scope.periods.days[Dater.current.today() - 7].last.timeStamp,
			max : $scope.periods.days[Dater.current.today() + 7].last.timeStamp
		};
	}

	/**
	 * Legend defaults
	 */
	angular.forEach($rootScope.config.timeline.config.states, function(state, index) {
		$scope.timeline.config.legenda[index] = true;
	});

	/**
	 * Timeline group legend default configuration
	 */
	$scope.timeline.config.legenda.groups = {
		more : true,
		even : true,
		less : true
	};

	/**
	 * Prepare timeline range for date ranger widget
	 */
	$scope.daterange = Dater.readable.date($scope.timeline.range.start) + ' / ' + Dater.readable.date($scope.timeline.range.end);
	
	/**
	 * find the related users in the slot (could be a team member or a client) 
	 */
	$scope.processRelatedUsers = function(selectedSlot){
		
		var relatedUsers = [];
		var memberId = $(selectedSlot.group).attr("memberId");
		
		if($scope.views.teams){
			
			$scope.relatedUserLabel = $rootScope.ui.teamup.clients;
			var member = $rootScope.getTeamMemberById(memberId);
			if(typeof member.teamUuids != "undefined" && member.teamUuids.length > 0){
				relatedUsers = $rootScope.getClientsByTeam(member.teamUuids);
			}
		}else if($scope.views.clients){
			$scope.relatedUserLabel = $rootScope.ui.planboard.members;
			var client = $rootScope.getClientByID(memberId);
			if(typeof client.clientGroupUuid != "undefined" && client.clientGroupUuid != ""){
				relatedUsers = $rootScope.getMembersByClient(client.clientGroupUuid);
			}
		}
		
		return relatedUsers; 
	}
	
	/**
     * Reset inline forms
     */
    $scope.resetInlineForms = function ()
    {
      $scope.slot = {};

      $scope.original = {};

      $scope.resetViews();    
      
      if($scope.section == "teams"){
    	  $scope.changeCurrent($scope.currentTeam);
      }else if($scope.section == "clients"){
    	  $scope.changeCurrent($scope.currentClientGroup);
      }
      
    };
}]);
;/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Controllers.Timeline', []).controller('timeline', [
//      '$rootScope', '$scope', '$q', '$location', '$route', '$window', 'Slots', 'Dater', 'Storage', 'Sloter', 'Profile',
//      function ($rootScope, $scope, $q, $location, $route, $window, Slots, Dater, Storage, Sloter, Profile)
'$rootScope', '$scope', '$q', '$location', '$route', '$window', 'Dater', 'Sloter', 'Slots',
function($rootScope, $scope, $q, $location, $route, $window, Dater, Sloter, Slots) {
	var range, diff;

	/**
	 * Watch for changes in timeline range
	 */
	$scope.$watch(function() {
		/*
		if (!$scope.timeline.current.layouts.group)
		{
		// timeline.current.layouts.group
		$scope.timeline.config.wishes = false;
		$scope.groupWishes();
		}
		*/

		/**
		 * If main timeline
		 */
		if ($scope.timeline && $scope.timeline.main) {
			range = $scope.self.timeline.getVisibleChartRange();

			diff = Dater.calculate.diff(range);

			/**
			 * Scope is a day
			 *
			 * TODO (try later on!)
			 * new Date(range.start).toString('d') == new Date(range.end).toString('d')
			 */
			if (diff <= 86400000) {
				$scope.timeline.scope = {
					day : true,
					week : false,
					month : false
				};
			}
			/**
			 * Scope is less than a week
			 */
			else if (diff < 604800000) {
				$scope.timeline.scope = {
					day : false,
					week : true,
					month : false
				};
			}
			/**
			 * Scope is more than a week
			 */
			else if (diff > 604800000) {
				$scope.timeline.scope = {
					day : false,
					week : false,
					month : true
				};
			}

			$scope.timeline.range = {
				start : new Date(range.start).toString(),
				end : new Date(range.end).toString()
			};

			$scope.daterange = Dater.readable.date($scope.timeline.range.start) + ' / ' + Dater.readable.date($scope.timeline.range.end);
		}
		/**
		 * User timeline
		 * Allow only if it is not user
		 */
		else if ($route.current.params.userId != $rootScope.app.resources.uuid) {
			if ($scope.self.timeline) {
				range = $scope.self.timeline.getVisibleChartRange();

				$scope.timeline.range = {
					start : new Date(range.start).toString(),
					end : new Date(range.end).toString()
				};
			}
		}
	});

	/**
	 * Timeline listener
	 */
	$rootScope.$on('slotInitials', function() {
		$scope.slot = {};

		$scope.slot = {
			start : {
				date : new Date().toString($rootScope.config.formats.date),
				time : new Date().toString($rootScope.config.formats.time),
				datetime : new Date().toISOString()
			},
			end : {
				date : new Date().toString($rootScope.config.formats.date),
				time : new Date().addHours(1).toString($rootScope.config.formats.time),
				datetime : new Date().toISOString()
			},
			state : 'com.ask-cs.State.Available',
			recursive : false,
			id : ''
		};
	});

	/**
	 * Timeline (The big boy)
	 */
	$scope.timeliner = {

		/**
		 * Init timeline
		 */
		init : function() {
			$scope.self.timeline = new links.Timeline(document.getElementById($scope.timeline.id));

			links.events.addListener($scope.self.timeline, 'rangechanged', this.getRange);
			links.events.addListener($scope.self.timeline, 'add', this.onAdd);
			links.events.addListener($scope.self.timeline, 'delete', this.onRemove);
			links.events.addListener($scope.self.timeline, 'change', this.onChange);
			links.events.addListener($scope.self.timeline, 'select', this.onSelect);

			this.render($scope.timeline.options);
		},

		getRange : function() {
			$scope.timelineGetRange()
		},

		onAdd : function() {
			$scope.timelineOnAdd()
		},

		onRemove : function() {
			$scope.timelineOnRemove()
		},

		onChange : function() {
			$scope.timelineChanging()
		},

		onSelect : function() {
			$scope.timelineOnSelect()
		},

		/**
		 * (Re-) Render timeline
		 */
		render : function(options, remember) {
			/**
			 * First setup comes with undefined
			 */
			/*
			 if (remember === undefined)
			 {
			 remember = true;
			 }
			 */

			var start, end;

			/**
			 * Hot fix for not converted Date objects initially given by timeline
			 */
			if ($scope.timeline.range) {
				if ( typeof $scope.timeline.range.start != Date) {
					$scope.timeline.range.start = new Date($scope.timeline.range.start);
				}

				if ( typeof $scope.timeline.range.end != Date) {
					$scope.timeline.range.end = new Date($scope.timeline.range.end);
				}

				// console.log('RANGE GOOD !!');
				start = $scope.timeline.range.start;
				end = $scope.timeline.range.end;
			} else {
				// console.log('NOOOO RANGE !!');
				start = new Date(options.start);
				end = new Date(options.end);
			}

			// console.log('range in timeline ->', $scope.timeline.range);
			// console.log('REMEMBER ->', remember);

			$scope.timeline = {
				id : $scope.timeline.id,
				main : $scope.timeline.main,
				user : $scope.timeline.user,
				current : $scope.timeline.current,
				scope : $scope.timeline.scope,
				config : $scope.timeline.config,
				options : {
					start : (remember) ? start : new Date(options.start),
					end : (remember) ? end : new Date(options.end),
					min : new Date(options.start),
					max : new Date(options.end)
				}
			};

			/**
			 * IE8 fix for inability of - signs in date object
			 */
			if ($.browser.msie && $.browser.version == '8.0') {
				$scope.timeline.options.start = new Date(options.start);
				$scope.timeline.options.end = new Date(options.end);
			}

			angular.extend($scope.timeline.options, $rootScope.config.timeline.options);

			if ($scope.timeline.main) {
				$scope.self.timeline.draw(Sloter.process($scope.data, $scope.timeline.config, $scope.divisions, $scope.timeline.user.role, $scope.timeline.current), $scope.timeline.options);
			} else {
				var timeout = ($location.hash() == 'timeline') ? 100 : 2000;

				$rootScope.timelineLoaded = false;

				setTimeout(function() {
					$rootScope.timelineLoaded = true;
					$rootScope.$apply();

					$scope.self.timeline.draw(Sloter.profile($scope.data.slots.data, $scope.timeline.config), $scope.timeline.options);
				}, timeout);
			}

			$scope.self.timeline.setVisibleChartRange($scope.timeline.options.start, $scope.timeline.options.end);

		},

		/**
		 * Grab new timeline data from backend and render timeline again
		 */
		load : function(stamps, remember) {
			var _this = this;

			//            $scope.self.timeline.draw(
			//              Sloter.profile(
			//                $scope.data.slots.data,
			//                $scope.timeline.config
			//              ), $scope.timeline.options);

			// $scope.data = data;

			// console.log('render data ->', angular.toJson($scope.data.members));

			_this.render(stamps, remember);

			//            $rootScope.statusBar.display($rootScope.ui.planboard.refreshTimeline);
			//
			//            if ($scope.timeline.main)
			//            {
			//              Slots.all({
			//                groupId:  $scope.timeline.current.group,
			//                division: $scope.timeline.current.division,
			//                layouts:  $scope.timeline.current.layouts,
			//                month:    $scope.timeline.current.month,
			//                stamps:   stamps
			//              })
			//                .then(function (data)
			//                {
			//                  if (data.error)
			//                  {
			//                    $rootScope.notifier.error($rootScope.ui.errors.timeline.query);
			//                    console.warn('error ->', data);
			//                  }
			//                  else
			//                  {
			//                    $scope.data = data;
			//
			//                    _this.render(stamps, remember);
			//                  }
			//
			//                  $rootScope.statusBar.off();
			//
			//                  if ($scope.timeline.config.wishes)
			//                  {
			//                    getWishes();
			//                  }
			//                });
			//            }
			//            else
			//            {
			//              Profile.getSlots($scope.timeline.user.id, stamps)
			//                .then(function (data)
			//                {
			//                  if (data.error)
			//                  {
			//                    $rootScope.notifier.error($rootScope.ui.errors.timeline.query);
			//                    console.warn('error ->', data);
			//                  }
			//                  else
			//                  {
			//                    data.user 	= data.slots.data;
			//
			//                    $scope.data = data;
			//
			//                    _this.render(stamps, remember);
			//
			//                    $rootScope.statusBar.off();
			//                  }
			//                });
			//            }

		},

		/**
		 * Refresh timeline as it is
		 */
		refresh : function() {
			$scope.slot = {};

			if ($scope.timeline.main) {
				$rootScope.$broadcast('resetPlanboardViews');
			} else {
				$scope.forms = {
					add : true,
					edit : false
				};
			}

			this.load({
				start : $scope.data.periods.start,
				end : $scope.data.periods.end
			}, true);
		},

		/**
		 * Redraw timeline
		 */
		redraw : function() {
			$scope.self.timeline.redraw();
		},

		isAdded : function() {
			// return $('.timeline-event-content')
			//            .contents()
			//            .filter(function ()
			//            {
			//              return this.nodeValue == 'New'
			//            }).length;
			return $('.state-new').length;
		},

		/**
		 * Cancel add
		 */
		cancelAdd : function() {
			$scope.self.timeline.cancelAdd();
		}
	};

	/**
	 * Init timeline
	 */
	if ($scope.timeline)
		$scope.timeliner.init();

	/**
	 * Timeliner listener
	 */
	$rootScope.$on('timeliner', function() {
		// console.log('data ->', $scope.data);

		$scope.timeliner.load({
			start : new Date(arguments[1].start).getTime(),
			end : new Date(arguments[1].end).getTime()
		});
	});

	/**
	 * Handle new requests for timeline
	 */
	$scope.requestTimeline = function(section) {
		switch (section) {
			case 'group':
				$scope.timeline.current.layouts.group = !$scope.timeline.current.layouts.group;

				if ($scope.timeline.current.layouts.members && !$scope.timeline.current.layouts.group)
					$scope.timeline.current.layouts.members = false;
				break;

			case 'members':
				$scope.timeline.current.layouts.members = !$scope.timeline.current.layouts.members;

				if ($scope.timeline.current.layouts.members && !$scope.timeline.current.layouts.group)
					$scope.timeline.current.layouts.group = true;
				break;
		}

		$scope.timeliner.load({
			start : $scope.data.periods.start,
			end : $scope.data.periods.end
		});
	};

	/**
	 * Timeline get ranges
	 */
	$scope.timelineGetRange = function() {
		var range = $scope.self.timeline.getVisibleChartRange();

		$scope.$apply(function() {
			$scope.timeline.range = {
				start : new Date(range.from).toString(),
				end : new Date(range.till).toString()
			};

			if ($scope.timeline.main) {
				$scope.daterange = {
					start : Dater.readable.date(new Date(range.start).getTime()),
					end : Dater.readable.date(new Date(range.end).getTime())
				};
			}

		});
	};

	/**
	 * Get information of the selected slot
	 */
	$scope.selectedSlot = function() {
		var selection;

		// if ($scope.mode == 'edit')
		// {
		// 	console.log('in edit mode');
		// }
		// else
		// {
		// 	console.log('not in editing mode');
		// }

		/**
		 * TODO (Not working!!)
		 */
		// $scope.self.timeline.cancelAdd();

		if ($scope.timeliner.isAdded() > 0) {
			// console.log('there is one newly added slot');
			// $scope.self.timeline.prototype.cancelAdd();
			// links.Timeline.prototype.cancelAdd();
			// $scope.self.timeline.applyAdd = false;
			// $scope.resetInlineForms();
		}

		if ( selection = $scope.self.timeline.getSelection()[0]) {
			//var values = $scope.self.timeline.getItem(selection.row), content = angular.fromJson(values.content.match(/<span class="secret">(.*)<\/span>/)[1]) || null;
			var values = $scope.self.timeline.getItem(selection.row), content = angular.fromJson($($(values.content)[1]).val());

			$scope.relatedUsers = $scope.processRelatedUsers(values);

			$scope.original = {
				start : values.start,
				end : values.end,
				content : content,
			};

			if ($scope.timeline.main && values.content != "New") {
				$rootScope.$broadcast('resetPlanboardViews');
			} else if(values.content != "New"){
				/**
				 * TODO (Convert to resetview?)
				 */
				$scope.forms = {
					add : false,
					edit : true
				};
			}
			
			if(values.content == "New" ){
				content = {type : "slot"};
			}else if(content.relatedUser && typeof content.id == "undefined"){
				content = $.extend(content,{type : "slot"});
			}
			
			if (content.type) {
				if ($scope.timeline.main) {
					switch (content.type) {
						case 'slot':
							if(values.content == "New" || (content.relatedUser && typeof content.id == "undefined")){
								$scope.views.slot.add = true;
							}else{
								$scope.views.slot.edit = true;
							}
							break;
						case 'group':
							$scope.views.group = true;
							break;
						case 'wish':
							$scope.views.wish = true;
							break;
						case 'member':
							$scope.views.member = true;
							break;
					}
				}

				$scope.slot = {
					start : {
						date : new Date(values.start).toString($rootScope.config.formats.date),
						time : new Date(values.start).toString($rootScope.config.formats.time),
						datetime : new Date(values.start).toISOString()
					},
					end : {
						date : new Date(values.end).toString($rootScope.config.formats.date),
						time : new Date(values.end).toString($rootScope.config.formats.time),
						datetime : new Date(values.end).toISOString()
					},
					state : content.state,
					recursive : content.recursive,
					id : content.id,
					relatedUser : content.relatedUser,
				};

				/**
				 * TODO (Check if this can be combined with switch later on!)
				 *
				 * Set extra data based slot type for inline form
				 */
				if ($scope.timeline.main) {
					switch (content.type) {
						case 'group':
							$scope.slot.diff = content.diff;
							$scope.slot.group = content.group;
							break;

						case 'wish':
							$scope.slot.wish = content.wish;
							$scope.slot.group = content.group;
							$scope.slot.groupId = content.groupId;
							break;

						case 'member':
							$scope.slot.member = content.mid;
							break;
					}
				}
			}

			return values;
		}
		else{
//			$scope.resetInlineForms();
			console.log("click the timeline , but not a slot");
		}
	};

	/**
	 * Timeline on select
	 */
	$scope.timelineOnSelect = function() {
		// $rootScope.planboardSync.clear();

		$scope.$apply(function() {
			$scope.selectedOriginal = $scope.selectedSlot();
			
			// make the slot movable (editable) 
			if(typeof $scope.selectedOriginal != "undefined"){
				$scope.redrawSlot($scope.selectedOriginal);
			}
			
		});
	};

	/**
	 * Prevent re-rendering issues with timeline
	 */
	$scope.destroy = {
		timeline : function() {
			// Not working !! :(
			// Sloter.pies($scope.data);
		},
		statistics : function() {
			setTimeout(function() {
				$scope.timeliner.redraw();
			}, 10);
		}
	};

	/**
	 * Change division
	 */
	//        $scope.changeDivision = function ()
	//        {
	////      var filtered = [];
	////
	////      if ($scope.timeline.current.division == 'all')
	////      {
	////        filtered = $scope.data.aggs;
	////      }
	////      else
	////      {
	////        angular.forEach($scope.data.aggs, function (agg)
	////        {
	////          if ($scope.timeline.current.division == agg.division.id)
	////          {
	////            filtered.push(agg);
	////          }
	////        });
	////      }
	////
	////      $scope.data.filtered = filtered;
	//
	////      console.log('division ->', $scope.timeline.current.division);
	////
	////      console.log('div ->', $scope.groupPieHide);
	//
	//          angular.forEach($scope.divisions, function (division)
	//          {
	//            $scope.groupPieHide[division.id] = false;
	//          });
	//
	//          if ($scope.timeline.current.division !== 'all')
	//          {
	//            $scope.groupPieHide[$scope.timeline.current.division] = true;
	//          }
	//
	//          $scope.timeliner.render({
	//            start:  $scope.timeline.range.start,
	//            end:    $scope.timeline.range.end
	//          });
	//        };

	/**
	 * Group aggs barCharts toggle
	 */
	//        $scope.barCharts = function ()
	//        {
	//          $scope.timeline.config.bar = !$scope.timeline.config.bar;
	//
	//          $scope.timeliner.render({
	//            start:  $scope.timeline.range.start,
	//            end:    $scope.timeline.range.end
	//          });
	//        };

	/**
	 * Group wishes toggle
	 */
	//        $scope.groupWishes = function ()
	//        {
	//          if ($scope.timeline.config.wishes)
	//          {
	//            $scope.timeline.config.wishes = false;
	//
	//            delete $scope.data.aggs.wishes;
	//
	//            $scope.timeliner.render({
	//              start:  	$scope.timeline.range.start,
	//              end:    	$scope.timeline.range.end
	//            }, true);
	//          }
	//          else
	//          {
	//            $scope.timeline.config.wishes = true;
	//
	//            getWishes();
	//          }
	//        };

	/**
	 * Get wishes
	 */
	//        function getWishes ()
	//        {
	//          if ($scope.timeline.current.layouts.group)
	//          {
	//            $rootScope.statusBar.display($rootScope.ui.message.getWishes);
	//
	//            Slots.wishes({
	//              id:  			$scope.timeline.current.group,
	//              start:  	$scope.data.periods.start / 1000,
	//              end:    	$scope.data.periods.end / 1000
	//            }).then(function (wishes)
	//              {
	//                $rootScope.statusBar.off();
	//
	//                $scope.data.aggs.wishes = wishes;
	//
	//                $scope.timeliner.render({
	//                  start:  	$scope.timeline.range.start,
	//                  end:    	$scope.timeline.range.end
	//                }, true);
	//              });
	//          }
	//        }

	/**
	 * Timeline legend toggle
	 */
	//        $scope.showLegenda = function ()
	//        {
	//          $scope.timeline.config.legendarer = !$scope.timeline.config.legendarer;
	//        };

	/**
	 * Alter legend settings
	 */
	//        $scope.alterLegenda = function (legenda)
	//        {
	//          $scope.timeline.config.legenda = legenda;
	//
	//          $scope.timeliner.render({
	//            start:  $scope.timeline.range.start,
	//            end:    $scope.timeline.range.end
	//          });
	//        };

	/**
	 * Add slot trigger start view
	 */
	$scope.timelineOnAdd = function(form, slot) {
		$rootScope.planboardSync.clear();

		/**
		 * Make view for new slot
		 */
		if (!form) {
			var values = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);

			$scope.relatedUsers = $scope.processRelatedUsers(values);

			if ($scope.timeliner.isAdded() > 1)
				$scope.self.timeline.cancelAdd();

			$scope.$apply(function() {
				if ($scope.timeline.main) {
					$rootScope.$broadcast('resetPlanboardViews');

					$scope.views.slot.add = true;

				} else {
					$scope.forms = {
						add : true,
						edit : false
					};
				}

				$scope.slot = {
					start : {
						date : new Date(values.start).toString($rootScope.config.formats.date),
						time : new Date(values.start).toString($rootScope.config.formats.time),
						datetime : new Date(values.start).toISOString()
					},
					end : {
						date : new Date(values.end).toString($rootScope.config.formats.date),
						time : new Date(values.end).toString($rootScope.config.formats.time),
						datetime : new Date(values.end).toISOString()
					},
					recursive : (values.group.match(/recursive/)) ? true : false,
					/**
					 * INFO
					 * First state is hard-coded
					 * Maybe use the first one from array later on?
					 */
					state : 'com.ask-cs.State.Available'
				};
			});
		}
		/**
		 * Add new slot
		 */
		else {
			var now = Date.now().getTime(), values = {
				startTime : ($rootScope.browser.mobile) ? new Date(slot.start.datetime).getTime() / 1000 : Dater.convert.absolute(slot.start.date, slot.start.time, true),
				endTime : ($rootScope.browser.mobile) ? new Date(slot.end.datetime).getTime() / 1000 : Dater.convert.absolute(slot.end.date, slot.end.time, true),
				//				recursive : (slot.recursive) ? true : false,
				description : (typeof slot.state == "undefined")? "": slot.state,
				relatedUserId : slot.relatedUser,
			};

			if ( typeof slot.relatedUser == "undefined" || slot.relatedUser == "") {
				if ($scope.views.teams) {
					$rootScope.notifier.error($rootScope.ui.teamup.selectClient);
				} else if ($scope.views.clients) {
					$rootScope.notifier.error($rootScope.ui.teamup.selectMember);
				}
				return;
			}

			var selected = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);
			var memberId = $(selected.group).attr("memberId");
			if ( typeof memberId == "undefined") {
				$rootScope.notifier.error($rootScope.ui.teamup.selectSlot);
				return;
			}

			$rootScope.statusBar.display($rootScope.ui.planboard.addTimeSlot);

			Slots.add(values, memberId).then(function(result) {
				$rootScope.$broadcast('resetPlanboardViews');

				if (result.error) {
					//					$rootScope.notifier.error($rootScope.ui.errors.timeline.add);
					console.warn('error ->', result);
				} else {
					$rootScope.notifier.success($rootScope.ui.planboard.slotAdded);
					if($scope.section == "teams"){
						$scope.changeCurrent($scope.currentTeam);
					}else if($scope.section == "clients"){
						$scope.changeCurrent($scope.currentClientGroup);
					}
					$rootScope.statusBar.off();
				}

				$scope.timeliner.refresh();
				//				$rootScope.planboardSync.start();
			});

		}
	};

	$scope.redrawSlot = function(slot) {

		var start = Dater.convert.absolute($scope.slot.start.date, $scope.slot.start.time);
		var end = Dater.convert.absolute($scope.slot.end.date, $scope.slot.end.time);

		var selectedSlot = $scope.self.timeline.getSelection()[0];

		if ( typeof selectedSlot != "undefined") {
			var slotContent = $scope.processSlotContent(selectedSlot.row);

			$scope.self.timeline.changeItem(selectedSlot.row, {
				'content' : slotContent,
				'start' : new Date(start),
				'end' : new Date(end)
			});
		} else {
			alert($rootScope.ui.teamup.selectSlot);
		}

	};

	$scope.processSlotContent = function(row) {
		var item = $scope.self.timeline.getItem(row);

		var relateUserName = "";
		angular.forEach($scope.relatedUsers, function(ru) {
			if ($scope.slot.relatedUser == ru.uuid) {
				relateUserName = ru.name;
			}
		});

		var content_obj = item.content;
		if (content_obj != "New") {
			content_obj = angular.fromJson($($(item.content)[1]).val());
			content_obj.relatedUser = $scope.slot.relatedUser;
		} else {
			content_obj = {
				relatedUser : $scope.slot.relatedUser
			};			
		}

		var content = "<span>" + relateUserName + "</span>" + "<input type=hidden value='" + angular.toJson(content_obj) + "'>";
		if(typeof $scope.slot.relatedUser == 'undefined'){
			content = "New";
		}
		return content;
	};
	
	/**
	 * Timeline on change
	 */
	$scope.timelineChanging = function() {
		$rootScope.planboardSync.clear();

		var values = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);
		var options = {
			start : values.start,
			end : values.end,
			//              content:  angular.fromJson(values.content.match(/<span class="secret">(.*)<\/span>/)[1])
			content : values.content
		};

		var content_obj = angular.fromJson($($(values.content)[1]).val());

		$scope.$apply(function() {
			$scope.slot = {
				start : {
					date : new Date(values.start).toString($rootScope.config.formats.date),
					time : new Date(values.start).toString($rootScope.config.formats.time),
					datetime : new Date(values.start).toISOString()
				},
				end : {
					date : new Date(values.end).toString($rootScope.config.formats.date),
					time : new Date(values.end).toString($rootScope.config.formats.time),
					datetime : new Date(values.end).toISOString()
				},
				//	              state:      options.content.state,
				//	              recursive:  options.content.recursive,
				//	              id:         options.content.id
				relatedUser : ( typeof content_obj == "undefined") ? "" : content_obj.relatedUser,
			};
		});

		/**
		 * DEPRECIATED
		 */

		// console.log('content ->', options.content);

		// if ($scope.mode == 'edit')
		// {
		// 	if (options.content.id != $scope.slotid)
		// 	{
		// 		$scope.self.timeline.cancelChange();
		// 	}
		// }
		// else
		// {
		// 	$scope.mode = 'edit';
		// 	$scope.slotid = options.content.id;
		// }

	};

	$scope.getRelatedUserId = function(name) {
		var ret = "";
		angular.forEach($scope.relatedUsers, function(user) {
			if (user.name == name) {
				ret = user.uuid;
			}
		});
		return ret;
	};

	/**
	 * Timeline on change
	 */
	$scope.timelineOnChange = function(direct, original, slot, options) {
		$rootScope.planboardSync.clear();

		var selected = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);
		var content = angular.fromJson($($(selected.content)[1]).val())
		var memberId = $(selected.group).attr("memberId");
		
		if (!direct) {
			/**
			 * Through timeline
			 */
			var options = {
				startTime : selected.start/1000,
				endTime : selected.end/1000,
				description : "",
				relatedUserId:  slot.relatedUser,
				uuid : content.id,
			};
		} else {
			/**
			 * Through form
			 */
			var options = {
				startTime : ($rootScope.browser.mobile) ? new Date(slot.start.datetime).getTime() : Dater.convert.absolute(slot.start.date, slot.start.time, true),
				endTime : ($rootScope.browser.mobile) ? new Date(slot.end.datetime).getTime() : Dater.convert.absolute(slot.end.date, slot.end.time, true),
				description : "",
				relatedUserId: slot.relatedUser ,  
				uuid : content.id,
			};
		}

		var isChangeAllowed = function(old, curr) {
			var now = Date.now().getTime();

			if (old == curr)
				return true;

			if (old < now)
				return false;

			if (curr < now)
				return false;

			return true;
		};

		
		
		Slots.add(options, memberId).then(function(result) {
			$rootScope.$broadcast('resetPlanboardViews');

			if (result.error) {
				//					$rootScope.notifier.error($rootScope.ui.errors.timeline.add);
				console.warn('error ->', result);
			} else {
				$rootScope.notifier.success($rootScope.ui.planboard.slotChanged);
				if($scope.section == "teams"){
					$scope.changeCurrent($scope.currentTeam);
				}else if($scope.section == "clients"){
					$scope.changeCurrent($scope.currentClientGroup);
				}
			}

			$scope.timeliner.refresh();
			$rootScope.statusBar.off();
			//				$rootScope.planboardSync.start();
		});
	};

	/**
	 * Timeline on remove
	 */
	$scope.timelineOnRemove = function() {
		$rootScope.planboardSync.clear();

		if ($scope.timeliner.isAdded() > 0) {
			$scope.self.timeline.cancelAdd();

			$scope.$apply(function() {
				$scope.resetInlineForms();
			});
		} else {
			
			var selected = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);
			var content = angular.fromJson($($(selected.content)[1]).val())
			var memberId = $(selected.group).attr("memberId");

			if(typeof content == "undefined"){
				$scope.timeliner.refresh();
				return;
			}
			
			$rootScope.statusBar.display($rootScope.ui.planboard.deletingTimeslot);
			
			Slots.remove(content.id, memberId).then(function(result) {
				$rootScope.$broadcast('resetPlanboardViews');

				if (result.error) {
					$rootScope.notifier.error($rootScope.ui.errors.timeline.remove);
					console.warn('error ->', result);
				} else {
					$rootScope.notifier.success($rootScope.ui.planboard.timeslotDeleted);
					if($scope.section == "teams"){
						$scope.changeCurrent($scope.currentTeam);
					}else if($scope.section == "clients"){
						$scope.changeCurrent($scope.currentClientGroup);
					}
					
				}

				$scope.timeliner.refresh();
				
				$rootScope.statusBar.off();
				$rootScope.planboardSync.start();
			});
			
		}
	};

	/**
	 * Set wish
	 */
	//        $scope.wisher = function (slot)
	//        {
	//          $rootScope.statusBar.display($rootScope.ui.planboard.changingWish);
	//
	//          Slots.setWish(
	//            {
	//              id:     slot.groupId,
	//              start:  ($rootScope.browser.mobile) ?
	//                new Date(slot.start.datetime).getTime() / 1000 :
	//                Dater.convert.absolute(slot.start.date, slot.start.time, true),
	//              end:    ($rootScope.browser.mobile) ?
	//                new Date(slot.end.datetime).getTime() / 1000 :
	//                Dater.convert.absolute(slot.end.date, slot.end.time, true),
	//              recursive:  false,
	//              wish:       slot.wish
	//            })
	//            .then(
	//            function (result)
	//            {
	//              $rootScope.$broadcast('resetPlanboardViews');
	//
	//              if (result.error)
	//              {
	//                $rootScope.notifier.error($rootScope.ui.errors.timeline.wisher);
	//                console.warn('error ->', result);
	//              }
	//              else
	//              {
	//                $rootScope.notifier.success($rootScope.ui.planboard.wishChanged);
	//              }
	//
	//              $scope.timeliner.refresh();
	//            }
	//          );
	//        };

	/**
	 * TODO
	 * Stress-test this!
	 *
	 * Hot fix against not-dom-ready problem for timeline
	 */
	if ($scope.timeline && $scope.timeline.main) {
		setTimeout(function() {
			$scope.self.timeline.redraw();
		}, 100);
	}

	/**
	 * Background sync in every 60 sec
	 */
	$rootScope.planboardSync = {
		/**
		 * Start planboard sync
		 */
		start : function() {
			$window.planboardSync = $window.setInterval(function() {
				// console.log('planboard sync started..', new Date.now());

				/**
				 * Update planboard only in planboard is selected
				 */
				if ($location.path() == '/planboard') {
					$scope.slot = {};

					$rootScope.$broadcast('resetPlanboardViews');
					// $scope.resetViews();

					// if ($scope.views.slot.add) $scope.views.slot.add = true;
					// if ($scope.views.slot.edit) $scope.views.slot.edit = true;

					$scope.timeliner.load({
						start : $scope.data.periods.start,
						end : $scope.data.periods.end
					}, true);
				}
				// Sync periodically for a minute
			}, 60000);
			// 1 minute
			// }, 5000); //  10 seconds
		},

		/**
		 * Clear planboard sync
		 */
		clear : function() {
			// console.log('planboard sync STOPPED');

			// if ($window.planboardSync)
			// {
			// 	console.log('it exists', $window);
			// }
			// else
			// {
			// 	console.log('NOT existing !');
			// }

			$window.clearInterval($window.planboardSync);
		}
	};

	/**
	 * Start planboard sync
	 */
	$rootScope.planboardSync.start();
}]);
;/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Timeline.Navigation', [])


.controller('timeline-navigation', 
[
	'$rootScope', '$scope', '$window', 
	function ($rootScope, $scope, $window) 
	{
	  /**
	   * Day & Week & Month toggle actions
	   */
	  $scope.timelineScoper = function (period)
	  {
	    $scope.timeline.current.day   = $scope.current.day;
	    $scope.timeline.current.week  = $scope.current.week;
	    $scope.timeline.current.month = $scope.current.month;

	    switch (period)
	    {
	      case 'day':
	        $scope.timeline.scope = {
	          day:    true,
	          week:   false,
	          month:  false
	        };

	        $scope.timeliner.load({
	          start:  $scope.periods.days[$scope.timeline.current.day].first.timeStamp,
	          end:    $scope.periods.days[$scope.timeline.current.day].last.timeStamp,
	        });
	      break;

	      case 'week':
	        $scope.timeline.scope = {
	          day:    false,
	          week:   true,
	          month:  false
	        };

	        $scope.timeliner.load({
	          start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	          end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	        });
	      break;

	      case 'month':
	        $scope.timeline.scope = {
	          day:    false,
	          week:   false,
	          month:  true
	        };

	        $scope.timeliner.load({
	          start:  $scope.periods.months[$scope.timeline.current.month].first.timeStamp,
	          end:    $scope.periods.months[$scope.timeline.current.month].last.timeStamp,
	        });
	      break;
	    };
	  };


	  /**
	   * Go one period in past
	   */
	  $scope.timelineBefore = function (timelineScope)
	  {
	    if ($scope.timeline.scope.day)
	    {
	      if ($scope.timeline.current.day != 1)
	      {
	        $scope.timeline.current.day--;

	        $scope.timeliner.load({
	          start:  $scope.periods.days[$scope.timeline.current.day].first.timeStamp,
	          end:    $scope.periods.days[$scope.timeline.current.day].last.timeStamp,
	        });
	      };
	    }
	    else if ($scope.timeline.scope.week)
	    {
	      if ($scope.timeline.current.week != 1)
	      {
	        $scope.timeline.current.week--;

	        $scope.timeliner.load({
	          start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	          end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	        });
	      };
	    }
	    else if ($scope.timeline.scope.month)
	    {
	      if ($scope.timeline.current.month != 1)
	      {
	        $scope.timeline.current.month--;

	        $scope.timeliner.load({
	          start:  $scope.periods.months[$scope.timeline.current.month].first.timeStamp,
	          end:    $scope.periods.months[$scope.timeline.current.month].last.timeStamp,
	        });
	      };
	    };
	  };


	  /**
	   * Go one period in future
	   */
	  $scope.timelineAfter = function (timelineScope)
	  {
	    if ($scope.timeline.scope.day)
	    {
	      /**
	       * Total days in a month can change so get it start periods cache
	       */
	      if ($scope.timeline.current.day != $scope.periods.days.total)
	      {
	        $scope.timeline.current.day++;

	        $scope.timeliner.load({
	          start:  $scope.periods.days[$scope.timeline.current.day].first.timeStamp,
	          end:    $scope.periods.days[$scope.timeline.current.day].last.timeStamp,
	        });
	      };
	    }
	    else if ($scope.timeline.scope.week)
	    {
	      if ($scope.timeline.current.week != 53)
	      {
	        $scope.timeline.current.week++;

	        $scope.timeliner.load({
	          start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	          end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	        });
	      };
	    }
	    else if ($scope.timeline.scope.month)
	    {
	      if ($scope.timeline.current.month != 12)
	      {
	        $scope.timeline.current.month++;

	        $scope.timeliner.load({
	          start:  $scope.periods.months[$scope.timeline.current.month].first.timeStamp,
	          end:    $scope.periods.months[$scope.timeline.current.month].last.timeStamp,
	        });
	      };
	    };
	  };



	  /**
	   * Go to this week
	   */
	  $scope.timelineThisWeek = function ()
	  {
	    if ($scope.timeline.current.week != new Date().getWeek())
	    {
	      $scope.timeliner.load({
	        start:  $scope.periods.weeks[new Date().getWeek()].first.timeStamp,
	        end:    $scope.periods.weeks[new Date().getWeek()].last.timeStamp
	      });

	      $scope.timeline.range = {
	        start:  $scope.periods.weeks[new Date().getWeek()].first.day,
	        end:    $scope.periods.weeks[new Date().getWeek()].last.day
	      };
	    }
	  };


	  /**
	   * Go one week in past
	   */
	  $scope.timelineWeekBefore = function ()
	  {
	    if ($scope.timeline.current.week != 1)
	    {
	      $scope.timeline.current.week--;

	      $scope.timeliner.load({
	        start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	        end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	      });
	    };

	    $scope.timeline.range = {
	      start:  $scope.periods.weeks[$scope.timeline.current.week].first.day,
	      end:    $scope.periods.weeks[$scope.timeline.current.week].last.day
	    };
	  };


	  /**
	   * Go one week in future
	   */
	  $scope.timelineWeekAfter = function ()
	  {
	  	if ($scope.timeline.current.week != 53)
	    {
	      $scope.timeline.current.week++;

	      $scope.timeliner.load({
	        start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	        end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	      });
	    };

	  	$scope.timeline.range = {
	      start:  $scope.periods.weeks[$scope.timeline.current.week].first.day,
	      end:    $scope.periods.weeks[$scope.timeline.current.week].last.day
	    };
	  };


	  /**
	   * Timeline zoom in
	   */
	  $scope.timelineZoomIn = function ()
	  {
		  $scope.self.timeline.zoom($rootScope.config.timeline.config.zoom, Date.now());
		};


	  /**
	   * Timeline zoom out
	   */
	  $scope.timelineZoomOut = function ()
	  {
		  $scope.self.timeline.zoom(-$rootScope.config.timeline.config.zoom, Date.now());
		};


	  /**
	   * Redraw timeline on window resize
	   */
	  $window.onresize = function ()
	  {
		  $scope.self.timeline.redraw();
		};
		
		$scope.fullWidth = function ()
		{
			console.log('ok!');

			$scope.self.timeline.redraw();
		}
	}
]);;/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Messages', [])


/**
 * Messages controller
 */
.controller('messagesCtrl', 
[
    '$scope', '$rootScope', '$q', '$location', '$route', 'Messages', 'Storage','$filter','Teams',
    function ($scope, $rootScope, $q, $location, $route, Messages, Storage ,$filter,Teams) 
    {
    	$scope.messages = [];
    	
    	$scope.imgHost = profile.host();
    	
    	$scope.renderMessage = function(teamId){
    		
    		
    		Messages.queryTeamMessage(teamId).then(function(messages){
    			
    			if(messages.error){
    				$rootScope.notifier.error(messages.error.data);
    				return;
    			}
    			
    			console.log(messages.length,$scope.messages.length);
    			if($scope.messages.length == messages.length){
    				console.log("No new messages.");
    				return;
    			}
    			
    			$scope.messages = [];
    			
    			var msgDates = {};
    			var chatMembers = [];
    			// sort the messages by sendTime
//    			messages = $filter('orderBy')(messages,'sendTime','reverse');
    			messages = $filter('orderBy')(messages,'sendTime');
    			
    			angular.forEach(messages,function(message, i){
    				
    				var minDate = $filter('nicelyDate')(parseInt(message.sendTime));
    				if(i > 0 && minDate == $filter('nicelyDate')(parseInt(messages[i-1].sendTime))){
    					minDate = '';
    				}
    					
    				var msg = {date : minDate, 
						role : "",
						member : {},
						senderName : "",
						sendTime: parseInt(message.sendTime),
						body: message.body,
						msgRole : "",
						senderUuid : message.senderUuid
    				}
    				
    				var member = $scope.$root.getTeamMemberById(message.senderUuid);
    				if(message.senderUuid == $scope.$root.app.resources.uuid){
    					msg.role = "own";
    					msg.msgRole = "messageOwn"
    					msg.member = $scope.$root.app.resources;
                        msg.senderName = msg.member.firstName+" "+msg.member.lastName;
    				}else{
    					msg.role = "other";
    					msg.msgRole = "messageOther"
    					msg.member = member;
       				    msg.senderName = member.firstName+" "+member.lastName;
    				}
    				
    				$scope.messages.add(msg);
    				
    				if(chatMembers.indexOf(message.senderUuid) == -1){
    					chatMembers.add(message.senderUuid);
    				}
    			});
    			
    			// load the avatar img
    			angular.forEach(chatMembers, function(mId,i){
    				console.log(mId);
    				var imgURL = $scope.imgHost+"/teamup/team/member/"+mId+"/photo";
    				Teams.loadImg(imgURL).then(function(result){
    					// console.log("loading pic " + imgURL);
    					
    					var imgId = mId.replace(".","").replace("@","");
    					if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
    						console.log("no pics " ,result);
    					}else{
    						$('#chat-content #img_'+imgId).css('background-image','url('+imgURL+')');
    					}
    					
    				},function(error){
    					console.log("error when load pic " + error);
    				});
    			});
    			
    			// scroll to the bottom of the chat window
    			setTimeout(function () {
			        $('#chat-content #messageField').focus();
			        $('#chat-content').scrollTop($('#chat-content')[0].scrollHeight);
			    }, 100);
    		},function(error){
    			console.log(error);
    		});
    	}
    	
    	$scope.openChat = function(){
    		$scope.toggleChat = !$scope.toggleChat;
    		
    		var teamIds = $scope.$root.app.resources.teamUuids;
    		if(teamIds && $scope.toggleChat){
    			var teamId = teamIds[0];
    			$scope.renderMessage(teamId);
    			$scope.chatTeamId = teamId;
    			
    			// start auto check chat mesage
    			$scope.autoCheckMonitorId =  setInterval(function(teamId){
    				$scope.renderMessage(teamId);
    		    },5000);
    			
    		}else{
    			// stop auto check chat mesage
    			clearInterval($scope.autoCheckMonitorId);
    		}
    	}
    	
    	$scope.sendMessage = function(newMessage){
    		if(typeof newMessage == "undefined" || newMessage == ""){
    			$rootScope.notifier.error($rootScope.ui.message.emptyMessageBody);
    			return;
    		}
    		$rootScope.statusBar.display($rootScope.ui.message.sending);
    		
    		var current = new Date();
    		var message = {title: "From Web-Paige" + current.toString($rootScope.config.formats.date),
    				body: newMessage,
    				sendTime : current.getTime()};
    		console.log(message);
    		Messages.sendTeamMessage(message).then(function(result){
    			$scope.renderMessage($scope.chatTeamId);
    			$rootScope.statusBar.off();
    			$scope.newMessage = "";    			
    			
    		},function(error){
    			$rootScope.notifier.error(error);
    			$rootScope.statusBar.off();
    		});
    		
    	}
    	
    	/**
    	 * to do : auto refreshing the chat message 
    	 * get the latest chat record , and only get the chat message after it (compare by the time stamp)
    	 * then add new itmes to the $scope.messages
    	 * 
    	 * concurrent issue
    	 * There could be concurrent issue for real chat usage 
    	 * get the data a little bit earlier then the latest record 
    	 * and compare the id to see if the message it already be rendered.   
    	 */
    	
    	/**
    	 * only do the global refresh when open the chat tap
    	 */
    }
])