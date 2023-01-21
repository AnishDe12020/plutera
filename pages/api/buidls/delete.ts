// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if (req.method === "DELETE") { 
        const prisma = new PrismaClient()
        await prisma.$connect()
    const buidlData = await prisma.buidl.delete({
        where: {
            id: req.body.id
        }
    })
    res.status(200).json({
        status: 200,
        data: buidlData,
    })
   }
}
