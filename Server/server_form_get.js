var http = require( "http" );
var fs = require( "fs" );


function serverFn( req, res )
{
    for( field in req )
    {
        console.log( "R."+field+" = ..."/*+req[ field ]*/ );
    }
    for( field in req.headers )
    {
        console.log( "R.header."+field+" = ..."/*+req[ field ]*/ );
    }
    console.log( "url: "+req.url.toString() );

    if( req.url.substring( 0, 16 ) == "/submit_the_form" )
    {
        var x = req.url.split("?");
        var form_values = x[1].split("&");

        fs.appendFile('input.txt', form_values, function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');  } )

    }



    res.writeHead( 200 );
    var h = "<!DOCTYPE html>"+
        "<html>"+
        "<body>"+
        "<form action='submit_the_form' method='get'>"+
        "<input name='Username' type='text' value='username here'>"+
        "<input name='Password' type='password' value=' password here '>"+
        "<input name='Telephone' type='tel' value=' telephone here '>"+
        "<input name='Url' type='url' value=' url here '>"+
        "<input type='submit'>"+
        "</form>"+
        "</body>"+
        "</html>";
    res.end( h );

}

var server = http.createServer( serverFn );

server.listen( 8080 );
