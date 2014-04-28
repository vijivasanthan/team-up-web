/**
 * Installation profile
 */
var profile = {

  meta: 'monster',

  title: 'REDDINGSBRIGADE',

	host: function ()
	{
    return ($.browser.msie) ? '/proxy/rb_monster' : 'http://backend.ask-cs.com/rb_monster';
	},

  states: [],

  timeline: {
    config: {
      layouts: {
        groups:   true,
        members:  false
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
    codes:  '1500982'
  },

  mobileApp: {
    status:   true,
    experimental: false
  },

  analytics: {
    status: true,
    code:   function ()
    {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-41638717-1', 'ask-cs.com');
      ga('send', 'pageview');
    }
  },

  smartAlarm: false
};