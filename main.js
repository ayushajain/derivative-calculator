var finalDerivative = "";
var tempDerivative = "";
var input = "(x^3 + 5x)^2 + 10x";
cleanFunction(input);
var individualTerms = findTerm(input);


chainRule("((x^5 + x^1)^1+5x^1)^3");
//console.log(finalDerivative);


function cleanFunction(func){
    var cleanedFunc = "";
    for(var i = 0; i < func.length; i++){
        if(func[i] == "x" && !isNaN(func[i - 1])){
            cleanedFunc += "*";
        }

        if(func[i] != " "){
            cleanedFunc += func[i];
        }
        if((func[i] == "x" || func[i] == ")") && func[i+1] != "^"){
            cleanedFunc += "^1";
        }
    }
    input = cleanedFunc;
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
    //console.log(base);


    derivative += (coefficient*power) + "*" + base + "^" + (power-1);
    if(base[0] == "("){
        var terms = findTerm(base.substring(1, base.length - 1));
        var innerDerivative = "(";
        for(i in terms){
            var tet = chainRule(terms[i]);
            if(i != terms.length - 1){
                innerDerivative += tet + "+";
            }else{
                innerDerivative += tet;
            }
        }
        innerDerivative += ")"
        finalDerivative = (derivative + "*" + innerDerivative);
    }else{
        finalDerivative = derivative;
    }

    //console.log(derivative);
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
            terms.push(cleanUpTerm(term));
            term = "";
        }
        //check if last char
        if(i == func.length){
            terms.push(cleanUpTerm(term));
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
            if(term[i] == "x" && !isNaN(term[i - 1])){
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

$(".enter").click(function(){
    finalDerivative = "";
    var funcInput = $("textarea").val();
    chainRule(funcInput);
    $(".answer").text(finalDerivative);
    console.log(finalDerivative);
});




// var terms = [];
// var termIdentity = [];
// var term = "";
// var termSignPos = true;
// var isOperator = 0;
// var inTerm = false;
// for(var currChar = 0; currChar <= func.length; currChar++){
//     isOperator--;
//
//     if(func[currChar] != " " || isOperator > 0){
//         //if it is the last index store it
//         if(currChar == func.length){
//             pushTerm();
//         }else{
//             //do not include extraneous operators as terms
//             if(func[currChar] == "+" || func[currChar] == "-"){
//                 termSignPos = true;
//                 isOperator = 2;
//                 if(func[currChar] == "-"){
//                     termSignPos = false;
//                 }
//             }else if(func[currChar] == "(" || func[currChar] == "x"){
//                 inTerm = true;
//             }else if(func[currChar] == ")"){
//                 inTerm = false;
//             }
//             //add to term if there is no space
//             if(func[currChar] != " " && inTerm){
//                 term += func[currChar];
//             }
//         }
//     }else if(term != ""){
//         pushTerm();
//     }
//
//
// }
// for(i in terms){
//     console.log(terms[i]);
//     chainRule(terms[i]);
// }
// return terms;
//
// function pushTerm(){
//     cleanUpTerm();
//     termIdentity.push(term);
//     termIdentity.push(termSignPos);
//     terms.push(term);
//     term = "";
// }
// function cleanUpTerm(){
//     for(var i = 0; i <= 1; i++){
//         if(term[i] == " " || term[i] == "+"){
//             term = term.substring(i + 1, term.length);
//         }
//     }
// }
