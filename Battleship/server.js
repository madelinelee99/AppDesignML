var fs = require("fs");
var http = require("http");
var sqlite = require("sqlite3");
var host = true;
var guest = false;
var singleplayer = true;
var multiplayer = false;

function singlePlayer( singleplayer_clicked, res )
{
    if ( singleplayer_clicked )
    {
       singleplayer === true;
       multiplayer === false;
    }
}

function multiPlayer( multiplayer_clicked, res )
{
    if ( multiplayer_clicked )
    {
        singleplayer === false;
        multiplayer === true;
    }

}

function addName ( req, res )
{
  //var name = req.url.split("?")[1]; (Need to observe URL to know what to split)
  var db = new sqlite.Database("battleship.sqlite");
  db.run("INSERT INTO Users( 'Username') VALUES + ('" + name + "')",
  function( err )
  {
    if ( err!== null )
    {
      console.log("error in add name");
    }
  } );
  db.close(
  function()
  {
    res.writeHead(200);
    res.end( "" );

  });
}

function addDate ( req, res )
{
  var date = new Date();
  var db = new sqlite.Database("battleship.sqlite");
  db.run("INSERT INTO Users( 'Date') VALUES + ('" + date + "')",
  function( err )
  {
    if ( err!== null )
    {
      console.log("error in add date");
    }
  } );
  db.close(
  function()
  {
    res.writeHead(200);
    res.end( "" );

  });
}

function addScore ( req, res )
{
  //var score = req.url.split; (Need URL to write split)
  var db = new sqlite.Database("battleship.sqlite");
  db.run("INSERT INTO Users( 'Score') VALUES + ('" + score + "')",
  function( err )
  {
    if ( err!== null )
    {
      console.log("error in add score");
    }
  } );
  db.close(
  function()
  {
    res.writeHead(200);
    res.end( "" );

  });
}

function sendBackTable( res )
{
    var db = new sqlite.Database( "linkdb.sqlite" );
    var resp_text = "<!DOCTYPE html>"+ "<html>" +"<head> <style> table{ border-collapse: collapse;} table, th, td {border: 1px solid black;} </style> </head>" +"<body>" + "<table>"
  +"<tr>" + "<th>Username</th>" + "<th>Score</th>"+ "<th>Date</th>" +  "</tr>";
    var data = [];
    db.each("SELECT * FROM Users",
    function (err, row)
    {
      data.push(row);
      resp_text += "<tr><td>" + row.Username "</td> <td>"+ row.Score + "</td><td>" + row.Date "</td></tr>"
    });
    db.close(
    function()
    {
      resp_text += "</table></body></html>";
      res.writeHead(200);
      res.end(JSON.stringify(data));
    } );
}

function highScore ( res )
{
    var db = new sqlite.Database( "linkdb.sqlite" );
    var resp_text = "<!DOCTYPE html>"+ "<html>" +"<head> <style> table{ border-collapse: collapse;} table, th, td {border: 1px solid black;} </style> </head>" +"<body>" + "<table>"
  +"<tr>" + "<th>Username</th>" + "<th>High Score</th>"+ "<th>Date</th>" +  "</tr>";
    var data = [];
    db.each("SELECT MAX(Score) AS HighScore FROM Users",
    function (err, row)
    {
      data.push(row);
      resp_text += "<tr><td>" + row.Username "</td> <td>"+ row.HighScore + "</td><td>" + row.Date "</td></tr>"
    });
    db.close(
    function()
    {
      resp_text += "</table></body></html>";
      res.writeHead(200);
      res.end(JSON.stringify(data));
    } );
}

function hostGame( host_clicked, res )
{
    if( multiplayer === true && host_clicked )
    {
        host === true;
        guest === false;
    }
}

function joinGame( join_clicked, res )
{
    if( multiplayer === true && join_clicked )
    {
        host === false;
        guest === true;
    }
}

function giveBackFile( name, res )
{
    var contents = "";
    try
    {
    	contents = fs.readFileSync( name ).toString();
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open "+ name );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function doServer( req, res)
{
  if (req.url == "/single_player")
    {
        singlePlayer( res );
    }
  else if (req.url == "/multi_player")
    {
        multiPlayer( res );
    }
  else if (req.url == "/add_name")
    {
        addName( res );
    }
  else if (req.url == "/add_date")
    {
        addDate( res );
    }
  else if (req.url == "/add_score")
    {
        addScore( res );
    }
  else if (req.url == "/send_back_table")
  {
        sendBackTable( res );
  }
  else if (req.url == "/high_score")
  {
        highScore( res );
  }
  else if(req.url == "/host_game")
    {
      hostGame( res );
    }
  else if(req.url == "/join_game")
    {
      joinGame( res );
    }
  else if (req.url == "/client.js")
    {
      giveBackFile("client.js", res);
    }
  else
    {
      giveBackFile("index.html", res);
    }
}

var server = http.createServer(doServer);
server.listen(8080);
