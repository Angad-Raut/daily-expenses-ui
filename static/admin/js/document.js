$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        $("#document_image").hide();
        getDocumentTypesDropDown();
    }
});

$("#save_btn").click(function(){
    var document_type = $("#document_type").val();
    var document_name = $("#document_name").val();
    var document_file = $("#document_file").val();
    var flag = 0;
    if (document_type=="" || document_type==null) {
       swal("Warning!", "Please select document type!!", "warning");
       flag=1;
       return false;
    }
    if (document_name=="" && document_name==null) {
       swal("Warning!", "Please enter document name!!", "warning");
       flag=1;
       return false;
    }
    if (document_file=="" && document_file==null) {
       swal("Warning!", "Please upload document!!", "warning");
       flag=1;
       return false;
    }
    if (flag==0) {
        var formData = new FormData();
        var documentFile = $("#document_file")[0].files[0];
        formData.append("documentName",document_name);
        formData.append("documentType",document_type);
        formData.append("documentFile",documentFile);
        addUpdateDocument(formData);
    }
});

$("#clear_btn").click(function(){
   clearData();
});

document_file.onchange = evt => {
  const [file] = document_file.files
  if (file) {
    document_image.src = URL.createObjectURL(file)
    $("#document_image").show();
  }
}

function clearData() {
    $("#document_id").val("");
    $("#document_type").val("");
    $("#document_name").val("");
    $("#document_file").val("");
    $("#document_file").removeAttr('disabled');
}

function addUpdateDocument(formData) {
    $.ajax({
          type : "POST",
          url : REST_HOST+"/api/documents/addUpdateDocument",
          dataType : "json",
          data: formData,
          enctype: 'multipart/form-data',
          processData: false,
          contentType: false,
      	  success : function(data) {
      		  if(data.result==true){
                  swal({
                       title: "Added!",
                       text: "Document added successfully!",
                       timer: 1500,
                       type: "success",
                       showConfirmButton: false
                  });
                  clearData();
                  window.open("../../admin/pages/viewDocuments.html","_self");
      		  }else{
      			  swal("Error",data.errorMessage, "error");
      		  }
      	  },
      	  error : function(result) {
      		 console.log(result.status);
      	  }
    });
}

function getDocumentTypesDropDown(){
  	$.ajax({
  		type : "GET",
  		contentType: "application/json; charset=utf-8",
  		url : REST_HOST+"/api/documents/getDocumentDropDown",
  		dataType : "json",
  		success : function(data) {
  			var output='';
  			var dataList = data.result;
  			for(var i in dataList){
  				output+='<option value="'+dataList[i].documentType+'">'+dataList[i].documentName+'</option>';
  			}
  			$('#document_type').append(output);
  		},
  		error : function(result){
  			console.log(result.status);
  		}
  	});
  }