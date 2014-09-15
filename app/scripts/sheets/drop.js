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
  use_worker = document.getElementsByName("useworker")[0].checked;
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

var drop = document.getElementById('drop');
if(drop.addEventListener) {
  drop.addEventListener('dragenter', handleDragover, false);
  drop.addEventListener('dragover', handleDragover, false);
  drop.addEventListener('drop', handleDrop, false);
}


var xlf = document.getElementById('xlf');
if(xlf.addEventListener)
  xlf.addEventListener('change', handleFile, false);