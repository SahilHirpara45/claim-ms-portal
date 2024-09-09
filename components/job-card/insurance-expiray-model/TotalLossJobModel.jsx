import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";

const TotalLossJobModel = ({ onClose, handleTotalLossSubmit }) => {
    return (
        <div className="flex flex-wrap gap-x-5 gap-y-4">
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent>
                    <div className="flex flex-col items-center text-center">
                        <p className="text-sm text-default-500  mt-3">
                            Are you sure this job card is a total loss?
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            onClick={() => {
                                handleTotalLossSubmit();
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

export default TotalLossJobModel;
