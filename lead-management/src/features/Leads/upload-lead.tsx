import type React from "react";
import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
    LinearProgress,
    Alert,
    AlertTitle,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { CloudUpload as UploadIcon, Clear as ClearIcon, ArrowBack as BackIcon } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface UploadLeadProps {
    onUploadSuccess: () => void;
    apiUrl: string;
    onBack?: () => void;
}

export default function UploadLead({ apiUrl }: UploadLeadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ successful: any[]; skipped: any[] } | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        setError(null);
        setSuccess(false);
        setUploadResult(null);
    };

    const validateFile = (file: File): boolean => {
        const allowedExtensions = [".csv", ".xlsx"];
        const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            setError(`Invalid file type. Please upload a CSV or Excel file.`);
            toast.error("Invalid file type. Please upload a CSV or Excel file.");
            return false;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError(`File size exceeds 10MB limit.`);
            toast.error("File size exceeds 10MB limit.");
            return false;
        }

        return true;
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            toast.error("Please select a file to upload.");
            return;
        }
    
        if (!validateFile(file)) {
            return;
        }
    
        setIsUploading(true);
        setUploadProgress(0);
        setError(null);
        setSuccess(false);
        setUploadResult(null);
    
        const formData = new FormData();
        formData.append("file", file);
    
        const authToken = localStorage.getItem("authToken"); 
    
        try {
            const response = await axios.post(apiUrl, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, 
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                },
            });
    
            if (response.status === 200 || response.status === 201) {
                setUploadProgress(100);
                setSuccess(true);
                setFile(null);
                toast.success("Leads uploaded successfully!");
    
                if (response?.data.data) {
                    setUploadResult(response.data.data);
                }
            } else {
                throw new Error(response.data?.message || "Upload failed");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload leads. Please try again.");
            toast.error("Failed to upload leads. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };
    


    const handleClear = () => {
        setFile(null);
        setUploadResult(null);
        setError(null);
        setSuccess(false);
    };

    return (
        <>

            <div className="ml-6 mt-4">
                <Button
                    variant="contained"
                    color="inherit"
                    onClick={() => navigate(-1)}
                    startIcon={<BackIcon />}
                    style={{ backgroundColor: "gray", color: "white" }}
                >
                    Back to List
                </Button>
            </div>

            <div className="flex w-full h-auto justify-center items-center p-6">
                <Card className="w-full max-w-5xl shadow-lg bg-white rounded-lg">
                    <CardHeader
                        title={<Typography variant="h5">Upload Leads</Typography>}
                        subheader="Import leads from a CSV or Excel file"
                        className="border-b pb-4"
                    />
                    <CardContent className="space-y-6 p-6">
                        {error && <Alert severity="error"><AlertTitle>Error</AlertTitle>{error}</Alert>}
                        {success && <Alert severity="success"><AlertTitle>Success</AlertTitle>Leads uploaded successfully!</Alert>}


                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer 
                  ${file ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"} 
                  hover:bg-gray-100 transition-colors`}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadIcon className="w-10 h-10 mb-2 text-gray-500" />
                                    <Typography variant="body2" className="mb-1 text-gray-600">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-500">
                                        CSV or Excel files only (max 10MB)
                                    </Typography>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    accept=".csv,.xlsx"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>

                        {isUploading && (
                            <LinearProgress variant="determinate" value={uploadProgress} className="h-2 rounded-full" />
                        )}


                        {uploadResult && uploadResult.successful.length > 0 && (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Index</strong></TableCell>
                                            <TableCell><strong>Name</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {uploadResult?.successful?.map((lead) => (
                                            <TableRow key={lead.index}>
                                                <TableCell>{lead.index}</TableCell>
                                                <TableCell>{lead.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        {uploadResult && uploadResult?.skipped.length > 0 && (
                            <TableContainer component={Paper} className="mt-4">
                                <Typography variant="h6" className="mb-2">Skipped Leads</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Index</strong></TableCell>
                                            <TableCell><strong>Reason</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {uploadResult.skipped.map((skipped) => (
                                            <TableRow key={skipped.index}>
                                                <TableCell>{skipped.index}</TableCell>
                                                <TableCell>{skipped.reason}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        <Box className="flex justify-between gap-3 mt-4">
                            <Button variant="outlined" color="inherit" onClick={handleClear} disabled={!file && !uploadResult} startIcon={<ClearIcon />}>
                                Clear
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleUpload} disabled={!file || isUploading} startIcon={<UploadIcon />}>
                                {isUploading ? "Uploading..." : "Upload Leads"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
