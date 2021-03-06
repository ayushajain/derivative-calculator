var finalDerivative = "";
var tempDerivative = "";
var dev = "";
// var input = "(x^3 + 5x)^2 + 10x";
// cleanFunction(input);
// var individualTerms = findTerm(input);


//chainRule("((x^5 + x^1)^1+5x^1)^3");
//console.log(finalDerivative);


function cleanFunction(func){
    //add powers of 1 where necessary
    var cleanedFunc = "";
    for(var i = 0; i < func.length; i++){

        if(func[i] == "x"  && i != func.length - 1 && !isNaN(func[i - 1]) && (func[i-1] != " " && func[i-1] != 5/0 && func[i-1] != "+")){
            if(i > 1){
                cleanedFunc += "*";
            }else{
                cleanedFunc.insert(0, "*");
            }
        }

        if(func[i] != " "){
            cleanedFunc += func[i];
        }

        if((func[i] == "x" || func[i] == ")") && i != func.length && func[i+1] != "^" ){
            cleanedFunc += "^1";
        }
    }



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
    //console.log(term + "|  |" + base);
    if(base[0] == "("){
        //console.log(term + "|  |"  +base );
        var terms = findTerm(base.substring(1, base.length - 1));
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
        console.log(innerDerivative);
    }else{
        finalDerivative = derivative;
    }
    ////////////////
    dev+= finalDerivative;
    //check if constant
    if(base == "" || !isNaN(base) || power == 0){
        derivative = "";
        finalDerivative = "0";
    }

    return derivative;


}

function findTerm(func){
    var term = "";
    var terms = [];
    var currentlyInsideTerm = false;
    for(var i = 0; i <= func.length; i++){
        if(func[i] == "("){
            currentlyInsideTerm = true;
        }else if(func[i] == ")" && currentlyInsideTerm){
            currentlyInsideTerm = false;
        }else if((func[i] == "+" || func[i] == "-") && !currentlyInsideTerm){
            term = cleanUpTerm(term);
            terms.push(term);
            term = "";
        }
        //check if last char
        if(i == func.length){
            term = cleanUpTerm(term);
            terms.push(term);
        }
        term += func[i];

    }
    //for(i in terms){
        //console.log(terms[i]);
    //}
    return terms;
}

function cleanUpTerm(term){

    var cleanedTerm = "";
    //remove unecessary clutter
    for(var i = 0; i < term.length; i++){
        if(term[i] != " "){
            if(term[i] == "x" && (!isNaN(term[i - 1]) && term[i-1] != "*")){
                cleanedTerm += "*";
            }
            cleanedTerm += term[i];
        }
    }

    if(cleanedTerm[0] == "+" || cleanedTerm[0] == "-"){
        cleanedTerm = cleanedTerm.substring(1, cleanedTerm.length);
    }

    //retitterate to check coefficients
    var checkingBrackets = 0;
    for(i in cleanedTerm){
        if(checkingBrackets == 0 && cleanedTerm[i] == "(" && cleanedTerm[i-1] != "*"){


            cleanedTerm.insert(i,"1*");
            //special case when
            if(i == 0){
                cleanedTerm = "1*" + cleanedTerm;
            }
        }

        if(cleanedTerm[i] == "("){
            checkingBrackets++;
        }else if(cleanedTerm[i] == ")"){
            checkingBrackets--;
        }
    }
    console.log(cleanedTerm);

    return cleanedTerm;
}

String.prototype.insert = function (index, string) {
    if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
    else
    return string + this;
};

$(".enter").click(main);
$(document).keypress(function(e) {
    if(e.which == 13) {
        main();
    }
});


function main(){
    finalDerivative = "";
    tempDerivative = "";

    var funcInput = $("textarea").val();
    funcInput = cleanFunction(funcInput);
    console.log("input: " + funcInput);
    calculateDerivative(funcInput);



    $(".answer").text(tempDerivative);
    //console.log(tempDerivative);
    $("textarea").val("");
}


/*
 * This method will determine which rule to use.
 * eg: (product rule, chain rule, etc.)
 */
function calculateDerivative(terms){
    terms = findTerm(terms);
    for(var i = 0; i < terms.length; i++){
        termDerivative = chainRule(terms[i]);
        //console.log(i + "       " + terms.length);
        if(i != terms.length - 1){
            tempDerivative += finalDerivative + " + ";
        }else{
            tempDerivative += finalDerivative;
        }
    }
}
