///////// 킴보드로 클릭드 옮길 때 위에 인풋에 바뀌게 하기

let exWPs = []; exWPID = 0; exWPset = {};
$.fn.Weekpicker = function (option) {
    let current_year = (new Date()).getFullYear();
    let current_month = (new Date()).getMonth();
    let current_date = (new Date()).getDate();
    let id = new Date().getMilliseconds() + new Date().getMinutes();
    let fixedOption = _customSetting(option)

    $(this).parent().append(_htmlGenerate(id, fixedOption))
        .trigger("create");;

    $("#yearChange" + id).val(current_year);
    $("#monthChange" + id).val(current_month);

    changeYearMonth(current_year, current_month, id, fixedOption.showWeek, fixedOption.firstDay);

    $(this).addClass('ex-weekpicker ex-weekpicker-input ' + id).attr('readonly', true).attr("onclick", "showWeekPicker(" + id + ")")

    $(window).on('click', function (e) {
        if ($(e.target).hasClass('ex-weekpicker') ||
            $(e.target).parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().parent().parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().parent().parent().parent().hasClass('ex-weekpicker')) return;
        exCloseWeekPicker();
    });

    $(this).next().find('#' + current_date).parent().addClass('clicked');
    exWPset[id] = [];
    exWPset[id + 'reserved'] = []
    nthWk = $(this).next().find('.clicked').attr('name')
    if($(this).val()=="")getWeekNumber(nthWk.substring(0,1),id)

    $("#tb_body" + id).on('click', function (e) {
        if ($(e.target)[0]['localName'] == 'td') {
            $(e.target).parent().addClass('clicked');
            if ($(e.target).parent().siblings('.clicked')) $(e.target).parent().siblings('.clicked').removeClass('clicked');

            exWPset[id + "reserved"][3] = $(e.target).parent().attr('name'); //nthweekName
            exWPset[id + "reserved"][2] = Number(e.target.id);  //date
            exWPset[id + "reserved"][1] = Number($("#monthChange" + id).val()); //month
            exWPset[id + "reserved"][0] = Number($("#yearChange" + id).val()); //year
        }
        return;
    });

    $("#set" + id).on('click', function (e) {
        exWPset[id][4] = exWPset[id + "reserved"][3];
        exWPset[id][3] = exWPset[id + "reserved"][2];
        exWPset[id][2] = exWPset[id + "reserved"][1];
        exWPset[id][1] = exWPset[id + "reserved"][0];

        if ($(e.target).siblings('table').find('.setted').length == 1) $(e.target).siblings('table').find('.setted').removeClass('setted');
        $(e.target).siblings('table').find('.clicked').addClass('setted');
    });

    $("#get" + id).on('click', function (e) {
        $("#yearChange" + id).val(exWPset[id][1])
        $("#monthChange" + id).val(exWPset[id][2])
        if(exWPset[id][1]==undefined || exWPset[id][2]==undefined){
            $("#yearChange" + id).val(current_year)
            $("#monthChange" + id).val(current_month)
        }
        exWPset[id + "reserved"][3] = exWPset[id][4];
        exWPset[id + "reserved"][2] = exWPset[id][3];
        exWPset[id + "reserved"][1] = exWPset[id][2];
        exWPset[id + "reserved"][0] = exWPset[id][1];
        y = Number($("#yearChange" + id).val());
        m = Number($("#monthChange" + id).val());
        d = exWPset[id][3]
        w = exWPset[id][4]

        if(y==0)y=current_year;
        if(m==0)m=current_month;
        if(d==undefined)d==current_date;

        changeYearMonth(y, m, id, fixedOption.showWeek, fixedOption.firstDay)
        if(w==undefined)return;
        $(e.target).siblings('table').find('tr[name='+w+']').addClass('setted')
    });

    $("#ex-weekpicker-" + id).on("mousewheel", function (e) {
        let E = e.originalEvent;
        let deltaY = E.wheelDelta
        let direction = Math.round(deltaY / 120)

        y = Number($("#yearChange" + id).val());
        m = Number($("#monthChange" + id).val());
        if (direction > 0) {
            m = m + 1
            if (m == 12) {
                y = y + 1
                m = 0
            }
        } else if (direction < 0) {
            m = m - 1
            if (m === -1) {
                y = y - 1
                m = 11
            }
        }
        $("#yearChange" + id).val(y);
        $('#monthChange' + id).val(m);
        changeYearMonth(y, m, id, fixedOption.showWeek, fixedOption.firstDay)
    })

    $(this).keydown(function (e) {
        //ArrowLeft : 37, ArrowUp : 38, ArrowRight : 39, ArrowDown : 40
        setted   = $(e.target).next().find('.clicked');
        switch (e.key) {
            case "ArrowLeft":
                weekName = setted.attr('name')
                changeMonth(-1, id, fixedOption.showWeek, fixedOption.firstDay);
        
                if(exWPset[id].length==5){
                    if(exWPset[id][1]==$('#yearChange'+id).val() &&
                    exWPset[id][2]==$('#monthChange'+id).val()) $(e.target).next().find('tr[name="'+exWPset[id][4]+'"]').addClass('setted');
                };
        
                if(weekName){
                    target = $(e.target).next()
                    if(target.find('tr[name="'+weekName+'"]').length!=0)target.find('tr[name="'+weekName+'"]').addClass('clicked');
                    else target.find('tbody').children(':last').addClass('clicked')
                }else $(e.target).next().find('tbody').children(':first').addClass('clicked');
                
                clickedValue = exWPset[id + "reserved"]
                clickedValue[3] = $(e.target).next().find('.clicked').attr('name');
                clickedValue[2] = $(e.target).next().find('.clicked').children(':nth-child(5)').attr('id')
                clickedValue[1] = Number($("#monthChange" + id).val());
                clickedValue[0] = Number($("#yearChange" + id).val());
                nthValue = Number(clickedValue[3].substring(0,1));

                getWeekNumber(nthValue,id);
                break;

            case "ArrowRight":
                weekName = setted.attr('name')
                changeMonth(1, id, fixedOption.showWeek, fixedOption.firstDay);
                if(exWPset[id].length==5){
                    if(exWPset[id][1]==$('#yearChange'+id).val() &&
                    exWPset[id][2]==$('#monthChange'+id).val()) $(e.target).next().find('tr[name="'+exWPset[id][4]+'"]').addClass('setted');
                };
                if(weekName){
                    target = $(e.target).next()
                    if(target.find('tr[name="'+weekName+'"]').length!=0)target.find('tr[name="'+weekName+'"]').addClass('clicked');
                    else target.find('tbody').children(':last').addClass('clicked');
                }else $(e.target).next().find('tbody').children(':first').addClass('clicked');

                clickedValue = exWPset[id + "reserved"]
                clickedValue[3] = $(e.target).next().find('.clicked').attr('name');
                clickedValue[2] = $(e.target).next().find('.clicked').children(':nth-child(5)').attr('id')
                clickedValue[1] = Number($("#monthChange" + id).val());
                clickedValue[0] = Number($("#yearChange" + id).val());
                nthValue = Number(clickedValue[3].substring(0,1));
                
                getWeekNumber(nthValue,id);
                break;
            case "ArrowUp":
                if(!setted){
                    w = ((exWPset[id][4])?exWPset[id][4] : exWPset[id+"reserved"][3]);
                    $(e.target).next().find('tr[name='+w+']').addClass('clicked');
                    setted   = $(e.target).next().find('.clicked');
                };
                
                if(setted.prev().length==0){
                    changeMonth(-1, id, fixedOption.showWeek, fixedOption.firstDay)
                    if(exWPset[id].length==5){
                        if(exWPset[id][1]==$('#yearChange'+id).val() &&
                        exWPset[id][2]==$('#monthChange'+id).val()) $(e.target).next().find('tr[name="'+exWPset[id][4]+'"]').addClass('setted');
                    };
                    $(e.target).next().find('tbody').children(':last').addClass('clicked')
                    
                }else{
                    setted.prev().addClass('clicked');
                    setted.removeClass('clicked');
                };
                
                clickedValue = exWPset[id + "reserved"]
                clickedValue[3] = $(e.target).next().find('.clicked').attr('name');
                clickedValue[2] = $(e.target).next().find('.clicked').children(':nth-child(5)').attr('id')
                clickedValue[1] = Number($("#monthChange" + id).val());
                clickedValue[0] = Number($("#yearChange" + id).val());                
                nthValue = Number(clickedValue[3].substring(0,1));
                
                getWeekNumber(nthValue,id);

                break;

            case "ArrowDown":
                if(!setted){
                    w = ((exWPset[id][4])?exWPset[id][4] : exWPset[id+"reserved"][3]);
                    $(e.target).next().find('tr[name='+w+']').addClass('clicked');
                    setted   = $(e.target).next().find('.clicked');
                };
                
                if(setted.next().length==0){
                    changeMonth(1, id, fixedOption.showWeek, fixedOption.firstDay)
                    if(exWPset[id].length==5){
                        if(exWPset[id][1]==$('#yearChange'+id).val() &&
                        exWPset[id][2]==$('#monthChange'+id).val()) $(e.target).next().find('tr[name="'+exWPset[id][4]+'"]').addClass('setted');
                    };
                    $(e.target).next().find('tbody').children(':first').addClass('clicked')
                }else{
                    setted.next().addClass('clicked');
                    setted.removeClass('clicked');
                };

                clickedValue = exWPset[id + "reserved"]
                clickedValue[3] = $(e.target).next().find('.clicked').attr('name');
                clickedValue[2] = $(e.target).next().find('.clicked').children(':nth-child(5)').attr('id')
                clickedValue[1] = Number($("#monthChange" + id).val());
                clickedValue[0] = Number($("#yearChange" + id).val());                
                nthValue = Number(clickedValue[3].substring(0,1));
                
                getWeekNumber(nthValue,id);

                break;

            case "Enter":
                exWPset[id][4] = exWPset[id + "reserved"][3];
                exWPset[id][3] = exWPset[id + "reserved"][2];
                exWPset[id][2] = exWPset[id + "reserved"][1];
                exWPset[id][1] = exWPset[id + "reserved"][0];
                
                if ($(e.target).next().find('.setted').length == 1) $(e.target).next().find('.setted').removeClass('setted');
                $(e.target).next().find('.clicked').addClass('setted');
                setDate(id)
        }
    });
}

function setDate(id) {
    findInputElement = $("." + id)
    weekValue = findInputElement.val()
    if (exWPset[id][0] == "") {
        if (weekValue == "") {
            $(findInputElement).val("Select first");
        } else {
            if (weekValue == "Select first") return;
            exWPset[id][0] = weekValue
        }
    } else {
        if (weekValue == exWPset[id][0]) return;
        else {
            if (weekValue == "") return;
            else {
                exWPset[id][0] = weekValue;
                $(findInputElement).val(exWPset[id][0]);
            }
        }
    };
};


function clearDate(id) {
    $("." + id).val("")
    $('#tb_body'+id).find('.setted').removeClass('setted')
    for(let e = 0 ; e <= exWPs.length ; e++ ){
        eId = exWPs[e]
        exWPset[eId] = []
        exWPset[eId+"reserved"]=[]
    }
    
}

function getDate(id) {
    setValue = exWPset[id][0]
    if(setValue){
        $("." + id).val(setValue)
    }else return;
}

function showWeekPicker(id) {
    $("#ex-weekpicker-" + id).show()
}

function getWeekNumber(nthWeek, id) {
    yearValue = $('#yearChange' + id).val();
    //let selectedFormat = $("#formatOption"+ id).val();
    findInputElement = $("." + id);
    weekDuration = formattingDate(nthWeek, id, yearValue);
    startdate = new Date(weekDuration[0]);
    enddate = new Date(weekDuration[1]);

    if (option.displayTemplate) {
        let displayText = option.displayTemplate(
            nthWeekOfYear(nthWeek, id),
            startdate,
            enddate);
        $(findInputElement).val(displayText);
    }
    else {
        $(findInputElement).val(yearValue + "-W" + nthWeekOfYear(nthWeek, id))
    }
}

function _customSetting(option) {
    let monthNames = {
        0: "JAN", 1: "FEB", 2: "MAR", 3: "APR", 4: "MAY", 5: "JUN",
        6: "JUL", 7: "AUG", 8: "SEP", 9: "OCT", 10: "NOV", 11: "DEC"
    };//default
    let dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] //default
    let sunday = ""
    if (!option.monthNames) {
        option.monthNames = monthNames
    }
    if (option.dayNames) { dayNames = option.dayNames } else { option.dayNames = dayNames }
    if (option.firstDay == 1) {
        sunday = dayNames.shift();
        dayNames.push(sunday)
        option.dayNames = dayNames
    }

    return option
}

function _htmlGenerate(id, option) {
    let prevText = "Prev";
    let nextText = "Next";

    let dpDiv = $("<div/>", {
        id: "ex-weekpicker-" + id,
        style: 'display:none;border:5px ridge;z-index:9999;float:none;position:absolute;',
    }).addClass('ex-weekpicker ex-weekpicker-ui-weekpicker');

    let prev, monthOption, next, yearInput, todayButton, selectFormat

    prev = $('<button/>', {
        type: 'button',
        value: prevText,
        id: 'prevButton' + id,
        class: 'ex-weekpicker-controlButton-left',
    }).attr('onclick', 'changeMonth(-1,' + id + ', ' + option.showWeek + ', ' + option.firstDay + ')').append($('<i />', {
        class: 'ex-weekpicker fas fa-chevron-left',
    }));

    monthOption = $('<select />', {
        id: "monthChange" + id,
        class: "ex-weekpicker-form-controller ex-weekpicker-controlButton",
    }).attr('onchange', 'changeMonth(0,' + id + ', ' + option.showWeek + ', ' + option.firstDay + ')');

    next = $('<button/>', {
        type: "button",
        value: nextText,
        id: 'nextButton' + id,
        class: "ex-weekpicker-controlButton-right"
    }).attr('onclick', 'changeMonth(1,' + id + ',' + option.showWeek + ', ' + option.firstDay + ')').append($('<i/>', {
        class: 'ex-weekpicker fas fa-chevron-right',
    }));

    yearInput = $('<input />', {
        type: "text",
        id: "yearChange" + id,
        class: "ex-weekpicker-yearchange"
    }).attr('onchange', 'changeYear(' + id + ', ' + option.showWeek + ', ' + option.firstDay + ')');

    // todayButton = $('<button>This month</button>', {
    //     type: 'button',
    //     value: 'goToday',
    //     id: 'todayFindButton',
    //     class: 'ex-weekpicker-form-control',
    //     style: 'float:right;',
    // }).attr('onclick', 'goToToday(' + id + ', ' + option.showWeek + ', ' + option.firstDay + ')').append($('<i/>', {
    //     class: 'ex-weekpicker fa fa-calendar',
    //     value: 'Today',
    // }));

    // selectFormat = $('<select />', {
    //     id: "formatOption"+id,
    // })
    // .append("<option value='YYYY-WW'>YYYY-WW</option>")
    // .append("<option value='MM/DD/YYYY~MM/DD/YYYY'>MM/DD/YYYY~MM/DD/YYYY</option>");

    for (let i = 0; i < 12; i++) {
        monthOption.append("<option value=" + i + ">" + option.monthNames[i] + "</option>")
    };

    format = $('<p>Format:</p>', {
        style: 'font-size:20px;'
    });

    controlPanel = $('<div>', {
        id: "ex-weekpicker-controlpanel" + id,
        class: "ex-weekpicker-controlpanel",
    });

    format.append(selectFormat);
    controlPanel.append(prev);
    controlPanel.append(yearInput);
    controlPanel.append(monthOption);
    controlPanel.append(next);
    dpDiv.append(controlPanel)
    //dpDiv.append(todayButton);
    // dpDiv.append(format);



    weekDay = $('<table />', {
        class: "ex-weekpicker table table-borderd"
    })


    let tableRow = $('<tr />', { id: "table-head-day", class: "ex-weekpicker" });
    let tableHead = $('<thead />', { class: "ex-weekpicker" });
    if (option.showWeek) {
        if (option.weekHeader) {
            $('<td>' + option.weekHeader + '</td>').appendTo(tableRow)
            for (let a = 0; a < option.dayNames.length; a++) {
                $('<td>' + option.dayNames[a] + '</td>').appendTo(tableRow)
            }
        } else {
            $('<td>#</td>').appendTo(tableRow)
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
    weekDay.append($('<tbody />', { id: "tb_body" + id, class: "ex-weekpicker" }));
    set = 'set'
    get = 'get'
    clear = 'clear'
    if(option.showWeek){
        set = 'extended-set'
        get = 'extended-get'
        clear = 'extended-clear'
    }
    dpDiv.append(weekDay)
        .append("<button class='bt btn-primary "+set+"' type='button' id='set" + id + "' onclick='javascript:setDate(" + id + ")'>Set</button>")
        .append("<button class='bt btn-primary "+get+"' type='button' id='get" + id + "' onclick='javascript:getDate(" + id + ")'>Get</button>")
        .append("<button class='bt btn-primary "+clear+"' type='button' id='clear" + id + "' onclick='javascript:clearDate(" + id + ")'>Clear</button>")
    let warper = $('<div />', { id: "warper" + id, class: "ex-weekpicker" }).append(dpDiv);

    if (!exWPs.includes(id)) { exWPs.push(id) }

    return warper;
}

function renderCalendar(data, id, showWeek) {
    let h = [];
    for (let i = 0; i < data.length; i++) {
        nthWeek = Math.floor(i / 7) + 1;
        
        if (i == 0) {
            if (showWeek) {
                h.push('<tr name="' + nthWeek + 'thweek' + id + '" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
                h.push('<td name="week" style="cursor:pointer;">' + nthWeekOfYear(nthWeek, id) + '</td>');
            } else {
                h.push('<tr name="' + nthWeek + 'thweek' + id + '" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
            }
        } else if (i % 7 == 0) {
            if (showWeek) {
                h.push('</tr>');
                h.push('<tr name="' + nthWeek + 'thweek' + id + '" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
                h.push('<td name="week" style="cursor:pointer;">' + nthWeekOfYear(nthWeek, id) + '</td>');
            } else {
                h.push('</tr>');
                h.push('<tr name="' + nthWeek + 'thweek' + id + '" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
            }
        }
        h.push('<td name="day" style="cursor:pointer;" id="' + data[i] + '">' + data[i] + '</td>');
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
    for (let i = (month == 0 ? month_day[month_day.length - 1] : month_day[month - 1]) - first_day_of_week + 1; i <= (month == 0 ? month_day[month_day.length - 1] : month_day[month - 1]); i++) {
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

    if (month == 12) {
        if (nthWeekOfThisYear >= 53) {
            if ($(this).children("td #1")) {
                return 1
            }
        }
    }
    return nthWeekOfThisYear
}

function formattingDate(nth, id, yearValue) {
    start = Number($('tr[name=' + String(nth) + 'thweek' + id + ']').children("[name='day']:first").attr('id'))
    end = Number($('tr[name=' + String(nth) + 'thweek' + id + ']').children("[name='day']:last").attr('id'))
    firstYear = Number(yearValue)
    firstMonth = Number($('#monthChange' + id).val()) + 1
    secondMonth = firstMonth
    secondYear = firstYear
    if (firstMonth == 12) {
        if (nthWeekOfYear(nth, id) == 1 &&
            $('#monthChange' + id).val() == 11) {
            secondYear = firstYear + 1
        }
    }

    if (start > end) {
        if (nth == 1) {
            firstMonth = firstMonth - 1
            if (firstMonth == 0) {
                firstMonth = 12
                firstYear = firstYear - 1
            }
        } else if (nth >= 4) {
            secondMonth = secondMonth + 1
            if (secondMonth > 12) { secondMonth = 1 }
        }
    }

    firstMonth = firstMonth.toString()
    secondMonth = secondMonth.toString()
    start = start.toString()
    end = end.toString()

    if (firstMonth.length < 2) { firstMonth = '0' + firstMonth };
    if (secondMonth.length < 2) { secondMonth = '0' + secondMonth };
    if (start.length < 2) { start = '0' + start };
    if (end.length < 2) { end = '0' + end };

    return [firstMonth + '/' + start + '/' + firstYear, secondMonth + '/' + end + '/' + secondYear]

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
        this.year1 = Number($("#yearChange" + id).val())
        this.month1 = Number($("#monthChange" + id).val())
    } else {
        this.year1 = Number($("#yearChange" + id).val())
        this.month1 = Number($("#monthChange" + id).val())
        this.month1 = this.month1 + Number(diff);

        if (this.month1 == -1) {
            this.year1 = this.year1 - 1;
            this.month1 = 11;
        } else if (this.month1 == 12) {
            this.year1 = this.year1 + 1;
            this.month1 = 0;
        }
        if(this.year1<1 ||
            this.year1>9999) return;
    }

    loadCalendar(id, showWeek, firstDay);
}

function loadCalendar(id, showWeek, firstDay) {
    $("#yearChange" + id).val(this.year1);
    $('#monthChange' + id).val(this.month1);

    changeYearMonth(this.year1, this.month1, id, showWeek, firstDay)
}

function changeYear(id, showWeek, firstDay) {
    this.year1 = Number($("#yearChange" + id).val())
    this.month1 = Number($("#monthChange" + id).val())
    if(this.year1<1 ||
        this.year1>9999)return;
    loadCalendar(id, showWeek, firstDay);
}

function exCloseWeekPicker() {
    for (x = 0; x < exWPs.length; x++) {
        $("#ex-weekpicker-" + exWPs[x]).hide();
    }
}

$(document).ready(function () {

});

$(document).keyup(function (e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        exCloseWeekPicker();
    }
});
