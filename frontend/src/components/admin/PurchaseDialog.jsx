import Button from "../common/Button";
import Modal from "../common/Modal";

export default function PurchaseDialog({ vehicle, onCancel, onConfirm, loading = false }) {
  if (!vehicle) return null;

  return (
    <Modal title="Confirm purchase" onClose={onCancel}>
      <div className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            {vehicle.make} {vehicle.model}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            This will reduce available stock from {vehicle.quantity} to {Number(vehicle.quantity) - 1}.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button disabled={loading} onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
          <Button disabled={loading} onClick={onConfirm} type="button">
            {loading ? "Purchasing..." : "Confirm Purchase"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
