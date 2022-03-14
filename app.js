var txt;
function preload() {
    txt = loadStrings("file.txt");
}
function setup()
{
  noCanvas();
  document.getElementById('para').innerHTML=join(txt,'<br/>');
  console.log(txt);
}
document.getElementById('para');
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
var dict={}
// var randomColor;
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  // var randomColor = Math.floor(Math.random()*16777215).toString(16);
  function generateLightColorHex() {
    let color = "#";
    for (let i = 0; i < 3; i++)
      color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
    return color;
  }
  const randomColor= generateLightColorHex();
  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");

    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    dict[id]=randomColor;
    element.innerHTML = `
    <button id="label" style="background-color: ${randomColor};" onclick="labelling('${randomColor}','${value}')">
    <p class="title"  id="${value}">${value}</p></button> 
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
           
          `;

    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(element);
    // display alert
    displayAlert("Tag added to the list", "success");
    // show container
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value, randomColor);
    // set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // edit  local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
  console.log(list)
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// delete item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  console.log(element);
  console.log(editElement);
  const child = e.currentTarget.parentElement.previousElementSibling.firstElementChild;
  console.log(child);
  grocery.value = child.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //
  submitBtn.textContent = "edit";
}
// set backt to defaults
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, value,randomColor) {
  const grocery = { id, value , randomColor };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value , item.randomColor);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value, randomColor) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  console.log(list);
  element.classList.add("grocery-item");
  element.innerHTML = `<button id="label" style="background-color: ${randomColor};" onclick="labelling('${randomColor}','${value}')">
  <p class="title" id="${value}">${value}</p></button>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            
          `;
    
  // // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}


//**********labelling*********


function selectHTML(value) {
    try {
        if (window.ActiveXObject) {
            var c = document.selection.createRange();
            return c.htmlText;
        }
    
        var nNd = document.createElement("span");
        nNd.className = value;
        var w = getSelection().getRangeAt(0);
        w.surroundContents(nNd);
        return nNd.innerHTML;
    } catch (e) {
        if (window.ActiveXObject) {
            return document.selection.createRange();
        } else {
            return getSelection();
        }
    }
}





function labelling(bgColor,value){
// $(function() {
    // $('#label').click( function() {
        // var bgColor = $('#label').css('background-color');
        color=bgColor
        var mytext = selectHTML(value);
        console.log(color);
        var name = "."+value
        // const selected_tag = document.getElementsByClassName(color);
        // document.getElementsByClassName(value).style.backgroundColor = color;
        $("."+value).css({"background-color":bgColor});
    // });
// });
} 
 

// =========
// json creation 
// =========
// function jsonformat()
// {
//   prt= document.getElementsByClassName("paragraph")
//   dict={}
//   dict2=[]
//   $('.para').children('span').each(function () {
//     cls= this.className;
//     v=this.textContent;
//     console.log(cls);
//     console.log(v);
//     dict[cls]=v;
//     // console.log("inside loop");

//     child = {
//       label: this.className,
//       text:this.textContent
//     };
//     dict2.push(child);

// });

// console.log(dict);
// console.log(dict2);
// let j1 = JSON.stringify(dict);
// let j2 = JSON.stringify(dict2);
// console.log(j1);
// console.log(j2);
// var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(j2);
// var dlAnchorElem = document.getElementById('export');
// dlAnchorElem.setAttribute("href",     dataStr     );
// dlAnchorElem.setAttribute("download", "scene.json");
// dlAnchorElem.click();
// }



function download(j2) {
			
  //creating an invisible element
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(j2);
  var dlAnchorElem = document.getElementById('export');
  dlAnchorElem.setAttribute("href",dataStr);
  dlAnchorElem.setAttribute("download", "annotations.json");
  // dlAnchorElem.click();
  // Above code is equivalent to
  // <a href="path of file" download="file name">

  // 

  // //onClick property
  // element.click();

  // document.body.removeChild(element);
}

// Start file download.
document.getElementById("export")
.addEventListener("click", function() {
  prt= document.getElementsByClassName("paragraph")
  dict={}
  dict2=[]
  $('.para').children('span').each(function () {
    cls= this.className;
    v=this.textContent;
    console.log(cls);
    console.log(v);
    dict[cls]=v;
    // console.log("inside loop");

    child = {
      label: this.className,
      text:this.textContent
    };
    dict2.push(child);

});
console.log(dict);
console.log(dict2);
var dict3={}
dict3['Annotated data']=dict2;
let j1 = JSON.stringify(dict);
let j2 = JSON.stringify(dict3,null,4);
console.log(j1);
console.log(j2);

  download(j2);
}, false);