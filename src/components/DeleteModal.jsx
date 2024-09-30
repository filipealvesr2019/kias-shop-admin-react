// DeleteModal.jsx

import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';

export default function DeleteModal({ onDelete }) {
  const [open, setOpen] = React.useState(false);

  const handleContinue = () => {
    // Chame a função onDelete apenas quando o usuário clicar em "Continue"
    onDelete();
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}  style={{gap:".5rem", fontSize:"1rem", backgroundColor:"#FFC2C5", color:"red", border:0, fontWeight:"bold", padding:".5rem", width:"8dvw"}}>
      <img src="https://i.ibb.co/SsZjWVS/bin.png" alt=""/> Excluir
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="nested-modal-title"
          aria-describedby="nested-modal-description"
        >
          <Typography id="nested-modal-title" level="h2">
          Você tem certeza de que quer excluir esse produto?          </Typography>
          <Typography id="nested-modal-description" textColor="text.tertiary">
          Essa ação não pode ser desfeita. Isso excluirá permanentemente o produto.
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row-reverse' },
            }}
          >
            <Button variant="solid" onClick={handleContinue} style={{backgroundColor:"red"}}>
              Continuar
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
