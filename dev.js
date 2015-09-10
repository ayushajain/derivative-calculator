var finalDerivative = "";
var tempDerivative = "";

//get user click
$(".enter").click(main);
$(document).keypress(function(e) {
    if (e.which == 13) {
        main();
    }
});


//get inputted user function
function main() {
    finalDerivative = "";
    tempDerivative = "";

    var funcInput = $(".input").val();

    var deriv = new Derivative(funcInput);
    deriv.cleanFunction();
    deriv.findTerms(funcInput);
    //calculateDerivative(funcInput);

    for (var i in deriv.functionTerms) {
        //console.log(funcTerms[i]);
        console.log(deriv.determineWhichRule(deriv.functionTerms[i]));
    }

    console.log("input: " + deriv.function);

    //$(".answer").text(tempDerivative);
    $(".input").val("");
}
