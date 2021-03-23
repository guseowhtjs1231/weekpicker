if (typeof console === "undefined") {
    this.console = { log: function () { } }; // create blank function for older IE version (IE9)
}

let exColors = [
    "#009496", "#a48ef0", "#c0b283", "#4fc3f7", "#E91E63", "#9FA8DA", "#B9770E", "#1428a0", "#1b5e20", "#8d6e63",
    "#ffa000", "#444444", "#6E2C00", "#33691E", "#F57F17", "#8bbbf6", "#806bc8", "#d8c4a9", "#03a9f4", "#C2185B",
    "#C62828", "#4CAF50", "#1b2d6b", "#689f38", "#aa3172", "#bf360c", "#666666", "#EF9A9A", "#1A237E", "#784212",
    "#75acef", "#5b43ad", "#96858f", "#0288d1", "#AD1457", "#D32F2F", "#AED581", "#26A69A", "#a9b3cc", "#8bc34a",
    "#880e4f", "#e64a19", "#888888", "#E57373", "#303F9F", "#935116", "#6783fd", "#402991", "#4e342e", "#80CBC4",
    "#E53935", "#81C784", "#00897B", "#7a8ab1", "#4bcfc2", "#e57373", "#ff7043", "#bbbbbb", "#F48FB1", "#3F51B5",
    "#2764e3", "#827717", "#6d4c41", "#ffca28", "#b0a5a2", "#b0a5a2", "#EF5350", "#388E3C", "#00796B", "#5e6984",
    "#17b3c6", "#e53935", "#e9955b", "#18b3c7", "#F06292", "#7986CB"];

function newTab(url) {
    let wid = window.open(url);
    if (wid !== undefined && wid !== null) {
        wid.focus();
    }
}

function isInt(value) {
    let x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

function isPhoneNumber(inputtxt) {
    let phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneno.test(inputtxt);
}

function getPhoneNumber(inputNum) {
    if (!inputNum) return '';
    let num = inputNum.replace(/[^\d]/g, '');
    if (num.length < 10) return inputNum;
    return num.substring(0, num.length - 7) + '-' + num.substring(num.length - 7, num.length - 4) + '-' + num.substring(num.length - 4, num.length);
}

function isEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function sortJSON(data, key1, asc, sortType) {
    if (!data) return [];
    if (!sortType) sortType = 'S';
    if (!asc) asc = true;
    return data.sort(function (a, b) {
        let x = (sortType === 'N' ? (!a[key1] || isNaN(a[key1]) ? null : Number(a[key1])) : a[key1].toUpperCase());
        let y = (sortType === 'N' ? (!b[key1] || isNaN(b[key1]) ? null : Number(b[key1])) : b[key1].toUpperCase());
        if (x === null & y === null) return 0;
        if (x === null & y !== null) return (asc ? -1 : 1);
        if (x !== null & y === null) return (asc ? 1 : -1);
        if (asc) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        else { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}

function sortJSON1(data, key1, asc) {
    if (!data) return [];

    return data.sort(function (a, b) {
        if (!asc) asc = true;
        let x = !a[key1] ? null : typeof a[key1] === 'number' ? a[key1] : a[key1].toUpperCase();
        let y = !b[key1] ? null : typeof b[key1] === 'number' ? b[key1] : b[key1].toUpperCase();
        if (x === null & y === null) return 0;
        if (x === null & y !== null) return (asc ? -1 : 1);
        if (x !== null & y === null) return (asc ? 1 : -1);
        if (asc) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        else { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}

function sortJSON2(data, key1, key2, asc) {
    if (data === undefined || data === null) return [];

    return data.sort(function (a, b) {
        if (asc === undefined) asc = true;
        let x1 = a[key1] === undefined || a[key1] === null ? null : typeof a[key1] === 'number' ? a[key1] : a[key1].toUpperCase();
        let y1 = b[key1] === undefined || b[key1] === null ? null : typeof b[key1] === 'number' ? b[key1] : b[key1].toUpperCase();
        let x2 = a[key2] === undefined || a[key2] === null ? null : typeof a[key2] === 'number' ? a[key2] : a[key2].toUpperCase();
        let y2 = b[key2] === undefined || b[key2] === null ? null : typeof b[key2] === 'number' ? b[key2] : b[key2].toUpperCase();
        if (x1 === undefined || x1 === null) x1 = '';
        if (y1 === undefined || y1 === null) y1 = '';
        if (x2 === undefined || x2 === null) x2 = '';
        if (y2 === undefined || y2 === null) y2 = '';
        if (asc) { return ((x1 < y1) ? -1 : ((x1 > y1) ? 1 : (x2 < y2 ? -1 : (x2 > y2 ? 1 : 0)))); }
        else { return ((x1 > y1) ? -1 : ((x1 < y1) ? 1 : x2 > y2 ? -1 : (x2 < y2 ? 1 : 0))); }
    });
}

Date.prototype.addHours = function (hours) {
    let dat = new Date(this.valueOf());
    dat.setHours(dat.getHours() + hours);
    return dat;
};

Date.prototype.addDays = function (days) {
    let dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.addMonths = function (months) {
    let dat = new Date(this.valueOf());
    dat.setMonth(dat.getMonth() + months);
    return dat;
};

Number.prototype.ceiling = function (decimalpoint) {
    let num = this.valueOf();
    return Math.ceil(num * Math.pow(10, decimalpoint)) / Math.pow(10, decimalpoint);
};

Number.prototype.floor = function (decimalpoint) {
    let num = this.valueOf();
    return Math.floor(num * Math.pow(10, decimalpoint)) / Math.pow(10, decimalpoint);
};

let docCookies = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, sPath, vEnd, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        let sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + "; SameSite=Strict" + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + "; SameSite=Strict";
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        let aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};

let operator = [{ value: 'between', display: 'between' },
{ value: '>', display: 'greater than' },
{ value: '>=', display: 'greater then or equal to' },
{ value: 'is not null', display: 'has a value' },
{ value: 'is null', display: 'has no value' },
{ value: '=', display: 'is equal to' },
{ value: '<>', display: 'is not equal to' },
{ value: 'in', display: 'is one of' },
{ value: '<', display: 'less than' },
{ value: '<=', display: 'less than or equal to' }];

function mainfunc(func) {
    if (func === undefined || func === null || func === '') return;
    this[func].apply(this, Array.prototype.slice.call(arguments, 1));
}

let nProcessing = 0;
function showProcessing(ajaxFuncName, objName, objProcessing) {
    let today = new Date();
    if (objName !== undefined && objName !== null) $('#' + objName).hide();
    if (objProcessing !== undefined && objProcessing !== null) $('#' + objProcessing).show();
    console.log((typeof formatDate === 'undefined' ? today : formatDate(today, "yyyyMMddHHmmss")) + " - " + ajaxFuncName + " in");
    nProcessing++;
    $('#processing_alert').html("Processing..." + nProcessing);
    $('#processing_alert').show();
}

function hideProcessing(ajaxFuncName, objName, objProcessing) {
    let today = new Date();
    console.log((typeof formatDate === 'undefined' ? today : formatDate(today, "yyyyMMddHHmmss")) + " - " + ajaxFuncName + " out");
    nProcessing = (nProcessing > 0 ? nProcessing - 1 : nProcessing);
    if (nProcessing === 0) {
        $('#processing_alert').hide();
    }
    else {
        $('#processing_alert').html("Processing..." + nProcessing);
        $('#processing_alert').show();
    }
    if (objName !== undefined && objName !== null) $('#' + objName).show();
    if (objProcessing !== undefined && objProcessing !== null) $('#' + objProcessing).hide();
}

let onError = function (jqxhr, status, thrown) {
    setJSError("error in Ajax", thrown, jqxhr.responseText);
    console.log("error in Ajax" + jqxhr.responseText);
};

function showAlert(message, title, redirectUrl) {
    if (title === undefined) title = "Alert";
    let objAlert = $('#centerpopup99');
    if (objAlert === undefined || objAlert === null || objAlert.length === 0)
        alert(message);
    else {
        $('#title99').empty().html(title);
        $('#message99').empty().html(message);
        $('#footer99').empty();
        $('#graybackground99').show();
        $('#centerpopup99').show();
        if (redirectUrl !== undefined && redirectUrl !== null && redirectUrl !== '')
            $('#popupX99 a').attr("href", redirectUrl);
        else
            $('#popupX99 a').attr("href", "javascript:hide99();");
    }
}

function hide99() { // do not use direct function in the href. it makes an error. do not use like <a href="javascript:$('#graybackground99').hide();$('#centerpopup99').hide();">Close</a>
    $('#graybackground99').hide();
    $('#centerpopup99').hide();
}

function hide79() { // do not use direct function in the href. it makes an error. do not use like <a href="javascript:$('#graybackground99').hide();$('#centerpopup99').hide();">Close</a>
    $('#graybackground79').hide();
    $('#centerpopup79').hide();
}

function getCurLocalTime() {
    let curTime = '';
    let ajaxFuncName = "/Ajax/GetCurLocalTime.ashx";
    showProcessing(ajaxFuncName);
    $.ajax({
        type: "POST",
        url: ajaxFuncName, // do not use session buffer to show the latest inquiry
        data: {},
        dataType: 'text',
        async: false,
        success: function (strResponse) {
            hideProcessing(ajaxFuncName);
            curTime = strResponse; // yyyymmddhhmiss format
        },
        error: function (jqxhr, status, thrown) {
            setJSError(ajaxFuncName, thrown, jqxhr.responseText);
        }
    });

    return curTime;
}

function getLocalTime(format, dat) {
    let today = new Date();
    if (dat !== undefined && dat !== null) today = dat;
    let yyyy = today.getFullYear();
    let yy = yyyy % 100;
    let mm = today.getMonth() + 1; //January is 0!
    let dd = today.getDate();
    let hh = today.getHours();
    let mi = today.getMinutes();
    let ss = today.getSeconds();

    if (yy < 10) yy = '0' + yy;
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    if (hh < 10) hh = '0' + hh;
    if (mi < 10) mi = '0' + mi;
    if (ss < 10) ss = '0' + ss;

    let retVal = format;
    retVal = retVal.replace("yyyy", yyyy);
    retVal = retVal.replace("yy", yy);
    retVal = retVal.replace("mm", mm);
    retVal = retVal.replace("dd", dd);
    retVal = retVal.replace("hh", hh);
    retVal = retVal.replace("mi", mi);
    retVal = retVal.replace("ss", ss);
    return retVal;
}

function changeTimeFormat(yyyymmddhhmiss, format) {
    let retVal = format.toLowerCase();
    retVal = retVal.replace("yyyy", yyyymmddhhmiss.substring(0, 4));
    retVal = retVal.replace("yy", yyyymmddhhmiss.substring(2, 4));
    retVal = retVal.replace("mm", yyyymmddhhmiss.substring(4, 6));
    retVal = retVal.replace("dd", yyyymmddhhmiss.substring(6, 8));
    retVal = retVal.replace("hh", yyyymmddhhmiss.substring(8, 10));
    retVal = retVal.replace("mi", yyyymmddhhmiss.substring(10, 12));
    retVal = retVal.replace("ss", yyyymmddhhmiss.substring(12, 14));
    return retVal;
}

function xmlEncode(string) {
    if (string === undefined || string === null) return "";
    //return string.replace(/\&/g,'&'+'amp;').replace(/</g,'&'+'lt;').replace(/>/g,'&'+'gt;').replace(/\'/g,'&'+'apos;').replace(/\"/g,'&'+'quot;'); // in IE8, there is a problem to show &apos;
    return string.replace(/\&/g, '&' + 'amp;').replace(/</g, '&' + 'lt;').replace(/>/g, '&' + 'gt;');
}

function setJSError(module, err, ref) {
    toast(ref ? ref : 'Error in JS of ' + module, "error");

    let ajaxFuncName = "/Ajax/SetJSError.ashx";
    //showProcessing(ajaxFuncName);
    $.ajax({
        type: "POST",
        url: ajaxFuncName,
        data: {
            module: module,
            err: err,
            ref: (ref === undefined) ? '' : xmlEncode(ref)
        },
        dataType: 'text',
        async: false,
        success: function (strResponse) {
            //hideProcessing(ajaxFuncName);
        }
    });
}

// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand !== undefined ? thousand : ",";
    decimal = decimal !== undefined ? decimal : ".";
    var number = this, // do not change var -> let, due to 'j' variable
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

function showLog(mesg) {
    $('#show_log').html(mesg);
    $('#show_log').show();
}

// lpad(10, 4);      // 0010
// lpad(9, 4);       // 0009
// lpad(123, 4);     // 0123
// lpad(10, 4, '-'); // --10
function lpad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

String.prototype.trimStart2 = function (character) {
    let startIndex = 0;
    while (this[startIndex] === character) {
        startIndex++;
    }

    return this.substr(startIndex);
};

jQuery.fn.center = function () {
    this.css("position", "fixed");
    this.css("top", (jQuery(window).height() - this.height()) / 2 + jQuery(window).scrollTop() + "px");
    this.css("left", (jQuery(window).width() - this.width()) / 2 + jQuery(window).scrollLeft() + "px");
    return this;
}

function copyToClipboard(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function copyToClipboardByText(text) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

function fnExcelReport(tableId) {
    let tab_text = "<table border='2px'>";
    let textRange; let j = 0;
    tab = document.getElementById(tableId); // id of table

    for (j = 0; j < tab.rows.length; j++) {
        tab_text += "\r\n" + (j === 0 ? "<tr bgcolor='#87AFC6'>" : "<tr>") + tab.rows[j].innerHTML + "</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<a[^>]*>|<\/a>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    // remove filter row
    tab_text = tab_text.replace(/<label class="filter_label[^>]*>[^>]*<\/label>/g, "");
    tab_text = tab_text.replace(/<li class="filter_row[^>]*>[^>]*<\/li>/g, "");
    tab_text = tab_text.replace(/<ul id="filter[^>]*>[^>]*<\/ul>/g, "");
    tab_text = tab_text.replace(/<div class="filter_box[^>]*>[^>]*<\/div>/g, "");
    tab_text = tab_text.replace(/<div class="filter_wrap[^>]*>[^>]*<\/div>/g, "");

    let ua = window.navigator.userAgent;
    let msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        excelArea.document.open("txt/html", "replace");
        excelArea.document.write(tab_text);
        excelArea.document.close();
        excelArea.focus();
        sa = excelArea.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
    }
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

    return (sa);
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// get the master data value
function getAjaxResponse(url, dataType, param1, value1, param2, value2, param3, value3, param4, value4, param5, value5, param6, value6) {
    try {
        let fullUrl = url;
        if (param1) fullUrl += "?" + param1 + "=" + value1;
        if (param2) fullUrl += "&" + param2 + "=" + value2;
        if (param3) fullUrl += "&" + param3 + "=" + value3;
        if (param4) fullUrl += "&" + param4 + "=" + value4;
        if (param5) fullUrl += "&" + param5 + "=" + value5;
        if (param6) fullUrl += "&" + param6 + "=" + value6;
        if (typeof (Storage) !== "undefined") { // HTML5 local storage
            if (localStorage.getItem(fullUrl) !== null) {
                if (dataType === 'json')
                    return JSON.parse(localStorage.getItem(fullUrl));
                else
                    return localStorage.getItem(fullUrl);
            }
        }

        let paramval = {};
        if (param1) paramval[param1] = value1;
        if (param2) paramval[param2] = value2;
        if (param3) paramval[param3] = value3;
        if (param4) paramval[param4] = value4;
        if (param5) paramval[param5] = value5;
        if (param6) paramval[param6] = value6;
        let respone;
        let ajaxFuncName = url;
        showProcessing(ajaxFuncName);
        $.ajax({
            type: "POST",
            url: ajaxFuncName,
            data: paramval,
            dataType: dataType,
            async: false,
            success: function (dsResponse) {
                hideProcessing(ajaxFuncName);
                if (dataType === 'json')
                    localStorage.setItem(fullUrl, JSON.stringify(dsResponse));
                else
                    localStorage.setItem(fullUrl, dsResponse);
                respone = dsResponse;
            },
            error: function (jqxhr, status, thrown) {
                setJSError(ajaxFuncName, thrown, jqxhr.responseText);
            }
        });
        return respone;
    }
    catch (err) {
        setJSError("getAjaxResponse", err);
    }
}

// get the master data value
function getAjaxResponseAsync(funcSuccess, funcError, url, dataType, param1, value1, param2, value2, param3, value3, param4, value4, param5, value5) {
    try {
        let fullUrl = url;
        if (param1) fullUrl += "?" + param1 + "=" + value1;
        if (param2) fullUrl += "&" + param2 + "=" + value2;
        if (param3) fullUrl += "&" + param3 + "=" + value3;
        if (param4) fullUrl += "&" + param4 + "=" + value4;
        if (param5) fullUrl += "&" + param5 + "=" + value5;
        if (typeof (Storage) !== "undefined") { // HTML5 local storage
            if (localStorage.getItem(fullUrl) !== null) {
                let response = "";
                if (dataType === 'json')
                    response = JSON.parse(localStorage.getItem(fullUrl));
                else
                    response = localStorage.getItem(fullUrl);

                if (funcSuccess !== undefined && funcSuccess !== null) {
                    funcSuccess(response);
                }
                return;
            }
        }

        let paramval = {};
        if (param1) paramval[param1] = value1;
        if (param2) paramval[param2] = value2;
        if (param3) paramval[param3] = value3;
        if (param4) paramval[param4] = value4;
        if (param5) paramval[param5] = value5;
        let ajaxFuncName = url;
        showProcessing(ajaxFuncName);
        $('#notify_loading').show();
        $.ajax({
            type: "POST",
            url: ajaxFuncName,
            data: paramval,
            dataType: dataType,
            async: true,
            success: function (dsResponse) {
                $('#notify_loading').hide();
                hideProcessing(ajaxFuncName);
                if (dataType === 'json')
                    localStorage.setItem(fullUrl, JSON.stringify(dsResponse));
                else
                    localStorage.setItem(fullUrl, dsResponse);
                if (funcSuccess !== undefined && funcSuccess !== null) {
                    funcSuccess(dsResponse);
                }
            },
            error: function (jqxhr, status, thrown) {
                setJSError(ajaxFuncName, thrown, jqxhr.responseText);
                $('#notify_loading').hide();
                if (funcError !== undefined && funcError !== null) {
                    funcError();
                }
            }
        });
        return;
    }
    catch (err) {
        setJSError("getAjaxResponseAsync", err);
    }
}

// get the master data value not checking the local storage
function getAjaxResponse2(url, dataType, param1, value1, param2, value2, param3, value3, param4, value4, param5, value5, param6, value6, param7, value7, param8, value8, param9, value9) {
    try {
        let paramval = {};
        if (param1) paramval[param1] = value1;
        if (param2) paramval[param2] = value2;
        if (param3) paramval[param3] = value3;
        if (param4) paramval[param4] = value4;
        if (param5) paramval[param5] = value5;
        if (param6) paramval[param6] = value6;
        if (param7) paramval[param7] = value7;
        if (param8) paramval[param8] = value8;
        if (param9) paramval[param9] = value9;
        let respone;
        let ajaxFuncName = url;
        showProcessing(ajaxFuncName);
        $.ajax({
            type: "POST",
            url: ajaxFuncName,
            data: paramval,
            dataType: dataType,
            async: false,
            success: function (dsResponse) {
                hideProcessing(ajaxFuncName);
                //if (dataType === 'json')
                //    localStorage.setItem(fullUrl, JSON.stringify(dsResponse));
                //else
                //    localStorage.setItem(fullUrl, dsResponse);
                respone = dsResponse;
            },
            error: function (jqxhr, status, thrown) {
                setJSError(ajaxFuncName, thrown, jqxhr.responseText);
            }
        });
        return respone;
    }
    catch (err) {
        setJSError("getAjaxResponse2", err);
    }
}

function clearAjaxResponse(url) {
    let keys = Object.keys(localStorage);
    for (let i = keys.length - 1; i >= 0; i--) {
        if (keys[i].indexOf(url) === 0) {
            localStorage.removeItem(keys[i]);
        }
    }
}

function HtmlEncode(s) {
    let el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}

function toast(text, type) {
    if (type === 'error' || type === 'success' || type === 'warning' || type === 'info') {
        let heading = type.substr(0, 1).toUpperCase() + type.substr(1);
        $.toast({
            heading: heading,
            text: text,
            showHideTransition: 'fade',
            position: 'top-center',
            stack: 10,
            icon: type,
            hideAfter: 7000
        });
    }
    else {
        $.toast({
            text: text,
            position: 'top-center',
            stack: 10
        });
    }
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    if (evt !== undefined && evt !== null)
        evt.currentTarget.className += " active";
    else
        $('#tab_' + tabName).addClass("active");

    return false;
}

function getInitial(Names) {
    if (Names === undefined || Names === null) return '';
    let tokens = Names.trim().split(' ');

    let initial = '';
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '') continue;
        initial += tokens[i].substring(0, 1);
    }

    return initial;
}

function populateValue(elementId, elementValue) {
    if (elementId === undefined || elementId === null || elementId === '') return;
    if (elementValue === undefined || elementValue === null || elementValue === '') return;

    $('#' + elementId).val(elementValue);
}

// Dropdown Button Function
function toggleDropDown(selectPartCompany) {
    document.getElementById(selectPartCompany).classList.toggle("show_drop_down");
    return false;
}

window.onclick = function (event) {
    if (!event.target.matches) return;
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show_drop_down')) {
                openDropdown.classList.remove('show_drop_down');
            }
        }
    }
}

function getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

function exClone(obj) {
    if (obj === null || typeof (obj) !== 'object')
        return obj;
    let temp = obj.constructor();
    for (let key in obj)
        temp[key] = exClone(obj[key]);
    return temp;
}

printPdf = function (url) {
    let iframe = this._printIframe;
    if (!this._printIframe) {
        iframe = this._printIframe = document.createElement('iframe');
        document.body.appendChild(iframe);

        iframe.style.display = 'none';
        iframe.onload = function () {
            setTimeout(function () {
                iframe.focus();
                iframe.contentWindow.print();
            }, 1);
        };
    }

    iframe.src = url;
}

function exMakeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) {
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
    }
    return el;
}