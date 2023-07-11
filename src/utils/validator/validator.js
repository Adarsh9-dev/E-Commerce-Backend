import validator from "validator";

//req body empty or not -------------
export const validReqBody=  (data) => {
  if (Object.keys(data).length > 0) {
    return true;
  }
  return false;
}

// valid mail -----------------------
export const validEmail = (data) => {
  if (validator.isEmail(data)) {
    return true;
  }
  return false;
}

//valid mobile -----------------------
export const validPhone = (data) => {
  const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;
  if (phoneRegex.test(data)) {
    return true;
  }
  return false;
}

//valid password ----------------------
export const validPassword = (data) => {
  const passwordRegex = /^.{8,15}$/;
  if (passwordRegex.test(data)) {
    return true;
  }
  return false;
}

//valid number Input ------------------
export const validIsNumber = (data) => {
  if (typeof data === 'number' && !isNaN(data)) {
    return true;
  }
  return false;
}

//Valid Object Id ----------------------
export const validObjectId = (data) => {
  const objectRegex = /^[0-9a-fA-F]{24}$/;
  if (objectRegex.test(data)) {
    return true;
  }
  return false;
}

//Valid Size ----------------------------
export const validSize = (data) => {
  let flag = 1;
  const size = ["S", "XS","M","X", "L","XXL", "XL"];
  data.map((index)=> {
    if (!size.includes(index)) {
      flag = 0;
    }
  })
  if (flag === 1) {
    return true;
  }
  return false;
} 