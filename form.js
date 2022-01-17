function p(k){for(c=k.length,i=s=x=0;i<c;i++)for(e=i+s;e<c;e++){t=k.substring(i,e);l=t.length;p=1;for(a=0;a<l;a++)p=t[a]!=t[l-a-1]?0:p;if(p>0)x=i,s=e-i}alert(k.substring(x,x+s))}

// lang codes: 0 - English, 1 - Spanish, 2 - Old English
// code modified from https://blog.milanmaharjan.com.np/post/build-a-custom-contact-form-for-your-static-website/

const ownerMail = "https://script.google.com/macros/s/AKfycbwogcXzmjeTdCcTlIZbLRuve53-2XkWHe7swnuLrCb3CsooappEjKWuyuMXgLMhb0Zt6A/exec";
const devMail = "https://script.google.com/macros/s/AKfycbwPf_e1nlQLaefZVSsp3-ZZ-Soqkx-QFOIH4Irnnq_yTZknfkvjrRixevSYMBFCIYfBjw/exec";

let msg = ["",""];

function validate() {
  if (document.forms["contactUs"]["Name"].value == "program") {
    // this runs random programs. Name must be "program",
    // Email must be name of program, Message is main input,
    // subject is secondary input
    if (document.forms["contactUs"]["Email"].value == "palindrome")
    p(document.forms["contactUs"]["Message"].value);
    return false;
  }
  let r = "";
  const formNames = ["Name","Email","Subject","Message"];
  const formNombres = ["Nombre/Apellido","Correo Electrónico","Tema","Mensaje"];
  formNames.forEach(checkEmpty);
  function checkEmpty(value,idx) {
    if (document.forms["contactUs"][value].value == "") {
      if (r != "") r += ", ";
      if (lang == 0) r += value;
      else if (lang == 1) r+= formNombres[idx];
    }
  }
  if (r != "") {
    msg = [r+" must be filled out","Debe llenar "+r];
    alert(msg[lang]);
    return false;
  }
  const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let f = document.forms["contactUs"]["Email"].value;
  if (!email.test(f)) {
    msg = ["Invalid e-mail address.","Dirección de correo electrónico inválida"];
    alert(msg[lang]);
    return false;
  } 
  return true;
}
$('.contact1-form').on('submit',function(e){
  if (validate()) {
    e.preventDefault();
    const errorEng = "Something went wrong. Please try again";
    const errorEsp = "Había error. Por favor trate de nuevo";
    var mailUrl;
    if (lang != 2) mailUrl = ownerMail; // change this to ownerMail when released
    else mailUrl = devMail;
    $.ajax({
      url: mailUrl,
      method: "POST",
      dataType: "json",
      data: $(".contact1-form").serialize(),
      success: function(response) {
        if(response.result == "success") {
          $('.contact1-form')[0].reset();
          msg = ["Thank you for contacting us.","Gracias por contactarnos."];
          alert(msg[lang]);
          return true;
        }
        else {
          msg = [errorEng,errorEsp];
          alert(msg[lang]);
          console.log(response.error);
        }
      },
      error: function() {
        msg = [errorEng,errorEsp];
        alert(msg[lang]);
      }
    })
  }
});
