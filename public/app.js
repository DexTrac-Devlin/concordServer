document.getElementById('get-balance').addEventListener('click', async () => {
  const address = document.getElementById('balance-address').value;
  const response = await fetch(`/api/balance/${address}`);
  const data = await response.json();

  if (response.ok) {
    document.getElementById('balance-result').textContent = `Balance: ${data.balance}`;
  } else {
    document.getElementById('balance-result').textContent = `Error: ${data.error}`;
  }
});

document.getElementById('get-block').addEventListener('click', async () => {
  const blockNumber = document.getElementById('block-number').value;
  const response = await fetch(`/api/block/${blockNumber}`);
  const data = await response.json();

  if (response.ok) {
    document.getElementById('block-result').textContent = JSON.stringify(data, null, 2);
  } else {
    document.getElementById('block-result').textContent = `Error: ${data.error}`;
  }
});

async function deployOracleContract() {
  const contractAddress = document.getElementById('contractAddress').value;
  const ownerAddress = document.getElementById('ownerAddress').value;
  const fulfillerAddress = document.getElementById('fulfillerAddress').value;

  const response = await fetch('/api/contracts/deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractAddress, ownerAddress, fulfillerAddress }),
  });

  const data = await response.json();
  console.log(data);
}

document.getElementById('get-logs').addEventListener('click', async () => {
  const filterJson = document.getElementById('logs-filter').value;
  let filter;

  try {
    filter = JSON.parse(filterJson);
  } catch (err) {
    document.getElementById('logs-result').textContent = `Error: Invalid JSON`;
    return;
  }

  const response = await fetch('/api/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(filter)
  });
  const data = await response.json();

  if (response.ok) {
    document.getElementById('logs-result').textContent = JSON.stringify(data, null, 2);
  } else {
    document.getElementById('logs-result').textContent = `Error: ${data.error}`;
  }
});
