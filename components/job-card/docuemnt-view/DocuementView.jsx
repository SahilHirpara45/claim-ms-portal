import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { getSingleJobCardAction,getCarFormAllDocPDFGenrateAction } from "@/action/employeeAction/jobcard-action";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const DocuementView = () => {
  const params = useParams();
  const jobCardId = params?.view_jobcard;
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

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

  const handleDownloadButtonClick = (e, url) => {
    e.preventDefault();
    handleFileDownload(url);
  };

  const handleFileDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank"; // Open link in a new tab
    link.download = url.split("/").pop(); // Set download attribute
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const fetchPDF = async () => {
    if (jobCardId) {
      setIsLoadingPDF(true);
      try {
        const response = await getCarFormAllDocPDFGenrateAction(jobCardId);

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
          a.download = "All_Documents.pdf";
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


  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle case where date is not available
    const date = new Date(isoDate);
    const day = ("0" + date.getUTCDate()).slice(-2);
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data...</p>;
  }

  if (
    !jobcardData ||
    !jobcardData.customerId ||
    !jobcardData.customerId.documents
  ) {
    return (
      <>
        <div className="w-full flex flex-wrap justify-between gap-4 mt-4">
          <div className="w-full lg:w-full space-y-4">
            <Card className="border">
              <CardHeader className="flex flex-row items-center gap-3 font-bold">
                <div className="flex flex-wrap items-center w-full justify-between">
                  <div>Docuements</div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                <p>No quotations available.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="w-full flex flex-wrap justify-between gap-4">
        <div className="w-full lg:w-full space-y-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center gap-3 font-bold">
              <div className="flex items-center w-full justify-between">
                <div>Documents</div>
              </div>
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
                      <span className="text-white">Download All Documents</span>
                    </>
                  )}
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
              <div className="w-full flex flex-wrap justify-between gap-4">
                {jobcardData?.customerId?.documents?.emirateId && (
                  <div className="w-full lg:w-[48%] space-y-4">
                    <div className="">
                      <Label htmlFor="emirateId" className="font-bold">
                        Emirate ID
                      </Label>
                      <div className="flex gap-2 w-full mt-4 ml-1">
                        {jobcardData?.customerId?.documents?.emirateId ? (
                          <>
                            <embed
                              src={
                                jobcardData?.customerId?.documents?.emirateId
                              }
                              type="application/pdf"
                              width="400"
                              height="200"
                            />

                            <Button
                              size="icon"
                              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                              onClick={(e) =>
                                handleDownloadButtonClick(
                                  e,
                                  jobcardData?.customerId?.documents?.emirateId
                                )
                              }
                            >
                              <Icon
                                icon="material-symbols:download"
                                width="1.2em"
                                height="1.2em"
                              />
                            </Button>
                          </>
                        ) : (
                          <p>No Emirate ID available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {jobcardData?.customerId?.documents?.drivingLicense && (
                  <div className="w-full lg:w-[48%] space-y-4">
                    <div className="">
                      <Label htmlFor="drivingLicense" className="font-bold">
                        Driving License
                      </Label>
                      <div className="flex gap-2 w-full mt-4 ml-1">
                        {jobcardData?.customerId?.documents?.drivingLicense ? (
                          <>
                            <embed
                              src={
                                jobcardData?.customerId?.documents
                                  ?.drivingLicense
                              }
                              type="application/pdf"
                              width="400"
                              height="200"
                            />
                            <Button
                              size="icon"
                              className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
                              onClick={(e) =>
                                handleDownloadButtonClick(
                                  e,
                                  jobcardData?.customerId?.documents
                                    ?.drivingLicense
                                )
                              }
                            >
                              <Icon
                                icon="material-symbols:download"
                                width="1.2em"
                                height="1.2em"
                              />
                            </Button>
                          </>
                        ) : (
                          <p>No Driving License available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {jobcardData?.carId?.documents?.registrationCard && (
                  <div className="w-full lg:w-[48%] space-y-4 mt-4">
                    <div className="">
                      <Label htmlFor="drivingLicense" className="font-bold">
                        Car Registration Card
                      </Label>
                      <div className="flex gap-2  mt-4 ml-1">
                        <embed
                          src={jobcardData?.carId?.documents?.registrationCard}
                          type="application/pdf"
                          width="400"
                          height="200"
                        />

                        <a
                          href={jobcardData?.carId?.documents?.registrationCard}
                          download
                          className="h-8 rounded bg-default-100 dark:bg-default-200 text-default-500 p-2 hover:text-white hover:bg-primary"
                        >
                          <Icon
                            icon="material-symbols:download"
                            width="1.2em"
                            height="1.2em"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {jobcardData?.documents?.policeReport?.[0] && (
                  <div className="w-full lg:w-[48%] space-y-4 mt-4">
                    <div className="">
                      <Label htmlFor="drivingLicense" className="font-bold">
                        Police Report
                      </Label>
                      <div className="flex gap-2  mt-4 ml-1">
                        {/* {jobcardData?.documents?.policeReport ? (
                          <>
                            <img
                              src={jobcardData?.documents?.policeReport?.[0]}
                              alt="no pic"
                              width="400"
                              height="200"
                            />

                            <a
                              href={jobcardData?.documents?.policeReport?.[0]}
                              target="_blank"
                              download={jobcardData?.documents?.policeReport?.[0].split("/").pop()}
                              className="h-8 rounded bg-default-100 dark:bg-default-200 text-default-500 p-2 hover:text-white hover:bg-primary"
                            >
                              <Icon
                                icon="material-symbols:download"
                                width="1.2em"
                                height="1.2em"
                              />
                            </a>
                          </>
                        ) 
                        : (
                          <p>No Police Report available</p>
                        )} */}
                        {jobcardData?.documents?.policeReport?.length > 0 ? (
                          jobcardData?.documents?.policeReport?.map((file, index) => {
                            if (typeof file === "string") {
                              if (/\.(jpg|jpeg|gif|svg|png)$/i.test(file)) {
                                return (
                                  <div key={index} className="flex flex-col items-center gap-2">
                                    <img
                                      src={file}
                                      alt={`Car Pic ${index + 1}`}
                                      width="400"
                                      height="200"
                                    />
                                    <a
                                      href={file}
                                      target="_blank"
                                      download={`CarPic_${index + 1}.jpg`}
                                      className="h-8 rounded bg-default-100 dark:bg-default-200 text-default-500 p-2 hover:text-white hover:bg-primary"
                                    >
                                      <Icon
                                        icon="material-symbols:download"
                                        width="1.2em"
                                        height="1.2em"
                                      />
                                    </a>
                                  </div>
                                );
                              } else if (/\.(pdf|doc)$/i.test(file)) {
                                return (
                                  <div key={index} className="flex flex-col items-center gap-2">
                                    <embed src={file} type="application/pdf" width="400" height="200" />
                                    <a
                                      href={file}
                                      target="_blank"
                                      download={`CarDoc_${index + 1}`}
                                      className="h-8 rounded bg-default-100 dark:bg-default-200 text-default-500 p-2 hover:text-white hover:bg-primary"
                                    >
                                      <Icon
                                        icon="material-symbols:download"
                                        width="1.2em"
                                        height="1.2em"
                                      />
                                    </a>
                                  </div>
                                );
                              } else {
                                return <span key={index}>File type not supported</span>;
                              }
                            } else {
                              return <span key={index}>Invalid file format</span>;
                            }
                          })
                        ) : (
                          <p>No Police Report available</p>
                        )}

                      </div>
                    </div>
                  </div>
                )}

                <div className="w-full lg:w-[48%] space-y-4 mt-4">
                  <div className="">
                    <Label htmlFor="beforePhotos" className="font-bold">
                      Car Before Photos
                    </Label>
                    <div className="flex gap-2 mt-4 ml-1">
                      {/* {jobcardData?.documents?.beforePhotos?.length > 0 ? (
                        jobcardData?.documents?.beforePhotos?.map(
                          (photo, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center gap-2"
                            >
                              <img
                                src={photo}
                                alt={`Car Pic ${index + 1}`}
                                width="400"
                                height="200"
                              />
                              <a
                                href={photo} target='_blank'
                                download={`CarPic_${index + 1}.jpg`}
                                className="h-8 rounded bg-default-100 dark:bg-default-200 text-default-500 p-2 hover:text-white hover:bg-primary"
                              >
                                <Icon
                                  icon="material-symbols:download"
                                  width="1.2em"
                                  height="1.2em"
                                />
                              </a>
                            </div>
                          )
                        )
                      ) : (
                        <p>No Car Pic available</p>
                      )} */}
                      {jobcardData?.documents?.beforePhotos?.length > 0 ? (
                        jobcardData?.documents?.beforePhotos?.map((file, index) => {
                          if (typeof file === "string") {
                            if (/\.(jpg|jpeg|gif|svg|png)$/i.test(file)) {
                              return (
                                <div key={index} className="flex flex-col items-center gap-2">
                                  <img
                                    src={file}
                                    alt={`Car Pic ${index + 1}`}
                                    width="400"
                                    height="200"
                                  />
                                  <a
                                    href={file}
                                    target="_blank"
                                    download={`CarPic_${index + 1}.jpg`}
                                    className="h-8 rounded bg-default-100 dark:bg-default-200 text-default-500 p-2 hover:text-white hover:bg-primary"
                                  >
                                    <Icon
                                      icon="material-symbols:download"
                                      width="1.2em"
                                      height="1.2em"
                                    />
                                  </a>
                                </div>
                              );
                            } else if (/\.(pdf|doc)$/i.test(file)) {
                              return (
                                <div key={index} className="flex flex-col items-center gap-2">
                                  <embed src={file} type="application/pdf" width="400" height="200" />
                                  <a
                                    href={file}
                                    target="_blank"
                                    download={`CarDoc_${index + 1}`}
                                    className="h-8 rounded bg-default-100 dark:bg-default-200 text-default-500 p-2 hover:text-white hover:bg-primary"
                                  >
                                    <Icon
                                      icon="material-symbols:download"
                                      width="1.2em"
                                      height="1.2em"
                                    />
                                  </a>
                                </div>
                              );
                            } else {
                              return <span key={index}>File type not supported</span>;
                            }
                          } else {
                            return <span key={index}>Invalid file format</span>;
                          }
                        })
                      ) : (
                        <p>No Car Report available</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-[48%] space-y-4 mt-4">
                  <div className="">
                    <Label htmlFor="afterPhotos" className="font-bold">
                      After Photos
                    </Label>
                    <div className="flex gap-2 mt-4 ml-1">
                      {jobcardData?.documents?.afterPhotos?.length > 0 ? (
                        jobcardData?.documents?.afterPhotos?.map(
                          (photo, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center gap-2"
                            >
                              <img
                                src={photo}
                                alt={`Car Pic ${index + 1}`}
                                width="400"
                                height="200"
                              />
                              <a
                                href={photo} target='_blank'
                                download
                                className="h-8 rounded bg-default-100 dark:bg-default-200 text-default-500 p-2 hover:text-white hover:bg-primary"
                              >
                                <Icon
                                  icon="material-symbols:download"
                                  width="1.2em"
                                  height="1.2em"
                                />
                              </a>
                            </div>
                          )
                        )
                      ) : (
                        <p>No Car Pic available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DocuementView;
