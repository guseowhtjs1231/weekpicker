"use strict";
let exMSs = [], exMSId = 0;

function exMultiSelectType(exMS) {
    this.exMS = exMS;

    this.option = function (key, val) {
        if (val === undefined) return exMS[key];

        exMS[key] = val;
    };

    this.repaintAll = function () {
        exRedrawAllMultiSelectRecord(exMS.id);
    };

    this.isSelectedAll = function () {
        let bSelectedAll = true;
        if (exMS.dataTable) {
            for (let r = 0; r < exMS.dataTable.length; r++) {
                if (!exMS.dataTable[r].CheckedYn || exMS.dataTable[r].CheckedYn === 'N') {
                    bSelectedAll = false;
                    break;
                }
            }
        }
        return bSelectedAll;
    };

    this.setValue = function (values) {
        $(this.exMS.selector).prop('title', values);
        let descs = '';
        for (let i = 0; i < this.exMS.dataTable.length; i++) {
            if ((',' + values + ',').indexOf(',' + this.exMS.dataTable[i][this.exMS.multiSelectValueField] + ',') >= 0) {
                descs += (descs ? ',' : '') + this.exMS.dataTable[i][this.exMS.multiSelectTextField];
                $(this.exMS.selector + '_MultiSelect_' + i.toString()).prop('checked', true);
            }
            else
                $(this.exMS.selector + '_MultiSelect_' + i.toString()).prop('checked', false);
        }
        $(this.exMS.selector).val(descs);
    };
}

jQuery.fn.exMultiSelect = function (jsonConfig) {
    // in jquery V3.0 or later, this.selector is undefined
    if (this.selector === undefined && this.length > 0 && this[0].id !== undefined && this[0].id !== null)
        this.selector = '#' + this[0].id;

    if (typeof jsonConfig === 'object') {
        let tempMS;
        for (let idx = 0; idx < exMSs.length; idx++) {
            if (exMSs[idx].selector === this.selector) {
                tempMS = $.parseJSON(JSON.stringify(exMSs[idx]));
                exMSs.splice(idx, 1);
                break;
            }
        }
        jsonConfig.selector = this.selector;
        jsonConfig.id = exMSId + 1;

        if (tempMS !== undefined) {
            $.each(tempMS, function (key, value) {
                if (jsonConfig[key] === undefined) {
                    jsonConfig[key] = value;
                    //console.log(key, value);
                }
            });
        }

        exMSId++;
        exMSs.push(jsonConfig);

        if (jsonConfig.dataSource) {
            exRefreshMultiSelect(jsonConfig.id);
        }

        return;
    }
    else if (jsonConfig === 'instance') {
        for (let i = 0; i < exMSs.length; i++) {
            if (exMSs[i].selector === this.selector) {
                let exMSType = new exMultiSelectType(exMSs[i]);
                return exMSType;
            }
        }
    }
};

function exRefreshMultiSelect(id) {
    let exMS;
    for (let i = 0; i < exMSs.length; i++) {
        if (exMSs[i].id === id) {
            exMS = exMSs[i];
            break;
        }
    }
    if (!exMS) return;
    if (!exMS.dataSource) return;

    if (exMS.onInitialized !== undefined && exMS.onInitialized !== null) exMS.onInitialized();

    if (typeof exMS.dataSource === 'string') { // URL type (GET)
        console.log(exFormatDate(new Date(), "yyyyMMddHHmmss") + " - " + exMS.dataSource + " in");
        $.ajax({
            url: exMS.dataSource,
            async: true,
            type: 'GET',
            dataType: 'json',
            data: {},
            success: function (jsonDS) {
                console.log(exFormatDate(new Date(), "yyyyMMddHHmmss") + " - " + exMS.dataSource + " out");
                exMS.dataTable = jsonDS.data !== undefined && jsonDS.data !== null ? jsonDS.data : jsonDS; // jsonDS.data is for Samsung EP only
                if (exMS.dataTable === undefined) exMS.dataTable = []; // when there is no result record from the server

                exCreateMultiSelect(exMS.id);
                if (exMS.onContentReady !== undefined && exMS.onContentReady !== null) exMS.onContentReady();
            },
            error: function (jqxhr, status, thrown) {
                console.log(exFormatDate(new Date(), "yyyyMMddHHmmss") + " - " + exMS.dataSource + " error");
                console.log(jqxhr.responseText);
                if (exMS.ajaxErrorPage !== undefined && exMS.ajaxErrorPage !== null && exMS.ajaxErrorPage !== '')
                    location.href = exMS.ajaxErrorPage;
            }
        });
    }
    else if (typeof exMS.dataSource === 'object' && exMS.dataSource.url !== undefined && exMS.dataSource.url !== null) { // URL type (POST)
        console.log(exFormatDate(new Date(), "yyyyMMddHHmmss") + " - " + exMS.dataSource.url + " in");
        $.ajax({
            url: exMS.dataSource.url,
            async: exMS.dataSource.async !== undefined && exMS.dataSource.async !== null ? exMS.dataSource.async : true,
            type: exMS.dataSource.type !== undefined && exMS.dataSource.type !== null ? exMS.dataSource.type : 'GET',
            dataType: 'json',
            data: exMS.dataSource.data !== undefined && exMS.dataSource.data !== null ? exMS.dataSource.data : {},
            success: function (jsonDS) {
                console.log(exFormatDate(new Date(), "yyyyMMddHHmmss") + " - " + exMS.dataSource.url + " out");
                exMS.dataTable = exMS.dataSource.dataTable !== undefined && exMS.dataSource.dataTable !== null ? exMS.dataSource.dataTable(jsonDS) : jsonDS;
                if (exMS.dataTable === undefined) exMS.dataTable = []; // when there is no result record from the server

                exCreateMultiSelect(exMS.id);
                if (exMS.onContentReady !== undefined && exMS.onContentReady !== null) exMS.onContentReady();
            },
            error: function (jqxhr, status, thrown) {
                console.log(exFormatDate(new Date(), "yyyyMMddHHmmss") + " - " + exMS.dataSource.url + " error");
                console.log(jqxhr.responseText);
                if (exMS.ajaxErrorPage !== undefined && exMS.ajaxErrorPage !== null && exMS.ajaxErrorPage !== '')
                    location.href = exMS.ajaxErrorPage;
                if (thrown.toString().indexOf('Unexpected end of JSON input') >= 0)
                    alert("There are too many records in result data. Please try it with smaller range again.");
            }
        });
    }
    else if (typeof exMS.dataSource === 'object' && exMS.dataSource.length !== undefined && exMS.dataSource.length >= 0) { // direct data
        exMS.dataTable = exMS.dataSource;
        exCreateMultiSelect(exMS.id);
        if (exMS.onContentReady !== undefined && exMS.onContentReady !== null) exMS.onContentReady();
    }
}
// End of Date related functions

function exCreateMultiSelect(id) {
    let exMS;
    for (let i = 0; i < exMSs.length; i++) {
        if (exMSs[i].id === id) {
            exMS = exMSs[i];
            break;
        }
    }
    if (!exMS) return;

    $(exMS.selector).val('').prop('title', '').prop('readonly', true).on('click', exShowMultiSelectPane);
    $(exMS.selector).parent().css('position', 'relative').addClass('ex-multiselect');
    $(exMS.selector + '_MultiSelectPane').remove();

    let targetInputId = exMS.selector.replace(/#/, '');
    let divMultiSelectPane = $('<div>', { id: targetInputId + '_MultiSelectPane', class: 'ex-multiselect-pane' });
    let inputElement = $(exMS.selector)[0];
    divMultiSelectPane
        .css('top', (inputElement.offsetTop + inputElement.offsetHeight).toString() + 'px')
        .css('left', inputElement.offsetLeft + 'px')
        .css('width', exMS.width ? exMS.width : inputElement.clientWidth + 'px')
        .css('max-height', exMS.height ? exMS.height : '200px');
    $(exMS.selector).parent().append(divMultiSelectPane);

    exRedrawAllMultiSelectRecord(id);
}

function exRedrawAllMultiSelectRecord(id) {
    let exMS;
    for (let i = 0; i < exMSs.length; i++) {
        if (exMSs[i].id === id) {
            exMS = exMSs[i];
            break;
        }
    }
    if (!exMS) return;
    let targetInputId = exMS.selector.replace(/#/, '');
    let divMultiSelectPane = $('#' + targetInputId + '_MultiSelectPane');
    divMultiSelectPane.empty();

    let ulElement = $('<ul>', { class: 'ex-multiselect-ul' });
    let bSelectedAll = true;
    if (exMS.dataTable) {
        for (let r = 0; r < exMS.dataTable.length; r++) {
            if (!exMS.dataTable[r].CheckedYn || exMS.dataTable[r].CheckedYn === 'N') bSelectedAll = false;
            ulElement
                .append($('<li>', { class: 'ex-multiselect-li' })
                    .append($('<input>', { id: targetInputId + '_MultiSelect_' + r.toString(), name: targetInputId, type: 'checkbox', value: exMS.dataTable[r][exMS.multiSelectValueField], checked: exMS.dataTable[r].CheckedYn === 'Y', onchange: 'javascript:exMultiSelectChanged(' + id + ', ' + r + ', this.checked ? "Y" : "N")', title: exMS.dataTable[r][exMS.multiSelectTextField] }))
                    .append($('<label>', { for: targetInputId + '_MultiSelect_' + r.toString(), text: exMS.dataTable[r][exMS.multiSelectTextField] }))
                );
        }
    }
    if ((typeof exMS.showSelectAll === 'boolean' && exMS.showSelectAll) ||
        (typeof exMS.showSelectAll === 'object' && typeof exMS.showSelectAll.visible === 'boolean' && exMS.showSelectAll.visible)) {
        ulElement
            .prepend($('<li>', { class: 'ex-multiselect-li' })
                .append($('<input>', { id: targetInputId + '_MultiSelect_All', type: 'checkbox', checked: bSelectedAll, onchange: 'javascript:exMultiSelectChanged(' + id + ', null, this.checked ? "Y" : "N")', title: 'select all list' }))
                .append($('<label>', { for: targetInputId + '_MultiSelect_All', text: exMS.showSelectAll.text ? exMS.showSelectAll.text : '(Select All)' }))
            );
    }
    divMultiSelectPane.append(ulElement);

    let values = $('input[name="' + targetInputId + '"]:checked').map((i, el) => el.value).get().join(',');
    let displays = $('input[name="' + targetInputId + '"]:checked').map((i, el) => el.title).get().join(', ');
    $(exMS.selector).val(displays).prop('title', values);
}

function exShowMultiSelectPane(e) {
    let $target = $(e.target);
    if (!$target || $target.length === 0) return;

    let divMultiSelectPane = $('#' + $target[0].id + '_MultiSelectPane');
    if (divMultiSelectPane.is(":visible")) {
        divMultiSelectPane.hide();
    }
    else {
        divMultiSelectPane.show();
    }
}

function exMultiSelectChanged(id, rowIndex, val) {
    let exMS;
    for (let i = 0; i < exMSs.length; i++) {
        if (exMSs[i].id === id) {
            exMS = exMSs[i];
            break;
        }
    }
    if (!exMS) return;
    if (!exMS.dataTable || (rowIndex !== null && rowIndex > exMS.dataTable.length - 1)) return;

    let targetInputId = exMS.selector.replace(/#/, '');
    if (rowIndex === null) {
        for (let r = 0; r < exMS.dataTable.length; r++) exMS.dataTable[r].CheckedYn = val;
        exRedrawAllMultiSelectRecord(id);
        return;
    }
    else {
        exMS.dataTable[rowIndex].CheckedYn = val;
        if (val === 'N') {
            $('#' + targetInputId + '_MultiSelect_All').prop('checked', false);
        }
        else if (val === 'Y') {
            let bSelectedAll = true;
            for (let r = 0; r < exMS.dataTable.length; r++) {
                if (!exMS.dataTable[r].CheckedYn || exMS.dataTable[r].CheckedYn === 'N') {
                    bSelectedAll = false;
                    break;
                }
            }
            $('#' + targetInputId + '_MultiSelect_All').prop('checked', bSelectedAll);
        }
    }
    let values = $('input[name="' + targetInputId + '"]:checked').map((i, el) => el.value).get().join(',');
    let displays = $('input[name="' + targetInputId + '"]:checked').map((i, el) => el.title).get().join(', ');
    $(exMS.selector).val(displays).prop('title', values);
}

function exCloseMultiSelect() {
    for (let i = 0; i < exMSs.length; i++) {
        let divMultiSelectPane = $(exMSs[i].selector + '_MultiSelectPane');
        divMultiSelectPane.hide();
    }
}

$(document).ready(function () {
    $('body').on('click', function (e) {
        if ($(e.target).hasClass('ex-multiselect') ||
            $(e.target).parent().hasClass('ex-multiselect') ||
            $(e.target).parent().parent().hasClass('ex-multiselect') ||
            $(e.target).parent().parent().parent().hasClass('ex-multiselect') ||
            $(e.target).parent().parent().parent().parent().hasClass('ex-multiselect')) return;

        exCloseMultiSelect();
    });
});

$(document).keyup(function (e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        exCloseMultiSelect();
    }
});