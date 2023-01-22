import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(req.method === "GET")) {
    res.status(405).json({ message: "Method not allowed" });
  }

  if (!req.query.id) {
    res.status(400).json({ message: "Missing id" });
  }

  const statusRes = await axios.get(
    `https://staging.crossmint.com/api/2022-06-09/collections/${
      process.env.NEXT_PUBLIC_COLLECTION_ID
    }/nfts/${req.query.id as string}`
  );

  return res.status(200).json(statusRes.data);
};

export default handler;
