// Task 3.2 — Objects
function getProperty(object,key){return object[key];}
function addCity(person,city){return Object.assign({},person,{city:city});}
function describePerson(person){return person.name+" is "+person.age+" years old.";}
function listKeys(object){return Object.keys(object);}
module.exports={getProperty,addCity,describePerson,listKeys};
