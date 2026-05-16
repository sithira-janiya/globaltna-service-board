import JobForm from "@/components/JobForm";

export const metadata = {
  title: "Create New Request - Service Board",
  description: "Create a new service request",
};

export default function NewJobPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-5xl font-bold">Create Service Request</h1>
        <p className="text-green-100 mt-3 text-lg">
          Fill in the details below to submit a new service request
        </p>
      </div>

      {/* Form */}
      <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100">
        <JobForm />
      </div>
    </div>
  );
}
