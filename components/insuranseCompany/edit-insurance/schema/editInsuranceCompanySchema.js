import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const editInsuranceCompanySchema = z.object({
  companyName: z.string().nonempty("Company name is required"),
  description: z.any().optional(),
  companyEmail: z.string().email("Email is required"),
  // claimsEmail: z.string().email("Email is required"),
  contactEmail: z.string().email("Email is required"),
  companyWebsite: z.any().optional(),
  contactNo: z.string().regex(/^\+?\d{1,14}$/, "Contact number is required"),

  claimsEmails: z.array(
    z.object({
      emailName: z.string().refine((value) => value.trim() !== "", {
        message: "Email is required",
      }),
      isPrimary: z.boolean()
    })
  ).refine(
    (emails) => emails.filter(email => email.isPrimary).length === 1,
    {
      message: "There must be exactly one primary email",
    }
  ),

  logo: z.any().refine(
    (file) => {
      if (typeof file?.[0] === "string") return true;
      return file?.[0]?.size < 5 * 1024 * 1024;
    },
    {
      message: "File size should be less than 5MB",
    }
  ),
});
