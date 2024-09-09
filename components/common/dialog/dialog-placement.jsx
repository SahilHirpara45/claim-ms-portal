"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const DialogPlacement = ({ isOpen, onClose, onDelete, message }) => {
  return (
    <div className="flex flex-wrap  gap-x-5 gap-y-4 ">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-default-500  mt-3">
              {message}
              {/* Are you sure want to delete this employee.? */}
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button variant="soft" color="destructive">
                Close
              </Button>
            </DialogClose>
            <Button onClick={onDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogPlacement;
