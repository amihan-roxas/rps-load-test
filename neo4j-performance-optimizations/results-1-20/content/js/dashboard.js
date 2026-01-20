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

    var data = {"OkPercent": 97.01398711299701, "KoPercent": 2.986012887002986};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.46644664466446645, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.013157894736842105, 500, 1500, "Create Non-Individual - No Relationship"], "isController": false}, {"data": [0.7923387096774194, 500, 1500, "List 100 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Officer E1A"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Officer E1C"], "isController": false}, {"data": [0.004807692307692308, 500, 1500, "Company with Connections - Officer E4"], "isController": false}, {"data": [0.0025, 500, 1500, "Company with Connections - BDO 1% and 15% H1A1"], "isController": false}, {"data": [0.006818181818181818, 500, 1500, "Create - Director E4"], "isController": false}, {"data": [0.007075471698113208, 500, 1500, "Create - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections H1B"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual with Connections (Proxy/Voting Trustee) HD2"], "isController": false}, {"data": [0.9786729857819905, 500, 1500, "Search - Officer E4"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Director E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Officer E1A"], "isController": false}, {"data": [0.9653465346534653, 500, 1500, "Search - Officer"], "isController": false}, {"data": [0.21279264214046822, 500, 1500, "Search BDO"], "isController": false}, {"data": [0.002512562814070352, 500, 1500, "Create Non-Individual - No Relationship HD1"], "isController": false}, {"data": [0.0020161290322580645, 500, 1500, "Director E1A"], "isController": false}, {"data": [0.00423728813559322, 500, 1500, "Director E1B"], "isController": false}, {"data": [0.014634146341463415, 500, 1500, "Create - Director E1C"], "isController": false}, {"data": [0.9949260975071696, 500, 1500, "List 10 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Non-Indi with Connection"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Officer E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Director E1A"], "isController": false}, {"data": [0.002380952380952381, 500, 1500, "Company with Connections - Director E4"], "isController": false}, {"data": [0.027559055118110236, 500, 1500, "Create Individual - No Relationship"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual  - Stockholder to BDO HD2"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Director E1B"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual HD1"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Officer E1C"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - BDO 0.5% and 15% H1A2"], "isController": false}, {"data": [0.47107438016528924, 500, 1500, "Search Individual Subjects"], "isController": false}, {"data": [0.969047619047619, 500, 1500, "Search - Director"], "isController": false}, {"data": [0.010050251256281407, 500, 1500, "Indi with Connection to BDO 0.5 and 15%  H1C"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.6828358208955224, 500, 1500, "Search Non-Individual Subjects"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12726, 380, 2.986012887002986, 1752.5106867829627, 36, 154463, 1209.0, 3419.600000000002, 6347.249999999998, 12708.489999999994, 10.389012431548114, 33.63208453542517, 23.994263111066754], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Create Non-Individual - No Relationship", 114, 18, 15.789473684210526, 1837.7368421052638, 952, 3520, 1785.5, 2291.0, 2431.25, 3385.749999999995, 0.09809928335891947, 0.07267696701970935, 0.25686522879506546], "isController": false}, {"data": ["List 100 Persons", 248, 0, 0.0, 509.3266129032258, 373, 3245, 485.0, 600.0, 649.7499999999999, 1009.199999999998, 0.2123540387083737, 7.8215861225137235, 0.32637375482827147], "isController": false}, {"data": ["Officer E1A", 248, 0, 0.0, 1920.1290322580662, 1508, 3504, 1881.5, 2214.2, 2345.85, 2831.7699999999995, 0.21033686976331165, 0.20441982009412576, 0.6145805261029752], "isController": false}, {"data": ["Create - Officer E1C", 204, 0, 0.0, 1858.2205882352935, 1504, 3971, 1819.5, 2145.0, 2364.0, 2739.949999999998, 0.1898826078700756, 0.18417874870386505, 0.5544541971619066], "isController": false}, {"data": ["Company with Connections - Officer E4", 208, 19, 9.134615384615385, 1910.2740384615374, 799, 9610, 1859.0, 2175.2, 2294.1, 3150.0699999999993, 0.18995190929065747, 0.16836881623202993, 0.6177387843328944], "isController": false}, {"data": ["Company with Connections - BDO 1% and 15% H1A1", 200, 29, 14.5, 2161.0599999999995, 50, 13288, 1844.0, 2425.8, 2917.2999999999993, 12061.120000000006, 0.21029012677340292, 0.18223261840385588, 0.7149381710883671], "isController": false}, {"data": ["Create - Director E4", 220, 0, 0.0, 1852.581818181819, 1468, 2830, 1833.0, 2087.3, 2252.6, 2766.509999999999, 0.19582657954164118, 0.19089701396733078, 0.546372498983037], "isController": false}, {"data": ["Create - Officer E4", 212, 0, 0.0, 1840.6132075471692, 1491, 2973, 1812.0, 2089.9, 2190.95, 2922.03, 0.19047242552258625, 0.1847351245640248, 0.5561602148811974], "isController": false}, {"data": ["Company with Connections H1B", 200, 17, 8.5, 11855.189999999995, 666, 152161, 9634.0, 17838.800000000003, 21380.25, 76928.39000000001, 0.1911720567628071, 0.16931795425826196, 0.5656555262942825], "isController": false}, {"data": ["Create Non-Individual with Connections (Proxy/Voting Trustee) HD2", 198, 69, 34.84848484848485, 1762.3939393939402, 36, 7545, 1956.5, 2607.0, 3092.549999999999, 5952.089999999986, 0.21117454642800387, 0.1959930429718871, 0.693170616501691], "isController": false}, {"data": ["Search - Officer E4", 211, 0, 0.0, 437.298578199052, 398, 638, 429.0, 475.8, 497.19999999999993, 603.2399999999997, 0.19040949773403673, 0.2785235937446419, 0.5399506593492869], "isController": false}, {"data": ["Child of Director E1C", 200, 0, 0.0, 1924.8799999999999, 1558, 3458, 1876.0, 2226.1, 2484.849999999999, 3194.91, 0.20977818055188444, 0.27331392754051864, 0.5840376144077752], "isController": false}, {"data": ["Spouse of Officer E1A", 247, 0, 0.0, 6425.587044534417, 3419, 13284, 6214.0, 8869.2, 9384.8, 13018.800000000003, 0.21013121716168023, 0.2691367421983469, 0.5568990685848726], "isController": false}, {"data": ["Search - Officer", 202, 0, 0.0, 447.46039603960384, 399, 1310, 427.0, 478.0, 558.3499999999999, 854.55, 0.18889414633872648, 0.2828827917666465, 0.535663683849644], "isController": false}, {"data": ["Search BDO", 1196, 0, 0.0, 1845.9506688963222, 487, 9420, 1739.5, 2909.6, 3797.449999999997, 6461.579999999998, 1.1404465668362715, 1.1273538695561793, 2.2717822552807636], "isController": false}, {"data": ["Create Non-Individual - No Relationship HD1", 199, 34, 17.08542713567839, 1862.6783919597992, 675, 6180, 1779.0, 2234.0, 2451.0, 3515.0, 0.20460010959985772, 0.15074619118646473, 0.5356003467791933], "isController": false}, {"data": ["Director E1A", 248, 0, 0.0, 2010.818548387097, 1468, 4093, 1930.5, 2432.5, 2666.55, 3547.2299999999914, 0.2113145297484846, 0.2059907269773672, 0.5895799529931681], "isController": false}, {"data": ["Director E1B", 472, 0, 0.0, 1895.673728813559, 1460, 2726, 1857.5, 2195.7, 2361.7999999999997, 2639.7, 0.4091546621960163, 0.3982428102120496, 1.1685332135848017], "isController": false}, {"data": ["Create - Director E1C", 205, 0, 0.0, 1801.6634146341455, 1437, 2574, 1763.0, 2050.2, 2152.2, 2503.4, 0.19030732311862644, 0.18551337721232264, 0.5309703048050278], "isController": false}, {"data": ["List 10 Persons", 4533, 0, 0.0, 317.91242003088576, 197, 3594, 298.0, 403.0, 424.0, 498.3199999999997, 3.8294949679270296, 15.467569518892764, 5.881940497627369], "isController": false}, {"data": ["Non-Indi with Connection", 199, 32, 16.08040201005025, 2048.8241206030143, 918, 5971, 1952.0, 2734.0, 2959.0, 5262.0, 0.20544650028597328, 0.18314819112873754, 0.624239738257029], "isController": false}, {"data": ["Parent of Officer E1B", 225, 0, 0.0, 5325.724444444446, 3100, 11378, 5174.0, 7253.6, 7590.199999999999, 9354.380000000003, 0.19798843747525144, 0.26052751956785725, 0.5539027302055559], "isController": false}, {"data": ["Spouse of Director E1A", 246, 0, 0.0, 11285.922764227644, 3650, 154463, 9711.0, 16026.900000000001, 18496.74999999999, 66556.74000000009, 0.20652362806605734, 0.26444114895138887, 0.5470469062592611], "isController": false}, {"data": ["Company with Connections - Director E4", 210, 27, 12.857142857142858, 1882.952380952381, 1078, 3103, 1853.5, 2241.0, 2380.5499999999993, 2874.1799999999967, 0.19067231056705944, 0.16615020574450273, 0.6200334757587396], "isController": false}, {"data": ["Create Individual - No Relationship", 127, 0, 0.0, 1871.3543307086618, 1382, 3372, 1795.0, 2272.6, 2551.399999999999, 3301.4399999999996, 0.10948228671428141, 0.0895537626992987, 0.2682984461812664], "isController": false}, {"data": ["Create Non-Individual  - Stockholder to BDO HD2", 199, 37, 18.592964824120603, 2028.6030150753772, 877, 4417, 1962.0, 2536.0, 3035.0, 4153.0, 0.20427688037381642, 0.18001940181262369, 0.6976776833538979], "isController": false}, {"data": ["Parent of Director E1B", 232, 0, 0.0, 5467.318965517243, 2793, 11732, 5294.0, 7519.200000000001, 7788.55, 9765.629999999981, 0.203250964127957, 0.2679218809956844, 0.5697038079878506], "isController": false}, {"data": ["Create Non-Individual HD1", 199, 68, 34.17085427135678, 1853.211055276383, 46, 6120, 1974.0, 2881.0, 3382.0, 5727.0, 0.20474177843441474, 0.18960638393095983, 0.8347756836472021], "isController": false}, {"data": ["Child of Officer E1C", 200, 0, 0.0, 1931.574999999999, 1527, 4375, 1839.5, 2167.5, 2573.7999999999975, 3839.6500000000005, 0.20994686244911412, 0.27307956520267224, 0.5844816087204578], "isController": false}, {"data": ["Company with Connections - BDO 0.5% and 15% H1A2", 200, 30, 15.0, 2435.6750000000006, 871, 30250, 1891.5, 2724.6000000000004, 6291.749999999998, 13770.960000000036, 0.2108152436286363, 0.1822234262115025, 0.7170281417927518], "isController": false}, {"data": ["Search Individual Subjects", 121, 0, 0.0, 954.7272727272729, 683, 8122, 808.0, 1063.0, 1528.6999999999998, 7054.120000000005, 0.10354075141491431, 3.174888150852029, 0.29199471284341727], "isController": false}, {"data": ["Search - Director", 420, 0, 0.0, 443.6166666666668, 388, 1053, 430.0, 477.90000000000003, 516.4999999999999, 730.1100000000001, 0.3761236694625193, 0.5412033754972444, 1.067333119189113], "isController": false}, {"data": ["Indi with Connection to BDO 0.5 and 15%  H1C", 199, 0, 0.0, 1987.824120603015, 1471, 6418, 1879.0, 2479.0, 2667.0, 4688.0, 0.2054132056950037, 0.1952693561302423, 0.6347451115011783], "isController": false}, {"data": ["HTTP Request", 50, 0, 0.0, 2180.6000000000004, 1571, 5326, 2028.5, 2600.5, 3990.94999999999, 5326.0, 9.379103357719002, 9.862896560213843, 4.771985204464452], "isController": false}, {"data": ["Search Non-Individual Subjects", 134, 0, 0.0, 677.3582089552239, 385, 8795, 522.5, 799.0, 1443.0, 6670.500000000035, 0.1144368978719007, 1.6600263976139906, 0.22957101215166134], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected not to contain /&quot;errors&quot;:/", 380, 100.0, 2.986012887002986], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12726, 380, "Test failed: text expected not to contain /&quot;errors&quot;:/", 380, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Create Non-Individual - No Relationship", 114, 18, "Test failed: text expected not to contain /&quot;errors&quot;:/", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections - Officer E4", 208, 19, "Test failed: text expected not to contain /&quot;errors&quot;:/", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Company with Connections - BDO 1% and 15% H1A1", 200, 29, "Test failed: text expected not to contain /&quot;errors&quot;:/", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections H1B", 200, 17, "Test failed: text expected not to contain /&quot;errors&quot;:/", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create Non-Individual with Connections (Proxy/Voting Trustee) HD2", 198, 69, "Test failed: text expected not to contain /&quot;errors&quot;:/", 69, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Non-Individual - No Relationship HD1", 199, 34, "Test failed: text expected not to contain /&quot;errors&quot;:/", 34, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Non-Indi with Connection", 199, 32, "Test failed: text expected not to contain /&quot;errors&quot;:/", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections - Director E4", 210, 27, "Test failed: text expected not to contain /&quot;errors&quot;:/", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Non-Individual  - Stockholder to BDO HD2", 199, 37, "Test failed: text expected not to contain /&quot;errors&quot;:/", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Non-Individual HD1", 199, 68, "Test failed: text expected not to contain /&quot;errors&quot;:/", 68, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Company with Connections - BDO 0.5% and 15% H1A2", 200, 30, "Test failed: text expected not to contain /&quot;errors&quot;:/", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
