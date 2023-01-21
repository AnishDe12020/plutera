import axios from 'axios';
import { Images } from '../enums/images';
export async function mintNftHelper(
  stage: number,
  address: string
): Promise<any> {
  let img = Images.zero;

  switch (stage) {
    case 0:
      img = Images.zero;
      break;
    case 1:
      img = Images.one;
      break;
    case 2:
      img = Images.two;
      break;
    case 3:
      img = Images.three;
      break;
    case 4:
      img = Images.four;
      break;
    default:
      break;
  }

  const res = await axios({
    method: 'POST',
    url: 'https://staging.crossmint.com/api/2022-06-09/collections/default-solana/nfts',
    headers: {
      'x-project-id': process.env.PROJECTID,
      'x-client-secret': process.env.TOKEN,
      'Content-Type': 'application/json'
    },
    data: {
      recipient: `solana:${address}`,
      metadata: {
        name: `Stage ${stage} nft`,
        image: img,
        description: 'Minting nft'
      }
    }
  });
  return res.data;
}

export async function checkStatus(id: string): Promise<any> {
  console.log(id);

  const res = await axios({
    method: 'GET',
    url: `https://staging.crossmint.com/api/2022-06-09/collections/default-solana/nfts/${id}`,
    headers: {
      'x-project-id': process.env.PROJECTID,
      'x-client-secret': process.env.TOKEN,
      'Content-Type': 'application/json'
    }
  });
  console.log(res);
  return res.data;
}