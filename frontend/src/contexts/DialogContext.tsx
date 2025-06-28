// contexts/DialogContext.tsx
import React from "react";

type TItem = {
  awardYear?: number;
  dateAwarded?: string;
  category: {
    en?: string;
  };
  laureates: {
    fullName?: {
      id?: string;
      en?: string;
    };
    orgName?: {
      id?: string;
      en?: string;
    };
  }[];
};

interface DialogContextType {
  openDialog: (item: TItem | null) => void;
  closeDialog: () => void;
  selectedItem: TItem | null;
}

const DialogContext = React.createContext<DialogContextType>({
  openDialog: () => {},
  closeDialog: () => {},
  selectedItem: null,
});

export const useDialog = () => React.useContext(DialogContext);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedItem, setSelectedItem] = React.useState<TItem | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const openDialog = (item: TItem | null) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, selectedItem }}>
      {children}
      {isOpen && <Dialog />}
    </DialogContext.Provider>
  );
};

const Dialog = () => {
  const { closeDialog, selectedItem } = useDialog();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Prize Details</h2>

        <div className="space-y-3">
          <p>
            <strong>Category:</strong> {selectedItem?.category?.en}
          </p>
          <p>
            <strong>Award Date:</strong>{" "}
            {selectedItem?.dateAwarded || "Não disponível"}
          </p>

          <div>
            <h3 className="font-bold mb-2">Laureates:</h3>
            <ul className="list-disc pl-6">
              {selectedItem?.laureates?.map((laureate: any, index: number) => (
                <li key={index}>
                  {laureate?.fullName?.en ||
                    laureate?.orgName?.en ||
                    "Nome não disponível"}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={closeDialog}
          className="mt-6 px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
