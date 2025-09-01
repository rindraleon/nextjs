import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import { menuOptions } from "./constants";


interface RepasModalProps {
  isOpen: boolean;
  onClose: () => void;
  isManualMode: boolean;
  formData: {
    studentId: string;
    totalPresence: string;
    date: string;
    menuName: string;
  };
  editId: number | null;
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onResetForm: () => void;
}

export const RepasModal = ({
  isOpen,
  onClose,
  isManualMode,
  formData,
  editId,
  onInputChange,
  onSubmit,
  onResetForm,
}: RepasModalProps) => {
  const handleClose = () => {
    onClose();
    onResetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[640px] m-4">
      <div className="no-scrollbar relative w-full max-w-[640px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl text-center font-semibold text-gray-800 dark:text-white/90">
            {editId ? "Modifier un repas" : isManualMode ? "Ajouter un repas manuel" : "Ajouter un repas spécialisé"}
          </h4>
        </div>
        <div className="flex flex-col">
          <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              {isManualMode ? (
                <div>
                  <Label>Nombre total de présences *</Label>
                  <Input
                    id="totalPresence"
                    type="number"
                    min="1"
                    value={formData.totalPresence}
                    onChange={(e) => onInputChange('totalPresence', e.target.value)}
                    placeholder="Saisir le nombre total de présences"
                  />
                </div>
              ) : (
                <div>
                  <Label>ID de l'étudiant *</Label>
                  <Input
                    id="studentId"
                    type="number"
                    min="1"
                    value={formData.studentId}
                    onChange={(e) => onInputChange('studentId', e.target.value)}
                    placeholder="Saisir l'ID de l'étudiant"
                  />
                </div>
              )}
              <div>
                <Label>Menu *</Label>
                <div className="relative">
                  <Select
                    options={menuOptions}
                    value={formData.menuName}
                    onChange={(value) => onInputChange('menuName', value)}
                    placeholder="Sélectionner un menu"
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
              <div>
                <Label>Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => onInputChange('date', e.target.value)}
                  placeholder="Sélectionner une date"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button onClick={onSubmit}>
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};