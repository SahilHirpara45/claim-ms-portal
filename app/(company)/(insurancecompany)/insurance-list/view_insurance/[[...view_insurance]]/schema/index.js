import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const addCompanySchema = z.object({
    companyName: z.string().nonempty("Company name is required"),
    description: z.string().min(1, "Description is required"),
    companyEmail: z.string().email("Email is required"),
    contactEmail: z.string().email("Email is required"),
    companyWebsite: z.string().url("Website is required"),
    contactNo: z.string().regex(/^\+?\d{1,14}$/, "Contact number is required"),
    companyPortal: z.string().url("URL is required"),
    logo: z.any()
        .refine((file) => {
            if (typeof file?.[0] === 'string') return true;
            return file?.[0]?.size < 5 * 1024 * 1024;
        }, {
            message: "File size should be less than 5MB",
        }),
});
