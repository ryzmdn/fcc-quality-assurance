function numberStringSplitter(input) {
  const number = input.match(/[.\d\/]+/g) || ["1"];
  const string = input.match(/[a-zA-Z]+/g)?.[0] || "";
  return [number[0], string];
}

function checkDiv(possibleFraction) {
  const nums = possibleFraction.split("/");
  return nums.length > 2 ? false : nums;
}

function ConvertHandler() {
  const unitMap = {
    km: "mi",
    mi: "km",
    gal: "L",
    l: "gal",
    lbs: "kg",
    kg: "lbs"
  };
  
  const unitFullName = {
    km: "kilometers",
    mi: "miles",
    gal: "gallons",
    l: "liters",
    lbs: "pounds",
    kg: "kilograms"
  };

  const conversionRates = {
    km: 1 / 1.60934,
    mi: 1.60934,
    gal: 3.78541,
    l: 1 / 3.78541,
    lbs: 0.453592,
    kg: 1 / 0.453592
  };

  this.getNum = function (input) {
    const result = numberStringSplitter(input)[0];
    const nums = checkDiv(result);
    if (!nums) return undefined;
    
    const num1 = parseFloat(nums[0]);
    const num2 = parseFloat(nums[1] || "1");
    
    return isNaN(num1) || isNaN(num2) ? undefined : num1 / num2;
  };

  this.getUnit = function (input) {
    const unit = numberStringSplitter(input)[1].toLowerCase();
    const unitL = (unit === "l" ? "L" : unit);
    return unitMap[unit] ? unitL : undefined;
  };

  this.getReturnUnit = function (initUnit) {
    return unitMap[initUnit.toLowerCase()] || undefined;
  };

  this.spellOutUnit = function (unit) {
    return unitFullName[unit.toLowerCase()] || "unknown";
  };

  this.convert = function (initNum, initUnit) {
    if (!initUnit) return undefined;
    const unit = initUnit.toLowerCase();
    
    if (!conversionRates.hasOwnProperty(unit) || isNaN(initNum)) return undefined;
  
    return parseFloat((initNum * conversionRates[unit]).toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
