let excelHandler = {
    getExcelFileName : function(){
        return 'table-test.xlsx';
    },
    getSheetName : function(){
        return 'Table Test Sheet';
    },
    getExcelData : function(){
        return document.getElementById('tableData');
    },
    getWorksheet : function(){
        return XLSX.utils.table_to_sheet(this.getExcelData());
    }
}

function s2ab(s) { 

    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer

    var view = new Uint8Array(buf);  //create uint8array as viewer

    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
    }

function exportExcel() {
    //1. Create workbook
    let wb = XLSX.utils.book_new();

    //2. Create sheet
    let newWorkSheet = excelHandler.getWorksheet();

    //3. naming Workbook & sheet
    XLSX.utils.book_append_sheet(wb, newWorkSheet, excelHandler.getSheetName());

    //4. Create Excel file
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    //5. Export excel file
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), excelHandler.getExcelFileName());
}




$(document).ready(function() { 
    $("#excelFileExport").click(function(){
        exportExcel();
    });
});