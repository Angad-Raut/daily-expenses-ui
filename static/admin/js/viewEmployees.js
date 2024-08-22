$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
        getAllEmployeePages();
    }
});

$("#save_btn").click(function(){
    var employee_id = $("#employee_id").val();
    var employee_name = $("#employee_name").val();
    var employee_mobile = $("#employee_mobile").val();
    var employee_email = $("#employee_email").val();
    var linked_in_url = $("#linked_in_url").val();
    var git_hub_url = $("#git_hub_url").val();
    var total_experience = $("#total_experience").val();
    var profile_summary_txt = $("#profile_summary_txt").val();
    var flag = 0;
    if (employee_name=="" || employee_name==null) {
        swal("Warning!", "Please enter employee name!!", "warning");
        flag=1;
        return false;
    }
    if (employee_mobile=="" || employee_mobile==null) {
        swal("Warning!", "Please enter employee mobile!!", "warning");
        flag=1;
        return false;
    }
    if (employee_email=="" || employee_email==null) {
        swal("Warning!", "Please enter employee email!!", "warning");
        flag=1;
        return false;
    }
    if (total_experience=="" || total_experience==null) {
        swal("Warning!", "Please enter total experience!!", "warning");
        flag=1;
        return false;
    }
    if (profile_summary_txt=="" || profile_summary_txt==null) {
        swal("Warning!", "Please enter profile summary!!", "warning");
        flag=1;
        return false;
    }
    if (flag==0) {
        var formData = {
            id:employee_id,
            employeeName:employee_name,
            employeeMobile:employee_mobile,
            employeeEmail:employee_email,
            linkedInUrl:linked_in_url,
            gitHubUrl:git_hub_url,
            profileSummary:profile_summary_txt,
            totalExperience:total_experience
        };
        updateEmployeeDetails(formData);
    }
});

$("#closeId").click(function(){
    clearData();
});

$("#company_id").on('change',function(e){
     var selectedValue=this.value;
     $("#company_id").val(selectedValue);
});

$("#remove_btn").click(function(){
    $("#company_id").va("");
    getCompanyDropDown();
});

$("#claerI_btn").click(function(){
    removeData();
});

$("#add_btn").click(function(){
     var employee_id = $("#emp_id").val();
     var company_id = $("#company_id").val();
     var flag = 0;
     if (employee_id=="" || employee_id==null) {
        swal("Warning!", "Please provide valid employee!!", "warning");
        flag=1;
        return false;
     }
     if (company_id=="" || company_id==null) {
        swal("Warning!", "Please select employee company!!", "warning");
        flag=1;
        return false;
     }
     if (flag==0) {
        var formData = {employeeId:employee_id,companyId:company_id};
        addEmployeeCompany(formData);
     }
});

function removeData() {
    $("#emp_id").val("");
    $("#company_id").va("");
}
function clearData() {
    $("#employee_id").val("");
    $("#employee_name").val("");
    $("#employee_mobile").val("");
    $("#employee_email").val("");
    $("#linked_in_url").val("");
    $("#git_hub_url").val("");
    $("#total_experience").val("");
    $("#profile_summary_txt").val("");
}

function addEmployeeCompany(formData) {
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/employeeDetails/insertUpdateEmployeeCompany",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result==true){
                swal({
                    title: "Added!",
                    text: "Employee company added successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                });
                removeData();
                viewCompanies();
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}

function updateEmployeeDetails(formData){
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/employeeDetails/addUpdate",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result==true){
                swal({
                    title: "Updated!",
                    text: "Employee details updated successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                });
                clearData();
                getAllEmployeePages();
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}

function getAllEmployeePages() {
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
        $('#employeeTableId').dataTable({
            "sAjaxSource" : REST_HOST+"/api/employeeDetails/getAllEmployees",
            "sAjaxDataProp" : 'result.content',
            "aoColumns" : [ {
                mDataProp : 'srNo',
                "bSortable": false
            }, {
                mDataProp : 'employeeName',
                "bSortable": false
            },{
                mDataProp : 'employeeMobile',
                "bSortable": false
            }, {
                mDataProp : 'employeeEmail',
                "bSortable": false
            }, {
                mDataProp : 'totalExperience',
                "bSortable": false
            }, {
                mDataProp : function(data){
                      return '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#editEmployee-modal" onclick="getEmployeeById('+data.employeeId+')"><b>View</b></button>&nbsp;&nbsp;'+
                             '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#company-modal" onclick="viewCompanies('+data.employeeId+')"><b>View Companies</b></button>';
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

function getEmployeeById(employeeId) {
    var formData = {entityId:employeeId};
    $.ajax({  
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/employeeDetails/getById",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
           if(data.result!=null){
                $("#employee_id").val(data.result.id);
                $("#employee_name").val(data.result.employeeName);
                $("#employee_mobile").val(data.result.employeeMobile);
                $("#employee_email").val(data.result.employeeEmail);
                $("#total_experience").val(data.result.totalExperience);
                $("#profile_summary_txt").val(data.result.profileSummary);
                if (data.result.linkedInUrl!=null) {
                    $("#linked_in_url").val(data.result.linkedInUrl);
                }
                if (data.result.gitHubUrl!=null){
                    $("#git_hub_url").val(data.result.linkedInUrl);
                }
                $("#editEmployee-modal").modal("show");
           }else{
                swal("Error",data.errorMessage, "error");
           }
        },
        error : function(result) {
           console.log(result.status);
        }
    });
}

function viewCompanies(employeeId) {
    $("#emp_id").val(employeeId);
    var formData = {entityId:employeeId};
    var table = $('#companyTableId').DataTable();
    table.clear().draw();
    table.destroy();
    $.ajax({
            type : "POST",
            contentType: "application/json; charset=utf-8",
            url : REST_HOST+"/api/employeeDetails/getEmployeeCompanies",
            dataType : "json",
            data : JSON.stringify(formData),
            success : function(data) {
                if(data.result!=null){
                    var dataList=data.result;
                    for(var i in dataList){
                        table.row.add( [
                            dataList[i].srNo,
                            dataList[i].companyName,
                            dataList[i].startDate,
                            dataList[i].endDate,
                            dataList[i].experience
                        ] ).draw(false);
                    }
                    getCompanyDropDown();
                    $("#company-modal").modal("show");
                }else{
                    swal("Error",data.errorMessage, "error");
                }
            },
            error : function(result) {
                console.log(result.status);
            }
    });
}

function getCompanyDropDown() {
    $.ajax({
        type : "GET",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/companyDetails/getCompanyDropDown",
        dataType : "json",
        success : function(data) {
            var output='';
            var dataList = data.result;
            for(var i in dataList){
                output+='<option value="'+dataList[i].entityId+'">'+dataList[i].entityValue+'</option>';
            }
            $('#compnay_id').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}