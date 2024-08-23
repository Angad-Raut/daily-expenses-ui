var dataList;
$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
        getEmployeeDropDown();
        var employeeId = null;
        getAllProjectPages(employeeId);
    }
});

$("#emp_id").on('change',function(e){
    var employeeId = this.value;
    getAllProjectPages(employeeId);
});

$('#employee_id').on('change', function (e) {
    var employeeId = this.value;
    if (employeeId!="" && employeeId!=null && employeeId!="Select"){
        getEmployeeCompanyDropDown(employeeId);
    }
});

function getEmployeeDropDown() {
    $.ajax({
        type : "GET",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/employeeDetails/getEmployeeDropDown",
        dataType : "json",
        success : function(data) {
            var output='';
            dataList = data.result;
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

function getAllProjectPages(employeeId) {
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
        $('#projectsTableId').dataTable({
            "sAjaxSource" : REST_HOST+"/api/projectDetails/getEmployeeProjects",
            "sAjaxDataProp" : 'result.content',
            "aoColumns" : [ {
                mDataProp : 'srNo',
                "bSortable": false
            }, {
                mDataProp : 'employeeName',
                "bSortable": false
            },{
                mDataProp : 'companyName',
                "bSortable": false
            }, {
                mDataProp : 'projectName',
                "bSortable": false
            }, {
                mDataProp : 'jobTitle',
                "bSortable": false
            }, {
                mDataProp : 'teamSize',
                "bSortable": false
            }, {
                mDataProp : function(data){
                      return '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#editProjectModal" onclick="getProjectById('+data.id+')"><b>View</b></button>&nbsp;&nbsp;'+
                             '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#technologyModal" onclick="viewTechnologies('+data.id+')"><b>view Technologies</b></button>';
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

function getProjectById(projectId) {
    var formData = {entityId:projectId};
    $.ajax({  
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/projectDetails/getById",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
           if(data.result!=null){
                setEmployeeDropDown();
                $("#project_id").val(data.result.id);
                $("#employee_id").val(data.result.employeeId);
                $("#company_id").val(data.result.companyId);
                $("#project_name").val(data.result.projectName);
                $("#job_title").val(data.result.jobTitle);
                $("#team_size").val(data.result.teamSize);
                $("#project_domain").val(data.result.projectDomain);
                $("#project_desc").val(data.result.projectDescription);
                $("#role_responsibility").val(data.result.responsibility);
                $("#editProjectModal").modal("show");
           }else{
                swal("Error",data.errorMessage, "error");
           }
        },
        error : function(result) {
           console.log(result.status);
        }
    });
}

$("#save_btn").click(function(){
    var project_id = $("#project_id").val();
    var employee_id = $("#employee_id").val();
    var company_id = $("#company_id").val();
    var project_name = $("#project_name").val();
    var job_title = $("#job_title").val();
    var team_size = $("#team_size").val();
    var project_domain = $("#project_domain").val();
    var project_desc = $("#project_desc").val();
    var role_responsibility = $("#role_responsibility").val();
    var flag = 0;
    if (employee_id=="" || employee_id==null || employee_id=="Select") {
        swal("Warning!", "Please select valid employee!", "warning");
        flag=1;
        return false;
    }
    if (company_id=="" || company_id==null || company_id=="Select") {
        swal("Warning!", "Please select valid company!", "warning");
        flag=1;
        return false;
    }
    if (project_name=="" || project_name==null) {
        swal("Warning!", "Please enter project name!", "warning");
        flag=1;
        return false;
    }
    if (job_title=="" || job_title==null) {
        swal("Warning!", "Please enter job title!", "warning");
        flag=1;
        return false;
    }
    if (team_size=="" || team_size==null) {
        swal("Warning!", "Please enter team size!", "warning");
        flag=1;
        return false;
    }
    if (project_domain=="" || project_domain==null) {
        swal("Warning!", "Please enter project domain!", "warning");
        flag=1;
        return false;
    }
    if (project_desc=="" || project_desc==null) {
        swal("Warning!", "Please enter project description!", "warning");
        flag=1;
        return false;
    }
    if (role_responsibility=="" || role_responsibility==null) {
        swal("Warning!", "Please enter role & responsibility!", "warning");
        flag=1;
        return false;
    }
    if (flag==0) {
        var formData = {
             id:project_id,
             employeeId:employee_id,
             companyId:company_id,
             projectName:project_name,
             projectDescription:project_desc,
             jobTitle:job_title,
             teamSize:team_size,
             projectDomain:project_domain,
             responsibility:role_responsibility,
             technologies:techStackList
        };
        insertUpdateProject(formData);
    }
});

function insertUpdateProject(formData) {
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/projectDetails/insertUpdate",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result==true){
                swal({
                    title: "Updated!",
                    text: "Project details updated successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                });
                clearData();
                getAllProjectPages(null);
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}

$("#closeId").click(function(){
   clearData();
});

function clearData() {
    $("#project_id").val("");
    $("#employee_id").val("");
    $("#company_id").val("");
    $("#project_name").val("");
    $("#job_title").val("");
    $("#team_size").val("");
    $("#project_domain").val("");
    $("#project_desc").val("");
    $("#role_responsibility").val("");
    techStackList=[];
    arrayList=[];
}

function setEmployeeDropDown(){
    var output='';
    for(var i in dataList){
        output+='<option value="'+dataList[i].entityId+'">'+dataList[i].entityValue+'</option>';
    }
    $('#employee_id').append(output);
}
