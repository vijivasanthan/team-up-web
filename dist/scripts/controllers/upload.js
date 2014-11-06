define(
  ['controllers/controllers'],
  function (controllers)
  {
    

    controllers.controller(
      'uploadCtrl', [
        '$rootScope',
        '$scope',
        '$q',
        '$location',
        'Clients',
        '$route',
        '$routeParams',
        'Store',
        'Dater',
        '$filter',
        '$modal',
        'TeamUp',
        '$timeout',
        function ($rootScope, $scope, $q, $location, Clients, $route, $routeParams, Store, Dater, $filter, $modal, TeamUp, $timeout)
        {
          $scope.step = 'SelectFile';
          $scope.workbook = {};
          $scope.tuSheet = {};
          $scope.matchedTeamMembersByName = {};
          $scope.matchedClientsByName = {};
          $scope.taskCreateErrors = [];

          var currentTeam = $rootScope.app.resources.teamUuids[0],
            tasksSheet = [];

          $scope.handleFile = function (files)
          {
            handleFiles(files);
          }

          $scope.handleDragover = function (evnt)
          {
            evnt.stopPropagation();
            evnt.preventDefault();
            //console.log("Dragover: " + files);
            //angular.element('#drop').addClass('sheetEntering');
            evnt.dataTransfer.dropEffect = 'copy';
          }

          $scope.handleDragenter = function (evnt)
          {
            evnt.stopPropagation();
            evnt.preventDefault();
            //console.log("Dragenter: " + files);
            evnt.dataTransfer.dropEffect = 'copy';
          }

          $scope.handleDrop = function (evnt)
          {
            evnt.stopPropagation();
            evnt.preventDefault();
            //console.log("Drop: " + files);
            var files = evnt.dataTransfer.files;
            handleFiles(files);
          }

          var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
          if (!rABS)
          {
            document.getElementsByName("userabs")[0].disabled = true;
            document.getElementsByName("userabs")[0].checked = false;
          }

          var use_worker = typeof Worker !== 'undefined';
          if (!use_worker)
          {
            document.getElementsByName("useworker")[0].disabled = true;
            document.getElementsByName("useworker")[0].checked = false;
          }

          var transferable = use_worker;
          if (!transferable)
          {
            document.getElementsByName("xferable")[0].disabled = true;
            document.getElementsByName("xferable")[0].checked = false;
          }

          var wtf_mode = false;

          function handleFiles(files)
          {
            rABS = document.getElementsByName("userabs")[0].checked;

            // use_worker = document.getElementsByName("useworker")[0].checked;
            use_worker = false;

            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i)
            {
              var reader = new FileReader(),
                name = f.name;

              reader.onload = function (e)
              {
                if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);

                var data = e.target.result;

                if (use_worker)
                {
                  xlsxworker(data, process_wb);
                }
                else
                {
                  var wb;

                  if (rABS)
                  {
                    wb = XLSX.read(data, {
                      type: 'binary'
                    });
                  }
                  else
                  {
                    var arr = fixdata(data);
                    wb = XLSX.read(btoa(arr), {
                      type: 'base64'
                    });
                  }
                  process_wb(wb);
                  $scope.$apply();
                }
              };
              if (rABS)
              {
                reader.readAsBinaryString(f);
              }
              else
              {
                reader.readAsArrayBuffer(f);
              }
              $scope.step = "ProcessFile";
              addBreadcrumb('Bestand verwerken', 'file');
              $scope.$apply();
            }
          }

          //var xlf = document.getElementById('xlf');
          //if(xlf && xlf.addEventListener)
          //xlf.addEventListener('change', handleFile, false);
          //}, 1500);

          function handleDragover(e)
          {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }

          function fixdata(data)
          {
            var o = "",
              l = 0,
              w = 10240;
            for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
          }

          function ab2str(data)
          {
            var o = "",
              l = 0,
              w = 10240;
            for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
            return o;
          }

          function s2ab(s)
          {
            var b = new ArrayBuffer(s.length * 2),
              v = new Uint16Array(b);

            for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
            return [v, b];
          }

          function xlsxworker_noxfer(data, cb)
          {
            var worker = new Worker('./xlsxworker.js');
            worker.onmessage = function (e)
            {
              switch (e.data.t)
              {
                case 'ready':
                  break;
                case 'e':
                  console.error(e.data.d);
                  break;
                case 'xlsx':
                  cb(JSON.parse(e.data.d));
                  break;
              }
            };

            var arr = rABS ? data : btoa(fixdata(data));
            worker.postMessage({
              d: arr,
              b: rABS
            });
          }

          function xlsxworker_xfer(data, cb)
          {
            var worker = new Worker(rABS ? './xlsxworker2.js' : './xlsxworker1.js');
            worker.onmessage = function (e)
            {
              var xx;
              switch (e.data.t)
              {
                case 'ready':
                  break;
                case 'e':
                  console.error(e.data.d);
                  break;
                default:
                  xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                  console.log("done");
                  cb(JSON.parse(xx));
                  break;
              }
            };

            if (rABS)
            {
              var val = s2ab(data);
              worker.postMessage(val[1], [val[1]]);
            }
            else
            {
              worker.postMessage(data, [data]);
            }
          }

          function xlsxworker(data, cb)
          {
            transferable = document.getElementsByName("xferable")[0].checked;
            if (transferable)
            {
              xlsxworker_xfer(data, cb);
            }
            else
            {
              xlsxworker_noxfer(data, cb);
            }
          }

          function get_radio_value(radioName)
          {
            var radios = document.getElementsByName(radioName);
            for (var i = 0; i < radios.length; i++)
            {
              if (radios[i].checked || radios.length === 1)
              {
                return radios[i].value;
              }
            }
          }

          var tarea = document.getElementById('b64data');

          function b64it()
          {
            if (typeof console !== 'undefined') console.log("onload", new Date());
            var wb = XLSX.read(tarea.value, {
              type: 'base64',
              WTF: wtf_mode
            });
            process_wb(wb);
          }

          function addBreadcrumb(nextText, urlPath)
          {
            var breadcrumb = $('#breadcrumb');
            var href = '#/upload';
            if (urlPath)
            {
              href = '#/upload#' + urlPath;
            }
            var lastCrumb = breadcrumb.contents().last().wrap('<a href="' + href + '">');
            breadcrumb.append(nextText);
          }

          function process_wb(workbook)
          {
            addBreadcrumb('Week kiezen', 'chooseWeek');
            $scope.step = "SelectSheet";
            $scope.sheetNames = Object.keys(workbook.Sheets);
            $scope.workbook = workbook;
          }

          $scope.selectSheet = function (sheetName)
          {
            $scope.step = "ProcessSheet";
            addBreadcrumb('Sheet verwerken', 'processSheet');

            function processSheet()
            {
              var defer = $q.defer();

              setTimeout(function ()
              {
                console.log("Start analysing sheet data");
                $scope.tuSheet = new TeamUpSpreadsheet($scope.workbook.Sheets[sheetName]);
                defer.resolve();
              }, 100);

              return defer.promise;
            };

            $q.when(processSheet())
              .then(function ()
              {
                $scope.uploadStepCheckStructure();
              });
          };

          $scope.uploadStepCheckStructure = function ()
          {
            $scope.step = "CheckStructure";
            addBreadcrumb('Routes controleren', 'checkRoutes');
            //showRoutes($scope.tuSheet);
          }

          $scope.uploadStepCheckNames = function ()
          {
            $scope.step = "CheckNames";
            addBreadcrumb('Namen controleren', 'checkNames');
            //TODO check check check
            $scope.tuSheet.matchTeamMembers();
            $scope.tuSheet.matchClients();
            $scope.matchedTeamMembersByName = orderMatches($scope.tuSheet.matchedTeamMemberForName);

            $scope.matchedClientsByName = orderMatches($scope.tuSheet.matchedClientForName);
          }

          $scope.textForTaskUploadStatus = function (stat)
          {
            var translations = {
              "failed": "mislukt",
              "open": "open",
              "busy": "bezig",
              "success": "gelukt"
            };
            return translations[stat];
          }

          $scope.uploadStepConfirmNames = function ()
          {
            $scope.step = "CreateTasks";
            addBreadcrumb('Taken aanmaken', 'createTasks');
            $scope.tuSheet.uploadTasks();
          }

          function orderMatches(matchedPersons)
          {
            var orderedMatches = [];

            for (var matchedPersonIndex in matchedPersons)
            {
              var matchedPerson = matchedPersons[matchedPersonIndex];
              matchedPerson.originalName = matchedPersonIndex;
              orderedMatches.push(matchedPerson);
            }

            orderedMatches.sort(function (first, second)
            {
              return first.score - second.score;
            });

            return orderedMatches;
          }

          /*
           function showNameAlternatives(orderedMatches, parentDivId) {
           for (var orderedIndex = 0; orderedIndex < orderedMatches.length; orderedIndex++) {
           var matchedPerson = orderedMatches[orderedIndex];
           var selectInput = $("<select id='matchId_" + matchedPerson.matchId  + "'>");
           var alternativeArray = matchedPerson.alternatives;
           for (var altIndex = 0; altIndex < alternativeArray.length; altIndex++) {
           var alternative = alternativeArray[altIndex];
           var score = (alternative.score * 100).toFixed();
           var optionText = alternative.person.firstName + " " + alternative.person.lastName + " (" + score + "%)";
           var optionValue = alternative.person.uuid;
           var option = $("<option value ='" + optionValue + "'>" + optionText + "</option>");
           if (matchedPerson.person === alternative.person)
           option.prop('defaultSelected', true);
           option.appendTo(selectInput);
           }
           var span = selectInput.wrap($("<span>"));
           var div = $("<div><label>" + matchedPerson.originalName + "</label></div>").appendTo($(parentDivId + ' form fieldset'));
           div.append(span);
           }
           }
           */

          function showRoutes(tuSheet)
          {
            try
            {
              var currentStartDate = null;
              var currentDayDiv;
              /*
               var moment = require('moment');
               moment.lang('nl');
               for (var routeIndex = 0; routeIndex < tuSheet.routes.length; routeIndex++) {
               var currentRoute = tuSheet.routes[routeIndex];
               if (currentStartDate === null || currentStartDate != currentRoute.startDate) {
               currentStartDate = currentRoute.startDate;
               currentDayDiv = $("<div class='SheetDayDiv'></div>").appendTo($("#UploadStepShowRoutes"));
               $("<h3>" + moment(currentStartDate).format('dddd') + "</h3>").appendTo(currentDayDiv);
               $("<div class='SheetDayDateDiv'>" + moment(currentStartDate).format('LL') + "</div>").appendTo(currentDayDiv);
               }
               var currentRouteDiv = $("<div class='SheetRouteDiv'><h4>" + currentRoute.name + "</h4></div>").appendTo(currentDayDiv);
               var teamMemberName = currentRoute.teamMemberName;
               if (teamMemberName == null)
               teamMemberName = "<span style='color:red'>niemand</span>";
               else {
               if (currentRoute.teamMember == null)
               //teamMemberName = "<span style='text-transform:none'>geen match (" + currentRoute.teamMemberName + ")</span>";
               teamMemberName = currentRoute.teamMemberName;
               else {
               var score = ((currentRoute.teamMemberScore) * 100).toFixed();
               teamMemberName = currentRoute.teamMember.firstName + " (" + score + "% " + teamMemberName + ")";
               }
               }
               var assignedTeamMember = "Teamlid: " + teamMemberName;
               $("<span>" + assignedTeamMember + "</span>").appendTo(currentRouteDiv);
               var tasks = tuSheet.routes[routeIndex].tasks;
               for (var taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
               var currentTask = tasks[taskIndex];
               var currentTaskDiv = $("<div class='SheetTaskDiv'>").appendTo(currentRouteDiv);
               var moment = require('moment');
               var startTimeString = moment(currentTask.plannedStartVisitTime).format("HH:mm");
               currentTaskDiv.append("<div class='SheetTaskStartDiv'>" + startTimeString + "</div>");
               var clientName = currentTask.clientName;
               if (clientName == null)
               clientName = "niemand";
               else {
               if (currentTask.client == null) {
               //clientName = "geen match (" + clientName + ")";
               } else {
               var score = ((currentTask.clientScore) * 100).toFixed();
               clientName = currentTask.client.firstName + " " + currentTask.client.lastName + " (" + score + "%)";
               }
               }
               currentTaskDiv.append("<div class='SheetTaskClientDiv'>" + clientName + "</div>");
               currentTaskDiv.append("<div class='SheetTaskDurationDiv'>" + currentTask.duration + "</div>");
               }
               }
               */
            }
            catch (error)
            {
              console.log(error);
              console.log(error.stack);

            }

          }

          function getDateFromCell(cell)
          {
            try
            {
              if (cell.t == "n" && typeof cell.v === "number" && typeof cell.w === "string" && cell.v > 0 && cell.v < 2958465)
              {
                var dateValue = XLSX.SSF.parse_date_code(cell.v, {
                  date1904: ($scope.workbook.Workbook.WBProps.date1904 == "1")
                }, false);
                return new Date(dateValue.y, dateValue.m - 1, dateValue.d);
              }
              else
              {
                return null;
              }
            }
            catch (error)
            {
              console.log("getDateFromCell(): Cell (" + typeof cell + ") is " + cell);
              return null;
            }
          }

          function getSheetCellName(colNo, rowNo)
          {
            var cellName = XLSX.utils.encode_cell({
              c: colNo,
              r: rowNo
            });
            //console.log("Picking cell " + cellName);
            return cellName;
          }

          function getSheetCell(sheet, colNo, rowNo)
          {
            var cellName = getSheetCellName(colNo, rowNo);
            var cell = sheet[cellName];
            return cell;
          }

          function getCellValue(cell)
          {
            var value = null;
            if (cell.v)
            {
              value = cell.v.trim();
            }
            else
            {
              console.log("Trying to read wrong value");
            }
            return value;
          }

          function getDateFromCellAndDate(cell, date)
          {
            var re = /([0-9]{1,2})[^0-9]{1}([0-9]{1,2})/;
            var matchArray = cell.v.match(re);
            if (matchArray === null)
            {
              return null;
            }
            else
            {
              var hours = matchArray[1];
              var minutes = matchArray[2];
              var dateTime = new Date(date);
              dateTime.setHours(hours);
              dateTime.setMinutes(minutes);
              return dateTime;
            }
          }

          function getCellStringValue(cell)
          {
            var value = null;
            if (typeof cell !== "undefined")
            {
              if (cell.t === "s" || cell.t === "str")
              {
                value = cell.v.trim();
              }
            }
            return value;
          }


          function TeamUpSpreadsheet(sheet)
          {
            if (sheet == null || sheet["!ref"] == null)
            {
              return "";
            }

            this.myTeamUuid = currentTeam;
            this.myTeamClientGroupId = Store('app').get('teamGroup_' + this.myTeamUuid);
            this.nofColumnsPerPeriod = 3;
            this.firstPeriodColumn = 0;
            this.periodHeaderRow = 1;
            this.minimalMatchScore = 0.1;
            this.maxRange = XLSX.utils.decode_range(sheet['!ref']);
            this.dayparts = ["ochtend", "namiddag", "avond", "middag", "nacht"];
            this.periodHeaderRows = {};
            this.days = [];
            this.teamMemberNames = [];
            this.routes = [];
            this.errors = [];
            this.matchedTeamMemberForName = {};
            this.matchedClientForName = {};
            this.nofUnassignedRoutes = 0;
            this.nofMatches = 0;
            this.confirmedTeamMemberForName = {};
            this.confirmedClientForName = {};

            this.uploadTasks = function ()
            {
              var tasks = [];

              for (var routeIndex = 0; routeIndex < this.routes.length; routeIndex++)
              {
                var currentRoute = this.routes[routeIndex];

                if (!currentRoute.doInsert)
                {
                  continue;
                }

                var sheetTeamMemberName = currentRoute.teamMemberName;

                if (sheetTeamMemberName)
                {
                  currentRoute.teamMember = this.matchedTeamMemberForName[sheetTeamMemberName].person;
                  //var teamMemberUuid = this.confirmedTeamMemberForName[sheetTeamMemberName];
                  var teamMemberUuid = currentRoute.teamMember.uuid;

                  for (var taskIndex = 0; taskIndex < currentRoute.tasks.length; taskIndex++)
                  {
                    var foundTask = currentRoute.tasks[taskIndex];

                    if (!foundTask.doInsert)
                    {
                      continue;
                    }

                    var sheetClientName = foundTask.clientName;

                    foundTask.client = this.matchedClientForName[sheetClientName].person;

                    var clientUuid = foundTask.client.uuid;

                    //var clientUuid = this.confirmedClientForName[sheetClientName];
                    var backendTask = foundTask.backendTask;

                    backendTask.plannedStartVisitTime = backendTask.plannedStartVisitTime.getTime();
                    backendTask.plannedEndVisitTime = backendTask.plannedStartVisitTime + foundTask.duration * 60 * 1000;

                    if (foundTask.duration > 0)
                    {
                      backendTask.plannedEndVisitTime -= 1000;
                    }
                    backendTask.relatedClientUuid = clientUuid;
                    backendTask.assignedTeamMemberUuid = teamMemberUuid;
                    tasks.push(foundTask);
                  }
                }
              }

              tasksSheet = tasks;
              var promises = uploadTasksSheet(tasks);

              return $q.all(promises);


              /*
               tasks.reduce(function(sequence, foundTask) {
               console.log('sequence: ' + sequence + ", foundTask: " + foundTask);
               return sequence.then(function() {
               });
               });
               */

              /*

               for(var taskCount = 0; taskCount < 5; taskCount++) {
               var foundTask = tasks[taskCount];
               foundTask.uploadTasks = 'busy';
               console.log("1. foundTask clientName: " + foundTask.clientName);
               TeamUp._(
               'taskAdd',
               null,
               foundTask.backendTask
               ).then(
               function (result) {
               if (result.error) {
               var foundTask = result.error.config.data;
               console.log("2. foundTask clientName: " + foundTask.clientName);
               foundTask.uploadStatus = 'failed';
               if (result.error.data) {
               if(result.error.data.result)
               $scope.taskCreateErrors.push({ code:1010, text:$rootScope.transError(result.error.data.result)});
               else
               $scope.taskCreateErrors.push({ code:1012, text:result.error.data});
               }
               else
               $scope.taskCreateErrors.push({ code:1011, text:$rootScope.transError(result.error)});
               }
               else
               var foundTask = result.config.data;
               console.log("2. foundTask clientName: " + foundTask.clientName);
               foundTask.uploadStatus = 'success';
               }
               );
               }
               */
            }

            function uploadTasksSheet(tasks)
            {
              tasks.map(function (foundTask)
              {
                return TeamUp._('taskAdd', null, foundTask.backendTask)
                  .then(function (result)
                  {
                    if (result.error)
                    {
                      console.log('error for ' + foundTask.clientName);
                      foundTask.error = result.error.data;
                      $scope.taskCreateErrors.push(foundTask);
                      foundTask.uploadStatus = 'failed';
                    }
                    else
                    {
                      console.log('success for ' + foundTask.clientName);
                      foundTask.uploadStatus = 'success';
                    }
                  });
              });
            }

            $scope.deleteWeek = function ()
            {
              //TODO the user can't pick the team he likes to upload the sheet
              var sheetFirstDate = moment($scope.tuSheet.days[0].startDate);

              Task.getWeek(currentTeam, sheetFirstDate.week(), moment().get('year'))
                .then(
                function (tasks)
                {
                  deleteExistingTasksOnSheetDate(tasks)
                    .then(
                    function (tasks)
                    {
                      console.log('Deze taken zijn verwijdered ', tasks);
                      //upload sheet tasks again
                      //$q.all(uploadTasksSheet(tasksSheet));
                    }
                  );
                }
              );
            };

            //check if there are already tasks on the dates of the uploaded sheet
            function deleteExistingTasksOnSheetDate(tasks)
            {

              var tasksByWeek = [];

              angular.forEach(tasks, function (task)
              {
                tasksByWeek.push(TeamUp._(
                    'taskDelete',
                    { second: task.uuid },
                    task
                  ).then(
                    function (result)
                    {
                      if (result.error)
                      {
                        console.log('failed ', task);
                      }

                      return result;
                    }
                  )
                );
              });

              return $q.all(tasksByWeek);
            }

            this.addConfirmedClient = function (originalName, clientUuid)
            {
              this.confirmedClientForName[originalName] = clientUuid;
            };

            this.addConfirmedTeamMember = function (originalName, teamMemberUuid)
            {
              this.confirmedTeamMemberForName[originalName] = teamMemberUuid;
            };


            this.matchClients = function matchClients()
            {
              var myTeamClients = $rootScope.getClientsByTeam([currentTeam]);

              for (var routeIndex = 0; routeIndex < this.routes.length; routeIndex++)
              {
                var currentRoute = this.routes[routeIndex];
                if (currentRoute.doInsert === false)
                {
                  continue;
                }

                for (var taskIndex = 0; taskIndex < currentRoute.tasks.length; taskIndex++)
                {
                  var foundTask = currentRoute.tasks[taskIndex];

                  if (!foundTask.doInsert)
                  {
                    continue;
                  }
                  var sheetClientName = foundTask.clientName;

                  if (typeof this.matchedClientForName[sheetClientName] === "undefined")
                  {
                    var alternatives = [],
                      bestMatch = null,
                      lowercaseName = sheetClientName.toLowerCase();

                    for (var clientIndex in myTeamClients)
                    {
                      var testClient = myTeamClients[clientIndex],
                        testClientFullname = testClient.firstName.toLowerCase() + " " + testClient.lastName.toLowerCase(),
                        testClientFullname = testClient.lastName.toLowerCase(),
                        score = clj_fuzzy.metrics.jaro_winkler(testClientFullname, lowercaseName);
                      //console.log("Score for " + lowercaseName + " vs. " + testClientFullname + ": " + score);

                      if (score > this.minimalMatchScore)
                      {
                        var match = {
                          score: score,
                          person: testClient,
                          task: foundTask,
                          matchId: this.nofMatches++
                        };

                        if (bestMatch == null || score > bestMatch.score)
                        {
                          bestMatch = match;
                        }
                        alternatives.push(match);
                      }
                    }

                    if (bestMatch !== null)
                    {
                      alternatives.sort(function (first, second)
                      {
                        return second.score - first.score;
                      });
                      bestMatch.alternatives = alternatives;
                      this.matchedClientForName[sheetClientName] = bestMatch;
                    }
                  }
                }
              }
            }

<<<<<<< HEAD
            function ownTeamUuid () {
              //JSON.parse(localStorage['teams.own']).value[0].uuid;
              //return JSON.parse(localStorage['teams.own']).value[0].uuid;
              return '88adfa02-e242-4564-890c-b20192ea6c1a_team';
            };
=======
            this.matchTeamMembers = function matchTeamMembers()
            {
              var myTeamMembers = Store('app').get(currentTeam);
>>>>>>> cfc47e618913b1db85cc08206f7ff08849fc9e29

              angular.forEach(myTeamMembers, function (teamMember)
              {
                  teamMember.fullName = '';
                  if (teamMember.firstName)
                  {
                      teamMember.fullName += teamMember.firstName;
                  }
                  if (teamMember.firstName && teamMember.lastName)
                  {
                      teamMember.fullName += ' ';
                  }
                  if (teamMember.lastName)
                  {
                      teamMember.fullName += teamMember.lastName;
                  }
              });

              for (var routeIndex = 0; routeIndex < this.routes.length; routeIndex++)
              {
                var currentRoute = this.routes[routeIndex],
                    sheetTeamMemberName = currentRoute.teamMemberName;

                if (currentRoute.doInsert === false)
                {
                  continue;
                }

                if (sheetTeamMemberName == null)
                {
                  continue;
                }

                if (typeof this.matchedTeamMemberForName[sheetTeamMemberName] === "undefined")
                {
                  var alternatives = [],
                    bestMatch = null,
                    lowercaseName = sheetTeamMemberName.toLowerCase();

                  for (var memberIndex in myTeamMembers)
                  {
                    var testTeamMember = myTeamMembers[memberIndex];
                    var testFirstName = testTeamMember.firstName.toLowerCase();
                    var score = clj_fuzzy.metrics.jaro_winkler(testFirstName, lowercaseName);
                    //console.log("Score for " + sheetTeamMemberName + " vs. " + testFirstName + ": " + score);
                    if (score > this.minimalMatchScore)
                    {
                      var match = {
                        score: score,
                        person: testTeamMember,
                        route: currentRoute,
                        matchId: this.nofMatches++
                      };
                      if (bestMatch == null || score > bestMatch.score)
                      {
                        bestMatch = match;
                      }
                      alternatives.push(match);
                    }
                  }
                  if (bestMatch !== null)
                  {
                    alternatives.sort(function (first, second)
                    {
                      return second.score - first.score;
                    });

                    bestMatch.alternatives = alternatives;
                    this.matchedTeamMemberForName[sheetTeamMemberName] = bestMatch;
                  }
                }
              }
            }

            function parseSheet(sheet)
            {
              for (var colNo = 0; colNo < this.maxRange.e.c; colNo++)
              {
                var cell = getSheetCell(sheet, colNo, this.periodHeaderRow);
                if (typeof cell === "undefined")
                {
                  continue;
                }

                var startDate = getDateFromCell(cell);

                if (startDate !== null)
                {
                  if (colNo < 3)
                  {
                    this.periodHeaderRows = this.findPeriodHeaders(sheet, colNo, this.periodHeaderRow + 1);
                  }
                  this.days.push({ col: colNo, startDate: startDate, routes: [], doInsert: true });
                }
              }

              console.log(this.periodHeaderRows);

              for (var dayIndex = 0; dayIndex < this.days.length; dayIndex++)
              {
                var day = this.days[dayIndex];
                var colNo = day.col; //in this.days)
                for (var firstRowName in this.periodHeaderRows)
                {
                  var firstRowNo = parseInt(firstRowName) + 1;
                  //console.log("Reading next route starting at " + getSheetCellName(colNo, firstRowNo));
                  var currentRoute = {
                    //"startDate": this. periodStartColumns[colNo],
                    "startDate": day.startDate,
                    teamMemberName: null,
                    tasks: [],
                    name: this.periodHeaderRows[firstRowName],
                    doInsert: false
                  };
                  for (var rowNo = firstRowNo; rowNo < this.maxRange.e.r; rowNo++)
                  {
                    if (typeof this.periodHeaderRows[rowNo] !== "undefined")
                    {
                      break;
                    }

                    if (currentRoute.teamMemberName === null && rowNo === firstRowNo)
                    {
                      // Read the assigned team member
                      for (var subColNo = -1; subColNo <= 1; subColNo++)
                      {
                        var finalColNo = parseInt(colNo) + subColNo;
                        var cell = getSheetCell(sheet, finalColNo, rowNo);
                        var cellValue = getCellStringValue(cell);
                        if (cellValue !== null && cellValue.length > 0)
                        {
                          currentRoute.teamMemberName = cellValue;
                        }
                      }
                    }
                    else
                    {
                      // Read the route tasks
                      var foundTask =
                      {
                        backendTask: {
                          uuid: '',
                          status: 2,
                          plannedStartVisitTime: null,
                          plannedEndVisitTime: null,
                          assignedTeamUuid: this.myTeamUuid,
                          description: 'Geimporteerd vanuit een spreadsheet',
                        },
                        clientName: null,
                        duration: 0,
                        route: currentRoute,
                        doInsert: false,
                        uploadStatus: 'open'
                      };

                      for (var subColNo = -1; subColNo <= 1; subColNo++)
                      {
                        var finalColNo = parseInt(colNo) + subColNo,
                          cellName = getSheetCellName(finalColNo, rowNo),
                          cell = sheet[cellName];

                        if (typeof cell === "undefined")
                        {
                          break;
                        }

                        switch (cell.t)
                        {
                          case "b":
                            if (subColNo == -1)
                            {
                              this.errors.push({
                                code: 1001,
                                text: "Er is een ja/nee waarde gevonden in cell " + cellName + ", terwijl er een tijdstip werd verwacht."
                              });
                            }
                            else if (subColNo == 0)
                            {
                              this.errors.push({
                                code: 1002,
                                text: "Er is een ja/nee waarde gevonden in cell " + cellName + ", terwijl er een clientnaam werd verwacht."
                              });
                            }
                            else if (subColNo == 1)
                            {
                              this.errors.push({
                                code: 1003,
                                text: "Er is een ja/nee waarde gevonden in cell " + cellName + ", terwijl er een aantal minuten werd verwacht."
                              });
                            }
                            break;
                          case "n":
                            if (subColNo == -1)
                            {
                              this.errors.push({
                                code: 1004,
                                text: "Er is een getal gevonden in cell " + cellName + ", terwijl er een tijdstip werd verwacht."
                              });
                            }
                            else if (subColNo == 0)
                            {
                              this.errors.push({
                                code: 1005,
                                text: "Er is een getal gevonden in cell " + cellName + ", terwijl er een clientnaam werd verwacht."
                              });
                            }
                            else if (subColNo == 1)
                            {
                              foundTask.duration = parseInt(cell.v);
                            }
                            break;
                          case "e":
                            this.errors.push({
                              code: 1006,
                              text: "Er is een fout gevonden in cell " + cellName + ": " + cell.v
                            });
                            break;
                          case "s":
                          case "str":
                            if (subColNo == -1)
                            { // Read a start time
                              var plannedStartTime = getDateFromCellAndDate(cell, currentRoute.startDate);
                              if (plannedStartTime === null)
                              {
                                this.errors.push({
                                  code: 1007,
                                  text: "Het is niet mogelijk om het tijdstip in cell " + cellName + " te lezen."
                                });
                                foundTask = null;
                              }
                              else
                              {
                                foundTask.backendTask.plannedStartVisitTime = plannedStartTime;
                              }
                            }
                            else if (subColNo == 0)
                            { // Read the client name
                              foundTask.clientName = getCellStringValue(cell);
                            }
                            else if (subColNo == 1)
                            {
                              foundTask.duration = parseInt(cell.v);
                            }
                            break;
                        }
                        if (foundTask === null)
                        {
                          break;
                        }
                      }
                      //console.log('backendTask ', foundTask);

                      var backendTask = foundTask.backendTask;
                      if (foundTask !== null && backendTask.plannedStartVisitTime !== null && foundTask.clientName !== null)
                      {
                        if (foundTask.duration > 0)
                        {
                          foundTask.doInsert = true;
                        }
                        currentRoute.tasks.push(foundTask);
                      }
                    }
                  }
                  if (currentRoute.tasks.length > 0)
                  {
                    if (currentRoute.teamMemberName === null)
                    {
                      this.nofUnassignedRoutes++;
                    }
                    else
                    {
                      currentRoute.doInsert = true;
                      day.taskExist = true;
                    }
                  }
                  this.routes.push(currentRoute);
                  day.routes.push(currentRoute);
                }
              }
              if (this.nofUnassignedRoutes > 0)
              {
                this.errors.push({
                  code: 1009,
                  text: "Er zijn " + this.nofUnassignedRoutes + " routes waaraan nog geen teamlid is toegekend."
                });
              }
            }

            this.parseSheet = parseSheet;

            $scope.toggleDayInsert = function(day)
            {
              angular.forEach(day.routes, function(route) {
                route.doInsert = day.doInsert;

                angular.forEach(route.tasks, function(task) {
                    task.doInsert = day.doInsert;
                });
              });
            };

            $scope.toggleRouteInsert = function ()
            {
              for (var c = 0; c < this.route.tasks.length; c++)
              {
                this.route.tasks[c].doInsert = this.route.doInsert;
              }
            };

            function findPeriodHeaders(sheet, middleColNo, firstRowNo)
            {
              var periodHeaders = {},
                currentDayPart = null;

              // Descent the rows downwards to find the routes
              for (var rowNo = firstRowNo; rowNo < this.maxRange.e.r; rowNo++)
              {
                for (var subColNo = -1; subColNo <= 1; subColNo++)
                {
                  try
                  {
                    var finalColNo = middleColNo + subColNo,
                      cell = getSheetCell(sheet, finalColNo, rowNo);

                    if (typeof cell === "undefined")
                    {
                      continue;
                    }

                    var cellValue = getCellStringValue(cell);

                    if (cellValue === null || cellValue.length == 0)
                    {
                      continue;
                    }

                    cellValue = cellValue.toLowerCase();

                    if (cellValue.indexOf("fbpz") >= 0)
                    {
                      break;
                    } // Next row

                    if (this.dayparts.indexOf(cellValue) >= 0)
                    {
                      console.log("Found a daypart: " + cellValue);
                      currentDayPart = cellValue;

                      var nextRowIsRoute = false,
                        downCell = getSheetCell(sheet, finalColNo, rowNo + 1);

                      if (downCell)
                      {
                        var downCellValue = getCellStringValue(downCell);
                        if (downCellValue !== null)
                        {
                          downCellValue = downCellValue.toLowerCase();
                          if (downCellValue.indexOf("route") >= 0)
                          {
                            nextRowIsRoute = true;
                          }
                        }
                      }
                      if (nextRowIsRoute === false)
                      {
                        var combinedName = currentDayPart;
                        periodHeaders[rowNo] = combinedName;
                      }
                      break; // Next row
                    }
                    if (cellValue.indexOf("route") == 0)
                    {
                      if (currentDayPart === null)
                      {
                        throw "Found a route without having a daypart.";
                      }
                      else
                      {
                        var combinedName = currentDayPart + " " + cellValue;
                        periodHeaders[rowNo] = combinedName;
                      }
                      break; // Next row
                    }
                  }
                  catch (error)
                  {
                    this.errors.push({
                      code: 1008,
                      text: "Er is een onbekende fout opgetreden: " + error
                    });
                    console.log(error);
                    console.log(error.stack);
                    return periodHeaders;
                  }
                }
              }

              return periodHeaders;
            }

            this.findPeriodHeaders = findPeriodHeaders;

            this.parseSheet(sheet);
          }
        }
      ]
    );
  }
);
