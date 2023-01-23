import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      await handleGetBackersForBuidl(req, res);
      break;

    case "POST":
      await handleCreateBacker(req, res);
      break;

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

const handleGetBackersForBuidl = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query.buidlId) {
    return res.status(400).json({ message: "Missing buidlId" });
  }

  const buidlId = req.query.buidlId as string;

  const backers = await prisma.backer.findMany({
    where: {
      buidlId: buidlId,
    },
  });

  return res.status(200).json({ backers });
};

const handleCreateBacker = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.body.buidlId) {
    return res.status(400).json({ message: "Missing buidlId" });
  }

  if (!req.body.pubkey) {
    return res.status(400).json({ messagwe: "Missing pubkey" });
  }

  if (!req.body.userPubkey) {
    return res.status(400).json({ message: "Missing userPubkey" });
  }

  if (!req.body.amount) {
    return res.status(400).json({ message: "Missing amount" });
  }

  const user = await prisma.user.findUnique({
    where: {
      pubkey: req.body.userPubkey,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const backerExists = await prisma.backer.findUnique({
    where: {
      userId: user.id,
    },
  });

  let backer;

  if (backerExists) {
    backer = await prisma.backer.update({
      where: {
        userId: user.id,
      },
      data: {
        amount: Number(backerExists.amount) + Number(req.body.amount),
      },
    });
  } else {
    backer = await prisma.backer.create({
      data: {
        buidl: {
          connect: {
            id: req.body.buidlId,
          },
        },
        user: {
          connect: {
            pubkey: req.body.userPubkey,
          },
        },
        pubkey: req.body.pubkey,
        amount: Number(req.body.amount),
      },
    });
  }

  return res.status(200).json({ backer });
};

export default handler;
