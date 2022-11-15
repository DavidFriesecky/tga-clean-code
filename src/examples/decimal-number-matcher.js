// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

const DEFAULT_MAX_DIGITS = 11;
const ERRORS_MAP = {
  parsingNumberError: {
    code: "doubleNumber.e001",
    message: "The value is not a valid decimal number.",
  },
  maxDigitsError: {
    code: "doubleNumber.e002",
    message: "The value exceeded maximum number of digits.",
  },
  maxDecimalPlacesError: {
    code: "doubleNumber.e003",
    message: "The value exceeded maximum number of decimal places.",
  },
};

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param maxDigits - number of digits that cannot be exceeded (default value is 11)
 * @param maxDecimalPlaces - maximum number of decimal places
 */
class DecimalNumberMatcher {
  constructor(maxDigits = DEFAULT_MAX_DIGITS, maxDecimalPlaces) {
    this.maxDigits = maxDigits;
    this.maxDecimalPlaces = maxDecimalPlaces;
  }

  match(value) {
    let result = new ValidationResult();

    if (value != null) {
      const number = this.parseNumber(value, result);

      this.validateDigits(number, this.maxDigits, result);

      if (this.maxDecimalPlaces) {
        this.validateDecimalPlaces(number, this.maxDecimalPlaces, result);
      }
    }

    return result;
  }

  parseNumber(value, result) {
    try {
      return new Decimal(value);
    } catch (e) {
      const error = ERRORS_MAP.parsingNumberError;
      result.addInvalidTypeError(error.code, error.message);
      return null;
    }
  }

  validateDigits(number, maxDigits, result) {
    if (number) {
      if (number.precision(true) > maxDigits) {
        const error = ERRORS_MAP.maxDigitsError;
        result.addInvalidTypeError(error.code, error.message);
      }
    }
  }

  validateDecimalPlaces(number, maxDecimalPlaces, result) {
    if (number) {
      if (number.decimalPlaces() > maxDecimalPlaces) {
        const error = ERRORS_MAP.maxDecimalPlacesError;
        result.addInvalidTypeError(error.code, error.message);
      }
    }
  }
}

module.exports = DecimalNumberMatcher;
