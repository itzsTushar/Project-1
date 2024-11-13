/*function softmax(arr) {
    return arr.map(function(value,index) { 
      return Math.exp(value) / arr.map( function(y){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
    })
}
const generateOtp = function(){
let arr = [Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),
    Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),
    Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),
    Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),
    Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),
    Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),
    Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()
]
let result = softmax(arr)
//console.log("result :",result)
let rnum = Math.floor(Math.random()*(result.length-1))
console.log("rnum :",rnum)
let text = 1000*result[rnum].toString()
console.log("toString",text)
const otp = text.split(".")
console.log(otp[1])
return otp[1];
}
console.log("Otp :",generateOtp())*/
function softmax(arr) {
    return arr.map(function(value, index) { 
        return Math.exp(value) / arr.map(function(y) { return Math.exp(y); }).reduce(function(a, b) { return a + b; });
    });
}

const generateOtp = function() {
    let arr = Array(50).fill(0).map(() => Math.random());
    let result = softmax(arr);
    let rnum = Math.floor(Math.random() * result.length);
    let text = (1000 * result[rnum]).toString();

    // Extract the decimal part or default to "0000" if undefined, then pad to ensure 4 digits
    const otpPart = text.split(".")[1] || "0000";
    const otp = otpPart.padEnd(4, "0").slice(0, 4);  // Ensures exactly 4 digits

    console.log("Generated OTP:", otp);
    return otp;
};

//console.log("Otp:", generateOtp());


export {generateOtp}