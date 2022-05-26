import { createMint, getMint, getOrCreateAssociatedTokenAccount, mintTo, getAccount,AccountLayout,TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js' 

// Generate keys for Payer, Mint Authority, FreezeAuthority
const payer = Keypair.generate()
const mintAuthority = Keypair.generate()
const freezeAuthority = Keypair.generate()

// Establish Connection
const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed'
)

// Get the aridrop/faucet SOLs
const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL,
);
  
await connection.confirmTransaction(airdropSignature);    

// Let's mint
const mint = await createMint(
    connection, 
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9
)

console.log("Mint Info: ", mint.toBase58())

// const mintInfo = await getMint(
//     connection,
//     mint
//   )
  
//   console.log(mintInfo.supply);

const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
)

console.log("Token Account: ", tokenAccount)

// Mint 100 tokens into the Account
await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    mintAuthority,
    100000000000
)

// Now let's again get the min info, and check the supply
const mintInfo = await getMint(
  connection,
  mint
)

console.log(mintInfo.supply);


// Now let's check the Balance
const tokenAccountInfo = await getAccount(
    connection,
    tokenAccount.address
)

console.log(tokenAccountInfo.amount);

(async () => {

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      new PublicKey('8YLKoCu7NwqHNS8GzuvA2ibsvLrsg22YMfMDafxh1B15'),
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
  
    console.log("Token                                         Balance");
    console.log("------------------------------------------------------------");
    tokenAccounts.value.forEach((e) => {
      const accountInfo = AccountLayout.decode(e.account.data);
      console.log(`${new PublicKey(accountInfo.mint)}   ${accountInfo.amount}`);
    })
  
  })();
  