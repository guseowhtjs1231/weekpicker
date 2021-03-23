// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download. 
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================

// HISTORY
// ------------------------------------------------------------------
// May 17, 2003: Fixed bug in parseDate() for dates <1970
// March 11, 2003: Added parseDate() function
// March 11, 2003: Added "NNN" formatting option. Doesn't match up
//                 perfectly with SimpleDateFormat formats, but 
//                 backwards-compatability was required.

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the 
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
// 
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

let MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
let DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
function LZ(x) { return (x < 0 || x > 9 ? "" : "0") + x; }

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

//Returns the week number for this date.  dowOffset is the day of week the week
//"starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
//the week returned is the ISO 8601 week number.
//@param int dowOffset
//@return int
Date.prototype.getWeek = function (dowOffset) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

    dowOffset = (typeof dowOffset === 'number' ? dowOffset : 0); //default dowOffset to zero
    let newYear = new Date(this.getFullYear(), 0, 1);
    let day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    let daynum = Math.floor((this.getTime() - newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
    let weeknum;
    //if the year starts before the middle of a week
    if (day < 4) {
        weeknum = Math.floor((daynum + day - 1) / 7) + 1;
        //if (weeknum > 52) {
        //    nYear = new Date(this.getFullYear() + 1, 0, 1);
        //    nday = nYear.getDay() - dowOffset;
        //    nday = nday >= 0 ? nday : nday + 7;
        //    /*if the next year starts before the middle of
        //      the week, it is week #1 of that year*/
        //    weeknum = nday < 4 ? 1 : 53;
        //}
    }
    else {
        weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
};

// ------------------------------------------------------------------
// isDate ( date_string, format_string )
// Returns true if date string matches format of format string and
// is a valid date. Else returns false.
// It is recommended that you trim whitespace around the value before
// passing it to this function, as whitespace is NOT ignored!
// ------------------------------------------------------------------
function isDate(val, format) {
    let date = getTimeFromFormat(val, format);
    if (date === 0) { return false; }
    return true;
}

// -------------------------------------------------------------------
// compareDates(date1,date1format,date2,date2format)
//   Compare two date strings to see which is greater.
//   Returns:
//   1 if date1 is greater than date2
//   0 if date2 is greater than date1 of if they are the same
//  -1 if either of the dates is in an invalid format
// -------------------------------------------------------------------
function compareDates(date1, dateformat1, date2, dateformat2) {
    let t1 = getTimeFromFormat(date1, dateformat1);
    let t2 = getTimeFromFormat(date2, dateformat2);
    if (t1 === 0 || t2 === 0) {
        return -1;
    }
    else if (t1 > t2) {
        return 1;
    }
    return 0;
}

// -------------------------------------------------------------------
// diffDates(diffType,date1,date1format,date2,date2format)
//   Compare two date strings to see which is greater.
//   diffType: y, M, d, H, m, s
//   Returns:
//   date2 - date1
//   Number.MIN_SAFE_INTEGER if either of the dates is in an invalid format
// -------------------------------------------------------------------
function diffDates(diffType, date1, dateformat1, date2, dateformat2) {
    let t1 = getTimeFromFormat(date1, dateformat1);
    let t2 = getTimeFromFormat(date2, dateformat2);
    if (t1 === 0 || t2 === 0) {
        return Number.MIN_SAFE_INTEGER;
    }

    let dt1 = new Date(t1);
    let dt2 = new Date(t2);

    let y1 = dt1.getYear();
    let M1 = dt1.getMonth() + 1;
    //let d1 = dt1.getDate();
    //let H1 = dt1.getHours();
    //let m1 = dt1.getMinutes();
    //let s1 = dt1.getSeconds();

    let y2 = dt2.getYear();
    let M2 = dt2.getMonth() + 1;
    //let d2 = dt2.getDate();
    //let H2 = dt2.getHours();
    //let m2 = dt2.getMinutes();
    //let s2 = dt2.getSeconds();

    if (diffType === 'y') return y2 - y1;
    else if (diffType === 'M') return (y2 * 12 + M2) - (y1 * 12 + M1);
    else if (diffType === 'd') return ((t2 - (t2 % (24 * 60 * 60 * 1000))) - (t1 - (t1 % (24 * 60 * 60 * 1000)))) / (24 * 60 * 60 * 1000);
    else if (diffType === 'H') return ((t2 - (t2 % (60 * 60 * 1000))) - (t1 - (t1 % (60 * 60 * 1000)))) / (60 * 60 * 1000);
    else if (diffType === 'm') return ((t2 - (t2 % (60 * 1000))) - (t1 - (t1 % (60 * 1000)))) / (60 * 1000);
    else if (diffType === 's') return ((t2 - (t2 % 1000)) - (t1 - (t1 % 1000))) / 1000;

    return Number.MIN_SAFE_INTEGER;
}

// ------------------------------------------------------------------
// formatDate (date_object, format)
// Returns a date in the output format specified.
// The format string uses the same abbreviations as in getTimeFromFormat()
// ------------------------------------------------------------------
function formatDate(date, format) {
    if (date === undefined || date === null) return '';
    format = format + "";
    let result = "";
    let i_format = 0;
    let c = "";
    let token = "";
    if (typeof date === 'string') {
        let sDate = date;
        date = getDateFromFormat(sDate, 'yyyy-MM-ddTHH:mm:ss.fffZ');
        if (date === 0)
            date = getDateFromFormat(sDate, 'yyyy-MM-ddTHH:mm:ss.fff');
        if (date === 0)
            date = getDateFromFormat(sDate, 'yyyy-MM-ddTHH:mm:ss.fff+0000');
        if (date === 0)
            date = getDateFromFormat(sDate, 'yyyy-MM-dd HH:mm:ss.0');
        if (date === 0)
            date = getDateFromFormat(sDate, 'yyyy-MM-dd');
        if (date === 0)
            date = getDateFromFormat(sDate, 'MM/dd/yyyy');
        if (date === 0)
            date = getDateFromFormat(sDate, 'MM-dd-yyyy');
        if (date === 0)
            date = getDateFromFormat(sDate, 'yyyyMMdd');
        if (date === 0)
            date = getDateFromFormat(sDate, 'yyyyMMddHHmmss');
    }
    else if (typeof date === 'number') {
        date = new Date(date);
    }
    let y = date.getYear() + "";
    let M = date.getMonth() + 1;
    let W = date.addDays(-1).getWeek();
    let d = date.getDate();
    let E = date.getDay();
    let H = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let yyyy, yy, MMM, MM, ww, dd, hh, h, mm, ss, ampm, HH, KK, K, kk, k;
    // Convert real date parts into formatted versions
    let value = new Object();
    if (y.length < 4) { y = "" + (y - 0 + 1900); }
    value["y"] = "" + y;
    value["yyyy"] = y;
    value["yy"] = y.substring(2, 4);
    value["M"] = M;
    value["MM"] = LZ(M);
    value["MMM"] = MONTH_NAMES[M - 1];
    value["NNN"] = MONTH_NAMES[M + 11];
    value["ww"] = W > 9 ? W : '0' + W;
    value["d"] = d;
    value["dd"] = LZ(d);
    value["E"] = DAY_NAMES[E + 7];
    value["EE"] = DAY_NAMES[E];
    value["H"] = H;
    value["HH"] = LZ(H);
    if (H === 0) { value["h"] = 12; }
    else if (H > 12) { value["h"] = H - 12; }
    else { value["h"] = H; }
    value["hh"] = LZ(value["h"]);
    if (H > 11) { value["K"] = H - 12; } else { value["K"] = H; }
    value["k"] = H + 1;
    value["KK"] = LZ(value["K"]);
    value["kk"] = LZ(value["k"]);
    if (H > 11) { value["a"] = "PM"; }
    else { value["a"] = "AM"; }
    value["m"] = m;
    value["mm"] = LZ(m);
    value["s"] = s;
    value["ss"] = LZ(s);
    while (i_format < format.length) {
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) === c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] !== undefined && value[token] !== null) { result = result + value[token]; }
        else { result = result + token; }
    }
    return result;
}

// ------------------------------------------------------------------
// Utility functions for parsing in getTimeFromFormat()
// ------------------------------------------------------------------
function _isInteger(val) {
    let digits = "1234567890";
    for (let i = 0; i < val.length; i++) {
        if (digits.indexOf(val.charAt(i)) === -1) { return false; }
    }
    return true;
}
function _getInt(str, i, minlength, maxlength) {
    for (let x = maxlength; x >= minlength; x--) {
        let token = str.substring(i, i + x);
        if (token.length < minlength) { return null; }
        if (_isInteger(token)) { return token; }
    }
    return null;
}

// ------------------------------------------------------------------
// getTimeFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the 
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------
function getTimeFromFormat(val, format) {
    let date = getDateFromFormat(val, format);

    if (date === 0) return 0;
    return date.getTime();
}

// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the 
// the date. If it does not match, it returns 0.
// ------------------------------------------------------------------
function getDateFromFormat(val, format) {
    let i;
    val = val + "";
    format = format + "";
    let i_val = 0;
    let i_format = 0;
    let c = "";
    let token = "";
    let token2 = "";
    let x, y;
    let now = new Date();
    let year = now.getYear();
    let month = now.getMonth() + 1;
    let date = 1;
    let hh = 0;
    let mm = 0;
    let ss = 0;
    let fff = 0;
    let ampm = "";

    while (i_format < format.length) {
        // Get next token from format string
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) === c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        // Extract contents of value based on format token
        if (token === "yyyy" || token === "yy" || token === "y") {
            if (token === "yyyy") { x = 4; y = 4; }
            if (token === "yy") { x = 2; y = 2; }
            if (token === "y") { x = 2; y = 4; }
            year = _getInt(val, i_val, x, y);
            if (year === null) { return 0; }
            i_val += year.length;
            if (year.length === 2) {
                if (year > 70) { year = 1900 + (year - 0); }
                else { year = 2000 + (year - 0); }
            }
        }
        else if (token === "MMM" || token === "NNN") {
            month = 0;
            for (i = 0; i < MONTH_NAMES.length; i++) {
                let month_name = MONTH_NAMES[i];
                if (val.substring(i_val, i_val + month_name.length).toLowerCase() === month_name.toLowerCase()) {
                    if (token === "MMM" || (token === "NNN" && i > 11)) {
                        month = i + 1;
                        if (month > 12) { month -= 12; }
                        i_val += month_name.length;
                        break;
                    }
                }
            }
            if ((month < 1) || (month > 12)) { return 0; }
        }
        else if (token === "EE" || token === "E") {
            for (i = 0; i < DAY_NAMES.length; i++) {
                let day_name = DAY_NAMES[i];
                if (val.substring(i_val, i_val + day_name.length).toLowerCase() === day_name.toLowerCase()) {
                    i_val += day_name.length;
                    break;
                }
            }
        }
        else if (token === "MM" || token === "M") {
            month = _getInt(val, i_val, token.length, 2);
            if (month === null || (month < 1) || (month > 12)) { return 0; }
            i_val += month.length;
        }
        else if (token === "dd" || token === "d") {
            date = _getInt(val, i_val, token.length, 2);
            if (date === null || (date < 1) || (date > 31)) { return 0; }
            i_val += date.length;
        }
        else if (token === "hh" || token === "h") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh === null || (hh < 1) || (hh > 12)) { return 0; }
            i_val += hh.length;
        }
        else if (token === "HH" || token === "H") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh === null || (hh < 0) || (hh > 23)) { return 0; }
            i_val += hh.length;
        }
        else if (token === "KK" || token === "K") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh === null || (hh < 0) || (hh > 11)) { return 0; }
            i_val += hh.length;
        }
        else if (token === "kk" || token === "k") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh === null || (hh < 1) || (hh > 24)) { return 0; }
            i_val += hh.length; hh--;
        }
        else if (token === "mm" || token === "m") {
            mm = _getInt(val, i_val, token.length, 2);
            if (mm === null || (mm < 0) || (mm > 59)) { return 0; }
            i_val += mm.length;
        }
        else if (token === "ss" || token === "s") {
            ss = _getInt(val, i_val, token.length, 2);
            if (ss === null || (ss < 0) || (ss > 59)) { return 0; }
            i_val += ss.length;
        }
        else if (token === "fff") {
            fff = _getInt(val, i_val, token.length, 3);
            if (fff === null || (fff < 0) || (fff > 999)) { return 0; }
            i_val += fff.length;
        }
        else if (token === "a") {
            if (val.substring(i_val, i_val + 2).toLowerCase() === "am") { ampm = "AM"; }
            else if (val.substring(i_val, i_val + 2).toLowerCase() === "pm") { ampm = "PM"; }
            else { return 0; }
            i_val += 2;
        }
        else {
            if (val.substring(i_val, i_val + token.length) !== token) { return 0; }
            else { i_val += token.length; }
        }
    }
    // If there are any trailing characters left in the value, it doesn't match
    if (i_val !== val.length) { return 0; }
    // Is date valid for month?
    if (month === 2) {
        // Check for leap year
        if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) { // leap year
            if (date > 29) { return 0; }
        }
        else { if (date > 28) { return 0; } }
    }
    if ((month === 4) || (month === 6) || (month === 9) || (month === 11)) {
        if (date > 30) { return 0; }
    }
    // Correct hours value
    if (hh < 12 && ampm === "PM") { hh = hh - 0 + 12; }
    else if (hh > 11 && ampm === "AM") { hh -= 12; }
    return newdate = new Date(year, month - 1, date, hh, mm, ss, fff);
}

// ------------------------------------------------------------------
// parseDate( date_string [, prefer_euro_format] )
//
// This function takes a date string and tries to match it to a
// number of possible date formats to get the value. It will try to
// match against the following international formats, in this order:
// y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
// M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
// d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
// A second argument may be passed to instruct the method to search
// for formats like d/M/y (european format) before M/d/y (American).
// Returns a Date object or null if no patterns match.
// ------------------------------------------------------------------
function parseDate(val) {
    let preferEuro = (arguments.length === 2) ? arguments[1] : false;
    generalFormats = new Array('y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d', 'd-MMM-y', 'MMM d');
    monthFirst = new Array('M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d');
    dateFirst = new Array('d/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M');
    let checkList = new Array('generalFormats', preferEuro ? 'dateFirst' : 'monthFirst', preferEuro ? 'monthFirst' : 'dateFirst');
    let d = null;
    for (let i = 0; i < checkList.length; i++) {
        let l = window[checkList[i]];
        for (let j = 0; j < l.length; j++) {
            d = getTimeFromFormat(val, l[j]);
            if (d !== 0) { return new Date(d); }
        }
    }
    return null;
}

// sample
// let dateNum = Date.parse('2019-06-01');
// convertNum2Date(dateNum);
function convertNum2Date(val) {
    let date = new Date(val);
    //let y = date.getYear() + 1900;
    //let m = date.getMonth() + 1;
    //let d = date.getDate();

    return date;
}

function isValidHHmm(hhmm) {
    if (!hhmm) return false;
    if (hhmm.length !== 5) return false;

    let tokens = hhmm.split(':');
    if (tokens.length !== 2) return false;

    if (isNaN(tokens[0])) return false;
    let HH = parseInt(tokens[0]);
    if (HH < 0 || HH > 23) return false;

    if (isNaN(tokens[1])) return false;
    let MM = parseInt(tokens[1]);
    if (MM < 0 || MM > 59) return false;

    return true;
}