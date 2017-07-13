import { add, trim } from './add';
import { roundOff } from './round';
import { multiply } from './multiply';
import { divide } from './divide'
import { compareTo } from './compareTo';
import { subtract, negate } from './subtract';

export class bigDecimal {

    private value: string;

    private static validate(number) {
        if (number) {
            number = number.toString();
            if (isNaN(number))
                throw Error("Parameter is not a number: " + number);

            if (number[0] == '+')
                number = number.substring(1);
        } else
            number = '0';

        //handle exponentiation
        if (/e/i.test(number)) {
            let [mantisa, exponent] = number.split(/[eE]/);
            mantisa = trim(mantisa);
            exponent = parseInt(exponent) + mantisa.indexOf('.');
            mantisa = mantisa.replace('.', '');
            if (mantisa.length < exponent) {
                number = mantisa + (new Array(exponent - mantisa.length + 1)).join('0');
            } else if (mantisa.length >= exponent && exponent > 0) {
                number = trim(mantisa.substring(0, exponent)) +
                    ((mantisa.length > exponent) ? ('.' + mantisa.substring(exponent)) : '');
            } else {
                number = '0.' + (new Array(-exponent + 1)).join('0') + mantisa;
            }
        }

        return number;
    }

    constructor(number = '0') {
        this.value = bigDecimal.validate(number);
    }

    getValue() {
        return this.value;
    }

    static getPrettyValue(number, digits, separator) {
        if (!(digits || separator)) {
            digits = 3;
            separator = ',';
        } else if (!(digits && separator)) {
            throw Error('Illegal Arguments. Should pass both digits and separator or pass none');
        }

        var len = number.indexOf('.');
        len = len > 0 ? len : (number.length);
        var temp = '';
        for (var i = len; i > 0;) {
            if (i < digits) {
                digits = i;
                i = 0;
            } else
                i -= digits;

            temp = number.substring(i, i + digits) + ((i < (len - digits) && i >= 0) ? separator : '') + temp;
        }
        return temp + number.substring(len);
    }

    getPrettyValue(digits, separator) {
        if (!(digits || separator)) {
            digits = 3;
            separator = ',';
        } else if (!(digits && separator)) {
            throw Error('Illegal Arguments. Should pass both digits and separator or pass none');
        }

        var len = this.value.indexOf('.');
        len = len > 0 ? len : (this.value.length);
        var temp = '';
        for (var i = len; i > 0;) {
            if (i < digits) {
                digits = i;
                i = 0;
            } else
                i -= digits;

            temp = this.value.substring(i, i + digits) + ((i < (len - digits) && i >= 0) ? separator : '') + temp;
        }
        return temp + this.value.substring(len);
    }

    static round(number, precision) {
        if (!precision)
            precision = 0;
        else if (isNaN(precision))
            throw Error("Precision is not a number: " + precision);

        return roundOff(number, precision);
    }

    round(precision) {
        if (!precision)
            precision = 0;
        else if (isNaN(precision))
            throw Error("Precision is not a number: " + precision);

        return new bigDecimal(roundOff(this.value, precision));
    }

    static add(number1, number2) {
        number1 = bigDecimal.validate(number1);
        number2 = bigDecimal.validate(number2);
        return add(number1, number2);
    }

    add(number : bigDecimal) {
        return new bigDecimal(add(this.value, number.getValue()));
    }

    static subtract(number1, number2) {
        number1 = bigDecimal.validate(number1);
        number2 = bigDecimal.validate(number2);
        return subtract(number1, number2);
    }

    subtract(number : bigDecimal) {
        return new bigDecimal(subtract(this.value, number.getValue()));
    }

    static multiply(number1, number2){
        number1 = bigDecimal.validate(number1);
        number2 = bigDecimal.validate(number2);
        return multiply(number1, number2);
    }

    multiply(number : bigDecimal) {
        return new bigDecimal(multiply(this.value, number.getValue()));
    }

    static divide(number1, number2){
        number1 = bigDecimal.validate(number1);
        number2 = bigDecimal.validate(number2);
        return divide(number1, number2);
    }

    divide(number : bigDecimal) {
        return new bigDecimal(divide(this.value, number.getValue()));
    }

    static compareTo(number1, number2){
        number1 = bigDecimal.validate(number1);
        number2 = bigDecimal.validate(number2);
        return compareTo(number1, number2);
    }

    compareTo(number : bigDecimal) {
        return compareTo(this.value, number.getValue());
    }

    static negate(number){
        number = bigDecimal.validate(number);
        return negate(number);
    }

    negate() {
        return new bigDecimal(negate(this.value));
    }
}