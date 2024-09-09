import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FiPlus } from "react-icons/fi";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";

const SectionAddItem = ({
  index,
  control,
  errors,
  handleAddSection,
  handleRemoveSection,
  sectionlitsFields,
  quotationData
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sectionItems[${index}].itemsList`,
  });
  const params = useParams();

  const quotaionsId = params?.quotaionsId;
  const viewQuotationId = params?.viewQuotationId;
  const reCreateID = params?.reCreateID;

  const isFirstRun = useRef(false);

  const handleAddItem = () => {
    append({ itemName: "" });
  };

  const handleRemoveItem = (itemIndex) => {

    remove(itemIndex);
  };

  useEffect(() => {
    if (!isFirstRun.current && fields.length === 0) {
      handleAddItem();

      isFirstRun.current = true;
    }
  }, [fields, handleAddItem]);


  //

  const sectionName = useWatch({
    control,
    name: `sectionItems[${index}].sectionName`
  });

  const itemsList = useWatch({
    control,
    name: `sectionItems[${index}].itemsList`
  });



  const allFieldsFilled =
    sectionName?.trim() !== "" &&
    itemsList.every(item => item.itemName.trim() !== "");

  useEffect(() => {
    if (!isFirstRun.current && fields.length === 0) {
      handleAddItem();
      isFirstRun.current = true;
    }
  }, [fields, handleAddItem]);


  //


  return (
    <>
      <div className="w-full flex flex-wrap justify-between gap-4">
        <div className="w-full lg:w-full space-y-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center  justify-between gap-3 font-bold">
              {/* <Label>Section {index + 1}</Label> */}
              <div>
                <Controller
                  control={control}
                  name={`sectionItems[${index}].sectionName`}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="section name"
                      size="lg"
                      {...field}
                      className=""
                      readOnly={
                        (quotaionsId && quotationData?.status === 'Draft') ? false :
                          (quotaionsId && quotationData?.status !== 'Draft') ? true :
                            (viewQuotationId) ? true :
                              false
                      }
                    />
                  )}
                />
                {errors?.sectionItems?.[index]?.sectionName && (
                  <span className="text-red-700 ml-2 font-normal">
                    {
                      errors.sectionItems?.[index]?.sectionName?.message
                    }
                  </span>
                )}

              </div>



              {viewQuotationId ? (
                <></>
              ) : (
                quotaionsId && quotationData?.status !== 'Draft' ? (
                  <></>
                ) : (
                  <>
                    {index === sectionlitsFields.length - 1 ? (
                      <>
                        <div className="flex justify-center items-center gap-2">
                          {index != 0 && (
                            <Button
                              className="border-default-300"
                              size="icon"
                              // variant=""
                              color="destructive"
                              type="button"
                              title="Remove"
                              onClick={() => handleRemoveSection(index)}
                            >
                              <Icon
                                icon="heroicons:trash"
                                className="w-5 h-5 text-default-300"
                              />
                            </Button>
                          )}
                          <Button
                            className="border-default-300"
                            size="icon"
                            // variant="outline"
                            type="button"
                            title="Add Item"
                            // disabled={!allFieldsFilled}
                            onClick={() => handleAddSection()}

                          >
                            <FiPlus className="w-5 h-5 text-default-300" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        className="border-default-300 mt-5"
                        size="icon"
                        // variant="outline"
                        color="destructive"
                        type="button"
                        title="Remove"
                        onClick={() => handleRemoveSection(index)}
                      >
                        <Icon
                          icon="heroicons:trash"
                          className="w-5 h-5 text-default-300"
                        />
                      </Button>
                    )}
                  </>
                )
              )}

            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 justify-between w-full">
              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col  justify-start gap-2 w-full">
                  <div className="flex flex-col gap-3">
                    {fields.map((item, itemIndex) => (
                      <div key={item.id} className="flex gap-1 w-1/2">
                        <div className="flex w-full flex-col">

                          <Controller
                            control={control}
                            name={`sectionItems[${index}].itemsList[${itemIndex}].itemName`}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Item name"
                                size="lg"
                                {...field}
                                className=""
                                readOnly={
                                  (quotaionsId && quotationData?.status === 'Draft') ? false :
                                    (quotaionsId && quotationData?.status !== 'Draft') ? true :
                                      (viewQuotationId) ? true :
                                        false
                                }
                              />
                            )}
                          />
                          {errors?.sectionItems?.[index]?.itemsList?.[itemIndex]
                            ?.itemName && (
                              <span className="text-red-700 ml-2">
                                {
                                  errors.sectionItems[index].itemsList[itemIndex]
                                    .itemName.message
                                }
                              </span>
                            )}

                        </div>



                        {viewQuotationId ? (
                          <></>
                        ) : (
                          quotaionsId && quotationData?.status !== 'Draft' ? (
                            <></>
                          ) : (
                            <>

                              {itemIndex === fields.length - 1 ? (
                                <>
                                  <div className="flex justify-center items-center gap-2">
                                    {itemIndex != 0 && (
                                      <Button
                                        className="shadow-md"
                                        size="icon"
                                        variant="outline"
                                        color="destructive"
                                        type="button"
                                        title="Remove"
                                        onClick={() =>
                                          handleRemoveItem(itemIndex)
                                        }
                                      >
                                        <Icon
                                          icon="heroicons:trash"
                                          className="w-5 h-5 "

                                        />
                                      </Button>
                                    )}
                                    <Button
                                      className="shadow-md"
                                      size="icon"
                                      variant="outline"
                                      color="default"
                                      type="button"
                                      title="Add Item"
                                      onClick={() => handleAddItem()}
                                    >
                                      <FiPlus className="w-5 h-5" />
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <Button

                                  className="shadow-md"
                                  size="icon"
                                  variant="outline"
                                  color="destructive"
                                  type="button"
                                  title="Remove"
                                  onClick={() => handleRemoveItem(itemIndex)}
                                >
                                  <Icon
                                    icon="heroicons:trash"
                                    className="w-5 h-5"
                                  />
                                </Button>
                              )}
                            </>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                  {/* <div className="flex">
                    <div className="flex flex-col gap-2 w-full">
                      <div>
                        <Controller
                          control={control}
                          name={`sectionItems[${index}].price`}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="total price"
                              size="lg"
                              {...field}
                              readOnly={
                                (quotaionsId && quotationData?.status === 'Draft') ? false :
                                  (quotaionsId && quotationData?.status !== 'Draft') ? true :
                                    (viewQuotationId) ? true :
                                      false
                              }
                              className="w-1/3"
                            />
                          )}
                        />
                        {errors?.sectionItems?.[index]?.price && (
                          <span className="text-red-700 ml-2">
                            {
                              errors.sectionItems?.[index]?.price?.message
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SectionAddItem;
