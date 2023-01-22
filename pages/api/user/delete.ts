// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "DELETE") {
    const userData = await prisma.user.delete({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json({
      status: 200,
      data: userData,
    });
  }
}
