import { NextApiRequest, NextApiResponse } from 'next';
import {
  AMMO_TOKEN_MINT_ID,
  ARCO_TOKEN_MINT_ID,
  BIOMASS_TOKEN_MINT_ID,
  CARBON_TOKEN_MINT_ID,
  COPPERORE_TOKEN_MINT_ID,
  COPPER_TOKEN_MINT_ID,
  COPPER_WIRE_TOKEN_MINT_ID,
  CRYSTAL_LATTICE_TOKEN_MINT_ID,
  DIAMOND_TOKEN_MINT_ID,
  ELECTROMAGNET_TOKEN_MINT_ID,
  ELECTRONICS_TOKEN_MINT_ID,
  ENERGY_SUBSTRATE_TOKEN_MINT_ID,
  FOOD_TOKEN_MINT_ID,
  FRAMEWORK_TOKEN_MINT_ID,
  FUEL_TOKEN_MINT_ID,
  GOLDEN_TICKET_TOKEN_MINT_ID,
  GRAPHENE_TOKEN_MINT_ID,
  HYDROCARBON_TOKEN_MINT_ID,
  HYDROGEN_TOKEN_MINT_ID,
  IRONORE_TOKEN_MINT_ID,
  IRON_TOKEN_MINT_ID,
  LUMANITE_TOKEN_MINT_ID,
  MAGNET_TOKEN_MINT_ID,
  PARTICLE_ACCELERATOR_TOKEN_MINT_ID,
  POLYMER_TOKEN_MINT_ID,
  POWER_SOURCE_TOKEN_MINT_ID,
  RADIATION_ABSORBER_TOKEN_MINT_ID,
  ROCHINOL_TOKEN_MINT_ID,
  SDU_TOKEN_MINT_ID,
  STEEL_TOKEN_MINT_ID,
  STRANGE_EMITTER_TOKEN_MINT_ID,
  SUPER_CONDUCTOR_TOKEN_MINT_ID,
  TOOL_TOKEN_MINT_ID,
} from '../../../../common/constants/index';
import { DataPrices } from '../../../../common/types';
import { getEntityBestPrices } from '../../../../utils/getEntityBestPrices';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 4;
  const startIndex = (page - 1) * limit;

  const tokenMintItems = [
    { id: FOOD_TOKEN_MINT_ID, name: 'food' },
    { id: FUEL_TOKEN_MINT_ID, name: 'fuel' },
    { id: AMMO_TOKEN_MINT_ID, name: 'ammo' },
    { id: TOOL_TOKEN_MINT_ID, name: 'tools' },
    { id: ARCO_TOKEN_MINT_ID, name: 'arco' },
    { id: BIOMASS_TOKEN_MINT_ID, name: 'biomass' },
    { id: CARBON_TOKEN_MINT_ID, name: 'carbon' },
    { id: DIAMOND_TOKEN_MINT_ID, name: 'diamond' },
    { id: HYDROGEN_TOKEN_MINT_ID, name: 'hydrogen' },
    { id: IRONORE_TOKEN_MINT_ID, name: 'ironOre' },
    { id: COPPERORE_TOKEN_MINT_ID, name: 'copperOre' },
    { id: LUMANITE_TOKEN_MINT_ID, name: 'lumanite' },
    { id: ROCHINOL_TOKEN_MINT_ID, name: 'rochinol' },
    { id: SDU_TOKEN_MINT_ID, name: 'sdu' },
    { id: CRYSTAL_LATTICE_TOKEN_MINT_ID, name: 'crystalLattice' },
    { id: COPPER_WIRE_TOKEN_MINT_ID, name: 'copperWire' },
    { id: COPPER_TOKEN_MINT_ID, name: 'copper' },
    { id: ELECTRONICS_TOKEN_MINT_ID, name: 'electronics' },
    { id: GRAPHENE_TOKEN_MINT_ID, name: 'graphene' },
    { id: HYDROCARBON_TOKEN_MINT_ID, name: 'hydrocarbon' },
    { id: IRON_TOKEN_MINT_ID, name: 'iron' },
    { id: MAGNET_TOKEN_MINT_ID, name: 'magnet' },
    { id: POLYMER_TOKEN_MINT_ID, name: 'polymer' },
    { id: STEEL_TOKEN_MINT_ID, name: 'steel' },
    { id: ENERGY_SUBSTRATE_TOKEN_MINT_ID, name: 'energySubstrate' },
    { id: ELECTROMAGNET_TOKEN_MINT_ID, name: 'electromagnet' },
    { id: FRAMEWORK_TOKEN_MINT_ID, name: 'framework' },
    { id: PARTICLE_ACCELERATOR_TOKEN_MINT_ID, name: 'particleAccelerator' },
    { id: POWER_SOURCE_TOKEN_MINT_ID, name: 'powerSource' },
    { id: RADIATION_ABSORBER_TOKEN_MINT_ID, name: 'radiationAbsorber' },
    { id: STRANGE_EMITTER_TOKEN_MINT_ID, name: 'strangeEmitter' },
    { id: SUPER_CONDUCTOR_TOKEN_MINT_ID, name: 'superConductor' },
    { id: GOLDEN_TICKET_TOKEN_MINT_ID, name: 'goldenTicket' },
  ];

  const paginatedItems = tokenMintItems.slice(startIndex, startIndex + limit);

  const pricePromises = paginatedItems.map((item) =>
    getEntityBestPrices(item.id, 'ATLAS').then((prices) => ({
      name: item.name,
      prices,
    }))
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
