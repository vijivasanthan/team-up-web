define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';






    var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
    if(!rABS) {
      document.getElementsByName("userabs")[0].disabled = true;
      document.getElementsByName("userabs")[0].checked = false;
    }

    var use_worker = typeof Worker !== 'undefined';
    if(!use_worker) {
      document.getElementsByName("useworker")[0].disabled = true;
      document.getElementsByName("useworker")[0].checked = false;
    }

    var transferable = use_worker;
    if(!transferable) {
      document.getElementsByName("xferable")[0].disabled = true;
      document.getElementsByName("xferable")[0].checked = false;
    }

    var wtf_mode = false;

    function handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      var files = e.dataTransfer.files;
      handleFiles(files);
    }

    function handleFile(e) {
      var files = e.target.files;
      handleFiles(files);
    }


    function handleFiles(files) {
      rABS = document.getElementsByName("userabs")[0].checked;

      // use_worker = document.getElementsByName("useworker")[0].checked;
      use_worker = false;

      var i,f;
      for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e) {
          if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
          var data = e.target.result;
          if(use_worker) {
            xlsxworker(data, process_wb);
          } else {
            var wb;
            if(rABS) {
              wb = XLSX.read(data, {type: 'binary'});
            } else {
              var arr = fixdata(data);
              wb = XLSX.read(btoa(arr), {type: 'base64'});
            }
            process_wb(wb);
          }
        };
        if(rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
        $('#UploadStepSelectFile').hide();
        addBreadcrumb('Verwerken');
      }
    }

    function handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }



    setTimeout(function () {
//      var drop = document.getElementById('drop');
//      if(drop.addEventListener) {
//        drop.addEventListener('dragenter', handleDragover, false);
//        drop.addEventListener('dragover', handleDragover, false);
//        drop.addEventListener('drop', handleDrop, false);
//      }


      var xlf = document.getElementById('xlf');
      if(xlf.addEventListener)
        xlf.addEventListener('change', handleFile, false);
    }, 500);












    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////










    function fixdata(data) {
      var o = "", l = 0, w = 10240;
      for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
      o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
      return o;
    }

    function ab2str(data) {
      var o = "", l = 0, w = 10240;
      for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(data.slice(l*w,l*w+w)));
      o+=String.fromCharCode.apply(null, new Uint16Array(data.slice(l*w)));
      return o;
    }

    function s2ab(s) {
      var b = new ArrayBuffer(s.length*2), v = new Uint16Array(b);
      for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i);
      return [v, b];
    }

    function xlsxworker_noxfer(data, cb) {
      var worker = new Worker('./xlsxworker.js');
      worker.onmessage = function(e) {
        switch(e.data.t) {
          case 'ready': break;
          case 'e': console.error(e.data.d); break;
          case 'xlsx': cb(JSON.parse(e.data.d)); break;
        }
      };
      var arr = rABS ? data : btoa(fixdata(data));
      worker.postMessage({d:arr,b:rABS});
    }

    function xlsxworker_xfer(data, cb) {
      var worker = new Worker(rABS ? './xlsxworker2.js' : './xlsxworker1.js');
      worker.onmessage = function(e) {
        var xx;
        switch(e.data.t) {
          case 'ready': break;
          case 'e': console.error(e.data.d); break;
          default: xx=ab2str(e.data).replace(/\n/g,"\\n").replace(/\r/g,"\\r"); console.log("done"); cb(JSON.parse(xx)); break;
        }
      };
      if(rABS) {
        var val = s2ab(data);
        worker.postMessage(val[1], [val[1]]);
      } else {
        worker.postMessage(data, [data]);
      }
    }

    function xlsxworker(data, cb) {
      transferable = document.getElementsByName("xferable")[0].checked;
      if(transferable) xlsxworker_xfer(data, cb);
      else xlsxworker_noxfer(data, cb);
    }

    function get_radio_value( radioName ) {
      var radios = document.getElementsByName( radioName );
      for( var i = 0; i < radios.length; i++ ) {
        if( radios[i].checked || radios.length === 1 ) {
          return radios[i].value;
        }
      }
    }

    function to_json(workbook) {
      var result = {};
      workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
          result[sheetName] = roa;
        }
      });
      return result;
    }

    function to_csv(workbook) {
      var result = [];
      workbook.SheetNames.forEach(function(sheetName) {
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if(csv.length > 0){
          result.push("SHEET: " + sheetName);
          result.push("");
          result.push(csv);
        }
      });
      return result.join("\n");
    }

    function to_formulae(workbook) {
      var result = [];
      workbook.SheetNames.forEach(function(sheetName) {
        var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
        if(formulae.length > 0){
          result.push("SHEET: " + sheetName);
          result.push("");
          //result.push(formulae.join("\n"));
        }
      });
      return result.join("\n");
    }

    var tarea = document.getElementById('b64data');
    function b64it() {
      if(typeof console !== 'undefined') console.log("onload", new Date());
      var wb = XLSX.read(tarea.value, {type: 'base64',WTF:wtf_mode});
      process_wb(wb);
    }

    function addBreadcrumb(nextText) {
      var breadcrumb = $('#breadcrumb');
      var lastCrumb = breadcrumb.contents().last().wrap('<a href="#">');
      breadcrumb.append(nextText);

    }

    function process_wb(workbook) {
      addBreadcrumb('Week kiezen');
      var selectSheetDiv = $('#UploadStepSelectSheet');
      selectSheetDiv.show();
      var sheetName;
      for (sheetName in workbook.Sheets)  {
        $("<div class='SheetDiv'>").append(sheetName).appendTo(selectSheetDiv).click(sheetName, function (eventData) {
          $('#UploadStepSelectSheet').hide();
          addBreadcrumb('Controleren');
          process_sheet(workbook.Sheets[eventData.data]);
          $('#UploadStepCheckResult').show();
        });
      }
    }

    function process_sheet(sheet) {
      console.log(sheet);
      var tuSheet;
      try {
        tuSheet = new TeamUpSpreadsheet(sheet);
        for(var c = 0; c < tuSheet.errors.length; c++) {
          $("#UploadStepShowErrors").append("<p>" + tuSheet.errors[c].code + ": "  + tuSheet.errors[c].text  + "</p>");
        }
        var currentStartDate = null;
        var currentDayDiv;
        for(var routeIndex = 0; routeIndex < tuSheet.routes.length; routeIndex++) {
          var currentRoute = tuSheet.routes[routeIndex];
          if(currentStartDate === null || currentStartDate != currentRoute.startDate) {
            currentStartDate = currentRoute.startDate;
            currentDayDiv = $("<div class='SheetDayDiv'><h2>" + getWeekdayName(currentStartDate)  + "</h2></div>").appendTo($("#UploadStepShowRoutes"));
          }
          var currentRouteDiv = $("<div class='SheetRouteDiv'><h3>" + currentRoute.name  + "</h3></div>").appendTo(currentDayDiv);
          var tasks = tuSheet.routes[routeIndex].tasks;
          for(var taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
            var currentTask = tasks[taskIndex];
            var currentTaskDiv = $("<div class='SheetTaskDiv'>").appendTo(currentRouteDiv);
            var startTime = currentTask.startTime;
            if(startTime === null)
              console.log("Start time is null");
            currentTaskDiv.append("<div class='SheetTaskStartDiv'>" +  startTime.getHours() + ":" + startTime.getMinutes() + "</div>");
            currentTaskDiv.append("<div class='SheetTaskClientDiv'>" + currentTask.clientName + "</div>");
            currentTaskDiv.append("<div class='SheetTaskDurationDiv'>" + currentTask.duration + "</div>");
          }
        }
      }
      catch(error) {
        console.log(error);
      }
    }

    function TeamUpTimeWindow(startTime, endTime) {
      this.startTime = startTime;
      this.endTime = endTime;
    }

    var weekdayNames = [ "Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag" ];
    function getWeekdayName(date) {
      var weekdayIndex = date.getDay();
      return weekdayNames[weekdayIndex];
    }

    function getDateFromCell(cell) {
      try {
        if(cell.t == "n" && typeof cell.v === "number" && typeof cell.w === "string" && cell.v > 0 && cell.v < 2958465) {
          var dateValue = XLSX.SSF.parse_date_code(cell.v, {date1904:false}, false);
          return new Date(dateValue.y, dateValue.m - 1, dateValue.d);
        }
        else
          return null;
      }
      catch (error) {
        console.log("getDateFromCell(): Cell (" + typeof cell + ") is " + cell);
        return null;
      }
    }

    function getSheetCellName(colNo, rowNo) {
      var cellName = XLSX.utils.encode_cell({c:colNo, r:rowNo});
      //console.log("Picking cell " + cellName);
      return cellName;
    }

    function getSheetCell(sheet, colNo, rowNo) {
      var cellName = getSheetCellName(colNo, rowNo);
      var cell = sheet[cellName];
      return cell;
    }

    function getCellValue(cell) {
      var value = null;
      if(cell.v)
        value = cell.v.toLowerCase().trim();
      else
        console.log("Trying to read wrong value");
      return value;
    }

    function getStartTimeFromCellAndDate(cell, date) {
      var re = /([0-9]{1,2})[^0-9]{1}([0-9]{1,2})/;
      var matchArray = cell.v.match(re);
      if(matchArray === null)
        return null;
      else {
        var hours = matchArray[1];
        var minutes = matchArray[2];
        var startTime = new Date(date);
        startTime.setHours(hours);
        startTime.setMinutes(minutes);
        return startTime;
      }
    }

    function getCellStringValue(cell) {
      var value = null;
      if(typeof cell !== "undefined") {
        if(cell.t === "s" || cell.t === "str") {
          value = cell.v.toLowerCase().trim();
        }
      }
      return value;
    }


    function TeamUpSpreadsheet (sheet) {
      if(sheet == null || sheet["!ref"] == null)
        return "";

      this.nofColumnsPerPeriod = 3;
      this.firstPeriodColumn = 0;
      this.periodHeaderRow = 1;
      this.maxRange = XLSX.utils.decode_range(sheet['!ref']);
      this.dayparts = [ "ochtend", "namiddag", "avond", "middag", "nacht" ] ;
      this.periodHeaderRows = {};
      this.periodStartColumns = {};
      this.teamMemberNames = [];
      this.routes = [];
      this.errors = [];

      function parseSheet(sheet) {
        for(var colNo = 0; colNo < this.maxRange.e.c; colNo++) {
          var cell = getSheetCell(sheet, colNo, this.periodHeaderRow);
          if(typeof cell === "undefined")
            continue;
          var startDate = getDateFromCell(cell);
          if(startDate !== null) {
            if(colNo < 3)
              this.periodHeaderRows = this.findPeriodHeaders(sheet, colNo, this.periodHeaderRow + 1);
            this.periodStartColumns[colNo] = startDate;
          }
        }

        console.log(this.periodHeaderRows);

        for(var colNo in this.periodStartColumns) {
          for(var firstRowName in this.periodHeaderRows) {
            var firstRowNo = parseInt(firstRowName) + 1;
            console.log("Reading next route starting at " + getSheetCellName(colNo, firstRowNo));
            var currentRoute = { "startDate":this.periodStartColumns[colNo], teamMemberName:null, tasks:[], name:this.periodHeaderRows[firstRowName] };
            for(var rowNo = firstRowNo; rowNo < this.maxRange.e.r; rowNo++) {
              if(typeof this.periodHeaderRows[rowNo] !== "undefined")
                break;
              if(currentRoute.teamMemberName === null) {
                // Read the assigned team member
                for(var subColNo = - 1; subColNo <= 1; subColNo++) {
                  var finalColNo = parseInt(colNo) + subColNo;
                  var cell = getSheetCell(sheet, colNo, rowNo);
                  var cellValue = getCellStringValue(cell);
                  if(cellValue !== null) {
                    currentRoute.teamMemberName = cellValue;
                  }
                }
              }
              else {
                // Read the route tasks
                var currentTask = { "startTime":null, "clientName":null, "duration":0 };
                for(var subColNo = - 1; subColNo <= 1; subColNo++) {
                  var finalColNo = parseInt(colNo) + subColNo;
                  var cellName = getSheetCellName(finalColNo, rowNo);
                  var cell = sheet[cellName];
                  if(typeof cell === "undefined")
                    break;
                  switch(cell.t) {
                    case "b":
                      if(subColNo == -1) {
                        this.errors.push({ code:1001, text:"Er is een ja/nee waarde gevonden in cell " + cellName + ", terwijl er een tijdstip werd verwacht." });
                      }
                      else if (subColNo == 0) {
                        this.errors.push({ code:1002, text:"Er is een ja/nee waarde gevonden in cell " + cellName + ", terwijl er een clientnaam werd verwacht." });
                      }
                      else if (subColNo == 1) {
                        this.errors.push({ code:1003, text:"Er is een ja/nee waarde gevonden in cell " + cellName + ", terwijl er een aantal minuten werd verwacht."});
                      }
                      break;
                    case "n":
                      if(subColNo == -1) {
                        this.errors.push({ code:1004, text:"Er is een getal gevonden in cell " + cellName + ", terwijl er een tijdstip werd verwacht."});
                      }
                      else if(subColNo == 0) {
                        this.errors.push({ code:1005, text:"Er is een getal gevonden in cell " + cellName + ", terwijl er een clientnaam werd verwacht."});
                      }
                      else if(subColNo == 1) {
                        currentTask.duration = parseInt(cell.v);
                      }
                      break;
                    case "e":
                      this.errors.push({ code:1006, text:"Er is een fout gevonden in cell " + cellName + ": " + cell.v});
                      break;
                    case "s":
                    case "str":
                      if(subColNo == -1) { // Read a start time
                        var startTime = getStartTimeFromCellAndDate(cell, currentRoute.startDate);
                        if(startTime === null) {
                          this.errors.push({code:1007, text:"Het is niet mogelijk om het tijdstip in cell " + cellName + " te lezen."});
                          currentTask = null;
                        }
                        else
                          currentTask.startTime = startTime;
                      }
                      else if(subColNo == 0) { // Read the client name
                        currentTask.clientName = getCellStringValue(cell);
                      }
                      else if(subColNo == 1) {
                        currentTask.duration = parseInt(cell.v);
                      }
                      break;
                  }
                  if(currentTask === null)
                    break;
                }
                if(currentTask !== null && currentTask.startTime !== null && currentTask.clientName !== null)
                  currentRoute.tasks.push(currentTask);
              }
            }
            this.routes.push(currentRoute);
          }
          //console.log(this.routes);
        }
      }
      this.parseSheet = parseSheet;

      function findPeriodHeaders(sheet, middleColNo, firstRowNo) {
        var periodHeaders = {};
        var currentDayPart = null;
        // Descent the rows downwards to find the routes
        for(var rowNo = firstRowNo; rowNo < this.maxRange.e.r; rowNo++) {
          for(var subColNo = -1; subColNo <= 1; subColNo++) {
            try {
              var finalColNo = middleColNo + subColNo;

              var cell = getSheetCell(sheet, finalColNo, rowNo);
              if(typeof cell === "undefined")
                continue;
              var cellValue = getCellStringValue(cell);
              if(cellValue === null || cellValue.length == 0)
                continue;
              if(cellValue.indexOf("fbpz") >= 0)
                break; // Next row
              if(this.dayparts.indexOf(cellValue) >= 0) {
                console.log("Found a daypart: " + cellValue);
                currentDayPart = cellValue;
                var nextRowIsRoute = false;
                var downCell = getSheetCell(sheet, finalColNo, rowNo + 1);
                if(downCell) {
                  var downCellValue = getCellStringValue(downCell);
                  if(downCellValue !== null && downCellValue.indexOf("route") >= 0) {
                    nextRowIsRoute = true;
                  }
                }
                if(nextRowIsRoute === false) {
                  var combinedName = currentDayPart;
                  periodHeaders[rowNo] = combinedName;
                }
                break; // Next row
              }
              if(cellValue.indexOf("route") == 0) {
                if(currentDayPart === null) {
                  throw "Found a route without having a daypart.";
                }
                else {
                  var combinedName = currentDayPart + " " + cellValue;
                  periodHeaders[rowNo] = combinedName;
                }
                break; // Next row
              }
            }
            catch(error) {
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



    /*
     function process_wb(wb) {
     var output = "";
     switch(get_radio_value("format")) {
     case "json":
     output = JSON.stringify(to_json(wb), 2, 2);
     break;
     case "form":
     output = to_formulae(wb);
     break;
     default:
     output = to_csv(wb);
     break;
     }
     if(out.innerText === undefined) out.textContent = output;
     else out.innerText = output;
     if(typeof console !== 'undefined') console.log("output", new Date());
     }
     */



    controllers.controller(
      'uploadCtrl', [
        '$rootScope',
        '$scope',
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
        function ($rootScope, $scope, $location, Clients, $route, $routeParams, Store, Dater,
                  $filter, $modal, TeamUp, $timeout)
        {
          console.log("Clients -> ",Clients);
        }
      ]
    );
  }
);
