var techStackList=[];
var arrayList=[];
var counter=0;
function clearItemData() {
    $("#item_id").val("");
    $("#tech_name").val("");
}

$("#tech_btn").click(function(){
     var item_id = $("#item_id").val();
     var tech_name = $("#tech_name").val();
     var flag = 0;
     if (tech_name=="" || tech_name==null) {
        swal("Warning!", "Please enter tech name!", "warning");
        flag=1;
        return false;
     }
     if (flag==0) {
          if (item_id=="" || item_id==null) {
                arrayList.push({"counter":counter,
                    "techName":tech_name
                });
                clearItemData();
                populateTable(arrayList,true);
                swal({
                    title: "Inserted!",
                    text: "Record Inserted Successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                });
          } else {
             updateRow(item_id);
          }
     }
});

function populateTable(arrayList,isAddFlag){
    var table = $('#projectDetailsTableId').DataTable();
    table.clear().draw();
    table.destroy();
    var count=1;
    techStackList = [];
    for(var i in arrayList){
        techStackList.push(arrayList[i].techName);
        table.row.add( [
                  count,
                  arrayList[i].techName,
                  '<a class="btn btn-success btn-xs btn-edit" type="button"><b>Edit</b></a>&nbsp;&nbsp;<a class="btn btn-danger btn-xs" onclick="deleteRow(this)" type="button"><b>Delete</b></a>'
        ] ).draw(false);
        if(isAddFlag){
          counter++;
        }
        count++;
    }
}

/******** Delete Record **********/
function deleteRow(r) {
  swal({
    title: "Are you sure?",
    text: "Once you confirm Record will be deleted",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel please!",
    closeOnConfirm: false,
    closeOnCancel: false
  },
  function(isConfirm){
    if (isConfirm) {
      var i = r.parentNode.parentNode.rowIndex;
      document.getElementById("projectDetailsTableId").deleteRow(i);
      var index = i-1;
      if (index > -1) {
        arrayList.splice(index, 1);
      }
      populateTable(arrayList,false);
      swal({
        title: "Deleted!",
        text: "Record is deleted successfully!",
        timer: 1500,
        type: "success",
        showConfirmButton: false
     });
    } else {
      swal("Cancelled", "Record is not updated it's safe", "error");
    }
  });
}

/******** Edit Record **********/
 $("body").on("click", ".btn-edit", function(){
        var table = $('#projectDetailsTableId').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var index = data[0];
        var tech_name = data[1];
        $("#item_id").val(index-1);
        $("#tech_name").val(tech_name);
 });

/******** Update Record **********/
 function updateRow(id) {
      swal({
        title: "Are you sure?",
        text: "Once you confirm Record will be updated",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
      function(isConfirm){
        if (isConfirm) {
            var table = $('#projectDetailsTableId').DataTable();
            var count=1;
            var tech_name = $("#tech_name").val();
            objIndex = arrayList.findIndex((obj => obj.counter == id));
            arrayList[objIndex].techName = tech_name;
            populateTable(arrayList,false);
            swal({
                title: "Updated!",
                text: "Record is updated successfully!",
                timer: 1500,
                type: "success",
                showConfirmButton: false
            });
            clearItemData();
        } else {
            swal("Cancelled", "Record is not updated it's safe", "error");
        }
      });
 }