const BOOK_STORAGE_KEY = "bookdb";

var gBooks = [];
var gPageSize = 1;
var gPageNum = 0;
var gBookPageArr = [];
_createBooks();

///crudl service

//Create
function addBook(name, price = 0, imgUrl = "noname.jpg") {
  var book = { id: makeId(), name, price, imgUrl };
  gBooks.push(book);
  setPageNum(0);
  saveToStorage(BOOK_STORAGE_KEY, gBooks);
}

function _createBooks() {
  //get from ls
  var fetchedBooks = loadFromStorage(BOOK_STORAGE_KEY);
  if (!fetchedBooks) {
    gBooks = [
      {
        id: "TNXLMz",
        name: "Story of the Eye",
        price: 45,
        imgUrl: "Story of the Eye.jpg",
        rating: 1
      },
      {
        id: "HJyGny",
        name: "Going For a Beer: Selected Short Fictions",
        price: 40,
        imgUrl: "Going For a Beer.jpg",
        rating: 1
      },
      {
        id: "BFpkRZ",
        name: "The 120 Days of Sodom",
        price: 62,
        imgUrl: "The 120 Days of Sodom.jpg",
        rating: 1
      },
      {
        id: "62mklp",
        name: "Venus in Furs",
        price: 19.99,
        imgUrl: "Venus in Furs.jpg",
        rating: 1
      }
    ];
    saveToStorage(BOOK_STORAGE_KEY, gBooks);
    return;
  }
  gBooks = fetchedBooks;
}

// Read
function getBook(bookId) {
  return _getBookById(bookId);
}

//update
function updateBook(bookId, bookPrice /**we can add more attr */) {
  console.log("bookPrice:", bookPrice);
  var bookToUpdate = _getBookById(bookId);
  console.log("bookToUpdate:", bookToUpdate);
  var bookIdx = _getBookIdx(bookToUpdate);
  console.log("bookIdx:", bookIdx);
  if (bookToUpdate === -1) {
    console.error({ bookToUpdate, bookId });
    return;
  }

  bookToUpdate.price = bookPrice;
  setPageNum(0);
  saveToStorage(BOOK_STORAGE_KEY, gBooks);
}

//delete
function removeBook(bookId) {
  var bookIdx = _getBookIdx(bookId);
  console.log("bookIdx:", bookIdx);
  if (bookIdx === -1) return;
  gBooks.splice(bookIdx, 1);
  setPageNum(0);
  saveToStorage(BOOK_STORAGE_KEY, gBooks);
}

// delete all
function _deleteBooks() {
  setPageNum(0);
  saveToStorage(BOOK_STORAGE_KEY, []);
}

// rate bookl
function rateBook(bookId, addOrDecrease) {
  var book = getBook(bookId);

  if ((!addOrDecrease && book.rating < 1) || (addOrDecrease && book.rating > 9))
    return;

  addOrDecrease ? book.rating++ : book.rating--;
  saveToStorage(BOOK_STORAGE_KEY, gBooks);
}

//internal funcs
function _getBookById(bookId) {
  return gBooks.find(function (book) {
    return book.id === bookId;
  });
}

function _getBookIdx(bookId) {
  return gBooks.findIndex(function (book) {
    return book.id === bookId;
  });
}

//list --bonus(pagination)
function setPageSize(num) {
  gPageSize = num;
  setPageNum(0);
  setBookPageArr();
}

function setPageNum(pageNum) {
  gPageNum = pageNum;
  setBookPageArr();
}

function setBookPageArr() {
  var start = gPageSize * gPageNum;
  var end = start + gPageSize;
  console.log("start, end:", start, end);
  gBookPageArr = gBooks.slice(start, end);
  if (!gBookPageArr.length) {
    console.log("start:", start);
    gBookPageArr = gBooks.slice(0, gBooks.length - 1);
  }

  console.log({ gPageSize, gPageNum, gBookPageArr });
  console.log("gBookPageArr:", gBookPageArr);
}

function getPageSize() {
  return gPageSize;
}

function getBookLength() {
  return gBooks.length;
}
