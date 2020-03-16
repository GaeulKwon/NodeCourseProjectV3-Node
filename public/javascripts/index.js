// this code runs once, immediately when the js file is pulled down
let carArray = [];

let selectedMake = "not selected";  // for my dropdown list of movie genre

// define a constructor to create movie objects
var CarObject = function (pMake, pModel, pYear, pMile, pPrice) {
  this.Make = pMake;  // action  comedy  drama  horrow scifi  musical  western
  this.Model = pModel;
  this.Year = pYear;
  this.Mile = pMile;
  this.Price = pPrice;
}

// end of run once code

// code in this block waits untill everything had come down from server, then it runs
document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("buttonAdd").addEventListener("click", function () {
     let newCar = new CarObject(selectedMake, document.getElementById("model").value, document.getElementById("year").value,
      document.getElementById("mile").value, document.getElementById("price").value);
      addNewCar(newCar); // now post new movie object to node server
    });


    // this deals with the event when the drop down changes
  $(document).bind("change", "#select-make", function (event, ui) {
    selectedMake = $('#select-make').val();
  });

  // 2 sort button events. after running these, the local array is not in the same
  // order as the server array, but have no dependence on the order of items in the 2 arrays
  document.getElementById("buttonSortPrice").addEventListener("click", function () {
    carArray = carArray.sort(comparePrice);
    createList();
  });

  document.getElementById("buttonSortMake").addEventListener("click", function () {
    carArray = carArray.sort(compareMake);
    createList();
  });


  // delete button  Had trouble with spaces in titles, its an easy thing to fix
  // I just didn't get the time
  document.getElementById("buttonDelete").addEventListener("click", function () {
    let deleteModel = document.getElementById("deleteModel").value;

    // doing the call to the server right here
    fetch('users/deleteCar/' + deleteModel , {
    // users/deleteMovie/Moonstruck   for example, this is what the URL looks like sent over the network
        method: 'DELETE'
    })  
    // now wait for 1st promise, saying server was happy with request or not
    .then(responsePromise1 => responsePromise1.text()) // ask for 2nd promise when server is node
    .then(responsePromise2 =>  console.log(responsePromise2), document.location.href = "index.html#refreshPage")  // wait for data from server to be valid
    // force jump off of same page to refresh the data after delete
    .catch(function (err) {
        console.log(err);
        alert(err);
       });

   
  });

$(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 
    FillArrayFromServer();  // need to get fresh data
    // createList(); this can't be here, as it is not waiting for data from server
});

// leaving ListAll to force the pagebeforeshow on ListAll from within that page when delete
$(document).on("pagebeforeshow", "#refreshPage", function (event) {   
    document.location.href = "index.html#ListAll";
});
  
  document.getElementById("buttonClear").addEventListener("click", function () {
    document.getElementById("model").value = "";
    document.getElementById("year").value = "";
    document.getElementById("mile").value = "";
    document.getElementById("price").value = "";
  });
  
$(document).on("pagebeforeshow", "#Load", function (event) {   // have to use jQuery 
  document.getElementById("model").value = "";
  document.getElementById("year").value = "";
  document.getElementById("mile").value = "";
  document.getElementById("price").value = "";
  });

$(document).on("pagebeforeshow", "#detailPage", function (event) {   // have to use jQuery 
    let localModel = document.getElementById("IDparmHere").innerHTML;
    for(let i=0; i < carArray.length; i++) {   
        if(carArray[i].Model == localModel){
            document.getElementById("oneMake").innerHTML =  carArray[i].Make;
            document.getElementById("oneModel").innerHTML =  carArray[i].Model;
            document.getElementById("oneYear").innerHTML =  carArray[i].Year;
            document.getElementById("onePrice").innerHTML =   carArray[i].Price;
            document.getElementById("oneMile").innerHTML =   carArray[i].Mile;
            break;
        }  
    }
 });

});

function createList()
{
  // clear prior data
  var divCarList = document.getElementById("divCarList");
  while (divCarList.firstChild) {    // remove any old data so don't get duplicates
  divCarList.removeChild(divCarList.firstChild);
  };

  var ul = document.createElement('ul');  
  carArray.forEach(function (element,) {   // use handy array forEach method
    var li = document.createElement('li');
    li.innerHTML = "<a data-transition='pop' class='oneCar' data-parm=" + element.Model + "  href='#detailPage'>Get Details </a> "  + element.Make + "  " + element.Model + "  " + "$" + element.Price;
    // ok, this is weird.  If I set the href in the <a  anchor to detailPage, it messes up the success of
    // the button event that I add in the loop below.  By setting it to home, it jumps to home for a second
    // but then the button event sends it correctly to the detail page and the value of data-parm is valid.
    ul.appendChild(li);
  });
  divCarList.appendChild(ul)

    //set up an event for each new li item, if user clicks any, it writes >>that<< items data-parm into the hidden html 
    var classname = document.getElementsByClassName("oneCar");
    Array.from(classname).forEach(function (element) {
        element.addEventListener('click', function(){
            var parm = this.getAttribute("data-parm");  // passing in the record.Id
            document.getElementById("IDparmHere").innerHTML = parm;
            document.location.href = "index.html#detailPage";
        });
    });
   
};


function comparePrice(a, b) {
    // Use toUpperCase() to ignore character casing
    const carA = a.Price.toUpperCase();
    const carB = b.Price.toUpperCase();
  
    let comparison = 0;
    if (carA > carB) {
      comparison = 1;
    } else if (carA < carB) {
      comparison = -1;
    }
    return comparison;
  }
  

function compareMake(a, b) {
    // Use toUpperCase() to ignore character casing
    const carA = a.Make.toUpperCase();
    const carB = b.Make.toUpperCase();
  
    let comparison = 0;
    if (carA > carB) {
      comparison = 1;
    } else if (carA < carB) {
      comparison = -1;
    }
    return comparison;
  }


// code to exchange data with node server

function FillArrayFromServer(){
    // using fetch call to communicate with node server to get all data
    fetch('/users/carList')
    .then(function (theResonsePromise) {  // wait for reply.  Note this one uses a normal function, not an => function
        return theResonsePromise.json();
    })
    .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client
    console.log(serverData);
    carArray.length = 0;  // clear array
    carArray = serverData;   // use our server json data which matches our objects in the array perfectly
    createList();  // placing this here will make it wait for data from server to be complete before re-doing the list
    })
    .catch(function (err) {
     console.log(err);
    });
};


// using fetch to push an object up to server
function addNewCar(newCar){
   
    // the required post body data is our movie object passed in, newMovie
    
    // create request object
    const request = new Request('/users/addCar', {
        method: 'POST',
        body: JSON.stringify(newCar),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
    
    // pass that request object we just created into the fetch()
    fetch(request)
        // wait for frist server promise response of "200" success (can name these returned promise objects anything you like)
        // Note this one uses an => function, not a normal function, just to show you can do either 
        .then(theResonsePromise => theResonsePromise.json())    // the .json sets up 2nd promise
        // wait for the .json promise, which is when the data is back
        .then(theResonsePromiseJson => console.log(theResonsePromiseJson), document.location.href = "#ListAll" )
        // that client console log will write out the message I added to the Repsonse on the server
        .catch(function (err) {
            console.log(err);
        });
    
}; // end of addNewUser
    
