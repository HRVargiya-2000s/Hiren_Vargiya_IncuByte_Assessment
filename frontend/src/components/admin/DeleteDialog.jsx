import Button from "../common/Button";
import Modal from "../common/Modal";

export default function DeleteDialog({ vehicle, onCancel, onConfirm }) {
  if (!vehicle) return null;

  return (
    <Modal title="Delete vehicle" onClose={onCancel}>
      <p className="mb-5 text-sm text-slate-600">
        Delete {vehicle.make} {vehicle.model} from inventory?
      </p>
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="secondary">Cancel</Button>
        <Button onClick={onConfirm} type="button" variant="danger">Confirm Delete</Button>
      </div>
    </Modal>
  );
}
