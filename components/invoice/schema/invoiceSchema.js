import { z } from "zod";

// Define the schema
export const invoiceSchema = z.object({
  invocieType: z.string().refine((value) => value.trim() !== "", {
    message: "invoice type required",
  }),
  // invocieId: z.string().refine((value) => value.trim() !== "", {
  //   message: "id is required",
  // }),
  invocieDate: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "date required",
    })
    .transform((str) => new Date(str)),
  invocieDueDate: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "due date required",
    })
    .transform((str) => new Date(str)),
  billFCn: z.string().refine((value) => value.trim() !== "", {
    message: "name is required",
  }),
  billFCnEmail: z.string().refine((value) => value.trim() !== "", {
    message: "email is required",
  }).refine((value) => {
    return /^\S+@\S+\.\S+$/.test(value);
  }, "invalid email format"),
  billFCnPhone: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "phone is required",
    })
    .refine((value) => {
      return /^[0-9]{10}$/.test(value);
    }, "invalid mobile number"),
  billFCnAdd: z.string().refine((value) => value.trim() !== "", {
    message: "address is required",
  }),
  billToCn: z.string().refine((value) => value.trim() !== "", {
    message: "name is required",
  }),
  billToCnEmail: z.string().refine((value) => value.trim() !== "", {
    message: "email is required",
  }).refine((value) => {
    return /^\S+@\S+\.\S+$/.test(value);
  }, "invalid email format"),
  billToCnPhone: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "phone is required",
    })
    .refine((value) => {
      return /^[0-9]{10}$/.test(value);
    }, "invalid mobile number"),
  billToCnAdd: z.string().refine((value) => value.trim() !== "", {
    message: "address is required",
  }),

  itemList: z.array(
    z.object({
      itemName: z.string().refine((value) => value.trim() !== "", {
        message: "item Name is required",
      }),
      itemQty: z
        .string()
        .refine((value) => value.trim() !== "", {
          message: "item qty is required",
        })
        .refine(
          (value) => {
            return /^\d+(\.\d{1,2})?$/.test(value);
          },
          {
            message: "valid qty",
          }
        ),
      itemPrice: z
        .string()
        .refine((value) => value.trim() !== "", {
          message: "item Price is required",
        })
        .refine(
          (value) => {
            return /^\d+(\.\d{1,2})?$/.test(value);
          },
          {
            message: "valid price",
          }
        ),
    })
  ),
  invocieNote: z.string().refine((value) => value.trim() !== "", {
    message: "note is required",
  }),
  invocieTc: z.string().refine((value) => value.trim() !== "", {
    message: "terms & conditions required",
  }),
});

//