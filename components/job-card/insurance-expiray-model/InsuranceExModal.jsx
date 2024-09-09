import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

const InsuranceExModal = ({ onClose, handleAddCoomitSubmit }) => {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-4">
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-default-500  mt-3">
              Insurance is expired, would you like to continue ?
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              onClick={() => {
                handleAddCoomitSubmit();
              }}
            >
              Yes
            </Button>
            <Button
              variant="soft"
              color="destructive"
              onClick={() => {
                onClose();
              }}
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InsuranceExModal;
