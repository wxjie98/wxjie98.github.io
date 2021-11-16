function tableToCsv(id,arFields=[],filename="data.csv"){
  if(!Array.isArray(arFields)){
    filename=arFields;
    arFields=[];
  }
  var str="";
  var tb=document.getElementById(id);
  var tr=tb.getElementsByTagName("tr");
  var n=tr.length;
  for(let i=0;i<n;i++){
    let td=tr[i].getElementsByTagName("td");
    if(arFields.length==0){
      let j=td.length;
      for(let k=0;k<j;k++){
        if(isBigNumber(td[k].innerText))
          str+="\t" + td[k].innerText;
        else
          str+=td[k].innerText;
        if(k==j-1)str+="\n"; else str+=",";
      }
    }else{
      arFields.forEach((v,i)=>{
        if(isBigNumber(td[v].innerText))
          str+="\t" + td[v].innerText;
        else
          str+=td[v].innerText;
        if(i==arFields.length-1)str+="\n"; else str+=",";
      });
    }
  }
  download(str,filename);
}
function arToCsv(arr,filename="data.csv"){
  var str="";
  for(var i=0;i<arr.length;i++){
    var item = arr[i];
    for(var j=0;j<item.length;j++){
      if(isBigNumber(item[j]))
        str+="\t" + item[j];
      else
        str+=item[j];
      if(j==item.length-1)str+="\n"; else str+=",";
    }            
  }
  download(str,filename);
}
function download(content, filename){
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  var blob = new Blob(["\ufeff" + content]);
  eleLink.href = URL.createObjectURL(blob);
  eleLink.click();
  URL.revokeObjectURL(eleLink.href);
}
function isBigNumber(theObj){
  var reg = /^[0-9]+$/;
  if(reg.test(theObj) && theObj.length>11){
    return true;
  }
  return false;
}
function download2(content, filename){
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  eleLink.href = "data:text/plain;charset=utf-8,\ufeff" + content;
  eleLink.click();
}
function arToTable(arr,idTable,idContainer){
  var strHtml="";
  strHtml+="<table id='" + idTable + "'>";
  for(var i=0;i<arr.length;i++){
    strHtml+="<tr>";
    var item = arr[i];
    for(var key in item){
      var value = item[key];
      strHtml+="<td>"+value+"</td>";
    }            
    strHtml+="</tr>";
  }
  if(undefined==idContainer)
    document.body.innerHTML+=strHtml;
  else
    document.getElementById(idContainer).innerHTML+=strHtml;
}

export default tableToCsv;
export {tableToCsv, arToCsv};