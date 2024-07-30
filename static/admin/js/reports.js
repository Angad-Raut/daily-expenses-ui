var expenseItemsList=[];
$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
          setAllConfiguration();
          $("#download_txt").hide();
          $("#table_div").hide();
    }
});

function setAllConfiguration() {
    $('#from_date_txt').datepicker({
        format: 'dd MM yyyy',
        endDate: '0d',
        minDate: new Date()
    });
    $('#to_date_txt').datepicker({
         format: 'dd MM yyyy',
         startDate: '0d',
         maxDate: new Date()
    });
    var table = $('#reportTableId').DataTable();
       table.clear().draw();
       table.destroy();
       $('#reportTableId').DataTable({
             'paging'      : true,
             'lengthChange': true,
             'searching'   : false,
             'ordering'    : true,
             'info'        : true,
             'autoWidth'   : true
       });
}

$("#search_txt").click(function(){
    var startDate=$('#start_date').val();
    var endDate=$('#end_date').val();
    var flag = 0;
    if (startDate=="") {
        swal("Warning!", "Please select from date!", "warning");
        flag=1;
        return false;
    }
    if (startDate=="") {
        swal("Warning!", "Please select to date!", "warning");
        flag=1;
        return false;
    }
    if (startDate>endDate) {
        swal("Warning!", "From Date should not be greater than To Date!", "warning");
        flag=1;
        return false;
    }
    if (endDate<startDate) {
        swal("Warning!", "To Date should not be less than From Date!", "warning");
        flag=1;
        return false;
    }
    getAllExpensesPagesWithDateRangeForReport(startDate,endDate);
});

$("#download_txt").click(function(){
    var startDate=$('#start_date').val();
    var endDate=$('#end_date').val();
    var flag = 0;
    if (startDate=="") {
        swal("Warning!", "Please select from date!", "warning");
        flag=1;
        return false;
    }
    if (startDate=="") {
        swal("Warning!", "Please select to date!", "warning");
        flag=1;
        return false;
    }
    if (startDate>endDate) {
        swal("Warning!", "From Date should not be greater than To Date!", "warning");
        flag=1;
        return false;
    }
    if (endDate<startDate) {
        swal("Warning!", "To Date should not be less than From Date!", "warning");
        flag=1;
        return false;
    }
    var formData = {startDate:startDate,endDate:endDate};
    generateReportWithDateRange(formData);
});

function getAllExpensesPagesWithDateRangeForReport(startDate,endDate){
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
                             startDate:startDate,
                             endDate:endDate,
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
                        $("#download_txt").show();
                        $("#table_div").show();
                        data.iTotalRecords = data.result.totalElements;
                        data.iTotalDisplayRecords = data.result.totalElements;
                        fnCallback(data);
                    },
                    error : function(result) {
                        console.log(result.status);
                    }
                });
            };
            $('#reportTableId').dataTable({
                "sAjaxSource" : REST_HOST+"/api/expenses/getAllExpensesPagesWithDateRangeForReport",
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
                                 '<button class="btn bg-primary btn-xs" type="button" onclick="generateReportByExpenseId('+data.expenseId+','+data.expenseDate+')"><b>Download</b></button>';
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

function generateReportWithDateRange(formData) {
       $.ajax({
       		type : "POST",
       		contentType: "application/json; charset=utf-8",
       		url : REST_HOST+"/api/reports/downloadReport",
       		dataType : "json",
       		data : JSON.stringify(formData),
       		success : function(data) {
       			if(data.result!=null){
       			    if (data.result!=null) {
                        var link = document.createElement('a');
                        link.href = "data:application/pdf;base64,"+data.result;
                        link.download = 'ExpenseReport('+formData.startDate+'-'+formData.endDate+').pdf';
                        link.dispatchEvent(new MouseEvent('click'));
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

 function generateReportByExpenseId(expenseId,expenseDate) {
        var formData = {entityId:expenseId};
        $.ajax({
        		type : "POST",
        		contentType: "application/json; charset=utf-8",
        		url : REST_HOST+"/api/reports/downloadReportByExpenseId",
        		dataType : "json",
        		data : JSON.stringify(formData),
        		success : function(data) {
        			if(data.result!=null){
        			    if (data.result!=null) {
                         var link = document.createElement('a');
                         link.href = "data:application/pdf;base64,"+data.result;
                         link.download = 'ExpenseReport('+expenseDate+').pdf';
                         link.dispatchEvent(new MouseEvent('click'));
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