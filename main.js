var finalDerivative = "";
var tempDerivative = "";
// var input = "(x^3 + 5x)^2 + 10x";
// cleanFunction(input);
// var individualTerms = findTerm(input);


//chainRule("((x^5 + x^1)^1+5x^1)^3");
//console.log(finalDerivative);


function cleanFunction(func){
    var cleanedFunc = "";
    for(var i = 0; i < func.length; i++){

        if(func[i] == "x"  && i != func.length - 1 && !isNaN(func[i - 1])){
            if(i != 0){
                cleanedFunc += "*";
            }else{
                cleanedTerm.insert(0, "*");
            }
        }

        if(func[i] != " "){
            cleanedFunc += func[i];
        }

        if((func[i] == "x" || func[i] == ")") && i != func.length && func[i+1] != "^" ){
            cleanedFunc += "^1";
        }
    }
    var checkingBrackets = 0;
    for(i in cleanedFunc){
        if(cleanedFunc[i] == "("){
            checkingBrackets++;
        }else if(cleanedFunc[i] == ")"){
            checkingBrackets--;
        }

        if(checkingBrackets == 1){
            if(i >= 1 && cleanedFunc[i-1] != ""){

            }else if(i == 0){
                cleanedFunc.insert(0, "1*")
            }
        }
    }

    console.log(cleanedFunc);
    return cleanedFunc;
}

/*
 * Each term (regardless of position) must have a power,
 * even if it is "1". [do: (x^1) | don't do: (x)]
*/
function chainRule(term){
    var powerIndex = term.lastIndexOf("^") + 1;
    var coeffIndex;
    if(term.indexOf("(") == 1 || term.indexOf("x") == 1){
        coeffIndex = -1
    }else{
        coeffIndex = term.indexOf("*");
    }

    var base = term.substring(coeffIndex + 1, powerIndex - 1);
    var power = term.substring(powerIndex, term.length);
    var coefficient = term.substring(0, coeffIndex);
    if(coeffIndex == -1){
        coefficient = 1
    }
    var derivative = "";


    derivative += (coefficient*power) + "*" + base + "^" + (power-1);
    if(base[0] == "("){
        var terms = findTerm(base.substring(1, base.length - 1), false);
        var innerDerivative = "(";
        for(i in terms){
            var innerDerivativeTerms = chainRule(terms[i]);
            if(i != terms.length - 1){
                innerDerivative += innerDerivativeTerms + "+";
            }else{
                innerDerivative += innerDerivativeTerms;
            }
        }
        innerDerivative += ")"
        finalDerivative = (derivative + "*" + innerDerivative);
    }else{
        finalDerivative = derivative;
    }

    //check if constant
    if(base == "" || !isNaN(base)){
        derivative = "";
        finalDerivative = "0";
    }

    return derivative;


}

function findTerm(func, clean){
    var term = "";
    var terms = [];
    var currentlyInsideTerm = false;
    for(var i = 0; i <= func.length; i++){
        if(func[i] == "("){
            currentlyInsideTerm = true;
        }else if(func[i] == ")" && currentlyInsideTerm){
            currentlyInsideTerm = false;
        }else if((func[i] == "+" || func[i] == "-") && !currentlyInsideTerm){
            if(clean){
                term = cleanUpTerm(term);
            }
            terms.push(term);
            term = "";
        }
        //check if last char
        if(i == func.length){
            if(clean){
                term = cleanUpTerm(term);
            }
            terms.push(term);
        }
        term += func[i];

    }
    for(i in terms){
        //console.log(terms[i]);
    }
    return terms;
}

function cleanUpTerm(term){
    var cleanedTerm = "";
    for(var i = 0; i < term.length; i++){
        if(term[i] != " "){
            if(term[i] == "x" && (!isNaN(term[i - 1]) && term[i-1] != "*")){
                cleanedTerm += "*";
            }
            cleanedTerm += term[i];
        }
    }

    if(cleanedTerm[0] == "+" || cleanedTerm[0] == "-"){
        term = cleanedTerm.substring(1, cleanedTerm.length);

    }else{
        term = cleanedTerm;
    }

    return term;
}

String.prototype.insert = function (index, string) {
    if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
    else
    return string + this;
};

$(".enter").click(findDerivative);
$(document).keypress(function(e) {
    if(e.which == 13) {
        findDerivative();
    }
});

function findDerivative(){
    finalDerivative = "";
    tempDerivative = "";

    var funcInput = $("textarea").val();
    funcInput = cleanFunction(funcInput);
    console.log(funcInput);
    var terms = findTerm(funcInput);
    for(i in terms){
        termDerivative = chainRule(terms[i]);
        tempDerivative += finalDerivative + " + ";
    }

    $(".answer").text(tempDerivative);
    console.log(tempDerivative);
    $("textarea").val("");
}
