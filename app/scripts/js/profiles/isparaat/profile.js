/**
 * Installation profile
 */
var profile = {

  meta: 'isparaat',

  title: 'BRANDWEER',

	host: function ()
	{
    return ($.browser.msie) ? '/proxy/ns_knrmtest' : 'http://3rc2.ask-services.appspot.com/ns_knrmtest';
	},

  states: [],

  timeline: {
    config: {
      layouts: {
        groups:   true,
        members:  true
      }
    }
  },

  divisions: [],

  roles: [
    {
      id: 1,
      label: 'Planner'
    }, 
    {
      id: 2,
      label: 'Schipper'
    }, 
    {
      id: 3,
      label: 'Opstapper'
    }
  ],

  p2000: {
    status: true,
    url:    'http://knrmtest.myask.me/rpc/client/p2000.php',
    codes:  '0104517'
  },

  mobileApp: {
    status:   false,
    experimental: false
  },

  analytics: {
    status: false,
    code:   function ()
    {
    }
  },

  smartAlarm: false
};