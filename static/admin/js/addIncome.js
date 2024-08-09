$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        getIncomesTypesDropDown();
    }
});


$('#incomeType').on('change', function (e) {
    var valueSelected = this.value;
    if (valueSelected=="SALARY") {
        $('.hideshow').show();
    } else {
        $('.hideshow').hide();
    }
});

$("#save_btn").click(function(){
    var incomeId = $("#income_id").val();
    var incomeDate = $("#income_date").val();
    var incomeType = $("#income_type").val();
    var incomeAmount = $("#income_amount").val();
    var taxAmount = $("#tax_amount").val();
    var pfAmount = $("#pf_amount").val();
    var ptAmount = $("#pt_amount").val();
    var flag = 0;
    if (incomeType=="" || incomeType==null) {
       swal("Warning!", "Please select income type!!", "warning");
       flag=1;
       return false;
    }
    if (incomeType=="" && incomeType==null) {
       swal("Warning!", "Please enter income amount!!", "warning");
       flag=1;
       return false;
    }
    if (incomeType=="SALARY") {
        if (taxAmount=="" && taxAmount==null) {
            swal("Warning!", "Please enter tax amount!!", "warning");
            flag=1;
            return false;
        }
        if (pfAmount=="" && pfAmount==null) {
            swal("Warning!", "Please enter pf amount!!", "warning");
            flag=1;
            return false;
        }
        if (ptAmount=="" && ptAmount==null) {
            swal("Warning!", "Please enter pt amount!!", "warning");
            flag=1;
            return false;
        }
    }
    if (flag==0) {
        var formData = {
            id:incomeId,
            incomeType:incomeType,
            incomeDate:incomeDate,
            incomeAmount:incomeAmount,
            grossSalary:incomeAmount,
            tdsAmount:taxAmount,
            pfAmount:pfAmount,
            ptAmount:ptAmount
        };
        addUpdateIncomeDetails(formData);
    }
});

$("#clear_btn").click(function(){
   clearData();
});

function clearData() {
    $("#income_id").val("");
    $("#income_date").val("");
    $("#income_type").val("");
    $("#income_amount").val("");
    $("#tax_amount").val("");
    $("#pf_amount").val("");
    $("#pt_amount").val("");
    $("#net_salary").val("");
}

function addUpdateIncomeDetails(formData) {
    $.ajax({
          type : "POST",
          contentType: "application/json; charset=utf-8",
          url : REST_HOST+"/api/incomes/addUpdateIncome",
          dataType : "json",
          data : JSON.stringify(formData),
      	  success : function(data) {
      		  if(data.result==true){
                  swal({
                       title: "Added!",
                       text: "Income details added successfully!",
                       timer: 1500,
                       type: "success",
                       showConfirmButton: false
                  });
                  clearData();
                  window.open("../../admin/pages/viewIncomes.html","_self");
      		  }else{
      			  swal("Error",data.errorMessage, "error");
      		  }
      	  },
      	  error : function(result) {
      		 console.log(result.status);
      	  }
    });
}

function getIncomesTypesDropDown(){
  	$.ajax({
  		type : "GET",
  		contentType: "application/json; charset=utf-8",
  		url : REST_HOST+"/api/incomes/getIncomeTypesDropDown",
  		dataType : "json",
  		success : function(data) {
  			var output='';
  			var dataList = data.result;
  			for(var i in dataList){
  				output+='<option value="'+dataList[i].entityName+'">'+dataList[i].entityValue+'</option>';
  			}
  			$('#income_type').append(output);
  		},
  		error : function(result){
  			console.log(result.status);
  		}
  	});
  }