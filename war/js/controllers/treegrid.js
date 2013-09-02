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
          stores:   {},

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
            new links.TreeGrid(document.getElementById($scope.treeGrid.grid + '-' + id), this.options.grid)
              .draw(this.store(id, data));
          },

          /**
           * Initialize a DataTable
           */
          store: function (id, data)
          {
            var key = $scope.treeGrid.grid + '-' + id;

            this.stores[key] = new links.DataTable(this.process(id, data), this.configure(id));

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

                var _this = this;

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

                break;
            }

            return this.stores[key];
          },

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
                record.nodes = _this.store($scope.treeGrid.grid + '-' + id + '-' + node.id, []);
              }

              _this.processed[key].push(record);
            });

            return this.processed[key];
          },

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