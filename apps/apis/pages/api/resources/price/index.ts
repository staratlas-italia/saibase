import { rpcApiBaseUrl } from '@saibase/configuration';
import { mints } from '@saibase/constants';
import { BestPrices, getEntityBestPrices } from '@saibase/star-atlas';
import { Connection } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';

interface DataPrices {
  [key: string]: BestPrices;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 4;
  const startIndex = (page - 1) * limit;
  const connection = new Connection(rpcApiBaseUrl);

  const tokenMintItems = [
    { mint: mints.food, name: 'food' },
    { mint: mints.fuel, name: 'fuel' },
    { mint: mints.ammo, name: 'ammo' },
    { mint: mints.toolkit, name: 'tools' },
    { mint: mints.arco, name: 'arco' },
    { mint: mints.biomass, name: 'biomass' },
    { mint: mints.carbon, name: 'carbon' },
    { mint: mints.diamond, name: 'diamond' },
    { mint: mints.hydrogen, name: 'hydrogen' },
    { mint: mints.ironOre, name: 'ironOre' },
    { mint: mints.copperOre, name: 'copperOre' },
    { mint: mints.lumanite, name: 'lumanite' },
    { mint: mints.rochinol, name: 'rochinol' },
    { mint: mints.sdu, name: 'sdu' },
    { mint: mints.crystalLattice, name: 'crystalLattice' },
    { mint: mints.copperWire, name: 'copperWire' },
    { mint: mints.copper, name: 'copper' },
    { mint: mints.electronics, name: 'electronics' },
    { mint: mints.graphene, name: 'graphene' },
    { mint: mints.hydrocarbon, name: 'hydrocarbon' },
    { mint: mints.iron, name: 'iron' },
    { mint: mints.magnet, name: 'magnet' },
    { mint: mints.polymer, name: 'polymer' },
    { mint: mints.steel, name: 'steel' },
    { mint: mints.energySubstrate, name: 'energySubstrate' },
    { mint: mints.electromagnet, name: 'electromagnet' },
    { mint: mints.framework, name: 'framework' },
    { mint: mints.particleAccelerator, name: 'particleAccelerator' },
    { mint: mints.powerSource, name: 'powerSource' },
    { mint: mints.radiationAbsorber, name: 'radiationAbsorber' },
    { mint: mints.strangeEmitter, name: 'strangeEmitter' },
    { mint: mints.superConductor, name: 'superConductor' },
    { mint: mints.goldenTicket, name: 'goldenTicket' },
  ];

  const paginatedItems = tokenMintItems.slice(startIndex, startIndex + limit);

  const pricePromises = paginatedItems.map((item) =>
    getEntityBestPrices(connection, item.mint.toBase58(), 'ATLAS').then(
      (prices) => ({
        name: item.name,
        prices,
      })
    )
  );
  const results = await Promise.all(pricePromises);

  const data = results.reduce((acc: DataPrices, { name, prices }) => {
    acc[name] = prices;
    return acc;
  }, {} as DataPrices);

  res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(tokenMintItems.length / limit),
      totalItems: tokenMintItems.length,
    },
  });
};

export default handler;
