$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
        getCompanyDropDown();
        var companyId = null;
        getCompanyDocumentsPages(companyId);
    }
});

$('#company_id').on('change', function (e) {
    var valueSelected = this.value;
    getCompanyDocumentsPages(valueSelected);
});

function getCompanyDocumentsPages(companyId) {
    $(function() {
        var datatable2Rest = function(sSource, aoData, fnCallback) {
            //extract name/value pairs into a simpler map for use later
            var paramMap = {};
            for ( var i = 0; i < aoData.length; i++) {
                paramMap[aoData[i].name] = aoData[i].value;
            }
            //page calculations
            var pageSize = paramMap.iDisplayLength;
            var start = paramMap.iDisplayStart;
            var pageNum = (start == 0) ? 1 : (start / pageSize) + 1; // pageNum is 1 based

            // extract sort information
            var sortCol = paramMap.iSortCol_0;
            var sortDir = paramMap.sSortDir_0;
            var sortName = paramMap['mDataProp_' + sortCol];
            var formData={
                         entityId:companyId,
                         pageSize:pageSize,
                         pageNumber:pageNum,
                         sortParam:sortName,
                         sortDir:sortDir,
            };
            var url = sSource;
            $.ajax({
                type : "POST",
                contentType: "application/json; charset=utf-8",
                url : url,
                dataType : "json",
                data : JSON.stringify(formData),
                success : function(data) {
                    data.iTotalRecords = data.result.totalElements;
                    data.iTotalDisplayRecords = data.result.totalElements;
                    fnCallback(data);
                },
                error : function(result) {
                    console.log(result.status);
                }
            });
        };
        $('#companyDocumentTableId').dataTable({
            "sAjaxSource" : REST_HOST+"/api/companyDocuments/getCompanyAllDocuments",
            "sAjaxDataProp" : 'result.content',
            "aoColumns" : [ {
                mDataProp : 'srNo',
                "bSortable": false
            }, {
                mDataProp : 'companyName',
                "bSortable": false
            },{
                mDataProp : 'documentType',
                "bSortable": false
            },{
                mDataProp : 'uploadedDate',
                "bSortable": false
            }, {
                mDataProp : function(data){
                      return '<button class="btn bg-primary btn-xs" type="button" onclick="downloadFile('+data.documentId+')"><b>Download</b></button>&nbsp;&nbsp;'+
                             '<button class="btn bg-primary btn-xs" type="button" onclick="deleteById('+data.documentId+')"><b>Delete</b></button>';
                },
                "bSortable": false
            }],
            "bServerSide" : true,
            "destroy": true,
            "aaSorting": [[ 0, "desc" ]],
            "fnServerData" : datatable2Rest
        });

    });
}

function documentFile(documentId) {
    var formData = {"entityId":documentId};
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/companyDocuments/downloadDocumentFile",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result!=null){
                var contentType = data.result.contentType;
                var documentName = data.result.documentType;
                if (contentType=="application/pdf") {
                    var link = document.createElement('a');
                    link.href = "data:application/pdf;base64,"+data.result.documentFile;
                    link.download = documentName+'.pdf';
                    link.dispatchEvent(new MouseEvent('click'));
                } else if (contentType=="image/jpg") {
                    var link = document.createElement('a');
                    link.href = "data:image/jpg;base64,"+data.result.documentFile;
                    link.download = documentName+'.jpg';
                    link.dispatchEvent(new MouseEvent('click'));
                } else if (contentType=="image/jpeg"){
                    var link = document.createElement('a');
                    link.href = "data:image/jpg;base64,"+data.result.documentFile;
                    link.download = documentName+'.jpeg';
                    link.dispatchEvent(new MouseEvent('click'));
                } else {
                    swal("Error","Invalid ContentType!!", "error");
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

function deleteById(documentId) {
    var formData = {"entityId":documentId};
    swal({
        title: "Are you sure?",
        text: "Once you confirm Record will be deleted",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm){
        if (isConfirm) {
            $.ajax({
                type : "POST",
                contentType: "application/json; charset=utf-8",
                url : REST_HOST+"/api/companyDocuments/deleteDocumentById",
                dataType : "json",
                data : JSON.stringify(formData),
                success : function(data) {
                    if(data.result==true){
                        swal({
                            title: "Deleted!",
                            text: "Company document deleted successfully!",
                            timer: 1500,
                            type: "success",
                            showConfirmButton: false
                        });
                      }else{
                          swal("Error",data.errorMessage, "error");
                      }
                },
                error : function(result) {
                    console.log(result.status);
                }
            });
        } else {
            swal("Cancelled", "Record is not updated it's safe", "error");
        }
    });
}

function getCompanyDropDown() {
    $.ajax({
        type : "GET",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/companyDetails/getCompanyDropDown",
        dataType : "json",
        success : function(data) {
            var output='';
            var dataList = data.result;
            for(var i in dataList){
                output+='<option value="'+dataList[i].entityId+'">'+dataList[i].entityValue+'</option>';
            }
            $('#company_id').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}