$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        getDashboardCount();
    }
});

function getDashboardCount() {
    $.ajax({
            type : "GET",
            contentType: "application/json; charset=utf-8",
            url : REST_HOST+"/api/expenses/getDashboardCount",
            dataType : "json",
            success : function(data) {
              if(data.result!=null){
                  $("#monthly_count").text(data.result.monthlyExpenseCount);
                  $("#total_count").text(data.result.allExpenseCount);
                  $("#monthly_sum").text(data.result.monthlyExpenseTotal);
                  $("#yearly_sum").text(data.result.yearlyExpenseTotal);
                  $("#document_count").text(data.result.documentCount);
              }else{
                  swal("Error",data.errorMessage, "error");
              }
            },
            error : function(result) {
              console.log(result.status);
            }
    });
}