$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        $("#photo_image").hide();
        $("#sign_image").hide();
        getAccountInfo(localStorage.getItem("userId"));
    }
});

$("#save_btn").click(function(){
    var userId = localStorage.getItem("userId");
    var mobile = $("#user_mobile").val();
    var email = $("#user_email").val();
    var photoId = $("#photo_txt").val();
    var signId = $("#sign_txt").val();
    var flag = 0;
    if (userId=="" || userId==null) {
       swal("Warning!", "Please provide valid user!!", "warning");
       flag=1;
       return false;
    }
    if (mobile=="" && email==null) {
       swal("Warning!", "Please enter mobile number or email Id!!", "warning");
       flag=1;
       return false;
    }
    if (photoId=="") {
       swal("Warning!", "Please upload photo!!", "warning");
       flag=1;
       return false;
    }
    if (signId=="") {
       swal("Warning!", "Please upload signature!!", "warning");
       flag=1;
       return false;
    }
    if (flag==0) {
        var formData = new FormData();
        var photoFile = $("#photo_txt")[0].files[0];
        var signFile = $("#sign_txt")[0].files[0];
        formData.append("userId",userId);
        formData.append("userMobile",mobile);
        formData.append("userEmail",email);
        formData.append("photo",photoFile);
        formData.append("signature",signFile);
        updateAccountSetting(formData);
    }
});

function updateAccountSetting(formData) {
      $.ajax({
      		type : "POST",
            url : REST_HOST+"/api/userDetails/updateAccountSetting",
            dataType : "json",
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
      		success : function(data) {
      			if(data.result==true){
                   swal({
                       title: "Updated!",
                       text: "Account Setting has been updated successfully!",
                       timer: 1500,
                       type: "success",
                       showConfirmButton: false
                     });
                   clearData();
      			}else{
      				swal("Error",data.errorMessage, "error");
      			}
      		},
      		error : function(result) {
      			console.log(result.status);
      		}
      });
}

function getAccountInfo(userId) {
    var formData = {entityId:userId};
    $.ajax({
          type : "POST",
          contentType: "application/json; charset=utf-8",
          url : REST_HOST+"/api/userDetails/getAccountInfo",
          dataType : "json",
          data : JSON.stringify(formData),
          success : function(data) {
              if(data.result!=null){
                  var user_id = localStorage.getItem("userId");
                  $("#user_id").val(user_id);
                  $("#user_mobile").val(data.result.mobile);
                  $("#user_email").val(data.result.email);
                  if (data.result.photoUrl!=null) {
                      $('#photo_image').attr('src', "data:image/jpg;base64,"+data.result.photoUrl);
                      $("#photo_image").show();
                  }
                  if (data.result.signatureUrl!=null) {
                      $('#sign_image').attr('src', "data:image/jpg;base64,"+data.result.signatureUrl);
                      $("#sign_image").show();
                  }
                  disableAllFields();
              }else {
                  swal("Error",data.errorMessage, "error");
              }
          },
          error : function(result) {
             console.log(result.status);
          }
    });
}
$("#clear_btn").click(function(){
   clearData();
});
function clearData() {
    $("#user_id").val("");
    $("#user_mobile").val("");
    $("#user_email").val("");
    $("#photo_txt").val("");
    $("#sign_txt").val("");
    $("#photo_txt").removeAttr('disabled');
    $("#sign_txt").removeAttr('disabled');
}

photo_txt.onchange = evt => {
  const [file] = photo_txt.files
  if (file) {
    photo_image.src = URL.createObjectURL(file)
    $("#photo_image").show();
  }
}

sign_txt.onchange = evt => {
  const [file] = sign_txt.files
  if (file) {
    sign_image.src = URL.createObjectURL(file)
    $("#sign_image").show();
  }
}

function disableAllFields() {
  $("#user_mobile").attr('disabled', 'disabled');
  $("#user_email").attr('disabled', 'disabled');
  $("#photo_txt").hide();
  $("#sign_txt").hide();
  $("#save_btn").hide();
  $("#clear_btn").hide();
}
$("#edit_btn").click(function(){
    enableAllFields();
});
function enableAllFields() {
  $("#user_mobile").removeAttr('disabled');
  $("#user_email").removeAttr('disabled');
  $("#photo_txt").show();
  $("#sign_txt").show();
  $("#save_btn").show();
  $("#clear_btn").show();
}