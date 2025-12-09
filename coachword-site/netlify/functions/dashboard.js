// ---------------- AUTH ----------------
if (localStorage.getItem("cj_logged_in") !== "1") {
  window.location.href = "login.html";
} else {
  document.getElementById("welcomeTitle").textContent =
    "Welcome, " + (localStorage.getItem("cj_username") || "Member");
}

// ---------------- LOGOUT ----------------
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("cj_logged_in");
  localStorage.removeItem("cj_username");
  window.location.href = "login.html";
};

// ---------------- CONTRACT INFO ----------------
const cjContract = "0x9ECEfef5d5B5b0aCF2467393e7b5A6c7c501c6F6";
const priceURL =
  "https://api.geckoterminal.com/api/v2/networks/bsc/pools/0x832e1e4afee57aa9ddd2f8c81a31d0814d9a15a0";

let userWallet = null;

// ---------------- CONNECT WALLET ----------------
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not detected!");
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  userWallet = accounts[0];

  const short = userWallet.slice(0, 6) + "..." + userWallet.slice(-4);
  document.getElementById("walletInfo").innerHTML =
    `🔐 Connected:<br><strong>${short}</strong>`;

  fetchBalance();
}

document.getElementById("connectWallet").onclick = connectWallet;


// ---------------- FETCH BALANCE ----------------
async function fetchBalance() {
  if (!userWallet) return;

  const balanceInfo = document.getElementById("balanceInfo");
  balanceInfo.innerHTML = "Fetching balance...";

  try {
    // Load all transfers
    const txReq = await fetch(
      `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${cjContract}&address=${userWallet}&sort=asc&apikey=P5BQN32DT2E3GVB2G2UDA6XE3XPASNTG5N`
    );
    const txData = await txReq.json();

    if (txData.status !== "1") {
      balanceInfo.innerHTML = "⚠️ No balance history found.";
      return;
    }

    let received = 0;
    let sent = 0;

    txData.result.forEach(tx => {
      const amount = Number(tx.value) / 1e18;
      if (tx.to.toLowerCase() === userWallet.toLowerCase()) received += amount;
      if (tx.from.toLowerCase() === userWallet.toLowerCase()) sent += amount;
    });

    const cjBal = received - sent;

    // PRICE
    let priceUSD = 0;
    try {
      const pReq = await fetch(priceURL);
      const pJSON = await pReq.json();
      priceUSD = parseFloat(pJSON.data.attributes.base_token_price_usd);
    } catch {}

    const totalUSD = cjBal * priceUSD;

    balanceInfo.innerHTML = `
      💰 <strong>${cjBal.toLocaleString(undefined, { maximumFractionDigits: 6 })}</strong> CJ<br>
      💵 <strong>$${totalUSD.toFixed(4)}</strong> USD
    `;

  } catch (err) {
    balanceInfo.innerHTML = "⚠️ Could not fetch balance.";
    console.log(err);
  }
}


// ---------------- STATIC INFO ----------------
document.getElementById("statsBox").innerHTML = `
  🔹 <strong>Total Supply:</strong> 21,000,000 CJ<br>
  🔹 <strong>Chain:</strong> BNB Smart Chain<br>
  🔹 <strong>Contract:</strong> Verified<br>
  🔹 <strong>Ledger:</strong> Transfer-tracked asset
`;


// ---------------- KEEP TAB ----------------
document.querySelectorAll('a').forEach(link => {
  const url = new URL(link.href, window.location.origin);
  if (url.hostname === window.location.hostname) {
    link.onclick = function (e) {
      e.preventDefault();
      window.location.href = link.href;
    };
  }
});
