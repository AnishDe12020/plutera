import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  ButtonProps,
  useDisclosure,
  Icon,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Proposal } from "@prisma/client";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { TicketIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useMutation } from "react-query";
import useProgram from "../hooks/useProgram";

interface VoteModal extends ButtonProps {
  proposal: Proposal;
}

const VoteModal = ({
  children = "Vote",
  proposal,
  ...otherProps
}: VoteModal) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connection } = useConnection();
  const toast = useToast();

  const { program } = useProgram();

  const router = useRouter();

  const handleVote = useCallback(
    async (upvote: boolean) => {
      if (!program) {
        throw new Error("Program not initialized");
      }

      if (!session?.user?.name) {
        throw new Error("User not logged in");
      }

      console.log(upvote);

      const voterPDA = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vote"),
          new PublicKey(proposal.pubkey).toBuffer(),
          new PublicKey(session.user.name).toBuffer(),
        ],
        program.programId
      )[0];

      const sig = await program.methods
        .vote(upvote)
        .accounts({
          proposalAccount: new PublicKey(proposal.pubkey),
          voter: new PublicKey(session.user.name),
          voterAccount: voterPDA,
        })
        .rpc();

      await connection.confirmTransaction(sig);

      await axios.patch(`/api/proposals/${proposal.id}`, {
        upvotes: upvote ? proposal.upvotes + 1 : undefined,
        downvotes: !upvote ? proposal.downvotes + 1 : undefined,
      });

      toast({
        title: "Vote submitted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      router.reload();
    },
    [session?.user?.name, program, proposal, connection, toast, router]
  );

  const { mutate, isLoading } = useMutation(handleVote);

  return (
    <>
      <Button
        color="white"
        leftIcon={<Icon as={TicketIcon} />}
        onClick={onOpen}
        {...otherProps}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Vote</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={4}>
              <Heading>{proposal.name}</Heading>
              <Text>{proposal.purpose}</Text>

              <Button
                color="white"
                onClick={() => mutate(true)}
                isLoading={isLoading}
                h={12}
                w="full"
              >
                Approve ({proposal.upvotes} till now)
              </Button>
              <Button
                color="white"
                onClick={() => mutate(false)}
                isLoading={isLoading}
                h={12}
                w="full"
              >
                Reject ({proposal.downvotes} till now)
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VoteModal;
