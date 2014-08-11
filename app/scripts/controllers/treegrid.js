define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'treegrid',
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
            data: {},
            processed: {},
            grids: {},
            stores: {},
            caches: {},
            connections: {},

            areas: function ()
            {
              this.options.grid.height = angular.element('#wrap').height() - (270 + 200) + 'px'
            },

            build: function (id, data)
            {
              var _this = this,
                  key = $scope.treeGrid.grid + '_' + id;

              this.grids[key] = new links.TreeGrid(
                document.getElementById($scope.treeGrid.grid + '_' + id),
                this.options.grid
              );

              // console.log('this stores ->', this.stores);

              angular.forEach(
                this.stores,
                function (store)
                {
                  var filtered = [];

                  angular.forEach(
                    store.data,
                    function (node) { node._id && filtered.push(node) }
                  );

                  store.data = store.filteredData = filtered;
                }
              );

              // console.log('store.data ->', this.store.data);

              this.grids[key].draw(this.store(id, data));

              links.events.addListener(
                this.grids[key],
                'expand',
                function (properties) { console.log('expanding ->', key, properties) }
              );

              links.events.addListener(
                this.grids[key],
                'collapse',
                function (properties) { console.log('collapsing ->', key, properties) }
              );

              links.events.addListener(
                this.grids[key],
                'select',
                function (properties) { console.log('selecting ->', key, properties) }
              );

              links.events.addListener(
                this.grids[key],
                'remove',
                function (event)
                {
                  var items = event.items;

                  for (var i = 0; i < items.length; i ++)
                  {
                    _this.stores[key].removeLink(items[i]);
                  }
                }
              );
            },

            store: function (id, data)
            {
              var _this = this,
                  key = $scope.treeGrid.grid + '_' + id;

              this.stores[key] = new links.DataTable(
                this.process(id, data),
                this.configure(id)
              );

              this.stores[key].totalItems = this.stores[key].data.length;

              this.stores[key].appendItems = function (items, callback)
              {
                function isUnique (item, data)
                {
                  var result = true;

                  for (var i = 0; i < data.length; i ++)
                  {
                    if (item._id == data[i]._id) result = false;
                  }

                  if (item.nodes)
                  {
                    result = false
                  }

                  return result;
                }

                for (var i = 0; i < items.length; i ++)
                {
                  var unique = isUnique(items[i], this.data);

                  if (unique)
                  {
                    items[i]._actions = [
                      {
                        event: 'remove',
                        text: 'remove'
                      }
                    ];

                    this.data.push(items[i]);
                  }
                }

                if (unique)
                {
                  this.updateFilters();

                  if (callback)
                  {
                    callback(
                      {
                        'totalItems': this.filteredData.length,
                        'items': items
                      }
                    );
                  }

                  this.trigger('change', undefined);
                }
              };

              this.stores[key].linkItems = function (sourceItems, targetItem, callback, errback)
              {
                var index = this.data.indexOf(targetItem);

                if (index == - 1)
                {
                  errback('Error: targetItem not found in data');

                  return;
                }

                var names = [],
                    ids = [];

                for (var i = 0; i < sourceItems.length; i ++)
                {
                  names.push(sourceItems[i].name);
                  ids.push(sourceItems[i]._id);
                }

                this.data[index] = {
                  '_id': targetItem._id,
                  'name': targetItem.name,
                  'links': names.join(', '),
                  '_ids': ids.join(', '),
                  '_actions': [
                    {
                      'event': 'unlink',
                      'text': 'unlink'
                    }
                  ]
                };

                callback(
                  {
                    'items': [targetItem],
                    'totalItems': this.data.length
                  }
                );

                this.update();
              };

              this.stores[key].unlink = function (item)
              {
                var index = this.data.indexOf(item);

                if (index == - 1)
                {
                  throw Error('item not found in data');
                }

                this.data[index] = {
                  _id: item._id,
                  name: item.name
                };

                this.update();
              };

              this.stores[key].removeLink = function (item)
              {
                var filtered = [];

                angular.forEach(
                  _this.stores[item._parent].data,
                  function (data) { (data._id != item._id) && filtered.push(data) }
                );

                _this.stores[item._parent].data = _this.stores[item._parent].filteredData = filtered;

                this.updateFilters();

                this.trigger('change', undefined);

                var processed = [],
                    pieces = item._parent.split('_'),
                    section = pieces[0],
                    last = pieces[pieces.length - 1];

                angular.forEach(
                  _this.connections[section][last],
                  function (connection)
                  {
                    if (connection._id != item._id)
                    {
                      connection._actions = [
                        {
                          event: 'remove',
                          text: 'remove'
                        }
                      ];

                      processed.push(connection);
                    }
                  }
                );

                _this.connections[section][last] = _this.caches[item._parent] = processed;

                this.update();
              };

              links.events.addListener(
                this.stores[key],
                'change',
                function ()
                {
                  angular.forEach(
                    _this.stores[key].data,
                    function (data) { data._parent = key }
                  );

                  _this.caches[key] = _this.stores[key].data;
                }
              );

              links.events.addListener(
                this.stores[key],
                'unlink',
                function (event)
                {
                  var items = event.items;

                  for (var i = 0; i < items.length; i ++)
                  {
                    _this.stores[key].unlink(items[i]);
                  }
                }
              );

              if ($scope.treeGrid.grid == 'teamClients' && id == 'right')
              {
                if (this.connections.teamClients.length > 0)
                {
                  angular.forEach(
                    this.connections.teamClients,
                    function (connection)
                    {
                      var index;

                      angular.forEach(
                        _this.stores['teamClients_right'].data,
                        function (data, ind)
                        {
                          if (connection.targetItem.id == data._id)
                          {
                            index = ind;

                            var names = [],
                                ids = [];

                            for (var i = 0; i < connection.sourceItems.length; i ++)
                            {
                              names.push(connection.sourceItems[i].name);
                              ids.push(connection.sourceItems[i].id);
                            }

                            _this.stores['teamClients_right'].data[index] = {
                              '_id': connection.targetItem.id,
                              'name': connection.targetItem.name,
                              'links': names.join(', '),
                              '_ids': ids.join(', '),
                              '_actions': [
                                {
                                  'event': 'unlink',
                                  'text': 'unlink'
                                }
                              ]
                            };

                            _this.stores['teamClients_right'].update();
                          }
                        }
                      );
                    }
                  );
                }
              }

              return this.stores[key];
            },

            process: function (id, data)
            {
              var _this = this,
                  filtered = [],
                  key = $scope.treeGrid.grid + '_' + id;

              angular.forEach(
                data,
                function (node) { (node.id) && filtered.push(node) }
              );

              this.processed[key] = [];

              angular.forEach(
                filtered,
                function (node)
                {
                  var fid = _this.grid + '_' + id + '_' + node.id;

                  var record = {
                    name: node.name,
                    _id: node.id,
                    _parent: fid
                  };

                  if (_this.type == '1:n' && id == 'right')
                  {
                    if (_this.grid == 'teams' &&
                        _this.connections.teams[node.id] &&
                        _this.connections.teams[node.id].length > 0)
                    {
                      setTimeout(
                        function ()
                        {
                          _this.stores[fid].appendItems(
                            _this.connections.teams[node.id],
                            function (results) { _this.stores[fid].totalItems = results.totalItems }
                          );
                        }, 100);
                    }

                    if (_this.grid == 'clients' &&
                        _this.connections.clients[node.id] &&
                        _this.connections.clients[node.id].length > 0)
                    {
                      setTimeout(
                        function ()
                        {
                          _this.stores[fid].appendItems(
                            _this.connections.clients[node.id],
                            function (results) { _this.stores[fid].totalItems = results.totalItems }
                          );
                        }, 100);
                    }

                    var data = ( _this.caches[fid]) ? _this.caches[fid] : [];

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

            configure: function (id)
            {
              var options = {
                showHeader: false,
                dataTransfer: {}
              };

              switch (this.type)
              {
                case '1:1':

                  switch (id)
                  {
                    case 'left':
                      options.dataTransfer = {
                        allowedEffect: 'link'
                      };
                      break;

                    case 'right':
                      options.dataTransfer = {
                        dropEffect: 'link'
                      };
                      break;
                  }

                  break;

                case '1:n':
                  options.dataTransfer = {
                    allowedEffect: 'copy',
                    dropEffect: 'copy'
                  };
                  break;
              }

              return options;
            },

            init: function ()
            {
              this.areas();
              this.build('left', this.data.left);
              this.build('right', this.data.right);
            }
          };

          $rootScope.$on(
            'TreeGridManager',
            function ()
            {
              $scope.treeGrid.grid = arguments[1];
              $scope.treeGrid.type = arguments[2];
              $scope.treeGrid.data = arguments[3];
              $scope.treeGrid.connections = arguments[4];

              (function ($scope)
              {
                setTimeout(
                  function () { $scope.treeGrid.init() }, 100
                )
              })($scope);
            }
          );

          $window.onresize = function () { $scope.treeGrid.init() };

          $scope.extract = function (sources)
          {
            var connections = {};

            angular.forEach(
              sources,
              function (source)
              {
                if (source.nodes.data.length > 0)
                {
                  var nodes = [];

                  angular.forEach(
                    source.nodes.data,
                    function (node) { nodes.push(node._id) }
                  );

                  connections[source._id] = nodes;
                }
              }
            );

            return connections;
          };

          $scope.save = {
            teamClients: function ()
            {
              var data = $scope.treeGrid.stores['teamClients_right'].data,
                  connections = {};

              angular.forEach(
                data,
                function (node)
                {
                  if (node._ids || node.links)
                  {
                    connections[node._id] = node._ids;
                  }
                }
              );

              $rootScope.$broadcast('save:teamClients', connections);
            },

            teams: function ()
            {
              $rootScope.$broadcast(
                'save:teams',
                $scope.extract($scope.treeGrid.stores['teams_right'].data)
              );
            },

            clients: function ()
            {
              $rootScope.$broadcast(
                'save:clients',
                $scope.extract($scope.treeGrid.stores['clients_right'].data)
              );
            }
          };

          $scope.getData = {
            teamClients: function ()
            {
              var data = $scope.treeGrid.stores['teamClients_right'].data,
                  connections = {};

              angular.forEach(
                data,
                function (node)
                {
                  if (node._ids || node.links)
                  {
                    connections[node._id] = node._ids;
                  }
                }
              );

              return connections;
            },

            teams: function () { return $scope.extract($scope.treeGrid.stores['teams_right'].data) },

            clients: function () { return $scope.extract($scope.treeGrid.stores['clients_right'].data) }
          };
        }
      ]
    );
  }
);