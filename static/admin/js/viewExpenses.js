$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
        getAllExpensesPages();
    }
});

function getAllExpensesPages(){
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
                "sAjaxSource" : REST_HOST+"/api/expenses/getAllExpensesPages",
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
                          return '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#viewItemModal" onclick="getExpenseItems('+data.expenseId+')"><b>View</b></button>';
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

  function getExpenseItems(expenseId) {
       var formData = {entityId:expenseId};
       var table = $('#viewExpenseItemsTableId').DataTable();
       table.clear().draw();
       table.destroy();
       viewExpenseItemsTable();
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

  function initializationTable() {
     $('#expenseDetailsTableId').DataTable({
           'paging'      : true,
           'lengthChange': true,
           'searching'   : false,
           'ordering'    : true,
           'info'        : true,
           'autoWidth'   : true
     });
  }
  function viewExpenseItemsTable() {
     $('#viewExpenseItemsTableId').DataTable({
           'paging'      : false,
           'lengthChange': false,
           'searching'   : false,
           'ordering'    : false,
           'info'        : false,
           'autoWidth'   : false
     });
  }
