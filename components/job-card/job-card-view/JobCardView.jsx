"use client";

import { getCarFormPDFGenrateAction, getSingleJobCardAction } from "@/action/employeeAction/jobcard-action";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AdditionalQuotionView from "../additional-quotation-view/AdditionalQuotionView";
import ClaimView from "../claim-view/ClaimView";
import CustomerView from "../customer-view/CustomerView";
import DocuementView from "../docuemnt-view/DocuementView";
import CommentView from "../comment-view/CommentView";
import HistoryView from "../history-view/HistoryView";
import QuotionView from "../quotation-view/QuotionView";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

const JobCardView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "Customer";
  const [activeTab, setActiveTab] = useState(tab);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  const params = useParams();
  const jobCardId = params?.view_jobcard;

  const {
    isLoading,
    isError,
    data: jobcardData,
  } = useQuery({
    queryKey: ["jobcardData", jobCardId],
    queryFn: () => getSingleJobCardAction(jobCardId),
    enabled: !!jobCardId,
    retry: false,
  });


  const fetchPDF = async () => {
    if (jobCardId) {
      setIsLoadingPDF(true);
      try {
        const response = await getCarFormPDFGenrateAction(jobCardId);

        if (response.success && response.link) {
          // Notify the user of success
          toast.success(response.message);

          // Open the PDF in a new tab
          window.open(response.link, "_blank");

          // Fetch the PDF file as a Blob for downloading
          const pdfResponse = await fetch(response.link);
          const pdfBlob = await pdfResponse.blob();

          // Create a URL for the Blob
          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");

          // Set the download attributes
          a.href = url;
          //  a.download = response.filename || "quotation.pdf";
          a.download = "CarRecevingForm.pdf";
          document.body.appendChild(a);

          // Trigger the download
          a.click();

          // Clean up
          a.remove();
          window.URL.revokeObjectURL(url);
        } else {
          toast.error("Failed to generate the PDF link.");
        }

        return response;
      } catch (error) {
        toast.error(error?.response?.message || "Failed to fetch the PDF.");
        throw error;
      } finally {
        setIsLoadingPDF(false); // Set loading to false when fetch completes or fails
      }
    }
  };



  const renderTabContent = () => {
    switch (activeTab) {
      case "Customer":
        return <CustomerView />;
      case "ClaimView":
        return <ClaimView />;
      case "QuotationView":
        return <QuotionView />;
      case "AdditionalQuotionView":
        return <AdditionalQuotionView jobcardData={jobcardData} />;
      case "DocuementView":
        return <DocuementView />;
      case "CommentView":
        return <CommentView />;
      case "HistoryView":
        return <HistoryView />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading job card data.</div>;
  }

  return (
    <div className="flex flex-col justify-start items-start gap-6">
      <div className="flex justify-start items-center gap-4">
        <div className="flex flex-col justify-center items-start gap-3">
          <div className="flex justify-center items-center gap-2">
            <span className="text-base font-medium">Job Card Number:</span>
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
              {jobcardData?.jobCardNumber}
            </span>
          </div>
          {/* <div className="flex justify-center items-center gap-2">
            <span className="text-base font-medium">Customer Email:</span>
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
              {jobcardData?.customerId?.email || "---"}
            </span>
          </div> */}
        </div>
      </div>
      <div className="flex space-x-4 bg-muted p-2 rounded-lg w-auto bg-[#6478B] flex-wrap">
        <button
          className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${activeTab === "Customer"
            ? "bg-card text-card-foreground font-bold"
            : "text-muted-foreground"
            }`}
          onClick={() => {
            setActiveTab("Customer");
            router.push(`/jobcard-list/view_jobcard/${jobCardId}?tab=Customer`);
          }}
        >
          Job Details
        </button>
        <button
          className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${activeTab === "ClaimView"
            ? "bg-card text-card-foreground font-bold"
            : "text-muted-foreground"
            }`}
          onClick={() => {
            setActiveTab("ClaimView");
            router.push(`/jobcard-list/view_jobcard/${jobCardId}?tab=ClaimView`);
          }}
        >
          Claim
        </button>
        <button
          className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${activeTab === "QuotationView"
            ? "bg-card text-card-foreground font-bold"
            : "text-muted-foreground"
            }`}
          onClick={() => {
            setActiveTab("QuotationView");
            router.push(`/jobcard-list/view_jobcard/${jobCardId}?tab=QuotationView`);
          }}
        >
          Quotation
        </button>
        <button
          className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${activeTab === "AdditionalQuotionView"
            ? "bg-card text-card-foreground font-bold"
            : "text-muted-foreground"
            }`}
          onClick={() => {
            setActiveTab("AdditionalQuotionView");
            router.push(`/jobcard-list/view_jobcard/${jobCardId}?tab=AdditionalQuotionView`);
          }}
        >
          Additional Quotation
        </button>
        <button
          className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${activeTab === "DocuementView"
            ? "bg-card text-card-foreground font-bold"
            : "text-muted-foreground"
            }`}
          onClick={() => {
            setActiveTab("DocuementView");
            router.push(`/jobcard-list/view_jobcard/${jobCardId}?tab=DocuementView`);
          }}
        >
          Documents
        </button>
        <button
          className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${activeTab === "CommentView"
            ? "bg-card text-card-foreground font-bold"
            : "text-muted-foreground"
            }`}
          onClick={() => {
            setActiveTab("CommentView");
            router.push(`/jobcard-list/view_jobcard/${jobCardId}?tab=CommentView`);
          }}
        >
          Comment
        </button>
        <button
          className={`px-4 py-2 rounded-lg hover:bg-muted/80 ${activeTab === "HistoryView"
            ? "bg-card text-card-foreground font-bold"
            : "text-muted-foreground"
            }`}
          onClick={() => {
            setActiveTab("HistoryView");
            router.push(`/jobcard-list/view_jobcard/${jobCardId}?tab=HistoryView`);
          }}
        >
          History
        </button>
        <Button
          asChild
          variant=""
          className="text-xs font-semibold text-primary-500"
          onClick={fetchPDF}
          disabled={isLoadingPDF}
        >
          <Link href="#">
            {isLoadingPDF ? (
              <span className="text-white">Loading...</span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 ltr:mr-1.5 rtl:ml-1.5 text-white" />
                <span className="text-white">Download Car Receving Form</span>
              </>
            )}
          </Link>
        </Button>
      </div>
      <div className="mt-0 w-full">{renderTabContent()}</div>
    </div>
  );
};

export default JobCardView;
