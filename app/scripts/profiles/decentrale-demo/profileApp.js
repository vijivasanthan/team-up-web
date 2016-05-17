/**
 * Installation profile
 */
var profile = {

  meta: 'teamup',

  own: true,

  name: 'Decentrale',

  lang: 'nl',

  showBackground: false,

  statesall: {
    'com.ask-cs.State.Available': {
      className: 'state-available',
      label: 'Bereikbaar',
      color: '#4f824f',
      type: 'Bereikbaar'
    },
    'secondline': {
      className: 'state-secondline',
      label: 'Achterwacht',
      color: '#f5a962',
      type: 'Bereikbaar'
    },
    'com.ask-cs.State.Unavailable': {
      className: 'state-unavailable',
      label: 'Niet bereikbaar',
      color: '#a93232',
      type: 'Niet bereikbaar'
    },
    'com.ask-cs.State.Unreached': {
      className: 'state-unreached',
      label: 'Niet bereikbaar',
      color: '#65619b',
      type: 'Niet bereikbaar'
    }
  },

  states: [
    'com.ask-cs.State.Available',
    'com.ask-cs.State.Unavailable'
  ],

  timeline: {
    config: {
      layouts: {
        groups: true,
        members: true
      }
    }
  },

  divisions: [],

  roles: [
    {
      id: '1',
      label: 'coordinator'
    },
    {
      id: '2',
      label: 'team lid'
    }
  ],

  p2000: {
    status: true,
    // url: 'http://couchdb.ask-cs.com:5984/p2000/_design/search/_view/standby?limit=4&descending=true',
    url:    'http://backend.ask-cs.com/~ask/p2000/p2000.php',
    codes: '1201958'
  },

  mobileApp: {
    android: 'https://play.google.com/store/apps/details?id=com.askcs.standby',
    ios: 'https://itunes.apple.com/nl/app/standby/id655588325?mt=8&uo=4',
    status: true,
    experimental: false
  },

  analytics: {
    status: false,
    code: function () {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-59561184-1', 'auto');
      ga('send', 'pageview');
    }
  },

  smartAlarm: false,

  timers: {
    TICKER: 100,
    NOTIFICATION_DELAY: 5000,
    MEMBER_TIMELINE_RENDER: 2000,
    ALARM_SYNC: 60000,
    PLANBOARD_SYNC: 60000,
    TV_SYNC: 60000
  }
};
