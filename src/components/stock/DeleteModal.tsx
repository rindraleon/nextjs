// components/stock/DeleteModal.tsx
import React from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px]">
      <div className="relative w-full max-w-[400px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
        <h4 className="mb-4 text-lg text-center font-semibold text-gray-800 dark:text-white/90">
          Confirmer la suppression
        </h4>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Êtes-vous sûr de vouloir supprimer cet élément de stock ?
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="danger" onClick={onConfirm}>Supprimer</Button>
        </div>
      </div>
    </Modal>
  );
}