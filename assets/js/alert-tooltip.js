$(document).ready(function () {
    //codigo de funcion se ejecuta cuando pagina este cargada
   
    // Tooltip initialization
    
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    
        // Tooltip initialization
        $('[data-bs-toggle="tooltip"]').tooltip();
      
        // Evento click toolpit en grill e imagen girando
         $("#sendEmail").click(function () {
            alert("The email was sent correctly......");
        });
        // Evento click ultimo formulario contact
        $("#addFavorites").click(function () {
            alert("It was added to favorites successfully......");
        });          
  
    });
  