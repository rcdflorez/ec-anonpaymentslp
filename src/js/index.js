const prettyDollarConfig = {
  currency: "$",
  position: "before",
  spaced: false,
  thousandsDelimiter: ",",
  decimalDelimiter: ".",
};

const paymentAmount = document.getElementById("paymentAmount");

function validatePaymentAmount() {
  let formatedValue = paymentAmount.value.replace(/[^0-9.]/g, "");
  console.log(formatedValue);
  paymentAmount.value = formatedValue;
  if (formatedValue.length >= 1) {
    paymentAmount.value = prettyMoney(prettyDollarConfig, formatedValue);
  }
}
function delay(callback, ms) {
  var timer = 0;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}

$("#paymentAmount").keyup(
  delay(function (e) {
    validatePaymentAmount();
    amount = paymentAmount.value.replace(/[^0-9.]/g, "");

    if (amount < 5 || amount > 20000) {
      $("p.error-1").removeClass("d-none");
      paymentAmount.style.cssText = "border-color: red !important";
      return false;
    } else {
      $("p.error-1").addClass("d-none");
      paymentAmount.style.cssText = "border: 1px solid #dee2e6 !important;";
    }
  }, 500)
);

(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        $("p.error").addClass("d-none");
        if (!form.checkValidity()) {
          $("p.error-1").removeClass("d-none");
        }
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");

        if (!$(this).find(".paymentConsentCheck").is(":checked")) return false;

        postPayment(
          $(this).attr("id"),
          $(this).find(".payment-btn").attr("paymnt")
        );
      },
      false
    );
  });
})();

let formMonth = 0;
let formYear = 0;

function formatCCExpDate(e) {
  var inputChar = String.fromCharCode(e.keyCode);
  var code = e.keyCode;
  var allowedKeys = [8];
  if (allowedKeys.indexOf(code) !== -1) {
    return;
  }

  e.target.value = e.target.value
    .replace(
      /^([1-9]\/|[2-9])$/g,
      "0$1/" // 3 > 03/
    )
    .replace(
      /^(0[1-9]|1[0-2])$/g,
      "$1/" // 11 > 11/
    )
    .replace(
      /^([0-1])([3-9])$/g,
      "0$1/$2" // 13 > 01/3
    )
    .replace(
      /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
      "$1/$2" // 141 > 01/41
    )
    .replace(
      /^([0]+)\/|[0]+$/g,
      "0" // 0/ > 0 and 00 > 0
    )
    .replace(
      /[^\d\/]|^[\/]*$/g,
      "" // To allow only digits and `/`
    )
    .replace(
      /\/\//g,
      "/" // Prevent entering more than 1 `/`
    );

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = parseInt(
    new Date().getFullYear().toString().substr(-2),
    10
  );

  if (e.target.value != "") {
    formMonth = parseInt(e.target.value.split("/")[0], 10);
    formYear = parseInt(e.target.value.split("/")[1], 10);
  }

  console.log(currentMonth);
  console.log(currentYear);
  console.log(formMonth);
  console.log(formYear);

  if (
    formYear > currentYear ||
    (formYear == currentYear && formMonth >= currentMonth)
  ) {
    e.target.setCustomValidity("");
  } else {
    e.target.setCustomValidity("Invalid");
  }
}

$("ul.paymentOptionsNav a").on("click", function () {
  let nextPO = $(this).data("po");
  $("div.po-content").addClass("d-none");

  $(`div.${nextPO}-PO`).removeClass("d-none");

  $("ul.paymentOptionsNav li").removeClass("active-nav");
  $(this).closest("li").addClass("active-nav");
});

$("#routing_number").keyup(function () {
  if ($(this).val().length <= 5) return;

  validateRoutingNumber($(this).val());
});

function validateRoutingNumber(val) {
  var url =
    "https://www.routingnumbers.info/api/data.json?rn=" +
    $("#routing_number").val();
  if (val.length < 9) {
    $("#routing_number").addClass("is-invalid");
    $("#routing_number").removeClass("is-valid");
    return;
  }

  console.log(val.length);

  $.getJSON(url).done(function (json) {
    console.log(json);
    if (json.code == 200) {
      $("#bank_name").val(json.customer_name);

      $("#routing_number").removeClass("is-invalid");
      $("#routing_number").addClass("is-valid");
      return true;
    } else {
      $("#routing_number").addClass("is-invalid");

      return false;
    }
  });
}
