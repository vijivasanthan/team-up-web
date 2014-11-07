define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('Groups', function ($resource, $q, $rootScope, Slots, $location, Strings, Store) {
    var Groups = $resource(
        config.host + '/network/:action/:id',
      {},
      {
        query: {
          method: 'GET',
          params: {},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {id: ''}
        },
        save: {
          method: 'POST',
          params: {id: ''},
          isArray: true
        },
        edit: {
          method: 'PUT',
          params: {id: ''}
        },
        remove: {
          method: 'DELETE',
          params: {id: ''},
          isArray: true
        },
        search: {
          method: 'POST',
          params: {id: '', action: 'searchPaigeUser', fields: 'role'},
          isArray: true
        }
      }
    );


    var Containers = $resource(
        config.host + '/node/:id/container',
      {},
      {
        get: {
          method: 'GET',
          params: {id: ''},
          isArray: true
        }
      }
    );


    var Parents = $resource(
        config.host + '/parent',
      {},
      {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }
      }
    );


    var Members = $resource(
        config.host + '/network/:id/members/:mid',
      {},
      {
        query: {
          method: 'GET',
          params: {id: '', fields: '[role, settingsWebPaige, PhoneAddresses]'},
          isArray: true
        },
        get: {
          method: 'GET',
          params: {id: ''}
        },
        save: {
          method: 'POST',
          params: {}
        },
        add: {
          method: 'POST',
          params: {id: '', mid: ''}
        },
        remove: {
          method: 'DELETE',
          params: {id: '', mid: ''}
        }
      }
    );


    /**
     * Smart Alarming
     */
    var Guards = $resource(
        config.host + '/network/guard/:id/:team',
      {},
      {
        global: {
          method: 'GET',
          isArray: true
        },
        position: {
          method: 'GET',
          params: {id: '', team: ''}
        }
      }
    );


    /**
     * Get current smart alarming guard data
     */
    Groups.prototype.guardMonitor = function () {
      var deferred = $q.defer();

      var guard = Store('smartAlarm').get('guard') || {};

      Guards.global(
        null,
        function (result) {
          var returned = '';

          angular.forEach(
            result[0],
            function (chr) {
              returned += chr
            }
          );

          guard.monitor = returned;

          Store('smartAlarm').save('guard', guard);

          $rootScope.StandBy.guard.monitor = returned;

          deferred.resolve(returned);
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * Get guard role for smart alarming
     */
    Groups.prototype.guardRole = function () {
      var deferred = $q.defer(),
        _this = this;

      _this.guard = Store('smartAlarm').get('guard');

      Guards.position(
        {
          id: _this.guard.monitor,
          team: 'status'
        },
        function (results) {
          var members = _.indexBy(Store('network').get('unique'), function (mem) {
            return mem.uuid
          });

          _this.guard.synced = new Date().getTime();

          _this.guard.users = {};

          angular.forEach(
            results.station,
            function (user) {
              var _member;

              if (user[0] != 'agent' || user[1] != 'state') {
                _member = {
                  name: (members && members[user[0]] && members[user[0]].name) || user[0],
                  state: user[1]
                };

                if (members[user[0]]) {
                  _member.role = members[user[0]].resources.role;
                }
                else {
                  _member.role = '0';
                }

                _this.guard.users[user[0]] = _member;
              }
            }
          );

          _this.guard.truck = [];

          _this.guard.selection = {};

          angular.forEach(
            results.selection,
            function (selected, id) {
              _this.guard.selection[id] = { user: selected.agentID };

              if (selected.agentID != null) {
                _this.guard.truck.push(selected.agentID);
              }

              if ($location.path() != '/tv') {
                if (selected.agentID == $rootScope.StandBy.resources.uuid) {
                  _this.guard.role = results.map[id].name;
                }
              }
            }
          );

          angular.forEach(
            results.map,
            function (mapped, id) {
              _this.guard.selection[id].role = mapped.name;
            }
          );

          _this.guard.reserves = {
            available: [],
            unavailable: [],
            noplanning: []
          };

          angular.forEach(
            _this.guard.users,
            function (user, id) {
              if (_this.guard.truck.indexOf(id) == -1) {
                var obj = {};
                obj[id] = user;

                _this.guard.reserves[user.state].push(obj);
              }
            }
          );

          Store('smartAlarm').save('guard', _this.guard);

          deferred.resolve(_this.guard);
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * Get parent group data
     */
    Groups.prototype.parents = function (all) {
      var deferred = $q.defer();

      Parents.get(
        null,
        function (result) {
          if (!all) {
            if (result.length == 0) {
              deferred.resolve(null);
            }
            else {
              deferred.resolve(result[0].uuid);
            }
          }
          else {
            deferred.resolve(result);
          }
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * TODO: (Extract only the groups which are in the local list)
     * Get container (parent) group data
     */
    Groups.prototype.containers = function (id) {
      var deferred = $q.defer(),
        cons = [];

      Containers.get(
        { id: id },
        function (result) {
          /**
           * Group save call returns only uuid and that is parsed as json
           * by angular, this is a fix for converting returned object to plain string
           */
          angular.forEach(
            result,
            function (_r) {
              var returned = [];

              angular.forEach(_r, function (chr) {
                returned += chr
              });

              cons.push(returned);
            }
          );

          deferred.resolve(cons);
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * Add Member to a group
     */
    Groups.prototype.addMember = function (candidate) {
      var deferred = $q.defer();

      Members.add(
        {
          id: candidate.group.uuid,
          mid: candidate.id
        },
        {},
        function (result) {
          deferred.resolve(result);
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * Remove member from group
     */
    Groups.prototype.removeMember = function (memberId, groupId) {
      var deferred = $q.defer();

      Members.remove(
        {
          id: groupId,
          mid: memberId
        },
        function (result) {
          deferred.resolve(result);
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * Remove members from a group (bulk action)
     */
    Groups.prototype.removeMembers = function (selection, group) {
      var deferred = $q.defer(),
        calls = [];

      angular.forEach(
        selection,
        function (value, id) {
          if (value) {
            calls.push(Groups.prototype.removeMember(id, group.uuid));
          }
        }
      );

      $q.all(calls)
        .then(
        function (result) {
          deferred.resolve(result)
        }
      );

      return deferred.promise;
    };


    Groups.prototype.wish = function (id) {
      var deferred = $q.defer(),
        count = 0;

      Slots.wishes(
        {
          id: id,
          start: 255600,
          end: 860400
        }).then(
        function (results) {
          angular.forEach(
            results,
            function (slot) {
              if (slot.start == 255600 &&
                slot.end == 860400 &&
                slot.count != null) {
                count = slot.count;
              }
            }
          );

          deferred.resolve({ count: count });
        }
      );

      return deferred.promise;
    };


    /**
     * General query function from groups and their members
     */
    Groups.prototype.query = function (only) {
      var deferred = $q.defer();

      Groups.query(
        function (groups) {
          // angular.forEach(
          //   groups,
          //   function (group) {
          //     group.name = Strings.toTitleCase(group.name)
          //   }
          // );

          Store('network').save('groups', groups);

          if (!only) {
            var calls = [];

            angular.forEach(
              groups,
              function (group) {
                calls.push(Groups.prototype.get(group.uuid))
              }
            );

            //              calls.push(Groups.prototype.get('all'));

            $q.all(calls)
              .then(
              function (results) {
                Groups.prototype.uniqueMembers();

                var data = {};

                data.members = {};

                angular.forEach(
                  groups,
                  function (group) {
                    data.groups = groups;

                    data.members[group.uuid] = [];

                    angular.forEach(
                      results,
                      function (result) {
                        if (result.id == group.uuid) {
                          data.members[group.uuid] = result.data;
                        }
                      }
                    );
                  }
                );

                deferred.resolve(data);
              }
            );
          }
          else {
            deferred.resolve(groups);
          }
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * Get group data
     */
    Groups.prototype.get = function (id) {
      var deferred = $q.defer();

      Members.query(
        { id: id },
        function (result) {
          /**
           * DIRTY CHECK!
           *
           * Check for 'null' return from back-end
           * if group is empty
           */
          var returned;

          if (result.length == 4 &&
            result[0][0] == 'n' &&
            result[1][0] == 'u') {
            returned = [];
          }
          else {
            returned = result;
          }

          Store('network').save('group'.id, returned);

          deferred.resolve(
            {
              id: id,
              data: returned
            }
          );
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * Make an unique list of members
     */
    Groups.prototype.uniqueMembers = function () {

      angular.forEach(
        Store('network').get('groups'),
        function (group) {
          var members = Store('network').get('unique') || {};

          angular.forEach(
            Store('network').get('group.'+group.uuid),
            function (member) {
              if (member.resources && member.resources.role != 0 && member.resources.role != 4) {
                members[member.uuid] = member;
              }
            }
          );

          // $rootScope.app.members = members;

          Store('network').save('unique', members);
        }
      );
    };


    /**
     * Save group
     */
    Groups.prototype.save = function (group) {
      var deferred = $q.defer();

      /**
       * Check if group id supplied
       * if save submitted from add / edit form
       */
      if (group.id) {
        Groups.edit(
          { id: group.id },
          { name: group.name },
          function () {
            deferred.resolve(group.id);
          }
        );
      }
      else {
        Groups.save(
          { id: $rootScope.StandBy.resources.uuid },
          group,
          function (result) {
            /**
             * Group save call returns only uuid and that is parsed as json
             * by angular, this is a fix for converting returned object to plain string
             *
             * Added: 22 Jun 2014
             * Strip $promise and $resolved objects from response as well, since new version
             * of Angular does not unwrap promises.
             */
            var returned = '';

            angular.forEach(
              result[0],
              function (chr) {
                if (chr.length == 1 && !angular.isObject(chr)) {
                  returned += chr;
                }
              }
            );

            deferred.resolve(returned);
          },
          function (error) {
            deferred.resolve({error: error});
          }
        );
      }

      return deferred.promise;
    };


    /**
     * Delete group
     */
    Groups.prototype.remove = function (id) {
      var deferred = $q.defer();

      Groups.remove(
        { id: id },
        function (result) {
          deferred.resolve(result);
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * Search candidate members
     */
    Groups.prototype.search = function (query) {
      var deferred = $q.defer();

      Groups.search(
        null,
        { key: query },
        function (results) {
          var processed = [];

          results.sort(
            function (a, b) {
              var aName = a.name.toLowerCase();
              var bName = b.name.toLowerCase();
              if (aName < bName) return -1;
              if (aName > bName) return 1;
              return 0;
            }
          );

          angular.forEach(
            results,
            function (result) {
              processed.push(
                {
                  id: result.id,
                  name: result.name,
                  fields: result.fields,
                  groups: Groups.prototype.getMemberGroups(result.id)
                }
              );
            }
          );

          deferred.resolve(processed);
        },
        function (error) {
          deferred.resolve({error: error});
        }
      );

      return deferred.promise;
    };


    /**
     * Get groups of given member
     */
    Groups.prototype.getMemberGroups = function (id) {
      var groups = Store('network').get('groups'),
        memberGroups = [];

      angular.forEach(
        groups,
        function (group) {
          var localGroup = Store('network').get('group.'+group.uuid);

          angular.forEach(
            localGroup,
            function (member) {
              if (member.uuid === id) {
                memberGroups.push(
                  {
                    uuid: group.uuid,
                    name: group.name
                  }
                );
              }
            }
          );
        }
      );

      return memberGroups;
    };


    return new Groups;
  });
});