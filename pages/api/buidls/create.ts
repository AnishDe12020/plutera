// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    if (!req.body.name) {
      res.status(400).json({
        status: 400,
        message: "Name is required",
      });
      return;
    }

    if (!req.body.pubkey) {
      res.status(400).json({
        status: 400,
        message: "Pubkey is required",
      });
      return;
    }

    if (!req.body.amountRequested) {
      res.status(400).json({
        status: 400,
        message: "Amount requested is required",
      });
      return;
    }

    if (!req.body.ownerPubkey) {
      res.status(400).json({
        status: 400,
        message: "Owner id is required",
      });
      return;
    }

    let buidlData = await prisma.buidl.create({
      data: {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url,
        pubkey: req.body.pubkey,
        twitter: req.body.twitter,
        github: req.body.github,
        amountRequested: Number(req.body.amountRequested),
        amountRaised: 0,
        token: {
          address: req.body.token.address,
          symbol: req.body.token.symbol,
          logoURI: req.body.token.logoURI,
        },
        owner: {
          connect: {
            pubkey: req.body.ownerPubkey,
          },
        },
        updatesTillNow: 0,
        Update: req.body.update,
        Proposal: req.body.proposals,
      },
    });

    res.status(200).json({
      status: 200,
      buidl: buidlData,
    });
  }
}
