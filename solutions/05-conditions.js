// Task 2.2 — Conditions and boundaries
function describeScore(score){
  if(!Number.isFinite(score)||score<0||score>100)return "Invalid score";
  if(score>=90)return "Excellent";
  if(score>=75)return "Good";
  if(score>=60)return "Passed";
  return "Needs more practice";
}
function canAccessDashboard(isLoggedIn,hasPermission){return Boolean(isLoggedIn&&hasPermission);}
function shouldBringUmbrella(isRaining,chanceOfRain){return Boolean(isRaining||chanceOfRain>=60);}
module.exports={describeScore,canAccessDashboard,shouldBringUmbrella};
