
var path = require('path');
var util = require('util');
var changeCase = require('change-case');
var fs = require('fs');

var urlToResourceMapping = {
   "team":{ resource:"TeamResource", subpaths: { 
      "member": { resource:"TeamMemberResource" }, 
      "teamMessage": { resource:"TeamMessageResource", } 
   } },
   "tasks":{ resource:"TaskResource", subpaths: {} },
   "clientGroup":{ resource:"ClientGroupResource", subpaths: {} },
   "client":{ resource:"ClientResource", subpaths: {} },
   "clients":{ resource:"ClientsResource", subpaths: { "{clientUuid}": { subpaths: { "reports": { resource:"ClientReportResource" } } } } },
};

function readResourcesFromFile(filename) {
   console.log("Import started: readResourcesFromFile: " + filename);
   var wadl = require(filename);
   console.log(wadl);
   var foundResources = {};
   wadl.application.resources.resource.every(function(resource, index, array) {
      var resourcePath = resource['-path'];
      //console.log('Test: ' + resourcePath);
      var pathParts = resourcePath.split(path.sep);
      pathParts.shift();
      if(pathParts[pathParts.length - 1] == "")
         pathParts.pop();
      var foundResource = null;
	   var urlDepth = 0;
      Object.keys(urlToResourceMapping).forEach(function(key) {
        var mapping = urlToResourceMapping[key];
        //console.log(key + ' === ' + pathParts[0] + ' ? ' + (key === pathParts[0]));
         if(key === pathParts[0]) {
            Object.keys(mapping.subpaths).forEach(function(subKey) {
               var subMapping = mapping.subpaths[subKey];
               if(subMapping.subpaths) {
                  Object.keys(subMapping.subpaths).forEach(function(subSubKey) {
                     var subSubMapping = mapping.subpaths[subKey].subpaths[subSubKey];
                     if(subSubKey == pathParts[2]) {
                        foundResource = subSubMapping.resource;
                        urlDepth = 2;
                     }
                  });
               }
               if(!foundResource) {
                  //console.log(subKey + ' === ' + pathParts[1] + ' ? ' + (subKey === pathParts[1]));
                  if(subKey === pathParts[1]) {
                     foundResource = subMapping.resource;
                     urlDepth = 1;
                     //console.log(' Resource: ' + subMapping.resource);
                  }
               }
            });
            if(!foundResource) {
               foundResource = mapping.resource;
               //console.log(' Resource: ' + mapping.resource);
            }
         }
      });
      if(!foundResources[foundResource])
         foundResources[foundResource] = { actions:[], urlDepth:urlDepth, };
      var url = "";
      var newPathParts = [];
      pathParts.every(function(pathPart, index, array) {
         if(pathPart[0] == '{') {
            var parameterName = pathPart.substring(1, pathPart.length - 1);
            switch(parameterName) {
               case 'teamId':
               case 'team_uuid':
                  parameterName = 'teamUuid';
                  break;
               case 'member_uuid':
               case 'memberId':
                  parameterName = 'memberUuid';
                  break;
               case 'client_uuid':
               case 'clientId':
                  parameterName = 'clientUuid';
                  break;
               case 'reportId':
                  parameterName = 'reportUuid';
                  break;
               case 'task_uuid':
                  parameterName = 'taskUuid';
                  break;
               case 'media_uuid':
                  parameterName = 'mediaUuid';
                  break;
               case 'clientGroupId':
                  parameterName = 'clientGroupUuid';
                  break;
            }
            url += '/:' + parameterName;
            newPathParts.push('{' + parameterName + '}');
         }
         else {
            url += '/' + pathPart;
            newPathParts.push(pathPart);
         }
         return true;
      });
      pathParts = newPathParts;
      var methodName = resource.method['-name'];
      var actionName = actionNameForMethodAndPathParts(methodName, pathParts, urlDepth, foundResource);

      var action = { method:methodName, name:actionName, url:url, originalUrl:resourcePath };
      //console.log(action);
      foundResources[foundResource].actions.push(action);
      //console.log(resource.method['-name'] + ' ' + resourcePath + ': ' + foundResource);
      return true;
   });
   return foundResources;
};

function actionNameForMethodAndPathParts(methodName, pathParts, urlDepth, resourceName) {
   var name = 'unknown'
   if(pathParts.length == 1 + urlDepth && methodName == 'POST') {
      name = 'create';
   }
   else if(pathParts.length == 2 + urlDepth && pathParts[1 + urlDepth][0] == '{') {
      if(methodName == 'GET')
         name = 'get';
      else if(methodName == 'DELETE')
         name = 'delete';
      else if(methodName == 'PUT' || methodName == 'POST') {
         name = 'save';
      }
   }
   else if(pathParts.length == 3 + urlDepth && pathParts[1 + urlDepth][0] == '{') {
      if(pathParts[2 + urlDepth][0] != '{') {
         if(methodName == 'GET')
            name = 'get' + changeCase.ucFirst(pathParts[2 + urlDepth]);
         else if(methodName == 'POST' || methodName == 'PUT') {
            var secondPathPart = pathParts[2 + urlDepth];
            if(secondPathPart.indexOf("update") == 0 || secondPathPart.indexOf("remove") == 0 || secondPathPart.indexOf('unAssign') == 0)
               name = secondPathPart;
            else
               name = 'save' + changeCase.ucFirst(secondPathPart);	
         }
      }
      else if(pathParts[2 + urlDepth] == '{fieldName}') {
         if(methodName == 'GET')
            name = 'getField';
         else if(methodName == 'POST' || methodName == 'PUT')
            name = 'saveField';
      }
   }
   console.log((resourceName + '.' + name + "                              ").substr(0, 30) + " | " + ("      " + methodName).slice(-7) + "(" + urlDepth + ")" + ": " + pathParts.join('/'));
   return name;
}

function dumpResources(resources) {
   Object.keys(resources).forEach(function(key) {
      var resource = resources[key];
      console.log('Resource: ' + key);
      resource.actions.forEach(function(action, index, array) {
         console.log('  Action: ' + action.name);
         console.log('    method: ' + action.method);
         console.log('    url: ' + action.url);
         console.log('    originalUrl: ' + action.originalUrl);
      });
   });
}

function writeResourceJsonFiles(resources) {
   Object.keys(resources).forEach(function(resourceName) {
      var resource = resources[resourceName];
      var output = {
         actions: {}
      };
      var unknownCount = 0;
      for(var actionIndex = 0; actionIndex < resource.actions.length; actionIndex++) {
         var action = resource.actions[actionIndex];
         if(action.name == 'unknown')
            action.name = 'action' + unknownCount++;
         output.actions[action.name] = { url:action.url, method:action.method };
      }
      var filename = "../app/scripts/resources/" + resourceName + "Actions.json";
      var string = "";
      string += "// Don't edit this file manually\n";
      string += "// This file is generated from REST-wadl-json-import/generate.js\n";
      string += JSON.stringify(output, null, '\t');
      fs.writeFile(filename, string);
   });
}

var resources = readResourcesFromFile('./application.teamup.wadl.json');
//console.log(resources);
//dumpResources(resources);
//writeResourceJsonFiles(resources);
