"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext, Controller, Control } from "react-hook-form";

export interface InputSystemProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  required?: boolean;
  control?: Control<any>;
  name: string;
  icon?: React.ReactNode;
}

export const ShortTextInput = React.forwardRef<HTMLInputElement, InputSystemProps>(
  ({ label, error: manualError, required, className, control, name, icon, ...props }, ref) => {
    const { formState } = useFormContext() || {};
    const error = manualError || (formState?.errors[name]?.message as string);

    const input = (
      <Input
        ref={ref}
        id={name}
        icon={icon}
        className={cn(
          "rounded-xl border-muted bg-background/50 focus-visible:ring-primary/20",
          error && "border-destructive focus-visible:ring-destructive/20",
          className
        )}
        {...props}
      />
    );

    return (
      <div className="grid w-full items-center gap-1.5">
        {label && (
          <Label htmlFor={name} className="text-muted-foreground font-medium text-xs uppercase tracking-wider ml-1">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        
        {control ? (
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <Input
                {...field}
                {...props}
                id={name}
                icon={icon}
                className={cn(
                  "rounded-xl border-muted bg-background/50 focus-visible:ring-primary/20",
                  error && "border-destructive focus-visible:ring-destructive/20",
                  className
                )}
              />
            )}
          />
        ) : (
          input
        )}
        
        {error && <span className="text-[10px] font-medium text-destructive ml-1">{error}</span>}
      </div>
    );
  }
);

ShortTextInput.displayName = "ShortTextInput";
