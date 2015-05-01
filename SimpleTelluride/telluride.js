var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function listPerformers( req, res )
{
    var db = new sqlite.Database( "telluride.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>"+
  "<table border-collapse: collapse; border: 1px solid black; >"+
  "<tr>" + "<th>Perform</th>"+"<th>Stage</th>"+"<th>Time</th>"+ "</tr>";


  db.each( "SELECT ID, PERFORMER, STAGE, TIME FROM PERFORMANCE", function( err, row ) {
      db.each( "SELECT NAME FROM PERFORMERS WHERE ID = " +
               row.PERFORMER, function( err2, row2 ) {
                   console.log( "Performer: "+row.PERFORMER + " " + row2.NAME );

                  resp_text += "<tr>" + "<td>" + row2.NAME + "</td>" + "<td>" + row2.STAGE + "</td>" + "<td>" + row2.TIME + "</td>" + "</tr>" ;

    });

},

  function()
        {
           console.log( "Complete! "+ resp_text );
   	       resp_text += "</table>" + "</body>" + "</html>";
   	       res.writeHead( 200 );
   	       res.end( resp_text );
  	 }

)
}

function serveFile( filename, req, res )
{
    try
    {
    	var contents = fs.readFileSync( filename ).toString();
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open "+filename );
    	res.writeHead(404);
	res.end("");
	return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function serverFn( req, res )
{

    var filename = req.url.substring( 1, req.url.length );
    console.log(filename);
    if( filename == "" )
    {
        filename = "./index.html";
    }
    if( filename == "list_performers?" )
    {
        listPerformers( req, res );
    }
    else
    {
        serveFile( filename, req, res );
    }
}

var server = http.createServer( serverFn );

server.listen( 8080 );
