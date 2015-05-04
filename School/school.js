var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );


function listClasses(req, res)
{
  var db = new sqlite.Database("school.sqlite");
  var resp_text = "<!DOCTYPE html>"+ "<html>" +"<head> <style> table{ border-collapse: collapse;} table, th, td {border: 1px solid black;} </style> </head>" +"<body>" + "<table>"
  +"<tr>" + "<th>Class Name</th>" + "<th>Department</th>"+ "<th>Class ID</th>" +  "</tr>";

  db.each("SELECT NAME, DEPARTMENT, ID FROM CLASSES", function (err, row) {
    console.log(row);
    console.log(err);
  resp_text += "<tr>" + "<td>" + row.Name + "</td>" +
   "<td>" + row.Department + "</td>" +
   "<td>" + row.Id + "</td>" + "</tr>" ;

} );

db.close(
function() {
console.log("Complete!" + resp_text);

resp_text += "</table>" + "</body>" + "</html>";
res.writeHead(200);
res.end( resp_text );
}
)

}



function listTeachers(req, res)
{
  var db = new sqlite.Database("school.sqlite");
  var resp_text = "<!DOCTYPE html>"+ "<html>" + "<head> <style> table{ border-collapse: collapse;} table, th, td {border: 1px solid black;} </style> </head>" + "<body>" + "<table>"
  +"<tr>" + "<th>Teacher's Name</th>" + "<th>Office</th>"+ "<th>Teacher's ID</th>" +  "</tr>";

  db.each("SELECT NAME, OFFICE, ID FROM TEACHERS", function (err, row) {
    console.log(row);
    console.log(err);
  resp_text += "<tr>" + "<td>" + row.Name + "</td>" +
   "<td>" + row.Office + "</td>" +
   "<td>" + row.Id + "</td>" + "</tr>" ;
} );
    db.close(
    function() {
    console.log("Complete!" + resp_text);
    resp_text += "</table>" + "</body>" + "</html>";
    res.writeHead(200);
    res.end( resp_text );
  }
)

}

function listStudents(req, res)
{
  var db = new sqlite.Database("school.sqlite");
  var resp_text = "<!DOCTYPE html>"+ "<html>" + "<head> <style> table{ border-collapse: collapse;} table, th, td {border: 1px solid black;} </style> </head>" + "<body>" + "<table>"
  +"<tr>" + "<th>Student's Name</th>" + "<th>Year</th>"+ "<th>Student's ID</th>" +  "</tr>";

  db.each("SELECT NAME, YEAR, ID FROM STUDENTS", function (err, row) {
    console.log(row);
    console.log(err);
  resp_text += "<tr>" + "<td>" + row.Name + "</td>" +
   "<td>" + row.Year + "</td>" +
   "<td>" + row.Id + "</td>" + "</tr>" ;
} );
    db.close(
    function() {
    console.log("Complete!" + resp_text);
    resp_text += "</table>" + "</body>" + "</html>";
    res.writeHead(200);
    res.end( resp_text );
  }
)

}

function listEnrollments(req, res)
{
  var db = new sqlite.Database("school.sqlite");
  var resp_text = "<!DOCTYPE html>"+ "<html>" + "<head> <style> table{ border-collapse: collapse;} table, th, td {border: 1px solid black;} </style> </head>" + "<body>" + "<table>"
  +"<tr>" + "<th>Class Name</th>" + "<th>Student Name</th>"+  "</tr>";

  db.each("SELECT  CLASSES.NAME AS CNAME, * FROM ENROLLMENTS " +
   "JOIN CLASSES ON CLASSES.ID = ENROLLMENTS.CLASSID " +
   "JOIN STUDENTS ON STUDENTS.ID = ENROLLMENTS.STUDENTID", function (err, row) {
    console.log(row);
    console.log(err);
  resp_text += "<tr>" + "<td>" + row.CNAME + "</td>" +
   "<td>" + row.Name + "</td>" + "</tr>" ;
} );
    db.close(
    function() {
    console.log("Complete!" + resp_text);
    resp_text += "</table>" + "</body>" + "</html>";
    res.writeHead(200);
    res.end( resp_text );
  }
)

}



function listTeachingAssignments(req, res)
{
  var db = new sqlite.Database("school.sqlite");
  var resp_text = "<!DOCTYPE html>"+ "<html>" + "<head> <style> table{ border-collapse: collapse;} table, th, td {border: 1px solid black;} </style> </head>" + "<body>" + "<table>"
  +"<tr>" + "<th>Class Name</th>" + "<th>Teacher's Name</th>"+  "</tr>";

  db.each("SELECT  CLASSES.NAME AS CNAME, * FROM TEACHINGASSIGNMENTS " +
   "JOIN CLASSES ON CLASSES.ID = TEACHINGASSIGNMENTS.CLASSID " +
   "JOIN TEACHERS ON TEACHERS.ID = TEACHINGASSIGNMENTS.TEACHERID", function (err, row) {
    console.log(row);
    console.log(err);
  resp_text += "<tr>" + "<td>" + row.CNAME + "</td>" +
   "<td>" + row.Name + "</td>" + "</tr>" ;
} );
    db.close(
    function() {
    console.log("Complete!" + resp_text);
    resp_text += "</table>" + "</body>" + "</html>";
    res.writeHead(200);
    res.end( resp_text );
  }
)

}

function formInputParser( url )
{
    inputs = {}
    var form_text = url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    for( var i = 0; i < form_inputs.length; i++ ) {
        var inp = form_inputs[i].split( "=" );
        inputs[ inp[0] ] = inp[1];
    }
    console.log( inputs );
    return inputs;
}


function addStudent( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    console.log( req.url );
    formInputParser( req.url );
    var form_text = req.url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    var name_input = form_inputs[0].split( "=" );
    var year_input = form_inputs[0].split( "=" );
    var id_input = form_inputs[0].split( "=" );
    var name = null, year = null, id = null;
    for( var i = 0; i < form_inputs.length; i++ ) {
        var inp = form_inputs[i].split( "=" );
        if( inp[0] == 'name' ) {
            name = inp[1];
        }
        else if( inp[0] == 'year' ) {
            year = inp[1];
        }
        else if( inp[0] == 'id' ) {
            id = inp[1];
        }
    }
    if( name == null || year == null || id == null )
    {
        res.writeHead( 200 );
        res.end( "ERROR" );
        return;
    }
    /* perf, stage numbers that exist in DB */
    var name_exists = false;
    db.all( "SELECT COUNT(NAME) FROM STUDENTS WHERE ID = "+name,
        function( err, rows ) {
            name_exists = rows[0]['COUNT(NAME)'] == 1;
        });
    if( !name_exists )
    {
      name = decodeURIComponent( ( name_input[1] + '' ).replace( /\+/g, '%20' ) );
      year = decodeURIComponent( ( year_input[1] + '' ).replace( /\+/g, '%20' ) );
      id = decodeURIComponent( ( id_input[1] + '' ).replace( /\+/g, '%20' ) );
      var sql_cmd = "INSERT INTO STUDENTS ('NAME', 'YEAR', 'ID') VALUES ('"+
         name[1]+"', '"+
         year[1]+"', '"+
         id[1]+"')";
       db.run( sql_cmd );
    }

    db.close();
    res.writeHead( 200 );
    res.end( "<html><body>Added!!!</body></html>" );
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
    if( filename.substring(0, 12) == "list_classes?" )
    {
        listClasses( req, res );
    }
    else if( filename.substring(0, 14) == "list_teachers?" )
    {
        listTeachers( req, res );
    }
    else if( filename.substring(0, 14) == "list_students?" )
    {
        listStudents( req, res );
    }
    else if( filename.substring(0, 17) == "list_enrollments?" )
    {
        listEnrollments( req, res );
    }
    else if( filename.substring(0, 26) == "list_teaching_assignments?" )
    {
        listTeachingAssignments( req, res );
    }
    else if( filename.substring(0, 11) == "add_student?" )
    {
        addStudent( req, res );
    }
    else
    {
        serveFile( filename, req, res );
    }
}

var server = http.createServer( serverFn );

server.listen( 8080 );
