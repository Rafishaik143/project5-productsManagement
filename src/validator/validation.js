let isValidData = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "number" && value.toString().trim().length === 0) return false
    return true;
}

let isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

let isValidPrice = (/^\d{0,8}(\.\d{1,4})?$/)

let isValidEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

let isValidPhone = (/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/);

let pincodeValid = (/(^[0-9]{6}(?:\s*,\s*[0-9]{6})*$)/)

let isValidObjectId = (/^[0-9a-fA-F]{24}$/);

let isValidEnum = (enm) =>{
        return ["S", "XS","M","X", "L","XXL", "XL"].indexOf(enm) !== -1
}




module.exports = { isValidData, isValidRequestBody, isValidEmail, isValidPhone, isValidObjectId,pincodeValid,isValidPrice,isValidEnum }