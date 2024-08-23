var dataList;
$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        getEmployeeDropDown();
        setEmployeeDropDown();
        var employeeId = null;
        getAllTechnostackPages(employeeId);
    }
});

/*$("#add_button").click(function(){
    setEmployeeDropDown();
});*/

function setEmployeeDropDown() {
    var output='';
    for(var i in dataList){
        output+='<option value="'+dataList[i].entityId+'">'+dataList[i].entityValue+'</option>';
    }
    $('#employee_id').append(output);
}

$('#emp_id').on('change', function (e) {
    var valueSelected = this.value;
    getAllTechnostackPages(valueSelected);
});

$("#btn_txt").click(function(){
    var tech_id = $("#tach_Id").val();
    var employee_id = $("#employee_id").val();
    var stack_name = $("#stack_name").val();
    var flag = 0;
    if (employee_id=="" || employee_id==null || employee_id=="Select") {
        swal("Warning!", "Please select valid employee!", "warning");
        flag=1;
        return false;
    }
    if (stack_name=="" || stack_name==null) {
        swal("Warning!", "Please enter stack name!", "warning");
        flag=1;
        return false;
    }
    if (skillList.length==0) {
        swal("Warning!", "Please add at least one techno stack in the list!", "warning");
        flag=1;
        return false;
    }
    if (flag==0) {
        var formData = {
            id:tech_id,
            employeeId:employee_id,
            stackName:stack_name,
            skillList:skillList
        };
        insertUpdateEmployeeSkills(formData);
    }
});

$("#btn_clean").click(function(){
    clearData();
});

function clearData() {
    $("#tach_Id").val("");
    $("#employee_id").val("");
    $("#stack_name").val("");
    skillList=[];
    arrayList=[];
}

function insertUpdateEmployeeSkills(formData) {
    $.ajax({
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/technoStackDetails/insertUpdateEmployeeSkills",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
            if(data.result==true){
                if (formData.id==null){
                    swal({
                        title: "Added!",
                        text: "TechnoStack details added successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                } else {
                    swal({
                        title: "Updated!",
                        text: "TechnoStack details updated successfully!",
                        timer: 1500,
                        type: "success",
                        showConfirmButton: false
                    });
                }
                clearData();
                getAllTechnostackPages();
                $("#technoStackModal").modal("hide");
            }else{
                swal("Error",data.errorMessage, "error");
            }
        },
        error : function(result) {
            console.log(result.status);
        }
    });
}

function getEmployeeDropDown() {
    $.ajax({
        type : "GET",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/employeeDetails/getEmployeeDropDown",
        dataType : "json",
        success : function(data) {
            var output='';
            dataList = data.result;
            for(var i in dataList){
                output+='<option value="'+dataList[i].entityId+'">'+dataList[i].entityValue+'</option>';
            }
            $('#emp_id').append(output);
        },
        error : function(result){
            console.log(result.status);
        }
    });
}

function getAllTechnostackPages(employeeId){
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
                         entityId:employeeId,
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
        $('#technoStackDetailsTableId').dataTable({
            "sAjaxSource" : REST_HOST+"/api/technoStackDetails/getEmployeeSkills",
            "sAjaxDataProp" : 'result.content',
            "aoColumns" : [ {
                mDataProp : 'srNo',
                "bSortable": false
            }, {
                mDataProp : 'employeeName',
                "bSortable": false
            },{
                mDataProp : 'stackName',
                "bSortable": false
            }, {
                mDataProp : 'updatedDate',
                "bSortable": false
            }, {
                mDataProp : function(data){
                      return '<button class="btn bg-primary btn-xs" type="button" data-toggle="modal" data-target="#technoStackModal" onclick="getTechnoStackById('+data.stackId+')"><b>View</b></button>';
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

function getTechnoStackById(stackId) {
    var formData = {entityId:stackId};
    $.ajax({  
        type : "POST",
        contentType: "application/json; charset=utf-8",
        url : REST_HOST+"/api/technoStackDetails/getById",
        dataType : "json",
        data : JSON.stringify(formData),
        success : function(data) {
           if(data.result!=null){
                //setEmployeeDropDown();
                $("#tach_Id").val(data.result.id);
                $("#employee_id").val(data.result.employeeId);
                $("#stack_name").val(data.result.stackName);
                populateTable(data.result.skillList,false);
                $("#technoStackModal").modal("show");
           }else{
                swal("Error",data.errorMessage, "error");
           }
        },
        error : function(result) {
           console.log(result.status);
        }
    });
}
