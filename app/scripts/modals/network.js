define(['services/services'], function (services) {
  'use strict';

  services.factory('Network', function ($rootScope, $resource, $q, Log, StandBy, Store) {
    var Network = $resource();

    var capitalize = function (string) {
      // string = string.toLowerCase();

      // return string.substring(0, 1).toUpperCase() + string.substring(1);
      return string;
    };

    var filter = function (result) {
      return result.resources.role > 0 && result.resources.role < 4;
    };

    Network.prototype.groups = function () {
      var deferred = $q.defer();

      try {
        StandBy._('groups').then(function (result) {
          _.each(result, function (group) {
            group.name = capitalize(group.name);
          });

          result = _.sortBy(result, 'name');

          Store('network').save('groups', result);

          deferred.resolve(result);
        });
      } catch (e) {
        Log.error('Something went wrong with network groups call:', e);
      }

      return deferred.promise;
    };

    Network.prototype.members = function (groupID) {
      var deferred = $q.defer();

      try {
        StandBy._('members', { second: groupID }).then(function (result) {
          Store('network').save('group.' + groupID, _.filter(result, filter));

          deferred.resolve(result);
        });
      } catch (e) {
        Log.error('Something went wrong with network group members call for:', groupID, e);
      }

      return deferred.promise;
    };

    Network.prototype.population = function () {
      var deferred = $q.defer(),
        queue = [],
        members = {},
        groups = Store('network').get('groups');

      try {
        _.each(groups, function (group) {
          queue.push(
            StandBy._('members', { second: group.uuid }).then(function (results) {
              Store('network').save('group.' + group.uuid, _.filter(results, filter));

              members[group.uuid] = results;
            }));
        });

        $q.all(queue).then(function () {
            var unique = function (bulks) {
              var basket = [];

              _.each(bulks, function (members) {
                if (members.length > 0) {
                  _.each(members, function (member) {
                    basket.push(member);
                  });
                }
              });

              return _.indexBy(_.filter(
                _.map(_.indexBy(basket, function (node) {
                    return node.uuid;
                  }),
                  function (member) {
                    return member;
                  }
                ),
                filter
              ), function (member) {
                return member.uuid;
              });
            };

            Store('network').save('population', members);
            Store('network').save('unique', unique(members));

            deferred.resolve(members);
          }.bind(members)
        );
      } catch (e) {
        Log.error('Something went wrong with network group members population call:', e);
      }

      return deferred.promise;
    };

    return new Network();
  });
});