function popUpGen(title, desc) {
  if($('#popUp').length == 1) popUp.remove();
  body = document.getElementsByTagName("body")[0];
  popUp = document.createElement("div");
  popUp.id = "popUp";

  popUpTitle = document.createElement("div");
  popUpTitle.innerHTML = title;
  popUpTitle.id = "popUpTitle";

  popUpDesc = document.createElement("div");
  popUpDesc.innerHTML = desc;
  popUpDesc.id = "popUpDesc";

  close = document.createElement("button");
  close.setAttribute("onClick","popUp.remove()");
  close.innerHTML = "Close";

  popUp.appendChild(popUpTitle);
  popUp.appendChild(popUpDesc);
  popUp.appendChild(close);
  
  body.appendChild(popUp);
}

function setResp(q,resp) {
  let qResps = document.getElementsByClassName("resps")[q].getElementsByClassName("resp");
  for (let i = 0; i < qResps.length; i++) {
    if (i == resp) qResps[i].className = "resp respSelect";
    else qResps[i].className = "resp";
  }
}

function parseForm() { 
  let myResps = []; //this has individual response strings
  let myQs = []; //stores questions for particular survey
	let allResps = document.getElementsByClassName("resps");
  let allQs = document.getElementsByClassName("surveyQ");
  var respExists;
  for (let i = 0; i < allResps.length; i++) {
    let qResps = allResps[i].getElementsByClassName("resp");
    myResps.push("");
    for (let j = 0; j < qResps.length; j++) {
      respExists = false;
      if (qResps[j].className == "resp respSelect") {
        myResps[myResps.length-1] = qResps[j].innerHTML;
        respExists = true;
      }
    }
    myQs.push(allQs[i].innerHTML);
  }
  console.log(myQs+"\n"+myResps);
  let avg = 3; //if none are answered, default response
  let respSum = 0;
  let respCt = 0;
  myResps.forEach((resp) => {
    if (resp.length > 0 && !isNaN(resp)) {
      respCt++;
      respSum+=parseInt(resp);
    }
  })
  if (respCt > 0) avg = respSum/respCt;
  avg = parseInt(avg+.5); //rounds to nearest int
  if (avg < 3) {
    popUpGen("Thank you for the feedback!","We're sorry about your experience. Would you like us to contact you?");

    popUpForm = document.createElement("form");
    popUpForm.id = "popUpForm";
    popUpForm.name = "emailForm";

    popUpInput = document.createElement("textarea");
    popUpInput.id = "popUpInput"; //MAKE THE CSS FOR THIS INPUT BOX
    popUpInput.name = "Email";
    popUpInput.className = "surveyBoxes";
    popUpInput.placeholder = "Email or phone number (optional)";

    popUpForm.appendChild(popUpInput);
    popUpDesc.appendChild(popUpForm);
  }
  else if (avg < 5) popUpGen("Thank you for the feedback!","We hope to see you again soon!");
  else {
    popUpGen("Thank you for the feedback!","Please consider leaving a review on <a class='rateLink' href='https://www.yelp.com/writeareview/biz/PDwWsE6XYJPR83HrBSDFIg?return_url=%2Fbiz%2FPDwWsE6XYJPR83HrBSDFIg&review_origin=biz_details_war_button'>yelp</a> or <a class='rateLink' href='https://www.google.com/maps/place/Pablos+Havana+Cafe/@40.1575346,-83.0900587,17z/data=!3m1!4b1!4m5!3m4!1s0x8838ede51e731271:0xf12128eaeb29ae6c!8m2!3d40.1575346!4d-83.08787'>google</a>!");
  }
  close.setAttribute("onClick","submitForm()");
  respDict = {};
  for (let i = 0; i < myQs.length; i++) {
    respDict[myQs[i]] = myResps[i];
  }
}
function submitForm() {
  close.innerHTML = "Processing...";
  surveyData = $.param(respDict) + "&" + $(".surveyBoxes").serialize();
  const docUrl = "https://script.google.com/macros/s/AKfycby64rcb8EK06JUAhQOje6jAi8QPshhitPRGF-wU5SnvENDCNAHVaewzvnBgxMUv0LcI/exec"; //fix this link
    
  $.ajax({
    url: docUrl,
    method: "POST",
    dataType: "json",
    data: surveyData,
    success: function(response) {
      if(response.result == "success") {
        parent.location = "../";
        return true;
      }
      else {
        console.log(response.error);
      }
    },
    error: function() {
      console.log("Error");
    }
  })
}

surveySubmit = document.getElementById("surveySubmit");
surveySubmit.addEventListener("click",parseForm);