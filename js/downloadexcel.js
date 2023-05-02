(function(root,factory){
if(typeof define==='function' && define.amd){
    require.config({
      paths:{
        jquery: ["https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min","/jscode/jquery.min"],
        xlsx: ["https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min","/jscode/xlsx.mini.min"]
      }
    });
    define(["jquery","xlsx"],factory);
  }else{
    root.exportExcel=factory($,XLSX);
  }
}(this,function($,XLSX){
function exportExcel(data,filename="导出.xlsx"){
  data=data || "table1";
  var sheet;
  if(Array.isArray(data)){
     sheet=XLSX.utils.aoa_to_sheet(data);
  }else if(typeof(data)=="string"){
    var csv=table2csv($("#"+data));
    sheet=csv2sheet(csv);
  }
  openDownloadDialog(sheet2blob(sheet),filename);
}
function table2csv(table){
  var csv=[];
  $(table).find('tr').each(function(){
    var temp=[];	
    $(this).find('td').each(function(){
      temp.push($(this).html());
    })
    csv.push(temp.join(','));
  });
  csv.push(""); 
  return csv.join('\n');
}
function csv2sheet(csv){
  var sheet={}; 
  csv=csv.split('\n');
  csv.forEach(function(row,i){
    row=row.split(',');
    if(i==0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
    row.forEach(function(col,j){
      sheet[String.fromCharCode(65+j)+(i+1)]={v:col};
    });
  });
  return sheet;
}
function sheet2blob(sheet,sheetName){
  sheetName=sheetName || 'sheet1';
  var workbook={
    SheetNames:[sheetName],
    Sheets:{}
  };
  workbook.Sheets[sheetName]=sheet;
  var wopts={
    bookType: 'xlsx', 
    bookSST: false, 
    type: 'binary'
  };
  var wbout=XLSX.write(workbook,wopts);
  var blob=new Blob([s2ab(wbout)],{type:"application/octet-stream"});
  function s2ab(s){
    var buf=new ArrayBuffer(s.length);
    var view=new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  return blob;
}
function openDownloadDialog(url, saveName){
  if(typeof url == 'object' && url instanceof Blob){
    url = URL.createObjectURL(url);
  }
  var aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || '';
  var event;
  if(window.MouseEvent) event = new MouseEvent('click');
  else{
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click',true,false,window,0,0,0,0,0,false,false,false,false,0,null);
  }
  aLink.dispatchEvent(event);
}
  return exportExcel;
}));