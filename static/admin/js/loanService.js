function getLoanTypesDropDown() {
    $.ajax({
        type : "GET",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/loanDetails/getLoanTypes",
        dataType : "json",
        success : function(data) {
            var output='';
            var dataList = data.result;
            for(var i in dataList){
                output+='<option value="'+dataList[i].entityType+'">'+dataList[i].entityValue+'</option>';
            }
            $('#loan_type').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}

function getPaymentModeDropDown() {
    $.ajax({
        type : "GET",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/loanDetails/getPaymentModes",
        dataType : "json",
        success : function(data) {
            var output='';
            var dataList = data.result;
            for(var i in dataList){
                output+='<option value="'+dataList[i].entityName+'">'+dataList[i].entityValue+'</option>';
            }
            $('#payment_mode').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}

function insertUpdateEMIDetails(formData) {
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/loanDetails/addLoanEMI",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result==true){
                if (formData.id==null){
                    swal({
                        title: "Added!",
                        text: "EMI details added successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                } else {
                    swal({
                        title: "Updated!",
                        text: "EMI details updated successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                }
                cleatEMIData();
                $("#emiModal").modal("hide");
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}

function insertUpdateLoanDetails(formData) {
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/loanDetails/insertOrUpdate",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result==true){
                if (formData.id==null){
                    swal({
                        title: "Added!",
                        text: "Loan details added successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                } else {
                    swal({
                        title: "Updated!",
                        text: "Loan details updated successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                }
                clearLoanData();
                getAllLoansPages();
                $("#addLoanModal").modal("hide");
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}

function getAllLoansPages(){
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
        $('#loanTableId').dataTable({
            "sAjaxSource" : REST_HOST+"/api/loanDetails/getAllLoans",
            "sAjaxDataProp" : 'result.content',
            "aoColumns" : [ {
                mDataProp : 'srNo',
                "bSortable": false
            }, {
                mDataProp : 'bankName',
                "bSortable": false
            },{
                mDataProp : 'loanType',
                "bSortable": false
            }, {
                mDataProp : 'loanAmount',
                "bSortable": false
            }, {
                mDataProp : 'remainingAmount',
                "bSortable": false
            }, {
                mDataProp : 'startDate',
                "bSortable": false
            }, {
                mDataProp : 'endDate',
                "bSortable": false
            }, {
                mDataProp : function(data){
                    if (data.loanType=="Credit Card") {
                        return '<button type="button" class="btn btn-primary btn-xs" onclick="getLoanDetailsById('+data.id+');"><b>Edit</b></button>&nbsp;&nbsp;'+
                        '<button type="button" class="btn btn-primary btn-xs" onclick="updateStatus('+data.id+');"><b>Close</b></button>';
                    } else {
                        return '<button type="button" class="btn btn-primary btn-xs" onclick="getLoanDetailsById('+data.id+');"><b>Edit</b></button>&nbsp;&nbsp;'+
                        '<button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#emiModal" onclick="setLoanId('+data.id+');"><b>Add EMI</b></button>&nbsp;&nbsp;'+
                        '<button type="button" class="btn btn-primary btn-xs" onclick="getAllEMIByLoanId('+data.id+');"><b>View EMI</b></button>&nbsp;&nbsp;'+
                        '<button type="button" class="btn btn-primary btn-xs" onclick="updateStatus('+data.id+');"><b>Close</b></button>';
                    }
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

function getLoanDetailsById(loanId) {
    var formData = {entityId:loanId};
    $.ajax({  
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/loanDetails/getLoanById",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
           if(data.result!=null){
                $("#loan_id").val(data.result.id);
                $("#loan_type").val(data.result.loanType);
                $("#bank_name").val(data.result.bankName);
                $("#loan_amount").val(data.result.loanAmount);
                $("#start_date").val(data.result.startDate);
                $("#end_date").val(data.result.endDate);
                $("#addLoanModal").modal("show");
           }else{
                swal("Error",data.errorMessage, "error");
           }
        },
        error : function(result) {
           console.log(result.status);
        }
    });
}

function updateStatus(loanId) {
    var formData = {entityId:loanId};
    $.ajax({  
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/loanDetails/updateLoanStatus",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
           if(data.result==true){
                swal({
                    title: "Updated!",
                    text: "Loan status updated successfully!",
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
}

function getAllEMIByLoanId(loanId) {
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
                         entityId:loanId,
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
                    $("#viewModal").modal("show");
                },
                error : function(result) {
                    console.log(result.status);
                }
            });
        };
        $('#emiTableId').dataTable({
            "sAjaxSource" : REST_HOST+"/api/loanDetails/getAllLoanEMISByLoanId",
            "sAjaxDataProp" : 'result.content',
            "aoColumns" : [ {
                mDataProp : 'srNo',
                "bSortable": false
            }, {
                mDataProp : 'emiAmount',
                "bSortable": false
            },{
                mDataProp : 'emiDate',
                "bSortable": false
            }, {
                mDataProp : 'paymentMode',
                "bSortable": false
            }, {
                mDataProp : function(data){
                    return '<button type="button" class="btn btn-primary btn-xs" onclick="getEMIById('+data.emiId+');"><b>View</b></button>';
                    
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

function getEMIById(emiId) {
    var formData = {entityId:emiId};
    $.ajax({  
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/loanDetails/getEMIById",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
           if(data.result!=null){
                $("#loan_id").val(data.result.loanId);
                $("#emi_id").val(data.result.emiId);
                $("#emi_amount").val(data.result.emiAmount);
                $("#payment_mode").val(data.result.paymentMode);
                $("#emi_date").val(data.result.emiDate);
                $("#emiModal").modal("show");
           }else{
                swal("Error",data.errorMessage, "error");
           }
        },
        error : function(result) {
           console.log(result.status);
        }
    });
}