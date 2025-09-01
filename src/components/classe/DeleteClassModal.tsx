import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface DeleteClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleDelete: () => void;
}

const DeleteClassModal: React.FC<DeleteClassModalProps> = ({
  isOpen,
  onClose,
  handleDelete,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] m-4">
    <div className="relative w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-2 dark:bg-gray-900 lg:p-8">
      <div className="px-2">
        <h4 className="mb-2 text-lg text-center font-semibold text-gray-800 dark:text-white/90">
          Confirmer la suppression
        </h4>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.
        </p>
      </div>
      <div className="flex items-center gap-3 px-2 mt-6 justify-center">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Supprimer
        </Button>
      </div>
    </div>
  </Modal>
);

export default DeleteClassModal;