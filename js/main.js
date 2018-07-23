// ----
// Main
// ----

// Last modified
var len = document.lastModified.length;
var date = document.lastModified.substring(0,len-8).replace(/ /g,'').split('/');
var year = date[2];
date = date[2] + '-' + date[0] + '-' + date[1];
document.getElementById("lastModified").innerHTML = date;

// Store Steam prices from JSON into memory
var storePrices;
var file = "../resources/data.json";

var jsonFile = new XMLHttpRequest();
jsonFile.open("GET", file);
jsonFile.onreadystatechange = function() {
    if(this.readyState === 4) {
        if(this.status === 200 || this.status == 0) {
            storePrices = JSON.parse(this.responseText);
        }
    }
}
jsonFile.send();

// GET requests
var steamCardReq = new XMLHttpRequest();
var steamStoreReq = new XMLHttpRequest();

// Work-around for no access-control-allow-origin header in the URLs used
var proxy = "https://cors-anywhere.herokuapp.com";

steamCardReq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var arr = JSON.parse(this.responseText);
        arr = arr.data;
        console.log(arr.length);
        
        var i;
        // for(i = 0; i < arr.length; i++) {
        for(i = 0; i < arr.length; i += 100) {
            var tBody = document.getElementById("table_content");
            var row = tBody.insertRow();
            var cell = row.insertCell();
            // cell.innerHTML = i + 1;
            // cell = row.insertCell();
            cell.innerHTML = arr[i][0][1];
            cell = row.insertCell();
            cell.innerHTML = arr[i][2];
            cell = row.insertCell();
            if (storePrices[arr[i][0][0]] != undefined) {
                cell.innerHTML = "$" + storePrices[arr[i][0][0]]['initial'] / 100;
            }
            else {
                cell.innerHTML = "N/A";
            }
        }
    }
};

var url = "https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest";
steamCardReq.open("GET", proxy + "/" + url);
steamCardReq.send();

// url = "https://store.steampowered.com/api/appdetails?appids=57690&filters=price_overview";

// Sort the rows in a table element.
// <id> is the id of the table element.
// <n> is the nth column to sort by.
function sortTable_old(id, n) {
    var table, rows, i, row1, row2, swap, dir = 0, swapCount = 0;
    
    table = document.getElementById(id);

    var sorted = false;

    // Loop until sorted
    while (!sorted) {
        console.log('Sort!');
        sorted = true;
        rows = table.getElementsByTagName("TR");
        
        for (i = 1; i < (rows.length - 1); i++) {
            swap = false;

            row1 = rows[i].getElementsByTagName("TD")[n];
            row2 = rows[i + 1].getElementsByTagName("TD")[n];

            if (n == 0) {       
                // Ascending
                if (dir == 0) {
                    if (row1.innerHTML.toLowerCase() > row2.innerHTML.toLowerCase()) {
                        swap = true;
                        break;
                    }
                }
                // Descending
                else if (dir == 1) {
                    if (row1.innerHTML.toLowerCase() < row2.innerHTML.toLowerCase()) {
                        swap = true;
                        break;
                    }
                }
            } else {
                // Ascending
                if (dir == 0) {
                    if (parseFloat(row1.innerHTML) > parseFloat(row2.innerHTML)) {
                        swap = true;
                        break;
                    }
                }
                // Descending
                else if (dir == 1) {
                    if (parseFloat(row1.innerHTML) < parseFloat(row2.innerHTML)) {
                        swap = true;
                        break;
                    }
                }
            }
        }

        if (swap) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            sorted = false;
            swapCount ++;
        } else if (swapCount == 0 && dir == 0) {
            dir = 1;
            sorted = false;
        }
    }
    console.log('Sort completed.');
}

function sortTable(id, n){
    var tbl = document.getElementById(id).tBodies[0];
    var store = [];
    var sortnr;
    console.log(tbl);
    for(var i=0, len=tbl.rows.length; i<len; i++){
        console.log(i);
        var row = tbl.rows[i];
        if (n != 0) {
            sortnr = parseFloat(row.cells[n].innerText);
        } else {
            sortnr = row.cells[n].innerText;
        }
        console.log(sortnr); 
        if(!isNaN(sortnr)) {
            store.push([sortnr, row]);
            console.log('ye'); 
        }
    }
    console.log(store);
    store.sort(function(x,y){
        return x[0] - y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    console.log(store);
    store = null;
    console.log('Sort completed.');
}