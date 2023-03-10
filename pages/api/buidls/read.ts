// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    if (!req.query.id) {
      res.status(400).json({
        status: 400,
        message: "Missing id",
      });
      return;
    }

    const buidlData = await prisma.buidl.findUnique({
      where: {
        id: req.query.id as string,
      },
    });

    res.status(200).json({
      status: 200,
      data: buidlData,
    });
  }
}
