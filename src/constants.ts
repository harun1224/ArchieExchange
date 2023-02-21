import { networks, enabledNetworkIds } from "src/networks";

export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/colonelssecretspices/kfc-graph";

export const TOKEN_DECIMALS = 9;

export const MISSING_ADDRESS = '0x0000000000000000000000000000000000000000';

export const RANGO_API_KEY = '1fc1620a-f8ce-40b7-a9d8-c8e7e1db7759';

export const RANGO_AFFILIATE_REF_ID = 'c8x0IM';

export const FEE_CONTRACT = '0xE1750B41e2ac666Ad445cc55A7c09d4dDCE2Bc88';


interface IAddresses {
  [key: number]: { [key: string]: string };
};

export const addresses: IAddresses = enabledNetworkIds.reduce((addresses: { [key: number]: { [key: string]: string } }, networkId) => (addresses[networkId] = networks[networkId].addresses, addresses), {});