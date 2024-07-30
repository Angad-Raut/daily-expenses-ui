$(document).ready(function() {

});

$("#registerId").on('click',function(){
   var fullName = $("#full_name_txt").val();
   var mobileNumber = $("#mobile_txt").val();
   var emailId = $("#email_txt").val();
   var password = $("#password_txt").val();
   var conPassword = $("#con_password_txt").val();
   var flag=0;
   if (fullName==""){
       swal("Warning!", "Please enter your full name!", "warning");
       flag=1;
       return false;
   }
   if(mobileNumber==""){
       swal("Warning!", "Please enter your mobile number!", "warning");
       flag=1;
       return false;
   }
   if (emailId==""){
       swal("Warning!", "Please enter your email-Id!", "warning");
       flag=1;
       return false;
   }
   if(password==""){
       swal("Warning!", "Please enter your password!", "warning");
       flag=1;
       return false;
   }
   if(conPassword==""){
       swal("Warning!", "Please enter confirm your password!", "warning");
       flag=1;
       return false;
   }
   if(conPassword!=password){
       swal("Warning!", "Confirm password should not match with password!", "warning");
       flag=1;
       return false;
   }
   if(flag==0){
      var formData={
                    userName:fullName,
                    userMobile:mobileNumber,
                    userEmail:emailId,
                    userPassword:password
        };
        registerUser(formData);
   }
});

function registerUser(formData){
   $("#myDiv").LoadingOverlay("show");
   $.ajax({
   		type : "POST",
   		contentType: "application/json; charset=utf-8",
   		url : REST_HOST+"/api/userDetails/userRegister",
   		dataType : "json",
   		data : JSON.stringify(formData),
   		success : function(data) {
   			if(data.result==true){
                swal({
                    title: "Registered!",
                    text: "User registered successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                  });
                clearData();
                window.open("login.html","_self");
   			}else{
   				swal("Error",data.errorMessage, "error");
   			}
   		},
   		complete : function(){
   			$("#myDiv").LoadingOverlay("hide");
   		},
   		error : function(result) {
   			console.log(result.status);
   			$("#myDiv").LoadingOverlay("hide");
   		}
      });
}

function clearData(){
    $("#full_name_txt").val("");
    $("#mobile_txt").val("");
    $("#email_txt").val("");
    $("#password_txt").val("");
    $("#con_password_txt").val("");
}