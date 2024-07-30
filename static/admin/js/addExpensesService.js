$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
          initializeItemsTable();
    }
});
function initializeItemsTable() {
   var table = $('#expenseItemTableId').DataTable();
   table.clear().draw();
   table.destroy();
   $('#expenseItemTableId').DataTable({
      'paging'      : true,
      'lengthChange': false,
      'searching'   : false,
      'ordering'    : true,
      'info'        : true,
      'autoWidth'   : false
   });
   $('#expense_date_txt').datepicker({
       format: 'dd MM yyyy',
       endDate: '0d'
   });
}

$("#saveExpenseId").click(function(){
    var flag = 0 ;
    var expenseId = $("#expense_id").val();
    var expenseDate = $("#expense_date").val();
    if (itemList.length==0) {
        swal("Warning!", "Please enter at least one item!", "warning");
        flag=1;
        return false;
    }
    if (expenseDate=="") {
        expenseDate=null;
    }
    var formData = {id:null,expenseItemDtos:itemList,expenseDate:expenseDate};
    $.ajax({
           type : "POST",
           contentType: "application/json; charset=utf-8",
           url : REST_HOST+"/api/expenses/createExpense",
           dataType : "json",
           data : JSON.stringify(formData),
           success : function(data) {
               if(data.result!=null){
                   if (formData.id==null) {
                        swal({
                               title: "Inserted!",
                               text: "Expenses added successfully!",
                               timer: 1500,
                               type: "success",
                               showConfirmButton: false
                        });
                   } else {
                        swal({
                               title: "Updated!",
                               text: "Expenses updated successfully!",
                               timer: 1500,
                               type: "success",
                               showConfirmButton: false
                        });
                   }
                   clearAllData();
                   window.open("../../admin/pages/monthlyExpenses.html","_self");
               }else{
                   swal("Error",data.errorMessage, "error");
               }
           },
           error : function(result) {
               console.log(result.status);
           }
    });
 });

 $("#cancelId").click(function(){
     clearAllData();
 });

function clearAllData(){
    $("#expense_id").val("");
    $("#expenseDate").val("");
    $("#total_amount").val("");
    clearData();
    arrayList = [];
    itemList = [];
    var table = $('#expenseItemTableId').DataTable();
    table.clear().draw();
    table.destroy();
}