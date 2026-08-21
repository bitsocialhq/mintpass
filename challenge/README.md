# @bitsocial/mintpass-challenge

MintPass challenge for pkc-js that verifies users own a MintPass NFT before publishing.

## Requirements

- Node.js `>=22`
- ESM-only environment

## Using mintpass in your community

Community owners add the mintpass challenge to their community settings. When enabled, every publication (post, reply, vote) requires the author to own a MintPass NFT. The challenge is published as [`@bitsocial/mintpass-challenge`](https://www.npmjs.com/package/@bitsocial/mintpass-challenge) on npm.

### With pkc-js over RPC

If your RPC server is already running, first install the challenge on the server:

```bash
bitsocial challenge install @bitsocial/mintpass-challenge
```

Then from your RPC client, connect and set the challenge on your community by name — no npm install or challenge registration needed on the client side:

```ts
import PKC from "@pkcprotocol/pkc-js";

const pkc = await PKC({
  pkcRpcClientsOptions: ["ws://localhost:9138"]
});

const community = await pkc.createCommunity({ address: "your-community-address.bso" });

await community.edit({
  settings: {
    challenges: [
      {
        name: "@bitsocial/mintpass-challenge",
        options: {
          chainTicker: "base",
          contractAddress: "0x13d41d6B8EA5C86096bb7a94C3557FCF184491b9",
          requiredTokenType: "0",
          transferCooldownSeconds: "604800"
        }
      }
    ]
  }
});
```

### With pkc-js (TypeScript)

Install the challenge package:

```bash
npm install @bitsocial/mintpass-challenge
```

Register the challenge and configure your community:

```typescript
import PKC from '@pkcprotocol/pkc-js'
import { mintpass } from '@bitsocial/mintpass-challenge'

// Register the challenge so it can be referenced by name
PKC.challenges['@bitsocial/mintpass-challenge'] = mintpass

const pkc = await PKC({ /* your pkc options */ })
const community = await pkc.createCommunity({ address: 'your-community.bso' })

await community.edit({
  settings: {
    challenges: [{
      name: '@bitsocial/mintpass-challenge',
      options: {
        chainTicker: 'base',
        contractAddress: '0x13d41d6B8EA5C86096bb7a94C3557FCF184491b9',
        requiredTokenType: '0',
        transferCooldownSeconds: '604800',
      }
    }]
  }
})
```

#### Challenge options

All option values must be strings (pkc-js challenge convention). Options are validated on community edit/create/start (pkc-js `>= 0.0.85`): `chainTicker`, `contractAddress` and `requiredTokenType` are required, unknown option keys are rejected, and malformed values fail the edit instead of silently rejecting every author.

| Option | Required | Default | Description |
|--------|----------|---------|-------------|
| `chainTicker` | yes | `"base"` | Chain where MintPass contract is deployed; `"base"` or `"eth"` |
| `contractAddress` | yes | Base Sepolia deployment | MintPass contract address; must be a well-formed EVM address |
| `requiredTokenType` | yes | `"0"` | Required token type (0=SMS, 1=Email, 2+=future methods); integer 0–65535 |
| `bindToFirstAuthor` | no | `"true"` | Bind each tokenId to the first author that uses it in this community (`"true"`/`"false"`/`"1"`/`"0"`) |
| `noChallengeUrl` | no | `"false"` | Fail immediately when the NFT is missing instead of showing the mintpass.org iframe (`"true"`/`"false"`/`"1"`/`"0"`) |
| `transferCooldownSeconds` | no | `"604800"` | Cooldown period after NFT transfer (1 week); non-negative integer |
| `error` | no | Default message | Custom error message for users without NFT. Use `{authorAddress}` as a placeholder |
| `rpcUrl` | no | Chain default | Custom RPC URL (mainly for testing). **Must not** be listed in `publicOptions`; the challenge rejects that since RPC URLs often embed provider API keys |

#### Public options

`publicOptions` controls which options are written into the published community record. Recommended for MintPass:

- Publish `chainTicker`, `contractAddress`, `requiredTokenType` and `noChallengeUrl` so clients can tell authors up front which MintPass they need (and, with `noChallengeUrl`, that no iframe verification will be offered). Publishing `error`, `bindToFirstAuthor` and `transferCooldownSeconds` is harmless and explains rejections; that is the owner's call.
- Never publish `rpcUrl`.

### With bitsocial-cli

Install the challenge package:

```bash
bitsocial challenge install @bitsocial/mintpass-challenge
```

Edit your community to use the challenge:

```bash
bitsocial community edit your-community.bso \
  '--settings.challenges[0].name' @bitsocial/mintpass-challenge \
  '--settings.challenges[0].options.chainTicker' 'base' \
  '--settings.challenges[0].options.contractAddress' '0x13d41d6B8EA5C86096bb7a94C3557FCF184491b9' \
  '--settings.challenges[0].options.requiredTokenType' '0' \
  '--settings.challenges[0].options.transferCooldownSeconds' '604800'
```

See the [bitsocial-cli documentation](https://github.com/bitsocial/bitsocial-cli) for full CLI reference.

## Scripts

```bash
yarn build
yarn test
yarn clean
```
