import React, { useState } from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRoundedIcon />
          Alert
        </DialogTitle>
        <Divider />
        <DialogContent>
        Tem certeza de que quer excluir essa categoria.        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="danger" onClick={onConfirm}>
            Excluir
          </Button>
          <Button variant="plain" color="neutral" onClick={onClose}>
            Cancelar
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

const Categories = () => {
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);

  const openDeleteConfirmationDialog = () => {
    setDeleteConfirmationDialogOpen(true);
  };

  const closeDeleteConfirmationDialog = () => {
    setDeleteConfirmationDialogOpen(false);
  };

  const confirmDelete = () => {
    // Lógica para confirmar a exclusão
    // ...
    closeDeleteConfirmationDialog();
  };

  return (
    <div>
      <table>
    
        <td>
          {editingItem !== sub._id ? (
            <div style={{ display: "flex", gap: "1rem" }}>
              {/* ... outros botões ... */}
              <button
                onClick={openDeleteConfirmationDialog}
                style={{
                  gap: ".5rem",
                  fontSize: "1rem",
                  backgroundColor: "#FFC2C5",
                  color: "red",
                  border: 0,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "8dvw",
                  height: "7dvh",
                  borderRadius: "5px",
                  
                }}
              >
                <img src="https://i.ibb.co/SsZjWVS/bin.png" alt="" /> Excluir
              </button>
            </div>
          ) : null}
        </td>
      </table>

      {/* Renderizar o modal */}
      <DeleteConfirmationModal
        open={deleteConfirmationDialogOpen}
        onClose={closeDeleteConfirmationDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Categories;
