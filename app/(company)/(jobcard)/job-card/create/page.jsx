"use client";
import { addEmiratesData } from "@/action/emiratesAction/emirates-action";
import {
  addJobCard,
  getSingleJobCardAction,
  updateJobCardAction,
  getInsuranceValidAction,
} from "@/action/employeeAction/jobcard-action";
import { extractCarAction } from "@/action/extractDataAction/carRcAction";
import { addLicenceData } from "@/action/licenceAction/licence-action";
import DropZone from "@/components/common/drop-zone/DropZone";
import FileUploaderMultipleFrontBack from "@/components/common/file-upload-front-back/FileUploaderMultipleFrontBack";
import ClickableStep from "@/components/common/steps/page";
import { Button } from "@/components/ui/button";
import {
  Select as SelectTow,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DialogPlacement from "@/components/common/dialog/dialog-placement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ratio } from "fuzzball";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { z } from "zod";
// import "react-datepicker/dist/react-datepicker.css";
import { getUserMeAction } from "@/action/auth-action";
import { getGarrageInsuranceCompaniesJobcard } from "@/action/companyAction/insurance-action";
import { getMasterCarDataAction } from "@/action/masterCar/mastercar-action";
import LayoutLoader from "@/components/layout-loader";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import InsuranceExModal from "@/components/job-card/insurance-expiray-model/InsuranceExModal";
import TotalLossJobModel from "@/components/job-card/insurance-expiray-model/TotalLossJobModel";
import { format } from "date-fns";
import ImageDrawer from "@/components/job-card/ImageDrawer/ImageDrawer";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
// import { Slider } from "@/components/ui/slider";

const commonSchema = z.object({
  value: z.string().optional(),
  label: z.string().optional(),
});

const carDetailsSchema = z.object({
  make: z.string().min(1, { message: "Car Make is required" }),
  model: z.string().min(1, { message: "Car Model is required" }),
  trim: z.string().min(1, { message: "Car Trim is required" }),

  year: z
    .string()
    .min(4, { message: "Car Year is required" })
    .regex(/^\d{4}$/, { message: "Invalid Year format" }),
  plateNumber: z.string().min(1, { message: "Plate Number is required" }),
  nameOnRegistrationCard: z.string().optional(),
  chassisNo: z.string().min(1, { message: "Chassis Number is required" }),
});

const insuranceDetailsSchema = z.object({
  currentInsurance: z
    .string()
    .min(1, { message: "Current Insurer is required" }),
  insuranceExpiryDate: z.any().optional(),
});

const documentSchema = z.object({
  policeReport: z
    .any()
    .refine((val) => val?.length > 0, { message: "Police report is required" }),
  beforePhotos: z
    .any()
    .refine((val) => val?.length > 0, { message: "Before Photo is required" }),
});

// Step 1 schema
const step1Schema = z
  .object({
    // email: z
    //   .string()
    //   .optional()
    //   .refine((value) => {
    //     return value !== undefined && value.trim() !== "";
    //   }, "Email is required")
    //   .refine((value) => {
    //     return /^\S+@\S+\.\S+$/.test(value);
    //   }, "Invalid email format"),

    email: z.string().optional(),
    mobileNumber: z
      .string()
      .refine((value) => {
        return value !== undefined && value.trim() !== "";
      }, "Mobile number is required")
      .refine((value) => {
        return /^[0-9]{10}$/.test(value);
      }, "Invalid mobile number format"),
    fullName: z.string().refine((value) => value.trim() !== "", {
      message: "Customer Name required",
    }),
    nameOnDrivingLicense: z.string().refine((value) => value.trim() !== "", {
      message: "License Name required",
    }),

    emiratesId: z.array(z.any()).min(1, { message: "Emirates ID required" }),
    drivingId: z.array(z.any()).min(1, { message: "Driving ID required" }),
    //   drivingId: z.array(z.any()).optional(),
    customerEmiratesId: z.string().refine((value) => value.trim() !== "", {
      message: "Customer Emirates ID is required",
    }),
    licenceNo: z.string().refine((value) => {
      return value !== undefined && value.trim() !== "";
    }, "Licence number is required"),
    // licenceIssueDate: z
    //   .string()
    //   .refine((value) => value.trim() !== "", {
    //     message: "Issue date required",
    //   })
    //   .transform((str) => new Date(str)),
    licenceIssueDate: z
      .string()
      .refine((value) => value.trim() !== "", {
        message: "Issue date required",
      })
      .transform((str) => new Date(str))
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date",
      }),
    licenceExpiryDate: z
      .string()
      .refine((value) => value.trim() !== "", {
        message: "Expiry date required",
      })
      .refine((value, ctx) => {
        return value > (ctx?.licenceIssueDate || "");
      }, "Expiry date must be after issue date")
      .transform((str) => new Date(str)),

    tcNo: z.string().refine((value) => value.trim() !== "", {
      message: "TC number is required",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
      ctx.addIssue({
        path: ["email"],
        message: "Invalid email format",
      });
    }
  });

// Step 2 schema
const step2Schema = z.object({
  email: z.string().optional(),
  customerEmiratesId: z.any().optional(),
  // registrationCard: z.array(z.any())
  //   .min(1, { message: "registrationCard ID required" }),
  carDetails: carDetailsSchema.optional(),
  insuranceDetails: insuranceDetailsSchema,
});

// Step 3 schema
const step3Schema = z
  .object({
    dateOfAccident: z.any().optional(),
    isFault: z.boolean().optional(),
    documents: documentSchema,
    alreadyHasClaimNumber: z.boolean().optional(),
    insuranceClaimNumber: z.string().optional(),
    totalLoss: z.boolean().optional(),
    newInsuranceCompany: z.string().optional(),
    details: z.any().optional(),
    startDate: z.any().optional(),
  })
  .refine(
    (data) => {
      // If isFault is false, newInsuranceCompany should be required
      if (data.isFault === false) {
        return !!data.newInsuranceCompany; // Return true if newInsuranceCompany is not empty
      }
      return true; // Otherwise, return true
    },
    {
      message: "New Insurer is required",
      path: ["newInsuranceCompany"], // Path to the field that needs validation
    }
  );

// Step 3 schema
const step4Schema = z.object({
  petrolRange: z.any().optional(),
  carMileage: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "car mileage is required",
    })
    .refine(
      (value) => {
        return /^\d+(\.\d{1,2})?$/.test(value);
      },
      {
        message: "car mileage number",
      }
    ),
  // : z.any().optional(),
});

const repairOptions = [
  { value: "Breakdown", label: "Breakdown" },
  { value: "Booked Vehicle", label: "Booked Vehicle" },
  { value: "Repeat Job", label: "Repeat Job" },
  { value: "Customer Waiting", label: "Customer Waiting" },
  { value: "Demo", label: "Demo" },
];

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const JobCardPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [manualLoading, setManualLoading] = useState(false); //ay
  const [resetTrigger, setResetTrigger] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [jobCardId, setJobCardId] = useState(null);
  const [paramId, setParamId] = useState(null);
  //  Emirates document uploader
  const [emiratesData, setEmiratesData] = useState([]);
  const [emiratesApi, setEmiratesApi] = useState(false);
  // Extract Loader State
  const [loadingoverlay, setLoadingoverlay] = useState(false);
  const [loadingDriving, setLoadingDriving] = useState(false);
  const [loadingCarExtract, setLoadingCarExtract] = useState(false);

  // Driving Licence documnet uploader
  const [drivingData, setDrivingData] = useState([]);
  const [drivingApi, setDrivingApi] = useState(false);

  const [currentInsId, setCurrentInsId] = useState("");
  const [newInsId, setNewInsId] = useState("");
  const [apiCalled, setApiCalled] = useState(false);
  const [exctractCarData, setExctractCarData] = useState("");
  const [binaryFiles, setBinaryFiles] = useState([]);
  const [defaultDate, setDefaultDate] = useState("");
  const isInitialized = useRef(false);

  const [jobCardDataResponse, setJobCardDataResponse] = useState(null);

  const [filePreviews, setFilePreviews] = useState([]);
  const [filePreviews1, setFilePreviews1] = useState([]);
  const [policeReportimg, setPoliceReportImg] = useState([]);
  const [beforePhotosimg, setBeforePhotosImg] = useState([]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const [carModelLists, setCarModelLists] = useState([]);
  const [carTrimLists, setCarTrimLists] = useState([]);

  const [files, setFiles] = useState([]);
  const [beforePhotosFiles, setBeforePhotosFiles] = useState([]);

  const [isEmiratesIdSet, setIsEmiratesIdSet] = useState(false);

  // Already have claim number
  const [modalOpen, setModalOpen] = useState(false);
  const [insuranceClaimNumber, setInsuranceClaimNumber] = useState("");
  const [alreadyHasClaimNumber, setAlreadyHasClaimNumber] = useState(false);

  const { update_Jobcard } = useParams();

  //ay

  const [isInsuranceExModalOpen, setIsCommentModalOpen] = useState(false);
  const [isAcceptDate, setisAcceptDate] = useState(false);
  const handleCommentModalOpen = () => setIsCommentModalOpen(true);
  const handleCommentModalClose = () => setIsCommentModalOpen(false);

  const [imageForJobCard, setImageForJobCard] = useState("");

  //job loss model

  const [isTotalLossModalOpen, setIsTotalLossModalOpen] = useState(false);
  const handleTotalLossModalOpen = (e) => {
    if (e.target.checked) {
      setIsTotalLossModalOpen(true);
    }
  };

  const handleAddCoomitSubmit = () => {
    setisAcceptDate(true);
    handleCommentModalClose();
  };

  //

  useEffect(() => {
    if (update_Jobcard && update_Jobcard.length > 0) {
      setJobCardId(update_Jobcard[0]);
      setParamId(update_Jobcard[0]);
    }
  }, [update_Jobcard]);

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });

  const CREATED_USER_ID = userData?.data?.userId?._id;
  const CREATED_USER_ROLE = userData?.data?.userId?.role;

  const {
    isLoading: isLoadingCompanyData,
    isError: isErrorCompanyData,
    data: jobcardData,
    error: companyDataError,
  } = useQuery({
    queryKey: ["jobcardData", jobCardId],
    queryFn: () => getSingleJobCardAction(jobCardId),
    enabled: !!jobCardId, // Only enable query if customerId is truthy
    retry: false,
    onSuccess: (data) => {
      setJobCardDataResponse(data);
    },
  });

  const { data: getMasterCarData, isLoading: isLoadinggetMasterCarData } =
    useQuery({
      queryKey: ["getMasterCarDataAction"],
      queryFn: getMasterCarDataAction,
    });

  const formattedCarData = getMasterCarData?.data?.map((make) => ({
    value: make,
    label: make,
  }));

  const handleMakeChange = async (selectedMake) => {
    try {
      const response = await getMasterCarDataAction({
        params: { brand: selectedMake },
      });
      setCarModelLists(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModelChange = async (selectedModel, prevMake) => {
    try {
      const response = await getMasterCarDataAction({
        params: { brand: selectedMake || prevMake, model: selectedModel },
      });
      setCarTrimLists(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const { data: carsData } = useQuery({
  //   queryKey: ["getCars", pageIndex, pageSize],
  //   queryFn: () => getCars({ page: pageIndex + 1, size: pageSize, all: false }),
  // });
  const { data: InsuranceCompaniesData } = useQuery({
    queryKey: ["getInsuranceCompanies"],
    queryFn: () =>
      getGarrageInsuranceCompaniesJobcard({
        all: true,
        isActive: true,
      }),
  });

  // const {
  //   data: employeeData,
  //   isLoading: isLoading2,
  //   error: error2,
  // } = useQuery({
  //   queryKey: ["getEmployeeList", pageIndex, pageSize],
  //   queryFn: () => getAllEmployee({ all: true }),
  // });

  const InsuranseCompanyList =
    InsuranceCompaniesData?.data?.garageInsurance?.map((insuranse_compnay) => ({
      value: insuranse_compnay.companyName,
      label: insuranse_compnay.companyName,
      id: insuranse_compnay._id,
    }));
  const InsuranseCompanyList2 =
    InsuranceCompaniesData?.data?.garageInsurance?.map((insuranse_compnay) => ({
      value: insuranse_compnay._id,
      label: insuranse_compnay.companyName,
      id: insuranse_compnay._id,
    }));

  // console.log("InsuranceCompaniesData ay",InsuranceCompaniesData)
  // console.log("InsuranseCompanyList ay", InsuranseCompanyList);
  // const customersLists = customersData?.data?.customers?.map((customer) => ({
  //   value: customer._id,
  //   label: customer.firstName,
  // }));

  // const employeeLists = employeeData?.data?.map((employee) => ({
  //   value: employee._id,
  //   label: employee.firstName,
  // }));

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isFault: true,
      petrolRange: 5,
      carMileage: "00",
      insuranceDetails: {
        currentInsurance: "",
        insuranceExpiryDate: null,
      },
      alreadyHasClaimNumber: false,
      totalLoss: false,
    },
    resolver: zodResolver(
      activeStep === 0
        ? step1Schema
        : activeStep === 1
          ? step2Schema
          : activeStep === 2
            ? step3Schema
            : activeStep === 3
              ? step4Schema
              : schema // default schema if none of the above conditions match
    ),
    mode: "all",
  });
  const aftrePhotosLists = watch("documents.policeReport");
  const beforePhotosList = watch("documents.beforePhotos");
  const petrolRangeValue = watch("petrolRange");

  const emiratesWatch = watch("emiratesId");
  const drivingIdWatch = watch("drivingId"); //drivingId

  const selectedMake = useWatch({
    control,
    name: "carDetails.make",
  });
  const selectedModel = useWatch({
    control,
    name: "carDetails.model",
  });

  // console.log("errors :-", errors, watch());

  const mutation = useMutation({
    mutationKey: ["addJobCard"],
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append(
        "drivingLicenseLink",
        drivingData?.fileUrl?.path ? drivingData?.fileUrl?.path : ""
      );
      formData.append(
        "emirateIdLink",
        emiratesData?.fileUrl?.path ? emiratesData?.fileUrl?.path : ""
      );
      for (const key in data) {
        if (key !== "redirect") {
          // formData.append("email", data.email);
          // formData.append("customerName", data.customerName);
          // formData.append("mobileNumber", data.mobileNumber);
          // if (key !== "redirect") {
          formData.append(key, data[key]);
        }
      }
      return await addJobCard(formData);
      // return await addEmiratesData(formData);
    },
    onSuccess: (res) => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setManualLoading(false);
      // toast.success(res?.message);
      toast.success("Step 1 completed Successfully");
    },
    onError: (error) => {

      setManualLoading(false);
      toast.error(error?.message || "An error occurred. Please try again.");
    },
  });

  const extractCarMutation = useMutation({
    mutationKey: ["extractCar"],
    mutationFn: async (formData) => {
      setLoadingCarExtract(true);
      return await extractCarAction(formData);
    },
    onSuccess: (response) => {
      toast.success("Registration Card File uploaded successfully.");
      setExctractCarData(response);
      setApiCalled(true);
      setLoadingCarExtract(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      setLoadingCarExtract(false);
    },
  });
  // const updatePostMutation = useMutation({
  //   mutationFn: async (data) => {
  //     const formData = new FormData();

  //     formData.append(
  //       "drivingLicenseLink",
  //       drivingData?.fileUrl?.path ? drivingData?.fileUrl?.path : ""
  //     );
  //     formData.append(
  //       "emirateIdLink",
  //       emiratesData?.fileUrl?.path ? emiratesData?.fileUrl?.path : ""
  //     );
  //     formData.append(
  //       "registrationCard",
  //       exctractCarData?.fileUrl?.path ? exctractCarData?.fileUrl?.path : ""
  //     );
  //     //formData.append("insuranceCompanyId", currentInsId ? currentInsId : "");

  //     for (const key in data) {
  //       if (data[key] === undefined) {
  //         continue;
  //       }
  //       if (key === "carDetails" || key === "insuranceDetails") {
  //         if (key === "insuranceDetails") {
  //           formData.append(
  //             "insuranceCompanyId",
  //             currentInsId ? currentInsId : ""
  //           );
  //           // formData.append("insuranceDetails ", isAcceptDate);
  //         }
  //         if (key === "insuranceDetails") {
  //           const insuranceDetails = {
  //             ...data[key],
  //             isAcceptDate,  // Set isAcceptDate as true
  //           };
  //           formData.append(key, JSON.stringify(insuranceDetails));
  //         }

  //         formData.append(key, JSON.stringify(data[key]));
  //       } else if (key === "documents" && activeStep === 3) {
  //         // Handle documents as binary files
  //         if (aftrePhotosLists && aftrePhotosLists?.length > 0) {
  //           Array.from(aftrePhotosLists).forEach((photo) => {
  //             formData.append("policeReport", photo);
  //           });
  //         }
  //         if (beforePhotosList && beforePhotosList?.length > 0) {
  //           Array.from(beforePhotosList).forEach((photo) => {
  //             formData.append("beforePhotos", photo);
  //           });
  //         }
  //       } else if (key !== "redirect") {
  //         formData.append(key, data[key]);
  //       }
  //     }
  //     // if (activeStep === 1) {
  //     //   formData.append("isAcceptDate ", isAcceptDate);
  //     // }

  //     // Set the statusToSend based on the provided status
  //     if (activeStep === 3) {
  //       const statusToSend =
  //         !jobcardData?.status || jobcardData?.status === "Draft"
  //           ? "In Progress"
  //           : jobcardData?.status;
  //       formData.append("status", statusToSend);
  //       if (CREATED_USER_ROLE === "employee" && CREATED_USER_ID) {
  //         formData.append("assignedEmployeeId", CREATED_USER_ID);
  //       }
  //     }
  //     return await updateJobCardAction(jobCardId, formData);
  //   },
  //   onSuccess: (response, { redirect }) => {
  //     if (activeStep === 0) {
  //       toast.success("Step 1 Completed Successfully");
  //     } else if (activeStep === 1) {
  //       toast.success("Step 2 Completed Successfully");
  //     } else if (activeStep === 2) {
  //       toast.success("Step 3 Completed Successfully");
  //     }
  //     if (activeStep !== 3) {
  //       setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //     }
  //     if (redirect) {
  //       if (paramId) {
  //         toast.success(response?.message);
  //         router.push("/jobcard-list");
  //       } else {
  //         toast.success("Jobcard Created Successfully");
  //         router.push("/jobcard-list");
  //       }
  //     }
  //   },
  //   onError: (error) => {
  //     if (error?.data?.message === "Insurance has expired !!") {
  //       handleCommentModalOpen();
  //     }
  //     toast.error(error?.data?.message);
  //   },
  // });

  const updatePostMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();

      formData.append(
        "drivingLicenseLink",
        drivingData?.fileUrl?.path ? drivingData?.fileUrl?.path : ""
      );
      formData.append(
        "emirateIdLink",
        emiratesData?.fileUrl?.path ? emiratesData?.fileUrl?.path : ""
      );
      formData.append(
        "registrationCard",
        exctractCarData?.fileUrl?.path ? exctractCarData?.fileUrl?.path : ""
      );

      // Append insuranceCompanyId if available
      formData.append("insuranceCompanyId", currentInsId ? currentInsId : "");

      for (const key in data) {
        if (data[key] === undefined) {
          continue;
        }

        if (key === "insuranceDetails") {
          // Combine insuranceDetails with isAcceptDate
          const insuranceDetails = {
            ...data[key],
            isAcceptDate, // Set isAcceptDate as true
          };
          formData.append(key, JSON.stringify(insuranceDetails));
        } else if (key === "carDetails") {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === "documents" && activeStep === 2) {
          // Handle documents as binary files
          if (aftrePhotosLists && aftrePhotosLists?.length > 0) {
            Array.from(aftrePhotosLists).forEach((photo) => {
              formData.append("policeReport", photo);
            });
          }
          if (beforePhotosList && beforePhotosList?.length > 0) {
            Array.from(beforePhotosList).forEach((photo) => {
              formData.append("beforePhotos", photo);
            });
          }
        } else if (key !== "redirect") {
          formData.append(key, data[key]);
        }
      }
      if (imageForJobCard) {
        formData.append("markDamageImg", imageForJobCard);
      }
      // Set the statusToSend based on the provided status
      if (activeStep === 2) {
        const statusToSend =
          !jobcardData?.status || jobcardData?.status === "Draft"
            ? "In Progress"
            : jobcardData?.status;
        formData.append("status", statusToSend);
        if (CREATED_USER_ROLE === "employee" && CREATED_USER_ID) {
          formData.append("assignedEmployeeId", CREATED_USER_ID);
        }
      }

      return await updateJobCardAction(jobCardId, formData);
    },
    onSuccess: (response, { redirect }) => {
      setManualLoading(false);
      if (activeStep === 0) {
        toast.success("Step 1 Completed Successfully");
      } else if (activeStep === 1) {
        toast.success("Step 2 Completed Successfully");
      } else if (activeStep === 2) {
        toast.success("Step 3 Completed Successfully");
      }
      if (activeStep !== 3) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      if (redirect) {
        if (paramId) {
          toast.success(response?.message);
          router.push("/jobcard-list");
        } else {
          toast.success("Jobcard Created Successfully");
          router.push("/jobcard-list");
        }
      }
    },
    onError: (error) => {
      if (error?.data?.message === "Insurance has expired !!") {
        handleCommentModalOpen();
      }
      setManualLoading(false);
      toast.error(error?.data?.message);
    },
  });

  const onSubmit = async (data, redirect = false) => {
    setManualLoading(true);
    try {
      if (alreadyHasClaimNumber && insuranceClaimNumber) {
        data.insuranceClaimNumber = insuranceClaimNumber;
      }
      if (activeStep === 0) {
        if (paramId || jobCardId) {
          await updatePostMutation.mutateAsync({
            ...data,
            redirect,
          });
        } else {
          const response = await mutation.mutateAsync(data);
          setJobCardId(response.data._id);
        }
      } else if (activeStep === 1 || activeStep === 2 || activeStep === 3) {
        await updatePostMutation.mutateAsync({ ...data, redirect });
      }
    } catch (error) {
      setManualLoading(false);
      console.error("Error:", error);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    reset();
    setActiveStep(0);
    setResetTrigger(!resetTrigger);
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDefaultDate(formattedDate);
  }, []);

  useEffect(() => {
    setValue("startDate", defaultDate);
    setValue("endDate", defaultDate);
    setValue("insuranceDetails.insuranceExpiryDate", defaultDate);
  }, [defaultDate]);

  const handleDeleteFile = (index) => {
    const updatedPreviews = [...filePreviews];
    updatedPreviews.splice(index, 1);
    setFilePreviews(updatedPreviews);
  };

  //ay

  const handleTotalLossModalClose = () => {
    setIsTotalLossModalOpen(false);
    setValue("totalLoss", false);
  };
  const handleTotalLossSubmit = () => {
    setValue("totalLoss", true);
    setIsTotalLossModalOpen(false);
  };

  //
  const handleDeleteFile1 = (index) => {
    const updatedPreviews = [...filePreviews1];
    updatedPreviews.splice(index, 1);
    setFilePreviews1(updatedPreviews);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const filePreviews = [];
    const binaryFiles = [];

    setPoliceReportImg(files);

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const filePreview = e.target.result;
        filePreviews.push(filePreview);
        setFilePreviews([...filePreviews]);

        // Convert file to binary data
        const file = files[i];
        const binaryReader = new FileReader();
        binaryReader.readAsArrayBuffer(file);
        binaryReader.onload = () => {
          const binaryData = binaryReader.result;
          binaryFiles.push(binaryData);
          setBinaryFiles([...binaryFiles]);
        };
      };

      reader.readAsDataURL(files[i]);
    }
  };
  const handleFileChange2 = (event) => {
    const files = event.target.files;
    const filePreviews1 = [];
    setBeforePhotosImg(files);

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const filePreview = e.target.result;
        filePreviews1.push(filePreview);
        setFilePreviews1([...filePreviews1]);

        // Convert file to binary data
        const file = files[i];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          const binaryData = reader.result;
        };
      };

      reader.readAsDataURL(files[i]);
    }
  };
  const registrationCard = {
    control,
    name: "registrationCard",
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setModalOpen(true);
    } else {
      setAlreadyHasClaimNumber(false);
      setInsuranceClaimNumber("");
    }
  };

  const handleModalSubmit = () => {
    if (insuranceClaimNumber) {
      setModalOpen(false);
      setAlreadyHasClaimNumber(true);
    } else {
      setAlreadyHasClaimNumber(false);
      setModalOpen(false);
    }
  };
  const handleModalClose = () => {
    if (!insuranceClaimNumber) {
      setAlreadyHasClaimNumber(false);
      setValue("alreadyHasClaimNumber", false); // Uncheck the checkbox
    }
    setModalOpen(false);
  };

  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const stepDescriptions = [
    "Customer Details",
    "Car & insurance Details",
    // "Start Date & Comments",
    // "Documents Upload",
    "Police Report & Photos",
    "Car Condition at Receiving ",
  ];
  // Emirates Id Extraction
  const extractEmiratesMutation = useMutation({
    mutationKey: ["extractEmirates"],
    mutationFn: async (formData) => {
      setLoadingoverlay(true);
      return await addEmiratesData(formData);
    },
    onSuccess: (res) => {
      toast.success("File uploaded successfully.");
      setEmiratesData(res);

      console.log("uuuu:-", emiratesData);
      setLoadingoverlay(false);
    },
    onError: (error) => {
      toast.error("File upload failed.");
      setLoadingoverlay(false);
    },
  });

  const handleEmirateData = (files) => {
    // console.log(typeof files[0], files, "value inside value");

    if (files && files.length > 0 && typeof files[0] === "object") {
      const formData = new FormData();

      Array.from(files).forEach((photo) => {
        formData.append("emiratesId", photo);
      });
      extractEmiratesMutation.mutate(formData);
      setEmiratesApi(true);
    } else if (!files || files.length === 0) {
      setEmiratesData(null);
      setEmiratesApi(false);
    }
  };

  const handleDrivingIdData = (files) => {
    if (files && files.length > 0 && typeof files[0] === "object") {
      const formData = new FormData();
      Array.from(files).forEach((photo) => {
        formData.append("drivingLicense", photo);
      });

      // formData.append("drivingLicense", files[0]);
      extractDrivingMutation.mutate(formData);
      setDrivingApi(true);
    } else if (!files || files.length === 0) {
      setDrivingData(null);
      setDrivingApi(false);
    }
  };
  const handleCarRcIdData = (files) => {
    if (files && files.length > 0 && typeof files[0] === "object") {
      const formData = new FormData();

      Array.from(files).forEach((photo) => {
        formData.append("registrationCard", photo);
      });

      // formData.append("registrationCard", files[0]);
      extractCarMutation.mutate(formData);
      setApiCalled(true);
    } else if (!files || files.length === 0) {
      setExctractCarData(null);
      setApiCalled(false);
    }
  };
  useEffect(() => {
    if (extractCarMutation.isSuccess && exctractCarData) {
      // Set default values for your form fields
      setValue("carDetails.carId", exctractCarData?.data?.carId);
      setValue("carDetails.year", exctractCarData?.data?.year);
      setValue("carDetails.trim", exctractCarData?.data?.trim);
      // setValue("carDetails.make", exctractCarData?.data?.brand);
      // setValue("carDetails.plateCode", exctractCarData?.data?.plateCode);
      setValue("carDetails.chassisNo", exctractCarData?.data?.chesisNo);
      setValue("carDetails.plateNumber", exctractCarData?.data?.plateNumber);
      //
      setValue(
        "carDetails.nameOnRegistrationCard",
        exctractCarData?.data?.owner
      );
      // setValue("insuranseCompanyId", { value: exctractCarData.currentInsurer, label: exctractCarData.currentInsurer }); // Assuming you're using react-select and "currentInsurer" corresponds to the value and label of the option
      // setValue(
      //   "insuranceDetails.currentInsurance",
      //   exctractCarData.data?.currentInsurer
      // );
    }
  }, [extractCarMutation.isSuccess, exctractCarData]);
  // console.log(emiratesData, "emiratesData");
  const isDisabled = isEmiratesIdSet || !!paramId;
  useEffect(() => {
    if (extractEmiratesMutation.isSuccess && emiratesData) {
      const customerEmiratesId = emiratesData?.data?.emiratesId;
      setValue("fullName", emiratesData?.data?.fullName);
      setValue("customerEmiratesId", customerEmiratesId);
      setIsEmiratesIdSet(!!customerEmiratesId);
    }
  }, [extractEmiratesMutation.isSuccess, emiratesData]);

  // Driving License Extraction
  const extractDrivingMutation = useMutation({
    mutationKey: ["extractDriving"],
    mutationFn: async (formData) => {
      setLoadingDriving(true);
      return await addLicenceData(formData);
    },
    onSuccess: (res) => {
      // toast.success("Driving License file uploaded successfully.");
      setDrivingData(res);
      setLoadingDriving(false);
    },
    onError: (error) => {
      toast.error("Driving License file upload failed.");
      setLoadingDriving(false);
    },
  });
  useEffect(() => {
    if (extractDrivingMutation.isSuccess && drivingData) {
      const formatDate = (dateString) =>
        dateString ? new Date(dateString).toISOString().split("T")[0] : "";

      const licenceIssueDate = formatDate(drivingData?.data?.licenceIssueDate);
      const licenceExpiryDate = formatDate(
        drivingData?.data?.licenceExpiryDate
      );
      const drivingFullName = drivingData?.data?.fullName;
      const emiratesFullName = emiratesData?.data?.fullName;

      const fullName = emiratesFullName || drivingFullName;
      const nameComparisonRatio = emiratesFullName
        ? ratio(drivingFullName, emiratesFullName)
        : 100;

      if (nameComparisonRatio < 80) {
        // toast.error(
        //   "The full name from driving data does not match with Emirates data."
        // );
      }

      // setValue("fullName", fullName);
      // nameOnDrivingLicense
      setValue("nameOnDrivingLicense", fullName);
      setValue("licenceIssueDate", licenceIssueDate);
      setValue("licenceNo", drivingData?.data?.licenceNo);
      setValue("licenceExpiryDate", licenceExpiryDate);
      setValue("tcNo", drivingData?.data?.dlTcNo);
    }
  }, [extractDrivingMutation.isSuccess, drivingData]);

  useEffect(() => {
    if (jobcardData && paramId) {
      const {
        customerId,
        carId,
        insuranceDetails,
        details,
        status,
        documents,
        dateOfAccident,
        isFault,
        alreadyHasClaimNumber,
        insuranceCompany,
        totalLoss,
        carMileage,
        petrolRange,
      } = jobcardData;

      const formatDate = (dateString) =>
        dateString ? new Date(dateString).toISOString().split("T")[0] : "";
      const licenceIssueDate = formatDate(
        customerId?.documentsDetails?.licenceIssueDate
      );
      const licenceExpiryDate = formatDate(
        customerId?.documentsDetails?.licenceExpiryDate
      );
      const insuranceExpiryDate = formatDate(
        insuranceDetails?.insuranceExpiryDate
      );
      const dateOfAccidentformat = formatDate(dateOfAccident);

      const { drivingLicense, emirateId } = customerId.documents;
      setValue("email", customerId?.email);
      setValue("fullName", customerId?.fullName);
      setValue("mobileNumber", customerId?.mobileNumber);
      setValue("customerEmiratesId", customerId?.customerEmiratesId);
      setValue("licenceNo", customerId?.documentsDetails?.licenceNo);
      setValue("tcNo", customerId?.documentsDetails?.tcNo);
      setValue("licenceIssueDate", licenceIssueDate);
      setValue("licenceExpiryDate", licenceExpiryDate);
      // nameOnDrivingLicense
      setValue("nameOnDrivingLicense", customerId?.nameOnDrivingLicense);
      if (carId) {
        const { registrationCard } = carId?.documents;
        setValue("carDetails.make", carId?.make);

        handleMakeChange(carId?.make);
        handleModelChange(carId?.model, carId?.make);

        setValue("carDetails.model", carId?.model);
        setValue("carDetails.trim", carId?.trim);

        setValue("carDetails.year", carId?.year);
        setValue("carDetails.plateNumber", carId?.plateNumber);
        setValue(
          "carDetails.nameOnRegistrationCard",
          carId?.nameOnRegistrationCard
        );
        // setValue("carDetails.plateCode", carId?.plateCode);
        setValue("carDetails.chassisNo", carId?.chassisNo);
        setValue(
          "registrationCard",
          registrationCard ? [registrationCard] : []
        );

        // setValue("carDetails.carBrand", carId?.carBrand);
      }
      setValue(
        "insuranceDetails.currentInsurance",
        insuranceDetails?.currentInsurance
      );
      setCurrentInsId(insuranceCompany?._id);
      setValue("insuranceDetails.insuranceExpiryDate", insuranceExpiryDate);
      setValue("dateOfAccident", dateOfAccidentformat);
      setValue("isFault", isFault);
      setValue("alreadyHasClaimNumber", alreadyHasClaimNumber);
      setValue("totalLoss", totalLoss?.totalLoss);
      setValue("details", details);
      setValue("status", status);
      //
      setValue("carMileage", carMileage);
      setValue("petrolRange", petrolRange);
      // setValue("emiratesId", [customerId?.documents?.emirateId]);
      // setValue("drivingId", [customerId?.documents?.drivingLicense]);
      setValue("drivingId", drivingLicense ? [drivingLicense] : []);
      setValue("emiratesId", emirateId ? [emirateId] : []);

      // setValue("registrationCard", [carId?.registrationCard]);
      if (documents) {
        if (documents?.beforePhotos) {
          setValue("documents.beforePhotos", documents.beforePhotos);
        }
        if (documents?.policeReport) {
          setValue("documents.policeReport", documents.policeReport);
        }
      }
    }
  }, [jobcardData]);

  const { mutate, isLoading: UpdateLoading } = updatePostMutation;

  // console.log("UpdateLoading :-",manualLoading );

  const handleFileUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
  };
  const handleBeforePhotoFileUpload = (uploadedFiles) => {
    // setBeforePhotosFiles(uploadedFiles);
    setBeforePhotosFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  useEffect(() => {
    if (jobcardData) {
      if (jobcardData?.newInsuranceCompany) {
        console.log(
          jobcardData?.newInsuranceCompany?._id,
          "newInsuranceCompany"
        );

        const selectedCompany = InsuranseCompanyList2?.find(
          (option) => option.id === jobcardData?.newInsuranceCompany?._id
        );
        if (selectedCompany) {
          setValue("newInsuranceCompany", selectedCompany.id);
        }
        console.log(InsuranseCompanyList2, "selectedCompany");
      } else if (jobcardData.insuranceDetails?.currentInsurance) {
        const selectedCompany = InsuranseCompanyList2?.find(
          (option) => option.id === jobcardData?.insuranceCompany?._id
        );
        if (selectedCompany) {
          setValue("newInsuranceCompany", selectedCompany.id);
        }
      }
    }
  }, [jobcardData, setValue]);

  const mutationCheckInsurance = useMutation({
    mutationFn: async (insuranceID) => {
      return await getInsuranceValidAction(insuranceID);
    },
    onSuccess: (response) => {
      // toast.success(response?.message);
      // console.log("hey I am insuranceID", response);
    },
    onError: (error) => {
      //   console.log("hey I am error", error);
      toast.error(error?.data?.message);
    },
    retry: false,
  });

  const CREATED_USER_DESIGNATION = userData?.data?.userId?.designation;
  const handleInsuranceCheck = async (insuranceID) => {
    if (insuranceID && CREATED_USER_DESIGNATION === "Surveyor") {
      await mutationCheckInsurance.mutateAsync(insuranceID);
    }
  };


  const btnDisable = typeof emiratesWatch === "object" || typeof drivingIdWatch === "object";


  const handleAllScanData = () => {

    console.log("emiratesWatch", emiratesWatch, drivingIdWatch);
 
    handleDrivingIdData(drivingIdWatch);

    handleEmirateData(emiratesWatch);
  }

  return (
    <>
      <div>
        {(loadingoverlay || loadingDriving || loadingCarExtract) && (
          <div
            id="overlay"
            style={{
              position: "fixed",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 51,
            }}
          >
            <div className="flex items-center justify-center w-screen h-full">
              <LayoutLoader />
            </div>
          </div>
        )}
        <div className="">
          <ClickableStep
            activeStep={activeStep}
            steps={steps}
            stepDescriptions={stepDescriptions}
          />
        </div>
        <div className="invoice-wrapper mt-6">
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-12">
              <CardHeader className="sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-base lg:text-xl font-medium text-default-700">
                  {paramId ? "Update Jobcard - " : `Create Jobcard - `}
                  {activeStep === 0 && <span>{stepDescriptions[0]}</span>}
                  {activeStep === 1 && <span>{stepDescriptions[1]}</span>}
                  {activeStep === 2 && <span>{stepDescriptions[2]}</span>}
                  {activeStep === 3 && (
                    <span className="">{stepDescriptions[3]}</span>
                  )}
                </div>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
                <CardContent className="flex flex-wrap gap-4">
                  {activeStep === 0 && (
                    <>
                      <div className="w-full flex flex-wrap justify-between gap-4 pb-4">
                        <div className="w-full lg:w-full space-y-4">
                          <Card className="border">
                            <CardHeader className="flex flex-row items-center gap-3 font-bold">
                              Document Details
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                              <div className="flex flex-row flex-wrap gap-4 w-full justify-between">
                                <div className="lg:w-[48%]">
                                  <div>
                                    <Label
                                      htmlFor="emiratesId"
                                      className="block mb-3 "
                                    >
                                      Emirates ID
                                    </Label>

                                    <Controller
                                      name="emiratesId"
                                      control={control}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <FileUploaderMultipleFrontBack
                                          value={value}
                                          onChange={(files) => {
                                            onChange(files);
                                            // handleEmirateData(files);
                                          }}
                                          name="emiratesId"
                                          textname="ID"
                                          errors={errors}
                                          width={150}
                                          height={150}
                                          //loadingError={loadingoverlay}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>

                                <div className="lg:w-[48%]">
                                  <div>
                                    <Label
                                      htmlFor="drivingId"
                                      className="block mb-3 "
                                    >
                                      Driving License
                                    </Label>

                                    <Controller
                                      name="drivingId"
                                      control={control}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <FileUploaderMultipleFrontBack
                                          value={value}
                                          onChange={(files) => {
                                            onChange(files);
                                            // handleDrivingIdData(files);
                                          }}
                                          name="drivingId"
                                          textname="License"
                                          errors={errors}
                                          width={150}
                                          height={150}
                                          // loadingError={loadingDriving}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>

                                <div className="text-end w-full">
                                  <Button
                                    // onClick={saveImage}
                                    type="button"
                                    color="primary"
                                    variant="outline"
                                    // disabled={btnDisable}
                                    onClick={() => {
                                      handleAllScanData()
                                    }}

                                  >
                                    Scan the Uploaded Documents
                                  </Button>
                                </div>

                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <div className="w-full flex flex-wrap justify-between gap-4">
                        <div className="w-full lg:w-full space-y-4">
                          <Card className="border">
                            <CardHeader className="flex flex-row items-center gap-3 font-bold">
                              Customer Details
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                              <div className="w-full flex flex-wrap justify-between gap-4">
                                <div className="w-full lg:w-[48%] space-y-4">
                                  <div>
                                    <Label htmlFor="fullName">
                                      Customer Name
                                    </Label>
                                    <div className="flex  flex-col gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name="fullName"
                                        defaultValue=""
                                        render={({ field }) => (
                                          <Input
                                            type="text"
                                            placeholder="Customer name"
                                            size="lg"
                                            id="fullName"
                                            {...field}
                                          />
                                        )}
                                      />
                                      {errors.fullName && (
                                        <span className="text-red-700">
                                          {errors.fullName.message}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="email">Email</Label>
                                    <div className="flex flex-col  gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name="email"
                                        defaultValue=""
                                        render={({ field }) => (
                                          <Input
                                            type="text"
                                            placeholder="Email"
                                            size="lg"
                                            id="email"
                                            {...field}
                                          />
                                        )}
                                      />
                                      {errors.email && (
                                        <span className="text-red-700">
                                          {errors.email.message}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Mobile no</Label>

                                    <Controller
                                      control={control}
                                      name="mobileNumber"
                                      defaultValue=""
                                      render={({ field }) => (
                                        <Input
                                          type="text"
                                          placeholder="Mobile No"
                                          size="lg"
                                          id="mobileNumber"
                                          {...field}
                                        />
                                      )}
                                    />
                                    {errors.mobileNumber && (
                                      <span className="text-red-700">
                                        {errors.mobileNumber.message}
                                      </span>
                                    )}
                                  </div>
                                  <div className="">
                                    <Label htmlFor="customerEmiratesId">
                                      Emirate ID
                                    </Label>

                                    <Controller
                                      control={control}
                                      name="customerEmiratesId"
                                      defaultValue=""
                                      render={({ field }) => (
                                        <Input
                                          type="text"
                                          placeholder="Emirate ID"
                                          size="lg"
                                          id="customerEmiratesId"
                                          {...field}
                                          disabled={isDisabled}
                                        />
                                      )}
                                    />
                                    {errors.customerEmiratesId && (
                                      <span className="text-red-700">
                                        {errors.customerEmiratesId.message}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="w-full lg:w-[48%] space-y-4">
                                  <div>
                                    <Label htmlFor="nameOnDrivingLicense">
                                      Driving License Name
                                    </Label>
                                    <div className="flex flex-col  gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name="nameOnDrivingLicense"
                                        defaultValue=""
                                        render={({ field }) => (
                                          <Input
                                            type="text"
                                            placeholder="License Name"
                                            size="lg"
                                            id="nameOnDrivingLicense"
                                            {...field}
                                          />
                                        )}
                                      />
                                      {errors.nameOnDrivingLicense && (
                                        <span className="text-red-700">
                                          {errors.nameOnDrivingLicense.message}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="licenceNo">
                                      Driving License Number
                                    </Label>
                                    <div className="flex flex-col  gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name="licenceNo"
                                        defaultValue=""
                                        render={({ field }) => (
                                          <Input
                                            type="text"
                                            placeholder="License Number"
                                            size="lg"
                                            id="licenceNo"
                                            {...field}
                                          />
                                        )}
                                      />
                                      {errors.licenceNo && (
                                        <span className="text-red-700">
                                          {errors.licenceNo.message}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="licenceIssueDate">
                                      Driving License Issue
                                    </Label>
                                    <div className="flex flex-col gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name="licenceIssueDate"
                                        render={({ field }) => (
                                          <DatePicker
                                            id="licenceIssueDate"
                                            dayPlaceholder="dd"
                                            monthPlaceholder="mm"
                                            yearPlaceholder="yyy"
                                            clearIcon={null}
                                            value={
                                              field.value
                                                ? new Date(field.value)
                                                : null
                                            }
                                            onChange={(date) =>
                                              field.onChange(
                                                date
                                                  ? format(date, "yyyy-MM-dd")
                                                  : ""
                                              )
                                            }
                                            format="dd-MM-yyyy"
                                          />
                                        )}
                                      />
                                      {errors.licenceIssueDate && (
                                        <span className="text-red-700">
                                          {errors.licenceIssueDate.message}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="licenceExpiryDate">
                                      Driving License Expiry
                                    </Label>
                                    <div className="flex flex-col gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name="licenceExpiryDate"
                                        defaultValue=""
                                        render={({ field }) => (
                                          <DatePicker
                                            id="licenceExpiryDate"
                                            dayPlaceholder="dd"
                                            monthPlaceholder="mm"
                                            yearPlaceholder="yyy"
                                            clearIcon={null}
                                            value={
                                              field.value
                                                ? new Date(field.value)
                                                : null
                                            }
                                            onChange={(date) =>
                                              field.onChange(
                                                date
                                                  ? format(date, "yyyy-MM-dd")
                                                  : ""
                                              )
                                            }
                                            format="dd-MM-yyyy"
                                          />
                                        )}
                                      />
                                      {errors.licenceExpiryDate && (
                                        <span className="text-red-700">
                                          {errors.licenceExpiryDate.message}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="tcNo">TC Number</Label>
                                    <div className="flex flex-col gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name="tcNo"
                                        defaultValue=""
                                        render={({ field }) => (
                                          <Input
                                            type="text"
                                            placeholder="TC number"
                                            size="lg"
                                            id="tcNo"
                                            {...field}
                                          />
                                        )}
                                      />
                                      {errors.tcNo && (
                                        <span className="text-red-700">
                                          {errors.tcNo.message}
                                        </span>
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
                  )}

                  {activeStep === 1 && (
                    // Car Details & Insurance Details
                    <>
                      <div className="w-full flex flex-wrap justify-between gap-4 pb-4">
                        <div className="w-full lg:w-full space-y-4">
                          <Card className="border">
                            <CardHeader className="flex flex-row items-center gap-3 font-bold">
                              Document Details
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                              <div className="flex flex-row flex-wrap gap-4 w-full justify-between">
                                <div className="lg:w-[48%]">
                                  <div>
                                    <Label
                                      htmlFor="registrationCard"
                                      className="block mb-3 "
                                    >
                                      Car Registration Card
                                    </Label>
                                    <Controller
                                      name="registrationCard"
                                      control={control}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <FileUploaderMultipleFrontBack
                                          value={value}
                                          onChange={(files) => {
                                            onChange(files);
                                            handleCarRcIdData(files);
                                          }}
                                          name="registrationCard"
                                          textname="Car RC"
                                          errors={errors}
                                          width={150}
                                          height={150}
                                          loadingError={loadingCarExtract}
                                        />

                                        // <FileUploaderMultiple
                                        //   value={value}
                                        //   onChange={(files) => {
                                        //     onChange(files);
                                        //     handleCarRcIdData(files);
                                        //   }}
                                        //   name="registrationCard"
                                        //   textname="Car RC"
                                        //   errors={errors}
                                        //   width={150}
                                        //   height={150}
                                        //   resetTrigger={resetTrigger}
                                        // />
                                      )}
                                    />
                                    {/* {extractCarMutation.isLoading && (
                                    <p>Loading...</p>
                                  )}
                                  {extractCarMutation.isError && (
                                    <p>
                                      Error: {extractCarMutation.error.message}
                                    </p>
                                  )}
                                  {extractCarMutation.isSuccess && (
                                    <p>File uploaded successfully.</p>
                                  )} */}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <div className="w-full flex flex-wrap justify-between gap-4">
                        <div className="w-full lg:w-full space-y-4">
                          <Card className="border">
                            <CardHeader className="flex flex-row items-center gap-3 font-bold">
                              Car Details
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                              <div className="flex flex-col flex-wrap gap-4 w-full lg:w-[45%] justify-between">
                                {/* year */}
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="carYear">Year</Label>
                                      <div className="flex gap-2 w-full">
                                        <Input
                                          type="text"
                                          placeholder="carYear"
                                          {...register("carDetails.year")}
                                          size="lg"
                                          id="year"
                                          className={cn("w-full", {
                                            "border-destructive":
                                              errors.carDetails?.year,
                                          })}
                                        />
                                      </div>
                                      {errors.carDetails?.year && (
                                        <div className="text-red-500 mt-2">
                                          {errors.carDetails.year.message}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {/* make */}
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="carDetails.make">
                                        Make
                                      </Label>
                                      <div className="flex gap-2 w-full">
                                        <Controller
                                          name="carDetails.make"
                                          control={control}
                                          render={({
                                            field: { onChange, value },
                                          }) => (
                                            <Select
                                              className="react-select w-full"
                                              classNamePrefix="select"
                                              id="carDetails.make"
                                              styles={styles}
                                              options={formattedCarData}
                                              onChange={(selectedOption) => {
                                                onChange(selectedOption.value); // Assuming selectedOption is { value, label }
                                                handleMakeChange(
                                                  selectedOption.value
                                                );
                                              }}
                                              value={formattedCarData?.find(
                                                (option) =>
                                                  option.value === value
                                              )}
                                            />
                                          )}
                                        />
                                      </div>
                                      {errors.carDetails?.make && (
                                        <div className="text-red-500 mt-2">
                                          {errors.carDetails.make.message}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {/* model */}
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="carDetails.model">
                                        Model
                                      </Label>
                                      <div className="flex gap-2 w-full">
                                        <Controller
                                          name="carDetails.model"
                                          control={control}
                                          render={({
                                            field: { onChange, value },
                                          }) => (
                                            <Select
                                              className="react-select w-full"
                                              classNamePrefix="select"
                                              id="carDetails.model"
                                              styles={styles}
                                              options={carModelLists?.map(
                                                (model) => ({
                                                  value: model,
                                                  label: model,
                                                })
                                              )}
                                              onChange={(selectedOption) => {
                                                onChange(selectedOption.value); // Assuming selectedOption is { value, label }
                                                handleModelChange(
                                                  selectedOption.value
                                                );
                                              }}
                                              value={{
                                                value: carModelLists?.find(
                                                  (option) => option === value
                                                ),
                                                label: carModelLists?.find(
                                                  (option) => option === value
                                                ),
                                              }}
                                              isDisabled={!selectedMake}
                                            />
                                          )}
                                        />
                                        {/* <Input
                                        type="text"
                                        placeholder="model"
                                        {...register("carDetails.model")}
                                        size="lg"
                                        id="model"
                                        className={cn("w-full", {
                                          "border-destructive":
                                            errors.carDetails?.model,
                                        })}
                                      /> */}
                                      </div>
                                      {errors.carDetails?.model && (
                                        <div className="text-red-500 mt-2">
                                          {errors.carDetails.model.message}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* trim */}
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="trim">Trim</Label>
                                      <div className="flex gap-2 w-full">
                                        <Controller
                                          name="carDetails.trim"
                                          control={control}
                                          render={({
                                            field: { onChange, value },
                                          }) => (
                                            <Select
                                              className="react-select w-full"
                                              classNamePrefix="select"
                                              id="carDetails.trim"
                                              styles={styles}
                                              options={carTrimLists?.map(
                                                (trim) => ({
                                                  value: trim,
                                                  label: trim,
                                                })
                                              )}
                                              onChange={(selectedOption) => {
                                                onChange(selectedOption.value);
                                              }}
                                              value={{
                                                value: carTrimLists?.find(
                                                  (option) => option === value
                                                ),
                                                label: carTrimLists?.find(
                                                  (option) => option === value
                                                ),
                                              }}
                                              isDisabled={!selectedModel} // Disable the trim select if no model is selected
                                            />
                                          )}
                                        />
                                      </div>
                                      {errors.carDetails?.trim && (
                                        <div className="text-red-500 mt-2">
                                          {errors.carDetails?.trim.message}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col flex-wrap w-full lg:w-[45%] gap-4">
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="chassisNo">
                                        Chassis No
                                      </Label>
                                      <div className="flex gap-2 w-full">
                                        <Input
                                          type="text"
                                          placeholder="Chassis No"
                                          size="lg"
                                          {...register("carDetails.chassisNo")}
                                          id="chassisNo"
                                          className={cn("w-full", {
                                            "border-red-500":
                                              errors?.carDetails?.chassisNo,
                                          })}
                                        />
                                      </div>
                                      {errors.carDetails?.chassisNo && (
                                        <div className="text-red-500 mt-2">
                                          {
                                            errors?.carDetails?.chassisNo
                                              ?.message
                                          }
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="plateNumber">
                                        Plate Number
                                      </Label>
                                      <div className="flex gap-2 w-full">
                                        <Input
                                          type="text"
                                          placeholder="Plate Number"
                                          size="lg"
                                          id="plateNumber"
                                          {...register(
                                            "carDetails.plateNumber"
                                          )}
                                          className={cn("w-full", {
                                            "border-red-500":
                                              errors.carDetails?.plateNumber,
                                          })}
                                        />
                                      </div>
                                      {errors.carDetails?.plateNumber && (
                                        <div className="text-red-500 mt-2">
                                          {
                                            errors.carDetails.plateNumber
                                              .message
                                          }
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="nameOnRegistrationCard">
                                        Registration Card Name
                                      </Label>
                                      <div className="flex gap-2 w-full">
                                        <Input
                                          type="text"
                                          placeholder="Registration Card Name"
                                          size="lg"
                                          id="nameOnRegistrationCard"
                                          {...register(
                                            "carDetails.nameOnRegistrationCard"
                                          )}
                                          className={cn("w-full", {
                                            "border-red-500":
                                              errors.carDetails
                                                ?.nameOnRegistrationCard,
                                          })}
                                        />
                                      </div>
                                      {errors.carDetails
                                        ?.nameOnRegistrationCard && (
                                          <div className="text-red-500 mt-2">
                                            {
                                              errors.carDetails
                                                .nameOnRegistrationCard.message
                                            }
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <div className="w-full flex flex-wrap justify-between gap-4">
                        <div className="w-full lg:w-full space-y-4">
                          <Card className=" border">
                            <CardHeader className="flex flex-row items-center gap-3 font-bold">
                              Insurance Details
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                              <div className="flex flex-col flex-wrap w-full lg:w-[45%] gap-4 justify-between">
                                <div className="w-full space-y-4">
                                  <div>
                                    <Label htmlFor="insuranceDetails.currentInsurance">
                                      Current Insurer
                                    </Label>
                                    <div className="flex gap-2 w-full">
                                      <Controller
                                        name="insuranceDetails.currentInsurance"
                                        control={control}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <Select
                                            className="react-select w-full"
                                            classNamePrefix="select"
                                            id="insuranceDetails.currentInsurance"
                                            styles={styles}
                                            name="insuranceDetails.currentInsurance"
                                            options={InsuranseCompanyList}
                                            onChange={(selectedOption) => {
                                              onChange(selectedOption?.value);
                                              setCurrentInsId(
                                                selectedOption?.id
                                              );
                                              handleInsuranceCheck(
                                                selectedOption?.id
                                              );
                                            }}
                                            // onChange={(selectedOption) => {
                                            //   onChange({ companyName: selectedOption.value, companyId: selectedOption.id });
                                            // }}
                                            value={InsuranseCompanyList?.find(
                                              (option) =>
                                                option?.value === value
                                            )}
                                            required={true}
                                          />
                                        )}
                                      />
                                      {/* <Input
                                      type="text"
                                      placeholder="Current Insurer"
                                      {...register(
                                        "insuranceDetails.currentInsurance"
                                      )}
                                      size="lg"
                                      id="insuranceDetails.currentInsurance"
                                      className={cn("w-full", {
                                        "border-destructive":
                                          errors?.insuranceDetails
                                            ?.currentInsurance,
                                      })}
                                    /> */}
                                    </div>
                                    {errors?.insuranceDetails
                                      ?.currentInsurance && (
                                        <div className="text-destructive mt-2">
                                          {
                                            errors?.insuranceDetails
                                              ?.currentInsurance.message
                                          }
                                        </div>
                                      )}
                                  </div>
                                </div>
                                {/* <div className="w-full space-y-4">
                                <div>
                                  <Label htmlFor="insuranceDetails.insuranceType">
                                    Insurance Type
                                  </Label>
                                  <div className="flex gap-2 w-full">
                                    <Input
                                      type="text"
                                      placeholder="Insurance Type"
                                      {...register(
                                        "insuranceDetails.insuranceType"
                                      )}
                                      size="lg"
                                      id="insuranceDetails.insuranceType"
                                      className={cn("w-full", {
                                        "border-destructive":
                                          errors?.insuranceDetails
                                            ?.insuranceType,
                                      })}
                                    />
                                  </div>
                                  {errors?.insuranceDetails?.insuranceType && (
                                    <div className="text-destructive mt-2">
                                      {
                                        errors?.insuranceDetails?.insuranceType
                                          .message
                                      }
                                    </div>
                                  )}
                                </div>
                              </div> */}
                                <div className="w-full space-y-4">
                                  <div>
                                    <Label htmlFor="insuranceDetails.insuranceExpiryDate">
                                      Insurance Expiry Date
                                    </Label>
                                    <div className="flex gap-2 w-full">
                                      <Controller
                                        control={control}
                                        name="insuranceDetails.insuranceExpiryDate"
                                        render={({ field }) => (
                                          <DatePicker
                                            id="insuranceDetails.insuranceExpiryDate"
                                            dayPlaceholder="dd"
                                            monthPlaceholder="mm"
                                            yearPlaceholder="yyy"
                                            clearIcon={null}
                                            value={
                                              field.value
                                                ? new Date(field.value)
                                                : defaultDate
                                            }
                                            onChange={(date) =>
                                              field.onChange(
                                                date
                                                  ? format(date, "yyyy-MM-dd")
                                                  : ""
                                              )
                                            }
                                            className="w-full"
                                            format="dd-MM-yyyy"
                                          />
                                        )}
                                      />

                                      {/* <Input
                                        type="date"
                                        placeholder="Expiry Date"
                                        {...register(
                                          "insuranceDetails.insuranceExpiryDate"
                                        )}
                                        size="lg"
                                        defaultValue={defaultDate}
                                        id="insuranceDetails.insuranceExpiryDate"
                                        className={cn("w-full", {
                                          "border-destructive":
                                            errors?.insuranceDetails
                                              ?.insuranceExpiryDate,
                                        })}
                                      /> */}
                                    </div>
                                    {errors?.insuranceDetails
                                      ?.insuranceExpiryDate && (
                                        <div className="text-destructive mt-2">
                                          {
                                            errors?.insuranceDetails
                                              ?.insuranceExpiryDate.message
                                          }
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}

                  {activeStep === 2 && (
                    <>
                      <div className="w-full flex flex-wrap justify-between gap-4">
                        <div className="w-full lg:w-full space-y-4">
                          <Card className="border">
                            <CardHeader className="flex flex-row items-center gap-3 font-bold">
                              Documents Upload
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                              <div className="flex flex-col flex-wrap gap-4 w-full lg:w-[45%] justify-between">
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    {/* <div>
                                    <Label htmlFor="documents.policeReport">
                                      Police Report Upload
                                    </Label>
                                    <div className="flex gap-2 w-full">
                                      <Input
                                        type="file"
                                        {...register("documents.policeReport", {
                                          required: "Police report is required",
                                        })}
                                        required
                                        onChange={handleFileChange}
                                        size="lg"
                                        id="documents.policeReport"
                                        className={cn("w-full", {
                                          "border-destructive":
                                            errors.documents?.policeReport,
                                        })}
                                        multiple // Allow multiple files to be selected
                                      />
                                    </div>
                                    {errors?.documents?.policeReport && (
                                      <div className="text-red-500 mt-2">
                                        {
                                          errors?.documents?.policeReport
                                            ?.message
                                        }
                                      </div>
                                    )}

                                    {jobcardData?.documents
                                      ?.policeReport?.[0] &&
                                      filePreviews?.length === 0 && (
                                        <>
                                          <img
                                            src={
                                              jobcardData?.documents
                                                ?.policeReport?.[0]
                                            }
                                            alt={`File Preview`}
                                            className="mt-2 w-32 h-32 object-cover"
                                          />
                                        </>
                                      )}
                                    {filePreviews?.length > 0 && (
                                      <div className="mt-2 grid grid-cols-3 gap-2">
                                        {filePreviews?.map((preview, index) => (
                                          <div key={index} className="relative">
                                            <img
                                              src={preview}
                                              alt={`File Preview ${index + 1}`}
                                              className="w-32 h-32 object-cover"
                                            />
                                            <button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteFile(index);
                                              }}
                                              className="absolute top-0 left-0 p-1 bg-red-500 rounded-full text-white"
                                            >
                                              X
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div> */}
                                    <Label htmlFor="documents.policeReport">
                                      Police Report Upload
                                    </Label>
                                    <Controller
                                      name="documents.policeReport"
                                      control={control}
                                      rules={{
                                        required: "Police report is required",
                                      }}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <DropZone
                                          onFileUpload={handleFileUpload}
                                          value={value}
                                          onChange={onChange}
                                          errors={
                                            errors?.documents?.policeReport
                                          }
                                          pdf={true}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col flex-wrap gap-4 w-full lg:w-[45%] justify-between">
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="dateOfAccident">
                                        Accident Date
                                      </Label>
                                      <div className="flex gap-2 w-full">
                                        {/* <Input
                                          type="date"
                                          placeholder="Accident Date"
                                          {...register("dateOfAccident")}
                                          size="lg"
                                          defaultValue={defaultDate}
                                          id="dateOfAccident"
                                        /> */}

                                        <Controller
                                          control={control}
                                          name="dateOfAccident"
                                          render={({ field }) => (
                                            <DatePicker
                                              id="dateOfAccident"
                                              dayPlaceholder="dd"
                                              monthPlaceholder="mm"
                                              yearPlaceholder="yyy"
                                              clearIcon={null}
                                              value={
                                                field.value
                                                  ? new Date(field.value)
                                                  : defaultDate
                                              }
                                              onChange={(date) =>
                                                field.onChange(
                                                  date
                                                    ? format(date, "yyyy-MM-dd")
                                                    : ""
                                                )
                                              }
                                              className="w-full"
                                              format="dd-MM-yyyy"
                                            />
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <div className="w-full space-y-4">
                                        <div className="w-full lg:w-full">
                                          <div className="flex items-center h-5">
                                            <Controller
                                              name="isFault"
                                              control={control}
                                              render={({ field }) => (
                                                <input
                                                  id="isFault"
                                                  type="checkbox"
                                                  className="border-gray-200 h-6 w-6 disabled:opacity-50 accent-[#30D5C7] checked:bg-[#30D5C7] rounded-sm text-white mr-2"
                                                  {...field}
                                                  checked={field.value || false}
                                                />
                                              )}
                                            />
                                            <label htmlFor="isFault">
                                              At Fault
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      {!watch("isFault") && ( // Conditionally render the "Current Insurer" section
                                        <div className="w-full space-y-4 mt-4">
                                          <div>
                                            <Label htmlFor="newInsuranceCompany">
                                              New Insurer
                                            </Label>
                                            <div className="flex gap-2 w-full">
                                              <Controller
                                                name="newInsuranceCompany"
                                                control={control}
                                                render={({
                                                  field: { onChange, value },
                                                }) => (
                                                  <Select
                                                    className="react-select w-full"
                                                    classNamePrefix="select"
                                                    id="newInsuranceCompany"
                                                    styles={styles}
                                                    options={
                                                      InsuranseCompanyList2
                                                    }
                                                    onChange={(
                                                      selectedOption
                                                    ) => {
                                                      onChange(
                                                        selectedOption?.id
                                                      );
                                                      setNewInsId(
                                                        selectedOption?.id
                                                      );
                                                      handleInsuranceCheck(
                                                        selectedOption?.id
                                                      );
                                                    }}
                                                    value={InsuranseCompanyList2?.find(
                                                      (option) =>
                                                        option?.value === value
                                                    )}
                                                  />
                                                )}
                                              />
                                            </div>
                                            {errors?.newInsuranceCompany && (
                                              <div className="text-destructive mt-2">
                                                {
                                                  errors?.newInsuranceCompany
                                                    ?.message
                                                }
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <div className="w-full flex flex-wrap justify-between gap-4">
                        <div className="w-full lg:w-full space-y-4">
                          <Card className="border">
                            <CardHeader className="flex flex-row items-center gap-3 font-bold">
                              Upload Photos of The Vehicle Before The Repair
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                              <div className="flex flex-col flex-wrap gap-4 w-full lg:w-[45%] justify-between">
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="documents.beforePhotos">
                                        Upload Photo
                                      </Label>
                                      <Controller
                                        name="documents.beforePhotos"
                                        control={control}
                                        rules={{
                                          required: "Before Photo is required",
                                        }}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <DropZone
                                            onFileUpload={
                                              handleBeforePhotoFileUpload
                                            }
                                            value={value}
                                            onChange={onChange}
                                            errors={
                                              errors?.documents?.beforePhotos
                                            }
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <div className="w-full flex flex-wrap justify-between gap-4">
                        <div className="w-full lg:w-full space-y-4">
                          <Card className="border">
                            <CardHeader className="flex flex-row items-center gap-3 font-bold">
                              Job Details
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                              <div className="flex flex-col flex-wrap gap-4 w-full lg:w-[45%] justify-between">
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="details">Comments</Label>
                                      <div className="flex gap-2 w-full">
                                        <Textarea
                                          placeholder="Notes..."
                                          {...register("details")}
                                          id="details"
                                          className={cn("w-full", {
                                            "border-destructive":
                                              errors.details,
                                          })}
                                        />
                                      </div>
                                      {errors.details && (
                                        <div className="text-red-500 mt-2">
                                          {errors.details.message}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full space-y-4">
                                  <div className="w-full lg:w-full">
                                    <div>
                                      <Label htmlFor="startDate">
                                        Start Date
                                      </Label>
                                      <div className="flex gap-2 w-full">
                                        <Controller
                                          control={control}
                                          name="startDate"
                                          render={({ field }) => (
                                            <DatePicker
                                              id="startDate"
                                              dayPlaceholder="dd"
                                              monthPlaceholder="mm"
                                              yearPlaceholder="yyy"
                                              clearIcon={null}
                                              value={
                                                field.value
                                                  ? new Date(field.value)
                                                  : defaultDate
                                              }
                                              onChange={(date) =>
                                                field.onChange(
                                                  date
                                                    ? format(date, "yyyy-MM-dd")
                                                    : ""
                                                )
                                              }
                                              className="w-full"
                                              format="dd-MM-yyyy"
                                            />
                                          )}
                                        />
                                      </div>
                                      {errors.startDate && (
                                        <div className="text-destructive mt-2">
                                          {errors.startDate.message}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="w-full flex flex-wrap justify-between gap-4"> */}
                                {/* <div className="w-full lg:w-[48%] space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Controller
                                  name="status"
                                  control={control}
                                  defaultValue="Draft"
                                  render={({ field: { onChange, value } }) => (
                                    <Select
                                      className="react-select"
                                      classNamePrefix="select"
                                      id="status"
                                      options={StatusList}
                                      onChange={(selectedOption) =>
                                        onChange(selectedOption.value)
                                      }
                                      value={
                                        StatusList.find(
                                          (option) => option.value === value
                                        ) || {
                                          value: "Draft",
                                          label: "Draft",
                                        }
                                      }
                                      isDisabled={!paramId}
                                    />
                                  )}
                                />
                              </div> */}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <div className="flex items-center h-5 mt-4">
                        <Controller
                          name="alreadyHasClaimNumber"
                          control={control}
                          render={({ field }) => (
                            <input
                              id="alreadyHasClaimNumber"
                              type="checkbox"
                              className="border-gray-200 h-6 w-6 disabled:opacity-50 accent-[#30D5C7] checked:bg-[#30D5C7] rounded-sm text-white mr-2"
                              {...field}
                              checked={field.value || false}
                              onChange={(e) => {
                                handleCheckboxChange(e);
                                field.onChange(e);
                              }}
                            />
                          )}
                        />
                        <label htmlFor="alreadyHasClaimNumber">
                          Already has Claim Number
                        </label>
                      </div>

                      <div className="w-full flex flex-wrap justify-between gap-4">
                        <div className="flex justify-start items-center">
                          <Controller
                            name="totalLoss"
                            control={control}
                            render={({ field }) => (
                              <input
                                id="totalLoss"
                                type="checkbox"
                                className="border-gray-200 h-6 w-6 disabled:opacity-50 accent-[#30D5C7] checked:bg-[#30D5C7] rounded-sm text-white mr-2"
                                {...field}
                                checked={field.value || false}
                                onChange={(e) => {
                                  handleTotalLossModalOpen(e);
                                  field.onChange(e);
                                }}
                              />
                            )}
                          />
                          <label htmlFor="totalLoss">Is it a total loss?</label>
                        </div>
                      </div>
                    </>
                  )}

                  {activeStep === 3 && (
                    <>
                      <div className="w-full flex flex-wrap justify-between gap-4">
                        <div className="w-full lg:w-full space-y-4">
                          <Card className="border">
                            <CardHeader className="flex flex-row items-center gap-3 font-bold">
                              Job Details
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
                              <div className="flex flex-col flex-wrap gap-4 w-full lg:w-[45%] justify-start">
                                <div className="w-full flex flex-wrap justify-between gap-4">
                                  <div>
                                    <Label
                                      for="carMileage"
                                      className="block text-gray-700 font-bold mb-2"
                                    >
                                      Car Mileage
                                    </Label>
                                    <div className="max-w-[130px] flex">
                                      <Controller
                                        control={control}
                                        id="carMileage"
                                        name="carMileage"
                                        render={({ field }) => (
                                          <Input
                                            type="text"
                                            placeholder=""
                                            {...field}
                                            className={`w-[70px] appearance-none accent-transparent rounded ltr:rounded-r-none ltr:border-r-0 rtl:rounded-l-none rtl:border-l-0 border-default-300 ${errors.carMileage
                                              ? "border-red-700"
                                              : ""
                                              }`}
                                          />
                                        )}
                                      />

                                      <SelectTow className="ltr:rounded-l-none ltr:border-l-[0px] rtl:rounded-r-none rtl:border-r-[0px] text-xs">
                                        <SelectTrigger className="rounded ltr:rounded-l-none rtl:rounded-r-none h-9  pr-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:mt-1 ">
                                          <SelectValue placeholder="KM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pcs">
                                            KM
                                          </SelectItem>
                                          {/* <SelectItem value="kg">kg</SelectItem> */}
                                        </SelectContent>
                                      </SelectTow>
                                    </div>
                                    {errors.carMileage && (
                                      <div className="text-destructive mt-2">
                                        {errors.carMileage.message}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="w-full flex flex-wrap justify-between gap-4">
                                  <div className="w-1/2">
                                    <div className="mb-4">
                                      <Label
                                        for="petrolRange"
                                        className="block text-gray-700 font-bold mb-2"
                                      >
                                        Petrol level
                                      </Label>
                                      <Controller
                                        name="petrolRange"
                                        control={control}
                                        render={({
                                          field: { onChange, value },
                                        }) => (
                                          <Slider
                                            id="petrolRange"
                                            min={5}
                                            max={100}
                                            value={value}
                                            onChange={onChange}
                                            trackStyle={{
                                              backgroundColor: "#08AFA4",
                                              height: 10,
                                            }}
                                            railStyle={{
                                              backgroundColor: "lightblue",
                                              height: 10,
                                            }}
                                            handleStyle={{
                                              // borderColor: "red",
                                              height: 20,
                                              width: 20,
                                              // marginLeft: -10,
                                              // marginTop: -5,
                                              backgroundColor: "#08AFA4",
                                            }}
                                          />
                                        )}
                                      />
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                      <span id="minRange">0%</span>
                                      <span id="maxRange">
                                        {petrolRangeValue}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <ImageDrawer
                                setImageForJobCard={setImageForJobCard}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-4 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    className={cn({
                      hidden: activeStep === 0,
                    })}
                  >
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      if (activeStep === 0 && !jobCardId) {
                        handleSubmit((data) => onSubmit(data, false))(); // Submit the form for the first step without redirect
                      } else if (activeStep === 0 && paramId) {
                        handleSubmit((data) => onSubmit(data, false))();
                        // setActiveStep((prevActiveStep) => prevActiveStep + 1);
                      } else {
                        handleSubmit((data) => onSubmit(data, false))();
                        // setActiveStep((prevActiveStep) => prevActiveStep + 1);
                      }
                    }}
                    className={cn("ml-auto", {
                      hidden: activeStep >= 3,
                    })}
                  >
                    {manualLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading ...
                      </div>
                    ) : (
                      "Next"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit((data) => onSubmit(data, true))(); // Submit the form for the final step with redirect
                    }}
                    className={cn("ml-auto", {
                      hidden: activeStep < 3,
                    })}
                  >
                    {manualLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading ...
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleModalClose();
          } else {
            setModalOpen(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Insurance Claim Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="insuranceClaimNumber">Insurance Claim Number</Label>
            <Input
              id="insuranceClaimNumber"
              type="text"
              value={insuranceClaimNumber}
              onChange={(e) => setInsuranceClaimNumber(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button onClick={handleModalSubmit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isInsuranceExModalOpen && (
        <InsuranceExModal
          onClose={handleCommentModalClose}
          handleAddCoomitSubmit={handleAddCoomitSubmit}
        />
      )}

      {isTotalLossModalOpen && (
        <TotalLossJobModel
          onClose={handleTotalLossModalClose}
          handleTotalLossSubmit={handleTotalLossSubmit}
        />
      )}
    </>
  );
};

export default JobCardPage;
