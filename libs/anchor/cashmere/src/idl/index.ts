export type CashmereIdl = {
  version: '0.0.0';
  name: 'multisig';
  instructions: [
    {
      name: 'createMultisig';
      accounts: [
        {
          name: 'multisig';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'treasury';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'owners';
          type: {
            vec: 'publicKey';
          };
        },
        {
          name: 'maxOwners';
          type: 'u8';
        },
        {
          name: 'threshold';
          type: 'u64';
        },
        {
          name: 'nonce';
          type: 'u8';
        }
      ];
    },
    {
      name: 'createTransaction';
      accounts: [
        {
          name: 'multisig';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'transaction';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'proposer';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'programid';
          type: 'publicKey';
        },
        {
          name: 'dataAccounts';
          type: {
            vec: {
              defined: 'TransactionAccount';
            };
          };
        },
        {
          name: 'instructionData';
          type: 'bytes';
        }
      ];
    },
    {
      name: 'approve';
      accounts: [
        {
          name: 'multisig';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'transaction';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: 'setOwnersAndChangeThreshold';
      accounts: [
        {
          name: 'multisig';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'multisigSigner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'owners';
          type: {
            vec: 'publicKey';
          };
        },
        {
          name: 'threshold';
          type: 'u64';
        }
      ];
    },
    {
      name: 'setOwners';
      accounts: [
        {
          name: 'multisig';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'multisigSigner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'owners';
          type: {
            vec: 'publicKey';
          };
        }
      ];
    },
    {
      name: 'changeThreshold';
      accounts: [
        {
          name: 'multisig';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'multisigSigner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: 'threshold';
          type: 'u64';
        }
      ];
    },
    {
      name: 'executeTransaction';
      accounts: [
        {
          name: 'multisig';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'multisigSigner';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'transaction';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: 'Transaction';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'multisig';
            type: 'publicKey';
          },
          {
            name: 'programId';
            type: 'publicKey';
          },
          {
            name: 'accounts';
            type: {
              vec: {
                defined: 'TransactionAccount';
              };
            };
          },
          {
            name: 'data';
            type: 'bytes';
          },
          {
            name: 'signers';
            type: {
              vec: 'bool';
            };
          },
          {
            name: 'didExecute';
            type: 'bool';
          },
          {
            name: 'ownerSetSeqno';
            type: 'u32';
          }
        ];
      };
    },
    {
      name: 'Multisig';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owners';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'threshold';
            type: 'u64';
          },
          {
            name: 'nonce';
            type: 'u8';
          },
          {
            name: 'ownerSetSeqno';
            type: 'u32';
          }
        ];
      };
    }
  ];
  types: [
    {
      name: 'TransactionAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'pubkey';
            type: 'publicKey';
          },
          {
            name: 'isSigner';
            type: 'bool';
          },
          {
            name: 'isWritable';
            type: 'bool';
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 300;
      name: 'InvalidOwner';
      msg: 'The given owner is not part of this multisig.';
    },
    {
      code: 301;
      name: 'InvalidOwnersLen';
      msg: 'Owners length must be non zero.';
    },
    {
      code: 302;
      name: 'NotEnoughSigners';
      msg: 'Not enough owners signed this transaction.';
    },
    {
      code: 303;
      name: 'TransactionAlreadySigned';
      msg: 'Cannot delete a transaction that has been signed by an owner.';
    },
    {
      code: 304;
      name: 'Overflow';
      msg: 'Overflow when adding.';
    },
    {
      code: 305;
      name: 'UnableToDelete';
      msg: 'Cannot delete a transaction the owner did not create.';
    },
    {
      code: 306;
      name: 'AlreadyExecuted';
      msg: 'The given transaction has already been executed.';
    },
    {
      code: 307;
      name: 'InvalidThreshold';
      msg: 'Threshold must be less than or equal to the number of owners.';
    },
    {
      code: 308;
      name: 'UniqueOwners';
      msg: 'Owners must be unique';
    }
  ];
};

export const cashmereIdl: CashmereIdl = {
  version: '0.0.0',
  name: 'multisig',
  instructions: [
    {
      name: 'createMultisig',
      accounts: [
        {
          name: 'multisig',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'treasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'owners',
          type: {
            vec: 'publicKey',
          },
        },
        {
          name: 'maxOwners',
          type: 'u8',
        },
        {
          name: 'threshold',
          type: 'u64',
        },
        {
          name: 'nonce',
          type: 'u8',
        },
      ],
    },
    {
      name: 'createTransaction',
      accounts: [
        {
          name: 'multisig',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'transaction',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'proposer',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'programid',
          type: 'publicKey',
        },
        {
          name: 'dataAccounts',
          type: {
            vec: {
              defined: 'TransactionAccount',
            },
          },
        },
        {
          name: 'instructionData',
          type: 'bytes',
        },
      ],
    },
    {
      name: 'approve',
      accounts: [
        {
          name: 'multisig',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'transaction',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'setOwnersAndChangeThreshold',
      accounts: [
        {
          name: 'multisig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'multisigSigner',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'owners',
          type: {
            vec: 'publicKey',
          },
        },
        {
          name: 'threshold',
          type: 'u64',
        },
      ],
    },
    {
      name: 'setOwners',
      accounts: [
        {
          name: 'multisig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'multisigSigner',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'owners',
          type: {
            vec: 'publicKey',
          },
        },
      ],
    },
    {
      name: 'changeThreshold',
      accounts: [
        {
          name: 'multisig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'multisigSigner',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'threshold',
          type: 'u64',
        },
      ],
    },
    {
      name: 'executeTransaction',
      accounts: [
        {
          name: 'multisig',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'multisigSigner',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'transaction',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'Transaction',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'multisig',
            type: 'publicKey',
          },
          {
            name: 'programId',
            type: 'publicKey',
          },
          {
            name: 'accounts',
            type: {
              vec: {
                defined: 'TransactionAccount',
              },
            },
          },
          {
            name: 'data',
            type: 'bytes',
          },
          {
            name: 'signers',
            type: {
              vec: 'bool',
            },
          },
          {
            name: 'didExecute',
            type: 'bool',
          },
          {
            name: 'ownerSetSeqno',
            type: 'u32',
          },
        ],
      },
    },
    {
      name: 'Multisig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owners',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'threshold',
            type: 'u64',
          },
          {
            name: 'nonce',
            type: 'u8',
          },
          {
            name: 'ownerSetSeqno',
            type: 'u32',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'TransactionAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'pubkey',
            type: 'publicKey',
          },
          {
            name: 'isSigner',
            type: 'bool',
          },
          {
            name: 'isWritable',
            type: 'bool',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 300,
      name: 'InvalidOwner',
      msg: 'The given owner is not part of this multisig.',
    },
    {
      code: 301,
      name: 'InvalidOwnersLen',
      msg: 'Owners length must be non zero.',
    },
    {
      code: 302,
      name: 'NotEnoughSigners',
      msg: 'Not enough owners signed this transaction.',
    },
    {
      code: 303,
      name: 'TransactionAlreadySigned',
      msg: 'Cannot delete a transaction that has been signed by an owner.',
    },
    {
      code: 304,
      name: 'Overflow',
      msg: 'Overflow when adding.',
    },
    {
      code: 305,
      name: 'UnableToDelete',
      msg: 'Cannot delete a transaction the owner did not create.',
    },
    {
      code: 306,
      name: 'AlreadyExecuted',
      msg: 'The given transaction has already been executed.',
    },
    {
      code: 307,
      name: 'InvalidThreshold',
      msg: 'Threshold must be less than or equal to the number of owners.',
    },
    {
      code: 308,
      name: 'UniqueOwners',
      msg: 'Owners must be unique',
    },
  ],
};
