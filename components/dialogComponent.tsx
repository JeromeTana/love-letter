"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogComponentProps = {
  children: React.ReactNode;
  header: React.ReactNode;
  triggerButton: React.ReactNode;
};

export default function DialogComponent({
  children,
  header,
  triggerButton,
}: DialogComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {header}
          <DialogTitle hidden />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
