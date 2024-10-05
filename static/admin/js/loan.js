$(document).ready(function() {
    if (localStorage.getItem("fullName")==null && localStorage.getItem("userId")==null){
        window.open("../../login.html","_self");
    } else {
        setDateConfiguration();
        getLoanTypesDropDown();
        getPaymentModeDropDown();
        getAllLoansPages();
    }
});

function setDateConfiguration() {
    $('#start_date_txt').datepicker({
        format: 'dd MM yyyy',
        endDate: '0d'
    });
    $('#end_date_txt').datepicker({
         format: 'dd MM yyyy',
         startDate: '0d'
    });
    $('#emi_date_txt').datepicker({
        format: 'dd MM yyyy'
    });
}

function setLoanId(loanId){
    alert("LoanId:"+loanId);
    $("#loan_id").val(loanId);
    $("#emiModal").modal("show");
}

$("#save_btn").click(function(){
    var loan_id = $("#loan_id").val();
    var loan_type = $("#loan_type").val();
    var bank_name = $("#bank_name").val();
    var loan_amount = $("#loan_amount").val();
    var start_date = $("#start_date").val();
    var end_date = $("#end_date").val();
    var flag = 0;
    if (loan_type=="" || loan_type==null || loan_type=="Select") {
        swal("Warning!", "Please select valid employee!", "warning");
        flag=1;
        return false;
    }
    if (bank_name=="" || bank_name==null) {
        swal("Warning!", "Please enter bank name!", "warning");
        flag=1;
        return false;
    }
    if (loan_amount=="" || loan_amount==null){
        swal("Warning!", "Please enter loan amount!", "warning");
        flag=1;
        return false;
    }
    if (start_date=="" || start_date==null) {
        swal("Warning!", "Please enter laon start date!", "warning");
        flag=1;
        return false;
    }
    if (end_date=="" || end_date==null) {
        swal("Warning!", "Please enter laon end date!", "warning");
        flag=1;
        return false;
    }
    if (loan_id=="") {
        loan_id=null;
    }
    if (flag==0) {
        var formData = {
            id:loan_id,
            bankName:bank_name,
            loanType:loan_type,
            loanAmount:loan_amount,
            startDate:start_date,
            endDate:end_date
        };
        insertUpdateLoanDetails(formData);
    }
});

$("#emi_btn").click(function(){
    var loan_id = $("#loan_id").val();
    var emi_id = $("#emi_id").val();
    var emi_amount = $("#emi_amount").val();
    var payment_mode = $("#payment_mode").val();
    var emi_date = $("#emi_date").val();
    var flag = 0;
    if (emi_amount=="" || emi_amount==null) {
        swal("Warning!", "Please enter emi amount!", "warning");
        flag=1;
        return false;
    }
    if (payment_mode=="" || payment_mode==null || payment_mode=="Select") {
        swal("Warning!", "Please select valid payment mode!", "warning");
        flag=1;
        return false;
    }
    if (loan_id=="") {
        loan_id=null;
    }
    if (emi_id==""){
        emi_id=null;
    }
    if (flag==0) {
        var formData = {
            loanId:loan_id,
            emiId:emi_id,
            emiAmount:emi_amount,
            paymentMode:payment_mode,
            emiDate:emi_date
        };
        insertUpdateEMIDetails(formData);
    }
});

$("#closeId").click(function(){
    clearLoanData();
});

$("#claerI_btn").click(function(){
    cleatEMIData();
});

function clearLoanData() {
    $("#loan_id").val("");
    $("#loan_type").val("");
    $("#bank_name").val("");
    $("#loan_amount").val("");
    $("#start_date").val("");
    $("#end_date").val("");
}

function cleatEMIData(){
    $("#loan_id").val("");
    $("#emi_id").val("");
    $("#emi_amount").val("");
    $("#payment_mode").val("");
    $("#emi_date").val("");
}