import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { Class } from "@/types";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    firstName: string;
    lastName: string;
    classId: string;
    dietaryRegime: string;
    dateNaiss: string;
  };
  setFormData: (data: any) => void;
  formErrors: {
    firstName: string;
    lastName: string;
    classId: string;
    dietaryRegime: string;
    dateNaiss: string;
  };
  classes: Class[];
  isEdit: boolean;
  onSubmit: () => void;
  validateForm: () => boolean;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  formErrors,
  classes,
  isEdit,
  onSubmit,
  validateForm,
}) => {
  const dietaryOptions = [
    { value: "standard", label: "Régime standard" },
    { value: "vegetarian", label: "Végétarien" },
    { value: "vegan", label: "Végétalien" },
  ];

  const isFormValid = validateForm();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-2 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl text-center font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Modifier" : "Ajouter"} un élève
          </h4>
        </div>
        <form className="flex flex-col py-4">
          <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Nom de famille</Label>
                <Input
                  id="firstName"
                  defaultValue={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Nom de famille"
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
                {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
              </div>

              <div>
                <Label>Prénom</Label>
                <Input
                  id="lastName"
                  defaultValue={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Prénom"
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
                {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
              </div>

              <div>
                <Label>Date de naissance</Label>
                <Input
                  id="dateNaiss"
                  defaultValue={formData.dateNaiss}
                  onChange={(e) => setFormData({ ...formData, dateNaiss: e.target.value })}
                  type="date"
                  className={formErrors.dateNaiss ? "border-red-500" : ""}
                />
                {formErrors.dateNaiss && <p className="text-red-500 text-sm">{formErrors.dateNaiss}</p>}
              </div>

              <div>
                <Label>Classe</Label>
                <select
                  id="classId"
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded ${formErrors.classId ? "border-red-500" : "border-gray-200"}`}
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {formErrors.classId && <p className="text-red-500 text-sm">{formErrors.classId}</p>}
              </div>

              <div>
                <Label>Régime alimentaire</Label>
                <Select
                  options={dietaryOptions}
                  defaultValue={formData.dietaryRegime}
                  onChange={(value) => setFormData({ ...formData, dietaryRegime: value })}
                  placeholder="Choisir régime alimentaire"
                  className={formErrors.dietaryRegime ? "border-red-500" : ""}
                />
                {formErrors.dietaryRegime && <p className="text-red-500 text-sm">{formErrors.dietaryRegime}</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!isFormValid}
              className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isEdit ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default StudentFormModal;