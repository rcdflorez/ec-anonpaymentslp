//let baseURL = "https://explorecustomerportal-staging.azurewebsites.net/";
const baseURL = "https://login.explorecredit.com/";
let paymentMethod = ""; // it may be Bank or Debit

let proxy = "https://cors-anywhere.herokuapp.com/";

let payload = {};
let amount = 0;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const campaign = urlParams.get("utm_campaign");
const loanID = urlParams.get("loanId");
let testMode = urlParams.get("test");

function postPayment(target, option) {
  amount = paymentAmount.value.replace(/[^0-9.]/g, "");

  //debugger;

  if (amount < 5 || amount > 20000) {
    paymentAmount.style.cssText = "border-color: red !important";
    $("p.error-1").removeClass("d-none");
    return false;
  } else {
    $("p.error-1").addClass("d-none");
    paymentAmount.style.cssText = "border: 1px solid #dee2e6 !important;";
  }

  $(`#${target} input[type=text]`).each(function () {
    payload[$(this).attr("jsonKey")] = $(this).val();
  });

  if (typeof payload["DebitCardExp"] !== "undefined") {
    let expDate = payload["DebitCardExp"];

    payload["DebitCardExp"] = `${expDate.split("/")[0]}20${
      expDate.split("/")[1]
    }`;
  }

  payload["LoanId"] = loanID;
  payload["SessionId"] = `${
    payload["Last4SSN"]
  }-${campaign}-${new Date().toJSON()}`;
  payload["PaymentAmount"] = amount;

  let paymentEndPoint = `${baseURL}API/ProcessAnonymous${option}PaymentRequest?`;

  var fd = new FormData();
  Object.keys(payload).map((key) => {
    fd.append(key, payload[key]);
  });

  console.log(fd);
  console.log(payload);

  //return false;

  if (!document.querySelector(`#${target}`).checkValidity()) return false;

  if (testMode != true) proxy = "";

  $.ajax({
    url: `${proxy}${paymentEndPoint}`,
    type: "POST",
    data: fd,
    dataType: "json",
    contentType: false,
    processData: false,

    beforeSend: function () {
      $("h5.cta-btn")
        .html(
          'Processing...<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div>'
        )
        .parent()
        .addClass("disabled");
    },

    success: function (response) {
      //debugger;
      console.log(response);
      if (option == "PayPal") {
        $("h5.cta-btn")
          .html(
            ` <span class="paypal-button-title"> Pay now with </span>
            <span class="paypal-logo"> <i>Pay</i><i>Pal</i> </span>`
          )
          .parent()
          .removeClass("disabled");

        if (response.indexOf("paypal.com/checkoutnow?token") > -1) {
          location.href = response;
          return;
        }
      } else {
        $("h5.cta-btn").html(`Make Payment`).parent().removeClass("disabled");
      }

      if (
        response.completeSuccess == true &&
        response.customerFound == true &&
        response.paymentMethodValid == true &&
        response.paymentSuccessful == true
      ) {
        localStorage.setItem("paidAmount", amount);
        localStorage.setItem("firstName", payload["CustomerFirstName"]);

        window.location.replace("/thank-you-for-your-payment/");
      } else {
        console.log(response);
        $("p.error-2").removeClass("d-none");
        return false;
      }
    },
    error: function (response) {
      $("p.error-3").removeClass("d-none");
      console.log(response);
    },
  });
}
