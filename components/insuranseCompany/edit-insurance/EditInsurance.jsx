"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import FileUploaderSingle from "@/components/common/file-uploader/file-uploader-single";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEditInsurance } from "./hook/useEditInsurance";
import { FiPlus } from "react-icons/fi";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const EditInsurance = () => {
    const { initialValues, schema, submit } = useEditInsurance()
    const router = useRouter();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue
    } = useForm({
        defaultValues: initialValues,
        resolver: zodResolver(schema),
        mode: "all",
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues]);

    const handleReset = () => {
        reset();
    };


    console.log(errors);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "claimsEmails",
    });
    const hasAppended = useRef(false);
    useEffect(() => {
        if (!hasAppended.current && fields.length === 0) {
            append({ emailName: "", isPrimary: false });
            hasAppended.current = true;
        }
    }, [fields, append,]);

    return (
        <>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem>Menu</BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link href="/insurance-list">Insurance Companies</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        Update Insurance Company
                    </BreadcrumbItem>
                </Breadcrumbs>
                <div className="invoice-wrapper mt-6">
                    <form onSubmit={handleSubmit(submit)}>
                        <div className="grid grid-cols-12 gap-6">
                            <Card className="col-span-12">
                                <CardHeader className="sm:flex-row sm:items-center gap-3">
                                    <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">
                                        Update Insurance Company
                                    </div>
                                    <div className="flex-none flex items-center gap-4">
                                        <Button
                                            className="border-default-300 group"
                                            size="icon"
                                            variant="outline"
                                        // onClick={handleReset}
                                        >
                                            <Icon
                                                icon="heroicons:arrow-path"
                                                className="w-5 h-5 text-default-300 group-hover:text-default-50 dark:group-hover:text-primary-foreground"
                                            />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div>
                                                <Label>Company Name</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Company Name"
                                                    {...register("companyName")}
                                                    size="lg"
                                                    id="companyName"
                                                    className={cn("w-full", {
                                                        "border-destructive": errors.companyName,
                                                    })}
                                                />
                                                {errors.companyName && (
                                                    <div className="text-destructive mt-2">
                                                        {errors.companyName.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <Label>Account Email</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="Account Email"
                                                    {...register("companyEmail")}
                                                    size="lg"
                                                    id="companyEmail"
                                                    className={cn("w-full", {
                                                        "border-destructive": errors.companyEmail,
                                                    })}
                                                />
                                                {errors.companyEmail && (
                                                    <div className="text-destructive mt-2">
                                                        {errors.companyEmail.message}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Contact Email</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="Contact Email"
                                                    {...register("contactEmail")}
                                                    size="lg"
                                                    id="contactEmail"
                                                    className={cn("w-full", {
                                                        "border-destructive": errors.contactEmail,
                                                    })}
                                                />
                                                {errors.contactEmail && (
                                                    <div className="text-destructive mt-2">
                                                        {errors.contactEmail.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <Label>Claims Email</Label>
                                                {fields.map((item, index) => (
                                                    <>

                                                        <div className="flex justify-start items-start gap-2 mt-2" key={item.id}>

                                                            <div className="flex justify-center items-center w-1/2 gap-1">
                                                                <Controller
                                                                    control={control}
                                                                    name={`claimsEmails[${index}].emailName`}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            type="email"
                                                                            placeholder="Claims Email"
                                                                            id={`claimsEmails[${index}].emailName`}
                                                                            size="lg"
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.claimsEmails?.[index]?.emailName && (
                                                                    <span className="text-red-700">
                                                                        {
                                                                            errors.claimsEmails[index].emailName
                                                                                .message
                                                                        }
                                                                    </span>
                                                                )}

                                                                <div className="flex items-center">
                                                                    <input
                                                                        type="hidden"
                                                                        {...register(`claimsEmails[${index}].isPrimary`)}
                                                                    />
                                                                    <input
                                                                        id={`claimsEmails[${index}].isPrimary`}
                                                                        type="radio"
                                                                        checked={watch(`claimsEmails[${index}].isPrimary`)}
                                                                        onChange={() => {
                                                                            // Update isPrimary for all items to false
                                                                            fields.forEach((_, i) => setValue(`claimsEmails[${i}].isPrimary`, false));
                                                                            // Set the selected item's isPrimary to true
                                                                            setValue(`claimsEmails[${index}].isPrimary`, true);
                                                                        }}
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                    />

                                                                    {watch(`claimsEmails[${index}].isPrimary`) && (
                                                                        <label
                                                                            htmlFor={`claimsEmails[${index}].isPrimary`}
                                                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                                        >
                                                                            Primary
                                                                        </label>
                                                                    )}

                                                                </div>

                                                            </div>
                                                            {index === fields.length - 1 ? (
                                                                <>
                                                                    {index != 0 && (
                                                                        <Button
                                                                            className="border-default-300 "
                                                                            size="icon"
                                                                            variant="outline"
                                                                            type="button"
                                                                            title="Remove"
                                                                            onClick={() => remove(index)}
                                                                        >
                                                                            <Icon
                                                                                icon="heroicons:trash"
                                                                                className="w-5 h-5 text-default-300"
                                                                            />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        className="border-default-300 "
                                                                        size="icon"
                                                                        variant="outline"
                                                                        type="button"
                                                                        title="Add Item"
                                                                        onClick={() =>
                                                                            append({ emailName: "", isPrimary: false })
                                                                        }
                                                                    >
                                                                        <FiPlus className="w-5 h-5 text-default-300" />
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    className="border-default-300 "
                                                                    size="icon"
                                                                    variant="outline"
                                                                    type="button"
                                                                    title="Remove"
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    <Icon
                                                                        icon="heroicons:trash"
                                                                        className="w-5 h-5 text-default-300"
                                                                    />
                                                                </Button>
                                                            )}

                                                        </div>





                                                    </>
                                                    //     <Input
                                                    //         type="email"
                                                    //         placeholder="Claims Email"
                                                    //         {...register("claimsEmail")}
                                                    //         size="lg"
                                                    //         id="claimsEmail"
                                                    //         className={cn("w-full", {
                                                    //             "border-destructive": errors.claimsEmail,
                                                    //         })}
                                                    //     />
                                                ))}

                                            </div>


                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <Label>Contact No</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Contact No"
                                                    {...register("contactNo")}
                                                    size="lg"
                                                    id="contactNo"
                                                    className={cn("w-full", {
                                                        "border-destructive": errors.contactNo,
                                                    })}
                                                />
                                                {errors.contactNo && (
                                                    <div className="text-destructive mt-2">
                                                        {errors.contactNo.message}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <Label>Description</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Description"
                                                    {...register("description")}
                                                    size="lg"
                                                    id="description"
                                                    className={cn("w-full", {
                                                        "border-destructive": errors.description,
                                                    })}
                                                />
                                                {errors.description && (
                                                    <div className="text-destructive mt-2">
                                                        {errors.description.message}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Company Website</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Company Website"
                                                    {...register("companyWebsite")}
                                                    size="lg"
                                                    id="companyWebsite"
                                                    className={cn("w-full", {
                                                        "border-destructive": errors.companyWebsite,
                                                    })}
                                                />
                                                {errors.companyWebsite && (
                                                    <div className="text-destructive mt-2">
                                                        {errors.companyWebsite.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6 mt-6">
                                        <div>
                                            <Label htmlFor="logo" className="block mb-3">
                                                Logo
                                            </Label>
                                            <Controller
                                                name="logo"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <FileUploaderSingle
                                                        value={value}
                                                        onChange={onChange}
                                                        height={150}
                                                        width={150}
                                                        name={"logo"}
                                                        errors={errors}
                                                    // resetTrigger={resetTrigger}
                                                    />
                                                )}
                                            />
                                        </div>

                                    </div>
                                </CardContent>

                                <CardFooter className="flex justify-between gap-4 flex-wrap">
                                    <Button>
                                        <Link href="/insurance-list">Back</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="group hover:bg-default-200 hover:text-default-900 text-xs font-semibold whitespace-nowrap"
                                    >
                                        Update Company
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

export default EditInsurance