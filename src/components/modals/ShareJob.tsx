import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { JobWithRelations } from "@/features/jobs/api";
import { Link2, Mail } from "lucide-react";

interface ShareJobProps {
  job: JobWithRelations;
  shareOpen: boolean;
  setShareOpen: (open: boolean) => void;
}

export default function ShareJob({ job, shareOpen, setShareOpen }: ShareJobProps) {
  return (
    <Dialog open={shareOpen} onOpenChange={setShareOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-neutral-200 text-neutral-700 hover:bg-neutral-300">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Share job position</DialogTitle>
          <DialogDescription>Share this opportunity with others</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button
            size={"lg"}
            variant={"outline"}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <Link2 className="h-5 w-5 text-neutral-600" />
            Share via link
          </Button>
          <Button
            size={"lg"}
            variant={"outline"}
            onClick={() => {
              const subject = encodeURIComponent(`Job Opportunity: ${job.title}`);
              const body = encodeURIComponent(
                `Check out this job: ${job.title}\n\n${window.location.href}`
              );
              window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }}
          >
            <Mail className="h-5 w-5 text-neutral-600" />
            Share via Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
