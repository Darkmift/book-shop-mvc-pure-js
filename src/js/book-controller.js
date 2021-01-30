function init() {
  renderBooks();
}

//RENDER FUNCS
///render funcs
function renderBooks() {
  var strHtml = "";
  setBookPageArr();
  if (gBookPageArr && gBookPageArr.length) {
    strHtml = objectArrToTable(gBookPageArr);
  } else {
    strHtml = "Add a book!";
  }
  document.querySelector(".table-wrapper").innerHTML = strHtml;

  renderPaginationNav();
}

// render table
// dependency renderButtons()
function objectArrToTable(objArr) {
  var titles = Object.keys(objArr[0]);
  var htmlStr = "<table><thead><tr>\n";
  htmlStr += titles
    .map(function (key) {
      return `<th>${key}</th>`;
    })
    .join("");
  htmlStr += `<th colspan="3">actions</th>`;
  htmlStr += "</tr></thead></tbody>\n";
  objArr.forEach(function (obj) {
    htmlStr += `<tr>`;
    for (const key in obj) {
      var value = obj[key];

      switch (key) {
        case "imgUrl":
          htmlStr += `
                    <td>
                        <img class="book-image" src="./src/images/${value}" alt="${value}"/>
                    </td>`;
          break;

        case "rating":
          htmlStr += renderRatingBtns(obj.id, value);
          break;

        default:
          htmlStr += `<td>${value}</td>`;
          break;
      }
    }

    htmlStr += renderButtons(obj.id);

    htmlStr += `</tr>\n`;
  });
  htmlStr += "</tbody></table>";
  return htmlStr;
}

//render buttons in objectArrToTable()
function renderButtons(bookId) {
  return /*html*/ `
    <td>
        <button style="background-color: rgb(52, 49, 231);" onclick="onReadBook('${bookId}')">Read</button>
    </td>
    <td>
        <button style="background-color: rgb(220, 223, 65);" onclick="onUpdateBook('${bookId}')">Update</button>
    </td>
    <td>
        <button style="background-color: rgb(241, 81, 53);" onclick="onRemoveBook('${bookId}')">Delete</button>
    </td>
    `;
}

//render rating btns in tabel render
function renderRatingBtns(bookId, rating) {
  return /*html*/ `
    <td class="rate-book">   
        <button onclick="onRateClick('${bookId}',true)">+</button>
        <span>${rating}</span>
        <button onclick="onRateClick('${bookId}',false)">-</button>
    </td>
    `;
}

function renderForm(addOrEdit, bookId = null) {
  return `<form class="modal-form btn-wrapper" onsubmit="onSubmitBookDetails(event,${addOrEdit},'${bookId}')">

    <span class="form-label">
        <input class="modal-input" type="text" placeholder="___" name="name" />
        <label for="book-name" class="book-label">Book Name</label>
    </span>

    <span class="form-label">
        <input class="modal-input" type="text" placeholder="___" name="price" />
        <label for="book-price" class="price-label">Price</label>
    </span>

    <span class="btn-wrapper">
        <button type="submit" style="background-color: red;">Confirm</button>
    </span>
</form>`;
}

// render form modal
function renderModal(openOrClose, addOrEdit, bookId = null) {
  var elModal = document.querySelector(".modal");
  elModal.style.display = openOrClose ? "block" : "none";

  if (!openOrClose) return;

  var elFormWrapper = document.querySelector(".content-wrapper");
  elFormWrapper.innerHTML = renderForm(addOrEdit, bookId);

  var elSpan = document.querySelector(".action-name");
  console.log("elSpan:", elSpan);
  elSpan.innerText = addOrEdit ? "Add" : "Update";

  if (!addOrEdit) {
    var book = getBook(bookId);
    console.log("book:", book);
    var elInputs = document.querySelectorAll(".modal-form input");
    elInputs[0].value = book.name;
    elInputs[1].value = book.price;
  }
}

// render read modal
function renderReadModal(openOrClose, book) {
  var elModal = document.querySelector(".modal-book-details");
  if (!openOrClose) {
    elModal.style.display = "none";
    return;
  }

  console.log("book:", book);

  var elBookName = document.querySelector(".book-name");
  elBookName.innerText = book.name;
  var elBookPrice = document.querySelector(".book-price");
  elBookPrice.innerText = book.price;

  var elBookImg = document.querySelector(".book-image");
  elBookImg.src = `./src/images/${book.imgUrl}`;

  elModal.style.display = "block";
}

//render pagination nav
function renderPaginationNav() {
  var pageSize = getPageSize();
  var booksAmount = getBookLength();
  var btnAmount = Math.ceil(booksAmount / pageSize);
  // btnAmount = btnAmount < 1 ? 0 : btnAmount;
  var strHTML = "";

  for (let i = 0; i < btnAmount; i++) {
    strHTML += /*html*/ `
        <button onclick="onPageClick(${i})">
            ${i + 1}
        </button>\n`;
  }
  elPageNav = document.querySelector(".page-nav");
  elPageNav.innerHTML = strHTML;

  // return strHTML;
}

//FORM logic
//form hanlder
function onSubmitBookDetails(ev, addOrEdit, bookId) {
  ev.preventDefault();

  var formData = {};
  var inputErrors = false;
  var elInputs = document.querySelectorAll(".modal-form input");
  elInputs.forEach(function (input) {
    var name = input.name;
    var value = input.value;
    formData[name] = value;
  });

  if (formData.name === "") {
    validateInput(elInputs[0], "book", "please enter book name");
    inputErrors = true;
  }

  if (formData.price === "" || isNaN(+formData.price)) {
    elInputs[1].value = null;
    validateInput(elInputs[1], "price", "please enter price");
    inputErrors = true;
  }

  if (inputErrors) return;

  //use addOrEdit

  if (addOrEdit) {
    //create new
    addBook(formData.name, formData.price);
  } else {
    //update
    updateBook(bookId, formData.price /**we can add more attr */);
  }
  console.log("bookId:", bookId);
  console.log("addOrEdit:", addOrEdit);
  //end close modal
  renderModal(false);
  renderBooks();
}

///crudl events
//create
function onAddBook() {
  renderModal(true, true);
}

//read
function onReadBook(bookId) {
  var book = getBook(bookId);
  renderReadModal(true, book);
}

// update
function onUpdateBook(bookId, price) {
  renderModal(true, false, bookId);
}

// delete
function onRemoveBook(bookId) {
  removeBook(bookId);
  renderBooks();
}

//rating
function onRateClick(bookId, addOrDecrease) {
  rateBook(bookId, addOrDecrease);
  renderBooks();
}

//list --bonus(pagination)
//catch click for page size setting
function onSetPageSizeClick(num) {
  // debugger;
  setPageSize(num);
  renderBooks();
}

function onPageClick(pageNumber) {
  // debugger;
  setPageNum(pageNumber);
  renderBooks();
}
