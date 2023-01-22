import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      await handleGetUpdatesForBuidl(req, res);
      break;

    case "POST":
      await handleCreateUpdate(req, res);
      break;

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

const handleGetUpdatesForBuidl = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query.buidlId) {
    return res.status(400).json({ message: "Missing buidlId" });
  }

  const buidlId = req.query.buidlId as string;

  const updates = await prisma.update.findMany({
    where: {
      buidlId: buidlId,
    },
  });

  return res.status(200).json({ updates });
};

const handleCreateUpdate = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.body.buidlId) {
    return res.status(400).json({ message: "Missing buidlId" });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: "Missing name" });
  }

  if (!req.body.description) {
    return res.status(400).json({ messagwe: "Missing description" });
  }

  if (!req.body.updateNumber) {
    return res.status(400).json({ messagwe: "Missing updateNumber" });
  }

  if (!req.body.pubkey) {
    return res.status(400).json({ messagwe: "Missing pubkey" });
  }

  const update = await prisma.update.create({
    data: {
      buidl: {
        connect: {
          id: req.body.buidlId,
        },
      },
      name: req.body.name,
      description: req.body.description,
      updateNumber: req.body.updateNumber,
      pubkey: req.body.pubkey,
    },
  });

  return res.status(200).json({ update });
};

export default handler;
