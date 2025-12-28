import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { JobWithRelations } from "@/features/jobs/api";

interface ApplyJobProps {
  job: JobWithRelations;
  applyOpen: boolean;
  setApplyOpen: (open: boolean) => void;
}
export default function ApplyJob({ job, applyOpen, setApplyOpen }: ApplyJobProps) {
  return (
    <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-green-500 text-white hover:bg-green-600">Apply</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Apply for {job.title} position</DialogTitle>
          <DialogDescription>Fill out the form to apply for this role</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 [&>div]:grid [&>div]:gap-3">
          <div>
            <Label htmlFor="Full Name">Full Name</Label>
            <Input required type="text" placeholder="Johny" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input required type="email" placeholder="name@example.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+45"
              minLength={10}
              maxLength={16}
              pattern="^\+45 ?\d{2} ?\d{2} ?\d{2} ?\d{2}$"
              aria-label="Danish phone number, format: plus 45 space 8 digits"
            />
          </div>
          <div>
            <Label htmlFor="file">Resume</Label>
            <Input required type="file" accept=".pdf,.doc,.docx" className="min-h-20" />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            size={"lg"}
            className="w-full rounded-xl bg-green-500 text-white hover:bg-green-600"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
