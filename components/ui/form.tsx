"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"

const Form = FormProvider

const FormFieldContext = React.createContext<{ name: string } | null>(null)
const FormItemContext = React.createContext<{ id: string } | null>(null)

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>
) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField must be used within a FormField")
  }

  if (!itemContext) {
    throw new Error("useFormField must be used within a FormItem")
  }

  const fieldState = getFieldState(fieldContext.name, formState)
  const error = fieldState.error

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    error,
  }
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<"label">) {
  const { formItemId } = useFormField()

  return (
    <label
      htmlFor={formItemId}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

function FormControl({ children, ...props }: React.ComponentProps<"div">) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  const child = React.Children.only(children) as React.ReactElement<{
    id?: string
    "aria-describedby"?: string
    "aria-invalid"?: boolean
  }>

  return (
    <div data-slot="form-control" {...props}>
      {React.cloneElement(child, {
        id: formItemId,
        "aria-describedby": error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId,
        "aria-invalid": !!error,
      })}
    </div>
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error?.message ? String(error.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}