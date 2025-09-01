import React, { useState, useEffect, useRef } from "react";
import { StockService } from "@/services/stock";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { ChevronDownIcon } from "@/icons";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editId: number | null;
  stockItems: any[];
  showToast: (message: string, type: "success" | "error") => void;
}

export default function StockModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editId,
  stockItems,
  showToast
}: StockModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unite: "g",
    alertThreshold: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Liste des options de menu
  const menuOptions = [
    "Riz", "Poulet", "Carottes", "Pâtes", "Bœuf", "Sauce tomate",
    "Poisson", "Pommes de terre", "Petits pois", "Tofu", "Brocoli",
    "Lentilles", "Épinards", "Courgettes", "Agneau", "Concombre",
    "Pois chiches", "Quinoa", "Avocat", "Chou kale", "Pâtes sans gluten",
    "Haricots mélangés", "Maïs", "Poivrons"
  ];

  // Filtrer les options basées sur la recherche
  const filteredOptions = menuOptions.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialiser le formulaire lors de l'ouverture
  useEffect(() => {
    if (editId && isOpen) {
      const stock = stockItems.find(item => item.id === editId);
      if (stock) {
        setFormData({
          name: stock.name || "",
          quantity: stock.quantity?.toString() || "",
          unite: stock.unite || "",
          alertThreshold: stock.alertThreshold?.toString() || "",
        });
        setSearchTerm(stock.name || "");
      }
    } else if (isOpen) {
      setFormData({ name: "", quantity: "", unite: "", alertThreshold: "" });
      setSearchTerm("");
    }
  }, [editId, isOpen, stockItems]);

  // Valider le formulaire
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = "Le nom est requis";
    
    const quantity = Number(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) 
      errors.quantity = "La quantité doit être supérieure à 0";
    
    if (!formData.unite) errors.unite = "L'unité est requise";
    
    const alertThreshold = Number(formData.alertThreshold);
    if (isNaN(alertThreshold) )
      errors.alertThreshold = "Veuillez entrer un nombre valide";
    else if (alertThreshold < 0)
      errors.alertThreshold = "Le seuil d'alerte doit être positif ou zéro";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast("Veuillez corriger les erreurs dans le formulaire", "error");
      return;
    }

    try {
      // Préparer les données numériques
      const numericData = {
        name: formData.name,
        quantity: Number(formData.quantity),
        unite: formData.unite,
        alertThreshold: Number(formData.alertThreshold)
      };

      let result;
      if (editId) {
        result = await StockService.updateItem(editId.toString(), numericData);
        showToast("Stock mis à jour avec succès", "success");
      } else {
        result = await StockService.createItem(numericData);
        showToast("Stock créé avec succès", "success");
      }
      
      // Appeler onSave avec le résultat
      onSave(result);
      onClose();
      
    } catch (error) {
      showToast(`Erreur: ${error.message}`, "error");
    }
  };

  // Sélectionner une option du menu
  const handleSelectOption = (option: string) => {
    setFormData({ ...formData, name: option });
    setSearchTerm(option);
    setShowDropdown(false);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl text-center font-semibold text-gray-800 dark:text-white/90">
            {editId ? "Modifier un stock" : "Ajouter un stock"}
          </h4>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar h-auto overflow-y-auto px-2 py-6 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="relative" ref={dropdownRef}>
                <Label>Nom du stock</Label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setFormData({ ...formData, name: e.target.value });
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Rechercher ou sélectionner un nom"
                    className={`w-full rounded-lg border ${
                      formErrors.name ? "border-red-500" : "border-gray-200"
                    } px-4 py-3 text-sm`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <ChevronDownIcon />
                  </button>
                </div>
                
                {showDropdown && (
                  <div className="absolute z-10 mt-1 w-full max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <div
                          key={option}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectOption(option)}
                        >
                          {option}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 italic">
                        Aucun résultat trouvé
                      </div>
                    )}
                  </div>
                )}
                
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
              
              <div>
                <Label>Quantité du stock</Label>
                <Input
                  type="number"
                  defaultValue={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="Saisir la quantité"
                  className={formErrors.quantity ? "border-red-500" : ""}
                />
                {formErrors.quantity && <p className="text-red-500 text-sm">{formErrors.quantity}</p>}
              </div>
              
              <div>
                <Label>Unité de stock</Label>
                <select
                  value={formData.unite}
                  onChange={(e) => setFormData({...formData, unite: e.target.value})}
                  className={`w-full rounded-lg border ${
                    formErrors.unite ? "border-red-500" : "border-gray-200"
                  } px-4 py-3 text-sm`}
                >
                  <option value="">Sélectionner une unité</option>
                  <option value="g">Gramme</option>
                  
                  <option value="l">Litre</option>
                  <option value="unit">Unité</option>
                  <option value="kg" disabled>Kilogramme</option>
                </select>
                {formErrors.unite && <p className="text-red-500 text-sm">{formErrors.unite}</p>}
              </div>
              
              <div>
                <Label>Seuil d'alerte</Label>
                <Input
                  type="number"
                  defaultValue={formData.alertThreshold}
                  onChange={(e) => setFormData({...formData, alertThreshold: e.target.value})}
                  placeholder="Saisir le seuil d'alerte"
                  className={formErrors.alertThreshold ? "border-red-500" : ""}
                />
                {formErrors.alertThreshold && <p className="text-red-500 text-sm">{formErrors.alertThreshold}</p>}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 px-2">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit}>{editId ? "Modifier" : "Ajouter"}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}