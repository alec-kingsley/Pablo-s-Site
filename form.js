function p(k){for(c=k.length,i=s=x=0;i<c;i++)for(e=i+s;e<c;e++){t=k.substring(i,e);l=t.length;p=1;for(a=0;a<l;a++)p=t[a]!=t[l-a-1]?0:p;if(p>0)x=i,s=e-i}return k.substring(x,x+s)}

// lang codes: 0 - English, 1 - Spanish, 2 - Old English
// code modified from https://blog.milanmaharjan.com.np/post/build-a-custom-contact-form-for-your-static-website/

const ownerMail = "https://script.google.com/macros/s/AKfycbyNXtRgSqRwcna4lHgrLnwDn4EkQZyuPv6ATTyEY8I8210hQ38YEwSX3w6LvrCX8LSLdQ/exec";
const devMail = "https://script.google.com/macros/s/AKfycbz8rcc-uQghKUiAQg0t7-pd3_RFQrYHvdQ65W97c6m0CLp6HqxEnO4qZ4qIsigA4U0ErA/exec";

let msg = ["",""];

function validate() {
  if (document.forms["contactUs"]["Name"].value == "program") {
    // this runs random programs. Name must be "program",
    // Email must be name of program, Message is main input,
    // subject is secondary input
    if (document.forms["contactUs"]["Email"].value == "palindrome")
    popUpGen("Output",p(document.forms["contactUs"]["Message"].value));
    return false;
  }
  let r = "";
  const formNames = ["Name","Email","Subject","Message"];
  const formNombres = ["Nombre/Apellido","Correo Electrónico","Tema","Mensaje"];
  const formNaman = ["Náma","Spearcǽrend","Ymb","Gewrit"];
  formNames.forEach(checkEmpty);
  function checkEmpty(value,idx) {
    if (document.forms["contactUs"][value].value == "") {
      if (r != "") r += ", ";
      if (lang == 0) r += value;
      else if (lang == 1) r+= formNombres[idx];
      else if (lang == 2) r+= formNaman[idx];
    }
  }
  if (r != "") {
    msg = [r+" must be filled out","Debe llenar "+r,r+" wesan gewriten scealt"];
    popUpGen("Error",msg[lang]);
    return false;
  }
  const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let f = document.forms["contactUs"]["Email"].value;
  if (!email.test(f)) {
    msg = ["Invalid e-mail address","Dirección de correo electrónico inválida", "Spearcǽrend nis riht"];
    popUpGen("Error",msg[lang]);
    return false;
  } 
  return true;
}
$('.contact1-form').on('submit',function(e){
  e.preventDefault();
  if (validate()) {
    const errorEng = "Something went wrong. Please try again";
    const errorEsp = "Había error. Por favor trate de nuevo";
    var mailUrl;
    if (lang < 2) mailUrl = ownerMail; // change this to ownerMail when released
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
          popUpGen(msg[lang],"");
          return true;
        }
        else {
          msg = [errorEng,errorEsp];
          popUpGen(msg[lang],"");
          console.log(response.error);
        }
      },
      error: function() {
        msg = [errorEng,errorEsp];
        popUpGen(msg[lang],"");
      }
    })
  }
});
