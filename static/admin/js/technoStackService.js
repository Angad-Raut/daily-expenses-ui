var arrayList=[];
var skillList=[];
var counter=0;
function clearItemData() {
    $("#item_id").val("");
    $("#skill_name").val("");
    $("#experience").val("");
}

$("#add_skill_btn").click(function(){
     var item_id = $("#item_id").val();
     var skill_name = $("#skill_name").val();
     var experience = $("#experience").val();
     var flag = 0;
     if (skill_name=="" || skill_name==null) {
        swal("Warning!", "Please enter skill name!", "warning");
        flag=1;
        return false;
     }
     if (experience=="" || experience==null) {
        swal("Warning!", "Please enter skill experience!", "warning");
        flag=1;
        return false;
     }
     if (flag==0) {
          if (item_id=="" || item_id==null) {
                arrayList.push({"counter":counter,
                    "skillName":skill_name,
                    "experience":experience
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
    var table = $('#stackItemsTableId').DataTable();
    table.clear().draw();
    table.destroy();
    var count=1;
    skillList = [];
    for(var i in arrayList){
        skillList.push({"skillName":arrayList[i].skillName,
                      "experience":arrayList[i].experience
        });
       table.row.add( [
                  count,
                  arrayList[i].skillName,
                  arrayList[i].experience,
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
      document.getElementById("stackItemsTableId").deleteRow(i);
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
        var table = $('#stackItemsTableId').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var index = data[0];
        var skill_name = data[1];
        var experience = data[2];
        $("#item_id").val(index-1);
        $("#skill_name").val(skill_name);
        $("#experience").val(experience);
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
            var table = $('#stackItemsTableId').DataTable();
            var count=1;
            var skill_Name = $("#skill_name").val();
            var experience = $("#experience").val();
            objIndex = arrayList.findIndex((obj => obj.counter == id));
            arrayList[objIndex].skillName = skill_Name;
            arrayList[objIndex].experience = experience;
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