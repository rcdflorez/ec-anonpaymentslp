//let baseURL = "https://explorecustomerportal-staging.azurewebsites.net/";
const baseURL = "https://staginglogin.explorecredit.com/";
let paymentMethod = ""; // it may be Bank or Debit
let paymentEndPoint = `${baseURL}API/ProcessAnonymous${paymentMethod}PaymentRequest?`;
let payload = {};
let amount = 0;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const campaign = urlParams.get("utm_campaign");
const loanID = urlParams.get("loanId");

$(".payment-btn").click(function (e) {
  //e.preventDefault();

  amount = paymentAmount.value.replace(/[^0-9.]/g, "");

  if (amount < 5 || amount > 20000) {
    paymentAmount.style.cssText = "border-color: red !important";
    return false;
  } else {
    paymentAmount.style.cssText = "border: 1px solid #dee2e6 !important;";
  }

  paymentMethod = this.getAttribute("paymnt");

  $activeForm = $(this).closest("form").attr("id");

  $(`#${$activeForm} input[type=text]`).each(function () {
    payload[$(this).attr("jsonKey")] = $(this).val();
  });

  payload["LoanId"] = loanID;
  payload["SessionId"] = `${
    payload["Last4SSN"]
  }-${campaign}-${new Date().toJSON()}`;

  console.log(payload);

  $.ajax({
    url: paymentEndPoint,
    type: "POST",
    data: payload,
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (response) {
      console.log(response);

      $(".paymentOptionsNav").html("");
      $(".main-container")
        .html(`<svg class="checkmark mx-auto my-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
      <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
     </svg>
     <h1 class="my-sm-4 heading-title col-md-11 mx-auto mb-5">Thank you for Bank Account submission. We will be in touch with you in the next 2 - 3 business days with the decision on your funds.</h1>
     <a onClick="(function(){moveRight()})();return false;" 
        href="/index" 
        class="btn justify-content-center btn btn-access mb-5 verification-completed"> Continue</a>`);
      console.log(response);
    },
  });
});
