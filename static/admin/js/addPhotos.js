$(document).ready(function(){

});

$("#multiple_images").on("change", function(){
         var files = $(this)[0].files;
         $("#outerDiv").empty();
         if(files.length > 0){
             var outHtml ="";
             for(var i = 0; i < files.length; i++){
                 outHtml+="<div class='row'>";
                 var reader = new FileReader();
                 reader.onload = function(e){
                     outHtml+="<div class='col-md-4'>"+
                              "<img src='" + e.target.result+"' class='img-thumbnail' alt='Cinque Terre' width='304' height='236'><br>"+
                              "</div>";
                     $('#outerDiv').html(outHtml);
                 };
                 reader.readAsDataURL(files[i]);
                 outHtml+='</div>';
             }
         }
      });
