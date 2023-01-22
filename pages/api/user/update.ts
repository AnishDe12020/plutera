// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!req.body.id) {
    return res.status(400).json({ status: 400, message: "Bad request" });
  }

  if (req.method === "PATCH") {
    const user = await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        avatarUrl: req.body.avatarurl,
        twitter: req.body.twitter,
      },
    });

    res.status(200).json({
      status: 200,
      data: user,
    });
  }
}
