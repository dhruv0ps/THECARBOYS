import { useState } from "react";
import { Lead } from "../models/Lead";

type BulkUpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[]; // Use updated `Lead` type
  categories: { _id: string; leadcategory: string }[];
  onSubmit: (selectedLeads: string[], selectedCategories: string[]) => void;
};

const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
  isOpen,
  onClose,
  leads,
  categories,
  onSubmit,
}) => {
  const [leadSearchQuery, setLeadSearchQuery] = useState<string>("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  if (!isOpen) return null;

  // Filter leads by search query
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      lead.leadId.toLowerCase().includes(leadSearchQuery.toLowerCase())
  );

  // Toggle individual lead selection
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Toggle individual category selection
  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedLeads.length === 0 || selectedCategories.length === 0) {
      alert("Please select at least one lead and one category.");
      return;
    }
    onSubmit(selectedLeads, selectedCategories);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Bulk Update Leads</h2>

      <h4 className="font-semibold mb-2">Search and Select Leads:</h4>
      <input
        type="text"
        placeholder="Search leads..."
        value={leadSearchQuery}
        onChange={(e) => setLeadSearchQuery(e.target.value)}
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
          onChange={() => {
            if (selectedLeads.length === filteredLeads.length) {
              setSelectedLeads([]);
            } else {
              setSelectedLeads(filteredLeads.map((lead) => lead._id));
            }
          }}
          className="mr-2"
        />
        Select All Leads
      </label>
      <div className="max-h-40 overflow-y-auto mb-4">
        {filteredLeads.map((lead) => (
          <label key={lead._id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedLeads.includes(lead._id)}
              onChange={() => toggleLeadSelection(lead._id)}
              className="mr-2"
            />
            {lead.name} ({lead.leadId || "No ID"})
          </label>
        ))}
      </div>

      <h4 className="font-semibold mb-2">Select Categories:</h4>
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={selectedCategories.length === categories.length}
          onChange={() => {
            if (selectedCategories.length === categories.length) {
              setSelectedCategories([]);
            } else {
              setSelectedCategories(categories.map((category) => category._id));
            }
          }}
          className="mr-2"
        />
        Select All Categories
      </label>
      <div className="max-h-40 overflow-y-auto mb-4">
        {categories.map((category) => (
          <label key={category._id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category._id)}
              onChange={() => toggleCategorySelection(category._id)}
              className="mr-2"
            />
            {category.leadcategory}
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-black text-white rounded hover:bg-dark transition-colors"
          onClick={handleSubmit}
        >
          Update
        </button>
      </div>
    </div>
  </div>
  );
};

export default BulkUpdateModal;