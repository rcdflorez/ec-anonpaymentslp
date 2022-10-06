//let baseURL = "https://explorecustomerportal-staging.azurewebsites.net/";
let baseURL = "https://staginglogin.explorecredit.com/";
let paymentMethod = ""; // it may be Bank or Debit
let paymentEndPoint = `${baseURL}API/ProcessAnonymous${paymentMethod}PaymentRequest?`;
let payload = {};

$(".payment-btn").click(function (e) {
  e.preventDefault();

  paymentMethod = this.getAttribute("paymnt");

  $activeForm = $(this).closest("form").attr("id");

  $(`#${$activeForm} input[type=text]`).each(function () {
    payload[$(this).attr("jsonKey")] = $(this).val();
  });

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
    },
  });
});
