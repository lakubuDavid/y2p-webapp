import { defineStore } from "pinia";
import { api } from "../../lib/client";
import type { ApiResponse } from "../../lib/types";
import { ref } from "vue";
import type { UserRoles } from "../models/user";

export type StaffData ={
  id:number,
  userId:number,
  role:UserRoles,
  createdAt:Date,
  user?:{
    name:string,
    email:string
  }
}

export const useStaffStore = defineStore("staff", () => {
  const staffMembers = ref<StaffData[]>([]);
  const error = ref();
  const loading = ref(false);

  const fetchAllStaff = async (role?: string) => {
    loading.value = true;
    const queryParams = role ? `?role=${role}` : "";
    const { data, ok, originalError } = await api.get(`/staff${queryParams}`);
    loading.value = false;
    
    if (!ok) {
      console.log(originalError);
      error.value = originalError;
      return;
    }
    
    const { data: staffData, error: _error } = data as ApiResponse<StaffData[]>;
    if (_error) {
      console.log(_error);
    }
    error.value = _error;
    staffMembers.value = staffData ?? [];
  };

  const fetchStaffById = async (id: number) => {
    loading.value = true;
    const { data, ok, originalError } = await api.get(`/staff/${id}`);
    loading.value = false;
    
    if (!ok) {
      console.log(originalError);
      error.value = originalError;
      return;
    }
    
    const {  error: _error } = data as ApiResponse<StaffData>;
    if (_error) {
      console.log(_error);
    }
    error.value = _error;
  };

  const createStaff = async (staffData: Partial<StaffData>) => {
    loading.value = true;
    const { data, ok, originalError } = await api.post("/staff", staffData);
    loading.value = false;
    
    if (!ok) {
      console.log(originalError);
      error.value = originalError;
      return;
    }
    
    const { data: newStaffData, error: _error } = data as ApiResponse<Omit<StaffData,"user">>;
    if (_error) {
      console.log(_error);
    }
    error.value = _error;
    
    // Add the new staff to the list
    fetchAllStaff()
    
    return newStaffData;
  };

  const updateStaff = async (id: number, value: Partial<StaffData>) => {
    loading.value = true;
    const { data, ok, originalError } = await api.patch(`/staff/${id}`, value);
    loading.value = false;
    
    if (!ok) {
      console.log(originalError);
      error.value = originalError;
      return;
    }
    
    const { data: staffData, error: _error } = data as ApiResponse<StaffData>;
    if (_error) {
      console.log(_error);
    }
    error.value = _error;
    
    // Update the staff in the list if it exists
    if (staffMembers.value && staffData) {
      const index = staffMembers.value.findIndex(s => s.id === id);
      if (index !== -1) {
        staffMembers.value[index] = staffData;
      }
    }
    
    
    return staffData;
  };

  const deleteStaff = async (id: number) => {
    loading.value = true;
    const { data, ok, originalError } = await api.delete(`/staff/${id}`);
    loading.value = false;
    
    if (!ok) {
      console.log(originalError);
      error.value = originalError;
      return;
    }
    
    const { error: _error } = data as ApiResponse<StaffData>;
    if (_error) {
      console.log(_error);
    }
    error.value = _error;
    
    // Remove the staff from the list if it exists
    if (staffMembers.value) {
      staffMembers.value = staffMembers.value.filter(s => s.id !== id);
    }
    
    
    return true;
  };

  // Initialize with all staff
  fetchAllStaff();

  return {
    staffMembers,
    error,
    loading,
    refresh: fetchAllStaff,
    getById: fetchStaffById,
    create: createStaff,
    update: updateStaff,
    delete: deleteStaff,
  };
});
