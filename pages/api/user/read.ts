// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!req.query.id)
    return res.status(400).json({ status: 400, message: "Bad request" });

  if (req.method === "GET") {
    const userData = await prisma.user.findUnique({
      where: {
        id: req.query.id as string,
      },
    });
    res.status(200).json({
      status: 200,
      data: userData,
    });
  }
}
