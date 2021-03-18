let exWPs = []; exWPID = 0
$.fn.Weekpicker = function (option) {
    let current_year = (new Date()).getFullYear();
    let current_month = (new Date()).getMonth();
    let id = new Date().getMilliseconds() + new Date().getMinutes();
    let fixedOption = _customSetting(option)

    $(this).parent().append(_htmlGenerate(id, fixedOption)).trigger("create");;

    $("#yearChange" + id).val(current_year);
    $("#monthChange" + id).val(current_month);
    
    changeYearMonth(current_year, current_month, id, fixedOption.showWeek, fixedOption.firstDay);
    
    $(this).addClass('ex-weekpicker ex-weekpicker-input '+id).attr("onclick","showWeekPicker("+id+")")

    $('body').on('click', function (e) {
        if ($(e.target).hasClass('ex-weekpicker') ||
            $(e.target).parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().parent().parent().hasClass('ex-weekpicker')||
            $(e.target).parent().parent().parent().parent().parent().hasClass('ex-weekpicker'))return;
        exCloseWeekPicker();
    });

    $("#ex-weekpicker-" + id).on("mousewheel", function(e){
        let E = e.originalEvent;
        let deltaY = E.wheelDelta
        let direction = Math.round(deltaY/120)
        
        y = Number($("#yearChange" + id).val());
        m = Number($("#monthChange" + id).val());
        if (direction > 0){
            m = m + 1
            console.log("스크롤 플러스될 때 :"+Math.round(direction/5))
            if (m == 12){
                y = y + 1
                m = 0
            }
        } else if(direction < 0){
            m = m - 1
            console.log("스크롤 마이너스 될 때 :"+Math.round(direction/5))
            if (m === -1){
                y = y - 1
                m = 11
            }
        }
        
        $("#yearChange" + id).val(y);
        $('#monthChange' + id).val(m);
        changeYearMonth(y, m, id, fixedOption.showWeek, fixedOption.firstDay)
    })
}
function showWeekPicker(id){
    $("#ex-weekpicker-" + id).toggle()
}
function getWeekNumber(nthWeek, id) {
    let yearValue = $('#yearChange'+ id).val()
    let selectedFormat = $("#formatOption"+ id).val()
    let findInputElement = $("."+id)
    console.log(findInputElement)
    if (selectedFormat == "YYYY-WW"){
        $(findInputElement).val(yearValue+"-W"+nthWeekOfYear(nthWeek, id) )
       
    } else if(selectedFormat == "MM/DD/YYYY~MM/DD/YYYY"){
        $(findInputElement).val(forammtingMMDDYYYY(nthWeek, id, yearValue))
    }
}

function _customSetting(option) {
    let monthNames = {0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June",
    6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December" };//default
    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] //default
    let sunday = ""
    if (!option.monthNames) {
        option.monthNames = monthNames
    }
    if (option.dayNames){dayNames = option.dayNames}else{option.dayNames = dayNames}
    if (option.firstDay == 1){
        sunday = dayNames.shift();
        dayNames.push(sunday)
        option.dayNames = dayNames
    }
    
    return option
}

function _htmlGenerate(id, option) {
    let prevText = "Prev";
    let nextText = "Next";

    let width
    if (option.showWeek){width=400;}else{width=350}
    
    let dpDiv = $("<div/>", {
        id: "ex-weekpicker-"+id,
        style: 'width:'+width+'px;display:none;border:5px ridge;z-index:9999;',
    }).addClass('ex-weekpicker ex-weekpicker-ui-weekpicker');

    let prev, monthOption, next, yearInput, todayButton, selectFormat

    prev = $('<button/>', {
        type: 'button',
        value: prevText,
        id: 'prevButton' + id,
        class: 'ex-weekpicker-controlButton ex-weekpicker-left',
        
    }).attr('onclick', 'changeMonth(-1,' + id + ', ' + option.showWeek + ', ' + option.firstDay + ')').append($('<i />', {
        class: 'ex-weekpicker fa fa-calendar-minus fa-3',
    }));

    monthOption = $('<select />', {
        id: "monthChange" + id,
        class: "ex-weekpicker-form-controller ex-weekpicker-controlButton",
    }).attr('onchange', 'changeMonth(0,' + id + ', ' + option.showWeek + ', ' + option.firstDay + ')');

    next = $('<button/>', {
        type: "button",
        value: nextText,
        id: 'nextButton' + id,
        class: "ex-weekpicker-controlButton ex-weekpicker-right"
    }).attr('onclick', 'changeMonth(1,' + id + ',' + option.showWeek + ', ' + option.firstDay + ')').append($('<i/>', {
        class: 'ex-weekpicker fa fa-calendar-plus fa-3',
    }));

    yearInput = $('<input />', {
        type: "text",
        id: "yearChange" + id,
        style: "width:"+Math.round(width*0.28)+"px;float:right;height:30px;",
        class: "ex-weekpicker-form-control ex-weekpicker-yearchange"
    }).attr('onchange', 'changeYear(' + id + ', ' + option.showWeek + ', ' + option.firstDay + ')');

    todayButton = $('<button>이번 달</button>', {
        type: 'button',
        value: 'goToday',
        id: 'todayFindButton',
        class: 'ex-weekpicker-form-control',
        style: 'float:right;',
    }).attr('onclick', 'goToToday(' + id + ', ' + option.showWeek + ', ' + option.firstDay + ')').append($('<i/>', {
        class: 'ex-weekpicker fa fa-calendar',
        value: 'Today',
    }));

    selectFormat = $('<select />', {
        id: "formatOption"+id,
        style:'width:'+(width*0.78)+'px;float:right;',
    })
    .append("<option value='YYYY-WW'>YYYY-WW</option>")
    .append("<option value='MM/DD/YYYY~MM/DD/YYYY'>MM/DD/YYYY~MM/DD/YYYY</option>")
    
    for (let i = 0; i < 12; i++) {
        monthOption.append("<option value=" + i + ">" + option.monthNames[i] + "</option>")
    };

    format = $('<p>Format:</p>',{
        style:'font-size:20px;'
    })

    format.append(selectFormat);
    dpDiv.append(prev);
    dpDiv.append(monthOption);
    dpDiv.append(next);
    dpDiv.append(yearInput);
    dpDiv.append(todayButton);
    dpDiv.append(format);
    


    weekDay = $('<table />', {
        class: "ex-weekpicker table table-borderd"
    })


    let tableRow = $('<tr />', { id: "table-head-day",class:"ex-weekpicker" });
    let tableHead = $('<thead />',{class:"ex-weekpicker"});
    if (option.showWeek) {
        if (option.weekHeader) {
            $('<td>' + option.weekHeader + '</td>').appendTo(tableRow)
            for (let a = 0; a < option.dayNames.length; a++) {
                $('<td>' + option.dayNames[a] + '</td>').appendTo(tableRow)
            }
        } else {
            $('<td>WK</td>').appendTo(tableRow)
            for (let a = 0; a < option.dayNames.length; a++) {
                $('<td>' + option.dayNames[a] + '</td>').appendTo(tableRow)
            }
        }


    } else {
        for (let a = 0; a < option.dayNames.length; a++) {
            $('<td>' + option.dayNames[a] + '</td>').appendTo(tableRow)
        }
    }
    tableHead.append(tableRow);
    weekDay.append(tableHead);
    weekDay.append($('<tbody />', { id: "tb_body" + id , class:"ex-weekpicker"}));

    dpDiv.append(weekDay);
    let warper = $('<div />', { id: "warper"+id, class:"ex-weekpicker" }).append(dpDiv);

    if(!exWPs.includes(id)){exWPs.push(id)}

    return warper;
}

function renderCalendar(data, id, showWeek) {
    let h = [];
    for (let i = 0; i < data.length; i++) {
        let nthWeek = Math.floor(i / 7)+1;
        if (i == 0) {
            if (showWeek) {
                h.push('<tr name="'+nthWeek+'thweek'+id+'" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
                h.push('<td name="week" style="cursor:pointer;">' + nthWeekOfYear(nthWeek, id) + '</td>');
            } else {
                h.push('<tr name="'+nthWeek+'thweek'+id+'" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
            }
        } else if (i % 7 == 0) {
            if (showWeek) {
                h.push('</tr>');
                h.push('<tr name="'+nthWeek+'thweek'+id+'" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
                h.push('<td name="week" style="cursor:pointer;">' + nthWeekOfYear(nthWeek, id) + '</td>');
            } else {
                h.push('</tr>');
                h.push('<tr name="'+nthWeek+'thweek'+id+'" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
            }
        }
        h.push('<td name="day" style="cursor:pointer;" id="'+ data[i] +'">' + data[i] + '</td>');
    };
    h.push('</tr>');

    $('#tb_body' + id).html(h.join("")).trigger("create");
}


function changeYearMonth(year, month, id, showWeek, firstDay) {
    let month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    if (month == 1) {
        if (checkLeapYear(year)) month_day[1] == 29;
    }
    let first_day_of_week = getFirstDayOfWeek(year, month, firstDay);

    let arr_calendar = [];
    //전 달의 끝 날짜를 집어 넣는 작업
    for (let i = (month == 0 ? month_day[month_day.length - 1] : month_day[month - 1]) - first_day_of_week + 1 ; i <= (month == 0 ? month_day[month_day.length - 1] : month_day[month - 1]); i++) {
        arr_calendar.push(String(i));
    };

    for (let i = 1; i <= month_day[month]; i++) {
        arr_calendar.push(String(i));
    };

    let remain_day = 7 - (arr_calendar.length % 7);

    //이 달 끝에 다음 달의 앞 날짜를 당겨오는 작업
    if (remain_day < 7) {
        for (let i = 0; i < remain_day; i++) {
            arr_calendar.push(String(i + 1))
        }
    };

    renderCalendar(arr_calendar, id, showWeek);
}


function checkLeapYear(year) {
    if (year % 400 == 0) {
        return true;
    } else if (year % 100 == 0) {
        return false;
    } else if (year % 4 == 0) {
        return true;
    } else {
        return false;
    }
}

function getFirstDayOfWeek(year, month, firstDay) {
    month += 1
    if (month < 10) month = "0" + month;
    if (firstDay == 1) {
        if (Number((new Date(month + "-01-" + year)).getDay()) == 0) {
            return 6
        } else {
            return (new Date(month + "-01-" + year)).getDay() - 1
        }
    }

    return (new Date(month + "-01-" + year)).getDay();
}

function nthWeekOfYear(nthWeek, id) {
    year = $("#yearChange" + id).val()
    month = Number($("#monthChange" + id).val()) + 1;

    let first_day = new Date("01-" + (7 - (new Date("01-01-" + year).getDay()) + 1) + "-" + year)

    let day_gap = (new Date(month + "-01-" + year) - first_day) / 1000 / 60 / 60 / 24;
    var nthWeekOfThisYear = Math.ceil(((day_gap + 1) / 7) + nthWeek)
    
    if(month==12){
        if(nthWeekOfThisYear>=53){
            if($(this).children("td #1")){
                return 1
            }
        }
    }
    return nthWeekOfThisYear
}

function forammtingMMDDYYYY(nth, id, yearValue){
    start   = Number($('tr[name='+nth+'thweek'+id+']').children("[name='day']:first").attr('id'))
    end     = Number($('tr[name='+nth+'thweek'+id+']').children("[name='day']:last").attr('id'))
    firstYear = Number(yearValue)
    firstMonth = Number($('#monthChange'+ id).val())+1
    secondMonth = firstMonth  
    secondYear  = firstYear
        if ( firstMonth == 12 ){
            if ( nthWeekOfYear(nth , id)==1 ){
                secondYear = firstYear+1
            }
        }
        
        if(start > end){
            if(nth == 1){
                firstMonth = firstMonth-1
                if(firstMonth == 0){firstMonth = 12}
                if(firstMonth == 1){firstYear = firstYear-1}
            }else if(nth >=4){
                secondMonth = secondMonth + 1
                if(secondMonth>12){secondMonth = 1}
            }
        }
    
        firstMonth = firstMonth.toString()
        secondMonth = secondMonth.toString()
        start = start.toString()
        end = end.toString()

        if (firstMonth.length<2){firstMonth = '0'+firstMonth};
        if (secondMonth.length<2){secondMonth = '0'+secondMonth};
        if (start.length<2){start = '0'+start};
        if (end.length<2){end = '0'+end};
        
        return firstMonth+'/'+start+'/'+firstYear+'~'+secondMonth+'/'+end+'/'+secondYear

}



function goToToday(id, showWeek, firstDay) {
    current_year = (new Date()).getFullYear()
    current_month = (new Date()).getMonth()
    $("#yearChange" + id).val(current_year);
    $('#monthChange' + id).val(current_month);
    changeYearMonth(current_year, current_month, id, showWeek, firstDay)
}


function changeMonth(diff, id, showWeek, firstDay) {
    if (diff == 0) {
        this.year = Number($("#yearChange" + id).val())
        this.month = Number($("#monthChange" + id).val())
    } else {
        this.year = Number($("#yearChange" + id).val())
        this.month = Number($("#monthChange" + id).val())
        this.month = this.month + Number(diff);

        if (this.month == -1) {
            this.year = this.year - 1;
            this.month = 11;
        } else if (this.month == 12) {
            this.year = this.year + 1;
            this.month = 0;
        }
    }

    loadCalendar(id, showWeek, firstDay);
}

function loadCalendar(id, showWeek, firstDay) {
    $("#yearChange" + id).val(this.year);
    $('#monthChange' + id).val(this.month);

    changeYearMonth(this.year, this.month, id, showWeek, firstDay)
}

function changeYear(id, showWeek, firstDay) {
    this.year = Number($("#yearChange" + id).val())
    this.month = Number($("#monthChange" + id).val())

    loadCalendar(id, showWeek, firstDay);
}

function exCloseWeekPicker(){
    for(x = 0 ; x<exWPs.length ; x++){
        $("#ex-weekpicker-"+exWPs[x]).hide();
    }
}

$(document).keyup(function (e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        exCloseWeekPicker();
    }
});

