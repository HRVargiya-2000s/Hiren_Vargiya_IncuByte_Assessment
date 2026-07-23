import { useState } from "react";

import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

export default function RestockModal({ vehicle, onCancel, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  if (!vehicle) return null;

  return (
    <Modal title="Restock vehicle" onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Add stock for {vehicle.make} {vehicle.model}.
        </p>
        <Input
          id="restockQuantity"
          label="Restock quantity"
          min="1"
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} type="button" variant="secondary">Cancel</Button>
          <Button onClick={() => onConfirm(Number(quantity))} type="button">Restock</Button>
        </div>
      </div>
    </Modal>
  );
}
