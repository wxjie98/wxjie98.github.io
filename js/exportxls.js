//����excel�ļ�
function exportExcel(id,filename){
    var csv = table2csv(id);
    var sheet = csv2sheet(csv);
    var blob = sheet2blob(sheet);
    openDownloadDialog(blob, filename+'.xlsx');
}
//tableתcsv
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
//csvתsheet����
function csv2sheet(csv) {
    var sheet = {}; // ��Ҫ���ɵ�sheet
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
//sheetתexcel�ļ�blob����
function sheet2blob(sheet, sheetName){
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // ����excel��������
    var wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    // �ַ���תArrayBuffer
    function s2ab(s){
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
    }
    return blob;
}
//�����ļ���urlΪ���ص�ַ��blob����;saveNameΪ�����ļ���,��ѡ��
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
