// Task 1.3 — Operators and types
function operatorExamples(){
  return {multiply:6*7,divide:24/6,remainder:17%5,isAdult:20>=18,numericInput:Number("42"),joined:"5"+3,added:Number("5")+3,looseEquality:5=="5",strictEquality:5==="5"};
}
if(require.main===module)console.log(operatorExamples());
module.exports={operatorExamples};
