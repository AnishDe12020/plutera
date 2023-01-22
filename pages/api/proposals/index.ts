import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      await handleGetProposalsForBuidl(req, res);
      break;

    case "POST":
      await handleCreateProposal(req, res);
      break;

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

const handleGetProposalsForBuidl = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query.buidlId) {
    return res.status(400).json({ message: "Missing buidlId" });
  }

  const buidlId = req.query.buidlId as string;

  const proposals = await prisma.proposal.findMany({
    where: {
      buidlId: buidlId,
    },
  });

  return res.status(200).json({ proposals });
};

const handleCreateProposal = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.body.buidlId) {
    return res.status(400).json({ message: "Missing buidlId" });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: "Missing name" });
  }

  if (!req.body.purpose) {
    return res.status(400).json({ message: "Missing purpose" });
  }

  if (!req.body.amount) {
    return res.status(400).json({ message: "Missing amount" });
  }

  if (!req.body.endTimestamp) {
    return res.status(400).json({ message: "Missing endTimestamp" });
  }

  if (!req.body.withdrawerAddresss) {
    return res.status(400).json({ message: "Missing withdrawerAddress" });
  }

  if (!req.body.pubkey) {
    return res.status(400).json({ message: "Missing pubkey" });
  }

  const proposal = await prisma.proposal.create({
    data: {
      id: req.body.id,
      buidl: {
        connect: {
          id: req.body.buidlId,
        },
      },
      name: req.body.name,
      purpose: req.body.purpose,
      amount: req.body.amount,
      endTimestamp: req.body.endTimestamp,
      withdrawerAddress: req.body.withdrawerAddress,
      pubkey: req.body.pubkey,
    },
  });

  return res.status(200).json({ proposal });
};

export default handler;
