// Task 4.3 — Tip calculator
function calculateTip(billInput,tipPercentInput){
  const bill=Number(billInput),tipPercent=Number(tipPercentInput);
  if(!Number.isFinite(bill)||bill<=0)return {ok:false,error:"Enter a bill amount greater than zero."};
  if(!Number.isFinite(tipPercent)||tipPercent<0||tipPercent>100)return {ok:false,error:"Tip percentage must be between 0 and 100."};
  const money=function(amount){return Math.round((amount+Number.EPSILON)*100)/100;};
  const tip=money(bill*tipPercent/100);
  return {ok:true,bill:money(bill),tip:tip,total:money(bill+tip)};
}
function connectTipCalculator(form,output){
  form.addEventListener("submit",function(event){
    event.preventDefault();const data=new FormData(form),result=calculateTip(data.get("bill"),data.get("tipPercent"));
    output.textContent=result.ok?"Tip: $"+result.tip.toFixed(2)+" · Total: $"+result.total.toFixed(2):result.error;
  });
}
if(typeof module!=="undefined")module.exports={calculateTip,connectTipCalculator};
