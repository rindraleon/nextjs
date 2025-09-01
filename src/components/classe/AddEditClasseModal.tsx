import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

interface AddEditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: { name: string };
  setFormData: (data: { name: string }) => void;
  formError: string | null;
  handleSubmit: () => void;
  isEdit: boolean;
}

const AddEditClassModal: React.FC<AddEditClassModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  formError,
  handleSubmit,
  isEdit,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
    <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-2 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-xl text-center font-semibold text-gray-800 dark:text-white/90">
          {isEdit ? "Modifier" : "Ajouter"} un enregistrement
        </h4>
      </div>
      <form className="flex flex-col py-4">
        <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
          <div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5">
              <div>
                <Label>Nom de la classe</Label>
                <Input
                  id="name"
                  defaultValue={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Nom de la classe"
                  className={formError ? "border-red-500" : ""}
                />
                {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Modifier" : "Ajouter"}</Button>
        </div>
      </form>
    </div>
  </Modal>
);

export default AddEditClassModal;