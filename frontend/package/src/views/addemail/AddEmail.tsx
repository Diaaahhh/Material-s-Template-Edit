import React, { useState, ChangeEvent } from 'react';
import { Label, TextInput, Button, FileInput, Alert } from "flowbite-react";
import axios from 'axios';

function AddEmail() {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // State for Single Entry
  const [singleForm, setSingleForm] = useState({
    name: '',
    email: ''
  });

  // State for Bulk Entry
  const [bulkForm, setBulkForm] = useState<{name: string, file: File | null}>({
    name: '',
    file: null
  });

  // Handle Input Changes for Single Tab
  const handleSingleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSingleForm({ ...singleForm, [e.target.id]: e.target.value });
  };

  // Handle Input Changes for Bulk Tab (Folder Name)
  const handleBulkNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBulkForm({ ...bulkForm, name: e.target.value });
  };

  // Handle File Selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type === "text/plain") {
      setBulkForm({ ...bulkForm, file: file });
    } else {
      alert("Please upload a valid .txt file");
      e.target.value = ""; // Reset input
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      if (activeTab === 1) {
        // === SINGLE SUBMISSION (JSON) ===
        if (!singleForm.name || !singleForm.email) {
            throw new Error("Please fill in all fields.");
        }
        
        await axios.post('http://localhost:8081/api/ui/addemail', {
            name: singleForm.name,
            email: singleForm.email
        });

        setStatus({ type: 'success', message: 'Email added successfully!' });
        setSingleForm({ name: '', email: '' }); 
      } 
      else {
        // === BULK SUBMISSION (FormData) ===
        if (!bulkForm.name || !bulkForm.file) {
            throw new Error("Please provide a folder name and a .txt file.");
        }

        // We must use FormData object to send files
        const formData = new FormData();
        formData.append('name', bulkForm.name);
        formData.append('file', bulkForm.file);

        await axios.post('http://localhost:8081/api/ui/addemail', formData);

        setStatus({ type: 'success', message: 'Bulk emails processed successfully!' });
        setBulkForm({ name: '', file: null });
        
        // Reset file input visually if needed, usually requires a ref or simple reload logic
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = "";
      }

      // === TIMER: Clear Success Message after 3 seconds ===
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 3000);

    } catch (error: any) {
      console.error(error);
      setStatus({ 
        type: 'failure', 
        message: error.response?.data?.message || error.message || "Something went wrong" 
      });
    // === TIMER: Clear Error Message after 5 seconds (longer read time) ===
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 5000);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <h5 className="card-title mb-4">Add New Email</h5>

      {status.message && (
        <Alert color={status.type} className="mb-4">
          <span>{status.message}</span>
        </Alert>
      )}

      {/* === Tabs === */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab(1)}
          className={`pb-3 px-4 text-sm font-medium transition-colors duration-200 ${
            activeTab === 1
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-500"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Single
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`pb-3 px-4 text-sm font-medium transition-colors duration-200 ${
            activeTab === 2
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-500"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Bulk
        </button>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-12 gap-10">
          <div className="lg:col-span-6 col-span-10">
            <div className="flex flex-col gap-4">
              
              {/* === LAYOUT 1: Single Email === */}
              {activeTab === 1 && (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Name" />
                  </div>
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Folder Name"
                    required
                    className="form-control form-rounded-xl"
                    value={singleForm.name}
                    onChange={handleSingleChange}
                  />

                  <div className="mb-2 block mt-4">
                    <Label htmlFor="email" value="Email" />
                  </div>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="name@materialm.com"
                    required
                    className="form-control form-rounded-xl"
                    value={singleForm.email}
                    onChange={handleSingleChange}
                  />
                </div>
              )}

              {/* === LAYOUT 2: Bulk Upload === */}
              {activeTab === 2 && (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="bulk-name" value="Name" />
                  </div>
                  <TextInput
                    id="bulk-name"
                    type="text"
                    placeholder="Folder Name"
                    required
                    className="form-control form-rounded-xl"
                    value={bulkForm.name}
                    onChange={handleBulkNameChange}
                  />
                  <p className="text-xs text-gray-400 mt-2 mb-2">
                    This name will be applied to all emails in the file.
                  </p>

                  <div className="mt-4">
                      <div className="mb-2 block">
                        <Label htmlFor="file-upload" value="Upload Text File" />
                      </div>
                      <FileInput 
                        id="file-upload" 
                        accept=".txt" 
                        helperText="Only .txt files are allowed." 
                        className="form-rounded-xl"
                        onChange={handleFileChange}
                      />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* === Action Buttons === */}
          <div className="col-span-12 flex gap-3 mt-4">
            <Button color={'primary'} onClick={handleAdd} disabled={loading}>
                {loading ? 'Processing...' : (activeTab === 1 ? 'Save Email' : 'Upload Bulk')}
            </Button>
            <Button color={'error'} onClick={() => setStatus({type:'', message:''})}>
                Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEmail;