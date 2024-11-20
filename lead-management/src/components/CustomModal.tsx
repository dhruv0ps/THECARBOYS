import React from "react";
import { Modal, Button, Label, Textarea } from "flowbite-react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  title?: string;
  label?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Custom Modal",
  label = "Enter your message",
}) => {
  const [message, setMessage] = React.useState<string>("");

  const handleSubmit = () => {
    onSubmit(message);
    setMessage(""); // Clear the input after submission
    onClose(); // Close the modal
  };

  return (
    <div>

    
    <Modal show={isOpen}   size="md"
    className="bg-transparent shadow-none  flex items-center mt-40 ml-48 justify-center "
 popup onClose={onClose}>
         <div className="p-4 rounded-lg shadow-lg bg-transparent border border-gray-300 ">
      <Modal.Header>
        <h5 className="text-xl font-medium  text-gray-900">{title}</h5>
      </Modal.Header>
     
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="message" value={label} />
            <Textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              required
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="gray"
          onClick={onClose}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!message.trim()}
          color="dark"
        >
          Send
        </Button>
      </Modal.Footer>
      </div>
    </Modal>
    </div>
  );
};

export default CustomModal;

