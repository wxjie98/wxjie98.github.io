//导出excel文件
function exportExcel(id,filename){
    var csv = table2csv(id);
    var sheet = csv2sheet(csv);
    var blob = sheet2blob(sheet);
    openDownloadDialog(blob, filename+'.xlsx');
}
//table转csv
function table2csv(id){
    var csv = [];
    $('#'+id).find('tr').each(function(){
        var temp = [];
        $(this).find('td').each(function(){
            temp.push($(this).html());
        });
        csv.push(temp.join(','));
    });
    return csv.join('\n');
}
//csv转sheet对象
function csv2sheet(csv) {
    var sheet = {}; // 将要生成的sheet
    csv = csv.split('\n');
    csv.forEach(function(row, i){
        row = row.split(',');
        if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+csv.length;
        row.forEach(function(col, j){
            sheet[String.fromCharCode(65+j)+(i+1)] = {v: col};
        });
    });
    return sheet;
}
//sheet转excel文件blob对象
function sheet2blob(sheet, sheetName){
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    // 字符串转ArrayBuffer
    function s2ab(s){
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
    }
    return blob;
}
//保存文件（url为下载地址或blob对象;saveName为保存文件名,可选）
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
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}
