use std::{io, path::PathBuf, string::FromUtf8Error};

use native_db::db_type::Error;
use tauri::ipc::InvokeError;

#[derive(thiserror::Error, Debug)]
pub enum InitError {
    #[error("{0:#?}")]
    TuariError(#[from] tauri::Error),
}

#[derive(thiserror::Error, Debug)]
pub enum MpvShelfError {
    #[error("{0}")]
    Database(#[from] DatabaseError),
    #[error("{0}")]
    Mpv(#[from] MpvError),
    #[error("{0}")]
    Http(#[from] HttpClientError),
    #[error("{0}")]
    ReadDir(#[from] ReadDirError),
}

#[derive(thiserror::Error, Debug)]
pub enum DatabaseError {
    #[error("{0:#?}")]
    NativeDbError(#[from] Error),
    #[error("User Not Found: {0}")]
    UserNotFound(String),
    #[error("OsFolders Not Found: {0}")]
    OsFoldersNotFound(String),
    #[error("{0:#?}")]
    OsVideosNotFound(String),
    #[error("{0:#?}")]
    IoError(#[from] io::Error),
    #[error("{0:#?}")]
    TuariError(#[from] tauri::Error),
}

#[derive(thiserror::Error, Debug)]
pub enum ReadDirError {
    #[error("{0}")]
    Io(#[from] io::Error),
    #[error("{0} contains all the same folders & files as it did before")]
    FullyHydrated(String),
    #[error("{0}")]
    Tuari(#[from] tauri::Error),
}

#[derive(thiserror::Error, Debug)]
pub enum MpvError {
    #[error("MPV Player was not found on the System PATH.")]
    SudoPATHNotFound,
    #[error("MPV Player was not found @ the specified path: {0}")]
    AbsolutePathNotFound(String),
    #[error("Failed to execute MPV Player: {0}")]
    IoError(#[from] io::Error),
    #[error("{0:#?}")]
    TuariError(#[from] tauri::Error),
    #[error("Failed to get Webview Window labeled: {0}")]
    WebviewWindowNotFound(String),
    #[error("OsVideo {0} not found in specified directory.")]
    OsVideoNotFound(String),
    #[error("Filename contains invalid characters: {0}")]
    InvalidPathName(String),
    #[error("{0}")]
    DatabaseError(#[from] DatabaseError),
    #[error("{0}")]
    StdOutError(#[from] MpvStdoutError),
}

#[derive(thiserror::Error, Debug)]
pub enum MpvStdoutError {
    #[error("Failed to convert stdout bytes to String: {0}")]
    Utf8Error(#[from] FromUtf8Error),
    #[error("failed to find title from mpv's stdout:\n {0}")]
    MissingVideoTitle(String),
    #[error("failed to find timestamp from mpv's stdout:\n {0}")]
    MissingTimestamp(String),
    #[error("failed to parse int: {0}; reason: {1}")]
    ParseInt(String, String),
    #[error("the given timestamp is invalid: {0}")]
    InvalidTimestamp(String),
}

#[derive(thiserror::Error, Debug)]
pub enum HttpClientError {
    #[error("{0}")]
    Request(#[from] reqwest::Error),
    #[error("{0:#?}")]
    Tuari(#[from] tauri::Error),
    #[error("{0:#?}")]
    Io(#[from] io::Error),
}

impl From<ReadDirError> for InvokeError {
    fn from(error: ReadDirError) -> Self {
        InvokeError::from_error(error)
    }
}

impl From<MpvShelfError> for InvokeError {
    fn from(error: MpvShelfError) -> Self {
        InvokeError::from_error(error)
    }
}

impl From<HttpClientError> for InvokeError {
    fn from(error: HttpClientError) -> Self {
        InvokeError::from_error(error)
    }
}

impl From<PathBuf> for MpvError {
    fn from(path: PathBuf) -> Self {
        MpvError::OsVideoNotFound(path.to_string_lossy().to_string())
    }
}

impl From<MpvError> for InvokeError {
    fn from(error: MpvError) -> Self {
        InvokeError::from_error(error)
    }
}

impl From<DatabaseError> for InvokeError {
    fn from(error: DatabaseError) -> Self {
        InvokeError::from_error(error)
    }
}
