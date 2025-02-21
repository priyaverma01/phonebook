import React, { useEffect, useState } from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Pagination from '@mui/material/Pagination';

import './Style.css';
// import { IconButton } from "@mui/material";

function Phonelist() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contacts, setContacts] = useState([]);
  const [bookmark, setBookmark] = useState([]);
  const [editindex, seteditIndex] = useState(null);
  const [searchterm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [label, setLabel] = useState('');
  const [filterLabel, setFilterLabel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(10);
  
 
   const indexOfLastContact = currentPage * itemsPerPage;
   const indexOfFirstContact = indexOfLastContact - itemsPerPage;
   const currentContacts = (results.length > 0 ? results : contacts).slice(indexOfFirstContact, indexOfLastContact);
 
  
   useEffect(() => {
     const storedContacts = JSON.parse(localStorage.getItem('contacts'));
     console.log('loaded contacts',storedContacts)
     if (storedContacts) {
       setContacts(storedContacts);
     }
   }, []);
 
   
   useEffect(() => {
     localStorage.setItem('contacts', JSON.stringify(contacts));
   }, [contacts]);
  


   const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredContacts = contacts.filter(contact =>
      contact.name.includes(term) || contact.phone.includes(term) || contact.label.includes(term)
    );
    setResults(filteredContacts);
    setCurrentPage(1);
  };

  const applyLabelFilter = () => {
    if (filterLabel) {

      const filteredContacts = contacts.filter(contact => contact.label === filterLabel);
      setResults(filteredContacts); 
    } else {
     
      setResults(contacts);
    }
    setCurrentPage(1);
  };
  

 
  const handleAddContact = () => {
    if (name && phone && label) {
      let updatedContacts = [];
      if (editindex !== null) {
        updatedContacts = [...contacts];
        updatedContacts[editindex] = { name, phone, label };
        seteditIndex(null);
      } else {
        updatedContacts = [...contacts, { name, phone, label, bookmarked: false }];
      }
        
      updatedContacts.sort((a, b) => a.name.localeCompare(b.name));
  
      setContacts(updatedContacts);
      setName("");
      setPhone("");
      setLabel("");
    } else {
      alert("Please fill in all fields.");
    }
  };
  
  const handleEditContact = (index) => {
    setName(contacts[index].name);
    setPhone(contacts[index].phone);
    setLabel(contacts[index].label);
    seteditIndex(index);
  };


  const deleteData = (index) => {
    const updatedData = contacts.filter((_, i) => i !== index);
    setContacts(updatedData);
  };

  
  const handleClick = (index) => {
    const updatedContacts = contacts.map((contact, i) =>
      i === index ? { ...contact, bookmarked: true } : contact
    );
    setContacts(updatedContacts);
  };

  
  const handleDoubleClick = (index) => {
    const updatedContacts = contacts.map((contact, i) =>
      i === index ? { ...contact, bookmarked: false } : contact
    );
    setContacts(updatedContacts);
  };

  
  const handlePageChange = (value) => {
    setCurrentPage(value);
  };


  return (
    <Container maxWidth="sm                                                                                                                                                     " sx={{ marginTop: '40px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <PermContactCalendarIcon sx={{ marginRight: 1 }} />
        <Typography variant="h5">Phonebook</Typography>
        <TextField sx={{ width: '10%', marginLeft: '60%' }} size="small"
          value={searchterm}
          onChange={handleSearch}
          id="outlined-basic" label="Search Contact" variant="outlined" />

        <Grid item lg={20} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Label</InputLabel>
            <Select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              label="Label"
            >
              <MenuItem value="Family">Family</MenuItem>
              <MenuItem value="Friends">Friends</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <FilterAltOutlinedIcon onClick={applyLabelFilter}
          style={{ fontSize: '30px', marginLeft: '10px' }} >
        </FilterAltOutlinedIcon>
      </Box>

      <Grid container spacing={2} sx={{ marginBottom: '20px', display: 'flex' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onInput={(e) => {

              e.target.value = e.target.value.replace(/[^0-9]/g, '');
              setPhone(e.target.value);
            }}
          />
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" onClick={handleAddContact}>
        {editindex !== null ? 'Edit Contact' : 'Add Contact'}
      </Button>

      
      <Grid container spacing={2} sx={{ marginTop: '20px' }}>
        {currentContacts.map((contact, index) => (
          <Grid item xs={12} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0px' }}>
                  <Typography variant="body1" sx={{ marginBottom: '10px', display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                    <strong>Name:</strong> {contact.name}, <strong>Phone:</strong> {contact.phone}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EditIcon onClick={() => handleEditContact(index)} />
                    <DeleteIcon onClick={() => deleteData(index)} />
                    <IconButton
                      onClick={() => handleClick(index)}
                      onDoubleClick={() => handleDoubleClick(index)}
                      sx={{ marginLeft: '10px' }}
                    >
                      {contact.bookmarked ? (
                        <BookmarkIcon sx={{ fontSize: 25 }} />
                      ) : (
                        <BookmarkBorderIcon sx={{ fontSize: 25 }} />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {results.length === 0 && searchterm && (
        <Grid item sx={12}>
          <Typography>No contact Found</Typography>
        </Grid>
      )}
    <Pagination
        count={Math.ceil((results.length > 0 ? results.length : contacts.length) / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      />
    </Container>
  );
}
export default Phonelist;
