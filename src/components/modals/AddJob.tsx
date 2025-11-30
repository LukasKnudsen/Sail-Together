import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddJobForm from "@/components/forms/AddJobForm";

interface AddJobProps {
    open?: boolean;      
    onOpenChange?: (open: boolean) => void;
    hideTrigger?: boolean;
}

export default function AddJob({
    open,
    onOpenChange,
    hideTrigger = false,
}: AddJobProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const dialogOpen = isControlled ? open : internalOpen;

    function handleChange(next: boolean) {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={handleChange}>
            {!hideTrigger && (
                <DialogTrigger asChild>
                    <Button variant={"ghost"} size={"sm"}>Add Job</Button>
                </DialogTrigger>
            )}
            <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add a new job</DialogTitle>
                </DialogHeader>
                <AddJobForm
                    onSuccess={() => handleChange(false)}
                    onCancel={() => handleChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}