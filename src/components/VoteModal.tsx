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
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { TicketIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useMutation } from "react-query";
import useProgram from "../hooks/useProgram";

interface VoteModal extends ButtonProps {
  proposal: any; // TODO: replace with proposal type
}

const VoteModal = ({
  children = "Vote",
  proposal,
  ...otherProps
}: VoteModal) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { program } = useProgram();

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
          new PublicKey(proposal.address).toBuffer(),
          new PublicKey(session.user.name).toBuffer(),
        ],
        program.programId
      )[0];

      // program.methods
      //   .vote(upvote)
      //   .accounts({
      //     proposalAccount: new PublicKey(proposal.address),
      //     voter: new PublicKey(session.user.name),
      //     voterAccount: voterPDA,
      //   })
      //   .rpc();
    },
    [session?.user?.name, program, proposal]
  );

  const { mutate, isLoading } = useMutation(handleVote);

  return (
    <>
      <Button
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
                onClick={() => mutate(true)}
                isLoading={isLoading}
                h={12}
                w="full"
              >
                Approve
              </Button>
              <Button
                onClick={() => mutate(false)}
                isLoading={isLoading}
                h={12}
                w="full"
              >
                Reject
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VoteModal;
