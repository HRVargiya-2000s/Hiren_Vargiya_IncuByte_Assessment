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
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{vehicle.make} {vehicle.model}</p>
          <p className="mt-1">Current stock: {vehicle.quantity}</p>
          <p>New stock: {Number(vehicle.quantity || 0) + Number(quantity || 0)}</p>
        </div>
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
          <Button disabled={!Number.isInteger(Number(quantity)) || Number(quantity) <= 0} onClick={() => onConfirm(Number(quantity))} type="button">Restock</Button>
        </div>
      </div>
    </Modal>
  );
}
