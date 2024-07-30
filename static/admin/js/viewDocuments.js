$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        getAllDocuments();
    }
});

function getAllDocuments() {
   var table = $('#documentTableId').DataTable();
   table.clear().draw();
   table.destroy();
   $.ajax({
         type : "GET",
         contentType: "application/json; charset=utf-8",
         url : REST_HOST+"/api/documents/getAllDocuments",
         dataType : "json",
         success : function(data) {
             if(data.result!=null){
                 var dataList=data.result;
                 for(var i in dataList){
                     table.row.add( [
                          dataList[i].srNo,
                          dataList[i].documentName,
                          dataList[i].documentType,
                          dataList[i].uploadedDate,
                          '<button class="btn btn-primary btn-xs" type="button" data-toggle="modal" data-target="#document-modal" onclick="viewFile('+dataList[i].documentId+')"><b>View</b></button>&nbsp;&nbsp;'+
                          '<button class="btn btn-primary btn-xs" type="button" onclick="downloadFile('+dataList[i].documentId+')"><b>Download</b></button>'
                     ] ).draw(false);
                 }
             }else{
                swal("Error",data.errorMessage, "error");
             }
         },
         error : function(result) {
             console.log(result.status);
         }
    });
}

function viewFile(documentId) {
    var formData = {entityId:documentId};
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/documents/getDocument",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result!=null){
                $('#document_image').attr('src', "data:image/jpg;base64,"+data.result);
                $("#document_image").show();
            }else {
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}

function downloadFile(documentId) {
   var formData = {entityId:documentId};
   $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/documents/downloadDocument",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result!=null){
                 var link = document.createElement('a');
                 link.href = "data:image/jpg;base64,"+data.result.documentFile;
                 link.download = data.result.documentName+'.jpg';
                 link.dispatchEvent(new MouseEvent('click'));
            }else {
                 swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
   });
}