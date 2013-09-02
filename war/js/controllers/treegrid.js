/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.TreeGrid', [])


  .controller('treegrid',
    [
      '$rootScope', '$scope', '$window',
      function ($rootScope, $scope, $window)
      {
        /**
         * TreeGrid
         */
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

          data:     {},
          processed:{},
          grids:    {},
          stores:   {},
          triggers: {},

          /**
           * TODO (Check this later on)
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
            var key = $scope.treeGrid.grid + '-' + id;

            this.grids[key] = new links.TreeGrid(document.getElementById($scope.treeGrid.grid + '-' + id), this.options.grid);

            this.grids[key].draw(this.store(id, data));

            links.events.addListener(this.grids[key], 'expand',
              function (properties)
              {
                console.log('expanding ->',key, properties);
              }
            );

            links.events.addListener(this.grids[key], 'collapse',
              function (properties)
              {
                console.log('collapsing ->',key, properties);
              }
            );

            links.events.addListener(this.grids[key], 'select',
              function (properties)
              {
                console.log('selecting ->',key, properties);
              }
            );

            links.events.addListener(this.grids[key], 'ready',
              function (properties)
              {
                console.log('READY ->',key, properties);
              }
            );
          },

          /**
           * Initialize a DataTable
           */
          store: function (id, data)
          {
            var key = $scope.treeGrid.grid + '-' + id;

            this.stores[key] = new links.DataTable(this.process(id, data), this.configure(id));

            var _this = this;

            switch (this.type)
            {
              case '1:1':

                this.stores[key].linkItems = function (sourceItems, targetItem, callback, errback)
                {
                  var index = this.data.indexOf(targetItem);

                  if (index == -1)
                  {
                    errback('Error: targetItem not found in data');
                    return;
                  }

                  var names = [];

                  for (var i = 0; i < sourceItems.length; i++)
                  {
                    names.push(sourceItems[i].name);
                  }

                  this.data[index] = {
                    'name':     targetItem.name,
                    'links':    names.join(', '),
                    '_actions': [{'event': 'remove', 'text': 'remove'}]
                  };

                  callback({
                    'items':      [targetItem],
                    'totalItems': this.data.length
                  });

                  this.update();
                };

                this.stores[key].removeLink = function (item)
                {
                  var index = this.data.indexOf(item);

                  if (index == -1)
                  {
                    throw Error('item not found in data');
                  }

                  this.data[index] = {
                    'name': item.name
                  };

                  this.update();
                };

                links.events.addListener(this.stores[key], 'remove',
                  function (event)
                  {
                    var items = event.items;

                    for (var i = 0; i < items.length; i++)
                    {
                      _this.stores[key].removeLink(items[i]);
                    }
                  }
                );

                break;


              case '1:n':
                if (id != 'left' && id != 'right')
                {
                  // console.log('this is a sub ->', id);

                  links.events.addListener(this.stores[key], 'unlinkMe', function ()
                    {
                      console.log('unlink me?');
                    }
                  );
                }
                break;
            }

            links.events.addListener(this.stores[key], 'change', function ()
              {
                console.log('key ->', key, 'changed ->', _this.stores[key]);
              }
            );

            return this.stores[key];
          },

          /**
           * Process data
           */
          process: function (id, data)
          {
            var key = $scope.treeGrid.grid + '-' + id;

            this.processed[key] = [];

            var _this = this;

            angular.forEach(data, function (node)
            {
              var record = {
                name: node.name,
                _id:  node.id
              };

              if (_this.type == '1:n' && id == 'right')
              {
                record.nodes = _this.store(
                  id + '-' + node.id,
                  [
//                    {
//                      id: 6,
//                      name: "Samantha Fox"
//                    }
                  ]
                );
              }

              if (_this.type == '1:n' && id != 'right')
              {
                record._actions = [
                  {
                    event: 'unlinkMe', text: 'remove'
                  }
                ];

                _this.triggers[key] = function ()
                {
                  console.log('remove triggered for =>', id, key);
                }
              }

//              if (_this.type == '1:n' && id == 'left')
//              {
//                console.log('left item ->', record);
//                delete record._actions;
//              }

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
          }
        };

        /**
         * TreeGrid manager listener
         */
        $rootScope.$on('TreeGridManager', function ()
        {
          $scope.treeGrid.grid = arguments[1];
          $scope.treeGrid.type = arguments[2];
          $scope.treeGrid.data = arguments[3];

          setTimeout(function ()
          {
            $scope.treeGrid.init();
          }, 100);
        });

        /**
         * Attach listener for window resizing
         */
        $window.onresize = function ()
        {
          $scope.treeGrid.init();
        };
      }
    ]);