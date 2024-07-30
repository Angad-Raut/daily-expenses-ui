$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
        $('#dob_date_txt').datepicker({
             format: 'dd MM yyyy',
             endDate: '0d'
        });
        var userId = localStorage.getItem("userId");
        getUserProfile(userId);
    }
});

$("#submit_btn").click(function(){
    var userId = localStorage.getItem("userId");
    var recordId = $("#record_id").val();
    var gender = $("#gender_txt").val();
    var qualification = $("#qualification_txt").val();
    var profession = $("#profession_txt").val();
    var dob = $("#dob_txt").val();
    var bloodGroup = $("#blood_group_txt").val();
    var pan = $("#pan_card_txt").val();
    var aadhar = $("#aadhar_txt").val();
    var street = $("#street_txt").val();
    var city = $("#city_txt").val();
    var state = $("#state_txt").val();
    var country = $("#country_txt").val();
    var pincode = $("#pinCode_txt").val();
    var flag = 0;
    if (userId=="") {
            swal("Warning!", "Invalid user!", "warning");
            flag=1;
            return false;
    }
    if (gender=="") {
            swal("Warning!", "Please enter gender!", "warning");
            flag=1;
            return false;
    }
    if (qualification=="") {
            swal("Warning!", "Please enter qualification!", "warning");
            flag=1;
            return false;
    }
    if (profession=="") {
            swal("Warning!", "Please enter profession!", "warning");
            flag=1;
            return false;
    }
    if (dob=="") {
            swal("Warning!", "Please select date of birth!", "warning");
            flag=1;
            return false;
    }
    if (bloodGroup=="") {
            swal("Warning!", "Please enter blood group!", "warning");
            flag=1;
            return false;
    }
    if (pan=="") {
            swal("Warning!", "Please enter PAN Card number!", "warning");
            flag=1;
            return false;
    }
    if (aadhar=="") {
            swal("Warning!", "Please enter Aadhar Card number!", "warning");
            flag=1;
            return false;
    }
    if (street=="") {
            swal("Warning!", "Please enter street!", "warning");
            flag=1;
            return false;
    }
    if (city=="") {
            swal("Warning!", "Please enter city!", "warning");
            flag=1;
            return false;
    }
    if (state=="") {
            swal("Warning!", "Please enter state!", "warning");
            flag=1;
            return false;
    }
    if (country=="") {
            swal("Warning!", "Please enter country!", "warning");
            flag=1;
            return false;
    }
    if (pincode=="") {
            swal("Warning!", "Please enter pinCode!", "warning");
            flag=1;
            return false;
    }
    if (flag==0) {
        var formData = {id:recordId,userId:userId,qualification:qualification,
                        profession:profession,gender:gender,dateOfBirth:dob,
                        bloodGroup:bloodGroup,panNumber:pan,aadharNumber:aadhar,
                        street:street,city:city,state:state,country:country,pinCode:pincode
                       };
        addUpdateUserProfiles(formData);
    }
});

$("#cancel_btn").click(function(){
    clearData();
});

function getUserProfile(userId) {
   var formData = {entityId:userId};
   $.ajax({
         type : "POST",
         contentType: "application/json; charset=utf-8",
         url : REST_HOST+"/api/userDetails/getUserProfileDetails",
         dataType : "json",
         data : JSON.stringify(formData),
         success : function(data) {
             if(data.result!=null){
                 setProfileDetails(data.result);
                 disableAllFields();
             }else{
                 swal("Error",data.errorMessage, "error");
             }
         },
         error : function(result) {
             console.log(result.status);
         }
   });
}

function addUpdateUserProfiles(formData) {
    $.ajax({
          type : "POST",
          contentType: "application/json; charset=utf-8",
          url : REST_HOST+"/api/userDetails/addUpdateUserProfile",
          dataType : "json",
          data : JSON.stringify(formData),
          success : function(data) {
               if(data.result!=null){
                    if (formData.id==null) {
                         swal({
                             title: "Added!",
                             text: "User Profile Details added successfully!",
                             timer: 1500,
                             type: "success",
                             showConfirmButton: false
                         });
                    } else {
                         swal({
                             title: "Updated!",
                             text: "User Profile Details updated successfully!",
                             timer: 1500,
                             type: "success",
                             showConfirmButton: false
                         });
                    }
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
function setProfileDetails(data) {
        $("#record_id").val(data.id);
        $("#user_id").val(data.userId);
        $("#user_name").val(data.fullName);
        $("#user_mobile").val(data.mobile);
        $("#user_email").val(data.email);
        $("#gender_txt").val(data.gender);
        $("#qualification_txt").val(data.qualification);
        $("#profession_txt").val(data.profession);
        $("#dob_txt").val(data.dateOfBirth);
        $("#blood_group_txt").val(data.bloodGroup);
        $("#pan_card_txt").val(data.panNumber);
        $("#aadhar_txt").val(data.aadharNumber);
        $("#street_txt").val(data.street);
        $("#city_txt").val(data.city);
        $("#state_txt").val(data.state);
        $("#country_txt").val(data.country);
        $("#pinCode_txt").val(data.pinCode);
}

function clearData() {
     $("#record_id").val("");
     $("#user_id").val("");
     $("#user_name").val("");
     $("#user_mobile").val("");
     $("#user_email").val("");
     $("#gender_txt").val("");
     $("#qualification_txt").val("");
     $("#profession_txt").val("");
     $("#dob_txt").val("");
     $("#blood_group_txt").val("");
     $("#pan_card_txt").val("");
     $("#aadhar_txt").val("");
     $("#street_txt").val("");
     $("#city_txt").val("");
     $("#state_txt").val("");
     $("#country_txt").val("");
     $("#pinCode_txt").val("");
}
function disableAllFields() {
  $("#gender_txt").attr('disabled', 'disabled');
  $("#qualification_txt").attr('disabled', 'disabled');
  $("#profession_txt").attr('disabled', 'disabled');
  $("#dob_txt").attr('disabled', 'disabled');
  $("#blood_group_txt").attr('disabled', 'disabled');
  $("#pan_card_txt").attr('disabled', 'disabled');
  $("#aadhar_txt").attr('disabled', 'disabled');
  $("#street_txt").attr('disabled', 'disabled');
  $("#city_txt").attr('disabled', 'disabled');
  $("#state_txt").attr('disabled', 'disabled');
  $("#country_txt").attr('disabled', 'disabled');
  $("#pinCode_txt").attr('disabled', 'disabled');
  $("#submit_btn").hide();
  $("#cancel_btn").hide();
}

function enableAllFields() {
  $("#gender_txt").removeAttr('disabled');
  $("#qualification_txt").removeAttr('disabled');
  $("#profession_txt").removeAttr('disabled');
  $("#dob_txt").removeAttr('disabled');
  $("#blood_group_txt").removeAttr('disabled');
  $("#pan_card_txt").removeAttr('disabled');
  $("#aadhar_txt").removeAttr('disabled');
  $("#street_txt").removeAttr('disabled');
  $("#city_txt").removeAttr('disabled');
  $("#state_txt").removeAttr('disabled');
  $("#country_txt").removeAttr('disabled');
  $("#pinCode_txt").removeAttr('disabled');
  $("#submit_btn").show();
  $("#cancel_btn").show();
}

$("#edit_btn").click(function() {
   enableAllFields();
});