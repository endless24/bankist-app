"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2024-06-06T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const account5 = {
//   owner: 'Joseph Iroh',
//   movements: [230, 2000, 300, 500, 100],
//   interestRate: 1.3,
//   pin: 5555,
// };
// const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

///////////////////////////////////////////////////
// BANKIST-APP CODE BASE

//date function
const formatedMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//////////////////////////////////////
// currency format
const formatedCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//////////////////////////////////////////////
//fetching the data
const displayMovements = function (acct, sort = false) {
  containerMovements.innerHTML = "";
  // sorting the moves in ascending order
  const movs = sort
    ? acct.movements.slice().sort((a, b) => a - b)
    : acct.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    // date
    const date = new Date(acct.movementsDates[i]);
    const displayDate = formatedMovementDate(date, acct.locale);
    // calling formated currency func
    const formatedMov = formatedCur(mov, acct.locale, acct.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// ////////////////////////////////////
// calculating balance
const calcDisplayBalance = function (acct) {
  acct.balance = acct.movements.reduce((acc, value) => acc + value, 0);
  // calling formated currency func
  const formatedMov = formatedCur(acct.balance, acct.locale, acct.currency);
  labelBalance.textContent = `${formatedMov}`;
};

// ///////////////////////////////
// calculating the summary value in
const calcSummary = function (acct) {
  // summing deposit
  const incomes = acct.movements
    .filter((deposit) => deposit > 0)
    .reduce((acc, value) => acc + value, 0);
  // calling formated currency func
  labelSumIn.textContent = `${formatedCur(
    incomes,
    acct.locale,
    acct.currency
  )}`;

  // summing withdraw
  const outinComes = acct.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatedCur(
    Math.abs(outinComes),
    acct.locale,
    acct.currency
  )}`;

  // interest
  const interest = acct.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acct.interestRate) / 100)
    .filter((ints) => ints >= 1)
    .reduce((acc, value) => acc + value);
  labelSumInterest.textContent = `${formatedCur(
    interest,
    acct.locale,
    acct.currency
  )}`;
};

// ///////////////////////////////
// computing userNames
const createUserName = function (accts) {
  accts.forEach((acct) => {
    acct.userName = acct.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);
// console.log(accounts);

// /////////////////////////
// function that uppdate the UI
const updateUi = function (acct) {
  // Display movement
  displayMovements(acct);
  // Display balance
  calcDisplayBalance(acct);
  //Display summary
  calcSummary(acct);
};

/////////////////////////////////////
// Logout timer
const startLogoutTimer = function () {
  const tick = function () {
    // mins
    const min = String(Math.trunc(time / 60)).padStart("2", 0);
    const sec = String(time % 60).padStart("2", 0);
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When is 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      // message
      labelWelcome.textContent = "Log in to get started";
      // show UI
      containerApp.style.opacity = 0;
    }

    // Decrese 1s
    time--;
  };
  //Set time to 5 minutes
  let time = 300;
  // Call timer every seconds
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// ////////////////////////////////////
// Login
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  //  // Check if pin userName exist
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  // Check if pin exist
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    // show UI
    containerApp.style.opacity = 1;

    //Experience API date
    const now = new Date();
    const option = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);

    // Clear the input field
    inputLoginPin.value = inputLoginUsername.value = "";
    // Input field lose focus
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // timer function
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUi(currentAccount);
  }
});

// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 1;

// //////////////////////////////////////////

// Transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  // checking is the receiver acct exist
  // Checking if there is money in the acct
  // Checking if the balance is greater than the amoun you are transfering
  // Preventing not to transfer to itself
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.userName !== currentAccount.userName
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    //current date
    currentAccount.movementsDates.push(new Date().toDateString());
    recieverAcc.movementsDates.push(new Date().toDateString());
    // Update UI
    updateUi(currentAccount);

    // reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// ////////////////////////////////////////////
// LOAN
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  // deposit must be greater than equal to 10% before load can be granted
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // deposit
      currentAccount.movements.push(amount);

      // add load date
      currentAccount.movementsDates.push(new Date().toDateString());
      // /update the UI
      updateUi(currentAccount);

      // reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

// ////////////////////////////////////////////
// Close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  // Checking if the username and pin is correct
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (user === currentAccount.userName && pin === currentAccount.pin) {
    const index = accounts.findIndex(
      (acct) => acct.userName === currentAccount.userName
    );
    // Delete the account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
    // console.log(accounts);
  }
});

// ////////////////////////////////////////////
// SORT()

let sorted = false; //checking state of sorting

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(Number('23'));
// // short for of converting strigs to number
// console.log(+'23');

// // parsing
// console.log(Number.parseInt('30px', 10)); //in base 10
// console.log(Number.parseInt('e23', 10)); //in base 10

// console.log(Number.parseFloat('2.5rem'));

// // /how to check if a value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));

// // checking if value is integer
// console.log(Number.isInteger(20));
// console.log(Number.isInteger(20.0));
// console.log(Number.isInteger(20 / 0));

// //  Math and Rounding
// console.log(Math.sqrt(25)); //square root
// console.log(25 ** (1 / 2));

// console.log(8 ** (1 / 3)); //cubic root

// // maximum value
// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.max(5, 18, '23', 11, 2));
// console.log(Math.max(5, 18, '23px', 11, 2));

// // minimum value
// console.log(Math.min(5, 18, 23, 11, 2));
// console.log(Math.min(5, 18, 23, 11, '2'));
// console.log(Math.min(5, 18, 23, 11, '2px'));

// // calculate radius of circle with 10 pixes
// console.log(Math.PI * Number.parseInt('10px') ** 2); // area of a circle

// // random number
// console.log(Math.trunc(Math.random() * 6) + 1); //6 random number

// //rounding integer
// console.log(Math.trunc(23.3));
// console.log(Math.floor(23.3));
// console.log(Math.ceil(23.3));

// // decimal number
// console.log((2.7).toFixed(0)); //toFixed returns strings
// console.log((2.7).toFixed(3)); //toFixed returns strings
// console.log((2.345).toFixed(2)); //toFixed returns strings
// console.log(+(2.345).toFixed(2)); //converted to number with the plus sign +

// // reminder
// console.log(5 % 2);
// console.log(5 / 2); // 5 = 2 * 2 + 1

// console.log(8 % 3);
// console.log(8 / 3); // 8 = 2 * 3 + 2

// console.log(6 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(300));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) {
//       //0,2,4,6
//       row.style.backgroundColor = 'orangered';
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor = 'blue';
//     }
//   });
// });

// // Numeric seperator
// // 287,460,000,000
// const diameter = 287_460_000_000;

// // /BIGINT
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(23487734643975494646854679842998546n);
// console.log(BigInt(348773464));

// // operators
// console.log(10000n + 10000n);

// // date
// // console.log(new Date().toDateString());

//calculating days that pass
// const future = new Date(2037, 10, 19, 15, 23);
// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);

// const day1 = calcDaysPassed(new Date(2037, 10, 9), new Date(2037, 10, 19));
// console.log(day1);

// Internationlization
const num = 34564474.86;
const option = {
  style: "currency",
  currency: "EUR",
};
// console.log('Germany:', new Intl.NumberFormat('de', option).format(num));
// console.log('Greek:', new Intl.NumberFormat('el').format(num));

// timer out
// setTimeout(() => console.log("it's time"), 5000);
const ingredient = ["olives", "spinach"];
const fruitTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is the fruit with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredient
);
if (ingredient.includes("spinach")) clearTimeout(fruitTimer);

// setIterval
setInterval(() => {
  const now = new Date();
  const hours = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();

  // console.log(`${hours}:${min}:${sec}`);
}, 1000);
