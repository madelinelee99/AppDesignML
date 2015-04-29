
var http = require('http');
var fs   = require('fs');

if( process.argv.length < 3 )
{
    console.log( "Error: Two file paths required" );
    process.exit( 1 );
}
var fn1 = process.argv[ 2 ];

try
{
    var lines = fs.readFileSync( fn1 ).toString().split( "\n" );
}
catch( e )
{
    console.log(
        "Error: Something bad happened trying to open "+ fn1 );
    process.exit( 1 );
}


var download = function( url, dest, cb ) {
    console.log( "Download!" );
    var file = fs.createWriteStream( dest );
    // No synchronous style!!!
    // var data = http.getSync( url );

    var request = http.get( url, function( response ) {
        console.log( "get callback!" );
        response.pipe( file );
        file.on( 'finish', function() {
            console.log( "finish callback!" );
            // close() is async, call cb after close completes.
            file.close( cb );
        });
    });
    console.log( "called http.get" );
    request.on( 'error', function( err ) { // Handle errors
        console.log( "error callback!" );
        // Delete the file async. (But we don't check the result)
        fs.unlink(dest);
        if( cb )
            cb( err.message );
    });
    console.log( "called request.on" );
};

 for( var i = 0; i < lines.length -1; i +=2 )
 {
   var regexp1 = /(http\:\/\/)/;
   var regexp2 = /\//;

   var myUrl = lines[i];
   var myDestination = lines[i+1];
 console.log(myDestination);
   var match1 = myUrl.match(regexp1);
   var match2 = myDestination.match(regexp2);

   if ( match1 && !match2 )
   {
     download( myUrl, myDestination, function()
     {
       console.log( "main cb" )

   });
   }


 }

//console.log( "Done?" );
