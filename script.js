let currentBalance = 0;
let currentOverdraft = 0;
let overdraftLimit = 500;
const message = document.getElementById('message');


// call by reference and call by value - look this up.

// depositAmt value is treated as string. If use + with a number, the number will 
// be converted to a string and will then concatenate
// if use - with a number, it will convert the depositAmt to a number, and do the maths
// best practise is to ensure input values are converted to number e.g. parseFloat 

function deposit(event) {
// note to self: read more into how the 'event' works (the 'event object')
// here I used 'event' to stop page refreshing on submit input, alternatively use html <button> (see withdraw).
// pressing Enter for Deposit button runs correctly, but on withdraw Button, Enter resets/refreshes page
// is there any advantage to using a form submit here, rather than <button>?
    event.preventDefault();
// first write a line to delete any textContent in message line
// ways to do this can involve frameworks, or set formatting in CSS to leave a gap
// Below current solution is inelegant, but easiest option
    message.textContent = ' ';
// input field value is taken as string, must convert to number, used parseFloat below
// and how best to restrict to 2 decimal points?
    const depositAmtString = document.getElementById('depositAmt').value;
    const checkDecimals = depositAmtString.split('.');
    const depositAmt = parseFloat(depositAmtString);
    if (isNaN(depositAmt) || depositAmt === "" || depositAmt <= 0 || (checkDecimals[1] !== undefined && checkDecimals[1].length > 2)) {
        message.textContent = 'Deposit must be a valid amount greater than £0';
        message.classList.remove('messageInfo');
        flashRed();
    } else if (currentOverdraft > 0 && currentOverdraft - depositAmt > 0) {
        currentOverdraft = twoDecimals(currentOverdraft - depositAmt);
        document.getElementById('currentOverdraft').innerHTML = '£' + currentOverdraft.toFixed(2);
    } else if (currentOverdraft > 0 && currentOverdraft - depositAmt <= 0) {
        currentBalance = twoDecimals(depositAmt - currentOverdraft);
        currentOverdraft = 0;
        document.getElementById('currentBalance').innerHTML = '£' + currentBalance.toFixed(2);
        document.getElementById('currentOverdraft').innerHTML = '£' + currentOverdraft.toFixed(2);
    } else {
        // currentBalance = Math.round(((currentBalance + depositAmt) * 1e2 ) / 1e2);
        // currentBalance = Math.round((currentBalance * 1e2 ) / 1e2);
        // currentBalance = parseFloat((currentBalance + depositAmt).toFixed(2));
        currentBalance = twoDecimals(currentBalance + depositAmt);
        document.getElementById('currentBalance').innerHTML = '£' + currentBalance.toFixed(2);
    }
// to reset field - but using document.getElementById('depositAmt').reset() or ...value.reset()
// function also resets the balance calculations?
    document.getElementById('formDeposit').reset();
    // document.getElementById('depositAmt').value = '';
    document.getElementById('depositAmt').blur();
    inOverdraft();
}

document.getElementById('formDeposit').addEventListener('submit', deposit);


function withdraw(event) {
    event.preventDefault();
    message.textContent = ' ';
// how best to restrict to 2 decimal points?
    const withdrawAmtString = document.getElementById('withdrawAmt').value;
    const checkDecimals = withdrawAmtString.split('.');
    const withdrawAmt = parseFloat(withdrawAmtString);
    const testCurrentBalance = currentBalance - withdrawAmt;
    const testOverdraft = (overdraftLimit - currentOverdraft) - (withdrawAmt - currentBalance);
// Codebar (Dean) says IF statement is fine; SWITCH statement makes no difference and devs often avoid it
    if (isNaN(withdrawAmt) || withdrawAmt === "" || withdrawAmt <= 0 || (checkDecimals[1] !== undefined && checkDecimals[1].length > 2)) {
        message.textContent = 'Withdraw must be a valid amount greater than £0';
        flashRed();
    } else if (testCurrentBalance < 0 && testOverdraft < 0) {
        message.textContent = 'Insufficient funds!';
        flashRed();
    } else if (testCurrentBalance < 0 && testOverdraft >= 0) {
        currentOverdraft = Math.abs(currentOverdraft + (withdrawAmt - currentBalance));
        currentBalance = 0;
        document.getElementById('currentBalance').innerHTML = '£' + currentBalance.toFixed(2);
        document.getElementById('currentOverdraft').innerHTML = '£' + currentOverdraft.toFixed(2);
    } else if (testCurrentBalance >= 0) {
        // currentBalance = Math.round(((testCurrentBalance) * 1e2 ) / 1e2);
        currentBalance = twoDecimals(testCurrentBalance);
        document.getElementById('currentBalance').innerHTML = '£' + currentBalance.toFixed(2);
    }
// to reset field - but using document.getElementById('withdrawAmt').reset() or ...value.reset()
// function also resets the balance calculations?
    // document.getElementById('withdrawAmt').value = '';
    document.getElementById('formWithdraw').reset();
    document.getElementById('withdrawAmt').blur();
    inOverdraft();

}

document.getElementById('formWithdraw').addEventListener('submit', withdraw);


function decreaseOverdraft() {
    message.textContent = ' ';
    if (overdraftLimit === 0) {
        message.textContent = 'Minimum overdraft limit reached';
        flashRed();
    } else if ((overdraftLimit - 50) < currentOverdraft) {
        message.textContent = 'Cannot reduce Overdraft Limit due to current Overdraft balance';
        flashRed();
    } else {
        overdraftLimit = overdraftLimit - 50;
        document.getElementById('overdraftLimit').innerHTML = '£' + overdraftLimit;
    }
}

document.getElementById('decrease').addEventListener('click', decreaseOverdraft);


function increaseOverdraft() {
    message.textContent = ' ';
    if (overdraftLimit === 1000) {
        message.textContent = 'Maximum overdraft limit reached';
        flashRed();
    } else {
        overdraftLimit = overdraftLimit + 50;
        document.getElementById('overdraftLimit').innerHTML = '£' + overdraftLimit; 
    }
}

document.getElementById('increase').addEventListener('click', increaseOverdraft);


function inOverdraft() {
    if (currentOverdraft > 0) {
        document.getElementById('currentOverdraft').classList.add('inOverdraft');
    } else if (currentOverdraft === 0) {
        document.getElementById('currentOverdraft').classList.remove('inOverdraft');
    }
}


function flashRed () {
    message.classList.remove('messageInfo');
    setTimeout(function() {
        message.classList.add('messageInfo');
    }, 0);
}


function twoDecimals (value) {
    return Math.round(value * 100) / 100;
}

