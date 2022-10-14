//let baseURL = "https://explorecustomerportal-staging.azurewebsites.net/";
const baseURL = "https://staginglogin.explorecredit.com/";
let paymentMethod = ""; // it may be Bank or Debit

let payload = {};
let amount = 0;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const campaign = urlParams.get("utm_campaign");
const loanID = urlParams.get("loanId");

function postPayment(target, option) {
  amount = paymentAmount.value.replace(/[^0-9.]/g, "");

  if (amount < 5 || amount > 20000) {
    paymentAmount.style.cssText = "border-color: red !important";
    return false;
  } else {
    paymentAmount.style.cssText = "border: 1px solid #dee2e6 !important;";
  }

  console.log(target);
  console.log(option);

  //paymentMethod = this.getAttribute("paymnt");

  //$activeForm = $(this).closest("form").attr("id");

  $(`#${target} input[type=text]`).each(function () {
    payload[$(this).attr("jsonKey")] = $(this).val();
  });

  let expDate = payload["DebitCardExp"];

  payload["DebitCardExp"] = `${expDate.split("/")[0]}20${
    expDate.split("/")[1]
  }`;

  console.log(payload["DebitCardExp"]);

  payload["LoanId"] = loanID;
  payload["SessionId"] = `${
    payload["Last4SSN"]
  }-${campaign}-${new Date().toJSON()}`;

  let paymentEndPoint = `${baseURL}API/ProcessAnonymous${option}PaymentRequest?`;

  payload["PaymentAmount"] = amount;

  var fd = new FormData();
  Object.keys(payload).map((key) => {
    fd.append(key, payload[key]);
  });

  if (!$("#paymentConsentCheck").is(":checked")) {
    // return false;
  }

  $.ajax({
    url: paymentEndPoint,
    type: "POST",
    data: fd,
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (response) {
      if (
        response.completeSuccess == true &&
        response.customerFound == true &&
        response.paymentMethodValid == true &&
        response.paymentSuccessful == true
      ) {
        localStorage.setItem("paidAmount", amount);
        localStorage.setItem("firstName", payload["CustomerFirstName"]);

        window.location.replace("/thank-you-for-your-payment/");

        console.log("Hi");
      } else return false;
    },
  });
}
