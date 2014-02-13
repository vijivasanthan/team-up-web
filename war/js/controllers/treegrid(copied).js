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

          /**
           * Options
           */
          options: {
            grid: {
              width: 'auto',
              height: null,
              items: {
                minHeight: 40
              }
            },
            parts: {
              left:   {},
              right:  {}
            }
          },


          type: null,
          grid: null,
          data: {},
          processed: {
            left:  [],
            right: []
          },
          stores: {},
          grids: {
            left: {},
            right: {}
          },


          /**
           * Calculate height of available area
           */
          areas: function () { this.options.height = $('#wrap').height() - (270 + 200) + 'px' },


          /**
           * Build TreeGrid
           */
          build_: function (id, data, options)
          {
            // Initializer
            var TreeGrid  = new links.TreeGrid(id, this.options.grid),
                grid = new links.DataTable(data, options);

            // Draw TreeGrid
            TreeGrid.draw(grid);

            // Lets implement a simple link method
            grid.linkItems = function (sourceItems, targetItem, callback, errback)
            {
              var index = this.data.indexOf(targetItem);

              if (index == -1)
              {
                errback('Error: targetItem not found in data');
                return;
              }

              // DO something with the data
              // We replace the original targetItem in the data, else this
              // item will not be marked as changed by the DataTable
              var names = [];

              for (var i = 0; i < sourceItems.length; i++)
              {
                names.push(sourceItems[i].name);
              }

              this.data[index] = {
                'name': targetItem.name,
                'size': targetItem.size,
                'links': names.join(', '),
                '_actions': [{'event': 'remove', 'text': 'remove'}]
              };

              // send callback
              callback({
                'items': [targetItem],
                'totalItems': this.data.length
              });

              // send an update trigger
              this.update();
            };

            // Implement a method to remove a link from an item
            grid.removeLink = function (item)
            {
              // find the item in the data
              var index = this.data.indexOf(item);

              if (index == -1)
              {
                throw Error('item not found in data');
              }

              // replace the item in the dataTable, else this
              // item will not be marked as changed by the DataTable
              this.data[index] = {
                'name': item.name,
                'size': item.size
              };

              // send an update trigger
              this.update();
            };

            // Create an event listener for the remove event
            function onRemove (event)
            {
              var items = event.items;

              for (var i = 0; i < items.length; i++)
              {
                grid.removeLink(items[i]);
              }
            }

            // Add some listeners
            links.events.addListener(grid, 'remove', function (params)
            {
              // alert('params ->', params);
            });
            links.events.addListener(grid, 'change', function ()
            {
              console.log('changed stuff --->', grid);
            });
            links.events.addListener(grid, 'remove', onRemove);
          },


          /**
           * Initialize TreeGrid
           */
          init: function ()
          {
            // Determine and set height of TreeGrid containers
            this.areas();

            // Process data and build it accordingly

            this.build(document.getElementById(this.grid + '-right'));


            // Initializer
            this.grids.left = new links.TreeGrid(document.getElementById(this.grid + '-left'), this.options.grid);
            this.
              grid      = new links.DataTable(this.process(), options);

            // Draw TreeGrid
            TreeGrid.draw(grid);
          },


          /**
           * Store data
           */
          store: function (id, data)
          {
            var _this = this;

            this.stores[id] = new links.DataTable(data.content, data.options);

            // Lets implement a simple link method
            this.stores[id].linkItems = function (sourceItems, targetItem, callback, errback)
            {
              var index = this.data.indexOf(targetItem);

              if (index == -1)
              {
                errback('Error: targetItem not found in data');
                return;
              }

              // DO something with the data
              // We replace the original targetItem in the data, else this
              // item will not be marked as changed by the DataTable
              var names = [];

              for (var i = 0; i < sourceItems.length; i++)
              {
                names.push(sourceItems[i].name);
              }

              this.data[index] = {
                'name': targetItem.name,
                'size': targetItem.size,
                'links': names.join(', '),
                '_actions': [{'event': 'remove', 'text': 'remove'}]
              };

              // send callback
              callback({
                'items': [targetItem],
                'totalItems': this.data.length
              });

              // send an update trigger
              this.update();
            };

            // Implement a method to remove a link from an item
            this.stores[id].removeLink = function (item)
            {
              // find the item in the data
              var index = this.data.indexOf(item);

              if (index == -1)
              {
                throw Error('item not found in data');
              }

              // replace the item in the dataTable, else this
              // item will not be marked as changed by the DataTable
              this.data[index] = {
                'name': item.name,
                'size': item.size
              };

              // send an update trigger
              this.update();
            };

            // Create an event listener for the remove event
            function onRemove (event)
            {
              var items = event.items;

              for (var i = 0; i < items.length; i++)
              {
                grid.removeLink(items[i]);
              }
            }

            // Add some listeners
            links.events.addListener(this.stores[id], 'remove', function (params)
            {
              // alert('params ->', params);
            });
            links.events.addListener(this.stores[id], 'change', function ()
            {
              console.log('changed stuff --->', _this.stores[id]);
            });
            links.events.addListener(this.stores[id], 'remove', onRemove);

          },


          /**
           * Init TreeGrid
           */
          init_: function ()
          {
            var _this = this;

            // Calculate the height
            this.calcHeight();

            // Populate left side
            angular.forEach(this.data.left, function (left)
            {
              _this.processed.left.push({
                name: left.name,
                _id:  left._id,
//                _actions: [
//                  {
//                    'event': 'remove'
//                  }
//                ]
              });
            });

            // Populate right side
            angular.forEach(this.data.right, function (right)
            {
              _this.processed.right.push({
                name: 	  right.name,
//                clients: 	new links.DataTable([], {
//                  dataTransfer : {
//                    allowedEffect: 	'move',
//                    dropEffect: 		'move'
//                  }
//
//                }),
                _id: right.id
              });
            });

            // Data container
            var data = {
              // Left column
              left: {
                content: this.processed.left,
                options: {
                  columns: [
                    {
                      name: 'name', text: 'Name', title: 'Name'
                    }
                  ],
                  dataTransfer: {
                    allowedEffect: 	'link',
                    // dropEffect: 		'move'
                  }
                }
              },
              // Right column
              right: {
                content: this.processed.right,
                options: {
                  dataTransfer : {
                    // allowedEffect: 	'move',
                    dropEffect: 		'link'
                  }
                }
              }
            };

            // Build left part of TreeGrid
            this.build(
              document.getElementById(this.grid + '-left'),
              data.left.content,
              data.left.options
            );

            // Build right part of TreeGrid
            this.build(
              document.getElementById(this.grid + '-right'),
              data.right.content,
              data.right.options
            );
          },


          /**
           * Remove trigger
           */
          onRemove: function (params)
          {
            var item = (params && params.items) ? params.items[0] : undefined;

            if (item)
            {
              console.log('params ->', item._description);
            }
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

          // Draw TreeGrid
          setTimeout(function ()
          {
            $scope.treeGrid.init();
          }, 1);
        });


        /**
         * TODO (Cache current grid for not guessing it!!)
         * Attach listener for window resizing
         */
        $window.onresize = function ()
        {
          $scope.treeGrid.init();
        };
      }
    ]);





















































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

          /**
           * Options
           */
          options: {
            grid: {
              width: 'auto',
              height: null,
              items: {
                minHeight: 40
              }
            },
            parts: {
              left:   {},
              right:  {}
            }
          },


          type: null,
          grid: null,
          data: {},
          processed: {
            left:  [],
            right: []
          },
          stores: {},
          grids: {
            left: {},
            right: {}
          },


          /**
           * Calculate height of available area
           */
          areas: function () { this.options.height = $('#wrap').height() - (270 + 200) + 'px' },


          /**
           * Process data
           */
          process: function ()
          {
            var _this = this;

            switch (this.type)
            {
              case '1:1':

                angular.forEach(this.data.left, function (left)
                {
                  _this.processed.left.push({
                    name: left.name,
                    _id:  left._id
                  });
                });

                angular.forEach(this.data.right, function (right)
                {
                  _this.processed.right.push({
                    name: right.name,
                    _id:  right.id
                  });
                });

                this.options.left = {
                  columns: [
                    {
                      name: 'name', text: 'Name', title: 'Name'
                    }
                  ],
                  dataTransfer: {
                    allowedEffect: 	'link'
                  }
                };

                this.options.right = {
                  dataTransfer : {
                    dropEffect: 		'link'
                  }
                };

                break;

              case '1:n':

                angular.forEach(this.data.left, function (left)
                {
                  _this.processed.left.push({
                    name: left.name,
                    _id:  left._id
                  });
                });

                angular.forEach(this.data.right, function (right)
                {
                  _this.processed.right.push({
                    name: 	  right.name,
                    clients: 	new links.DataTable([], {
                      dataTransfer : {
                        allowedEffect: 	'copy',
                        dropEffect: 		'copy'
                      }
                    }),
                    _id: right.id
                  });
                });

                this.options.left = {
                  columns: [
                    {
                      name: 'name', text: 'Name', title: 'Name'
                    }
                  ],
                  dataTransfer: {
                    allowedEffect: 	'copy',
                    dropEffect: 		'copy'
                  }
                };

                this.options.right = {
                  dataTransfer : {
                    allowedEffect: 	'copy',
                    dropEffect: 		'copy'
                  }
                };

                break;
            }

          },



          init: function ()
          {
            this.process();

            this.createTreeGrid('left');
            this.createTreeGrid('right');
          },



          createTreeGrid: function (part)
          {
//            console.log('element ->', document.getElementById(this.grid + '-' + part));

            this.grids[part] = new links.TreeGrid(document.getElementById(this.grid + '-' + part), this.options.grid);

//            console.log('Created TreeGrid -->', this.grids[part]);

//            var _this = this;

//            setTimeout(function ()
//            {
            this.grids[part].draw(this.createDataStore(part, this.processed[part], this.options[part]));
//            }, 1000);

            console.log('stores ->', this.stores);
          },



          createDataStore: function (id, data, options)
          {
            console.log('passed data ->', id, data, options);

            var _this = this;

            this.stores[id] = new links.DataTable(data, options);

            return this.stores[id];

//            // Lets implement a simple link method
//            this.stores[id].linkItems = function (sourceItems, targetItem, callback, errback)
//            {
//              var index = this.data.indexOf(targetItem);
//
//              if (index == -1)
//              {
//                errback('Error: targetItem not found in data');
//                return;
//              }
//
//              // DO something with the data
//              // We replace the original targetItem in the data, else this
//              // item will not be marked as changed by the DataTable
//              var names = [];
//
//              for (var i = 0; i < sourceItems.length; i++)
//              {
//                names.push(sourceItems[i].name);
//              }
//
//              this.data[index] = {
//                'name': targetItem.name,
//                'size': targetItem.size,
//                'links': names.join(', '),
//                '_actions': [{'event': 'remove', 'text': 'remove'}]
//              };
//
//              // send callback
//              callback({
//                'items': [targetItem],
//                'totalItems': this.data.length
//              });
//
//              // send an update trigger
//              this.update();
//            };
//
//            // Implement a method to remove a link from an item
//            this.stores[id].removeLink = function (item)
//            {
//              // find the item in the data
//              var index = this.data.indexOf(item);
//
//              if (index == -1)
//              {
//                throw Error('item not found in data');
//              }
//
//              // replace the item in the dataTable, else this
//              // item will not be marked as changed by the DataTable
//              this.data[index] = {
//                'name': item.name,
//                'size': item.size
//              };
//
//              // send an update trigger
//              this.update();
//            };
//
//            // Create an event listener for the remove event
//            function onRemove (event)
//            {
//              var items = event.items;
//
//              for (var i = 0; i < items.length; i++)
//              {
//                grid.removeLink(items[i]);
//              }
//            }
//
//            // Add some listeners
//            links.events.addListener(this.stores[id], 'remove', function (params)
//            {
//              // alert('params ->', params);
//            });
//
//            links.events.addListener(this.stores[id], 'change', function ()
//            {
////              console.log('changed stuff --->', _this.stores[id]);
//            });

//            console.log('datastore ->', this.stores[id]);

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

          // Draw TreeGrid
//          setTimeout(function ()
//          {
          $scope.treeGrid.init();
//          }, 1);


          console.log('grid ->', $scope.treeGrid.grid);
          console.log('type ->', $scope.treeGrid.type);
          console.log('data ->', $scope.treeGrid.data);

        });


        /**
         * TODO (Cache current grid for not guessing it!!)
         * Attach listener for window resizing
         */
        $window.onresize = function ()
        {
          $scope.treeGrid.init();
        };
      }
    ]);




















//            /**
//             * Remove items
//             */
//            this.stores[key].removeItems = function (items, callback, errback)
//            {
//              console.log('removeItems stuff ->', items);
//
//              var num = items.length;
//
//              for (var i = 0; i < num; i++)
//              {
//                var index = this.data.indexOf(items[i]);
//
//                if (index != -1)
//                {
//                  this.data.splice(index, 1);
//                }
//                else
//                {
//                  errback("Cannot find item"); // TODO: better error
//                  return;
//                }
//              }
//
//              this.updateFilters();
//
//              if (callback)
//              {
//                callback({
//                  'totalItems': this.filteredData.length,
//                  'items': items
//                });
//              }
//
//              this.trigger('change', undefined);
//            };










$scope.processed = {
  left:  [],
  right: []
};

angular.forEach(this.data.left, function (left)
{
  $scope.processed.left.push({
    name: left.name,
    _id:  left._id,
    _actions: [
      {
        'event': 'remove'
      }
    ]
  });
});

angular.forEach(this.data.right, function (right)
{
  $scope.processed.right.push({
    name: 	  right.name,
    clients: 	new links.DataTable([], {
      showHeader: false,
      dataTransfer : {
        allowedEffect: 	'move',
        dropEffect: 		'move'
      }

    }),
    _id: right.id
  });
});

var data = {
  left: {
    content: $scope.processed.left,


    options: {
      showHeader: false,
      dataTransfer: {
        allowedEffect: 	'move',
        dropEffect: 		'move'
      }
    }


  },
  right: {
    content: $scope.processed.right,



    options: {
      showHeader: false,
      dataTransfer : {
        allowedEffect: 	'move',
        dropEffect: 		'move'
      }
    }



  }
};