export type Plutera = {
  version: "0.1.0";
  name: "plutera";
  instructions: [
    {
      name: "initializeBuidl";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "buidlAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "dbId";
          type: "string";
        }
      ];
    },
    {
      name: "deposit";
      accounts: [
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "depositor";
          isMut: true;
          isSigner: true;
        },
        {
          name: "depositorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buidlAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "backerAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "createProposal";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "buidlAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "proposalAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "vault";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "dbId";
          type: "string";
        },
        {
          name: "withdrawerTokenAccount";
          type: "publicKey";
        },
        {
          name: "endAfterDays";
          type: "i64";
        }
      ];
    },
    {
      name: "vote";
      accounts: [
        {
          name: "proposalAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "voter";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "voterAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "upvote";
          type: "bool";
        }
      ];
    },
    {
      name: "checkProposal";
      accounts: [
        {
          name: "proposalAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "buidlAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "withdrawerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "postUpdate";
      accounts: [
        {
          name: "buidlAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "updateAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "dbId";
          type: "string";
        },
        {
          name: "updateNumber";
          type: "i64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "buidlAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "dbId";
            type: "string";
          },
          {
            name: "vaultAccount";
            type: "publicKey";
          },
          {
            name: "token";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "proposalAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "buidlAccount";
            type: "publicKey";
          },
          {
            name: "dbId";
            type: "string";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "upvotes";
            type: "u64";
          },
          {
            name: "downvotes";
            type: "u64";
          },
          {
            name: "withdrawerTokenAccount";
            type: "publicKey";
          },
          {
            name: "endTimestamp";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "backerAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "address";
            type: "publicKey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "sinceTimestamp";
            type: "i64";
          },
          {
            name: "buidlAccount";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "backerVoteAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "address";
            type: "publicKey";
          },
          {
            name: "proposalAccount";
            type: "publicKey";
          },
          {
            name: "upvote";
            type: "bool";
          },
          {
            name: "timestamp";
            type: "i64";
          },
          {
            name: "voted";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "updateAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "buidlAccount";
            type: "publicKey";
          },
          {
            name: "dbId";
            type: "string";
          },
          {
            name: "timestamp";
            type: "i64";
          },
          {
            name: "updateNumber";
            type: "i64";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "BuidlInitialized";
      fields: [
        {
          name: "owner";
          type: "publicKey";
          index: false;
        },
        {
          name: "dbId";
          type: "string";
          index: false;
        },
        {
          name: "vaultAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "token";
          type: "publicKey";
          index: false;
        }
      ];
    },
    {
      name: "TokensDeposited";
      fields: [
        {
          name: "depositor";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        },
        {
          name: "buidlAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "buidlDbId";
          type: "string";
          index: false;
        }
      ];
    },
    {
      name: "ProposalCreated";
      fields: [
        {
          name: "buidlAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "buidlDbId";
          type: "string";
          index: false;
        },
        {
          name: "proposalAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "proposalDbId";
          type: "string";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        },
        {
          name: "withdrawerTokenAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "endTimestamp";
          type: "i64";
          index: false;
        }
      ];
    },
    {
      name: "ProposalVoted";
      fields: [
        {
          name: "voter";
          type: "publicKey";
          index: false;
        },
        {
          name: "proposalAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "proposalDbId";
          type: "string";
          index: false;
        },
        {
          name: "upvote";
          type: "bool";
          index: false;
        }
      ];
    },
    {
      name: "ProposalWithdrawn";
      fields: [
        {
          name: "withdrawerTokenAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "proposalAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "proposalDbId";
          type: "string";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "UpdatePosted";
      fields: [
        {
          name: "updater";
          type: "publicKey";
          index: false;
        },
        {
          name: "buidlAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "buidlDbId";
          type: "string";
          index: false;
        },
        {
          name: "updateDbId";
          type: "string";
          index: false;
        },
        {
          name: "updateNumber";
          type: "i64";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InsufficientFunds";
      msg: "Insufficient funds";
    },
    {
      code: 6001;
      name: "ProposalTooShort";
      msg: "Proposal must be for at least 3 days";
    },
    {
      code: 6002;
      name: "AmountTooLow";
      msg: "Amount too low";
    },
    {
      code: 6003;
      name: "Overflow";
    },
    {
      code: 6004;
      name: "AlreadyVoted";
      msg: "Already voted the same vote on this proposal";
    },
    {
      code: 6005;
      name: "ProposalNotOver";
      msg: "The proposal is ongoing. You can't withdraw yet";
    },
    {
      code: 6006;
      name: "ProposalNotPassed";
      msg: "The proposal didn't pass. You can't withdraw";
    }
  ];
};

export const IDL: Plutera = {
  version: "0.1.0",
  name: "plutera",
  instructions: [
    {
      name: "initializeBuidl",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "buidlAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "dbId",
          type: "string",
        },
      ],
    },
    {
      name: "deposit",
      accounts: [
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "depositor",
          isMut: true,
          isSigner: true,
        },
        {
          name: "depositorTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buidlAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "backerAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "createProposal",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "buidlAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "proposalAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vault",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "dbId",
          type: "string",
        },
        {
          name: "withdrawerTokenAccount",
          type: "publicKey",
        },
        {
          name: "endAfterDays",
          type: "i64",
        },
      ],
    },
    {
      name: "vote",
      accounts: [
        {
          name: "proposalAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "voter",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "voterAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "upvote",
          type: "bool",
        },
      ],
    },
    {
      name: "checkProposal",
      accounts: [
        {
          name: "proposalAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "buidlAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "withdrawerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "postUpdate",
      accounts: [
        {
          name: "buidlAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "updateAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "dbId",
          type: "string",
        },
        {
          name: "updateNumber",
          type: "i64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "buidlAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "dbId",
            type: "string",
          },
          {
            name: "vaultAccount",
            type: "publicKey",
          },
          {
            name: "token",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "proposalAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "buidlAccount",
            type: "publicKey",
          },
          {
            name: "dbId",
            type: "string",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "upvotes",
            type: "u64",
          },
          {
            name: "downvotes",
            type: "u64",
          },
          {
            name: "withdrawerTokenAccount",
            type: "publicKey",
          },
          {
            name: "endTimestamp",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "backerAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "sinceTimestamp",
            type: "i64",
          },
          {
            name: "buidlAccount",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "backerVoteAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "proposalAccount",
            type: "publicKey",
          },
          {
            name: "upvote",
            type: "bool",
          },
          {
            name: "timestamp",
            type: "i64",
          },
          {
            name: "voted",
            type: "bool",
          },
        ],
      },
    },
    {
      name: "updateAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "buidlAccount",
            type: "publicKey",
          },
          {
            name: "dbId",
            type: "string",
          },
          {
            name: "timestamp",
            type: "i64",
          },
          {
            name: "updateNumber",
            type: "i64",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "BuidlInitialized",
      fields: [
        {
          name: "owner",
          type: "publicKey",
          index: false,
        },
        {
          name: "dbId",
          type: "string",
          index: false,
        },
        {
          name: "vaultAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "token",
          type: "publicKey",
          index: false,
        },
      ],
    },
    {
      name: "TokensDeposited",
      fields: [
        {
          name: "depositor",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
        {
          name: "buidlAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "buidlDbId",
          type: "string",
          index: false,
        },
      ],
    },
    {
      name: "ProposalCreated",
      fields: [
        {
          name: "buidlAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "buidlDbId",
          type: "string",
          index: false,
        },
        {
          name: "proposalAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "proposalDbId",
          type: "string",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
        {
          name: "withdrawerTokenAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "endTimestamp",
          type: "i64",
          index: false,
        },
      ],
    },
    {
      name: "ProposalVoted",
      fields: [
        {
          name: "voter",
          type: "publicKey",
          index: false,
        },
        {
          name: "proposalAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "proposalDbId",
          type: "string",
          index: false,
        },
        {
          name: "upvote",
          type: "bool",
          index: false,
        },
      ],
    },
    {
      name: "ProposalWithdrawn",
      fields: [
        {
          name: "withdrawerTokenAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "proposalAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "proposalDbId",
          type: "string",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "UpdatePosted",
      fields: [
        {
          name: "updater",
          type: "publicKey",
          index: false,
        },
        {
          name: "buidlAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "buidlDbId",
          type: "string",
          index: false,
        },
        {
          name: "updateDbId",
          type: "string",
          index: false,
        },
        {
          name: "updateNumber",
          type: "i64",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InsufficientFunds",
      msg: "Insufficient funds",
    },
    {
      code: 6001,
      name: "ProposalTooShort",
      msg: "Proposal must be for at least 3 days",
    },
    {
      code: 6002,
      name: "AmountTooLow",
      msg: "Amount too low",
    },
    {
      code: 6003,
      name: "Overflow",
    },
    {
      code: 6004,
      name: "AlreadyVoted",
      msg: "Already voted the same vote on this proposal",
    },
    {
      code: 6005,
      name: "ProposalNotOver",
      msg: "The proposal is ongoing. You can't withdraw yet",
    },
    {
      code: 6006,
      name: "ProposalNotPassed",
      msg: "The proposal didn't pass. You can't withdraw",
    },
  ],
};
