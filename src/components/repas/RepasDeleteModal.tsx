import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="no-scrollbar relative w-full max-w-[640px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h3 className="text-lg text-center font-bold mb-4 py-4">Confirmer la suppression</h3>
        <p className="text-center">Êtes-vous sûr de vouloir supprimer ce repas ?</p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  );
};