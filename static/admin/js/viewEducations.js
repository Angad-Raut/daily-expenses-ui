$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        getEmployeeDropDown();
        var employeeId = null;
        getAllEducationPages(employeeId);
    }
});

$("#add_button").click(function(){
    configureDates();
    setEmployeeDropDown();
});

function setEmployeeDropDown(){
    $('#employee_id').val("");
    $.ajax({
        type : "GET",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/employeeDetails/getEmployeeDropDown",
        dataType : "json",
        success : function(data) {
            var output='';
            var dataList = data.result;
            for(var i in dataList){
                output+='<option value="'+dataList[i].entityId+'">'+dataList[i].entityValue+'</option>';
            }
            $('#employee_id').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}

$('#emp_id').on('change', function (e) {
    var valueSelected = this.value;
    getAllEducationPages(valueSelected);
});

$("#btn_txt").click(function(){
    var education_id = $("#education_Id").val();
    var employee_id = $("#employee_id").val();
    var degree_name = $("#degree_name").val();
    var university = $("#university_name").val();
    var percentage = $("#percentage_txt").val();
    var start_date = $("#start_date").val();
    var end_date = $("#end_date").va();
    var flag = 0;
    if (employee_id=="" || employee_id==null || employee_id=="Select") {
        swal("Warning!", "Please select valid employee!", "warning");
        flag=1;
        return false;
    }
    if (degree_name=="" || degree_name==null) {
        swal("Warning!", "Please enter degree name!", "warning");
        flag=1;
        return false;
    }
    if (university=="" || university==null) {
        swal("Warning!", "Please enter university name!", "warning");
        flag=1;
        return false;
    }
    if (percentage=="" || percentage==null) {
        swal("Warning!", "Please enter percentage!", "warning");
        flag=1;
        return false;
    }
    if (start_date=="" || start_date==null) {
        swal("Warning!", "Please select start date!", "warning");
        flag=1;
        return false;
    }
    if (end_date=="" || end_date==null) {
        swal("Warning!", "Please select end date!", "warning");
        flag=1;
        return false;
    }
    if (flag==0) {
        var formData = {
            id:education_id,
            employeeId:employee_id,
            degreeName:degree_name,
            universityName:university,
            startDate:start_date,
            endDate:end_date,
            percentage:percentage
        };
        addUpdateEducationDetails(formData);
    }
});

$("#btn_clean").click(function(){
    claerData();
});

function claerData() {
    $("#education_Id").val("");
    $("#employee_id").val("");
    $("#degree_name").val("");
    $("#university_name").val("");
    $("#percentage_txt").val("");
    $("#start_date").val("");
    $("#end_date").va("");
}

function configureDates(){
    $('#start_date_txt').datepicker({
        format: 'dd MM yyyy'
    });
    $('#end_date_txt').datepicker({
         format: 'dd MM yyyy'
    });
}

function addUpdateEducationDetails(formData) {
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/educationDetails/insertUpdate",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result==true){
                if (formData.id==null){
                    swal({
                        title: "Added!",
                        text: "Education details added successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                } else {
                    swal({
                        title: "Updated!",
                        text: "Education details updated successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                }
                clearData();
                getAllEducationPages();
                $("#educationModal").modal("hide");
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}

function getEmployeeDropDown() {
    $.ajax({
        type : "GET",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/employeeDetails/getEmployeeDropDown",
        dataType : "json",
        success : function(data) {
            var output='';
            var dataList = data.result;
            for(var i in dataList){
                output+='<option value="'+dataList[i].entityId+'">'+dataList[i].entityValue+'</option>';
            }
            $('#emp_id').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}

function getAllEducationPages(employeeId) {
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
                         entityId:employeeId,
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
        $('#educationDetailsTableId').dataTable({
            "sAjaxSource" : REST_HOST+"/api/educationDetails/getEmployeeEducations",
            "sAjaxDataProp" : 'result.content',
            "aoColumns" : [ {
                mDataProp : 'srNo',
                "bSortable": false
            }, {
                mDataProp : 'employeeName',
                "bSortable": false
            },{
                mDataProp : 'degreeName',
                "bSortable": false
            }, {
                mDataProp : 'percentage',
                "bSortable": false
            }, {
                mDataProp : 'startDate',
                "bSortable": false
            }, {
                mDataProp : 'endDate',
                "bSortable": false
            }, {
                mDataProp : function(data){
                      return '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#educationModal" onclick="getEducationById('+data.id+')"><b>View</b></button>';
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

function getEducationById(id) {
    var formData = {entityId:id};
    $.ajax({  
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/educationDetails/getById",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
           if(data.result!=null){
                setEmployeeDropDown();
                $("#education_Id").val(data.result.id);
                $("#employee_id").val(data.result.employeeId);
                $("#degree_name").val(data.result.degreeName);
                $("#university_name").val(data.result.universityName);
                $("#percentage_txt").val(data.result.percentage);
                $("#start_date").val(data.result.startDate);
                $("#end_date").va(data.result.endDate);
                $("#educationModal").modal("show");
           }else{
                swal("Error",data.errorMessage, "error");
           }
        },
        error : function(result) {
           console.log(result.status);
        }
    });
}