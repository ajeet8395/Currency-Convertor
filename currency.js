//! API key from ExchangeRate-API
const API_KEY = "abe1c52118069e17838876e5";

// Selecting elements
const inputCurr = document.getElementById("inputCurr");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const exchangeRateMsg = document.querySelector(".msg");
const form = document.querySelector("form");
const dropdowns = document.querySelectorAll(".select-container select");
const swapIcon = document.querySelector(".fa-arrow-right-arrow-left");

// for loop for adding country data from code.js file and make it dynamic
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target); //! target use for everytime when we change and where it'll change.
  });
}

// update the flag according to the countryCode.
const updateFlag = (e) => {
  let currCode = e.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = e.parentElement.querySelector("img");
  img.src = newSrc;
};

// Function to get exchange rate
const getExchangeRate = async (from, to) => {
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }
    const data = await response.json();
    return data.conversion_rates[to];
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

// Function to update the exchange rate message
const updateExchangeRate = async (e) => {
  e.preventDefault(); // to stop all previous work means prevent

  let amount = inputCurr.value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  //! If amount is empty or less than 1, set it to 1
  amount = amount === "" || amount < 1 ? 1 : amount;

  // Fetch exchange rate
  const exchangeRate = await getExchangeRate(from, to);
  if (exchangeRate) {
    const convertedAmount = amount * exchangeRate;
    exchangeRateMsg.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
  } else {
    exchangeRateMsg.textContent =
      "Error fetching exchange rate. Please try again.";
  }
};

// Swap functionality when clicking the icon
swapIcon.addEventListener("click", () => {
  // Swap the values of the "from" and "to" currencies
  const tempCurrency = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCurrency;

  // Update flags after the swap
  updateFlag(fromCurrency);
  updateFlag(toCurrency);

  // Optionally, auto-refresh the exchange rate after the swap
  form.dispatchEvent(new Event("submit"));
});

// Event listener for the form submission
form.addEventListener("submit", updateExchangeRate);
