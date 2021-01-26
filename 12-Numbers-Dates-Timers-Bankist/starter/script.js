'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const EURTOUSD = 1.2;

const currencySymbols = {
	currency: {
		USD: '$',
		EUR: '€',
	},
};

const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2020-05-27T17:01:17.194Z',
		'2020-07-11T23:36:17.929Z',
		'2020-07-12T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'pt-PT', // de-DE
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const describeMovement = function (movement, index)
{
	if (movement > 0)
	{
		return `Movement ${ index + 1 }: You deposited ${ movement }`;
	} else
	{
		return `Movement ${ index + 1 }: You withdraw ${ Math.abs(movement) }`;
	}
};
// utility
const getInitials = function (account)
{
	return account.owner
		.toLowerCase()
		.split(' ')
		.map(function getFirstLetter (word)
		{
			return word[0];
		})
		.join('');
};

// filter
const positiveFilter = function (value, index, values)
{
	return value > 0;
};
const negtiveFilter = function (value, index, values)
{
	return value < 0;
	``;
};
const biggerThan1Filter = function (value, index, values)
{
	return value > 1;
};
// mapper
const eurToUsdMapper = function (value, index, values)
{
	return value * 1.2;
};

const toAbsMapper = function (value, index, values)
{
	return Math.abs(value);
};
// reducer
const sumReducer = function (sum, value, index, values)
{
	return sum + value;
};

const avgReducer = function (avg, value, index, values)
{
	return avg + value / values.length;
};

// calculator
const calcBalance = function (account)
{
	return Number(account.movements.reduce(sumReducer).toFixed(2));
};

const calcSumIn = function (account)
{
	return Number(
		account.movements.filter(positiveFilter).reduce(sumReducer).toFixed(2)
	);
};

const calcSumOut = function (account)
{
	return Math.abs(
		Number(
			account.movements.filter(negtiveFilter).reduce(sumReducer).toFixed(2)
		)
	);
};

const calcSumInsterst = function (account)
{
	return Number(
		account.movements
			.filter(positiveFilter)
			.map(movement => (movement * account.interestRate) / 100)
			.filter(interest => interest >= 1)
			.reduce(sumReducer)
			.toFixed(2)
	);
};

// finder
const negtiveFinder = function (value)
{
	return value < 0;
};
// display

const upDateUI = function (account)
{
	displayBalance(account);
	displayMovements(account);
	displaySumIn(account);
	displaySumOut(account);
	displaySumInterest(account);
};

const displayBalance = function (account)
{
	var balance = calcBalance(account);
	labelBalance.textContent = Intl.NumberFormat(account.locale, {
		style: 'currency',
		currency: account.currency,
	}).format(balance);
};

const displaySumIn = function (account)
{
	var sumIn = calcSumIn(account);
	labelSumIn.textContent = Intl.NumberFormat(account.locale, {
		style: 'currency',
		currency: account.currency,
	}).format(sumIn);
};

const displaySumOut = function (account)
{
	var sumOut = calcSumOut(account);
	labelSumOut.textContent = Intl.NumberFormat(account.locale, {
		style: 'currency',
		currency: account.currency,
	}).format(sumOut);
};

const displayMovements = function (account)
{
	containerMovements.innerHTML = '';

	account.movements.forEach(function (movement, index)
	{
		var type = movement > 0 ? 'deposit' : 'withdrawal';

		var html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${ type }">
          ${ index + 1 } ${ type }
        </div>
        <div class="movements__value">
        ${ Intl.NumberFormat(account.locale, {
			style: 'currency',
			currency: account.currency,
		}).format(movement) }
        </div>
      </div>
    `;

		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const displaySumInterest = function (account)
{
	var sumInterest = calcSumInsterst(account);
	labelSumInterest.textContent = Intl.NumberFormat(account.locale, {
		style: 'currency',
		currency: account.currency,
	}).format(sumInterest);
};

// event handler
let currentAccount, recipientAccount;

const login = function (e)
{
	e.preventDefault();

	currentAccount = accounts.find(
		account => getInitials(account) === inputLoginUsername.value
	);

	if (currentAccount?.pin == inputLoginPin.value)
	{
		containerApp.style.opacity = '100';

		upDateUI(currentAccount);
	}
};

const transfer = function (e)
{
	e.preventDefault();

	const amount = Number(inputTransferAmount.value);

	recipientAccount = accounts.find(
		account => getInitials(account) == inputTransferTo.value
	);

	if (
		recipientAccount !== undefined &&
		amount > 0 &&
		calcBalance(currentAccount) >= amount &&
		getInitials(currentAccount) !== getInitials(recipientAccount)
	)
	{
		currentAccount.movements.push(-amount);
		recipientAccount.movements.push(amount);

		upDateUI(currentAccount);
	}
};

const closeAccount = function (e)
{
	e.preventDefault();
	if (
		getInitials(currentAccount) === inputCloseUsername.value &&
		String(currentAccount.pin) === inputClosePin.value
	)
	{
		const currentAcountIndex = accounts.findIndex(
			account => account === currentAccount
		);

		accounts.splice(currentAcountIndex, 1);

		containerApp.style.opacity = '0';
		inputLoginUsername.value = '';
		inputLoginPin.value = '';
		inputCloseUsername.value = '';
		inputClosePin.value = '';
	}
};

const getLoan = function (e)
{
	e.preventDefault();

	const amount = Number(inputLoanAmount.value);

	if (amount > 0 && currentAccount.movements.some(movement => movement >= amount))
	{
		currentAccount.movements.push(amount);
		upDateUI(currentAccount);
	}


};
// implament

btnLogin.addEventListener('click', login);
btnTransfer.addEventListener('click', transfer);
btnClose.addEventListener('click', closeAccount);
btnLoan.addEventListener("click", getLoan);



