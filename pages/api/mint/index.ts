import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";
import getNFT from "../../../src/utils/getNFT";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(req.method === "POST")) {
    res.status(405).json({ message: "Method not allowed" });
  }

  if (!req.body.pubkey) {
    res.status(400).json({ message: "Missing pubkey" });
  }

  if (!req.body.buidlId) {
    res.status(400).json({ message: "Missing buidlId" });
  }

  const buidl = await prisma.buidl.findUnique({
    where: {
      id: req.body.buidlId,
    },
    select: {
      stage: true,
      name: true,
    },
  });

  if (!buidl) {
    return res.status(404).json({ message: "Buidl not found" });
  }

  const nft = await axios.post(
    `https://staging.crossmint.com/api/2022-06-09/collections/${process.env.NEXT_PUBLIC_COLLECTION_ID}/nfts`,
    {
      recipient: `solana:${req.body.pubkey}`,
      metadata: {
        name: `${buidl.name} - Stage ${buidl.stage}}`,
        image: getNFT(buidl.stage),
        description: `NFT for backers backing ${buidl.name} at stage ${buidl.stage}`,
        attributes: [
          {
            display_type: "number",
            trait_type: "stage",
            value: buidl.stage,
          },
        ],
      },
    }
  );

  return { id: nft.data.id };
};

export default handler;
