var REST_HOST="http://localhost:9001";
$("#logoutId").click(function(){
    $.ajax({
        type : "GET",
        url: REST_HOST+"/api/userDetails/logout",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus, jqXHR){
          if(jqXHR.status==200){
            localStorage.clear();
            swal({
                title: "Logout!",
                text: "Your logout successfully!",
                timer: 1500,
                type: "success",
                showConfirmButton: false
            });
            window.open("../../login.html","_self");
          }
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log(textStatus + ": " + jqXHR.status + " " + errorThrown);
        }
      });
});