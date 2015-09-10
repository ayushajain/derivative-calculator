"use strict";
const trigFuncs = ["sin", "cos", "tan", "csc", "sec", "cot"];
const invTrigFuncs = ["arcsin", "arccos", "arctan", "arccsc", "arcsec", "arccot"];
const natLog = "ln";
const log = "log";

class Derivative {
    constructor(func){
        this.function = func;
    }
    //compile raw input into a uniform function
    cleanFunction() {
        var func = this.function;
        var cleanedFunc = "";

        //add coeffients and powers to any standard function
        for (var i = 0; i < func.length; i++) {

            if ((func[i] == "x" || func[i] == "(") && i != func.length - 1 && func[i - 1] != "^") {

                //if it is a trig function
                if ($.inArray(func.substring(i - 3, i), trigFuncs) != -1 && $.inArray(func.substring(i - 6, i), invTrigFuncs) == -1) {
                    console.log(func.substring(i - 6, i));

                    if (i >= 4 && func[i - 4] != "*") {
                        if (!isNaN(func[i - 4]))
                            cleanedFunc = cleanedFunc.insert(i - 3, "*");
                        else
                            cleanedFunc = cleanedFunc.insert(i - 3, "1*");

                    } else if (i < 4)
                        cleanedFunc = cleanedFunc.insert(0, "1*");

                } else if ($.inArray(func.substring(i - 6, i), invTrigFuncs) != -1) {
                    if (i >= 7 && func[i - 7] != "*") {
                        if (!isNaN(func[i - 7]))
                            cleanedFunc = cleanedFunc.insert(i - 3, "*");
                        else
                            cleanedFunc = cleanedFunc.insert(i - 3, "1*");

                    } else if (i < 7)
                        cleanedFunc = cleanedFunc.insert(0, "1*");

                } else {
                    if (!isNaN(func[i - 1]) || func[i - 1] == ")" || func[i - 1] == "x") {
                        //make sure that coeffient is not the power of another term
                        var isCoefficient = true;

                        for (var x = i; x > 0; x--) {
                            if (cleanedFunc[x] == "+" || cleanedFunc[x] == "-") {
                                cleanedFunc += "*";
                                break;
                            }
                        }

                    } else if (func[i - 1] != "*" && func[i - 1] != "/") {
                        //add a coefficient if neccessary
                        if (i > 0)
                            cleanedFunc += "1*"
                        else
                            cleanedFunc = cleanedFunc.insert(0, "1*")
                    }
                }
            }

            //remove any spaces in function
            if (func[i] != " ")
                cleanedFunc += func[i];

            //add a power if there is none
            if ((func[i] == "x" || func[i] == ")") && i != func.length && func[i + 1] != "^")
                cleanedFunc += "^1";

        }

        this.function = cleanedFunc;
    }

    //Takes a string equation and returns each of the terms (works specifically for terms that are added or subtracted)
    findTerms() {
        var func = this.function;

        var term = "";
        var terms = [];
        var currentlyInsideTerm = 0;

        for (var i = 0; i <= func.length; i++) {
            //add 1 to currentlyInsideTerm if we enter a new parenthesis and subtract 1 if we reach the closing paranthesis
            if (func[i] == "(")
                currentlyInsideTerm++;

            else if (func[i] == ")" && currentlyInsideTerm)
                currentlyInsideTerm--;

            else if ((func[i] == "+" || func[i] == "-") && currentlyInsideTerm == 0) {
                terms.push(term);
                term = "";
            }

            //push to terms if last char
            if (i == func.length)
                terms.push(term);

            term += func[i];

            //check for extraneous operators in term
            if (term[0] == "+" || term[0] == "-")
                term = term.substring(1, term.length);
            else if (term[1] == "+" || term[1] == "-")
                term = term.substring(2, term.length);
        }

        this.functionTerms = terms;
    }

    //takes a term and determines which derivative rule to use
    determineWhichRule(term) {
        /*
         * Order of importance:
         * Exponential, Product/Quotient, Chain
         */
        var rules = ["chain", "product", "quotient", "trig", "log", "natlog", "inverseTrig", "exponential"];
        /*
         * (Side Note): To avoid confusion between inverse trig function and a trig function
         * to the power of -1, we will just use the "arc" prefix to denote the use of an inverse
         * trig function.
         */

        if (checkExponentialRule())
            return rules[7];
        else if (checkProductRule())
            return rules[1];
        else if (checkQuotientRule())
            return rules[2];
        else if (checkInverseTrigRule())
            return rules[6];
        else if (checkTrigRule())
            return rules[3];
        else
            return rules[0];

        function checkProductRule() {
            var currentlyInsideTerm = 0;
            var multiples = [];
            var currentMultiple = "";

            for (var i = 0; i < term.length; i++) {

                //decrement 1 if we exit a set of parantheses
                if (term[i] == ")")
                    currentlyInsideTerm--;

                //concatenate if we are outside any term and if we find a multiplication operator
                if (currentlyInsideTerm == 0) {
                    if (term[i] != "*")
                        currentMultiple += term[i];

                    else if (isNaN(currentMultiple)) {
                        multiples.push(currentMultiple);
                        currentMultiple = "";
                    } else
                        currentMultiple = ""

                }

                //push if last term
                if (i == term.length - 1 && isNaN(currentMultiple))
                    multiples.push(currentMultiple);

                //increment 1 if we enter a set of parantheses
                if (term[i] == "(")
                    currentlyInsideTerm++;

            }

            var numTermMultiples = 0;

            for (i in multiples) {
                if (isNaN(multiples[i]))
                    numTermMultiples++;
            }
            return numTermMultiples > 1
        }

        function checkQuotientRule() {
            var currentlyInsideTerm = 0;
            var multiples = [];
            var currentMultiple = "";

            for (var i = 0; i < term.length; i++) {

                //decrement 1 if we exit a set of parantheses
                if (term[i] == ")")
                    currentlyInsideTerm--;

                //concatenate if we are outside any term and if we find a multiplication operator
                if (currentlyInsideTerm == 0) {
                    if (term[i] != "/")
                        currentMultiple += term[i];

                    else if (isNaN(currentMultiple)) {
                        multiples.push(currentMultiple);
                        currentMultiple = "";
                    } else
                        currentMultiple = "";

                }

                //push if last term
                if (i == term.length - 1 && isNaN(currentMultiple))
                    multiples.push(currentMultiple);

                //increment 1 if we enter a set of parantheses
                if (term[i] == "(")
                    currentlyInsideTerm++;

            }

            var numTermMultiples = 0;

            for (i in multiples) {
                if (isNaN(multiples[i]))
                    numTermMultiples++;
            }
            return numTermMultiples > 1
        }


        function checkExponentialRule() {
            var currentlyInsideTerm = 0;
            var multiples = [];
            var currentMultiple = "";

            for (var i = 0; i < term.length; i++) {

                //decrement 1 if we exit a set of parantheses
                if (term[i] == ")")
                    currentlyInsideTerm--;

                //concatenate if we are outside any term and if we find a multiplication operator
                if (currentlyInsideTerm == 0) {
                    if (term[i] != "*" && term[i] != "/")
                        currentMultiple += term[i];
                    else {
                        multiples.push(currentMultiple);
                        currentMultiple = "";
                    }
                }

                //push if last term
                if (i == term.length - 1)
                    multiples.push(currentMultiple);

                //increment 1 if we enter a set of parantheses
                if (term[i] == "(")
                    currentlyInsideTerm++;

            }

            var numPowerTerms = 0;

            for (i in multiples) {
                var powerIndex = multiples[i].indexOf("^") + 1;
                var power = multiples[i].substring(powerIndex);
                console.log("power: " + power + " multiple: " + multiples[i]);
                if (isNaN(power) && power.indexOf("x") > -1){

                    numPowerTerms++;
                }

            }

            return numPowerTerms > 0;
        }

        function checkTrigRule() {
            return term.indexOf("sin") > -1 || term.indexOf("cos") > -1 || term.indexOf("tan") > -1 || term.indexOf("csc") > -1 || term.indexOf("sec") > -1 || term.indexOf("cot") > -1;
        }

        function checkInverseTrigRule() {
            return term.indexOf("arcsin") > -1 || term.indexOf("arccos") > -1 || term.indexOf("arctan") > -1 || term.indexOf("arccsc") > -1 || term.indexOf("arcsec") > -1 || term.indexOf("arccot") > -1;
        }
    }
}


String.prototype.insert = function(index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};
