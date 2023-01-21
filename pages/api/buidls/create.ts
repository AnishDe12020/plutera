// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if (req.method === "POST") { 
        const prisma = new PrismaClient()
        await prisma.$connect()
    
    let buidlData = await prisma.buidl.create({data: {
        name: req.body.name,
        description: req.body.description,
        url: req.body.description,
        pubkey: req.body.pubkey,
        twitter: req.body.twitter,
        github: req.body.github,
        amountRequested: req.body.amountrequested || 0,
        amountRaised: req.body.amountraised || 0,
        token: {
            address: req.body.tokenaddress,
            symbol: req.body.tokensymbol,
            logoURI: req.body.tokenuri
        },
        updatesTillNow: 0,
        Goal: req.body.goals ,
        Update: req.body.update,
        ownerId: req.body.ownerid,
        Proposal: req.body.proposals
    }})
    
    console.log(buidlData)

    res.status(200).json({
        status: 200,
        data: buidlData,
    })

}
}
