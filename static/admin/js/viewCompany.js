$(document).ready(function(){
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
          window.open("../../login.html","_self");
    } else {
          setAllConfiguration();
          getDocumentTypeDropDown();
          getAllCompaniesPages();
    }
});

function setAllConfiguration(){
    $('#start_date_txt').datepicker({
        format: 'dd MM yyyy'
    });
    $('#end_date_txt').datepicker({
         format: 'dd MM yyyy'
    });
}

$("#save_btn").click(function(){
    var companyid = $("#company_id").val();
    var companyname = $("#company_name").val();
    var companyaddress = $("#company_address").val();
    var companylogo = $("#logo_txt").val();
    var startdate = $('#start_date').val();
    var enddate=$('#end_date').val();
    var flag = 0;
    if (companyname=="") {
        swal("Warning!", "Please enter company name!", "warning");
        flag=1;
        return false;
    }
    if (companyaddress=="") {
        swal("Warning!", "Please enter company address!", "warning");
        flag=1;
        return false;
    }
    if (startdate=="") {
        swal("Warning!", "Please select start date!", "warning");
        flag=1;
        return false;
    }
    if (companylogo=="") {
        swal("Warning!", "Please upload company logo!", "warning");
        flag=1;
        return false;
    }
    if (flag==0) {
        var formData = new FormData();
        var companyLogo = $("#logo_txt")[0].files[0];
        if (companyid!="" && companyid!=null) {
            formData.append("id",companyid);
        }
        formData.append("companyName",companyname);
        formData.append("companyAddress",companyaddress);
        formData.append("companyLogo",companyLogo);
        formData.append("startDate",startdate);
        formData.append("endDate",enddate);
        addUpdateCompanyDetails(formData);
    }
});

$("#clear_btn").click(function(){
    clearCompanyData();
    $("#companyModal").modal("hide");
 });

 logo_txt.onchange = evt => {
    const [file] = logo_txt.files
    if (file) {
        logo_image.src = URL.createObjectURL(file)
      $("#logo_image").show();
    }
}
$("#add_button").click(function(){
    clearCompanyData();
});

function clearCompanyData(){
    $("#company_id").val("");
    $("#company_name").val("");
    $("#company_address").val("");
    $("#logo_txt").val("");
    $('#start_date').val("");
    $('#end_date').val("");
    $("#logo_txt").removeAttr('disabled');
    $('#logo_image').attr('src', "data:image/jpg;base64,"+" ");
}

function addUpdateCompanyDetails(formData){
    $.ajax({
        type : "POST",
        url : REST_HOST+"/api/companyDetails/addUpdate",
        dataType : "json",
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
          success : function(data) {
              if(data.result==true){
                  if (formData.id==null) {
                        swal({
                            title: "Added!",
                            text: "Company details added successfully!",
                            timer: 1500,
                            type: "success",
                            showConfirmButton: false
                        });
                  } else {
                        swal({
                            title: "Updated!",
                            text: "Company details updated successfully!",
                            timer: 1500,
                            type: "success",
                            showConfirmButton: false
                        });
                  }
                  clearCompanyData();
                  $("#companyModal").modal("hide");
                  getAllCompaniesPages();
              }else{
                  swal("Error",data.errorMessage, "error");
              }
          },
          error : function(result) {
             console.log(result.status);
          }
    });
}

function getById(companyId) {
    var formData = {"entityId":companyId};
    $.ajax({  
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/companyDetails/getById",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
           if(data.result!=null){
                $("#company_id").val(data.result.id);
                $("#company_name").val(data.result.companyName);
                $("#company_address").val(data.result.companyAddress);
                $('#logo_image').attr('src', "data:image/jpg;base64,"+data.result.companyLogo);
                $("#logo_image").show();
                $('#start_date').val(data.result.startDate);
                if (data.result.endDate!=null) {
                   $('#end_date').val(data.result.endDate);
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

function getAllCompaniesPages() {
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
        $('#companyDetailsTableId').dataTable({
            "sAjaxSource" : REST_HOST+"/api/companyDetails/getAllCompanies",
            "sAjaxDataProp" : 'result.content',
            "aoColumns" : [ {
                mDataProp : 'srNo',
                "bSortable": false
            }, {
                mDataProp : 'companyName',
                "bSortable": false
            },{
                mDataProp : 'startDate',
                "bSortable": false
            },{
                mDataProp : 'endDate',
                "bSortable": false
            }, {
                mDataProp : function(data){
                      return '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#companyModal" onclick="getById('+data.companyId+')"><b>View</b></button>&nbsp;&nbsp;'+
                             '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#documentModal" onclick="getCompanyId('+data.companyId+')"><b>Add Document</b></button>';
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