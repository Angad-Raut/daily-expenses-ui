$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
        getAllIncomesPages();
        getIncomesTypesDropDown();
    }
});

$("#edit_btn").click(function() {
    enableAllFields();
});

$("#clear_btn").click(function(){
  clearData();
});

$("#update_btn").click(function(){
    var incomeId = $("#income_id").val();
    var incomeDate = $("#income_date").val();
    var incomeType = $("#income_type").val();
    var incomeAmount = $("#income_amount").val();
    var taxAmount = $("#tax_amount").val();
    var pfAmount = $("#pf_amount").val();
    var ptAmount = $("#pt_amount").val();
    var flag = 0;
    if (incomeType=="" || incomeType==null) {
       swal("Warning!", "Please select income type!!", "warning");
       flag=1;
       return false;
    }
    if (incomeType=="" && incomeType==null) {
       swal("Warning!", "Please enter income amount!!", "warning");
       flag=1;
       return false;
    }
    if (incomeType=="SALARY") {
        if (taxAmount=="" && taxAmount==null) {
            swal("Warning!", "Please enter tax amount!!", "warning");
            flag=1;
            return false;
        }
        if (pfAmount=="" && pfAmount==null) {
            swal("Warning!", "Please enter pf amount!!", "warning");
            flag=1;
            return false;
        }
        if (ptAmount=="" && ptAmount==null) {
            swal("Warning!", "Please enter pt amount!!", "warning");
            flag=1;
            return false;
        }
    }
    if (flag==0) {
        var formData = {
            id:incomeId,
            incomeType:incomeType,
            incomeAmount:incomeAmount,
            grossSalary:incomeAmount,
            tdsAmount:taxAmount,
            pfAmount:pfAmount,
            ptAmount:ptAmount
        };
        addUpdateIncomeDetails(formData);
    }
});

function addUpdateIncomeDetails(formData) {
    $.ajax({
          type : "POST",
          contentType: "application/json; charset=utf-8",
          url : REST_HOST+"/api/incomes/addUpdateIncome",
          dataType : "json",
          data : JSON.stringify(formData),
      	  success : function(data) {
      		  if(data.result==true){
                  swal({
                       title: "Updated!",
                       text: "Income details updated successfully!",
                       timer: 1500,
                       type: "success",
                       showConfirmButton: false
                  });
                  clearData();
                  getAllIncomesPages();
      		  }else{
      			  swal("Error",data.errorMessage, "error");
      		  }
      	  },
      	  error : function(result) {
      		 console.log(result.status);
      	  }
    });
}

function getAllIncomesPages(){
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
            $('#incomeDetailsTableId').dataTable({
                "sAjaxSource" : REST_HOST+"/api/incomes/getAllIncomesPages",
                "sAjaxDataProp" : 'result.content',
                "aoColumns" : [ {
                    mDataProp : 'srNo',
                    "bSortable": false
                }, {
                    mDataProp : 'incomeType',
                    "bSortable": false
                },{
                    mDataProp : 'incomeDate',
                    "bSortable": false
                }, {
                    mDataProp : 'incomeAmount',
                    "bSortable": false
                }, {
                    mDataProp : function(data){
                          return '<button class="btn bg-success btn-xs" type="button" data-toggle="modal" data-target="#editIncomeModal" onclick="getIncomeItems('+data.incomeId+')"><b>View</b></button>&nbsp;&nbsp;'+
                                 '<button class="btn bg-danger btn-xs" type="button" onclick="deleteIncome('+data.incomeId+')"><b>Delete</b></button>';
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

  function getIncomeItems(incomeId) {
       var formData = {entityId:incomeId};
       $.ajax({
               type : "POST",
               contentType: "application/json; charset=utf-8",
               url : REST_HOST+"/api/incomes/getById",
               dataType : "json",
               data : JSON.stringify(formData),
               success : function(data) {
                 if(data.result!=null){
                    $("#income_id").val(data.result.id);
                    $("#income_date").val(data.result.incomeDate);
                    $("#income_type").val(data.result.incomeType);
                    $("#income_amount").val(data.result.incomeAmount);
                    if (data.result.incomeType=="SALARY"){
                        $("#tax_amount").val(data.result.tdsAmount);
                        $("#pf_amount").val(data.result.pfAmount);
                        $("#pt_amount").val(data.result.ptAmount);
                        var deductedAmount = (parseFloat(data.result.tdsAmount)+parseFloat(data.result.pfAmount)+parseFloat(data.result.ptAmount));
                        var incomeAmount = parseFloat(data.result.incomeAmount);
                        var netTotal = parseFloat(incomeAmount-deductedAmount);
                        $("#net_salary").val(netTotal);
                        disabledAllFields();
                        $(".hideshow").show();
                        $("#editIncomeModal").modal("show");
                    } else {
                        $(".hideshow").hide();
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

  function deleteIncome(incomeId) {
    var formData = {entityId:incomeId};
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
            $.ajax({
                type : "POST",
                contentType: "application/json; charset=utf-8",
                url : REST_HOST+"/api/incomes/deleteIncomeById",
                dataType : "json",
                data : JSON.stringify(formData),
                success : function(data) {
                    if(data.result==true){
                        swal({
                            title: "Deleted!",
                            text: "Record Deleted Successfully!",
                            timer: 1500,
                            type: "success",
                            showConfirmButton: false
                        });
                    }else{
                        swal("Error",data.errorMessage, "error");
                    }
                },
                error : function(result) {
                  console.log(result.status);
                }
            });
        } else {
            swal("Cancelled", "Record is not deleted it's safe", "error");
        }
      });
  }

  function getIncomesTypesDropDown(){
    $.ajax({
        type : "GET",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/incomes/getIncomeTypesDropDown",
        dataType : "json",
        success : function(data) {
            var output='';
            var dataList = data.result;
            for(var i in dataList){
                output+='<option value="'+dataList[i].entityName+'">'+dataList[i].entityValue+'</option>';
            }
            $('#income_type').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}

  function disabledAllFields() {
      $("#income_date").attr('disabled', 'disabled');
      $("#income_type").attr('disabled', 'disabled');
      $("#income_amount").attr('disabled', 'disabled');
      $("#tax_amount").attr('disabled', 'disabled');
      $("#pf_amount").attr('disabled', 'disabled');
      $("#pt_amount").attr('disabled', 'disabled');
      $("#update_btn").hide();
      $("#clear_btn").hide();
  }

  function enableAllFields() {
    $("#income_date").removeAttr('disabled');
    $("#income_type").removeAttr('disabled');
    $("#income_amount").removeAttr('disabled');
    $("#tax_amount").removeAttr('disabled');
    $("#pf_amount").removeAttr('disabled');
    $("#pt_amount").removeAttr('disabled');
    $("#update_btn").show();
    $("#clear_btn").show();
  }

  function clearData() {
    $("#income_id").val("");
    $("#income_date").val("");
    $("#income_type").val("");
    $("#income_amount").val("");
    $("#tax_amount").val("");
    $("#pf_amount").val("");
    $("#pt_amount").val("");
    $("#net_salary").val("");
}
