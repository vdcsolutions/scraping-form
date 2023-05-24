const addButton = document.getElementById("add-button");
const scrapeButton = document.getElementById("scrape-button");
const container = document.querySelector(".container");
const urlsInput = document.getElementById("urls-input");
const jsonOutput = document.getElementById("json-output");

addButton.addEventListener("click", function () {
  const newInputContainer = document.createElement("div");
  newInputContainer.classList.add("input-container");

  const select = document.createElement("select");
  const option1 = document.createElement("option");
  option1.value = "xpath";
  option1.text = "XPath";
  const option2 = document.createElement("option");
  option2.value = "css";
  option2.text = "CSS";
  select.appendChild(option1);
  select.appendChild(option2);

  const input1 = document.createElement("input");
  input1.type = "text";

  const input2 = document.createElement("input");
  input2.type = "text";

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.textContent = "Remove";

  newInputContainer.appendChild(select);
  newInputContainer.appendChild(input1);
  newInputContainer.appendChild(input2);
  newInputContainer.appendChild(removeButton);

  container.insertBefore(newInputContainer, addButton);
});

container.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-button")) {
    event.target.parentElement.remove();
  }
});

scrapeButton.addEventListener("click", function () {
  const urls = urlsInput.value.split("\n").map((url) => url.trim()).filter((url) => url !== "");
  const inputContainers = document.querySelectorAll(".input-container");

  const payload = [];
  inputContainers.forEach(function (container) {
    const select = container.querySelector("select"); // Update the selector here
    const inputs = container.querySelectorAll("input[type='text']");

    if (select && inputs.length === 2) {
      const type = select.value;
      const name = inputs[0].value;
      const selector = inputs[1].value;

      payload.push({
        name: name,
        type: type,
        selector: selector
      });
    }
  });

  const jsonData = {
    urls: urls,
    payload: payload
  };

  jsonOutput.textContent = JSON.stringify(jsonData, null, 2);
});
