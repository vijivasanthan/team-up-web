/*jslint node: true */
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

          data:     {},
          processed:{},
          grids:    {},
          stores:   {},

          caches:   {},

          expanded: [],

          connections: {},


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
            var _this = this;

            var key = $scope.treeGrid.grid + '-' + id;

            this.grids[key] = new links.TreeGrid(document.getElementById($scope.treeGrid.grid + '-' + id), this.options.grid);

//            this.grids[key].Grid.expandedItems.push(this.grids['TeamClients-right']);
//
//            if (this.expanded.length > 0)
//            {
//              angular.forEach(this.expanded, function (exid)
//              {
//                _this.grids[key].__proto__.constructor.Grid.expandedItems.push(_this.grids[exid]);
//              });
//            }
//
//            console.log('GRID -->', this.grids[key].__proto__.constructor.Grid.expandedItems);
//
//            console.warn('treeGrid ->', $scope.treeGrid);

            this.grids[key].draw(this.store(id, data));


            /**
             * Expand listener
             */
            links.events.addListener(this.grids[key], 'expand',
              function (properties)
              {
                _this.expanded.push(key + '-' + properties.items[0]._id);
              }
            );


            /**
             * Collapse listener
             */
            links.events.addListener(this.grids[key], 'collapse',
              function (properties)
              {
                var expandeds = [],
                    collapsed = key + '-' + properties.items[0]._id;

                angular.forEach($scope.treeGrid.expanded, function (expanded)
                {
                  if (expanded != collapsed)
                  {
                    expandeds.push(expanded);
                  }
                });

                $scope.treeGrid.expanded = expandeds;
              }
            );


            /**
             * Select listener
             */
            links.events.addListener(this.grids[key], 'select',
              function (properties)
              {
                console.log('selecting ->', key, properties);
              }
            );


            /**
             * Ready listener
             */
            links.events.addListener(this.grids[key], 'ready',
              function (properties)
              {
                console.log('READY ->', key, properties);
              }
            );


            /**
             * Remove listener
             */
            links.events.addListener(this.grids[key], 'remove',
              function (event)
              {
                alert('id -> ' + id +
                      '\n\n' +
                      ' key ->' + key +
                      '\n\n' +
                      ' event ->' + angular.toJson(event)
                );

                var items = event.items;

                for (var i = 0; i < items.length; i++)
                {
                  _this.stores[key].removeLink(items[i]);
                  // _this.stores[key].removeItems(items[i]);
                }
              }
            );
          },


          /**
           * Initialize a DataTable
           */
          store: function (id, data)
          {
            var key = $scope.treeGrid.grid + '-' + id;

            var _this = this;

            this.stores[key] = new links.DataTable(this.process(id, data), this.configure(id));


            /**
             * Append items
             */
            this.stores[key].appendItems = function (items, callback, errback)
            {
              var num = items.length;

              for (var i = 0; i < num; i++)
              {
                this.data.push(items[i]);
              }

              this.updateFilters();

              callback({
                'totalItems': this.filteredData.length,
                'items': items
              });

              this.trigger('change', undefined);
            };


            /**
             * Link items
             */
            this.stores[key].linkItems = function (sourceItems, targetItem, callback, errback)
            {
//              console.log('sourceItems ->', sourceItems,
//                          'targetItem ->', targetItem,
//                          'callback ->', callback,
//                          'errback ->', errback);

              var index = this.data.indexOf(targetItem);

//              console.log('data ->', this.data);

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
             * (Custom) unlink items
             */
            this.stores[key].unlink = function (item)
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


            /**
             * Remove items
             */
            this.stores[key].removeItems = function (items, callback, errback)
            {
              console.log('removing stuff ->');

              var num = items.length;

              for (var i = 0; i < num; i++)
              {
                var index = this.data.indexOf(items[i]);

                if (index != -1)
                {
                  this.data.splice(index, 1);
                }
                else
                {
                  errback("Cannot find item"); // TODO: better error
                  return;
                }
              }

              this.updateFilters();

              if (callback)
              {
                callback({
                  'totalItems': this.filteredData.length,
                  'items': items
                });
              }

              this.trigger('change', undefined);
            };


            /**
             * (Custom) remove links
             */
            this.stores[key].removeLink = function (item)
            {
              console.log('removing for ->', item);

              var index = _this.stores[item._parent].data.indexOf(item);

              if (index == -1)
              {
                throw Error('item not found in data');
              }

              delete _this.stores[item._parent].data[index];

              // this.updateFilters();

              // this.trigger('change', undefined);

              // this.update();

              _this.build('right', _this.data.right);
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

                  angular.forEach(_this.stores['teamClients-right'].data, function (data, ind)
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

                      _this.stores['teamClients-right'].data[index] = {
                        '_id':      connection.targetItem.id,
                        'name':     connection.targetItem.name,
                        'links':    names.join(', '),
                        '_ids':     ids.join(', '),
                        '_actions': [{'event': 'unlink', 'text': 'unlink'}]
                      };

                      _this.stores['teamClients-right'].update();
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
            var key = $scope.treeGrid.grid + '-' + id;

            this.processed[key] = [];

            var _this = this;

            angular.forEach(data, function (node)
            {
              var record = {
                name:     node.name,
                _id:      node.id,
                _parent:  id
              };

//              if (id != 'left' && id != 'right')
//              {
//                record._parent = id;
//              }

              if (_this.type == '1:n' && id == 'right')
              {
                var fid = _this.grid + '-' + id + '-' + node.id;

                var connections = [],
                    cons        = [];

                if (_this.grid == 'teams' &&
                    _this.connections.teams[node.id] &&
                    _this.connections.teams[node.id].length > 0)
                {
                  angular.forEach(_this.connections.teams[node.id], function (con)
                  {
                    con._parent = 'teams-' + id + '-' + node.id;

                    cons.push(con);
                  });

                  connections = cons;
                }

                if (_this.grid == 'clients' &&
                    _this.connections.clients[node.id] &&
                    _this.connections.clients[node.id].length > 0)
                {
                  angular.forEach(_this.connections.clients[node.id], function (con)
                  {
                    con._parent = 'clients-' + id + '-' + node.id;

                    cons.push(con);
                  });

                  connections = cons;
                }

                var data = (_this.caches[fid]) ? _this.caches[fid] : connections;

                record.nodes = _this.store(
                  id + '-' + node.id,
                  data
                );

                record.name += ' (' + data.length + ')';
              }

              if (_this.type == '1:n' && id != 'right')
              {
                record._actions = [
                  {
                    event:  'remove',
                    text:   'remove'
                  }
                ];
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

            setTimeout(function ()
            {
              console.log('treeGrid ->', $scope.treeGrid);
            }, 1000);
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
          $scope.treeGrid.connections = arguments[4];

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


        /**
         * Save treeGrid
         */
        $scope.save = {

          teamClients: function ()
          {
            var data        = $scope.treeGrid.stores['teamClients-right'].data,
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

          teams: function ()
          {
            $rootScope.$broadcast('save:teams', this.extract($scope.treeGrid.stores['teams-right'].data));
          },

          clients: function ()
          {
            $rootScope.$broadcast('save:clients', this.extract($scope.treeGrid.stores['clients-right'].data));
          }

        };
      }
    ]);