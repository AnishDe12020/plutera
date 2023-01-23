import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "PATCH":
      await handleUpdateProposal(req, res);
      break;

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

const handleUpdateProposal = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    return res.status(400).json({ message: "Missing id" });
  }

  const id = req.query.id as string;

  const proposal = await prisma.proposal.update({
    where: {
      id: id,
    },
    data: {
      upvotes: Number(req.body.upvotes) || undefined,
      downvotes: Number(req.body.downvotes) || undefined,
    },
  });

  return res.status(200).json({ proposal });
};

export default handler;
