// Task 4.1 — DOM selection and updates
function setText(selector,message,root){root=root||document;const element=root.querySelector(selector);if(!element)return false;element.textContent=message;return true;}
function toggleClass(selector,className,root){root=root||document;const element=root.querySelector(selector);if(!element)return false;element.classList.toggle(className);return true;}
function appendListItem(listSelector,text,root){root=root||document;const list=root.querySelector(listSelector);if(!list)return false;const item=root.createElement("li");item.textContent=text;list.appendChild(item);return item;}
if(typeof module!=="undefined")module.exports={setText,toggleClass,appendListItem};
