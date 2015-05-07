function fillTable()
{
  var value_req = new XMLHttpRequest();
  value_req.onload = valueReturned;
  value_req.open( "get", "get_value" );
  value_req.send();
}

function addLink()
{
  var add_link = new XMLHttpRequest();
  add_link.open("get", "add_link");
  add_link.send();
}
function valueReturned()
{
  console.log(this.responseText)
  var table_elem =
        document.getElementById( "main_list" );
    var data =  JSON.parse(this.responseText) ;
    for (var i=0; i<data.length; i++)
    {
        var row = data[i];
        var newrow = document.createElement("tr");
        var cell = document.createElement("td");
        var cell2 = document.createElement("td");
        cell.innerHTML = row.LinkAddress;
        cell2.innerHTML= row.Nickname;
        newrow.appendChild(cell);
        newrow.appendChild(cell2);
        table_elem.appendChild(newrow);

    }
}
