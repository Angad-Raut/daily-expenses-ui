function getCompanyId(companyId){
    $("#company_id").val(companyId);
}

$("#btn_txt").click(function(){
     var companyid = $("#company_id").val();
     var documenttype = $("#document_type").val();
     var documentfile = $("#document_txt").val();
     var flag=0;
     if (companyid=="") {
        swal("Warning!", "Company id cannot be null!", "warning");
        flag=1;
        return false;
     }
     if (documenttype=="") {
        swal("Warning!", "Please select document type!", "warning");
        flag=1;
        return false;
    }
    if (documentfile=="") {
        swal("Warning!", "Please upload document!", "warning");
        flag=1;
        return false;
    }
    if (flag==0) {
        var formData = new FormData();
        var documentFile = $("#document_txt")[0].files[0];
        formData.append("companyId",companyid);
        formData.append("documentType",documenttype);
        formData.append("documentFile",documentFile);
        addCompanyDocument(formData);
    }
});

$("#btn_clean").click(function(){
    clearData();
    $("#documentModal").modal("hide");
});

document_txt.onchange = evt => {
    const [file] = document_txt.files
    if (file) {
        document_image.src = URL.createObjectURL(file)
      $("#document_image").show();
    }
}

function clearData() {
    $("#company_id").val("");
    $("#document_type").val("");
    $("#document_txt").val("");
    $("#document_txt").removeAttr('disabled');
}

function addCompanyDocument(formData) {
    $.ajax({
        type : "POST",
        url : REST_HOST+"/api/companyDetails/addDocumentByCompanyId",
        dataType : "json",
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
          success : function(data) {
              if(data.result==true){
                  if (formData.companyId!=null) {
                        swal({
                            title: "Uploaded!",
                            text: "Company document uploaded successfully!",
                            timer: 1500,
                            type: "success",
                            showConfirmButton: false
                        });
                  } else {
                        swal("Error","Error Occured!!", "error");
                  }
                  clearData();
                  $("#documentModal").modal("hide");
              }else{
                  swal("Error",data.errorMessage, "error");
              }
          },
          error : function(result) {
             console.log(result.status);
          }
    });
}