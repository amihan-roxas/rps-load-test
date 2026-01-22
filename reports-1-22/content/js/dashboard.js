/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.58032739388672, "KoPercent": 1.419672606113284};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.40337534405331016, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Create Non-Individual - No Relationship"], "isController": false}, {"data": [0.54, 500, 1500, "List 100 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Officer E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Officer E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - BDO 1% and 15% H1A1"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Director E4"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections H1B"], "isController": false}, {"data": [0.708029197080292, 500, 1500, "Search - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Director E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Officer E1A"], "isController": false}, {"data": [0.7286821705426356, 500, 1500, "Search - Officer"], "isController": false}, {"data": [0.0, 500, 1500, "Search BDO"], "isController": false}, {"data": [0.0, 500, 1500, "Director E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Director E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Director E1C"], "isController": false}, {"data": [0.8276301419730615, 500, 1500, "List 10 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Non-Indi with Connection"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Officer E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Director E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - Director E4"], "isController": false}, {"data": [0.0, 500, 1500, "Create Individual - No Relationship"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Director E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Officer E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - BDO 0.5% and 15% H1A2"], "isController": false}, {"data": [0.19135802469135801, 500, 1500, "Search Individual Subjects"], "isController": false}, {"data": [0.7047970479704797, 500, 1500, "Search - Director"], "isController": false}, {"data": [0.0, 500, 1500, "Indi with Connection to BDO 0.5 and 15%  H1C"], "isController": false}, {"data": [0.15, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.32894736842105265, 500, 1500, "Search Non-Individual Subjects"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6903, 98, 1.419672606113284, 5687.90120237577, 34, 287735, 1779.0, 17915.2, 28719.599999999984, 59080.76, 5.612149494719556, 19.876593832316406, 12.639684617655547], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Create Non-Individual - No Relationship", 74, 7, 9.45945945945946, 2895.5540540540546, 34, 15626, 2293.5, 4873.0, 8489.0, 15626.0, 0.0656134816198018, 0.049413594747640795, 0.17176088297126219], "isController": false}, {"data": ["List 100 Persons", 150, 0, 0.0, 968.9866666666666, 391, 11476, 604.5, 1202.0000000000002, 2357.199999999984, 10665.610000000015, 0.13431208038667553, 4.932855991930531, 0.20642874839273212], "isController": false}, {"data": ["Officer E1A", 150, 1, 0.6666666666666666, 3693.92, 92, 21554, 2461.5, 6436.8, 12048.749999999982, 20338.67000000002, 0.13154294614105613, 0.1273834143089786, 0.38435461495406525], "isController": false}, {"data": ["Create - Officer E1C", 132, 0, 0.0, 2717.515151515152, 1564, 14888, 2124.5, 3936.3, 5162.849999999995, 14776.129999999996, 0.13461448247870134, 0.1305731001256402, 0.39307373113102684], "isController": false}, {"data": ["Company with Connections - Officer E4", 137, 8, 5.839416058394161, 2787.0218978102193, 47, 12255, 2284.0, 4571.8, 6054.199999999999, 12201.42, 0.1389009990733174, 0.12466812197991715, 0.4517460733219847], "isController": false}, {"data": ["Company with Connections - BDO 1% and 15% H1A1", 118, 12, 10.169491525423728, 5097.40677966102, 62, 77183, 2499.0, 8421.200000000004, 13250.999999999995, 74349.91000000003, 0.12426978338091745, 0.10935827327399275, 0.4224526767763997], "isController": false}, {"data": ["Create - Director E4", 137, 2, 1.4598540145985401, 3509.9562043795613, 47, 10314, 2778.0, 6663.8, 7678.2, 10030.900000000003, 0.13696589549202248, 0.13245920515791568, 0.3821401986530354], "isController": false}, {"data": ["Create - Officer E4", 137, 0, 0.0, 3407.737226277371, 1679, 11648, 2501.0, 7002.0, 8224.3, 10989.080000000007, 0.13804583524783762, 0.13388639363064578, 0.40307714998831146], "isController": false}, {"data": ["Company with Connections H1B", 105, 12, 11.428571428571429, 53589.066666666666, 2170, 141213, 52498.0, 82723.80000000002, 94333.7, 141212.22, 0.1108662667738022, 0.09685847069751775, 0.32804123987553413], "isController": false}, {"data": ["Search - Officer E4", 137, 0, 0.0, 885.6715328467153, 421, 5025, 486.0, 2002.4, 3266.6999999999994, 4811.820000000002, 0.13834303417577845, 0.19534760643830304, 0.3922986698620205], "isController": false}, {"data": ["Child of Director E1C", 127, 0, 0.0, 3251.8976377952768, 1629, 17458, 2349.0, 5571.600000000001, 9137.4, 16050.719999999994, 0.13040567459779606, 0.16973755344579025, 0.3630397395891092], "isController": false}, {"data": ["Spouse of Officer E1A", 150, 2, 1.3333333333333333, 28299.70666666667, 48, 73219, 28203.0, 38072.4, 39646.99999999999, 72416.77000000002, 0.12915558081264691, 0.16397461366336888, 0.34228667399624585], "isController": false}, {"data": ["Search - Officer", 129, 0, 0.0, 909.472868217054, 416, 11150, 484.0, 1526.0, 3567.0, 10369.39999999997, 0.1320527965506581, 0.18466458365749394, 0.37447848262379696], "isController": false}, {"data": ["Search BDO", 335, 0, 0.0, 12295.080597014916, 3848, 26071, 11707.0, 19570.8, 21223.6, 24459.719999999994, 0.34913253592156923, 0.34572303850046016, 0.6954774260412226], "isController": false}, {"data": ["Director E1A", 150, 4, 2.6666666666666665, 2884.7399999999993, 43, 16435, 2238.5, 4520.1, 6454.499999999995, 14497.510000000035, 0.13256902869324058, 0.12736379554188032, 0.36987449469105227], "isController": false}, {"data": ["Director E1B", 296, 8, 2.7027027027027026, 3534.1959459459504, 50, 15769, 2658.5, 6279.300000000002, 9188.249999999998, 13143.34999999997, 0.2716695470369204, 0.26056539130740053, 0.7758819307857583], "isController": false}, {"data": ["Create - Director E1C", 137, 1, 0.7299270072992701, 2871.1970802919695, 62, 20809, 2140.0, 4626.800000000001, 7417.4, 18451.100000000028, 0.13824782486725182, 0.13423405754086384, 0.38571978805700247], "isController": false}, {"data": ["List 10 Persons", 2747, 0, 0.0, 729.7455405897331, 199, 22237, 382.0, 1153.2000000000003, 2128.3999999999996, 8235.759999999997, 2.3197937435660982, 9.319964144323768, 3.5630972933171026], "isController": false}, {"data": ["Non-Indi with Connection", 100, 9, 9.0, 3679.7200000000003, 40, 12402, 2733.5, 6753.000000000002, 9772.05, 12395.019999999997, 0.1352479026431498, 0.12453901597683473, 0.4108075795967719], "isController": false}, {"data": ["Parent of Officer E1B", 142, 1, 0.704225352112676, 21453.640845070422, 6800, 36693, 22050.5, 28026.200000000004, 30180.8, 36456.49999999999, 0.13201074679037253, 0.17291457736805896, 0.36932559329301734], "isController": false}, {"data": ["Spouse of Director E1A", 150, 3, 2.0, 50703.93333333333, 23338, 287735, 48188.5, 69563.40000000001, 78373.2, 193764.95000000167, 0.12786840806389327, 0.16155873667291518, 0.3386814561398574], "isController": false}, {"data": ["Company with Connections - Director E4", 137, 14, 10.218978102189782, 2977.1824817518236, 50, 12391, 2281.0, 5461.200000000002, 6736.899999999993, 11377.160000000013, 0.13838034393070883, 0.12190743289310876, 0.4500054054821848], "isController": false}, {"data": ["Create Individual - No Relationship", 69, 0, 0.0, 3231.710144927536, 1727, 10222, 2598.0, 5463.0, 8079.0, 10222.0, 0.06681223341676794, 0.054648049615345515, 0.16372666110704967], "isController": false}, {"data": ["Parent of Director E1B", 147, 0, 0.0, 21907.210884353753, 8136, 41419, 21483.0, 29066.600000000006, 31627.6, 38920.60000000005, 0.1348038878541697, 0.17773877568495508, 0.37787053616870847], "isController": false}, {"data": ["Child of Officer E1C", 125, 0, 0.0, 3793.416, 1735, 21109, 2362.0, 7981.000000000006, 13234.099999999995, 20440.79999999999, 0.12984247510919752, 0.1689108585963509, 0.3614865226756898], "isController": false}, {"data": ["Company with Connections - BDO 0.5% and 15% H1A2", 107, 11, 10.280373831775702, 5182.037383177568, 1876, 25888, 3536.0, 10457.800000000001, 12740.599999999995, 25696.320000000003, 0.11451357949115303, 0.10077316231122652, 0.389479738788639], "isController": false}, {"data": ["Search Individual Subjects", 81, 0, 0.0, 5148.481481481483, 583, 54159, 1667.0, 15327.599999999995, 23051.399999999994, 54159.0, 0.07204425118005815, 2.2202326398370023, 0.20318122203282193], "isController": false}, {"data": ["Search - Director", 271, 0, 0.0, 912.2398523985232, 417, 7601, 494.0, 2033.8000000000006, 2975.7999999999997, 6472.799999999962, 0.2632049230004196, 0.4979992996175273, 0.7468253789519588], "isController": false}, {"data": ["Indi with Connection to BDO 0.5 and 15%  H1C", 100, 3, 3.0, 4571.360000000001, 57, 24679, 2898.5, 10420.000000000002, 17090.849999999973, 24621.06999999997, 0.13600464591870456, 0.127249346837688, 0.42027560661472196], "isController": false}, {"data": ["HTTP Request", 50, 0, 0.0, 1731.04, 1392, 2358, 1539.0, 2203.1, 2238.7499999999995, 2358.0, 21.177467174925876, 22.269843948538753, 10.77486367005506], "isController": false}, {"data": ["Search Non-Individual Subjects", 76, 0, 0.0, 5700.355263157895, 516, 58700, 751.5, 22064.09999999999, 28979.899999999972, 58700.0, 0.07134462080334043, 1.0489237889837335, 0.14312469461451374], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected not to contain /&quot;errors&quot;:/", 98, 100.0, 1.419672606113284], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6903, 98, "Test failed: text expected not to contain /&quot;errors&quot;:/", 98, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Create Non-Individual - No Relationship", 74, 7, "Test failed: text expected not to contain /&quot;errors&quot;:/", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Officer E1A", 150, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections - Officer E4", 137, 8, "Test failed: text expected not to contain /&quot;errors&quot;:/", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Company with Connections - BDO 1% and 15% H1A1", 118, 12, "Test failed: text expected not to contain /&quot;errors&quot;:/", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create - Director E4", 137, 2, "Test failed: text expected not to contain /&quot;errors&quot;:/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections H1B", 105, 12, "Test failed: text expected not to contain /&quot;errors&quot;:/", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Spouse of Officer E1A", 150, 2, "Test failed: text expected not to contain /&quot;errors&quot;:/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Director E1A", 150, 4, "Test failed: text expected not to contain /&quot;errors&quot;:/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Director E1B", 296, 8, "Test failed: text expected not to contain /&quot;errors&quot;:/", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create - Director E1C", 137, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Non-Indi with Connection", 100, 9, "Test failed: text expected not to contain /&quot;errors&quot;:/", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Parent of Officer E1B", 142, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Spouse of Director E1A", 150, 3, "Test failed: text expected not to contain /&quot;errors&quot;:/", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Company with Connections - Director E4", 137, 14, "Test failed: text expected not to contain /&quot;errors&quot;:/", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections - BDO 0.5% and 15% H1A2", 107, 11, "Test failed: text expected not to contain /&quot;errors&quot;:/", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Indi with Connection to BDO 0.5 and 15%  H1C", 100, 3, "Test failed: text expected not to contain /&quot;errors&quot;:/", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
