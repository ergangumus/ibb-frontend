import React from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

const EditParkDialog = ({ open, onClose, selectedPark, editPark, setEditPark, loadCarparks }) => {
  const handleEditCarpark = async () => {
    const accessToken = window.localStorage.getItem("accessToken");

    const updatedCarparkData = {
      park_name: editPark.name || selectedPark.park_name,
      location_name: editPark.location_name || selectedPark.location_name,
      park_type_id: editPark.park_type_id || selectedPark.park_type_id,
      park_type_desc: editPark.park_type_desc || selectedPark.park_type_desc,
      capacity_of_park: parseInt(editPark.capacity, 10) || selectedPark.capacity_of_park,
      working_time: editPark.working_time || selectedPark.working_time,
      county_name: editPark.county_name || selectedPark.county_name,
      location: selectedPark.location,
    };

    try {
      await axios.put(`http://localhost:8000/api/carpark/update/${selectedPark.id}/`, updatedCarparkData, {
        headers: { Authorization: "Token " + accessToken },
      });
      onClose();
      loadCarparks();
    } catch (error) {
      console.error("Error updating car park:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Park Details</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="Park Name" fullWidth value={editPark.name || (selectedPark ? selectedPark.park_name : "")} onChange={(e) => setEditPark({ ...editPark, name: e.target.value })} />
        <TextField margin="dense" label="Location Name" fullWidth value={editPark.location_name || (selectedPark ? selectedPark.location_name : "")} onChange={(e) => setEditPark({ ...editPark, location_name: e.target.value })} />
        <TextField margin="dense" label="Park Type ID" fullWidth value={editPark.park_type_id || (selectedPark ? selectedPark.park_type_id : "")} onChange={(e) => setEditPark({ ...editPark, park_type_id: e.target.value })} />
        <TextField margin="dense" label="Park Type Description" fullWidth value={editPark.park_type_desc || (selectedPark ? selectedPark.park_type_desc : "")} onChange={(e) => setEditPark({ ...editPark, park_type_desc: e.target.value })} />
        <TextField margin="dense" label="Capacity" fullWidth value={editPark.capacity || (selectedPark ? selectedPark.capacity_of_park : "")} onChange={(e) => setEditPark({ ...editPark, capacity: e.target.value })} />
        <TextField margin="dense" label="Working Time" fullWidth value={editPark.working_time || (selectedPark ? selectedPark.working_time : "")} onChange={(e) => setEditPark({ ...editPark, working_time: e.target.value })} />
        <TextField margin="dense" label="County Name" fullWidth value={editPark.county_name || (selectedPark ? selectedPark.county_name : "")} onChange={(e) => setEditPark({ ...editPark, county_name: e.target.value })} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleEditCarpark}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditParkDialog;
