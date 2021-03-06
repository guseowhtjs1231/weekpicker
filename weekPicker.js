let exWPs = [], exWPobject = [], exWPId = 0;

function exWeekPickerType(exWP){
    this.exWP = exWP;
    id = exWP.id;
    
    this.setWeekValue = function (val) {
        if (typeof (val) !== 'string') alert('Set value first');
        y = val.substring(0, 4)
        
        w = Number(val.substring(6, 8))
        first = new Date('01-01-' + y);
        gap = w * 7
        setted_date = first.addDays(gap)
        m = setted_date.getMonth();
        d = setted_date.getDate() - first.getDay();;
        exWP.setWeekValue = val;
        $('#yearChange' + id).val(y)
        $('#monthChange' + id).val(m)

        nthwk = Math.floor(d / 7) + 1;

        changeYearMonth(y, m, id);
        getWeekNumber(nthwk, id)

        $(this).next().find('tbody tr:nth-child(' + nthwk + ')').addClass('clicked');
    };

    this.getWeekValue = function () {
        if(exWP.setWeekValue=="")return 'Set value first'
        return exWP.setWeekValue;
    };
}

$.fn.Weekpicker = function (jsonConfig) {
    if (this.selector === undefined && this.length > 0 && this[0].id !== undefined && this[0].id !== null)
        this.selector = '#' + this[0].id;

    if (typeof (jsonConfig) === 'object') {
        let current_year = (new Date()).getFullYear();
        let current_month = (new Date()).getMonth();
        let current_date = (new Date()).getDate();

        jsonConfig.selector = this.selector;
        jsonConfig.id = exWPId + 1;

        
        exWPs.push(jsonConfig);
    
        $(this).parent().append(_htmlGenerate(jsonConfig.id));

        let inID = jsonConfig.id;
        $("#yearChange" + inID).val(current_year);
        $("#monthChange" + inID).val(current_month);

        changeYearMonth(current_year, current_month, inID);
        
        $(this).addClass('ex-weekpicker ex-weekpicker-input ' + inID).attr('readonly', true).attr("onclick", "showWeekPicker(" + inID + ")")

        if (current_date < 7 &&
            $(this).next().find('#' + current_date).length == 2) $(this).next().find('tbody').find('tr:first').find('#' + current_date).parent().addClass('clicked');
        else if (current_date > 22 &&
            $(this).next().find('#' + current_date).length == 2) $(this).next().find('tbody').find('tr:last').find('#' + current_date).parent().addClass('clicked');
        else $(this).next().find('#' + current_date).parent().addClass('clicked');

        checkToday(inID)



        $('#prevButton' + inID).on('click', function (e) {
            checkToday(inID)
        });
        $('#nextButton' + inID).on('click', function (e) {
            checkToday(inID)
        });

        $("#tb_body" + inID).on('click', function (e) {
            if ($(e.target)[0]['localName'] == 'td') {
                $(e.target).parent().addClass('clicked');
                if ($(e.target).parent().siblings('.clicked')) $(e.target).parent().siblings('.clicked').removeClass('clicked');
            }
            exCloseWeekPicker(inID)
            return;
        });



        nthWk = Number($('.clicked').attr('name').substring(0, 1))
        if ($(this).val() == "") getWeekNumber(nthWk, inID)

        $("#ex-weekpicker-" + inID).on("mousewheel", function (e) {
            let E = e.originalEvent;
            let deltaY = E.wheelDelta
            let direction = Math.round(deltaY / 120)
        
            y = Number($("#yearChange" + inID).val());
            m = Number($("#monthChange" + inID).val());
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
            $("#yearChange" + inID).val(y);
            $('#monthChange' + inID).val(m);
            changeYearMonth(y, m, inID);
            checkToday(inID);
        })

        $(this).keydown(function (e) {
            //ArrowLeft : 37, ArrowUp : 38, ArrowRight : 39, ArrowDown : 40
            setted = $(e.target).next().find('.clicked');
            switch (e.key) {
                case "ArrowLeft":
                    weekName = setted.attr('name')
                    changeMonth(-1, inID);
                    checkToday(inID);

                    if (weekName) {
                        target = $(e.target).next()
                        if (target.find('tr[name="' + weekName + '"]').length != 0) target.find('tr[name="' + weekName + '"]').addClass('clicked');
                        else target.find('tbody').children(':last').addClass('clicked')
                    } else $(e.target).next().find('tbody').children(':first').addClass('clicked');

                    clickedValue = []
                    clickedValue[3] = $(e.target).next().find('.clicked').attr('name');
                    clickedValue[2] = $(e.target).next().find('.clicked').children(':nth-child(5)').attr('id')
                    clickedValue[1] = Number($("#monthChange" + inID).val());
                    clickedValue[0] = Number($("#yearChange" + inID).val());
                    nthValue = Number(clickedValue[3].substring(0, 1));

                    getWeekNumber(nthValue, inID);
                    break;

                case "ArrowRight":
                    weekName = setted.attr('name')
                    changeMonth(1, inID);
                    checkToday(inID);

                    if (weekName) {
                        target = $(e.target).next()
                        if (target.find('tr[name="' + weekName + '"]').length != 0) target.find('tr[name="' + weekName + '"]').addClass('clicked');
                        else target.find('tbody').children(':last').addClass('clicked');
                    } else $(e.target).next().find('tbody').children(':first').addClass('clicked');

                    clickedValue = []
                    clickedValue[3] = $(e.target).next().find('.clicked').attr('name');
                    clickedValue[2] = $(e.target).next().find('.clicked').children(':nth-child(5)').attr('id')
                    clickedValue[1] = Number($("#monthChange" + inID).val());
                    clickedValue[0] = Number($("#yearChange" + inID).val());
                    nthValue = Number(clickedValue[3].substring(0, 1));

                    getWeekNumber(nthValue, inID);
                    break;
                case "ArrowUp":
                    if (!setted) {
                        w = '4thweek' + inID;
                        $(e.target).next().find('tr[name=' + w + ']').addClass('clicked');
                        setted = $(e.target).next().find('.clicked');
                    };

                    if (setted.prev().length == 0) {
                        changeMonth(-1, inID, jsonConfig.showWeek, jsonConfig.firstDay)
                        checkToday(inID);
                    
                        $(e.target).next().find('tbody').children(':last').addClass('clicked')

                    } else {
                        setted.prev().addClass('clicked');
                        setted.removeClass('clicked');
                    };

                    clickedValue = []
                    clickedValue[3] = $(e.target).next().find('.clicked').attr('name');
                    clickedValue[2] = $(e.target).next().find('.clicked').children(':nth-child(5)').attr('id')
                    clickedValue[1] = Number($("#monthChange" + inID).val());
                    clickedValue[0] = Number($("#yearChange" + inID).val());
                    nthValue = Number(clickedValue[3].substring(0, 1));

                    getWeekNumber(nthValue, inID);

                    break;

                case "ArrowDown":
                    if (!setted) {
                        w = '1thweek' + inID;
                        $(e.target).next().find('tr[name=' + w + ']').addClass('clicked');
                        setted = $(e.target).next().find('.clicked');
                    };

                    if (setted.next().length == 0) {
                        changeMonth(1, inID, jsonConfig.showWeek, jsonConfig.firstDay)
                        checkToday(inID);
                        $(e.target).next().find('tbody').children(':first').addClass('clicked')
                    } else {
                        setted.next().addClass('clicked');
                        setted.removeClass('clicked');
                    };

                    clickedValue = []
                    clickedValue[3] = $(e.target).next().find('.clicked').attr('name');
                    clickedValue[2] = $(e.target).next().find('.clicked').children(':nth-child(5)').attr('id')
                    clickedValue[1] = Number($("#monthChange" + inID).val());
                    clickedValue[0] = Number($("#yearChange" + inID).val());
                    nthValue = Number(clickedValue[3].substring(0, 1));

                    getWeekNumber(nthValue, inID);

                    break;

                case "Escape":
                    exAllCloseWeekPicker();
            }
        });
    } else if (jsonConfig === 'instance') {
        for (let i = 0; i < exWPs.length; i++) {
            if (exWPs[i].selector === this.selector) {
                let exWPType = new exWeekPickerType(exWPs[i]);
                return exWPType;
            }
        }
    }
}

function checkToday(id) {
    y = Number($('#yearChange' + id).val());
    m = Number($('#monthChange' + id).val());
    cy = new Date().getFullYear();
    cm = new Date().getMonth();
    cd = String(new Date().getDate());

    if (y == cy &&
        m == cm) $('#tb_body' + id).find('#' + cd)['0'].classList.add('today');
    else if (y == cy &&
        m == cm - 1 &&
        $('#tb_body' + id).find('#' + cd).length == 2) $('#tb_body' + id).find('tr:last').find('#' + cd).addClass('today');
    else if (y == cy &&
        m == cm + 1 &&
        $('#tb_body' + id).find('#' + cd).length == 2) $('#tb_body' + id).find('tr:first').find('#' + cd).addClass('today');
}

function showWeekPicker(id) {
    $("#ex-weekpicker-" + id).toggle()
}

function getWeekNumber(nthWeek, id) {
    let exWP;
    for (let i = 0; i < exWPs.length; i++) {
        if (exWPs[i].id === id) {
            exWP = exWPs[i];
            break;
        }
    }
    yearValue = $('#yearChange' + id).val();
    //let selectedFormat = $("#formatOption"+ id).val();
    findInputElement = $("." + id);
    weekDuration = formattingDate(nthWeek, id, yearValue);
    startdate = new Date(weekDuration[0]);
    enddate = new Date(weekDuration[1]);

    if (exWP.displayTemplate) {
        let displayText = exWP.displayTemplate(
            nthWeekOfYear(nthWeek, id),
            startdate,
            enddate);
        $(findInputElement).val(displayText);
    }
    else {
        $(findInputElement).val(yearValue + "-W" + nthWeekOfYear(nthWeek, id))
    }
}

function _htmlGenerate(id) {
    let exWP;
    for (let i = 0; i < exWPs.length; i++) {
        if (exWPs[i].id === id) {
            exWP = exWPs[i];
            break;
        }
    }

    let prevText = "Prev";
    let nextText = "Next";

    let dpDiv = $("<div/>", {
        id: "ex-weekpicker-" + id,
        style: 'display:none;z-index:9999;float:none;position:absolute;',
    }).addClass('ex-weekpicker ex-weekpicker-ui-weekpicker');

    let prev, monthOption, next, yearInput, selectFormat

    prev = $('<button/>', {
        type: 'button',
        value: prevText,
        id: 'prevButton' + id,
        class: 'ex-weekpicker-controlButton-left',
    }).attr('onclick', 'changeMonth(-1,' + id + ')').append($('<i />', {
        class: 'fa fa-arrow-left',
    }));

    monthOption = $('<select />', {
        id: "monthChange" + id,
        class: "ex-weekpicker-form-controller ex-weekpicker-controlButton",
    }).attr('onchange', 'changeMonth(0,' + id + ')');

    next = $('<button/>', {
        type: "button",
        value: nextText,
        id: 'nextButton' + id,
        class: "ex-weekpicker-controlButton-right"
    }).attr('onclick', 'changeMonth(1,' + id + ')').append($('<i/>', {
        class: 'fa fa-arrow-right',
    }));

    yearInput = $('<input />', {
        type: "text",
        id: "yearChange" + id,
        class: "ex-weekpicker-yearchange"
    }).attr('onchange', 'changeYear(' + id + ')');

    defaultMonthNames = {
        0: "JAN", 1: "FEB", 2: "MAR", 3: "APR", 4: "MAY", 5: "JUN",
        6: "JUL", 7: "AUG", 8: "SEP", 9: "OCT", 10: "NOV", 11: "DEC"
    };//default
    monthNames = defaultMonthNames;

    if (exWP.monthNames) monthNames = exWP.monthNames;

    for (let i = 0; i < 12; i++) {
        monthOption.append("<option value=" + i + ">" + monthNames[i] + "</option>")
    };

    format = $('<p>Format:</p>', {
        style: 'font-size:20px;'
    });

    controlPanel = $('<div>', {
        id: "ex-weekpicker-controlpanel" + id,
        class: "ex-weekpicker-controlpanel",
    });

    format.append(selectFormat);
    controlPanel.append(yearInput);
    controlPanel.append(monthOption);
    controlPanel.append(prev);
    controlPanel.append(next);
    dpDiv.append(controlPanel)

    weekDay = $('<table />', {
        class: "ex-weekpicker table-borderd"
    });

    defaultDayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]; //default

    dayNames = defaultDayNames;
    sunday = "";


    if (exWP.dayNames) { dayNames = exWP.dayNames };
    if (exWP.firstDay == 1) {
        sunday = dayNames.shift();
        dayNames.push(sunday);
    };

    let tableRow = $('<tr />', { id: "table-head-day", class: "ex-weekpicker" });
    let tableHead = $('<thead />', { class: "ex-weekpicker" });
    if (exWP.showWeek) {
        if (exWP.weekHeader) {
            $('<th>' + exWP.weekHeader + '</th>').appendTo(tableRow)
            for (let a = 0; a < dayNames.length; a++) {
                $('<th>' + dayNames[a] + '</th>').appendTo(tableRow)
            }
        } else {
            $('<th>#</th>').appendTo(tableRow)
            for (let a = 0; a < dayNames.length; a++) {
                $('<th>' + dayNames[a] + '</th>').appendTo(tableRow)
            }
        }
    } else {
        for (let a = 0; a < dayNames.length; a++) {
            $('<th>' + dayNames[a] + '</th>').appendTo(tableRow)
        }
    }

    tableHead.append(tableRow);
    weekDay.append(tableHead);
    weekDay.append($('<tbody />', { id: "tb_body" + id, class: "ex-weekpicker" }));

    dpDiv.append(weekDay)

    let warper = $('<div />', { id: "warper" + id, class: "ex-weekpicker" }).append(dpDiv);
    exWPId++;
    return warper;
}

function renderCalendar(data, id) {
    let exWP;
    for (let i = 0; i < exWPs.length; i++) {
        if (exWPs[i].id == id) {
            exWP = exWPs[i];
            break;
        }
    };

    let isShowWeek = exWP.showWeek;

    let h = [];
    for (let i = 0; i < data.length; i++) {
        nthWeek = Math.floor(i / 7) + 1;
        if (i == 0) {
            if (isShowWeek == true) {
                h.push('<tr name="' + nthWeek + 'thweek' + id + '" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
                h.push('<td name="week" style="cursor:pointer;">' + nthWeekOfYear(nthWeek, id) + '</td>');
            } else {
                h.push('<tr name="' + nthWeek + 'thweek' + id + '" onclick="getWeekNumber(' + nthWeek + ',' + id + ');" class="ex-weekpicker-weekSelect">');
            }
        } else if (i % 7 == 0) {
            if (isShowWeek == true) {
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

    $('#tb_body' + id).html(h.join(""));
}

function changeYearMonth(year, month, id) {
    let exWP;
    for (let i = 0; i < exWPs.length; i++) {
        if (exWPs[i].id === id) {
            exWP = exWPs[i];
            break;
        }
    };

    let month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    if (month == 1) {
        if (checkLeapYear(year)) month_day[1] = 29;
    }
    let first_day_of_week = getFirstDayOfWeek(year, month, exWPs[0].firstDay);

    let arr_calendar = [];
    //??? ?????? ??? ????????? ?????? ?????? ??????
    for (let i = (month == 0 ? month_day[month_day.length - 1] : month_day[month - 1]) - first_day_of_week + 1; i <= (month == 0 ? month_day[month_day.length - 1] : month_day[month - 1]); i++) {
        arr_calendar.push(String(i));
    };

    for (let i = 1; i <= month_day[month]; i++) {
        arr_calendar.push(String(i));
    };

    let remain_day = 7 - (arr_calendar.length % 7);

    //??? ??? ?????? ?????? ?????? ??? ????????? ???????????? ??????
    if (remain_day < 7) {
        for (let i = 0; i < remain_day; i++) {
            arr_calendar.push(String(i + 1))
        }
    };

    renderCalendar(arr_calendar, id);
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

function formattingDate(nth, id, yearValue) {
    start = Number($('tr[name="' + String(nth) + 'thweek' + id + '"]').children("[name='day']:first").attr('id'))
    end = Number($('tr[name="' + String(nth) + 'thweek' + id + '"]').children("[name='day']:last").attr('id'))
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

function goToToday(id) {
    current_year = (new Date()).getFullYear()
    current_month = (new Date()).getMonth()
    $("#yearChange" + id).val(current_year);
    $('#monthChange' + id).val(current_month);
    changeYearMonth(current_year, current_month, id)
}

function changeMonth(diff, id) {
    if (diff == 0) {
        year = Number($("#yearChange" + id).val())
        month = Number($("#monthChange" + id).val())
    } else {
        year = Number($("#yearChange" + id).val())
        month = Number($("#monthChange" + id).val())
        month = month + Number(diff);

        if (month == -1) {
            year = year - 1;
            month = 11;
        } else if (month == 12) {
            year = year + 1;
            month = 0;
        }
        if (year < 1 ||
            year > 9999) return;
    }

    loadCalendar(id, year, month);
}

function loadCalendar(id, y, m) {
    $("#yearChange" + id).val(y);
    $('#monthChange' + id).val(m);

    changeYearMonth(y, m, id)
}

function changeYear(id) {
    year = Number($("#yearChange" + id).val())
    month = Number($("#monthChange" + id).val())
    if (year < 1 ||
        year > 9999) return;
    loadCalendar(id, year, month);
}

function nthWeekOfYear(nthWeek, id) {
    let exWP;
    for (let i = 0; i < exWPs.length; i++) {
        if (exWPs[i].id === id) {
            exWP = exWPs[i];
            break;
        }
    }
    year = $("#yearChange" + id).val()
    month = Number($("#monthChange" + id).val()) + 1;

    let first_day = new Date("01-" + (7 - (new Date("01-01-" + year).getDay()) + 1) + "-" + year)
    first_of_month = new Date(month + "-01-" + year)
    let day_gap = (first_of_month - first_day) / 1000 / 60 / 60 / 24;
    let nthWeekOfThisYear = Math.ceil(((day_gap + 1) / 7) + nthWeek)


    if (nthWeekOfThisYear == 53) {
        if (checkLeapYear(year)) {
            if (exWP.firstDay == 0) {
                if (first_of_month.getDay() !== 4 &&
                    first_of_month.getDay() !== 5) nthWeekOfThisYear = 1
            } else {
                if (first_of_month.getDay() !== 0 &&
                    first_of_month.getDay() !== 5) nthWeekOfThisYear = 1
            }
        } else {
            if (exWP.firstDay == 0) {
                if (first_of_month.getDay() !== 4) nthWeekOfThisYear = 1
            } else {
                if (first_of_month.getDay() !== 0) nthWeekOfThisYear = 1
            }
        }
    } else if (nthWeekOfThisYear == 54) nthWeekOfThisYear = 1


    return nthWeekOfThisYear
}

function exAllCloseWeekPicker() {
    for (x = 1; x <= exWPs.length; x++) {
        let allWeekPicker = $("#ex-weekpicker-" + x);
        allWeekPicker.hide();
    }
}

function exCloseWeekPicker(id) {
    $("#ex-weekpicker-" + id).hide();
}
$(document).ready(function () {
    $('body').on('click', function (e) {
        if ($(e.target).hasClass('ex-weekpicker') ||
            $(e.target).parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().parent().parent().hasClass('ex-weekpicker') ||
            $(e.target).parent().parent().parent().parent().parent().hasClass('ex-weekpicker')) return;
        exAllCloseWeekPicker();
    });
    
});
