import JobForm from "@/components/JobForm";

export const metadata = {
  title: "Create New Request - Service Board",
  description: "Create a new service request",
};

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Create Service Request
        </h1>
        <p className="text-gray-600 mt-2">
          Fill in the details to create a new service request
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <JobForm />
      </div>
    </div>
  );
}
