$("#login_btnId").on('click',function(){
     var loginType = $("input:radio[name=loginType]:checked").val()
     var username = $("#username_txt").val();
     var password = $("#password_txt").val();
     var flag=0;
     if (loginType==""){
        swal("Warning!", "Please select login type!", "warning");
        flag=1;
        return false;
    }
    if(username==""){
        swal("Warning!", "Please enter username!", "warning");
        flag=1;
        return false;
    }
    if(password==""){
        swal("Warning!", "Please enter password!", "warning");
        flag=1;
        return false;
    }
    if(flag==0){
        var isMobileValue=false;
        if(loginType==1)
        {
            isMobileValue=true;
        }
        var formData = {isMobile:isMobileValue,userName:username,password:password};
        getLogin(formData);
    }
});

function getLogin(formData){
    $("#myDiv").LoadingOverlay("show");
    $.ajax({
            type : "POST",
            contentType: "application/json; charset=utf-8",
            url : REST_HOST+"/api/userDetails/getLogin",
            dataType : "json",
            data : JSON.stringify(formData),
            success : function(data) {
                if(data.result!=null){
                    swal({
                        title: "LoggedIn!",
                        text: "Login successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                    localStorage.setItem("fullName", data.result.userName);
                    localStorage.setItem("mobileNumber", data.result.userMobile);
                    localStorage.setItem("userId", data.result.userId);
                    localStorage.setItem("mail",data.result.userEmail);
                    window.open("http://localhost:8082/admin/pages/dashboard.html","_self");
                    clearData();
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
    $("#username_txt").val("");
    $("#password_txt").val("");
}