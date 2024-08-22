$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        getEmployeeDropDown();
    }
});

$('#employee_id').on('change', function (e) {
    var employeeId = this.value;
    if (employeeId!="" && employeeId!=null && employeeId!="Select"){
        getEmployeeCompanyDropDown(employeeId);
    }
});

$("#submit_btn").click(function(){
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
    if (techStackList.length==0) {
        swal("Warning!", "Please add at least one element in the list!", "warning");
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

$("#cancel_btn").click(function(){
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
    clearItemData();
}

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
                    title: "Added!",
                    text: "Project details added successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                });
                clearData();
                window.open("../../admin/pages/viewProjects.html","_self");
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
            $('#employee_id').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}

function getEmployeeCompanyDropDown(employeeId) {
    var formData = {entityId:employeeId};
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/employeeDetails/getEmployeeCompanyDropDown",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            var output='';
            var dataList = data.result;
            for(var i in dataList){
                output+='<option value="'+dataList[i].entityId+'">'+dataList[i].entityValue+'</option>';
            }
            $('#company_id').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}