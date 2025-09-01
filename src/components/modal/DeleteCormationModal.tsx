import React from "react";
import Button from "@/components/ui/button/Button";

type DeleteModalProps = {
  className: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmationModal({ 
  className, 
  onClose, 
  onConfirm 
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Confirmer la suppression
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Voulez-vous vraiment supprimer les présences pour la classe {className} ?
        </p>
        <div className="mt-4 flex justify-end gap-4">
          <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
            Annuler
          </Button>
          <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}
