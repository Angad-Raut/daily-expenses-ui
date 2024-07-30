var arrayList = [];
var itemList = [];
var counter = 0;
$("#addExpenseItemId").click(function(){
    var itemId = $("#item_id").val();
    var itemName = $("#item_name").val();
    var itemPrice = $("#item_price").val();
    var paymentMode = $("#payment_mode").val();
    var flag=0;
    if (itemName==""){
       swal("Warning!", "Please enter item!", "warning");
       flag=1;
       return false;
    }
    if(itemPrice==""){
       	swal("Warning!", "Please enter item price!", "warning");
        flag=1;
        return false;
    }
    if(paymentMode==""){
        swal("Warning!", "Please enter payment mode!", "warning");
        flag=1;
        return false;
    }
    if(isItemExist(itemName,itemPrice)){
        swal("Warning!", "This item you have already added, please try another one!", "warning");
        flag=1;
        return false;
    }
    if(flag==0){
       if (itemId==""){
            arrayList.push({"counter":counter,
                            "item_name":itemName,
                            "item_price":itemPrice,
                            "payment_mode":paymentMode
                          });
            clearData();
            populateTable(arrayList,true);
            swal({
                title: "Inserted!",
                text: "Record Inserted Successfully!",
                timer: 1500,
                type: "success",
                showConfirmButton: false
            });
            //$("#expense-modal").modal("hide");
       } else {
            updateRow(itemId);
       }
    }
});

$("#closeId").click(function(){
   clearData();
});

function clearData(){
   $("#item_id").val("");
   $("#item_name").val("");
   $("#item_price").val("");
   $("#payment_mode").val("");
}

function populateTable(arrayList,isAddFlag){
    var table = $('#expenseItemTableId').DataTable();
    table.clear().draw();
    table.destroy();
    var count=1;
    var totalAmount=0;
    itemList = [];
    for(var i in arrayList){
       itemList.push({"itemName":arrayList[i].item_name,
                      "itemPrice":arrayList[i].item_price,
                      "paymentType":arrayList[i].payment_mode
       });
       totalAmount=totalAmount+parseFloat(arrayList[i].item_price);
       $("#total_amount").val(totalAmount);
       table.row.add( [
                  count,
                  arrayList[i].item_name,
                  arrayList[i].item_price,
                  arrayList[i].payment_mode,
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
      document.getElementById("expenseItemTableId").deleteRow(i);
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
        var expenseId = $("#expense_id").val();
        var table = $('#expenseItemTableId').DataTable();
        var data = table.row($(this).parents('tr')).data();
        var index = data[0];
        var item_name = data[1];
        var item_price = data[2];
        var payment_mode = data[3];
        $("#item_id").val(index-1);
        $("#item_name").val(item_name);
        $("#item_price").val(item_price);
        $("#payment_mode").val(payment_mode);
        //$("#expense-modal").modal("show");
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
            var table = $('#expenseItemTableId').DataTable();
            var count=1;
            var item_Name = $("#item_name").val();
            var item_Price = $("#item_price").val();
            var payment_Mode = $("#payment_mode").val();
            objIndex = arrayList.findIndex((obj => obj.counter == id));
            arrayList[objIndex].item_name = item_Name;
            arrayList[objIndex].item_price = item_Price;
            arrayList[objIndex].payment_mode = payment_Mode;
            populateTable(arrayList,false);
            swal({
                title: "Updated!",
                text: "Record is updated successfully!",
                timer: 1500,
                type: "success",
                showConfirmButton: false
             });
            clearData();
            //$("#expense-modal").modal("hide");
        } else {
            swal("Cancelled", "Record is not updated it's safe", "error");
        }
      });
 }

function isItemExist(itemName,itemPrice) {
     for(var i in arrayList){
        if(arrayList[i].item_name==itemName && arrayList[i].item_price==itemPrice){
            return true;
        } else {
            return false;
        }
     }
}
