// Import Solana web3 and other libraries
import {Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction,} from "@solana/web3.js";
// Filesystem and path libraries
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
// Import helper functions for the NFT program
import {
    burnSendAndConfirm,
    CslSplTokenPDAs,
    deriveDocumentMetadataPDA,
    getDocumentMetadata,
    initializeClient,
    mintSendAndConfirm,
    transferSendAndConfirm,
} from "./index";
// SPL Token libraries
import {getMinimumBalanceForRentExemptAccount, getMint, TOKEN_PROGRAM_ID,} from "@solana/spl-token";
// Main entry point
async function main(feePayer: Keypair) {
    const args = process.argv.slice(2);
    const connection = new Connection("https://api.devnet.solana.com", {
        commitment: "confirmed",
    });
// Get program ID from command line
    const progId = new PublicKey(args[0]!);

    initializeClient(progId, connection);

    /**
     * Create a keypair for the mint
     */
    const mint = Keypair.generate();
    console.info("+==== Mint Address  ====+");
    console.info(mint.publicKey.toBase58());

    /**
     * Create two wallets
     */
    const johnDoeWallet = Keypair.generate();
    console.info("+==== John Doe Wallet ====+");
    console.info(johnDoeWallet.publicKey.toBase58());

    const janeDoeWallet = Keypair.generate();
    console.info("+==== Jane Doe Wallet ====+");
    console.info(janeDoeWallet.publicKey.toBase58());

    const rent = await getMinimumBalanceForRentExemptAccount(connection);
    await sendAndConfirmTransaction(
        connection,
        new Transaction()
            .add(
                SystemProgram.createAccount({
                    fromPubkey: feePayer.publicKey,
                    newAccountPubkey: johnDoeWallet.publicKey,
                    space: 0,
                    lamports: rent,
                    programId: SystemProgram.programId,
                }),
            )
            .add(
                SystemProgram.createAccount({
                    fromPubkey: feePayer.publicKey,
                    newAccountPubkey: janeDoeWallet.publicKey,
                    space: 0,
                    lamports: rent,
                    programId: SystemProgram.programId,
                }),
            ),
        [feePayer, johnDoeWallet, janeDoeWallet],
    );


    /**
     * Derive the document Metadata  
     */
    const [document_walletPub] = deriveDocumentMetadataPDA(
        {
            mint: mint.publicKey,
        },
        progId
    );

    console.info("+==== Document_Wallet Metadata Address ====+)");
    console.info(document_walletPub.toBase58());

    /**
     * Derive the John Doe's Associated Token Account, this account will be
     * holding the minted NFT.
     */
    const [johnDoeATA] = CslSplTokenPDAs.deriveAccountPDA({
        wallet: johnDoeWallet.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
    });
    console.info("+==== John Doe ATA ====+");
    console.info(johnDoeATA.toBase58());

    /**
     * Derive the Jane Doe's Associated Token Account, this account will be
     * holding the minted NFT when John Doe transfer it
     */
    const [janeDoeATA] = CslSplTokenPDAs.deriveAccountPDA({
        wallet: janeDoeWallet.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
    });
    console.info("+==== Jane Doe ATA ====+");
    console.info(janeDoeATA.toBase58());

    /**
     * Mint a new NFT into John's wallet (technically, the Associated Token Account)
     */
    console.info("+==== Minting... ====+");
    await mintSendAndConfirm({
        wallet: johnDoeWallet.publicKey,
        assocTokenAccount: johnDoeATA,
        documentType: "Recommendation letter",
        issuer: "Main Office",
        issuanceDate: "16 dec",
        expirationDate: "16 mar",
        additionalInfo:"only for legal use",
        signers: {
            feePayer: feePayer,
            funding: feePayer,
            mint: mint,
            owner: johnDoeWallet,
        },
    });
    console.info("+==== Minted ====+");


    /**
     * Get the minted token
     */
    let mintAccount = await getMint(connection, mint.publicKey);
    console.info("+==== Mint ====+");
    console.info(mintAccount);

    /**
     * Get the Document Metadata
     */
    let document_wallet = await getDocumentMetadata(document_walletPub);
        console.info("+==== Document Metadata ====+");
        console.info(document_wallet);
   console.assert(document_wallet!.assocAccount!.toBase58(), johnDoeATA.toBase58());

    /**
     * Transfer John Doe's NFT to Jane Doe Wallet (technically, the Associated Token Account)
     */
    console.info("+==== Transferring... ====+");
    await transferSendAndConfirm({
        wallet: janeDoeWallet.publicKey,
        assocTokenAccount: janeDoeATA,
        mint: mint.publicKey,
        source: johnDoeATA,
        destination: janeDoeATA,
        signers: {
            feePayer: feePayer,
            funding: feePayer,
            authority: johnDoeWallet,
        },
    });
    console.info("+==== Transferred ====+");

    /**
     * Get the minted token
     */
    mintAccount = await getMint(connection, mint.publicKey);
    console.info("+==== Mint ====+");
    console.info(mintAccount);

    /**
     * Get the Document Metadata
     */
    document_wallet = await getDocumentMetadata(document_walletPub);
        console.info("+==== Document Metadata ====+");
        console.info(document_wallet);
   console.assert(document_wallet!.assocAccount!.toBase58(), johnDoeATA.toBase58());

    /**
     * Burn the NFT
     */
    console.info("+==== Burning... ====+");
    await burnSendAndConfirm({
        mint: mint.publicKey,
        wallet: janeDoeWallet.publicKey,
        signers: {
            feePayer: feePayer,
            owner: janeDoeWallet,
        },
    });
    console.info("+==== Burned ====+");

    /**
     * Get the minted token
     */
    mintAccount = await getMint(connection, mint.publicKey);
    console.info("+==== Mint ====+");
    console.info(mintAccount);

    /**
     * Get the Document Metadata
     */
    document_wallet = await getDocumentMetadata(document_walletPub);
        console.info("+==== Document Metadata ====+");
        console.info(document_wallet);
   console.assert(typeof document_wallet!.assocAccount, "undefined");

}
// Read keypair and call main 
fs.readFile(path.join(os.homedir(), ".config/solana/id.json")).then((file) =>
    main(Keypair.fromSecretKey(new Uint8Array(JSON.parse(file.toString())))),
);