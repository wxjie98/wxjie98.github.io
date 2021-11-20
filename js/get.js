function get(url,callback,param){
  var objParam={method:"get",type:"text"};
  if(url && typeof url=="object"){
    Object.assign(objParam,url);
    url=url.url;
  }
  if(callback && typeof callback=="object")
    Object.assign(objParam,callback);
  if(param && typeof param=="object")
    Object.assign(objParam,param);
  if(objParam.method=="post" && (objParam.data==undefined || objParam.data==""))
    objParam.data=null;
  if(objParam.data!=null && typeof objParam.data=="object")
    objParam.data=makeParam(objParam.data);
  if(objParam.mime && (objParam.mime.toLowerCase().startsWith("gb") || objParam.mime.toLowerCase().startsWith("utf")))
    objParam.mime="text/plain;charset=" + objParam.mime;
  var xhr=new XMLHttpRequest();
  xhr.responseType=objParam.type;
  if(objParam.mime) xhr.overrideMimeType(objParam.mime);
  xhr.open(objParam.method,url,true);
  if(objParam.headers){
    let arHeaders=Object.entries(objParam.headers);
    for(let [ar1,ar2] of arHeaders)
      xhr.setRequestHeader(ar1,ar2);
  }
  if(objParam.method=="post"){
    if(!objParam.headers || !objParam.headers["Content-Type"])
      xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  }
  if(objParam.method=="get")
    xhr.send();
  else
    xhr.send(objParam.data);
  if(callback && typeof callback=="function"){
    xhr.onload=function(){
       if(xhr.status==200)
         callback(xhr.response);
    };
  }else{
    return new Promise(function(resolve,reject){
      xhr.onload=function(){
        if(xhr.status==200)
          resolve(xhr.response);
        else
          reject(xhr.status + ": " + xhr.statusText);
      };
      xhr.onerror=function(){
        reject(xhr.status + ": " + xhr.statusText);
      };
    });
  }
  function makeParam(obj){
    var str="";
    var ar=Object.entries(obj);
    for(let i=0;i<ar.length;i++){
      if(i>0) str+="&"
      str+=ar[i][0] + "=" + ar[i][1];
    }
    return str;
  }
}
get.info=function(){
  alert("get(url,callback,param)");
}
