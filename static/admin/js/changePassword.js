$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    }
});

$("#change_password").click(function(){
    var userId = $("#user_id").val();
    var oldPassword = $("#old_pass").val();
    var newPassword = $("#new_pass").val();
    var conPassword = $("#con_pass").val();
    var flag = 0;
    if (userId=="" || userId==null) {
       swal("Warning!", "Please provide valid user!!", "warning");
       flag=1;
       return false;
    }
    if (oldPassword=="" || oldPassword==null) {
       swal("Warning!", "Please enter old password!!", "warning");
       flag=1;
       return false;
    }
    if (newPassword=="" || newPassword==null) {
       swal("Warning!", "Please enter new password!!", "warning");
       flag=1;
       return false;
    }
    if (newPassword==oldPassword) {
       swal("Warning!", "New password and Old Password should not be same!!", "warning");
       flag=1;
       return false;
    }
    if (conPassword!=newPassword) {
       swal("Warning!", "Confirm password should be match with new password!!", "warning");
       flag=1;
       return false;
    }
    var formData = {userId:userId,oldPassword:oldPassword,newPassword:newPassword};
    changePassword(formData);
});

function changePassword(formData) {
      $.ajax({
      		type : "POST",
      		contentType: "application/json; charset=utf-8",
      		url : REST_HOST+"/api/userDetails/changePassword",
      		dataType : "json",
      		data : JSON.stringify(formData),
      		success : function(data) {
      			if(data.result==true){
                   swal({
                       title: "Changed!",
                       text: "Password has been changed successfully!",
                       timer: 1500,
                       type: "success",
                       showConfirmButton: false
                     });
                   clearData();
                   window.open("../static/admin/pages/dashboard.html","_self");
      			}else{
      				swal("Error",data.errorMessage, "error");
      			}
      		},
      		error : function(result) {
      			console.log(result.status);
      		}
      });
}

function clearData() {
    $("#user_id").val("");
    $("#old_pass").val("");
    $("#new_pass").val("");
    $("#con_pass").val("");
}