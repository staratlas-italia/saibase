import { optional } from '@saibase/io-ts';
import { nftCodec } from '@saibase/star-atlas';
import * as t from 'io-ts';

export const shipStatsCodec = t.type({
  createdAt: t.string,
  ships: t.record(
    t.string,
    t.type({
      stakedQuantity: t.number,
      inWalletQuantity: t.number,
      vwap: optional(t.number),
      attributes: nftCodec.props.attributes,
      mint: nftCodec.props.mint,
      name: nftCodec.props.name,
    })
  ),
});

export type ShipStats = t.TypeOf<typeof shipStatsCodec>;
