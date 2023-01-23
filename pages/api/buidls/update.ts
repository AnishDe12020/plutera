// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../src/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "PATCH") {
    const buidlData = await prisma.buidl.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
        description: req.body.description,
        url: req.body.description,
        twitter: req.body.twitter,
        github: req.body.github,
        amountRaised: Number(req.body.amountRaised) || undefined,
        updatesTillNow: req.body.updates,
      },
    });

    return res.status(200).json({
      status: 200,
      data: buidlData,
    });
  }
}
