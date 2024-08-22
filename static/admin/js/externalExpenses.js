$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
        setDateConfiguration();
        getAllExternalExpensesPages();
    }
});

function setDateConfiguration() {
    $('#given_date_txt').datepicker({
        format: 'dd MM yyyy'
    });
}

$("#clear_btn").click(function(){
    clearData();
    $("#externalExpenseModal").modal("hide");
});

$("#save_btn").click(function(){
    var recordId = $("#record_id").val();
    var amount = $("#amount_txt").val();
    var personname = $("#person_txt").val();
    var remark = $("#remark_txt").val();
    var givendate = $("#given_date").val();
    var flag = 0;
    if (amount=="" && amount==null) {
       swal("Warning!", "Please enter amount!!", "warning");
       flag=1;
       return false;
    }
    if (remark=="" && remark==null) {
       swal("Warning!", "Please enter remark!!", "warning");
       flag=1;
       return false;
    }
    if (recordId=="" || recordId==null) {
        recordId=null;
    }
    if (flag==0) {
        var formData = {
            id:recordId,
            personName:personname,
            description:remark,
            amount:amount,
            amountGivenDate:givendate
        };
        addUpdateExternalExpenseDetails(formData);
    }
});

function addUpdateExternalExpenseDetails(formData) {
    $.ajax({
          type : "POST",
          contentType: "application/json; charset=utf-8",
          url : REST_HOST+"/api/externalExpenses/addUpdate",
          dataType : "json",
          data : JSON.stringify(formData),
      	  success : function(data) {
      		  if(data.result==true){
                  if (formData.id==null){
                        swal({
                            title: "Inserted!",
                            text: "External expenses details inserted successfully!",
                            timer: 1500,
                            type: "success",
                            showConfirmButton: false
                        });
                  } else {
                        swal({
                            title: "Updated!",
                            text: "External expenses details updated successfully!",
                            timer: 1500,
                            type: "success",
                            showConfirmButton: false
                        });
                  }
                  clearData();
                  $("#externalExpenseModal").modal("hide");
                  getAllExternalExpensesPages();
      		  }else{
      			  swal("Error",data.errorMessage, "error");
      		  }
      	  },
      	  error : function(result) {
      		 console.log(result.status);
      	  }
    });
}

function getAllExternalExpensesPages(){
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
            $('#externalExpensesTableId').dataTable({
                "sAjaxSource" : REST_HOST+"/api/externalExpenses/getAllExternalExpensesPages",
                "sAjaxDataProp" : 'result.content',
                "aoColumns" : [ {
                    mDataProp : 'srNo',
                    "bSortable": false
                }, {
                    mDataProp : 'personName',
                    "bSortable": false
                },{
                    mDataProp : 'description',
                    "bSortable": false
                }, {
                    mDataProp : 'amount',
                    "bSortable": false
                }, {
                    mDataProp : 'amountGivenDate',
                    "bSortable": false
                }, {
                    mDataProp : function(data){
                          return '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#externalExpenseModal" onclick="getById('+data.id+')"><b>View</b></button>&nbsp;&nbsp;'+
                                 '<button class="btn bg-primary btn-xs" type="button" onclick="updateStatus('+data.id+')"><b>Update Status</b></button>';
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

  function getById(id) {
       var formData = {entityId:id};
       $.ajax({
               type : "POST",
               contentType: "application/json; charset=utf-8",
               url : REST_HOST+"/api/externalExpenses/getById",
               dataType : "json",
               data : JSON.stringify(formData),
               success : function(data) {
                   if(data.result!=null){
                        $("#record_id").val(data.result.id);
                        $("#remark_txt").val(data.result.description);
                        $("#amount_txt").val(data.result.amount);
                        if (data.result.personName!=null){
                           $("#person_txt").val(data.result.personName);
                        }
                        if (data.result.amountGivenDate!=null){
                           $("#given_date").val(data.result.amountGivenDate);
                        }
                        $("#externalExpenseModal").modal("show");
                    }else{
                        swal("Error",data.errorMessage, "error");
                    }
               },
               error : function(result) {
                 console.log(result.status);
               }
       });
  }

  function updateStatus(id) {
    var formData = {entityId:id};
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
            $.ajax({
                type : "POST",
                contentType: "application/json; charset=utf-8",
                url : REST_HOST+"/api/externalExpenses/updateStatus",
                dataType : "json",
                data : JSON.stringify(formData),
                success : function(data) {
                    if(data.result==true){
                        swal({
                            title: "Updated!",
                            text: "Status updated successfully!",
                            timer: 1500,
                            type: "success",
                            showConfirmButton: false
                        });
                        getAllExternalExpensesPages();
                    }else{
                        swal("Error",data.errorMessage, "error");
                    }
                },
                error : function(result) {
                  console.log(result.status);
                }
            });
        } else {
            swal("Cancelled", "Status is not updated it's safe", "error");
        }
      });
  }

  function clearData() {
     $("#record_id").val("");
     $("#amount_txt").val("");
     $("#person_txt").val("");
     $("#remark_txt").val("");
     $("#given_date").val("");
  }
