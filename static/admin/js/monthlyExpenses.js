$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        getAllExpensePagesWithDateRange();
    }
});

 function getExpenseItems(expenseId) {
       var formData = {entityId:expenseId};
       var table = $('#viewExpenseItemsTableId').DataTable();
       table.clear().draw();
       table.destroy();
       $.ajax({
               type : "POST",
               contentType: "application/json; charset=utf-8",
               url : REST_HOST+"/api/expenses/getExpenseItemsByExpenseId",
               dataType : "json",
               data : JSON.stringify(formData),
               success : function(data) {
                 if(data.result!=null){
                     var dataList=data.result;
                     for(var i in dataList){
                         table.row.add( [
                                dataList[i].srNo,
                                dataList[i].itemName,
                                dataList[i].itemPrice,
                                dataList[i].paymentWith
                         ] ).draw(false);
                     }
                 }else{
                    swal("Error",data.errorMessage, "error");
                 }
               },
               error : function(result) {
                 console.log(result.status);
               }
       });
  }

  function addOnItems(expenseId) {
       $("#expense_id").val(expenseId);
       var table = $('#expenseItemTableId').DataTable();
       table.clear().draw();
       table.destroy();
  }

  $("#addOnItemId").click(function(){
      var flag=0;
      var expenseId = $("#expense_id").val();
      if (itemList.length==0){
          swal("Warning!", "Please enter at least one item!", "warning");
          flag=1;
          return false;
      }
      var formData = {id:expenseId,expenseItemDtos:itemList};
      $.ajax({
             type : "POST",
             contentType: "application/json; charset=utf-8",
             url : REST_HOST+"/api/expenses/updateExpense",
             dataType : "json",
             data : JSON.stringify(formData),
             success : function(data) {
                  if(data.result!=null){
                      if (formData.id!=null) {
                          swal({
                              title: "AddOn!",
                              text: "Expenses added successfully!",
                              timer: 1500,
                              type: "success",
                              showConfirmButton: false
                          });
                      }
                      clearAllData();
                      $("#expense-modal").modal("hide");
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

  $("#cancelId").click(function() {
     clearAllData();
  });

  function clearAllData(){
      $("#expense_id").val("");
      $("#total_amount").val("");
      clearData();
      arrayList = [];
      itemList = [];
      var table = $('#expenseItemTableId').DataTable();
      table.clear().draw();
      table.destroy();
  }

  function getAllExpensePagesWithDateRange(){
        $(function() {
            var datatable2Rest = function(sSource, aoData, fnCallback) {
                //extract name/value pairs into a simpler map for use later
                var paramMap = {};
                for ( var i = 0; i < aoData.length; i++) {
                    paramMap[aoData[i].name] = aoData[i].value;
                }
                //page calculations
                var pageSize = paramMap.iDisplayLength;
                var start = paramMap.iDisplayStart;
                var pageNum = (start == 0) ? 1 : (start / pageSize) + 1; // pageNum is 1 based

                // extract sort information
                var sortCol = paramMap.iSortCol_0;
                var sortDir = paramMap.sSortDir_0;
                var sortName = paramMap['mDataProp_' + sortCol];
                var formData={
                             pageSize:pageSize,
                             pageNumber:pageNum,
                             sortParam:sortName,
                             sortDir:sortDir,
                };
                var url = sSource;
                $.ajax({
                    type : "POST",
                    contentType: "application/json; charset=utf-8",
                    url : url,
                    dataType : "json",
                    data : JSON.stringify(formData),
                    success : function(data) {
                        data.iTotalRecords = data.result.totalElements;
                        data.iTotalDisplayRecords = data.result.totalElements;
                        fnCallback(data);
                    },
                    error : function(result) {
                        console.log(result.status);
                    }
                });
            };
            $('#expenseDetailsTableId').dataTable({
                "sAjaxSource" : REST_HOST+"/api/expenses/getAllExpensesPagesWithDateRange",
                "sAjaxDataProp" : 'result.content',
                "aoColumns" : [ {
                    mDataProp : 'srNo',
                    "bSortable": false
                }, {
                    mDataProp : 'totalAmount',
                    "bSortable": false
                },{
                    mDataProp : 'expenseDate',
                    "bSortable": false
                }, {
                    mDataProp : function(data){
                          return '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#viewItemModal" onclick="getExpenseItems('+data.expenseId+')"><b>View</b></button>&nbsp;&nbsp;'+
                                 '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#expense-modal" onclick="addOnItems('+data.expenseId+')"><b>AddOn</b></button>';
                    },
                    "bSortable": false
                }],
                "bServerSide" : true,
                "destroy": true,
                "aaSorting": [[ 0, "desc" ]],
                "fnServerData" : datatable2Rest
            });

        });
  }