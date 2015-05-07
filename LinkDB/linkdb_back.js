var fs = require("fs");
var http = require("http");
var sqlite = require("sqlite3");

function giveBackFile( name, res )
{
    var contents = "";
    try {
    	contents = fs.readFileSync( name ).toString();
    }
    catch( e ) {
    	console.log(
    	    "Error: Something bad happened trying to open "+name );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function getValue( res )
{
  var db = new sqlite.Database("linkdb.sqlite");
  var resp_text = "<!DOCTYPE html>"+ "<html>" +"<head> <style> table{ border-collapse: collapse;} table, th, td {border: 1px solid black;} </style> </head>" +"<body>" + "<table>"
  +"<tr>" + "<th>Link Address</th>" + "<th>Nickname</th>"+ "</tr>";
  var data = [];
  db.each("SELECT LINKADDRESS, NICKNAME FROM LINKS", function (err, row) {
    data.push(row);
    console.log(row);
    console.log(err);
  resp_text += "<tr>" + "<td>" + row.LinkAddress + "</td>" +
   "<td>" + row.Nickname + "</td>" + "</tr>" ;

} );

db.close(
function() {
console.log("Complete!" + resp_text);

resp_text += "</table>" + "</body>" + "</html>";
res.writeHead(200);
res.end(JSON.stringify(data))
//res.end( resp_text );
}
)
}

function addLink( res )
{
  
}


function doServer(req, res)
{
  console.log(req.url);
 if( req.url == "/get_value" )
    {
        getValue( res );
    }
 else if( req.url == "/add_link" )
       {
           addLink( res );
       }
else if( req.url == "/linkdb_front.js" )
 {
    console.log("jsrequest");

     giveBackFile( "linkdb_front.js", res )
 }
 else
 {
     giveBackFile( "index.html", res )
 }
}


var server= http.createServer(doServer);
server.listen(8080);
