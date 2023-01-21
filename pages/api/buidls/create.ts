// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../src/lib/db';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if (req.method === "POST") { 
    const data = {
        createdAt: Date.now().toString(),
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
        updatesTillNow: 0,
        avatarUrl: req.body.avatarurl,
        bannerUrl: req.body.bannerurl,
        Goal: [],
        Update: [],
        ownerId: req.body.ownerid,
        owner: {
            connect: {
                id: req.body.ownerid
            }
        },
        Proposal: req.body.proposals || []
      };
    
    const buidlData = await prisma.buidl.create({data: data})
    console.log(buidlData)

    res.status(200).json({
        status: 200,
        data: buidlData,
    })


    }
}
