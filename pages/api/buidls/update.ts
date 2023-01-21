// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if (req.method === "PATCH") { 
        const prisma = new PrismaClient()
        await prisma.$connect()
    const data = {
        updatedAt: Date.now().toString(),
        name: req.body.name,
        description: req.body.description,
        url: req.body.description,
        pubkey: req.body.pubkey,
        twitter: req.body.twitter,
        github: req.body.github,
        amountRequested: req.body.amountrequested,
        amountRaised: req.body.amountraised,
        token: req.body.token,
        updatesTillNow: req.body.updates,
        avatarUrl: req.body.avatarurl,
        bannerUrl: req.body.bannerurl,
        Goal: req.body.update,
        Update: req.body.update,
        Proposal: req.body.proposals,
      };
    
    const buidlData = await prisma.buidl.update({
        where: {
            id: req.body.id
        },
        data: data
    })
    console.log(buidlData)

    res.status(200).json({
        status: 200,
        data: buidlData,
    })
    }
}
