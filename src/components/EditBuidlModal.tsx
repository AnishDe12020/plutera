import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
  ButtonProps,
  useDisclosure,
  Icon,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { PencilIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

interface EditBuidlForm {
  name: string;
  description?: string;
  logoUrl: string;
}

interface EditBuidlModalProps extends ButtonProps {
  previousBuidl: any; // TODO: replace with  buidl type
}

const EditBuidlModal = ({
  children = "Edit Buidl",
  previousBuidl,
  ...otherProps
}: EditBuidlModalProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EditBuidlForm>({
    defaultValues: {
      name: previousBuidl.name,
      description: previousBuidl.description,
    },
  });

  const toast = useToast();

  const handleEditBuidl = useCallback(
    async (data: EditBuidlForm) => {
      if (!session?.user?.name) {
        throw new Error("User not logged in");
      }

      console.log(data);

      const {
        data: { buidl: updatedBuidl },
      } = await axios.patch("/api/buidls/update", {
        id: previousBuidl.id,
        name: data.name,
        description: data.description,
      });

      console.log("updated buidl: ", updatedBuidl);

      toast({
        title: "Buidl updated",
        description: "Your buidl has been updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [session?.user?.name, toast, previousBuidl]
  );

  const { mutate, isLoading } = useMutation(handleEditBuidl);

  return (
    <>
      <Button
        color="white"
        leftIcon={<Icon as={PencilIcon} />}
        onClick={onOpen}
        {...otherProps}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Buidl</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              gap={4}
              as="form"
              onSubmit={handleSubmit((data) => mutate(data))}
            >
              <FormControl isRequired isInvalid={errors.name ? true : false}>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                  })}
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea {...register("description", { required: false })} />
              </FormControl>

              <Button color="white" isLoading={isLoading} type="submit">
                Edit Buidl
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBuidlModal;
