import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { Button, Checkbox, Label, Select, TextInput, Textarea } from 'flowbite-react'
import { toast } from 'react-toastify' // If using react-toastify for toast notifications
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaChevronLeft } from "react-icons/fa";
// Define feature options
const featureOptions = [
  { id: 'leatherSeats', label: 'Leather Seats' },
  { id: 'sunroof', label: 'Sunroof' },
  { id: 'bluetooth', label: 'Bluetooth' },
  { id: 'backupCamera', label: 'Backup Camera' },
]

type FormData = {
  make: string
  model: string
  year: string
  vin: string
  bodyType: string
  color: string
  mileage: string
  engineType: string
  transmission: string
  fuelType: string
  drivetrain: string
  condition: string
  price: string
  cost: string
  status: string
  location: string
  features: string[]
  notes: string
  warranty: string,
  inspectionDate: string,
  dateAdded: string,
  dateSold: string,
  id?: string,
  trim?:string,
}

const AddNewCarForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>()
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUpdatedCar(id);
    }
  }, [id]);

  const fetchUpdatedCar = async (id: string) => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vehicles/${id}`,{
        headers: {
          Authorization: `Bearer ${authToken}`,
        }});
      const carData = response.data;

      // Pre-fill form fields with fetched data
      Object.keys(carData).forEach((key) => {
        // Special handling for inspectionDate to convert ISO to YYYY-MM-DD
        if (key === 'inspectionDate' && carData[key]) {
          const date = new Date(carData[key]).toISOString().split('T')[0];
          setValue(key as keyof FormData, date);
        } else {
          setValue(key as keyof FormData, carData[key]);
        }
      });
    } catch (error) {
      toast.error('Failed to fetch car details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        toast.error('Unauthorized. Please log in.');
        navigate('/login');
        return;
      }
      
      if (data.inspectionDate) {
        data.inspectionDate = new Date(data.inspectionDate).toISOString();
      }
      
      let response;
      if (id) {
        response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/vehicles/${id}`, data, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        
        if (response.data.status === true || response.status === 200) {
          toast.success('Car details updated successfully!');
          navigate('/inventory/view');
        } else {
          
          const errorMessage = response.data.err || response.data.data?.err || "Failed to update car details. Please try again.";
          toast.error(errorMessage);
        }
      } else {
        response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/vehicles/add`, data, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        
        if (response.data.status === true || response.status === 201 || response.status === 200) {
          toast.success('New car added successfully!');
          navigate('/inventory/view');
        } else {
         
          const errorMessage = response.data.err || response.data.data?.err || "Failed to add new car. Please try again.";
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
     
      const errorMessage = 
        error.response?.data?.err || 
        error.response?.data?.data?.err || 
        error.message || 
        "Failed to save car details. Please try again.";
      
      console.error("Error saving vehicle details:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2  ml-6  bg-black rounded-md hover:bg-black"
      >
        <FaChevronLeft size={16} style={{ color: "white" }} /> {/* Back Icon */}
        <span style={{ color: "white" }}>Back</span>
      </button>
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Add New Car</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Make */}
            <div>
              <Label htmlFor="make" value="Make" />
              <TextInput id="make" placeholder="e.g. Toyota" {...register('make', { required: 'Make is required' })} />
              {errors.make && <p className="text-red-500">{errors.make.message}</p>}
            </div>

            {/* Model */}
            <div>
              <Label htmlFor="model" value="Model" />
              <TextInput id="model" placeholder="e.g. Camry" {...register('model', { required: 'Model is required' })} />
              {errors.model && <p className="text-red-500">{errors.model.message}</p>}
            </div>
            <div>
              <Label htmlFor="trim" value="Trim" />
              <TextInput
                id="trim"
                placeholder="e.g. XLE, SE, LE"
                {...register('trim', { required: 'Trim is required' })}
              />
             
            </div>

            {/* Year */}
            <div>
              <Label htmlFor="year" value="Year" />
              <TextInput id="year" placeholder="e.g. 2023" {...register('year', { required: 'Year is required', pattern: { value: /^\d{4}$/, message: 'Year must be a 4-digit number' } })} />
              {errors.year && <p className="text-red-500">{errors.year.message}</p>}
            </div>

            {/* VIN */}
            <div>
              <Label htmlFor="vin" value="VIN" />
              <TextInput id="vin" placeholder="17-character VIN" {...register('vin', { required: 'VIN is required', minLength: { value: 17, message: 'VIN must be 17 characters' }, maxLength: { value: 17, message: 'VIN must be 17 characters' } })} />
              {errors.vin && <p className="text-red-500">{errors.vin.message}</p>}
            </div>

            {/* Body Type */}
            <div>
              <Label htmlFor="bodyType" value="Body Type" />
              <Select id="bodyType" {...register('bodyType', { required: 'Body type is required' })}>
                <option value="">Select body type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Truck">Truck</option>
                <option value="Convertible">Convertible</option>
                <option value="Minivan">Minivan</option>
              </Select>
              
            </div>

            {/* Color */}
            <div>
              <Label htmlFor="color" value="Color" />
              <TextInput id="color" placeholder="e.g. Red" {...register('color', { required: 'Color is required' })} />
             
            </div>

            {/* Mileage */}
            <div>
              <Label htmlFor="mileage" value="Mileage" />
              <TextInput id="mileage" placeholder="e.g. 15000" {...register('mileage', { required: 'Mileage is required', pattern: { value: /^\d+$/, message: 'Mileage must be a number' } })} />
           
            </div>

            {/* Engine Type */}
            <div>
              <Label htmlFor="engineType" value="Engine Type" />
              <Select id="engineType" {...register('engineType', { required: 'Engine type is required' })}>
                <option value="">Select engine type</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </Select>
             
            </div>

            <div>
              <Label htmlFor="transmission" value="Transmission" />
              <Select id="transmission" {...register('transmission', { required: 'Transmission is required' })}>
                <option value="">Select transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </Select>
              {errors.transmission && <p className="text-red-500">{errors.transmission.message}</p>}
            </div>
            <div>
              <Label htmlFor="fuelType" value="Fuel Type" />
              <Select id="fuelType" {...register('fuelType', { required: 'Fuel type is required' })}>
                <option value="">Select fuel type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </Select>
              {errors.fuelType && <p className="text-red-500">{errors.fuelType.message}</p>}
            </div>
            <div>
              <Label htmlFor="drivetrain" value="Drivetrain" />
              <Select id="drivetrain" {...register('drivetrain', { required: 'Drivetrain is required' })}>
                <option value="">Select drivetrain</option>
                <option value="FWD">FWD</option>
                <option value="RWD">RWD</option>
                <option value="AWD">AWD</option>
                <option value="4WD">4WD</option>
              </Select>
              
            </div>

            {/* Condition */}
            <div>
              <Label htmlFor="condition" value="Condition" />
              <Select id="condition" {...register('condition', { required: 'Condition is required' })}>
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
              </Select>
              
            </div>

            <div>
              <Label htmlFor="price" value="Price" />
              <TextInput id="price" placeholder="e.g. 25000" {...register('price', { required: 'Price is required', pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Price must be a valid number' } })} />
             
            </div>

            {/* Cost */}
            <div>
              <Label htmlFor="cost" value="Cost" />
              <TextInput id="cost" placeholder="e.g. 20000" {...register('cost', { required: 'Cost is required', pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Cost must be a valid number' } })} />
              
            </div>

            <div>
              <Label htmlFor="status" value="Status" />
              <Select id="status" {...register('status', { required: 'Status is required' })}>
                <option value="">Select status</option>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Sold">Sold</option>

              </Select>
             
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" value="Location" />
              <TextInput id="location" placeholder="e.g. Main Lot" {...register('location', { required: 'Location is required' })} />
              {errors.location && <p className="text-red-500">{errors.location.message}</p>}
            </div>

            {/* Features */}
            <div className="col-span-2">
              <Label htmlFor="features" value="Features" />
              <div className="flex flex-wrap gap-2">
                {featureOptions.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.id}
                      {...register('features')}
                      value={feature.id}
                      className="mr-2"
                    />
                    <Label htmlFor={feature.id} className="text-sm">
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>
          
            </div>
            <div className="col-span-2">
              <Label htmlFor="warranty" value="Warranty" />
              <Textarea id="warranty" placeholder="Warranty details or service contracts" {...register('warranty')} />
           
            </div>

            {/* Inspection Date */}
            <div>
              <Label htmlFor="inspectionDate" value="Inspection Date" />
              <TextInput type="date" id="inspectionDate" {...register('inspectionDate')} />
             
            </div>

            {/* Date Added to Inventory */}
            {/* <div>
          <Label htmlFor="dateAdded" value="Date Added to Inventory" />
          <TextInput type="date" id="dateAdded" {...register('dateAdded')} />
          {errors.dateAdded && <p className="text-red-500">{errors.dateAdded.message}</p>}
        </div> */}

            {/* Date Sold */}
            <div>
              <Label htmlFor="dateSold" value="Date Sold" />
              <TextInput type="date" id="dateSold" {...register('dateSold')} />
              
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <Label htmlFor="notes" value="Notes" />
              <Textarea id="notes" placeholder="Any additional information about the car" {...register('notes')} />
          
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" color="dark" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : id ? 'Update Car' : 'Add Car'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AddNewCarForm
