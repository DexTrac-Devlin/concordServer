CREATE TABLE blocks (
    block_number INTEGER PRIMARY KEY,
    hash CHAR(66) NOT NULL,
    parent_hash CHAR(66) NOT NULL,
    nonce CHAR(18) NOT NULL,
    sha3_uncles CHAR(66) NOT NULL,
    logs_bloom CHAR(514) NOT NULL,
    transactions_root CHAR(66) NOT NULL,
    state_root CHAR(66) NOT NULL,
    receipts_root CHAR(66) NOT NULL,
    miner CHAR(42) NOT NULL,
    difficulty VARCHAR(32) NOT NULL,
    total_difficulty VARCHAR(32) NOT NULL,
    extra_data CHAR(2) NOT NULL,
    size INTEGER NOT NULL,
    gas_limit INTEGER NOT NULL,
    gas_used INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    transaction_count INTEGER NOT NULL
);

CREATE TABLE accounts (
    address CHAR(42) PRIMARY KEY,
    balance VARCHAR(32) NOT NULL
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    log_index INTEGER NOT NULL,
    transaction_hash CHAR(66) NOT NULL,
    transaction_index INTEGER NOT NULL,
    block_hash CHAR(66) NOT NULL,
    block_number INTEGER NOT NULL,
    address CHAR(42) NOT NULL,
    data TEXT NOT NULL,
    topics TEXT[] NOT NULL
);

CREATE INDEX idx_logs_block_number ON logs (block_number);
CREATE INDEX idx_logs_address ON logs (address);
