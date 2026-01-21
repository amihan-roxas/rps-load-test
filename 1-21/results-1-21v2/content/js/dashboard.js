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

    var data = {"OkPercent": 98.67179307934289, "KoPercent": 1.328206920657113};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.12635442153093324, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Create Non-Individual - No Relationship"], "isController": false}, {"data": [0.30158730158730157, 500, 1500, "List 100 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Officer E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Officer E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - BDO 1% and 15% H1A1"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Director E4"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections H1B"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual with Connections (Proxy/Voting Trustee) HD2"], "isController": false}, {"data": [0.03, 500, 1500, "Search - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Director E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Officer E1A"], "isController": false}, {"data": [0.04, 500, 1500, "Search - Officer"], "isController": false}, {"data": [0.0, 500, 1500, "Search BDO"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual - No Relationship HD1"], "isController": false}, {"data": [0.0, 500, 1500, "Director E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Director E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Director E1C"], "isController": false}, {"data": [0.32287644787644787, 500, 1500, "List 10 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Non-Indi with Connection"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Officer E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Director E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - Director E4"], "isController": false}, {"data": [0.0, 500, 1500, "Create Individual - No Relationship"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual  - Stockholder to BDO HD2"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Director E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual HD1"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Officer E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - BDO 0.5% and 15% H1A2"], "isController": false}, {"data": [0.0, 500, 1500, "Search Individual Subjects"], "isController": false}, {"data": [0.025, 500, 1500, "Search - Director"], "isController": false}, {"data": [0.0, 500, 1500, "Indi with Connection to BDO 0.5 and 15%  H1C"], "isController": false}, {"data": [0.04, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.0, 500, 1500, "Search Non-Individual Subjects"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2861, 38, 1.328206920657113, 17914.342537574285, 322, 176205, 8935.0, 49105.4, 68128.70000000004, 108786.26000000005, 2.356134555789165, 7.830635470222198, 5.34801505726247], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Create Non-Individual - No Relationship", 28, 2, 7.142857142857143, 7836.392857142858, 2338, 24844, 6706.0, 15964.1, 21123.849999999977, 24844.0, 0.023508510920542913, 0.017808484137632256, 0.0615540579258105], "isController": false}, {"data": ["List 100 Persons", 63, 0, 0.0, 1997.3492063492065, 603, 10229, 1085.0, 4691.0, 6332.199999999998, 10229.0, 0.05255005392636486, 1.9308943526521511, 0.08076622018931366], "isController": false}, {"data": ["Officer E1A", 50, 7, 14.0, 23582.08, 1827, 97757, 15495.5, 72510.79999999999, 87579.39999999998, 97757.0, 0.1720785366441244, 0.15459508844836783, 0.5027919742570509], "isController": false}, {"data": ["Create - Officer E1C", 50, 0, 0.0, 11631.92, 2792, 31172, 9409.5, 25213.599999999995, 27209.04999999999, 31172.0, 0.18397436133300463, 0.1784551304930145, 0.5372087283416184], "isController": false}, {"data": ["Company with Connections - Officer E4", 50, 1, 2.0, 14748.36, 2040, 44870, 14119.0, 25387.6, 34435.549999999974, 44870.0, 0.19289379267775164, 0.17555218862119518, 0.6271497109004283], "isController": false}, {"data": ["Company with Connections - BDO 1% and 15% H1A1", 50, 3, 6.0, 27242.819999999992, 2269, 120126, 19109.5, 58340.89999999998, 108429.14999999995, 120126.0, 0.11616776483927027, 0.10403140987588637, 0.3948909888955234], "isController": false}, {"data": ["Create - Director E4", 50, 0, 0.0, 17474.800000000003, 3085, 41640, 13438.0, 34180.799999999996, 39259.29999999999, 41640.0, 0.16807513630893556, 0.16384699616116388, 0.4689460438894604], "isController": false}, {"data": ["Create - Officer E4", 50, 0, 0.0, 16205.580000000004, 2331, 36405, 15120.5, 32629.1, 35377.6, 36405.0, 0.17749630807679198, 0.17214368503635122, 0.5182649525108627], "isController": false}, {"data": ["Company with Connections H1B", 50, 3, 6.0, 58880.96, 16228, 164243, 54176.5, 83489.9, 88098.14999999998, 164243.0, 0.09885095648185492, 0.08828626050785668, 0.29247526749068825], "isController": false}, {"data": ["Create Non-Individual with Connections (Proxy/Voting Trustee) HD2", 16, 1, 6.25, 35516.312500000015, 879, 86564, 34879.5, 76724.80000000002, 86564.0, 86564.0, 0.13585572122406003, 0.1470333037564107, 0.4464648192057535], "isController": false}, {"data": ["Search - Officer E4", 50, 0, 0.0, 10302.9, 1059, 69213, 7714.5, 21694.499999999996, 24538.199999999993, 69213.0, 0.18750187501875018, 0.2576539437269373, 0.5316959907880329], "isController": false}, {"data": ["Child of Director E1C", 50, 0, 0.0, 26514.719999999998, 6511, 64244, 23818.5, 42280.5, 54369.549999999996, 64244.0, 0.15606905743653451, 0.20320678994041286, 0.4344419975200627], "isController": false}, {"data": ["Spouse of Officer E1A", 50, 4, 8.0, 63822.13999999999, 549, 171847, 55997.5, 130616.0, 145301.89999999997, 171847.0, 0.15374491873043594, 0.186649934735282, 0.4074510601096509], "isController": false}, {"data": ["Search - Officer", 50, 0, 0.0, 6720.379999999998, 597, 30835, 4808.0, 14765.8, 21804.149999999972, 30835.0, 0.18718179095537588, 0.2572433503668763, 0.5308175808157383], "isController": false}, {"data": ["Search BDO", 242, 0, 0.0, 25039.24380165289, 4342, 105078, 19721.0, 48999.10000000003, 58613.25, 81708.77999999998, 0.4233078182505143, 0.4191739528379116, 0.8432265501462336], "isController": false}, {"data": ["Create Non-Individual - No Relationship HD1", 41, 0, 0.0, 27690.58536585366, 4783, 88518, 24245.0, 68979.00000000009, 78347.5, 88518.0, 0.1227379544672125, 0.09510261996886646, 0.32123408709904355], "isController": false}, {"data": ["Director E1A", 50, 0, 0.0, 8603.02, 1902, 59488, 4034.0, 21530.5, 46898.149999999994, 59488.0, 0.20215415467218684, 0.19706476589538116, 0.564025884828735], "isController": false}, {"data": ["Director E1B", 100, 1, 1.0, 30072.31000000001, 4325, 108465, 24069.5, 56585.20000000001, 84150.29999999996, 108394.45999999996, 0.2533736704216645, 0.2452874872679731, 0.723626789926623], "isController": false}, {"data": ["Create - Director E1C", 50, 0, 0.0, 15576.300000000001, 3478, 34880, 13221.0, 29940.3, 31038.449999999993, 34880.0, 0.18455632659087554, 0.17990276765281263, 0.5149193604200502], "isController": false}, {"data": ["List 10 Persons", 1036, 0, 0.0, 3962.719111969109, 322, 99779, 1262.5, 10884.900000000003, 16916.499999999996, 32952.299999999996, 0.894625082144026, 3.5942261600981666, 1.3741035601393576], "isController": false}, {"data": ["Non-Indi with Connection", 45, 2, 4.444444444444445, 29751.0, 2854, 86887, 26150.0, 55282.79999999999, 70479.69999999994, 86887.0, 0.11512631915574033, 0.10780100735529262, 0.3497761432683083], "isController": false}, {"data": ["Parent of Officer E1B", 50, 3, 6.0, 55768.84, 24720, 111817, 54803.5, 81496.79999999999, 84041.79999999999, 111817.0, 0.1299947222142781, 0.1642986029142217, 0.36368816394804376], "isController": false}, {"data": ["Spouse of Director E1A", 50, 2, 4.0, 77464.18000000002, 15915, 169968, 69105.0, 131074.1, 152771.3999999999, 169968.0, 0.11785059373129121, 0.1469403555198861, 0.3121429495293047], "isController": false}, {"data": ["Company with Connections - Director E4", 50, 0, 0.0, 15072.7, 2879, 38530, 13271.5, 25926.5, 32355.3, 38530.0, 0.17799802066201023, 0.1639528643441485, 0.5789628978700757], "isController": false}, {"data": ["Create Individual - No Relationship", 27, 3, 11.11111111111111, 5867.851851851853, 1823, 10755, 5813.0, 9053.4, 10484.599999999999, 10755.0, 0.022688408324124918, 0.017629306858621803, 0.05560252035654413], "isController": false}, {"data": ["Create Non-Individual  - Stockholder to BDO HD2", 25, 1, 4.0, 21953.12, 3701, 62618, 17269.0, 50389.4, 59374.399999999994, 62618.0, 0.12015995693467144, 0.11271567210270311, 0.4102899279520898], "isController": false}, {"data": ["Parent of Director E1B", 50, 1, 2.0, 64212.38, 28076, 175764, 60939.0, 91930.7, 107785.04999999997, 175764.0, 0.1265499201470004, 0.16467061191315638, 0.3547401882683162], "isController": false}, {"data": ["Create Non-Individual HD1", 37, 3, 8.108108108108109, 50906.5135135135, 8393, 114707, 51247.0, 91438.80000000003, 101914.40000000002, 114707.0, 0.13145740069636894, 0.14303903085696015, 0.5382023089426562], "isController": false}, {"data": ["Child of Officer E1C", 50, 0, 0.0, 32823.0, 6215, 112024, 25076.0, 66624.4, 85421.34999999993, 112024.0, 0.12946056372307868, 0.16848584381100828, 0.3604566430099063], "isController": false}, {"data": ["Company with Connections - BDO 0.5% and 15% H1A2", 50, 1, 2.0, 25646.54, 2008, 103566, 17627.5, 60106.999999999985, 75883.54999999997, 103566.0, 0.10818483162112806, 0.09872288482426456, 0.3680228221311546], "isController": false}, {"data": ["Search Individual Subjects", 29, 0, 0.0, 16826.827586206895, 3971, 40853, 15963.0, 27941.0, 34571.5, 40853.0, 0.024024123533700047, 0.7403420046267148, 0.06775149089361455], "isController": false}, {"data": ["Search - Director", 100, 0, 0.0, 9752.319999999998, 742, 38834, 7415.5, 20053.9, 29941.849999999995, 38792.08999999998, 0.24113468336604726, 0.31700968954512354, 0.6842714703307885], "isController": false}, {"data": ["Indi with Connection to BDO 0.5 and 15%  H1C", 49, 0, 0.0, 22225.938775510214, 2110, 59710, 18432.0, 42235.0, 52596.5, 59710.0, 0.11975228384712766, 0.113835791666463, 0.3700420988848374], "isController": false}, {"data": ["HTTP Request", 50, 0, 0.0, 3339.9599999999987, 1194, 7167, 3055.5, 5415.0, 6248.149999999998, 7167.0, 6.974473427256242, 7.334230933533268, 3.5485357964848654], "isController": false}, {"data": ["Search Non-Individual Subjects", 23, 0, 0.0, 33410.69565217391, 14136, 176205, 24174.0, 57391.4, 152656.19999999966, 176205.0, 0.11251730565081478, 1.6631082049576102, 0.2257559985788575], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected not to contain /&quot;errors&quot;:/", 38, 100.0, 1.328206920657113], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2861, 38, "Test failed: text expected not to contain /&quot;errors&quot;:/", 38, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Create Non-Individual - No Relationship", 28, 2, "Test failed: text expected not to contain /&quot;errors&quot;:/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Officer E1A", 50, 7, "Test failed: text expected not to contain /&quot;errors&quot;:/", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections - Officer E4", 50, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Company with Connections - BDO 1% and 15% H1A1", 50, 3, "Test failed: text expected not to contain /&quot;errors&quot;:/", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections H1B", 50, 3, "Test failed: text expected not to contain /&quot;errors&quot;:/", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create Non-Individual with Connections (Proxy/Voting Trustee) HD2", 16, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Spouse of Officer E1A", 50, 4, "Test failed: text expected not to contain /&quot;errors&quot;:/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Director E1B", 100, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Non-Indi with Connection", 45, 2, "Test failed: text expected not to contain /&quot;errors&quot;:/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Parent of Officer E1B", 50, 3, "Test failed: text expected not to contain /&quot;errors&quot;:/", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Spouse of Director E1A", 50, 2, "Test failed: text expected not to contain /&quot;errors&quot;:/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Individual - No Relationship", 27, 3, "Test failed: text expected not to contain /&quot;errors&quot;:/", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create Non-Individual  - Stockholder to BDO HD2", 25, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Parent of Director E1B", 50, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create Non-Individual HD1", 37, 3, "Test failed: text expected not to contain /&quot;errors&quot;:/", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections - BDO 0.5% and 15% H1A2", 50, 1, "Test failed: text expected not to contain /&quot;errors&quot;:/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
