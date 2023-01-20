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
} from "@chakra-ui/react";
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

  const handleEditBuidl = useCallback(
    async (data: EditBuidlForm) => {
      if (!session?.user?.name) {
        throw new Error("User not logged in");
      }

      console.log(data);

      // TODO: edit buidl on db
    },
    [session?.user?.name]
  );

  const { mutate, isLoading } = useMutation(handleEditBuidl);

  return (
    <>
      <Button
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

              <Button isLoading={isLoading} type="submit">
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
