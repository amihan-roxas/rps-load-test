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

    var data = {"OkPercent": 97.93263232935305, "KoPercent": 2.0673676706469437};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.18347888076991622, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Create Non-Individual - No Relationship"], "isController": false}, {"data": [0.3967391304347826, 500, 1500, "List 100 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Officer E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Officer E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - BDO 1% and 15% H1A1"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Director E4"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections H1B"], "isController": false}, {"data": [0.12371134020618557, 500, 1500, "Search - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Director E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Officer E1A"], "isController": false}, {"data": [0.08247422680412371, 500, 1500, "Search - Officer"], "isController": false}, {"data": [0.0, 500, 1500, "Search BDO"], "isController": false}, {"data": [0.0, 500, 1500, "Director E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Director E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Director E1C"], "isController": false}, {"data": [0.43117313150425735, 500, 1500, "List 10 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Non-Indi with Connection"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Officer E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Director E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - Director E4"], "isController": false}, {"data": [0.0, 500, 1500, "Create Individual - No Relationship"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Director E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Officer E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - BDO 0.5% and 15% H1A2"], "isController": false}, {"data": [0.026041666666666668, 500, 1500, "Search Individual Subjects"], "isController": false}, {"data": [0.10309278350515463, 500, 1500, "Search - Director"], "isController": false}, {"data": [0.0, 500, 1500, "Indi with Connection to BDO 0.5 and 15%  H1C"], "isController": false}, {"data": [0.01, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.01764705882352941, 500, 1500, "Search Non-Individual Subjects"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5611, 116, 2.0673676706469437, 17958.22384601683, 242, 339791, 4872.0, 57479.60000000001, 82390.99999999991, 144252.84000000003, 4.486517260018103, 18.75465450678695, 10.013480922156807], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Create Non-Individual - No Relationship", 91, 11, 12.087912087912088, 6163.329670329673, 1893, 34753, 4330.0, 13320.6, 17473.199999999983, 34753.0, 0.07621115011000366, 0.05706594478585923, 0.1995880907725047], "isController": false}, {"data": ["List 100 Persons", 184, 0, 0.0, 2184.9782608695655, 421, 43208, 954.5, 3297.5, 8916.0, 29681.10000000009, 0.1537640006718818, 5.646225921622979, 0.2363422939165446], "isController": false}, {"data": ["Officer E1A", 149, 16, 10.738255033557047, 14113.127516778524, 1825, 125334, 5414.0, 40394.0, 66144.0, 113987.0, 0.12555488518047883, 0.11495016487505183, 0.3668704923478932], "isController": false}, {"data": ["Create - Officer E1C", 97, 4, 4.123711340206185, 5828.247422680412, 2008, 19350, 4645.0, 11433.400000000001, 13378.699999999995, 19350.0, 0.5216231622194258, 0.4947196157868981, 1.5231671516552125], "isController": false}, {"data": ["Company with Connections - Officer E4", 97, 14, 14.43298969072165, 5610.42268041237, 966, 17264, 5114.0, 9196.000000000002, 11312.999999999998, 17264.0, 0.5282562641934834, 0.45564549205437227, 1.718050749701835], "isController": false}, {"data": ["Company with Connections - BDO 1% and 15% H1A1", 97, 10, 10.309278350515465, 29290.26804123712, 2459, 129951, 20212.0, 60673.800000000025, 72350.69999999997, 129951.0, 0.18742041877836665, 0.16447213497941274, 0.6370743219776526], "isController": false}, {"data": ["Create - Director E4", 97, 2, 2.0618556701030926, 12904.443298969074, 2133, 40703, 9794.0, 25155.000000000007, 35732.7, 40703.0, 0.3926076433017898, 0.3784255775784608, 1.0954222821533517], "isController": false}, {"data": ["Create - Officer E4", 97, 4, 4.123711340206185, 9915.927835051547, 533, 33359, 7677.0, 22391.2, 25305.1, 33359.0, 0.4963261630405862, 0.47072235284185104, 1.4492935826817985], "isController": false}, {"data": ["Company with Connections H1B", 97, 4, 4.123711340206185, 105721.0412371134, 15944, 227002, 100101.0, 168258.6, 193657.89999999997, 227002.0, 0.16607769011615167, 0.1494528665736974, 0.4914012259358564], "isController": false}, {"data": ["Search - Officer E4", 97, 0, 0.0, 4956.216494845362, 585, 24784, 3117.0, 10650.0, 17387.999999999993, 24784.0, 0.5244320455012381, 1.7616002290335313, 1.4867443633692328], "isController": false}, {"data": ["Child of Director E1C", 97, 0, 0.0, 17282.546391752578, 2658, 111715, 11094.0, 37235.40000000001, 50184.1, 111715.0, 0.4027152139165092, 0.5226037536586885, 1.121211246445104], "isController": false}, {"data": ["Spouse of Officer E1A", 132, 4, 3.0303030303030303, 76091.01515151515, 13554, 205826, 65416.0, 143196.1, 153098.24999999997, 202413.79999999987, 0.10983771477641785, 0.13789928115584224, 0.29110553610165985], "isController": false}, {"data": ["Search - Officer", 97, 0, 0.0, 4621.639175257732, 536, 28947, 3347.0, 9690.000000000004, 15601.0, 28947.0, 0.544188681997453, 1.9322018305357171, 1.5427426986849708], "isController": false}, {"data": ["Search BDO", 289, 0, 0.0, 35064.01730103809, 4867, 162906, 30506.0, 59047.0, 76617.5, 156150.50000000003, 0.47646839646127415, 0.471815384777082, 0.9491805727636485], "isController": false}, {"data": ["Director E1A", 156, 1, 0.6410256410256411, 6367.621794871796, 2067, 36835, 4261.0, 13136.8, 16185.600000000008, 31443.370000000064, 0.13010701301820746, 0.12639057734361514, 0.36302075253771227], "isController": false}, {"data": ["Director E1B", 194, 11, 5.670103092783505, 27056.46907216495, 3054, 88360, 24712.0, 48489.5, 60137.75, 80940.50000000009, 0.5068966688527674, 0.4782648252578249, 1.4477465511756606], "isController": false}, {"data": ["Create - Director E1C", 97, 4, 4.123711340206185, 6050.958762886598, 354, 18865, 5428.0, 9352.6, 12107.099999999984, 18865.0, 0.5009192125756543, 0.4773982798330958, 1.3976547733856974], "isController": false}, {"data": ["List 10 Persons", 2114, 0, 0.0, 3262.122516556293, 242, 84628, 907.0, 8002.0, 13973.0, 34632.19999999996, 1.7911095220262414, 7.195928226994326, 2.7512588244869414], "isController": false}, {"data": ["Non-Indi with Connection", 88, 5, 5.681818181818182, 25944.727272727276, 3622, 96696, 16572.5, 65076.700000000026, 80239.89999999998, 96696.0, 0.2018394917314617, 0.1891282089325443, 0.6127196688857542], "isController": false}, {"data": ["Parent of Officer E1B", 97, 0, 0.0, 57450.91752577317, 21974, 101754, 55596.0, 77908.6, 88637.9, 101754.0, 0.35214207662175945, 0.4633847683122956, 0.9852128973396937], "isController": false}, {"data": ["Spouse of Director E1A", 104, 2, 1.9230769230769231, 114581.99038461538, 27473, 339791, 108903.0, 157588.5, 181615.5, 334230.8500000003, 0.08690108233626875, 0.10986014983752006, 0.23018635738655024], "isController": false}, {"data": ["Company with Connections - Director E4", 97, 7, 7.216494845360825, 6946.113402061856, 2159, 19908, 5985.0, 11617.800000000001, 15627.499999999993, 19908.0, 0.5480133105088615, 0.48816263001192073, 1.782130149277131], "isController": false}, {"data": ["Create Individual - No Relationship", 87, 4, 4.597701149425287, 8319.494252873565, 1955, 43518, 3940.0, 27160.600000000002, 34592.99999999998, 43518.0, 0.07371869285742128, 0.05903254701473187, 0.18065829495230315], "isController": false}, {"data": ["Parent of Director E1B", 97, 1, 1.0309278350515463, 69023.9175257732, 29774, 113800, 68939.0, 94480.6, 99738.09999999999, 113800.0, 0.3155949452751858, 0.4132524661955517, 0.8846654256383477], "isController": false}, {"data": ["Child of Officer E1C", 97, 0, 0.0, 30153.701030927838, 3618, 140429, 19900.0, 76921.20000000003, 92317.7, 140429.0, 0.3052743220234967, 0.39555841597245606, 0.8499047591322656], "isController": false}, {"data": ["Company with Connections - BDO 0.5% and 15% H1A2", 97, 7, 7.216494845360825, 37366.484536082506, 2803, 149019, 34642.0, 66415.8, 78736.89999999997, 149019.0, 0.18634817138652646, 0.16637532755013631, 0.6339511209466872], "isController": false}, {"data": ["Search Individual Subjects", 96, 0, 0.0, 30912.94791666666, 756, 201790, 18974.0, 68937.29999999996, 140598.94999999998, 201790.0, 0.07911040351250191, 2.436933434827449, 0.22311525515371317], "isController": false}, {"data": ["Search - Director", 194, 0, 0.0, 5410.597938144331, 488, 58937, 3074.5, 12388.0, 17939.0, 42126.750000000204, 0.6466752890038534, 1.8575442985073136, 1.834640347287964], "isController": false}, {"data": ["Indi with Connection to BDO 0.5 and 15%  H1C", 93, 5, 5.376344086021505, 27677.645161290315, 4530, 152966, 18960.0, 58349.00000000002, 66495.49999999999, 152966.0, 0.1937645323399255, 0.1789278076064038, 0.5987733422454601], "isController": false}, {"data": ["HTTP Request", 100, 0, 0.0, 2832.9999999999995, 1233, 4945, 2824.0, 3885.0, 4044.1999999999994, 4942.879999999999, 20.04811547714515, 21.084391602345626, 10.20026187850842], "isController": false}, {"data": ["Search Non-Individual Subjects", 85, 0, 0.0, 40951.74117647058, 507, 200752, 12832.0, 89642.40000000002, 112000.6, 200752.0, 0.0702353379600518, 1.032829042746053, 0.1409056121236935], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected not to contain /&quot;errors&quot;:/", 116, 100.0, 2.0673676706469437], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5611, 116, "Test failed: text expected not to contain /&quot;errors&quot;:/", 116, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Create Non-Individual - No Relationship", 91, 11, "Test failed: text expected not to contain /&quot;errors&quot;:/", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Officer E1A", 149, 16, "Test failed: text expected not to contain /&quot;errors&quot;:/", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create - Officer E1C", 97, 4, "Test failed: text expected not to contain /&quot;errors&quot;:/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Company with Connections - Officer E4", 97, 14, "Test failed: text expected not to contain /&quot;errors&quot;:/", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Company with Connections - BDO 1% and 15% H1A1", 97, 10, "Test failed: text expected not to contain /&quot;errors&quot;:/", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create - Director E4", 97, 2, "Test failed: text expected not to contain /&quot;errors&quot;:/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create - Officer E4", 97, 4, "Test failed: text expected not to contain /&quot;errors&quot;:/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Company with Connections H1B", 97, 4, "Test failed: text expected not to contain /&quot;errors&quot;:/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Spouse of Officer E1A", 132, 4, "Test failed: text expected not to contain /&quot;errors&quot;:/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Director E1A", 156, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Director E1B", 194, 11, "Test failed: text expected not to contain /&quot;errors&quot;:/", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create - Director E1C", 97, 4, "Test failed: text expected not to contain /&quot;errors&quot;:/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Non-Indi with Connection", 88, 5, "Test failed: text expected not to contain /&quot;errors&quot;:/", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Spouse of Director E1A", 104, 2, "Test failed: text expected not to contain /&quot;errors&quot;:/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Company with Connections - Director E4", 97, 7, "Test failed: text expected not to contain /&quot;errors&quot;:/", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create Individual - No Relationship", 87, 4, "Test failed: text expected not to contain /&quot;errors&quot;:/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Parent of Director E1B", 97, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections - BDO 0.5% and 15% H1A2", 97, 7, "Test failed: text expected not to contain /&quot;errors&quot;:/", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Indi with Connection to BDO 0.5 and 15%  H1C", 93, 5, "Test failed: text expected not to contain /&quot;errors&quot;:/", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
