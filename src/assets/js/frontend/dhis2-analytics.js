/* eslint-disable no-undef */
$( document ).ready(function() {
    $('#basic').on("click", function () {
        $('.grid').printThis({
          base: "https://jasonday.github.io/printThis/"
        });
    });
});