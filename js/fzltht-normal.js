﻿(function (jsPDFAPI) {
var callAddFont = function () {
this.addFileToVFS('fzltht-normal.ttf', font);
this.addFont('fzltht-normal.ttf', 'fzltht', 'normal');
};
jsPDFAPI.events.push(['addFonts', callAddFont])
 })(jsPDF.API);