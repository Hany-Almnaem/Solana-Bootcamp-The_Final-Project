use solana_program::account_info::AccountInfo;
use solana_program::entrypoint::ProgramResult;
use solana_program::pubkey::Pubkey;

use crate::generated::state::{
	Account,
	AccountPDA,
	DocumentMetadata,
};


/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] Auto-generated, default fee payer
/// 1. `[writable, signer]` mint: [Mint] 
/// 2. `[writable]` document: [DocumentMetadata] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
/// 4. `[writable, signer]` funding: [AccountInfo] Funding account (must be a system account)
/// 5. `[writable]` assoc_token_account: [AccountInfo] Associated token account address to be created
/// 6. `[]` wallet: [AccountInfo] Wallet address for the new associated token account
/// 7. `[]` token_program: [AccountInfo] SPL Token program
/// 8. `[signer]` owner: [AccountInfo] The mint's minting authority.
/// 9. `[]` csl_spl_token_v_0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
/// 10. `[]` csl_spl_assoc_token_v_0_0_0: [AccountInfo] Auto-generated, CslSplAssocTokenProgram v0.0.0
///
/// Data:
/// - document_type: [String] 
/// - issuer: [String] 
/// - issuance_date: [String] 
/// - expiration_date: [String] 
/// - additional_info: [String] 
pub fn mint(
	program_id: &Pubkey,
	for_initialize_mint_2: &[&AccountInfo],
	for_create: &[&AccountInfo],
	for_mint_to: &[&AccountInfo],
	for_set_authority: &[&AccountInfo],
	mint: &Account<spl_token::state::Mint>,
	document: &mut AccountPDA<DocumentMetadata>,
	funding: &AccountInfo,
	assoc_token_account: &AccountInfo,
	wallet: &AccountInfo,
	owner: &AccountInfo,
	document_type: String,
	issuer: String,
	issuance_date: String,
	expiration_date: String,
	additional_info: String,
) -> ProgramResult {
// Update the DocumentMetadata account with the passed in metadata
document.data.document_type = document_type;
document.data.issuer = issuer;
document.data.issuance_date = issuance_date;
document.data.expiration_date = expiration_date;
document.data.additional_info = additional_info;
// Set mint and ATA public keys  
document.data.mint = *mint.info.key;
document.data.assoc_account = Some(*assoc_token_account.key);
// Initialize new mint
csl_spl_token::src::cpi::initialize_mint_2(for_initialize_mint_2, 0, *wallet.key, None)?;
// Create associated token account 
csl_spl_assoc_token::src::cpi::create(for_create)?;
// Mint token to associated token account
csl_spl_token::src::cpi::mint_to(for_mint_to, 1)?;
// Set mint authority
csl_spl_token::src::cpi::set_authority(for_set_authority, 0, None)?;

Ok(())
}