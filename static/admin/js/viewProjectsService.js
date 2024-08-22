function clearItemData() {
    $("#project_id").val("");
    $("#tech_name").val("");
}

$("#claerI_btn").click(function(){
    clearItemData();
});

$("#tech_btn").click(function(){
     var project_id = $("#project_id").val();
     var tech_name = $("#tech_name").val();
     var flag = 0;
     if (project_id=="" || project_id==null){
        swal("Warning!", "Please provide project id!", "warning");
        flag=1;
        return false;
     }
     if (tech_name=="" || tech_name==null) {
        swal("Warning!", "Please enter tech name!", "warning");
        flag=1;
        return false;
     }
     if (flag==0) {
        var formData = {projectId:project_id,technology:tech_name};
        addUpdateProjectTechnologies(formData);
     }
});

function addUpdateProjectTechnologies(formData) {
    var projectId = formData.projectId;
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/projectDetails/addUpdateProjectTechnologies",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result==true){
                swal({
                    title: "Added!",
                    text: "Project technology added successfully!",
                    timer: 1500,
                    type: "success",
                    showConfirmButton: false
                });
                viewTechnologies(projectId);
                clearItemData();
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}

function viewTechnologies(projectId){
    $("#project_id").val(projectId);
    var formData = {entityId:projectId};
    var table = $('#technologyTableId').DataTable();
    table.clear().draw();
    table.destroy();
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/projectDetails/getProjectTechnologies",
        dataType : "json",
        data: JSON.stringify(formData),
        success : function(data) {
            if(data.result!=null){
                var dataList=data.result;
                for(var i in dataList){
                    table.row.add( [
                        dataList[i].srNo,
                        dataList[i].techName
                    ] ).draw(false);
                }
                $("#technologyModal").modal("show");
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
             console.log(result.status);
        }
    });
}