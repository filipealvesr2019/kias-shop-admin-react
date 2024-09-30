import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 150, height:30 }}>
        <InputLabel id="demo-simple-select-autowidth-label" style={{marginTop:"1rem"}}>Filtrar</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={age}
          onChange={handleChange}
          autoWidth
          label="Age"
        >
          <MenuItem value="">
            <em>nenhum</em>
          </MenuItem>
          <MenuItem value={10}>Pix</MenuItem>
          <MenuItem value={21}>Boleto</MenuItem>
          <MenuItem value={22}>Cartão de Crédito</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}