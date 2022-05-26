const web3 = require("@solana/web3.js");
const conncetion = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

console.log(conncetion);
