$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        clearData();
    }
});

$("#submit_btn").click(function(){
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
    if (employee_id=="") {
        employee_id=null;
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
        addUpdateEmployee(formData);
    }
});

$("#cancel_btn").click(function(){
    clearData();
});

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

function addUpdateEmployee(formData) {
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/employeeDetails/addUpdate",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result==true){
                swal({
                    title: "Added!",
                    text: "Employee details added successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                });
                clearData();
                window.open("../../admin/pages/viewEmployees.html","_self");
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}