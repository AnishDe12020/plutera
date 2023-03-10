// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const user = await prisma.user.create({
      data: {
        pubkey: req.body.pubkey,
        name: req.body.name,
        email: req.body.email,
        avatarUrl: req.body.avatarurl,
        twitter: req.body.twitter,
        buidls: req.body.buidls,
      },
    });

    res.status(200).json({
      status: 200,
      data: user,
    });
  }
}
