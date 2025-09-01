// components/stock/MovementModal.tsx
import React, { useState } from "react";
import { StockService } from "@/services/stock";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { Modal } from "../ui/modal";

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  stockItems: any[];
  showToast: (message: string, type: "success" | "error") => void;
}

export default function MovementModal({ 
  isOpen, 
  onClose, 
  onSave,
  
  stockItems,
  showToast
}: MovementModalProps) {
  const [formData, setFormData] = useState({
    itemId: "",
    quantity: "",
    unit: "g", // Unité par défaut
    type: "",
    reason: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Convertir les unités
  const convertUnit = (quantity: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) return quantity;
    if (fromUnit === "g" && toUnit === "kg") return quantity / 1000;
    if (fromUnit === "kg" && toUnit === "g") return quantity * 1000;
    return quantity;
  };

  // Soumettre le mouvement
  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!formData.itemId) errors.itemId = "L'article est requis";
    if (!formData.quantity || Number(formData.quantity) <= 0) 
      errors.quantity = "La quantité doit être supérieure à 0";
    if (!formData.type) errors.type = "Le type de mouvement est requis";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const item = stockItems.find(i => i.id === Number(formData.itemId));
      if (!item) throw new Error("Article introuvable");

      // Convertir en unité de base
      const baseQuantity = convertUnit(
        Number(formData.quantity),
        formData.unit,
        item.unite
      );

      // Vérifier le stock pour les sorties
      if (formData.type === "OUT" && baseQuantity > item.quantity) {
        throw new Error("Quantité en sortie supérieure au stock disponible");
      }

      // Calculer la nouvelle quantité
      const newQuantity = formData.type === "IN" 
        ? item.quantity + baseQuantity 
        : item.quantity - baseQuantity;

      // Mettre à jour le stock
      await StockService.updateItem(item.id, {
        ...item,
        quantity: newQuantity
      });

      // Enregistrer le mouvement
      await StockService.createMovement({
        itemId: item.id,
        quantity: baseQuantity,
        type: formData.type,
        reason: formData.reason,
        newQuantity
      });

      showToast("Mouvement enregistré avec succès", "success");
      onSave();
      onClose();
    } catch (error: any) {
      showToast(error.message || "Erreur lors de l'enregistrement du mouvement", "error");
    }
  };

  

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl text-center font-semibold text-gray-800 dark:text-white/90">
            Ajouter un mouvement
          </h4>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar h-auto overflow-y-auto px-2 py-6 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Article</Label>
                <select
                  value={formData.itemId}
                  onChange={(e) => setFormData({...formData, itemId: e.target.value})}
                  className={`w-full rounded-lg border ${
                    formErrors.itemId ? "border-red-500" : "border-gray-200"
                  } px-4 py-3 text-sm`}
                >
                  <option value="">Sélectionner un article</option>
                  {stockItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.quantity} {item.unite})
                    </option>
                  ))}
                </select>
                {formErrors.itemId && <p className="text-red-500 text-sm">{formErrors.itemId}</p>}
              </div>
              
              <div>
                <Label>Quantité</Label>
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
                <Label>Unité</Label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
                >
                  <option value="g">Gramme</option>
                  <option value="kg">Kilogramme</option>
                  <option value="l">Litre</option>
                  <option value="unit">Unité</option>
                </select>
              </div>
              
              <div>
                <Label>Type de mouvement</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className={`w-full rounded-lg border ${
                    formErrors.type ? "border-red-500" : "border-gray-200"
                  } px-4 py-3 text-sm`}
                >
                  <option value="">Sélectionner un type</option>
                  <option value="IN">Entrée</option>
                  <option value="OUT">Sortie</option>
                </select>
                {formErrors.type && <p className="text-red-500 text-sm">{formErrors.type}</p>}
              </div>
              
              <div className="lg:col-span-2">
                <Label>Raison (facultatif)</Label>
                <Input
                  defaultValue={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Saisir la raison du mouvement"
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 px-2">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit}>Enregistrer</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}