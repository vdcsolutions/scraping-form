<script>
  import { writable } from 'svelte/store';

  // Create writable stores for the preloaded data
  const preloadedUrls = writable('');
  const preloadedPayloadItems = writable([]);
  const responseData = writable(null);
  const awaitingResponse = writable(false); // Change initial value to false

  // Define the preloaded JSON data
  const preloadedData = {
    urls: ["https://webscraper.io/test-sites/tables"],
    payload: [
      {
        name: "first_names",
        type: "xpath",
        selector: "tbody td:nth-of-type(2)"
      },
      {
        name: "last_names",
        type: "xpath",
        selector: "tbody td:nth-of-type(3)"
      },
      {
        name: "usernames",
        type: "xpath",
        selector: "tbody td:nth-of-type(4)"
      }
    ]
  };

  // Set the preloaded data in the writable stores
  preloadedUrls.set(preloadedData.urls.join('\n'));
  preloadedPayloadItems.set(preloadedData.payload);

  // Function to add a new payload input
  function addInput() {
    preloadedPayloadItems.update(items => [...items, { type: 'xpath', name: '', selector: '' }]);
  }

  // Function to remove a payload input
  function removeInput(index) {
    preloadedPayloadItems.update(items => items.filter((item, i) => i !== index));
  }

  // Function to handle the scrape button click
  async function scrape() {
    // Set awaitingResponse to true
    awaitingResponse.set(true);

    // Process the URLs
    const urlsList = $preloadedUrls.split('\n').map(url => url.trim()).filter(url => url !== '');

    // Filter payload items that have all fields filled
    const payload = $preloadedPayloadItems.filter(item => item.type && item.name && item.selector);

    // Prepare the JSON data
    const jsonData = {
      urls: urlsList,
      payload: payload
    };

    try {
      // Send the JSON data to the server
      const response = await fetch('http://172.104.142.79/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });

      // Parse the response JSON
      const responseDataValue = await response.json();

      // Update the response data in the store
      responseData.set(responseDataValue);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Set awaitingResponse to false
      awaitingResponse.set(false);
    }
  }
</script>

<style>
  /* Add your custom styles here */
</style>

<h1>Web Scraper</h1>

<div class="container">
  <div class="input-container">
    <textarea bind:value={$preloadedUrls} rows="5" placeholder="Enter one URL per line"></textarea>
  </div>

  {#each $preloadedPayloadItems as payloadItem, index}
    <div class="input-container">
      <select bind:value={payloadItem.type}>
        <!-- Options for payload type selection -->
        <option value="xpath">XPath</option>
        <option value="css">CSS</option>
      </select>
      <input bind:value={payloadItem.name} type="text" placeholder="Name">
      <input bind:value={payloadItem.selector} type="text" placeholder="Selector">
      <button on:click={() => removeInput(index)} class="remove-button">Remove</button>
</div>
{/each}

<button on:click={addInput} id="add-button">Add</button>
</div>
<button on:click={scrape} id="scrape-button" disabled={$awaitingResponse}>Scrape</button>

{#if $responseData !== null}
  <div id="table-output">
    {#if $awaitingResponse}
      <p>Loading...</p>
    {:else}
      {#each $responseData as data}
        <table>
          <tbody>
            {#each Object.values(data.result)[0] as _, index}
              {#if index === 0}
                <tr>
                  <th>URL</th>
                  {#each Object.keys(data.result) as key}
                    <th>{key}</th>
                  {/each}
                </tr>
              {/if}
              <tr>
                {#if index === 0}
                  <td rowspan={Object.values(data.result)[0].length}>{data.urls[0]}</td>
                {/if}
                {#each Object.values(data.result) as value}
                  <td>{value[index]}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {/each}
    {/if}
  </div>
{/if}
