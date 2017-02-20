function insertPeople(people, start = 1, stop = 1) {
    if (people['records'] > 1) {
        people['records'] = people['records'].pop(0);
    };
    let tds = [];
    tds.push('<tr>');
    tds.push('<td>' + start + '</td>');
    tds.push('<td>' + people['name'] + '</td>');
    tds.push('<td>' + people['records']['address'] + '</td>');
    tds.push('<td>' + people['records']['from'] + '</td>');
    tds.push('<td>' + people['records']['url'] + '</td>');
    if (people.hasOwnProperty('search_count')) {
        tds.push('<td>' + people['search_count'] + '</td>');
    } else {
        tds.push('<td>' + '0' + '</td>');
    };
    tds.push('</tr>');
    let newarr = tds.join('');
    $('tbody').append(newarr);
}

//当records记录有多条的时候调用
function insertPeopleMany(peoples) {
    let start = 1;
    let stop = peoples['records'].length;
    for (let record of peoplesp['records']) {
        let tds = [];
        tds.push('<tr>');
        tds.push('<td>' + start + '</td>');
        start += 1;
        tds.push('<td>' + peoples['name'] + '</td>');
        tds.push('<td>' + record['address'] + '</td>');
        tds.push('<td>' + record['from'] + '</td>');
        tds.push('<td>' + record['url'] + '</td>');
        if (people.hasOwnProperty('search_count')) {
            tds.push('<td>' + peoples['search_count'] + '</td>');
        } else {
            tds.push('<td>' + '0' + '</td>');
        };
        tds.push('</tr>');
        let newarr = tds.join('');
        $('tbody').append(newarr);
    }
}

function updateTable(url) {
    let re = /peoples\/(\d+)\/(\d+)/g;
    let rearray = re.exec(url);
    let start = Number(rearray[1]);
    let stop = Number(rearray[2]);
    $.getJSON(url, function(result) {
        for (let people of result) {
            insertPeople(people, start, stop);
            if (start < stop) {
                start += 1;
            };
        }
    });
}

function updateCount() {
    $.getJSON('/count', function(result) {
        // console.log(Number(result['count']));
        $('#header-count').text(Number(result['count']));
    });
    let t = setTimeout("updateCount()", 5000);
}

//function updatePagination

$(function() {
    updateCount();
    //打开页面时加载表格
    //updateTable('/api/v1.0/peoples/100/200');

    $.getJSON('/count', function(result) {
        let totalCount = Number(result['count']);
        // console.log(totalCount);
        let totalPages = Math.round(totalCount / 100);
        $('#pagination1').jqPaginator({
            totalPages: totalPages,
            visiblePages: 14,
            currentPage: 1,
            onPageChange: function(num, type) {
                let start = num === 1 ? num : (num - 1) * 100;
                let stop = (num * 100 < totalCount) ? num * 100 : totalCount;
                let url = '/api/v1.0/peoples/' + start + '/' + stop;
                // console.log(url);
                $('tbody').empty();
                updateTable(url);
                // console.log('update');
            }
        });
    });

    $('form').on('submit', function() {
        let requrl = 'api/v1.0/people/' + $('#searchInput').val()
        $.ajax({
            url: requrl,
            success: function(result) {
                $('tbody').empty();
                // console.log(result);
                if (result['record'].length > 1) {
                    insertPeopleMany(result);
                } else {
                    insertPeople(result);
                }

            },
            error: function() {
                // alert('no this person!');
                $('#errorModal').modal('show');
            },
            dataType: "json"
        });
        return false;
    });

    $('#search-button').on('click', function() {
        $('form').submit();
    });

    $.getJSON('api/v1.0/people/习近平', function(result) {
        console.log('111');
        console.log(result['records']);
    });




})