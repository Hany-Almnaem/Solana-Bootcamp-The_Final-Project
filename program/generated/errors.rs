// This file is auto-generated from the CIDL source.
// Editing this file directly is not recommended as it may be overwritten.

use num_derive::FromPrimitive;
use solana_program::decode_error::DecodeError;
use solana_program::msg;
use solana_program::program_error::{PrintProgramError, ProgramError};
use thiserror::Error;

#[derive(Error, FromPrimitive, Debug, Clone)]
pub enum DocumentWalletError {
    #[error("Invalid Instruction")]
    InvalidInstruction,

    #[error("Invalid Signer Permission")]
    InvalidSignerPermission,

    #[error("Not The Expected Account Address")]
    NotExpectedAddress,

    #[error("Wrong Account Owner")]
    WrongAccountOwner,

    #[error("Invalid Account Len")]
    InvalidAccountLen,

    #[error("Executable Account Expected")]
    ExecutableAccountExpected,

 
}

impl From<DocumentWalletError> for ProgramError {
    fn from(e: DocumentWalletError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

impl<T> DecodeError<T> for DocumentWalletError {
    fn type_of() -> &'static str {
        "DocumentWalletError"
    }
}

impl PrintProgramError for DocumentWalletError {
    fn print<E>(&self)
    where
        E: 'static
            + std::error::Error
            + DecodeError<E>
            + PrintProgramError
            + num_traits::FromPrimitive,
    {
        match self {
            DocumentWalletError::InvalidInstruction => msg!("Error: Invalid instruction"),
            DocumentWalletError::InvalidSignerPermission => msg!("Error: The account is_signer value is not the expected one"),
            DocumentWalletError::NotExpectedAddress => {
                msg!("Error: Not the expected account address")
            }
            DocumentWalletError::WrongAccountOwner => msg!("Error: Wrong account owner"),
            DocumentWalletError::InvalidAccountLen => msg!("Error: Invalid account length"),
            DocumentWalletError::ExecutableAccountExpected => msg!("Error: Executable account expected"),
 
        }
    }
}