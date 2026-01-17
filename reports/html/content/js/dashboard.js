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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5111607142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Create Non-Individual - No Relationship"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Director"], "isController": false}, {"data": [0.8, 500, 1500, "List 100 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Officer"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Director"], "isController": false}, {"data": [0.0, 500, 1500, "Spouse of Officer"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections"], "isController": false}, {"data": [0.875, 500, 1500, "Search - Officer"], "isController": false}, {"data": [1.0, 500, 1500, "Search BDO"], "isController": false}, {"data": [0.0, 500, 1500, "Child of Director"], "isController": false}, {"data": [0.0, 500, 1500, "Create - Officer"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual"], "isController": false}, {"data": [1.0, 500, 1500, "List 10 Persons"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - Officer"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Director"], "isController": false}, {"data": [0.0, 500, 1500, "Director"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - Director"], "isController": false}, {"data": [0.0, 500, 1500, "Create Individual - No Relationship"], "isController": false}, {"data": [0.0, 500, 1500, "Company with Connections - BDO 1% and 15%"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual with Connections (Proxy/Voting Trustee)"], "isController": false}, {"data": [0.0, 500, 1500, "Create Non-Individual  - Stockholder to BDO"], "isController": false}, {"data": [0.5, 500, 1500, "Search Individual Subjects"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Search - Director"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.0, 500, 1500, "Parent of Officer"], "isController": false}, {"data": [1.0, 500, 1500, "Search Non-Individual Subjects"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 0, 0.0, 2341.1562500000014, 161, 7411, 517.5, 4739.5, 5224.25, 6864.75, 0.1865398195893459, 0.569778566199984, 0.4348955145396963], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Create Non-Individual - No Relationship", 7, 0, 0.0, 4763.0, 4205, 7411, 4328.0, 7411.0, 7411.0, 7411.0, 0.006799635151005326, 0.0052884997163580765, 0.017875603346197595], "isController": false}, {"data": ["Spouse of Director", 5, 0, 0.0, 5374.8, 4927, 5825, 5402.0, 5825.0, 5825.0, 5825.0, 0.004645985218333429, 0.005934520181230591, 0.012345435331137949], "isController": false}, {"data": ["List 100 Persons", 5, 0, 0.0, 499.6, 465, 573, 479.0, 573.0, 573.0, 573.0, 0.004666094292433462, 0.17196653564662737, 0.007217864608608011], "isController": false}, {"data": ["Child of Officer", 4, 0, 0.0, 4312.5, 4154, 4431, 4332.5, 4431.0, 4431.0, 4431.0, 0.005052942201920624, 0.006566604331255731, 0.014113943293987756], "isController": false}, {"data": ["Create - Director", 9, 0, 0.0, 4292.333333333333, 4146, 4614, 4258.0, 4614.0, 4614.0, 4614.0, 0.00840712924560027, 0.008195491443410679, 0.02354014433406195], "isController": false}, {"data": ["Spouse of Officer", 5, 0, 0.0, 5166.2, 4587, 6986, 4674.0, 6986.0, 6986.0, 6986.0, 0.0046308773938162975, 0.0059242669784173325, 0.012314335100939234], "isController": false}, {"data": ["Company with Connections", 4, 0, 0.0, 5571.0, 5257, 5843, 5592.0, 5843.0, 5843.0, 5843.0, 0.004971766580530811, 0.004561498732820993, 0.014767214897152794], "isController": false}, {"data": ["Search - Officer", 8, 0, 0.0, 489.87500000000006, 447, 546, 490.0, 546.0, 546.0, 546.0, 0.009427380885042518, 0.012954593093618606, 0.02682752724513076], "isController": false}, {"data": ["Search BDO", 12, 0, 0.0, 198.66666666666666, 161, 245, 196.5, 238.70000000000002, 245.0, 245.0, 0.014740384969720792, 0.014524461361765897, 0.02950955975383557], "isController": false}, {"data": ["Child of Director", 4, 0, 0.0, 4360.5, 4105, 4569, 4384.0, 4569.0, 4569.0, 4569.0, 0.0050210570580371434, 0.006543555316357977, 0.014029784675106228], "isController": false}, {"data": ["Create - Officer", 9, 0, 0.0, 4407.111111111111, 4216, 4793, 4362.0, 4793.0, 4793.0, 4793.0, 0.008400961069946401, 0.00814845822528764, 0.02461401375984079], "isController": false}, {"data": ["Create Non-Individual", 4, 0, 0.0, 4673.75, 4545, 4813, 4668.5, 4813.0, 4813.0, 4813.0, 0.004997232782346775, 0.005724369193059344, 0.02052574324467826], "isController": false}, {"data": ["List 10 Persons", 81, 0, 0.0, 356.41975308642, 294, 470, 340.0, 434.4, 444.79999999999995, 470.0, 0.06977705799248819, 0.2818338982977844, 0.1078682449239344], "isController": false}, {"data": ["Company with Connections - Officer", 4, 0, 0.0, 4211.0, 3550, 4495, 4399.5, 4495.0, 4495.0, 4495.0, 0.005011074474588842, 0.004606126805865964, 0.016343492164558677], "isController": false}, {"data": ["Parent of Director", 5, 0, 0.0, 4952.8, 4327, 6501, 4731.0, 6501.0, 6501.0, 6501.0, 0.004631623800988388, 0.006119713869860634, 0.013035488080516147], "isController": false}, {"data": ["Director", 20, 0, 0.0, 4404.6500000000015, 4132, 4843, 4404.5, 4622.3, 4832.05, 4843.0, 0.017612905327991927, 0.017143342519931205, 0.050477141861384675], "isController": false}, {"data": ["Company with Connections - Director", 4, 0, 0.0, 4535.0, 4357, 4808, 4487.5, 4808.0, 4808.0, 4808.0, 0.004952879542254872, 0.004545379443197282, 0.01615127247214315], "isController": false}, {"data": ["Create Individual - No Relationship", 3, 0, 0.0, 4199.333333333333, 4034, 4458, 4106.0, 4458.0, 4458.0, 4458.0, 0.003740088764773351, 0.00306438913441879, 0.009207777124993766], "isController": false}, {"data": ["Company with Connections - BDO 1% and 15%", 4, 0, 0.0, 4411.5, 4268, 4490, 4444.0, 4490.0, 4490.0, 4490.0, 0.0050178698891427094, 0.00460869788158078, 0.017104369968801394], "isController": false}, {"data": ["Create Non-Individual with Connections (Proxy/Voting Trustee)", 4, 0, 0.0, 4690.5, 4502, 5071, 4594.5, 5071.0, 5071.0, 5071.0, 0.004984877129009866, 0.005566608395530061, 0.016427214718597455], "isController": false}, {"data": ["Create Non-Individual  - Stockholder to BDO", 4, 0, 0.0, 4525.0, 4391, 4624, 4542.5, 4624.0, 4624.0, 4624.0, 0.005009329876895718, 0.00480631504301762, 0.017173098176603924], "isController": false}, {"data": ["Search Individual Subjects", 2, 0, 0.0, 631.5, 549, 714, 631.5, 714.0, 714.0, 714.0, 0.0036650778554163433, 0.01241795665953809, 0.010377825431425477], "isController": false}, {"data": ["Search - Director", 9, 0, 0.0, 474.22222222222223, 424, 544, 458.0, 544.0, 544.0, 544.0, 0.00841282675652812, 0.011060092120452983, 0.023956838693394527], "isController": false}, {"data": ["HTTP Request", 1, 0, 0.0, 1644.0, 1644, 1644, 1644.0, 1644.0, 1644.0, 1644.0, 0.6082725060827251, 0.645695521593674, 0.30888838199513385], "isController": false}, {"data": ["Parent of Officer", 5, 0, 0.0, 4772.2, 4348, 5471, 4689.0, 5471.0, 5471.0, 5471.0, 0.004659736706237151, 0.0061386570475721845, 0.013087307389783248], "isController": false}, {"data": ["Search Non-Individual Subjects", 2, 0, 0.0, 376.5, 290, 463, 376.5, 463.0, 463.0, 463.0, 0.0037746674517974968, 0.04045971674895442, 0.00761752957923782], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
