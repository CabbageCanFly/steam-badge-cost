// ----
// Main
// ----

// Last modified
var len = document.lastModified.length;
var date = document.lastModified.substring(0,len-8).replace(/ /g,'').split('/');
var year = date[2];
date = date[2] + '-' + date[0] + '-' + date[1];
document.getElementById("lastModified").innerHTML = date;

// GET requests
var proxy = "https://cors-anywhere.herokuapp.com";

var steamCardReq = new XMLHttpRequest();
var steamStoreReq = new XMLHttpRequest();

steamCardReq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var arr = JSON.parse(this.responseText);
        console.log(arr);
        console.log(arr.data.length);
        
        var i;
        for(i = 0; i < arr.data.length; i++) {
            // document.getElementById("table_content").innerHTML += "<tr><td>" + arr.data[i][0][1] + "</td>" +
            //                                                     "<td>" + arr.data[i][2] + "</td></tr>";
            var tBody = document.getElementById("table_content");
            var row = tBody.insertRow();
            var cell = row.insertCell();
            cell.innerHTML = arr.data[i][0][1];
            cell = row.insertCell();
            cell.innerHTML = arr.data[i][2];
            // document.getElementById("table_content").innerHTML += "<tr><td>" + i + "</td></tr>";
            // arr.data[i][0][1];
        }
    }
};


var url = "https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest";
steamCardReq.open("GET", proxy + "/" + url, true);
steamCardReq.send();


// url = "https://store.steampowered.com/api/appdetails?appids=57690&filters=price_overview&currency=CAD";
// steamStoreReq.onreadystatechange = function() {
//     console.log("---Steam---")
//     console.log("Ready state: " + this.readyState);
//     console.log("Status: " + this.status);
//     if (this.readyState == 4 && this.status == 200) {
//         var myArr = JSON.parse(this.responseText);
//         console.log(this.responseText);
//         console.log(myArr);
//         var temp = myArr["57690"].data.price_overview.initial / 100;
//         document.getElementById("steamStoreReq").innerHTML = "$" + temp + " CAD";
//     }
// };

// steamStoreReq.open("GET", proxy + "/" + url, true);
// steamStoreReq.send();